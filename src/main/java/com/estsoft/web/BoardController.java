package com.estsoft.web;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.datatables.mapping.DataTablesInput;
import org.springframework.data.jpa.datatables.mapping.DataTablesOutput;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.estsoft.domain.Board;
import com.estsoft.repository.BoardRepository;
import com.fasterxml.jackson.annotation.JsonView;

@Controller
@RequestMapping("/board")
public class BoardController {

	@Autowired
	private BoardRepository boardRepository;
	
	// 게시글 목록
	@GetMapping("/test")
	public String test() {
		return "/board/test";
	}
	
	// 게시글 목록
	@GetMapping("/list")
	public String list() {
		return "/board/list";
	}
	
	
	@PostMapping("/getList_test")
	@ResponseBody 
	public Iterable<Board> list2() {
		return boardRepository.findAll(); 
	}
	 
	/*
	 * @PostMapping("/getList2")
	 * 
	 * @ResponseBody public DataTablesOutput<Board> list(@Valid DataTablesInput
	 * input) { System.out.println(boardRepository.findAll(input)); return
	 * boardRepository.findAll(input); }
	 * 
	 * @JsonView(DataTablesOutput.View.class)
	 * 
	 * @RequestMapping(value = "/getList_x", method = RequestMethod.POST) public
	 * DataTablesOutput<Board> getList(@Valid DataTablesInput input) {
	 * System.out.println(boardRepository.findAll().toString()); return
	 * boardRepository.findAll(input); }
	 * 
	 */
	  
	@PostMapping("/getList")
	@ResponseBody public List<Board> getList() {

		return boardRepository.findAll(); 
	}

	 
	
}
