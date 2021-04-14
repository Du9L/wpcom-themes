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
				$( '.site-title a, .site-description' ).css( {
					'clip': 'rect(1px, 1px, 1px, 1px)',
					'position': 'absolute'
				} );
			} else {
				$( '.site-title a, .site-description' ).css( {
					'clip': 'auto',
					'color': to,
					'position': 'relative'
				} );
			}
		} );
	} );

	// Hook into background color/image change and adjust body class value as needed.
	wp.customize( 'background_color', function( value ) {
		value.bind( function( to ) {
			if ( '#2d2d2d' === to ) {
				$( '#site-navigation, #secondary, #colophon, .sticky' ).css( {
					'background-color': '#2d2d2d'
				} );
			} else {
				$( '#site-navigation, #secondary, #colophon, .sticky' ).css( {
					'background-color': to
				} );
			}
		} );
	} );
	wp.customize( 'background_image', function( value ) {
		value.bind( function( to ) {
			if ( '' !== to ) {
				$( '#site-navigation, #secondary, #colophon, .sticky' ).css( {
					'background-image': 'url(' + to + ')'
				} );
			} else {
				$( '#site-navigation, #secondary, #colophon, .sticky' ).css( {
					'background-image': 'none'
				} );
			}
		} );
	} );

} )( jQuery );
