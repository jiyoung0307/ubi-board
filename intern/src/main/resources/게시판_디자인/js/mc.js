var DEBUG = true;
function getJSON(url, data, func){
	$.ajax({"url" : url, "type": "POST", "data" : data, "dataType" : "json", cache : false}).done(func).fail(function(jqXHR,textStatus,errorThrown) {
		return; 
		alert("오류 발생 관리자에게 문의 바람");
		 alert(jqXHR.responseText);
		 if(DEBUG == false) return;
		 $("body").append(jqXHR.responseText);
	}); 
}
function getSyncJSON(url, data, func){
	$.ajax({"url" : url, "type": "POST", "data" : data, "dataType" : "json", cache : false, async : false}).done(func).fail(function(jqXHR,textStatus,errorThrown) {
		 alert("오류 발생 관리자에게 문의 바람");
		 alert(jqXHR.responseText);
		 if(DEBUG == false) return;
		 $("body").append(jqXHR.responseText);
	}); 
}

function getJSON(url, data, func, func2){
	$.ajax({"url" : url, "type": "POST", "data" : data, "dataType" : "json", cache : false}).done(func).fail(func2); 
}

var file_count = 2;
function fileListAdd(){
	//var html = '<div id="file'+file_count+'"><input type="file" name="attach" style="margin-bottom:5px;"/> <a href="javascript:;" onclick="fileListDel(this);" class="btn_type_1">삭제</a></div>';
	var html = '<div id="file'+file_count+'"><input type="file" name="attach" style="margin-bottom:5px;" title="첨부파일'+file_count+'"/> <a href="javascript:void(0);" onclick="fileListDel(this);"><img src="/images/article/f_minus.gif" alt="파일 삭제"/></a></div>';
	$("#fileList").append(html);
	file_count++;
}

function fileListDel(obj){
	$(obj).parent().remove();
}

function articleSubmit(f){
	if($("#title").length){
		if(f.title.value == ""){
			alert("제목을 입력하시기 바랍니다.");
			f.title.focus();
			return false;
		}
	}
	if($("#member_nm").length){
		if(f.member_nm.value == ""){
			alert("성명을 입력하시기 바랍니다.");
			f.member_nm.focus();
			return false;
		}
	}
	
	if($("#password").length){
		if(f.password.value == ""){
			alert("비밀번호를 입력하시기 바랍니다.");
			f.password.focus();
			return false;
		}
	}
	
	if($("#cell1").length){
		if(f.cell1.value == ""){
			alert("연락처를 입력하시기 바랍니다.");
			f.cell1.focus();
			return false;
		}
	}
	if($("#cell2").length){
		if(f.cell2.value == ""){
			alert("연락처를 입력하시기 바랍니다.");
			f.cell2.focus();
			return false;
		}
	}
	if($("#cell3").length){
		if(f.cell3.value == ""){
			alert("연락처를 입력하시기 바랍니다.");
			f.cell3.focus();
			return false;
		}
	}
	
	if(f.file_yn.value == 'Y'){
		var fileLimit = f.file_limit.value;
		if(fileLimit != "N"){
			var selectFileLimit = 0;
			$("input[name=attach]").each(function(){
				if($(this).val() != ""){
					selectFileLimit++;
				}
			});
			var oldFileLimit = $("input[name=delattach]").length;
			var oldFileDelLimit = $("input[name=delattach]:checked").length;
			var totalFile = 0;
			totalFile = oldFileLimit - oldFileDelLimit + selectFileLimit;
			if((fileLimit >= totalFile) == false){
				alert("제한된 파일의 갯수를 초과하였습니다.\n제한된 파일 갯수는 "+fileLimit+"개 입니다.");
				return false;
			}
		}
	}
	
	if($("#agree").length){
		if(!($("#agree").prop("checked"))){
			alert("개인정보 수집 및 이용목적, 보유 및 이용기간에 동의하시기 바랍니다.");
			return false;
		}
	}
	
	
	if($("#thumb").length){
		var img_array = $(CKEDITOR.instances.ckeditor.getData()).find('img');
		f.thumb.value = "";
		var domain = "http://" + document.domain;
		$.each(img_array, function(idx){
			if(f.thumb.value != "") return;
			if(this.src.indexOf(domain) == -1) return;
			f.thumb.value = this.src.substring(domain.length);
			return false;
		});
	}
/*	
	if(f.filter_yn.value == 'Y'){
		articleFilter(f);
		return false;
	}else{
		f.submit();
	}
*/
	articleFilter(f);
	return false;
}

