$(document).ready(function() {
	$(".sub_nav_inner > li a").bind("click", function(e){
		$('.sub_nav_inner  li').removeClass('on');
		$(this).closest('li').addClass('on');

		var clickElement = $(this).next();
		if((clickElement.is('ul')) && (clickElement.is(':visible'))) {
			$(this).closest('li').removeClass('on');
			clickElement.slideUp();
		  }
		if((clickElement.is('ul')) && (!clickElement.is(':visible'))) {
			$(this).closest("ul").find("ul").slideUp();
			clickElement.slideDown();
		}
		if($(this).closest('li').find('ul').children().length == 0) {
			return true;
		} else {
			return false;	
		}		
	});


// tr 활성화 부분
	$(".table-wrap table tr").click(function(){
		$(".table-wrap table tr").removeClass('on');
		$(this).addClass('on')
	});
	
// POP-up
	var $this;
	
	$("[data-rel=pop]").click(function() {

		$this = $(this);
		$(".pop-wrap").hide();
		$("#dimmed").show();
		
		pop_w = $($(this).attr("href")).outerWidth();
		pop_h = $($(this).attr("href")).outerHeight();

		win_h = $(window).height();
		win_t = $(window).scrollTop();

		left_p = (pop_w)/2;
		if(pop_h>=win_h) top_p = 0;
		else {
			top_p = (win_h/2)-(pop_h/2)+win_t;
		}
		
		$($(this).attr("href")).fadeIn().css({"margin-left":-(left_p),"top":top_p});
		
		// 팝업창을 띄운 후 포커스 이동
		$($(this).attr("href")).attr("tabindex", 0).fadeIn().focus();
		return false;
	});

	$(".pop-close, #dimmed, .pop02").click(function() {
		$("#dimmed, .pop-wrap").hide();
				
	});

// 스크롤
	$('.table-wrap.scroll, .scroll_img').on('click',function(){
		$('.scroll_img').css('display','none');
	})
	
// 모바일메뉴
	$('.menu').click(function() {
		$('.sub_nav').toggleClass("action");
		$('.menu').toggleClass("off");		
		$('#dimmed').fadeToggle();
	});
	
	$('#dimmed').click(function() {
		$('.sub_nav').removeClass("action");
		$('.menu').removeClass("off");
	});
	
//QNA
	$('.qna_wrap li a').click(function() {
		$('.qna_wrap li a').removeClass('active');
		$('.text_wrap').removeClass('active');
		$('.qna_wrap li').removeClass('active');
		$('.qna_wrap li a').attr('title','내용열기');
		var clickElement = $(this).next();
        if (clickElement.is('.text_wrap')) {
			if (clickElement.is(':visible')) {
				clickElement.slideUp(100,function(){
					scroll();
				});
				$(this).attr('title','내용열기');
			   
            } else {
				$('.text_wrap').slideUp(100);
				clickElement.slideDown(100,function(){
					scroll();

				});
				$(this).closest('.qna_wrap li a').addClass('active');
				$(this).attr('title','내용닫기');
				$(this).parent().addClass('active');
            }
			
         }
				
			function scroll(){
				$item = $(document).find('li .active');
				
				$item.slideDown(300, function(){
					//if(config.autoScroll) {
						var $diff = 27;
						if($('html').hasClass('mobile')) $diff = 60;
						var $scrollTop = $(window).scrollTop();
						var $windowHeight = $(window).height();
						var $windowEnd = $windowHeight + $scrollTop;
						var $itemHeight = $item.outerHeight();
						var $itemTop = $item.offset().top;
						var $itemEnd = $itemTop+$itemHeight;
						var $nextMgTop = 0;
						var $scl = null;
						var $sclSpeed = 200;
						if($item.next().length) $nextMgTop = parseInt($item.next().css('margin-top'));

						if($windowEnd > $itemEnd){
							$scl = Math.max($itemTop-$diff,$itemEnd-$windowHeight+$nextMgTop);
						}else if($itemTop > $scrollTop){
							$scl = $itemTop-$diff;
						}
						
						if($scl != null){
							//$item.stop(true,false).animate({'scrollTop':$scl},$sclSpeed);
							$('html,body').stop(true,false).animate({'scrollTop':$scl},$sclSpeed);
						}
						
					//}
				});
			}
	});
	


});