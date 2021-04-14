( function( $ ) {
	var $body = $( 'body' );
	var $window = $( window );

	// Add dropdown toggle that display child menu items.
	$( '.main-navigation .menu-item-has-children > a' ).after( '<button class="dropdown-toggle" aria-expanded="false">' + screenReaderText.expand + '</button>' );

	// Toggle buttons and submenu items with active children menu items.
	$( '.main-navigation .current-menu-ancestor > a' ).addClass( 'toggled' );
	$( '.main-navigation .current-menu-ancestor > button' ).addClass( 'toggled' );
	$( '.main-navigation .current-menu-ancestor > .sub-menu' ).addClass( 'toggled' );

	// Click on dropdown toggle.
	$( '.dropdown-toggle' ).click( function( e ) {
		var _this = $( this );
		e.preventDefault();
		_this.toggleClass( 'toggled' );
		_this.prev( 'a' ).toggleClass( 'toggled' );
		_this.next( '.children, .sub-menu' ).toggleClass( 'toggled' );
		_this.attr( 'aria-expanded', _this.attr( 'aria-expanded' ) === 'false' ? 'true' : 'false' );
		_this.html( _this.html() === screenReaderText.expand ? screenReaderText.collapse : screenReaderText.expand );
	} );

	// Calculate the position of main content
	function contentPosition() {

		if( $( window ).width() >= 748 ) {

			var toolbarHeight = $body.is( '.admin-bar' ) ? $( '#wpadminbar' ).height() : 0;

			$( '.site-main' ).css( {
				'margin-top'  : ( 72 - toolbarHeight ) + 'px',
			} );

		} else {

			$( '.site-main' ).css( { 'margin-top'  : 'auto' } );

		}

	}

	// Adjust website title font-size to fit its container
	function resizeTitle( el ) {

		var $el = $( el ),
			$parent = $( el ).parent(),
			$parentWidth = $el.parent().width(),
			fontSize = parseInt( $( el ).css( 'font-size' ), 10 );

		if ( $el.width() > $parentWidth ) {

			while ( $el.width() > $parentWidth && fontSize > 18 ) {
				$el.css( 'font-size', --fontSize + 'px' );
				$parent.css( 'line-height', fontSize * 1.5 + 'px' );
			}

		} else {

			while ( $el.width() < $parentWidth && fontSize < 42 ) {
				$el.css( 'font-size', ++fontSize + 'px');
				$parent.css( 'line-height', fontSize * 1.3 + 'px' );
			}

		}
	}

	// Add extra class to large images in single project view. Props to Intergalactic theme
	function outdentImages() {
		$( '.jetpack-portfolio.hentry .entry-content img' ).each( function() {
			var img 	= $( this ),
				caption = $( this ).closest( 'figure' ),
				imgPos  = $( this ).offset().top,
				metaPos = $( '.entry-meta' ).offset().top + $( '.entry-meta' ).height() + 21,
				new_img = new Image();

				new_img.src = img.attr( 'src' );

				$( new_img ).load( function() {

					var img_width = new_img.width;

					if ( imgPos > metaPos ) {
						if ( img_width >= 880 ) {
							$( img ).addClass( 'size-big' );
						}

						if ( caption.hasClass( 'wp-caption' ) && img_width >= 880 ) {
							caption.addClass( 'caption-big' );
						}
					} else {
						return;
					}

			} );
		} );
	}

	// Initialize functions
	$( function() {
		resizeTitle( '.site-title a' );
		$( '.site-title a' ).animate( {
			'opacity': 1
		}, 500 );

		outdentImages();

		contentPosition();
		$( '#primary' ).animate( {
			'opacity': 1
		}, 500 );

		$('.entry-content a img, .entry-summary a img, .page-content a img').parent().css('border','none');
	});

	$( window ).on( 'resize', function() {
		resizeTitle( '.site-title a' );
		contentPosition();
	} );

	// Attach resizeTitle function to window, to be able to use it in Customizer
	window.blaskResizeTitle = resizeTitle;

	$( window ).on( 'load', function() {

		// Triggers resize event to make sure video widgets in the footer maintain the correct aspect ratio
		setTimeout( function(){
			if ( typeof( Event ) === 'function' ) {
				window.dispatchEvent( new Event( 'resize' ) );
			} else {
				var event = window.document.createEvent( 'UIEvents' );
				event.initUIEvent( 'resize', true, false, window, 0 );
				window.dispatchEvent( event );
			}
		} );
	});

} )( jQuery );
