(function($){
	$(document).ready(function(){
		if($("#direct_api").length != 0){
			var mapOptions = {
					zoomControl: true,
					zoomControlOptions: {
				        style: naver.maps.ZoomControlStyle.LARGE
				    },
					center: new naver.maps.LatLng(37.556435, 126.974381),
					zoom: 12
			};
			var map = new naver.maps.Map('direct_api', mapOptions);
			var marker = new naver.maps.Marker({
			    position: new naver.maps.LatLng(37.556435, 126.974381),
			    map: map,
			    icon: {
			        url: '/images/sub/maker.png',
			        size: new naver.maps.Size(35, 47),
			        origin: new naver.maps.Point(0, 0),
			        anchor: new naver.maps.Point(18, 40)
			    }
			});
			
			var contentString = '';
			contentString += '<div class="iw_inner">';
			contentString += '   <h3>한국재정정보원</h3>';
			contentString += '   <p class="iw_addr">서울특별시 중구 퇴계로 10, 메트로타워</p>';
			contentString += '   <p class="iw_nav">Tel. 02-6908-8200 / Fax. 02-6908-8255</p>';
			contentString += '</div>';
			var infowindow = new naver.maps.InfoWindow({
				content: contentString,
				borderColor: '#8d8d8d'
			});
			naver.maps.Event.addListener(marker, "click", function(e) {
				if (infowindow.getMap()) {
					infowindow.close();
				} else {
					infowindow.open(map, marker);
				}
			});
			infowindow.open(map, marker);
		}
	});
})(jQuery);