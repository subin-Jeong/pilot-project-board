package com.estsoft.web;

import java.util.List;

import javax.persistence.Column;

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
@Transactional
public class BoardController {

	@Autowired
	private BoardRepository boardRepository;
	
	// 리스트 조회
	
	@GetMapping("/list")
	public String list() {
		return "/board/list";
	}
	
	@PostMapping("/getList")
	@ResponseBody 
	public List<Board> getList() {
	
		return boardRepository.findAllOrdering(); 
	}
	
	
	// 등록
	
	@GetMapping("/write")
	public String write() {
		return "/board/write";
	}
	
	@PostMapping("/save")
	@ResponseBody 
	public Board save(@RequestBody Board board) {
		
		Board saveBoard = boardRepository.save(board);
		
		// 생성된 bNo로 groupNo 설정
		saveBoard.setGroupNo(saveBoard.getNo());
		
		return boardRepository.save(saveBoard);
	}
	
	
	// 상세
	
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
	
	// 수정
	
	@GetMapping("/modify/{bNo}")
	public String modify(@PathVariable int bNo, Model model) {
		
		model.addAttribute("board", boardRepository.findOne(bNo));
		
		return "/board/modify";
	}
	
	@PutMapping("/update/{bNo}")
	@ResponseBody
	public Board update(@PathVariable int bNo, @RequestBody Board board) {
		
		Board updateBoard = boardRepository.findOne(bNo);
		board.setNo(bNo);
		
		// 수정 시 기존 사항 반영
		board.setGroupNo(updateBoard.getGroupNo());
		board.setGroupSeq(updateBoard.getGroupSeq());
		
		return boardRepository.save(board);
	}
	
	// 삭제
	
	@PutMapping("/delete/{bNo}")
	@ResponseBody
	public String delete(@PathVariable int bNo) {
		
		// 기존 데이터는 유지하되, delFlag = 'Y' 업데이트
		Board board = boardRepository.findOne(bNo);
		
		board.setDelFlag("Y");
		boardRepository.save(board);
		
		return "/board/list";
	}	
	
	// 답글 등록
	
	@GetMapping("/write/{bNo}")
	public String writeReply(@PathVariable int bNo, Model model) {
		
		// 답글의 답글인 경우
		// groupNo가 있는지 확인
		// groupNo = 0 : 원글
		int groupNo = boardRepository.findGroupNoBybNo(bNo);
		
		// 원글의 답글인 경우
		if(groupNo == 0) {
			groupNo = bNo;
		}
		
		model.addAttribute("groupNo", groupNo);
		model.addAttribute("parentNo", bNo);
		
		return "/board/reply";
	}
	
	@PostMapping("/saveReply")
	@ResponseBody 
	public Board saveReply(@RequestBody Board board) {
		
		// 원글 번호로 groupSeq, parentNo, depth 지정
		int groupNo = board.getGroupNo();
		int parentNo = board.getParentNo();
		
		// 원글의 답글인 경우
		if(parentNo == 0) {
			parentNo = groupNo;
		}
		
		// groupSeq : 원글 포함 전체 순서 지정
		// parentNo : 부모 글
		// depth : 원글로부터 몇번째 계층인지
		int depth = boardRepository.findDepthByParentNo(parentNo);
		int groupSeq = boardRepository.findMinGroupSeqByParentNoAndGroupNo(parentNo, groupNo);
		
		if(groupSeq > 0) {
			
			// 기존 groupSeq 를 뒤로 밀기
			boardRepository.updateGroupSeq(groupNo, groupSeq);
						
			board.setGroupSeq(groupSeq);
			
		} else {
			
			groupSeq = boardRepository.findMaxGroupSeqByGroupNo(groupNo);			
			board.setGroupSeq(groupSeq + 1);
		
		}
		
		board.setDepth(depth + 1);
		
		return boardRepository.save(board);
	}

}
