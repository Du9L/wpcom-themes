jQuery( document ).ready( function( $ ) {

	/**
	 * Enables menu toggle for small screens
	 */
	( function() {
		var nav = $( '.main-navigation' ), button, menu;
		if ( ! nav ) {
			return;
		}

		button = nav.find( '.menu-toggle' );
		if ( ! button ) {
			return;
		}

		// Hide button if menu is missing or empty.
		menu = nav.find( '.menu' );
		if ( ! menu || ! menu.children().length ) {
			button.hide();
			return;
		}

		button.on( 'click.snaps', function() {
			nav.toggleClass( 'toggled-on' );
			$( this ).toggleClass( "active" );
			$( ".site-navigation" ).toggleClass( "open-menu" );
		} );

		// Fix sub-menus for touch devices.
		if ( 'ontouchstart' in window ) {

			menu.find( '.menu-item-has-children > a' ).on( 'touchstart.snaps', function( e ) {
				var el = $( this ).parent( 'li' );

				if ( ! el.hasClass( 'focus' ) ) {
					e.preventDefault();
					el.toggleClass( 'focus' );
					el.siblings( '.focus' ).removeClass( 'focus' );
				}
			} );
		}

		// Better focus for hidden submenu items for accessibility.
		menu.find( 'a' ).on( 'focus.snaps blur.snaps', function() {
			$( this ).parents( '.menu-item, .page_item' ).toggleClass( 'focus' );
		} );

	} )();


	/**
	 * Makes "skip to content" link work correctly in IE9 and Chrome for better accessibility
	 * @link http://www.nczonline.net/blog/2013/01/15/fixing-skip-to-content-links/
	 */
	$( window ).on( 'hashchange.snaps', function() {
		var hash = location.hash.substring( 1 ), element;
		if ( ! hash ) {
			return;
		}
		element = document.getElementById( hash );
		if ( element ) {
			if ( ! /^(?:a|select|input|button|textarea)$/i.test( element.tagName ) ) {
				element.tabIndex = -1;
			}
			element.focus();
			// Repositions the window on jump-to-anchor to account for header height.
			window.scrollBy( 0, 0 );
		}
	} );


	/**
	 * Fixes 'hover' behavior on posts so titles will display on tough devices
	 */
	if ( 'ontouchstart' in window ) {
		var posts = $('#projects');
		posts.find( '.jetpack-portfolio a.block-link' ).on( 'touchstart.snaps', function( e ) {

			var el = $( this ).closest( '.jetpack-portfolio' );

			if ( ! el.hasClass( 'highlight' ) ) {
				e.preventDefault();
				el.toggleClass( 'highlight' );
				el.siblings( '.highlight' ).removeClass( 'highlight' );
			}
		} );
	}
} );
