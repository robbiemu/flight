package com.cooksys.pojo;

import java.util.ArrayList;
import java.util.List;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
public class Node {
	String name;
	List<Tuple<Node, Integer>> edges; // destination/child of vertex, flighttime+offset/weight
	
	public Node(){
		edges = new ArrayList<>();
	}
	
	public void addEdge(Tuple<Node, Integer> edge) {
		edges.add(edge);
	}

	public Boolean hasEdgeTo(Node u) {
		Boolean hasEdgeTo = false;
		for(Tuple<Node, Integer> edge: edges) {
			if( edge.getLeft().equals(u)){
				hasEdgeTo = true;
				break;
			}
		}
		return hasEdgeTo;
	}

	public Integer getDistanceTo(Node u) {
		for(Tuple<Node, Integer> edge: edges) {
			if( edge.getLeft().equals(u)){
				return edge.getRight();
			}
		}
		return null;
	}

	
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		Node other = (Node) obj;
		if (name == null) {
			if (other.name != null)
				return false;
		} else if (!name.equals(other.name))
			return false;
/*		if (vertices == null) {
			if (other.vertices != null)
				return false;
		} else if (!vertices.equals(other.vertices))
			return false; */
		return true;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((name == null) ? 0 : name.hashCode());
/*		result = prime * result + ((vertices == null) ? 0 : vertices.hashCode()); */
		return result;
	}

	@Override
	public String toString() {
		return "Node [name=" + name + "]";
	}
	
}
