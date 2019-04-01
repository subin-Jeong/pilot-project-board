
$(document).ready(function() {
	
	$('#boardList').DataTable({
	    "columnDefs": [{
	        "defaultContent": "-",
	        "targets": "_all"
	      }],
	    pageLength: 10,
	    bPaginate: true,
	    responsive: true,
	    processing: true,
	    ordering: true,
	    ServerSide: true,
	    searching: false,
	    ajax: {
	        url: "/board/getList",
	        dataSrc: "content",
		    data: function(d) {
		        return JSON.stringify(d);
		    },
		    contentType: 'application/json',
		    type: 'POST'
	    },

	    columns: [
	    { content: "id"},
	     { content: "content" },
	     { content: "delFlag" },
	     { content: "modifyDate" },
	     { content: "regDate" },
	     { content: "title" }
	       ]
	});

/*
	
    $.ajax({
        url:'/board/getList',
        type:'POST',
        dataType: 'text',
        success: function(data){

        	// JSON Text를 JSON Object로 변환
        	// 그래야 Handlebars Binding 가능
        	var dataObj = JSON.parse(data);

        	// Handlebars Template 생성
        	var source = "{{#content}}";
        		source+= "<tr>";
        		source+= "	<td>{{id}}</td>";
        		source+= "  <td>{{title}}</td>";
        		source+= "  <td>{{title}}</td>";
        		source+= "  <td>{{regDate}}</td>";
        		source+= "  <td>{{regDate}}</td>";
        	    source+= "</tr>";
        	    source+= "{{/content}}";
        	   
        	 // Handlebars Template 컴파일
        	var template = Handlebars.compile(source); 

        	// Handlebars Template 에 데이터를 바인딩해서 HTML 생성 후 랜더링
        	$("#list").html(template(dataObj));
        	
        	alert("총 페이지? " + dataObj.totalPages);
     	
        	// 페이징
        	// init bootpag
        	$('#pagination').bootpag({
        		
        		// total pages
        	    total: dataObj.totalPages,
        	    // default page
        	    page: 1,
        	    // visible pagination
        	    maxVisible: dataObj.size,
        	    // next/prev leaps through maxVisible
        	    leaps: true    
        	    
        	}).on("page", function(event, num){
        	    $("#content").html("Page " + num); // or some ajax content loading...
        	    // ... after content load -> change total to 10
        	    $(this).bootpag({total: 10, maxVisible: 10});
        	    
        	   location.href = "/board/getList?page="+num;
        	});
        	
        	
        	
        	
        }// end
    });// end ajax
    return false;
    
  */
    
});

