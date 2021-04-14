( function( $ ) {
	$( document ).ready( function() {

		// Focus styles for menus.
		$( '.main-navigation' ).find( 'a' ).on( 'focus.hew blur.hew', function() {
			$( this ).parents().toggleClass( 'focus' );
		} );

		$( '.widgets-toggle' ).click( function( e ) {

			e.preventDefault();

			$( 'body,html' ).animate( {
				scrollTop: 0
			}, 400 );

			// Remove mejs players from sidebar
			$( '#secondary .mejs-container' ).each( function( i, el ) {
				if ( mejs.players[ el.id ] ) {
					mejs.players[ el.id ].remove();
				}
			} );

			$( '#widgets-wrapper' ).slideToggle( 400, function() {} );
			$( '.widgets-toggle' ).toggleClass( 'open' );

			if ( $( '.widgets-toggle' ).hasClass( 'open' ) ) {
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

			// Trigger for Jetpack to display Tiled Gallery widget when top panel is open
			$( window ).trigger( 'resize' );
		});

		// Calculating how much space there is for website title, depending on whether site logo, widget & menu toggles are present
		function calcTitleWidth() {
			if ( 768 > $( document ).width() ) {
				var brandingWidth = $( '.site-header' ).innerWidth() - ( $( '.site-logo' ).outerWidth() + $( '.menu-toggle' ).outerWidth() + $( '.toggle-wrapper' ).outerWidth() );
				$( '.site-branding' ).css( 'width', brandingWidth + 'px' );
			} else {
				$( '.site-branding' ).css( 'width', 'auto' );
			}
		}

		$( document ).ready( function() {
			calcTitleWidth();
		} );

		$( window ).on( 'resize', function() {
			calcTitleWidth();
		} );

		$( document.body ).on( 'post-load', function () {
        	$( '.infinite-wrap .hentry:first-child' ).not( '.has-post-thumbnail' ).css( 'margin-top', '3.75em' );
    	} );

	} );
} )( jQuery );
