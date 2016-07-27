package com.cooksys.entity;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name="User")
@Data
@EqualsAndHashCode(callSuper=false)
public class User {
	@Id @GeneratedValue private long id;
	
	@Column(unique=true, nullable=false) String username;
	@Column String password;
	
	@OneToMany List<Itinerary> itineraries;
}
