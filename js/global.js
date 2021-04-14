( function( $ ) {

	var slideMenu = $( '.site-navigation' );
	var menuToggle = $( '.nav-toggle' );
	
	slideMenu.attr( 'aria-hidden', 'false' );
	menuToggle.attr( 'aria-expanded', 'true' );
	
	var toggleAria = function( selector, property ) {
		if ( 'false' === selector.attr( property ) ) {
			selector.attr( property, 'true' );
		}
		else {
			selector.attr( property, 'false' );
		}
	};
	
	$(document).ready( function() {
		// toggle blog-menu
		menuToggle.on( 'click', function() {
			$( this ).toggleClass( 'active' );
			slideMenu.slideToggle( function () {
				slideMenu.css( 'overflow', 'visible' );
				
				toggleAria( slideMenu, 'aria-hidden' );
				toggleAria( menuToggle, 'aria-expanded' );
				
			} );
			
			var container = $( '.blog-menu' );
	
			// Fix child menus for touch devices.
			function fixMenuTouchTaps( container ) {
				var touchStartFn,
					parentLink = container.find( '.menu-item-has-children > a, .page_item_has_children > a' );

				if ( 'ontouchstart' in window ) {
					touchStartFn = function( e ) {
						var menuItem = this.parentNode;

						if ( ! menuItem.classList.contains( 'focus' ) ) {
							e.preventDefault();
							for( var i = 0; i < menuItem.parentNode.children.length; ++i ) {
								if ( menuItem === menuItem.parentNode.children[i] ) {
									continue;
								}
								menuItem.parentNode.children[i].classList.remove( 'focus' );
							}
							menuItem.classList.add( 'focus' );
						} else {
							menuItem.classList.remove( 'focus' );
						}
					};

					for ( var i = 0; i < parentLink.length; ++i ) {
						parentLink[i].addEventListener( 'touchstart', touchStartFn, false )
					}
				}
			}

			fixMenuTouchTaps( container );
		} );
	} );

})( jQuery );