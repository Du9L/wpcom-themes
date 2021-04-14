( function( $ ) {

	$( document ).ready( function() {
		$( '.menu-toggle button' ).off( 'click' );

		$( '.menu-toggle button' ).on( 'click', function() {
			$( this ).parents( '.menu' ).children( '.wrap' ).slideToggle( 'fast' ).toggleClass( 'open' );
			$( this ).toggleClass( 'active' );
		});

		$( '#site-menu-toggle' ).on( 'click', function() {
			// Remove mejs players from sidebar
			$( '#secondary .mejs-container' ).each( function( i, el ) {
				if ( mejs.players[ el.id ] ) {
					mejs.players[ el.id ].remove();
				}
			} );

			// Class is added after menu is opened, so if it's not there on-click, menu is getting opened
			if ( ! $( '#site-menu' ).hasClass( 'site-menu-open') ) {

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
	});

})( jQuery );
