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
	
		//pageLength: 10,
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
			{ data: "parentNo" },
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
			depth: ($("#depth").val()) ? $("#depth").val() : 0,
			indent: 0
		};
		
		// 답글의 경우 url 변경
		var url = ($("#group_no").val()) ? "/board/saveReply" : "/board/save";
		
	    $.ajax({
	        type: "POST",
	        url: url,
	        dataType: "json",
	        contentType: "application/json; charset=utf-8",
	        data: JSON.stringify(data),
	        success:function(args){   
	        	
	        	alert("등록되었습니다.")
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
	
	// 파일 업로드
	$(function(){
		
	      $('.demo-noninputable').pastableNonInputable();
	      $('.demo-textarea').on('focus', function(){
	        var isFocused = $(this).hasClass('pastable-focus');
	        console && console.log('[textarea] focus event fired! ' + (isFocused ? 'fake onfocus' : 'real onfocus'));
	      }).pastableTextarea().on('blur', function(){
	        var isFocused = $(this).hasClass('pastable-focus');
	        console && console.log('[textarea] blur event fired! ' + (isFocused ? 'fake onblur' : 'real onblur'));
	      });
	      $('.demo-contenteditable').pastableContenteditable();
	      $('.demo').on('pasteImage', function(ev, data){
	        var blobUrl = URL.createObjectURL(data.blob);
	        
	        // 붙여넣기한 데이터
	        var pasteImageData ="<div class=\"result\"><img src=\"" + data.dataURL +"\" ></div>";
	        
	        $('#pasteImages').append(pasteImageData);
	        
	      }).on('pasteImageError', function(ev, data){
	        alert('Oops: ' + data.message);
	        if(data.url){
	          alert('But we got its url anyway:' + data.url)
	        }
	      }).on('pasteText', function(ev, data){
	        $('<div class="result"></div>').text('text: "' + data.text + '"').insertAfter(this);
	      });
	    });
	
	
});

