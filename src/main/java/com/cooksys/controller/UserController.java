package com.cooksys.controller;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.cooksys.pojo.Flight;
import com.cooksys.service.UserService;
import com.cooksys.tx.TXbody;

@RestController
@CrossOrigin(methods = RequestMethod.POST)
@RequestMapping("user")
public class UserController {
	@Autowired
	UserService us; 
	
	@RequestMapping(value="login", method=RequestMethod.POST)
	public TXbody processLogin(@RequestBody TXbody user) {
		return us.processLogin(user);
	}
	@RequestMapping(value="register", method=RequestMethod.POST)
	public TXbody postUser(@RequestBody TXbody user) {
		return us.createUser(user);
	}
	@RequestMapping(value="itineraries", method=RequestMethod.POST)
	public TXbody getItinerariesByUser(@RequestBody TXbody user) {
		return us.getItinerariesByUser(user);
	}
}