/* 필터링 */
function articleFilter(f){
	var submitCheck = true;
	var eachCheck = true;
	$.each(f.editor_name.value.split(","),function(i,v){
		if(eachCheck){
			$(v).mc_filter({
				jumin_filter : f.jumin_yn.value,//주민번호 필터링
				busino_filter : f.busino_yn.value,//사업자번호 필터링
				bubino_filter : f.bubino_yn.value,//법인번호 필터링
				email_filter : f.email_yn.value,//이메일 필터링
				cell_filter : f.cell_yn.value,//휴대전화 필터링
				tel_filter : f.tel_yn.value,//전화번호 필터링
				card_filter : f.card_yn.value//카드번호
			}, function(data){
				var cont = data.conts;
				var filter_list = [];
				var filter_conts = [];
				$.each(data,function(i,v){//컨텐츠 관련 필터링
					if(typeof(v) == "object" && v["conts_filter"] == "Y"){
						$.each(v,function(key,val){
							if(key == "filter_list"){
								$(val).each(function(){
									filter_list.push(this);	
								});
							}
							if(key == "filter_conts"){
								filter_conts.push(val);
							}
						});
					}
				});
				if(filter_list.length != 0){
					mc_filter_cts("#filter_result",cont,filter_list);
					submitCheck = false;
					eachCheck = false;
					return false;
				}else{
					$.each(data,function(i,v){//개인정보 관련 필터링
						if(typeof(v) == "object"){
							$.each(v,function(key,val){
								if(key == "filter_list"){
									$(val).each(function(){
										filter_list.push(this);	
									});
								}
								if(key == "filter_conts"){
									filter_conts.push(val);
								}
							});
						}
					});
					if(filter_list.length > 0){
						mc_filter_psn("#filter_result",cont,filter_conts,f);
						submitCheck = false;
						eachCheck = false;
						return false;
					}
				}
			});
		}
	})
	if(submitCheck){
		f.conts.value = CKEDITOR.instances.ckeditor.getData();
		f.submit();
	}
	return false;
}

function articleAllFilter(f){//컨텐츠 필터링
	var submitCheck = true;
	$.each(f.editor_name.value.split(","),function(i,v){
		$(v).mc_filter({
			jumin_filter : f.jumin_yn.value,//주민번호 필터링
			busino_filter : f.busino_yn.value,//사업자번호 필터링
			bubino_filter : f.bubino_yn.value,//법인번호 필터링
			email_filter : f.email_yn.value,//이메일 필터링
			cell_filter : f.cell_yn.value,//휴대전화 필터링
			tel_filter : f.tel_yn.value,//전화번호 필터링
			card_filter : f.card_yn.value//카드번호
		}, function(data){
			var cont = data.conts;
			var filter_list = [];
			var filter_conts = [];
			$.each(data,function(i,v){//컨텐츠 관련 필터링
				if(typeof(v) == "object" && v["conts_filter"] == "Y"){
					$.each(v,function(key,val){
						if(key == "filter_list"){
							$(val).each(function(){
								filter_list.push(this);	
							});
						}
						if(key == "filter_conts"){
							filter_conts.push(val);
						}
					});
				}
			});
			if(filter_list.length != 0){
				mc_filter_cts("#filter_result",cont,filter_list);
				submitCheck = false;
				return false;
			}
		});
	})
	if(submitCheck){
		f.submit();
	}
	return false;
}

function mc_filter_cts(ic,con,list){
	$(list).each(function(){
		var regex = new RegExp(this,"gim");
		con = con.replace(regex,"<span style='display:inline;background:yellow;color:black;'>"+this+"</span>");
	});
	var html = '';
	html+='	<div id="dialog" title="시스템 경고">';
	html+='		<div class="system_warning_box">';
	html+='			<p><img src="/images/admin/system_pop_03.png" alt="" /></p>';
	html+='			<p class="system_warning_text_">등록하시려는 게시물의 본문에서 <br/>';
	html+='			시스템 관리자가 지정한<br/>';
	html+='			욕설 및 비속어가 검출되었습니다.</p>';
	html+='		</div>';
	html+='		<h4 class="system_warning_h4_1">검출된 문자열</h4>'
	html+='		<div class="system_warning_box2">';
	html+='			<div class="system_warning_textarea2">'+list.join(" / ")+'</div>';
	html+='		</div>';
	html+='		<h4 class="system_warning_h4_2">필터링 결과</h4>'
	html+='		<div class="system_warning_box2">';
	html+='			<div class="system_warning_textarea3">'+con+'</div>';
	html+='			<p class="system_warning_box2_text">※ 위의 내용을 참고하셔서 내용을 수정하시기 바랍니다. ( 바른말 고운말을사용합시다 )</p>';
	html+='		</div>';
	html+='		<p class="system_bot_bt">';
	html+='			<input type="button" value="닫기" class="system_warning_bt1" id="dialog_close" />';
	html+='		</p>';
	html+='	</div>';
	$(ic).html(html);
	var dialog = $($(ic).find("#dialog")).dialog({
	    autoOpen: false,
	    resizable: false,
	    width:656,
	    height:590,
	    open: function() {
	        $('.ui-widget-header').addClass('custom-overlay');
	    }
	});
	$(dialog.find("#dialog_close")).on("click", function() {
		dialog.dialog("close");
	});
	dialog.dialog('open');
}

