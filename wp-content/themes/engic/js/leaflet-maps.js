
(function($) {

	"use strict";
	var Map = {

		init: function() {
			//Map
			this.map();
		},
		map: function(){
			$('.eut-map').each( function() {
				var map = $(this),
					lmapLat = map.attr('data-lat'),
					lmapLng = map.attr('data-lng'),
					dragging = isMobile.any() ? false : true;

				var lmapZoom = parseInt( map.attr('data-zoom') ) ? parseInt( map.attr('data-zoom') ) : 14;

				var lmapLatlng = L.latLng( lmapLat, lmapLng );
				var lmapOptions = {
					center: lmapLatlng,
					zoom: lmapZoom,
					dragging: dragging,
					scrollWheelZoom: false
				};
				var lmap = L.map( map.get(0), lmapOptions );
				var tileOptions = {
					subdomains: engic_eutf_maps_data.map_tile_url_subdomains,
					attribution: engic_eutf_maps_data.map_tile_attribution
				};
				L.tileLayer( engic_eutf_maps_data.map_tile_url, tileOptions ).addTo(lmap);

				var markers = [];

				map.parent().children('.eut-map-point').each( function(i) {

					var mapPoint = $(this),
					lmapPointMarker = mapPoint.attr('data-point-marker'),
					lmapPointTitle = mapPoint.attr('data-point-title'),
					lmapPointOpen = mapPoint.attr('data-point-open'),
					lmapPointLat = parseFloat( mapPoint.attr('data-point-lat') ),
					lmapPointLng = parseFloat( mapPoint.attr('data-point-lng') );

					var data = mapPoint.html();
					var lmapPointInfo = data.trim();

					var markerIcon = L.icon( {
						className: 'eut-map-auto-anchor',
						iconUrl: lmapPointMarker
					});

					var marker = L.marker([lmapPointLat, lmapPointLng], { icon: markerIcon} ).addTo(lmap);
					if ( lmapPointInfo ) {
						var latlng = marker.getLatLng();
						var markerPopup = L.popup().setLatLng(latlng).setContent( data );
						if ( 'yes' == lmapPointOpen ) {
							markerPopup.openOn(lmap);
						}
						marker.on('click', function(e) {
							markerPopup.openOn(lmap);
						} );
					}
					markers.push( [lmapPointLat, lmapPointLng] );

				});

				if ( map.parent().children('.eut-map-point').length > 1 ) {
					lmap.fitBounds(markers);
					$(window).on( "resize", function() {
						lmap.fitBounds(markers);
					});
				} else {
					$(window).on( "resize", function() {
						lmap.panTo(lmapLatlng);
					});
				}

				$('.eut-map').on( "eut_redraw_map", function() {
					lmap.invalidateSize();
					if ( map.parent().children('.eut-map-point').length > 1 ) {
						lmap.fitBounds(markers);
					} else {
						lmap.panTo(lmapLatlng);
					}
				});

				map.css({'opacity':0});
				map.delay(600).animate({'opacity':1});

			});

			setTimeout(function () {
				$('.eut-map .eut-map-auto-anchor').each( function() {
					$(this).css('margin-left', '-' + $(this).width()/2 +'px');
					$(this).css('margin-top', '-' + $(this).height() +'px');
				});
				$('.eut-map').trigger( "eut_redraw_map" );
			},100);

		}
	};

	//////////////////////////////////////////////////////////////////////////////////////////////////////
	// GLOBAL VARIABLES
	//////////////////////////////////////////////////////////////////////////////////////////////////////
	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	Map.init();

	$(window).on("orientationchange",function(){

		setTimeout(function () {
			$('.eut-map').trigger( "eut_redraw_map" );
		},500);

	});

	$('.eut-tabs-title li').on('click', function() {
		var tabRel = $(this).attr('data-rel');
		if ( '' != tabRel && $(tabRel + ' .eut-map').length ) {
			setTimeout(function () {
				$('.eut-map').trigger( "eut_redraw_map" );
			},500);
		}
	});

	$(window).on('load',function () {

		var userAgent = userAgent || navigator.userAgent;
		var isIE = userAgent.indexOf("MSIE ") > -1 || userAgent.indexOf("Trident/") > -1 || userAgent.indexOf("Edge/") > -1;

		if ( $('#eut-body').hasClass( 'compose-mode' ) || ( $('#eut-feature-section .eut-map').length && isIE ) ) {
			$('.eut-map').trigger( "eut_redraw_map" );
		}

	});

})(jQuery);