/**
 * Theme Customizer enhancements for a better user experience.
 *
 * Contains handlers to make Theme Customizer preview reload changes asynchronously.
 */

( function( $ ) {
	// Site title and description.
	wp.customize( 'blogname', function( value ) {
		value.bind( function( to ) {
			$( '.site-title a' ).text( to );
		} );
	} );
	wp.customize( 'blogdescription', function( value ) {
		value.bind( function( to ) {
			$( '.site-description' ).text( to );
		} );
	} );
	// Header text color.
	wp.customize( 'header_textcolor', function( value ) {
		value.bind( function( to ) {
			if ( 'blank' === to ) {
				$( '.site-title, .site-description' ).css( {
					'clip': 'rect(1px, 1px, 1px, 1px)',
					'position': 'absolute'
				} );
			} else {
				$( '.site-title, .site-description' ).css( {
					'clip': 'auto',
					'color': to,
					'position': 'relative'
				} );
			}
		} );
	} );
	// Background image
	wp.customize( 'background_image', function( value ) {
		value.bind( function( to ) {
			$body = $( 'body' );

			// If we're no longer using the default background, remove the body class
			if ( $body.hasClass( 'default-custom-background' ) && -1 == to.indexOf( 'capoverso-default-background2x.png' ) ) {
				$body.removeClass( 'default-custom-background' );
			} //If we're using the default background
			else if ( ! $body.hasClass( 'default-custom-background' ) && -1 != to.indexOf( 'capoverso-default-background2x.png' ) ) {
				$body.addClass( 'default-custom-background' );
			}
		} );
	} );
} )( jQuery );