function mc_filter_psn(ic,con,list,f){
	$(list).each(function(){
		var regex = new RegExp(this,"gim");
		con = con.replace(regex,"<span style='display:inline;background:yellow;color:black;'>"+this+"</span>");
	});
	var html = '';
	html+='	<div id="dialog" title="시스템 경고">';
	html+='		<div class="system_warning_box">';
	html+='			<p><img src="/images/common/system_pop_03.png" alt="" /></p>';
	html+='			<p class="system_warning_text_">등록하시려는 게시물의 본문에서 <br/>';
	html+='			개인정보유출이 우려되는 내용이 <br/>';
	html+='			검출되었습니다.</p>';
	html+='		</div>';
	html+='		<h4 class="system_warning_h4_1">검출된 문자열</h4>';
	html+='		<div class="system_warning_box2">';
	html+='			<div class="system_warning_textarea2">'+list.join(" / ")+'</div>';
	html+='		</div>';
	html+='		<h4 class="system_warning_h4_2">필터링 결과</h4>'
	html+='		<div class="system_warning_box2">';
	html+='			<div class="system_warning_textarea3">'+con+'</div>';
	html+='			<p class="system_warning_box2_text">※ 위의 내용을 참고하셔서 내용을 수정하시기 바랍니다. ( 개인정보 유출에 주의합시다 )</p>';
	html+='		</div>';
	html+='		<p class="system_bot_bt">';
	html+='			<input type="button" value="등록" class="system_warning_bt2" id="dialog_submit" name="" />';
	html+='			<input type="button" value="닫기" class="system_warning_bt1" id="dialog_close" />';
	html+='		</p>';
	html+='	</div>';
	$(ic).html(html);
	var dialog = $($(ic).find("#dialog")).dialog({
	    autoOpen: false,
	    resizable: false,
	    width:656,
	    height:590,
	    open: function() {
	        $('.ui-widget-header').addClass('custom-overlay');
	    }
	});
	$(dialog.find("#dialog_close")).on("click", function() {
		dialog.dialog("close");
	});
	$(dialog.find("#dialog_submit")).on("click", function() {
		dialog.dialog("close");
		articleAllFilter(f);
	});
	dialog.dialog('open');
}
/* 필터링 */






function fileLimitCheck(limit_file_size){
	$('input[name=attach]').change(function(){
		if($(this).attr('class') != null && $(this).attr('class').indexOf("image") > -1){
			var str = $(this).val();
			if(str == "") return true;
			var checkExt = "jpeg|gif|bmp|png";
			var dotIndex = str.lastIndexOf(".");
			var ext = str.substring(dotIndex+1).toLowerCase();
			var pattern = eval("/^(" + checkExt.toLowerCase() + "){1}$/");
			if(ext.search(pattern) == -1){
				alert("업로드 가능한 확장자가 아닙니다." );
				$(this).val("");
				return;
			}
		}
		var f = this.files[0];
		var flag = false;
		var limitMB = limit_file_size;
		var resultMB	= 0;
		
		if(f!=undefined)
			var iSize = (f.size||f.fileSize); 
		else
			return;
		
		resultMB = Math.floor(((iSize/1024)/1024));
		if(resultMB > limitMB){
			alert("첨부파일은 "+limitMB+"MB 이하로 업로드 가능합니다." );
			$(this).val("");
			return;
		}
	});
}

function pageRows(rows){
	var f = document.articleSearchForm;
	f.rows.value = rows;
	f.submit();
	return false;
}

function pageCat(cat){
	var f = document.articleSearchForm;
	f.cat.value = cat;
	f.submit();
	return false;
}

function submitHiddenForm(b,e){
	var a=$("#_hidden_iframe_");
	if(!a[0]){
		a=$('<iframe id="_hidden_iframe_" name="_hidden_iframe_" style="display: none;"></iframe>');
		$("body").append(a)
	}
	var d=$("#_hidden_form_");
	if(!d[0]){
		d=$('<form method="post" id="_hidden_form_" target="_hidden_iframe_" style="display: none;"></form>');
		$("body").append(d)
	}
	d.empty();
	d.attr("action",b);
	for(var c in e){
		if(e.hasOwnProperty(c)){
			$('<input type="hidden">').attr("name",c).attr("value",e[c]).appendTo(d)
		}
	}
	d.submit();
}

//화면캡쳐(오브젝트,파일명)
function capture(captureObj,file_name) {
	html2canvas($(captureObj), {
		//allowTaint: true,
		//taintTest: false,
		useCORS: true,
		//proxy: '/etc/proxy_image',
		onrendered: function(canvas) {
			var image = canvas.toDataURL();
			submitHiddenForm("/etc/bypass_image", { image : image, filename:file_name+".png"});
		}
	});
}