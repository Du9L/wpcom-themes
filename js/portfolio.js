( function( $ ) {

	$( window ).load( function() {

		/*
		 * Wrap portfolio-featured-image in a div.
		 */
		$( '.portfolio-featured-image' ).each( function() {
			$( this ).wrap( '<div class="portfolio-thumbnail" />' );
		} );

		var portfolio_wrapper = $( '.portfolio-wrapper, .jetpack-portfolio-shortcode' );
		portfolio_wrapper.imagesLoaded( function() {
			if ( $( 'body' ).hasClass( 'rtl' ) ) {
				portfolio_wrapper.masonry( {
					columnWidth: '.portfolio-entry',
					itemSelector: '.portfolio-entry',
					transitionDuration: 0,
					isOriginLeft: false,
					gutter: 40,
				} );
			} else {
				portfolio_wrapper.masonry( {
					columnWidth: '.portfolio-entry',
					itemSelector: '.portfolio-entry',
					transitionDuration: 0,
					gutter: 40,
				} );
			}

			// Show the blocks
			$( '.portfolio-entry' ).animate( {
				'opacity' : 1
			}, 500 );
		} );

		$( window ).resize( function () {

			// Force layout correction after 1500 milliseconds
			setTimeout( function () {
				portfolio_wrapper.masonry({
					columnWidth: '.portfolio-entry',
					itemSelector: '.portfolio-entry',
					transitionDuration: 0,
					gutter: 40,
				});
			}, 1500 );

		} );

		// Layout posts that arrive via infinite scroll
		$( document.body ).on( 'post-load', function () {

			var new_items = $( '.infinite-wrap .portfolio-entry' );

			portfolio_wrapper.append( new_items );
			portfolio_wrapper.masonry( 'appended', new_items );

			// Force layout correction after 1500 milliseconds
			setTimeout( function () {

				portfolio_wrapper.masonry();

				// Show the blocks
				$( '.portfolio-entry' ).animate( {
					'opacity' : 1
				}, 250 );

			}, 1500 );

		} );

	} );

} )( jQuery );
