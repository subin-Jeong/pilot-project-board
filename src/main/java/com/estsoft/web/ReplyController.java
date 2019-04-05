package com.estsoft.web;

import java.util.Date;
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
import com.estsoft.domain.Reply;
import com.estsoft.repository.ReplyRepository;

@Controller
@RequestMapping("/reply")
@Transactional
public class ReplyController {

	@Autowired
	private ReplyRepository replyRepository;
	
	//������������������������������������������������������������������������������
	// ����Ʈ ��ȸ
	//������������������������������������������������������������������������������
	
	@PostMapping("/getList/{bNo}")
	@ResponseBody 
	public List<Reply> getList(@PathVariable int bNo) {
	
		return replyRepository.findAllByBoardNoOrdering(bNo); 
	}
	
	//������������������������������������������������������������������������������
	// ���
	//������������������������������������������������������������������������������
	
	@PostMapping("/save")
	@ResponseBody 
	public Reply save(@RequestBody Reply reply) {
		
		// ������ڸ� ���÷� ����
		reply.setRegDate(new Date());
		
		// �Խñ� ����
		Reply saveReply = replyRepository.save(reply);
		
		// ������ rNo�� groupNo ����
		saveReply.setGroupNo(saveReply.getNo());
		
		return replyRepository.save(saveReply);
	}
	
	//������������������������������������������������������������������������������
	// ��� ���
	//������������������������������������������������������������������������������
	@PostMapping("/saveReply")
	@ResponseBody 
	public Reply saveReply(@RequestBody Reply reply) {
		
		System.out.println("==>>>" + reply.toString());
		
		int parentNo = reply.getParentNo();
		
		// ����� ����� ���
		// groupNo�� �ִ��� Ȯ��
		int groupNo = replyRepository.findGroupNoByrNo(parentNo);
		
		
		// ������ ����� ���
		if(parentNo == 0) {
			groupNo = parentNo;
		}
		
		// �ʿ� �Ķ����
		// groupSeq : ���� ���� ��ü ���� ����
		// parentNo : �θ� ��
		// depth : ���۷κ��� ���° ��������
		
		// �θ� ���� depth
		int preDepth = replyRepository.findDepthByParentNo(parentNo);
		
		// ���� �� �׷� ���� ������ groupSeq
		double maxGroupSeq = replyRepository.findMinGroupSeqByParentNoAndGroupNo(parentNo, groupNo);
		
		// ���� ���� groupSeq
		double preGroupSeq = replyRepository.findGroupSeqByGroupNoAndGroupSeq(groupNo, maxGroupSeq);
		
		// ���� ��� ���� ���� �ִ� ���
		if(maxGroupSeq > 0) {
		
			// groupSeqNew = ���� ���� groupSeq + ���� ���� groupSeq / 2
			// groupSeqNew �� �Ҽ��� �Ʒ� 15�ڸ� �̻��� ��� ���� groupSeq + 1 ��ü ������Ʈ
			double groupSeqNew = (preGroupSeq + maxGroupSeq) / 2;
			String groupSeqNewStr = groupSeqNew + "";
			
			System.out.println("parentNo : " + parentNo);
			System.out.println("preGroupSeq / maxGroupSeq : " + preGroupSeq + " / " + maxGroupSeq);
			System.out.println("double : " + groupSeqNew);
			System.out.println("String : " + groupSeqNewStr);
			
			// �Ҽ��� �ڸ��� Ȯ��
			int lenCheck = groupSeqNewStr.length() - groupSeqNewStr.indexOf(".") - 1;
			System.out.println("�Ҽ��� �ڸ��� : " + lenCheck);
			if(lenCheck <= 15) {
				
				reply.setGroupSeq(groupSeqNew);
				
			} else {
				
				// ���� groupSeq �� �ڷ� �б�
				replyRepository.updateGroupSeq(groupNo, maxGroupSeq);
							
				reply.setGroupSeq(maxGroupSeq);
				
			}
			
		} else {
			
			maxGroupSeq = replyRepository.findMaxGroupSeqByGroupNo(groupNo);			
			reply.setGroupSeq(maxGroupSeq + 1);
		
		}
		
		reply.setGroupNo(groupNo);
		reply.setDepth(preDepth + 1);
		
		// ������ڸ� ���÷� ����
		reply.setRegDate(new Date());
		
		return replyRepository.save(reply);
	}
	
	//������������������������������������������������������������������������������
	// ����
	//������������������������������������������������������������������������������
	@GetMapping("/modify/{rNo}")
	public String modify(@PathVariable int rNo, Model model) {
		
		model.addAttribute("reply", replyRepository.findOne(rNo));
		
		return "/reply/modify";
	}
	
	@PutMapping("/update/{rNo}")
	@ResponseBody
	public Reply update(@PathVariable int rNo, @RequestBody Reply reply) {
		
		Reply updateReply = replyRepository.findOne(rNo);
		reply.setNo(rNo);
		
		// ���� �� ���� ���� �ݿ�
		reply.setGroupNo(updateReply.getGroupNo());
		reply.setGroupSeq(updateReply.getGroupSeq());
		
		// �������ڸ� ���÷� ����
		reply.setModifyDate(new Date());
		
		return replyRepository.save(reply);
	}
	
	//������������������������������������������������������������������������������
	// ����
	//������������������������������������������������������������������������������
	@PutMapping("/delete/{rNo}")
	@ResponseBody
	public String delete(@PathVariable int rNo) {
		
		// ���� �����ʹ� �����ϵ�, delFlag = 'Y' ������Ʈ
		Reply reply = replyRepository.findOne(rNo);
		
		reply.setDelFlag("Y");
		replyRepository.save(reply);
		
		return "/board/detail/" + reply.getBoardNo();
	}	
	
	
	
}