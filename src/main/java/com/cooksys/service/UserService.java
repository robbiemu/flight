package com.cooksys.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cooksys.entity.Itinerary;
import com.cooksys.entity.User;
import com.cooksys.repository.ItineraryRepository;
import com.cooksys.repository.UserRepository;
import com.cooksys.tx.TXbody;

@Service
public class UserService {
	@Autowired
	UserRepository ur;

	@Autowired
	ItineraryRepository ir;


	public TXbody processLogin(TXbody user) {
		TXbody txr = new TXbody("Login");

		LinkedHashMap lhmu = (LinkedHashMap) user.getSettings().get("user");

		User u = ur.findOneByUsernameAndPassword((String) lhmu.get("username"), (String) lhmu.get("password"));
		if (ur.findOneByUsername((String) lhmu.get("username")) == null) {
			Map<String, Object> settings =  txr.getSettings();
			settings.put("status", "Error");
			settings.put("message", "failed to find a user with the username " + (String) lhmu.get("username"));
			txr.setSettings(settings);
			return txr;
		}
		if(u == null) {
			Map<String, Object> settings =  txr.getSettings();
			settings.put("status", "Error");
			settings.put("message", "username and password incorrect. u: " + (String) lhmu.get("username") + 
					" , p: " + (String) lhmu.get("password"));
			txr.setSettings(settings);
			return txr;			
		}

		Map<String, Object> settings =  txr.getSettings();
		settings.put("status", "Success");
		settings.put("user", u);
		txr.setSettings(settings);

		return txr;
	}

	public TXbody createUser(TXbody user) {
		TXbody txr = new TXbody("Register");

		LinkedHashMap lhmu = (LinkedHashMap) user.getSettings().get("user");

		if (ur.findOneByUsername((String) lhmu.get("username")) != null) {
			Map<String, Object> settings =  txr.getSettings();
			settings.put("status", "Error");
			settings.put("message", "found a user with the username " + (String) lhmu.get("username"));
			txr.setSettings(settings);
			return txr;
		}
		if((String) lhmu.get("password") == null) {
			Map<String, Object> settings =  txr.getSettings();
			settings.put("status", "Error");
			settings.put("message", "password incorrect, was: " + (String) lhmu.get("password"));
			txr.setSettings(settings);
			return txr;			
		}
		
		User u = new User();
		u.setUsername((String) lhmu.get("username"));
		u.setPassword((String) lhmu.get("password"));
		
		try {
			u = ur.save(u);
		} catch(Exception e) {
			Map<String, Object> settings =  txr.getSettings();
			settings.put("status", "Error");
			settings.put("message", "[" + e.getClass().getSimpleName() + "] " + e.getMessage());
			txr.setSettings(settings);
			return txr;						
		}
		
		Map<String, Object> settings =  txr.getSettings();
		settings.put("status", "Success");
		settings.put("user", u);
		txr.setSettings(settings);

		return txr;
	}

	public TXbody getItinerariesByUser(TXbody user) {
		TXbody txr = new TXbody("Itineraries");

		LinkedHashMap lhmu = (LinkedHashMap) user.getSettings().get("user");

		if (ur.findOneByUsername((String) lhmu.get("username")) == null) {
			Map<String, Object> settings =  txr.getSettings();
			settings.put("status", "Error");
			settings.put("message", "failed to find a user with the username " + (String) lhmu.get("username"));
			txr.setSettings(settings);
			return txr;
		}
		User u = ur.findOneByUsernameAndPassword((String) lhmu.get("username"), (String) lhmu.get("password"));
		if(u == null) {
			Map<String, Object> settings =  txr.getSettings();
			settings.put("status", "Error");
			settings.put("message", "username and password incorrect. u: " + (String) lhmu.get("username") + 
					" , p: " + (String) lhmu.get("password"));
			txr.setSettings(settings);
			return txr;			
		}

		List<Itinerary> li = null;
		try {
			li = ir.findByUser(u);
		} catch(Exception e) {
			Map<String, Object> settings =  txr.getSettings();
			settings.put("status", "Error");
			settings.put("message", "[" + e.getClass().getSimpleName() + "] " + e.getMessage());
			txr.setSettings(settings);
			return txr;						
		}
		
		Map<String, Object> settings =  txr.getSettings();
		settings.put("status", "Success");
		settings.put("itineraries", li);
		txr.setSettings(settings);
		
		return txr;
	}

}
