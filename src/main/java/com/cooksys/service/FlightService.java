package com.cooksys.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
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
import com.cooksys.tx.TXin;

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
	@Scheduled(fixedDelay=5000)
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
	public ArrayList<Flight> processRoute(TXin txin) {
		String origin = (String) txin.getSettings().get(TX_PROCESSROUTE_ORIGIN);
		String destination = (String) txin.getSettings().get(TX_PROCESSROUTE_DESTINATION);
		
		System.out.println("origin: " + origin + " , destination: " + destination );
		
		@SuppressWarnings("unchecked")
		List<Node> vertices = (List<Node>) graph.clone();	

		System.out.println(graph);

		
		Map<Node, Integer> distance = new HashMap<>();
		BidiMap<Node, Node> previous = new DualHashBidiMap<>();
		
		for(Node n: graph) {
			distance.put(n, -1);
		}
		
		Node ns = new Node();
		ns.setName(origin);
		if(graph.contains(ns)){
			ns = graph.get(graph.indexOf(ns));
		} else {
			// throw "No flights from source"
		}
		
		distance.put(ns, 0);

		Node u = ns;
		vertices.remove(u);
		do {
			System.out.println("considering segment from " + u.getName());

			Node comparable = u;
			u = vertices.stream()
				.filter((x) -> { 
					System.out.println("filtering all vertices that have path to " + comparable.getName());
					return x.hasEdgeTo(comparable);
				})
				.min((l,r) -> {
					System.out.println("finding shortest path: comparing distance from " + l.getName() + " vs " + r.getName());
					return Integer.compare(l.getDistanceTo(comparable), r.getDistanceTo(comparable));
				})
				.get();
			vertices.remove(u);
			
			System.out.println("soonest flight from a city to " + comparable.getName() + " is " + u.getName() );
			System.out.println("adjusting weights for flights from " + u.getName());
			
			for (Tuple<Node, Integer> edge: u.getEdges()) {
				System.out.print('.');
				
				Integer alt = distance.get(u);
				if (alt == -1) { 
					alt = 0;
				}
				alt += edge.getRight();
				Node neighbor = edge.getLeft();
				if(alt < distance.get(neighbor) || distance.get(neighbor) == -1) {
					distance.put(neighbor, alt);
					previous.put(neighbor, u);
				}
			}
			
		} while((!vertices.isEmpty()) || destination.equals(u));

		List<Node> path = new ArrayList<>();
		
		Node nd = new Node();
		nd.setName(destination);
		if(graph.contains(nd)){
			nd = graph.get(graph.indexOf(nd));
		} else {
			// throw "No flights to destination"
		}
		
		u = nd;
		while(previous.containsKey(u) || previous.containsValue(u)) {
			path.add(u);
			if(u.equals(ns)) {
				break;
			}
			u = previous.getKey(u);
		}
		
		System.out.println("solution!");
		System.out.println(path);
			
		return null;
	}
	
}
