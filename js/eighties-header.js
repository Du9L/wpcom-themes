/**
 * Scripts for the custom header.
*/
(function( $ ) {
	// Set backstretch, because it's more browser friendly for setting a background image.
	$( '#masthead' ).backstretch( $( '#masthead .screen-reader-text' ).data( 'backstretch' ) );

	// Set the height of the masthead. We use this height below.
	$( '#masthead' ).data( 'height', $( '#masthead' ).outerHeight() );

	$( window ).scroll( function( event ) {

		if ( $( window ).width() > 800 ) {
			var position = window.scrollY,
				bottom   = window.innerHeight - document.getElementById( 'colophon' ).offsetHeight,
				height   = $( '#masthead' ).data( 'height' ),
				content  = $( '#content' ).offset().top,
				footer   = $( '#colophon' ).offset().top - position;

			if ( position > 0 && content > position && footer > bottom ) {
				if ( position < height ) {
					$( '#masthead' ).css({
						'height' : height - position + 'px',
						'overflow' : 'hidden'
					});

					$( '.site-branding' ).css({
						'opacity' : ( 1 - position / height * 2 )
					});
				} else {
					$( '#masthead' ).css({
						'height' : '0px'
					});
				}
			} else if ( position <= 0 ) {
				$( '#masthead' ).css({
					'height' : height
				});

				$( '.site-branding' ).css({
					'opacity' : 1
				});
			}
		} else {
			$( '#masthead' ).css({
				'height' : height + "px"
			});

			$( '.site-branding' ).css({
				'opacity' : 1
			});
		}
	});

	// In the case that the main title is very long, i.e, > 32 chars,
	// shrink the font size down a little so it's not so overbearing (only on desktop).
	var $siteTitle= $( '.site-title' ),
		siteTitleText = $siteTitle.find( 'a' ).text();

	var updateText = function() {
		if ( ( $( window ).width() > 1000 ) ) {
			$siteTitle.css( 'font-size', '6.388888889rem' );
		} else {
			$siteTitle.css( 'font-size', '' );
		}
	};

	// Run on document ready:
	$( function() {
		if ( siteTitleText.length > 32 ) {
			updateText();
			$( window ).resize( updateText );
		}
	} );

}( jQuery ));
