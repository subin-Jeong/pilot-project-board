// 리스트
$(document).ready(function() {
	
	$("#boardList").DataTable({
		
	
	    "columnDefs": [{
	        "defaultContent": "-",
	        "targets": "_all"
	      }],
	      
		"language": {
			"emptyTable": "데이터가 없습니다.",
			"lengthMenu": "페이지당 _MENU_ 개씩 보기",
			"info": "현재 _START_ - _END_ / _TOTAL_건",
			"infoEmpty": "-",
			"infoFiltered": "( _MAX_건의 데이터에서 필터링됨 )",
			"search": "검색 : ",
			"zeroRecords": "일치하는 데이터가 없습니다.",
			"loadingRecords": "로딩중...",
			"processing": "잠시만 기다려 주세요...",
			"next": "다음",
			"previous": "이전"
		},
	
		pageLength: 100,
		bPaginate: true,
		responsive: true,
		processing: true,
		ordering: false,
		ServerSide: true,
		searching: true,
		//aaSorting: [ [ 0, "desc"] ],
		sAjaxSource : "/board/getList",
        sServerMethod: "POST",
		sAjaxDataProp: "",
		columns: [
			{ data: "no"},
			{ data: "title",
				
				"render": function(data, type, row){
				
			        if(type=="display"){
			            titleHTML = "<a href=\"/board/detail/"+  row["no"] +"\" style=\"text-decoration:none; color:#858796;\"><b>";
			            
			            // parentNo 만큼 들여쓰기
			            var loopNum = row["depth"];
			            if(loopNum > 10) {
			            	//loopNum /= 
			            }
			            for(i=0; i<loopNum; i++) {
			            	titleHTML+= "&nbsp&nbsp";
			            }
			            
			            // 답글의 경우 화살표 아이콘
			            if(row["depth"] > 0) {
			            	titleHTML+= "<img src=\"/img/icon-forward.png\" width=12 height=12>&nbspRE:&nbsp";
			            }
			            
			            titleHTML+= data;
			            titleHTML+= "</b></a>";
			        }
			        return titleHTML;
			    }
			
			},
			{ data: "regDate",
				 
				 "render": function(data, type){
					 	
					 if(data != null) {
						 date = new Date(data);
						 return date.getFullYear() + "." + zeroPad(date.getMonth()+1, 2) + "." + zeroPad(date.getDate(), 2);
					 } else {
						 return "";
					 }
				        
				 }
			},
			{ data: "depth" },
			{ data: "groupNo" },
			{ data: "groupSeq" }]
	
	});

	// 등록
	$("#btn-save").on("click", function () {
		
		var data = {
			title: $("#title").val(),
		    content: $("#contents").val(),
		    delFlag: "N",
		    modifyDate: $("#modify_date").val(),
		    regDate: $("#reg_date").val(),
		    writer: "test",
		    groupNo: ($("#group_no").val()) ? $("#group_no").val() : 0,
			groupSeq: ($("#group_seq").val()) ? $("#group_seq").val() : 0,
			parentNo: ($("#parent_no").val()) ? $("#parent_no").val() : 0,
			depth: ($("#depth").val()) ? $("#depth").val() : 0
		};
		
		// 답글의 경우 url 변경
		var url = ($("#group_no").val()) ? "/board/saveReply" : "/board/save";
		
	    $.ajax({
	        type: "POST",
	        url: url,
	        dataType: "json",
	        contentType: "application/json; charset=utf-8",
	        data: JSON.stringify(data),
	        success:function(result){   
	        	
	        	// 첨부파일
	    		// 1. Ctrl + V 한 이미지 파일
	        	
	        	var uploadData = {};
	        	
	    		// 연관 글번호
	    		uploadData["boardNo"] = result["no"];
	    		
	    		imgCnt = 0;
	    		$("#uploadFiles").find("img").each( function() {
	    			
	    			imgCnt++;
	    			uploadData["url" + imgCnt] = $(this).attr("src");
	    	    });
	    		
	    		
	    		// 첨부파일이 있는 경우
	    		if(Object.keys(uploadData).length > 1) {
	    			
	    			$.ajax({
	    		        type: "POST",
	    		        url: "/board/upload",
	    		        dataType: "json",
	    		        contentType: "application/json; charset=utf-8",
	    		        data: JSON.stringify(uploadData),
	    		        success:function(args){   
	    		        	alert("첨부파일이 등록되었습니다.");
	    		        }, 
	    		        error:function(e){  
	    		            alert("첨부파일 등록에 실패했습니다.");  
	    		            return;
	    		        } 
	    		
	    		    });
	    			
	    		}
	        	
	        	
	        	alert("등록되었습니다.");
		        location.href = "/board/list";   
	        	
	        }, 
	        error:function(e){  
	            alert(e.responseText);  
	        } 
	
	    });
		    
	});
	
	// 수정
	$("#btn-mod").on("click", function () {
		
		var bNo = $("#no").val();
		
		var data = {
		    title: $("#title").val(),
		    content: $("#contents").val(),
		    delFlag: "N",
		    modifyDate: $("#modify_date").val(),
		    regDate: $("#reg_date").val(),
		    writer: "test"
		};
		
	    $.ajax({
	        type: "PUT",
	        url: "/board/update/" + bNo,
	        dataType: "json",
	        contentType: "application/json; charset=utf-8",
	        data: JSON.stringify(data),
	        success:function(args){   
	        	
	        	alert("수정되었습니다.")
		        location.href = "/board/detail/" + $("#no").val();   
	        	
	        }, 
	        error:function(e){  
	            alert(e.responseText);  
	        } 
	
	    });
		    
	});
	
	// 삭제
	$("#btn-del").on("click", function () {
		
		var bNo = $("#no").val();
		
	    $.ajax({
	        type: "PUT",
	        url: "/board/delete/" + bNo,
	        success:function(args){   
	        	
	        	alert("삭제되었습니다.")
		        location.href = "/board/list";   
	        	
	        }, 
	        error:function(e){  
	            alert(e.responseText);  
	        } 
	
	    });
		    
	});
	
	
	// 취소
	$("#btn-exit").on("click", function () {
		history.go(-1);
	});
	
	// 글자 수 제한
	$("#contents").on("keyup", function() {
	    if($(this).val().length > 200) {
	    	alert("글자수는 200자로 제한됩니다.");
	        $(this).val($(this).val().substring(0, 200));
	    }
	});
	
	// 첨부파일 리스트
	$("#fileList").DataTable({
		
	    "columnDefs": [{
	        "defaultContent": "-",
	        "targets": "_all"
	      }],
	      
		"language": {
			"emptyTable": "데이터가 없습니다.",
			"lengthMenu": "페이지당 _MENU_ 개씩 보기",
			"info": "",
			"infoEmpty": "-",
			"infoFiltered": "( _MAX_건의 데이터에서 필터링됨 )",
			"search": "검색 : ",
			"zeroRecords": "일치하는 데이터가 없습니다.",
			"loadingRecords": "로딩중...",
			"processing": " 잠시만 기다려 주세요... ",
			"next": "다음",
			"previous": "이전"
		},
		bPaginate: false,
		responsive: false,
		processing: false,
		ordering: false,
		ServerSide: false,
		searching: false,
		sAjaxSource : "/board/getFile/" + $("#no").val(),
        sServerMethod: "POST",
		sAjaxDataProp: "",
		columns: [
			{ data: "filename",
				
				"render": function(data, type, row){
				
			        if(type=="display"){
			            viewImgHTML = "<img src=\"/upload/" + data + "\">";
			        }
			        return viewImgHTML;
			    }
			
			},
			{ data: "filename" },
			{ data: "regDate",
				 
				 "render": function(data, type){
					 	
					 if(data != null) {
						 date = new Date(data);
						 return date.getFullYear() + "." + zeroPad(date.getMonth()+1, 2) + "." + zeroPad(date.getDate(), 2);
					 } else {
						 return "";
					 }
				        
				 }
			}]
	
	});

	
	// 댓글등록
	$("#btn-reply-save").on("click", function () {
		
		var bNo = $("#no").val();
		var data = {
			boardNo: bNo,
		    content: $("#contents").val(),
		    delFlag: "N",
		    writer: "test",
		    groupNo: ($("#group_no").val()) ? $("#group_no").val() : 0,
			groupSeq: ($("#group_seq").val()) ? $("#group_seq").val() : 0,
			parentNo: ($("#parent_no").val()) ? $("#parent_no").val() : 0,
			depth: ($("#depth").val()) ? $("#depth").val() : 0
		};
		
		
	    $.ajax({
	        type: "POST",
	        url: "/reply/save",
	        dataType: "json",
	        contentType: "application/json; charset=utf-8",
	        data: JSON.stringify(data),
	        success:function(result){   
	        	
	        	alert("등록되었습니다.");
		        location.href = "/board/detail/" + bNo;   
	        	
	        }, 
	        error:function(e){  
	            alert(e.responseText);  
	        } 
	
	    });
		    
	});
	
	
	// 댓글 리스트
	$("#replyList").DataTable({
		
	    "columnDefs": [{
	        "defaultContent": "-",
	        "targets": "_all"
	      }],
	      
		"language": {
			"emptyTable": "데이터가 없습니다.",
			"lengthMenu": "페이지당 _MENU_ 개씩 보기",
			"info": "현재 _START_ - _END_ / _TOTAL_건",
			"infoEmpty": "-",
			"infoFiltered": "( _MAX_건의 데이터에서 필터링됨 )",
			"search": "검색 : ",
			"zeroRecords": "일치하는 데이터가 없습니다.",
			"loadingRecords": "로딩중...",
			"processing": "잠시만 기다려 주세요...",
			"next": "다음",
			"previous": "이전"
		},
	
		pageLength: 100,
		bPaginate: false,
		responsive: true,
		processing: true,
		ordering: false,
		ServerSide: true,
		searching: false,
		//aaSorting: [ [ 0, "desc"] ],
		sAjaxSource : "/reply/getList/" + $("#no").val(),
        sServerMethod: "POST",
		sAjaxDataProp: "",
		columns: [
			{ data: "content",
			
				"render": function(data, type, row){
					
			        if(type=="display"){
			            titleHTML = "<b>";
			            
			            // parentNo 만큼 들여쓰기
			            var loopNum = row["depth"];
			            if(loopNum > 10) {
			            	//loopNum /= 
			            }
			            for(i=0; i<loopNum; i++) {
			            	titleHTML+= "&nbsp&nbsp";
			            }
			            
			            // 답글의 경우 화살표 아이콘
			            if(row["depth"] > 0) {
			            	titleHTML+= "<img src=\"/img/icon-forward.png\" width=12 height=12>&nbsp&nbsp";
			            }
			            
			            titleHTML+= data;
			            titleHTML+= "</b></a>";
			        }
			        return titleHTML;
				}  
			},
			{ data: "regDate",
				 
				 "render": function(data, type){
					 	
					 if(data != null) {
						 
						 date = new Date(data);
						 dateStr = date.getFullYear() + "." + zeroPad(date.getMonth()+1, 2) + "." + zeroPad(date.getDate(), 2) + " ";
						 dateStr+= zeroPad(date.getHours(), 2) + ":" + zeroPad(date.getMinutes(), 2) + ":" + zeroPad(date.getSeconds(), 2);
						 
						 return dateStr;
					 } else {
						 return "";
					 }
				        
				 }
			},
			{ data: "writer" },
			{ data : "no",
				 
				 "render": function(data, type){
					 
					 btnStr = "<a href=\"#\" onclick=\"setReplyNo('" + data + "')\" class=\"btn btn-success btn-icon-split\" data-toggle=\"modal\" data-target=\"#replyModal\">";
					 btnStr+= "<span class=\"text\">답글</span>";
					 btnStr+= "</a> ";
					 btnStr+= "<a href=\"#\" onclick=\"setReplyNo('" + data + "');setUpdateBtn();\" class=\"btn btn-warning btn-icon-split\" data-toggle=\"modal\" data-target=\"#replyModifyModal\">";
					 btnStr+= "<span class=\"text\">수정</span>";
					 btnStr+= "</a> ";
					 btnStr+= "<a href=\"#\" onclick=\"deleteReply('" + data + "')\" class=\"btn btn-danger btn-icon-split\">";
					 btnStr+= "<span class=\"text\">삭제</span>";
					 btnStr+= "</a>";
					 
					 return btnStr;
				 }
			
			}]
	
	});
	
	// 댓글의 답글 등록
	$("#btn-reply-reply-save").on("click", function () {
		
		var bNo = $("#no").val();
		var rNo = $("#reply_no").val();
		
		var data = {
			boardNo: bNo,
		    content: $("#reply_contents").val(),
		    delFlag: "N",
		    writer: "test",
		    groupNo: ($("#group_no").val()) ? $("#group_no").val() : 0,
			groupSeq: ($("#group_seq").val()) ? $("#group_seq").val() : 0,
			parentNo: (rNo) ? rNo : 0,
			depth: ($("#depth").val()) ? $("#depth").val() : 0
		};
		
		
	    $.ajax({
	        type: "POST",
	        url: "/reply/saveReply",
	        dataType: "json",
	        contentType: "application/json; charset=utf-8",
	        data: JSON.stringify(data),
	        success:function(result){   
	        	
	        	alert("등록되었습니다.");
	        	
	        }, 
	        error:function(e){  
	            alert(e.responseText);  
	        } 
	
	    });
		    
	});
	
	// 댓글수정
	$("#btn-reply-mod").on("click", function () {
		
		var rNo = $("#reply_no").val(n);
		
		var data = {
		    title: $("#title").val(),
		    content: $("#contents").val(),
		    delFlag: "N",
		    modifyDate: $("#modify_date").val(),
		    regDate: $("#reg_date").val(),
		    writer: "test"
		};
		
	    $.ajax({
	        type: "PUT",
	        url: "/reply/update/" + rNo,
	        dataType: "json",
	        contentType: "application/json; charset=utf-8",
	        data: JSON.stringify(data),
	        success:function(args){   
	        	
	        	alert("수정되었습니다.")
		        location.href = "/board/detail/" + $("#no").val();   
	        	
	        }, 
	        error:function(e){  
	            alert(e.responseText);  
	        } 
	
	    });
		    
	});
	
	
	
});

// 답글의 댓글 번호 설정
function setReplyNo(n) {
	$("#reply_no").val(n); 
}

// 댓글 수정 버튼 생성
function setUpdateBtn() {
	//$("#btn-reply-reply-save").attr("class", "btn btn-warning btn-icon-split");
	//$("#btn-reply-reply-save").attr("id", "btn-reply-mod");
}

// 댓글 삭제
function deleteReply(rNo) {
	
	$.ajax({
        type: "PUT",
        url: "/reply/delete/" + rNo,
        success:function(args){   
        	
        	alert("삭제되었습니다.");
        	
        }, 
        error:function(e){  
            alert(e.responseText);  
        } 

    });
}

