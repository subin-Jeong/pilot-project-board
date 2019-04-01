// 리스트
$(document).ready(function() {
	
	$('#boardList').DataTable({
		
	
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
	
		pageLength: 10,
		bPaginate: true,
		responsive: true,
		processing: true,
		ordering: true,
		ServerSide: true,
		searching: true,
		order: [ 0, 'desc' ],
		ajax: {
		    url: "/board/getList",
		    dataSrc: "",
		    type: "POST"
		},
		
		columns: [
			{ data: "id"},
			{ data: "title",
				
				"render": function(data, type, row){
					
			        if(type=="display"){
			            data = "<a href=\"/board/detail/"+  row["id"] +"\" style=\"text-decoration:none; color:#858796;\"><b>" + data + "</b></a>";
			        }
			        return data;
			    }
			
			 },
			{ data: "delFlag" },
			{ data: "modifyDate" },
			{ data: "regDate" },
			{ data: "content" }]
	
	});

});

// 등록
$('#btn-save').on("click", function () {
	
	var data = {
	    title: $("#title").val(),
	    content: $("#contents").val(),
	    delFlag: 1,
	    modifyDate: "2019-04-01",
	    regDate: "2019-04-01"
	};
	
    $.ajax({
        type: "POST",
        url: "/board/save",
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
$('#btn-mod').on("click", function () {
	
	var bId = $("#id").val();
	
	var data = {
	    title: $("#title").val(),
	    content: $("#contents").val(),
	    delFlag: $("#del_flag").val(),
	    modifyDate: $("#modify_date").val(),
	    regDate: $("#reg_date").val()
	};
	
    $.ajax({
        type: "PUT",
        url: "/board/update/" + bId,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        success:function(args){   
        	
        	alert("수정되었습니다.")
	        location.href = "/board/detail/" + $("#id").val();   
        	
        }, 
        error:function(e){  
            alert(e.responseText);  
        } 

    });
	    
});

// 삭제
$('#btn-del').on("click", function () {
	
	var bId = $("#id").val();
	
    $.ajax({
        type: "PUT",
        url: "/board/delete/" + bId,
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
$('#btn-exit').on("click", function () {
	history.go(-1);
});

