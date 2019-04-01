package com.estsoft.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.estsoft.domain.Board;

public interface BoardRepository extends JpaRepository<Board, Integer> {} 
