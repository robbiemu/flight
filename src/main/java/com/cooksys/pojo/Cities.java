package com.cooksys.pojo;

public enum Cities {
	
	ORLANDO("Orlando"), TALLAHASSEE("Tallahassee"), MIAMI("Miami"), JACKSONVILLE("Jacksonville");
	
	private String name;
	
	private Cities(String name)
	{
		this.name = name;
	}

	public String getName() {
		return name;
	}
	
}
