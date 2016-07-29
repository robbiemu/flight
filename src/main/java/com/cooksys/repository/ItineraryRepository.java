package com.cooksys.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.cooksys.entity.Itinerary;
import com.cooksys.entity.User;

@Repository
public interface ItineraryRepository extends JpaRepository<Itinerary, Long> {
	List<Itinerary> findByUserOrderByIdDesc(User u); 
}
