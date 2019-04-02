package com.estsoft.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.data.domain.Sort.Order;
import org.springframework.stereotype.Service;

import com.estsoft.domain.Board;
import com.estsoft.repository.BoardRepository;

@Service
public class BoardServiceImpl implements BoardService {
	/*
	 * @Autowired BoardRepository boardRepository;
	 * 
	 * @Override public Page<Board> findAllPInteger curPage) { PageRequest pr = new
	 * PageRequest(curPage, 100, new Sort( new Order(Direction.DESC, "groupNo"), new
	 * Order(Direction.ASC, "groupSeq"), new Order(Direction.ASC, "depth") ));
	 * return boardRepository.findAll(pr); }
	 */
	
}
