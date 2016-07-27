package com.cooksys.tx;

import java.util.HashMap;
import java.util.Map;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
public class TXbody {
	
	String type;
	Map<String, Object> settings;
	
	public TXbody() {
		this.settings = new HashMap<>();
	}
	public TXbody(String type) {
		this.type = type;
		this.settings = new HashMap<>();
	}

}
