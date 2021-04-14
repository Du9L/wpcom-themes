/*!
 * Script for AltoFocus
 *
 * @package Altofocus
 */

/* global flexSliderText */
( function( $ ) {

	/**
	 * Set variables
	 */
	var body,
		$wrapper        = $( '.js body' ),
		$widgetlist     = $( '.widget > ul' ).not( '.widget_wpcom_social_media_icons_widget > ul, .widget_author_grid > ul' ),
		$gallery_slider = $( '.flexslider' );

	/**
	 * Set masthead height and stick archive page headers to window
	 *
	 * Using a poor mans throttle (since lodash conflicts with the customizer)
	 * - src: https://www.sitepoint.com/throttle-scroll-events/
	 */

	function altofocus_throttle( fn, wait ) {

		var time = Date.now();

		return function() {
			if ( ( time + wait - Date.now() ) < 0 ) {
				fn();
				time = Date.now();
			}
		};
	}

	/**
	 * Stick header to window when scrolling passes the masthead height threshold
	 */
	function stickyPageHeader() {

		// get the amount the window has scrolled
		var scroll        = $( this ).scrollTop(),
			header_height = $( '#masthead' ).outerHeight(),
			$page_header  = $( '.hfeed .page-header' );

		// add the 'fixed' class to the header menu based on the window position
		if ( scroll >= header_height ) {

			$page_header.addClass( 'sticky' );

		} else {

			$page_header.removeClass( 'sticky' );
		}
	}

	/**
	 * Split widget lists
	 */
	function initColumnLists() {

		$widgetlist.columnlist({
			size           : 2,
			'class'        : 'widget-list',
			incrementClass : 'widget-list-'
		});
	}

	/**
	 * Init Gallery Slider
	 */
	function initGallerySlider() {

		// Determine text direction
		var $text_direction = true;
		if ( $( 'html' ).attr( 'dir' ) === 'rtl' ) {

			$text_direction = false;
		}

		$gallery_slider.flexslider({
			// options
			animation:    "slide",
			selector:     ".slides > .slide",
			smoothHeight: true,
			slideshow:    false,
			rtl:          $text_direction,
			prevText:     '<span class="screen-reader-text">'+ flexSliderText.previous +'</span> <span class="meta-nav" aria-hidden="true"><svg class="arrow-icon left-arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect class="rectangle" x="0" y="0" width="40" height="40" /><polyline class="arrow" points="27,6 13,20 27,34" /></svg></span>',
			nextText:     '<span class="screen-reader-text">'+ flexSliderText.next +'</span> <span class="meta-nav" aria-hidden="true"><svg class="arrow-icon right-arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect class="rectangle" x="0" y="0" width="40" height="40" /><polyline class="arrow" points="13 34 27 20 13 6" /></svg></span>',
		});
	}

	/**
	 * Adjust footer height
	 * - Resizes footer height and conten bottom margins for fixed footer
	 * - disabled for mobile screens
	 */
	function responsiveFooterHeight() {

		var runResize,
			$footerElement       = $wrapper.find( '#colophon' ),
			$contentElement      = $wrapper.find( '#content' );

		function resizeFooterHeight() {

			var $footerElementHeight = $footerElement.outerHeight();

			// set content element bottom margin CSS
			$contentElement.css( "marginBottom", $footerElementHeight );
		}

		resizeFooterHeight();

		$( window ).on( 'resize.altofocus', function() {

			clearTimeout( runResize );

			runResize = setTimeout( function() {

				if ( window.innerWidth > 800 ) {

					resizeFooterHeight();
				}

			}, 100);
		});
	}

	/*
	 * Fade in page
	 * - only if js is enabled
	 */
	function fadeInPage() {

		$wrapper.animate({
			opacity: 1,
		}, 100);
	}

	/**
	 * Execute functions
	 */
	$( document )
		.ready( initColumnLists )
		.ready( initGallerySlider )
		.ready( responsiveFooterHeight )
		.ready( function() {

			body = $( document.body );

			window.addEventListener( 'scroll', altofocus_throttle( stickyPageHeader, 20 ) );

			/**
			 * Window calls
			 */
			$( window )
				.load( fadeInPage );
		} );

})(jQuery);
