package com.cooksys.pojo;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper=false)
public class Tuple<L, R> {
	L left;
	R right;
	
	public Tuple(L l, R r) {
		left = l;
		right = r;
	}
}
