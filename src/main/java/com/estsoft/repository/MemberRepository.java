package com.estsoft.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.estsoft.domain.Member;

@RepositoryRestResource(path = "user")
public interface MemberRepository extends PagingAndSortingRepository<Member, Long> {

}
