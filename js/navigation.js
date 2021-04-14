/**
 * navigation.js
 *
 * Handles toggling the navigation menu for small screens.
 */
( function( $ ) {

	var slideMenu = function() {
		var menu, innerMenu, button, nav, navlist, secondary, widgets;

		menu =      $( '#site-menu' );
		innerMenu = menu.find( '.site-menu-inner' );
		button =    $( '#site-menu-toggle' );
		nav =       $( '#site-navigation' );
		navlist =   nav.find( 'ul' );
		secondary = $( '#secondary' );
		widgets =   secondary.find( 'aside' );

		if ( ! menu || 'undefined' === typeof button ) {
			return;
		}

		// Hide menu toggle button if menu is empty and return early.
		if ( ( 'undefined' === typeof navlist ) && ( 'undefined' === typeof widgets  ) ) {
			button.hide();
			return;
		}

		menu.attr( 'aria-expanded', 'false' );
		button.attr( 'aria-expanded', 'false' );

		button.on( 'click', function() {

			// Remove mejs players from sidebar
			$( '#secondary .mejs-container' ).each( function( i, el ) {
				if ( mejs.players[ el.id ] ) {
					mejs.players[ el.id ].remove();
				}
			} );

			if ( menu.hasClass( 'site-menu-open' ) ) {
				innerMenu.slideUp();
				menu.attr( 'aria-expanded', 'false' );
				button.attr( 'aria-expanded', 'false' );
				menu.removeClass( 'site-menu-open' );

			} else {
				innerMenu.slideDown();
				menu.resize();
				menu.attr( 'aria-expanded', 'true' );
				button.attr( 'aria-expanded', 'true' );
				menu.addClass( 'site-menu-open' );

				// Re-initialize mediaelement players.
				setTimeout( function() {
					if ( window.wp && window.wp.mediaelement ) {
						window.wp.mediaelement.initialize();
					}
				} );

				// Trigger resize event to display VideoPress player.
				setTimeout( function(){
					if ( typeof( Event ) === 'function' ) {
						window.dispatchEvent( new Event( 'resize' ) );
					} else {
						var event = window.document.createEvent( 'UIEvents' );
						event.initUIEvent( 'resize', true, false, window, 0 );
						window.dispatchEvent( event );
					}
				} );
			}
		} );
	}

	$( document ).ready( function() {
		slideMenu();
	} );

} )( jQuery );
