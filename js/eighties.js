/**
 * Eighties JavaScript
 *
 * The main JavaScript file for Eighties. Sets up
 * the navigation and sidebar toggles and footer
 * widget area layout.
*/
( function( $ ) {

	/**
	 * If we've made it this far, JavaScript is working.
	 * We should set the main navigation css to display
	 * block. Don't worry, if JavaScript is not working
	 * the menu is handled a bit differently, as the
	 * toggle functionality would not work anyway.
	*/
	$( '#site-navigation, #secondary' ).css( 'display', 'block' );

	/**
	 * Set up the main navigation toggle. This sets
	 * up a toggle for navitaion to overlay the window.
	*/
	$( '.main-navigation-toggle, #mobile-menu-close' ).on( 'click', function( event ) {
		event.preventDefault();

		$( 'html' ).toggleClass( 'disable-scroll' );
		$( 'body' ).toggleClass( 'main-navigation-open' );
	});

	/**
	 * Set up the widget area toggle. This sets
	 * up a toggle for sidebar to overlay the window.
	*/
	$( '.widget-area-toggle' ).on( 'click', function( event ) {
		event.preventDefault();

		$( 'html' ).toggleClass( 'disable-scroll' );
		$( 'body' ).toggleClass( 'widget-area-open' );
		$( '#secondary' ).trigger( 'resize' );
	});

	/**
	 * Closes the main navigation or sidebar when
	 * the esc key is pressed.
	*/
	$( document ).keyup( function( event ) {
		if ( event.keyCode == 27 ) {
			if ( $( 'body' ).hasClass( 'main-navigation-open' ) ) {
				$( 'html' ).removeClass( 'disable-scroll' );
				$( 'body' ).removeClass( 'main-navigation-open' );
			} else if ( $( 'body' ).hasClass( 'widget-area-open' ) ) {
				$( 'html' ).removeClass( 'disable-scroll' );
				$( 'body' ).removeClass( 'widget-area-open' );
			}
		}
	});

	/**
	 * Set up the footer widget area. This sets
	 * up the columns based upon how many widget areas
	 * are currently active.
	*/
	var columnCount = $( '.widget-area' ).children( '.column' ).length;

	if ( $( '.site-footer' ).has( '.widget-area' ) ) {
		$( '.widget-area' ).addClass( 'column' + columnCount.toString( 10 ) );
		$( '.widget-area' ).trigger( 'resize' );
	}

	/**
	 * Change and adjust menu and sticky post
	 * background styles based on custom-background
	 * style values.
	*/
	if ( $( 'body' ).hasClass( 'has-custom-background' ) ) {
		var customStyles = $( 'body.custom-background' ).css( [
			'background-attachment',
			'background-color',
			'background-image',
			'background-position',
			'background-repeat'
		] );

		$( '#site-navigation, #secondary, #colophon, .sticky' ).css( customStyles );
	}
} )( jQuery );
