package com.estsoft.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.estsoft.domain.Board;
import com.estsoft.repository.BoardRepository;

@Controller
@RequestMapping("/board")
public class BoardController {

	@Autowired
	private BoardRepository boardRepository;
	
	//─────────────────────────────────────────
	// 리스트
	//─────────────────────────────────────────
	@GetMapping("/list")
	public String list() {
		return "/board/list";
	}
	
	@PostMapping("/getList")
	@ResponseBody 
	public List<Board> getList() {
		return boardRepository.findAll(); 
	}
	
	
	//─────────────────────────────────────────
	// 등록
	//─────────────────────────────────────────
	
	@GetMapping("/write")
	public String save() {
		return "/board/write";
	}
	
	@Transactional
	@PostMapping("/save")
	@ResponseBody 
	public Board save(@RequestBody Board board) {
		return boardRepository.save(board);
	}
	
	
	//─────────────────────────────────────────
	// 확인
	//─────────────────────────────────────────
	
	@GetMapping("/detail/{bNo}")
	public String detail(@PathVariable int bNo, Model model) {
		
		model.addAttribute("board", boardRepository.findOne(bNo));
		
		return "/board/detail";
	}
	
	@PostMapping("/getBoard/{bNo}")
	@ResponseBody
	public Board getBoard(@PathVariable int bNo) {
		return boardRepository.findOne(bNo);
	}
	
	//─────────────────────────────────────────
	// 수정
	//─────────────────────────────────────────
	
	@GetMapping("/modify/{bNo}")
	public String modify(@PathVariable int bNo, Model model) {
		
		model.addAttribute("board", boardRepository.findOne(bNo));
		
		return "/board/modify";
	}
	
	@PutMapping("/update/{bNo}")
	@ResponseBody
	public Board update(@PathVariable int bNo, @RequestBody Board board) {
		
		board.setId(bNo);
		
		return boardRepository.save(board);
	}
	
	//─────────────────────────────────────────
	// 삭제
	//─────────────────────────────────────────
	
	@PutMapping("/delete/{bNo}")
	@ResponseBody
	public String delete(@PathVariable int bNo) {
		boardRepository.delete(bNo);
		return "/board/list";
	}					
	
}
