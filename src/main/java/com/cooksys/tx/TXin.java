package com.cooksys.tx;

import java.util.Map;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
public class TXin {
	
	String type;
	Map<String, Object> settings;

}
