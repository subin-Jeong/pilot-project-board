package com.estsoft.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.estsoft.domain.Board;

public interface BoardRepository extends JpaRepository<Board, Integer> {
	
	// 삭제되지 않은 데이터만 사용
	String delCheck = "b.delFlag='N'";
	
	// findGroupNoBybNo
	@Query("SELECT groupNo FROM BOARD b WHERE " + delCheck +" AND b.no = :bNo")
	int findGroupNoBybNo(@Param("bNo") int bNo);
	
	// findMaxGroupSeqByGroupNo
	@Query("SELECT COALESCE(MAX(groupSeq), 0) FROM BOARD b WHERE " + delCheck + " AND b.groupNo = :groupNo")
	int findMaxGroupSeqByGroupNo(@Param("groupNo") int groupNo);
	
	// findDepthByParentNo
	@Query("SELECT COALESCE(depth, 0) FROM BOARD b WHERE " + delCheck + " AND b.no = :parentNo")
	int findDepthByParentNo(@Param("parentNo") int parentNo);
	
	// findAllOrdering
	@Query("SELECT b FROM BOARD b WHERE " + delCheck + " ORDER BY b.groupNo DESC, b.groupSeq ASC, b.depth ASC")
	List<Board> findAllOrdering();
	
	// findMinGroupSeqByParentNoAndGroupNo
	@Query("SELECT	COALESCE(MIN(groupSeq), 0) "
		   + "FROM 	BOARD b "
		  + "WHERE	" + delCheck + " "
		  	+ "AND	b.groupNo = :groupNo "
		  	+ "AND	b.groupSeq > (SELECT groupSeq FROM BOARD WHERE " + delCheck + " AND no = :parentNo) "
		  	+ "AND	b.depth <= (SELECT depth FROM BOARD WHERE " + delCheck + " AND no = :parentNo) ")
	int findMinGroupSeqByParentNoAndGroupNo(@Param("parentNo") int parentNo, @Param("groupNo") int groupNo);
	
	// updateGroupSeq
	@Modifying
	@Transactional
	@Query("UPDATE BOARD b SET b.groupSeq = b.groupSeq + 1 WHERE " + delCheck + " AND b.groupNo = :groupNo AND b.groupSeq >= :groupSeq")
	int updateGroupSeq(@Param("groupNo") int groupNo, @Param("groupSeq") int groupSeq);
	
	
} 
