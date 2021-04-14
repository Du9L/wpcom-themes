/**
 * File customizer.js.
 *
 * Theme Customizer enhancements for a better user experience.
 *
 * Contains handlers to make Theme Customizer preview reload changes asynchronously.
 */

/* global wp */

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

	// Header text display
	wp.customize( 'header_textcolor', function( value ) {

		value.bind( function( to ) {

			// if header text display is set to false
			if ( 'blank' === to ) {

				$( '.site-identity, .site-title, .site-description' ).css({
					clip: 'rect(1px, 1px, 1px, 1px)',
					position: 'absolute'
				});

				$( 'body' ).addClass( 'hide-site-title-description' );

			} else {

				$( '.site-identity, .site-title, .site-description' ).css({
					clip: 'auto',
					position: 'relative'
				});

				// Update body class.
				$( 'body' ).removeClass( 'hide-site-title-description' );
			}
		});
	});

} )( jQuery );