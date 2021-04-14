(function($) {

	$(document).on( 'ready', function() {

		/*
		 * Toggle slide menu
		 */
		function slideControl() {
			$( '.menu-toggle' ).on( 'click', function( e ) {
				e.preventDefault();
				$( this ).toggleClass( 'toggle-on' );
				$( '.slide-menu' ).slideToggle( "fast" );

				// Remove mejs players from sidebar
				$( '#slide-menu .mejs-container' ).each( function( i, el ) {
					if ( mejs.players[ el.id ] ) {
						mejs.players[ el.id ].remove();
					}
				} );

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

				var container = $( '.main-navigation' );

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
		}

		/* Ensure linked and unlinked captioned images display with the same styles */
		function captionedImages() {
			var imgs = $( '.entry-content .wp-caption img' );

			for ( var i = 0; i < imgs.length; i++ ) {
				if ( $( imgs[i] ).width() >= 660 && $( imgs[i] ).height() >= 400 ) {
					$( imgs[i] ).parent( 'figure' ).addClass( 'large-caption' );
				};
			}
		}

		$(window).on( 'load', slideControl(), captionedImages() );

		/* Ensure captioned images display properly after IS loads */
		$(window).on( 'post-load', captionedImages() );

	});

})(jQuery);
