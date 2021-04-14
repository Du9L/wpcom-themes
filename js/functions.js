/**
 * Theme functions file.
 *
 * Contains handlers for the navigation and other elements.
*/

( function( $ ) {
	// Add some nice underlines to the posts navigation
	$( '.post-navigation a' ).each( function( i, node ) {
		node.innerHTML = '<span>' + node.innerHTML + '</span>';
	} );

	// Remove empty .entry-headers
	$( '.entry-header' ).each( function(i, node ) {
		if ( 0 === $( node ).children().length  ) {
			$( node ).remove();
		}
	} );

	// Remove underline from links with images
	$(' .entry-content a img ').each( function( i, node ) {
		$( node ).parents( 'a' ).addClass( 'no-underline' );
	} );

	// Initialize the mobile navigation interface
	( function() {
		var primaryMenu = $( '#primary-menu' );

		// Clone the nav to create the mobile nav
		if ( primaryMenu.length ) {
			var mobileMenu = primaryMenu.clone()
				.attr( 'id', 'mobile-menu' )
				.appendTo( '#masthead .site-header-main' )
				.wrap( '<nav id="mobile-navigation" class="main-navigation inner" role="navigation">' );

			// Using prepend to allow using adjacent sibling selector to target the link
			mobileMenu
				.find( 'li.menu-item-has-children' )
				.prepend( '<button class="dropdown-toggle" aria-expanded="false"></button>' );
				
			// Fix sub-menus for touch devices and better focus for hidden submenu items for accessibility.
			if ( 'ontouchstart' in window ) {
				primaryMenu.find( '.menu-item-has-children > a' ).on( 'touchstart.franklin', function( e ) {
					var li = $( this ).parent( 'li' );

					if ( ! li.hasClass( 'focus' ) ) {
						e.preventDefault();
						li.toggleClass( 'focus' );
						li.siblings( '.focus' ).removeClass( 'focus' );
					}
				} );
			}
			
			// Toggle focus class on focus & blur events
			primaryMenu.find( 'a' ).on( 'focus.franklin blur.franklin', function() {
				$( this ).parents( '.menu-item' ).toggleClass( 'focus' );
			} );
		}
	} )();

	// Swap post format link and post tags on tablet size and smaller
	( function() {
		var win = $( window );

		var links = $( '.entry-footer .meta-wrapper .post-format-link:not(:only-child)' ).each( function( i, node ) {
			var link = $( node ), tags = link.prev( 'ul.post-tags' );
			win.bind( 'resize.franklin', function() {
				if ( win.outerWidth() < 768 ) {
					if ( link.prev().is( tags ) ) {
						link.insertBefore( tags );
					}
				} else if ( link.next().is( tags ) ) {
					link.insertAfter( tags );
				}
			});
		} );

		if ( links.length > 0 ) {
			win.trigger( 'resize.franklin' );
		}
	} )();
} )( jQuery );