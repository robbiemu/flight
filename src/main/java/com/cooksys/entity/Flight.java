package com.cooksys.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Entity
@Table(name="Flight")
@Data
@EqualsAndHashCode(callSuper=false)
public class Flight {
	@Id @GeneratedValue private long id;
	@Column private String origin;
	@Column private String destination;
	@Column private Long flightTime;
	@Column private Long offset;

	@JsonIgnore @ManyToOne private Itinerary iterary;
}
