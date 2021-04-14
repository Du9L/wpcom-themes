(function($) {
	"use strict";

		$(document).ready(function() {

		/*-----------------------------------------------------------------------------------*/
		/*  Home icon in main menu
		/*-----------------------------------------------------------------------------------*/
			var items = $( '.main-navigation li:first-of-type a' );

			items.each( function() {
				if ( "Home" === $( this ).text() ) {
					$( this ).prepend( '<i class="fa fa-home space-right"></i>' );
				}
			} );

		/*-----------------------------------------------------------------------------------*/
		/*  If the Tagcloud widget exist or Edit Comments Link exist
		/*-----------------------------------------------------------------------------------*/
			if ( $( '.comment-metadata' ).length ) {
				$('.comment-metadata').addClass('small-part');
			}
			if ( $( '.reply' ).length ) {
				$('.reply').addClass('small-part');
			}

		/*-----------------------------------------------------------------------------------*/
		/*  Search button
		/*-----------------------------------------------------------------------------------*/
			$( '.open-search' ).click(function() {
				$( '.search-full' ).fadeIn(400);
				if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
				} else {
					$( ".search-full .search-field" ).focus();
				}
			});

			$( '.close-search' ).click(function() {
				$( '.search-full' ).fadeOut(400);
			});

		/*-----------------------------------------------------------------------------------*/
		/*  Detect Small Browser Window
		/*-----------------------------------------------------------------------------------*/
			if ( $( window ).width() > 579 ) {

				/* Scroll To Top */

				$(window).scroll(function(){
					if ($(this).scrollTop() > 700) {
						$( '.to-top' ).fadeIn();
					}
					else {
						$( '.to-top' ).fadeOut();
					}
				});
				$( '.to-top' ).click(function(){
					$( "html, body" ).animate({ scrollTop: 0 }, 1000);
					return false;
				});

			}

		});

})(jQuery);