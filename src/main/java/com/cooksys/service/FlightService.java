package com.cooksys.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collector;
import java.util.stream.Collectors;

import org.apache.commons.collections4.BidiMap;
import org.apache.commons.collections4.bidimap.DualHashBidiMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.cooksys.component.FlightGenerator;
import com.cooksys.pojo.Flight;
import com.cooksys.pojo.Node;
import com.cooksys.pojo.Tuple;
import com.cooksys.tx.TXbody;

import ch.qos.logback.core.net.SyslogOutputStream;
import lombok.Data;
import lombok.EqualsAndHashCode;

import static com.cooksys.Defs.*;

@Service
@Data
@EqualsAndHashCode(callSuper=false)
public class FlightService {

	@Autowired
	FlightGenerator generator;

	private ArrayList<Flight> flightList = new ArrayList<>();
	private LinkedList<Node> graph = new LinkedList<>();
	
	//The fixedDelay parameter determines how often a new day is generated as expressed in milliseconds
	@Scheduled(fixedDelay=FLIGHT_GENERATION_DELAY)
	private void refreshFlights()
	{
		Tuple<LinkedList<Node>, ArrayList<Flight>> results = generator.generateNewFlightList();
		flightList = results.getRight();
		graph = results.getLeft();
	}

	/**
	 * finds the shortest available path in the current flights, with non-zero layover
	 * 
	 * txin specification:
	 * 	type: processRoute
	 * 	settings:
	 * 		from, location
	 *  	to, location
	 */
	@SuppressWarnings("unchecked")
	public ArrayList<Flight> processRoute(TXbody txin) {
		String origin = (String) txin.getSettings().get(TX_PROCESSROUTE_ORIGIN);
		String destination = (String) txin.getSettings().get(TX_PROCESSROUTE_DESTINATION);
		
		/** allow the user to supply the flight list, for texting at least */
		if(txin.getSettings().get(TX_PROCESSROUTE_FLIGHTS) != null) {
			@SuppressWarnings({ "unchecked", "rawtypes" })			
			List<LinkedHashMap> llhm = (ArrayList<LinkedHashMap>) txin.getSettings().get(TX_PROCESSROUTE_FLIGHTS);
			flightList.clear();
			for(LinkedHashMap<String, Object> lhm: llhm) {
				Flight f = new Flight((String) lhm.get("origin"), (String) lhm.get("destination"), 
						1L * (Integer) lhm.get("flightTime"), 1L * (Integer) lhm.get("offset"));
				System.out.println(f);
				flightList.add(f);
			}

			System.out.println("using provided flightlist");
			for(Flight f: (List<Flight>) flightList) {
				System.out.println(f);
			}

			graph = FlightGenerator.graph(flightList);
		}
		
		/** begin ~140 lines of mind-numbing code */
		
		System.out.println("origin: " + origin + " , destination: " + destination );
		
		@SuppressWarnings("unchecked")
		List<Node> vertices = (List<Node>) graph.clone();	
		
		Node ns = new Node();
		ns.setName(origin);
		if(graph.contains(ns)){
			ns = graph.get(graph.indexOf(ns));
		} else {
			return new ArrayList<>();
			// throw "No flights from source"
		}
		
		Node nd = new Node();
		nd.setName(destination);
		if(graph.contains(nd)){
			nd = graph.get(graph.indexOf(nd));
		} else {
			return new ArrayList<>();
			// throw "No flights to destination"
		}
	
		Map<Node, Long> distance = new HashMap<>();
		List<List<Object>> p2 = new ArrayList<>();
		
		for(Node n: graph) {
			distance.put(n, Long.MAX_VALUE);
		}
		
		/** for each city, consider all out-bound flights **/
		distance.put(ns, 0L);
		Node u = null;
		do {
			Entry<Node, Long> min = null;
			for (Entry<Node, Long> entry : distance.entrySet()) {
				// if the node is still in the list of unprocessed vertices,
				// and it is a node stemming from the origin node in our search
				// and it is the cheapest node in the list.. probably not necessary but..
			    if (
			    		vertices.contains(entry.getKey()) && 
			    		(distance.get(entry.getKey()) != Long.MAX_VALUE) && 
			    		(min == null || min.getValue() > entry.getValue())) {
			        min = entry;
			    }
			}
			if(min == null) {
				break;
			}
			u = min.getKey();
			
			vertices.remove(u);
			
			for (Flight edge: u.getEdges()) {
				System.out.println("-- considering flight " + edge + " from city " + u.getName());
				
				Long alt = edge.getOffset() + edge.getFlightTime();

				Node neighbor = null;
				for(Entry<Node, Long> e : distance.entrySet()) {
					if(e.getKey().getName().equals(edge.getDestination())) {
						neighbor = e.getKey();
						break;
					}
				}
				
				Node o = null;
				for(Entry<Node, Long> e : distance.entrySet()) {
					if(e.getKey().getName().equals(edge.getOrigin())) {
						o = e.getKey();
						break;
					}
				}
				
				if(alt < distance.get(neighbor)) {
					if ((distance.get(o)==Long.MAX_VALUE? 0:distance.get(o)) < edge.getOffset()){
//						System.out.println("Using ["+alt+":"+(distance.get(neighbor)==Long.MAX_VALUE? 0:distance.get(neighbor))+", "+
//								edge.getOffset()+":"+distance.get(o)+
//								"] shortening distance weight for " + neighbor);				
						distance.put(neighbor, alt);
//						System.out.println("[distances] " + distance);
						
						Node n = neighbor;
						List<Object> lo = p2.stream().filter((x) -> ((Node) x.get(1)).equals(n)).collect(Collectors.toList());
						if (lo == null || lo.isEmpty()) {
							lo = new ArrayList<>();
							lo.add(u); lo.add(neighbor); lo.add(edge);
							System.out.println("adding new pathing entry for " + lo);
							p2.add(lo);							
						} else {
							System.out.println("updating pathing entry for " + lo);
							lo = (List<Object>) lo.get(0);
							p2.remove(lo);
							lo.set(0, u);
							lo.set(2, edge);
							
							//System.out.println("updating pathing entry for " + lo);
							p2.add(lo);
						}
					} else {
						//System.out.println("Ignoring ["+edge.getOffset()+":"+(distance.get(o)==Long.MAX_VALUE? 0:distance.get(o))+"] leaves too early to " + neighbor.getName());						
					}
				} else {
					//System.out.println("Ignoring ["+alt+":"+distance.get(neighbor)+"] found a less cheap path to " + neighbor.getName());
				}
			}
			
		} while(!vertices.isEmpty());
		
		final Node s1 = nd;
		boolean dest = p2.stream().filter((x) -> ((Node) x.get(1)).equals(s1)).collect(Collectors.toList()).isEmpty();
		if(dest){
			System.out.println("missing "+nd.getName()+" (destination) from considered flights: " + p2);
			return new ArrayList<>();
		}
		final Node s2 = ns;
		boolean orig = p2.stream().filter((x) -> ((Node) x.get(0)).equals(s2)).collect(Collectors.toList()).isEmpty();
		if (orig) {
			System.out.println("missing "+ns.getName()+" (origin) from considered flights");
			return new ArrayList<>();
		}

		ArrayList<Flight> path = new ArrayList<>();
		
		u = nd;
		do {
			final Node v = u;
			List<Object> lo = p2.stream().filter((x) -> ((Node) x.get(1)).equals(v)).collect(Collectors.toList());
			if (lo == null || lo.isEmpty()) {
				// no path to destination
				return new ArrayList<>();
			} else {
				lo = (List<Object>) lo.get(0);
			}
			
			path.add((Flight)lo.get(2));
			
			if(((Node) lo.get(0)).equals(ns)) {
				break;
			}
			u = (Node) lo.get(0);
			p2.remove(lo);
		} while(!p2.isEmpty());
		Collections.reverse(path);

		System.out.print("path: " + path);

		return path;
	}
	
}
