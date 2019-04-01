package com.estsoft.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.estsoft.domain.Board;

public interface BoardRepository extends JpaRepository<Board, Integer> {
	
	// ´ä±Û
	@Query("SELECT COALESCE(max(groupSeq), 0) FROM BOARD b WHERE b.delFlag='N' AND b.groupNo = :groupNo")
	int findMaxGroupSeqByGroupNo(@Param("groupNo") int groupNo);
	
} 
