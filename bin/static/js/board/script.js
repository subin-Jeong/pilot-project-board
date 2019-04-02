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
	var dropzone = new Dropzone('#demo-upload', {
		  previewTemplate: document.querySelector('#preview-template').innerHTML,
		  parallelUploads: 2,
		  thumbnailHeight: 120,
		  thumbnailWidth: 120,
		  maxFilesize: 3,
		  filesizeBase: 1000,
		  thumbnail: function(file, dataUrl) {
		    if (file.previewElement) {
		      file.previewElement.classList.remove("dz-file-preview");
		      var images = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
		      for (var i = 0; i < images.length; i++) {
		        var thumbnailElement = images[i];
		        thumbnailElement.alt = file.name;
		        thumbnailElement.src = dataUrl;
		      }
		      setTimeout(function() { file.previewElement.classList.add("dz-image-preview"); }, 1);
		    }
		  }

		});


		// Now fake the file upload, since GitHub does not handle file uploads
		// and returns a 404

		var minSteps = 6,
		    maxSteps = 60,
		    timeBetweenSteps = 100,
		    bytesPerStep = 100000;

		dropzone.uploadFiles = function(files) {
		  var self = this;

		  for (var i = 0; i < files.length; i++) {

		    var file = files[i];
		    totalSteps = Math.round(Math.min(maxSteps, Math.max(minSteps, file.size / bytesPerStep)));

		    for (var step = 0; step < totalSteps; step++) {
		      var duration = timeBetweenSteps * (step + 1);
		      setTimeout(function(file, totalSteps, step) {
		        return function() {
		          file.upload = {
		            progress: 100 * (step + 1) / totalSteps,
		            total: file.size,
		            bytesSent: (step + 1) * file.size / totalSteps
		          };

		          self.emit('uploadprogress', file, file.upload.progress, file.upload.bytesSent);
		          if (file.upload.progress == 100) {
		            file.status = Dropzone.SUCCESS;
		            self.emit("success", file, 'success', null);
		            self.emit("complete", file);
		            self.processQueue();
		            //document.getElementsByClassName("dz-success-mark").style.opacity = "1";
		          }
		        };
		      }(file, totalSteps, step), duration);
		    }
		  }
		}
	
});

