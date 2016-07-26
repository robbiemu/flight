package com.cooksys.component;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.stereotype.Component;

import com.cooksys.pojo.Cities;
import com.cooksys.pojo.Flight;
import com.cooksys.pojo.Node;
import com.cooksys.pojo.Tuple;

import static com.cooksys.Defs.*;

@Component
public class FlightGenerator {

	public Tuple<LinkedList<Node>, ArrayList<Flight>> generateNewFlightList() {
		
		LinkedList<Node> graph = new LinkedList<>();
		ArrayList<Flight> flights = new ArrayList<>();

		for (int i = 0; i < MAX_FLIGHTS_IN_SCHEDULE; i++) {

			int originIndex = ThreadLocalRandom.current().nextInt(0, 4);

			int destinationIndex = ThreadLocalRandom.current().nextInt(0, 4);

			while (destinationIndex == originIndex)
				destinationIndex = ThreadLocalRandom.current().nextInt(0, 4);

			String origin = Cities.values()[originIndex].getName();
			String destination = Cities.values()[destinationIndex].getName();
			int flightTime = ThreadLocalRandom.current().nextInt(1, 4);
			int offset = ThreadLocalRandom.current().nextInt(0, 10);

			Flight f = new Flight(origin, destination, flightTime, offset);

			flights.add(f);
			
			Node no = new Node();
			no.setName(origin);
			if (graph.contains(no)) {
				no = graph.get(graph.indexOf(no));
			}
			Node nd = new Node();
			nd.setName(destination);
			if (graph.contains(nd)) {
				nd = graph.get(graph.indexOf(nd));
			}
			System.out.println(f + " for origin city: " + no.getName());
			no.addEdge(f);
			if (graph.contains(no)) {
				graph.set(graph.indexOf(no), no);
			} else {
				graph.add(no);
			}
			if (graph.contains(nd)) {
				graph.set(graph.indexOf(nd), nd);
			} else {
				graph.add(nd);
			}
		}
		
//		System.out.println("flights: " + flights);
		System.out.println("graph: " + graph);
		
		return new Tuple<LinkedList<Node>, ArrayList<Flight>>(graph, flights);
	}

	public static LinkedList<Node> graph(ArrayList<Flight> flightList) {
		LinkedList<Node> graph = new LinkedList<>();

		for(Flight f: flightList) {
			Node no = new Node();
			no.setName(f.getOrigin());
			if (graph.contains(no)) {
				no = graph.get(graph.indexOf(no));
			}
			Node nd = new Node();
			nd.setName(f.getDestination());
			if (graph.contains(nd)) {
				nd = graph.get(graph.indexOf(nd));
			}
			System.out.println("adding flight " + f + " for origin city: " + no.getName());
			no.addEdge(f);
			if (graph.contains(no)) {
				graph.set(graph.indexOf(no), no);
			} else {
				graph.add(no);
			}
			if (graph.contains(nd)) {
				graph.set(graph.indexOf(nd), nd);
			} else {
				graph.add(nd);
			}

		}
		return graph;
	}

}
