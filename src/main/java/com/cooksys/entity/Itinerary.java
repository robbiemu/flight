package com.cooksys.entity;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name="Itinerary")
@Data
@EqualsAndHashCode(callSuper=false)
public class Itinerary {
	@Id @GeneratedValue private long id;
	@JsonIgnore @ManyToOne private User user;
	@OneToMany private List<Flight> flights;
}
