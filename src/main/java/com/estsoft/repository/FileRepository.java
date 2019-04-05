package com.estsoft.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.estsoft.domain.File;

public interface FileRepository extends JpaRepository<File, Integer> {

	List<File> findByBoardNo(int bNo);

} 
