package com.estsoft.domain;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity(name = "MEMBER")
public class Member {
	
	@Id
	@GeneratedValue
	Long id;
	String name;
	String username;
	String remark;
	
	
	public Member() {}
	public Member(String name, String username, String remark) {
		this.name = name;
		this.username = username;
		this.remark = remark;
	}
}
