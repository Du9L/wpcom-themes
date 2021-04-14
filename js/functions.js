/* global screenReaderText */
/* global toggleButtonText */
/**
 * Theme functions file.
 *
 * Contains handlers for navigation and widget area.
 */

( function( $ ) {
	var $body             = $( document.body ),
	    $window           = $( window ),
	    sidebar           = $( '#sidebar' ),
	    widgets           = sidebar.find( '#secondary' ),
	    social            = sidebar.find( '#social-navigation' ),
	    sidebarMenu       = sidebar.find( '.main-navigation' ),
	    masthead          = $( '#masthead' ),
	    sidebarToggle     = masthead.find( '#sidebar-toggle' ),
	    menu              = masthead.find( '.nav-menu' ),
	    mastheadHeight    = masthead.outerHeight(),
	    headerImageHeight = $( '.header-image' ).length ? $( '.header-image' ).height() : 0,
	    windowWidth       = window.innerWidth,
	    toolbarHeight,
	    resizeTimer;

	// Add dropdown toggle that display child menu items.
	$( '#sidebar .main-navigation .menu-item-has-children > a' ).after( '<button class="dropdown-toggle" aria-expanded="false">' + screenReaderText.expand + '</button>' );

	// Toggle buttons and submenu items with active children menu items.
	$( '#sidebar .main-navigation .current-menu-ancestor > button' ).addClass( 'toggle-on' );
	$( '#sidebar .main-navigation .current-menu-ancestor > .sub-menu' ).addClass( 'toggled-on' );

	$( '.dropdown-toggle' ).click( function( e ) {
		var _this = $( this );
		e.preventDefault();
		_this.toggleClass( 'toggle-on' );
		_this.next( '.children, .sub-menu' ).toggleClass( 'toggled-on' );
		_this.attr( 'aria-expanded', _this.attr( 'aria-expanded' ) === 'false' ? 'true' : 'false' );
		_this.html( _this.html() === screenReaderText.expand ? screenReaderText.collapse : screenReaderText.expand );
	} );

	// Move the Page Links before Sharedaddy.
	$( '.single .hentry' ).each( function() {
		$( this ).find( '.page-links' ).insertBefore( $( this ).find( '.sharedaddy' ).first() );
	} );

	// Enable sidebar toggle.
	( function() {
		if ( ! sidebar || ! sidebarToggle ) {
			return;
		}

		// Hide button if there are no widgets and the menus are missing or empty.
		if ( ! widgets.length && ! social.length && ( ! sidebarMenu || ! sidebarMenu.children().length ) ) {
			sidebarToggle.hide();
			return;
		}

		// Add a toggle button text.
		sidebarToggle.append( toggleButtonText.widgets );

		// Add an initial value for the attribute.
		$( sidebarToggle ).add( sidebar ).attr( 'aria-expanded', 'false' );

		sidebarToggle.on( 'click.resonar', function() {
			$body.toggleClass( 'sidebar-open' ).trigger( 'resize' );
			$( this ).toggleClass( 'toggled-on' );
			$( this ).add( sidebar ).attr( 'aria-expanded', $( this ).add( sidebar ).attr( 'aria-expanded' ) === 'false' ? 'true' : 'false');

			// Remove mejs players from sidebar
			$( '#secondary .mejs-container' ).each( function( i, el ) {
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
		} );
	} )();

	// Fix sub-menus for touch devices and better focus for hidden submenu items for accessibility.
	( function() {
		if ( ! menu || ! menu.children().length ) {
			return;
		}

		if ( 'ontouchstart' in window ) {
			menu.find( '.menu-item-has-children > a' ).on( 'touchstart.resonar', function( e ) {
				var el = $( this ).parent( 'li' );

				if ( ! el.hasClass( 'focus' ) ) {
					e.preventDefault();
					el.toggleClass( 'focus' );
					el.siblings( '.focus' ).removeClass( 'focus' );
				}
			} );
		}

		menu.find( 'a' ).on( 'focus.resonar blur.resonar', function() {
			$( this ).parents( '.menu-item' ).toggleClass( 'focus' );
		} );
	} )();

	// Make Featured image full-screen.
	function fullscreenFeaturedImage() {
		var entryHeaderBackground = $( '.entry-header-background' ),
		    entryHeaderOffset     = 0;

		if ( ! entryHeaderBackground ) {
			return;
		}

		// 1088 is site-main width.
		if ( 1088 < $window.width() ) {
			entryHeaderOffset = ( $window.width() - 1088 ) / 2;
		}

		toolbarHeight = $body.is( '.admin-bar' ) ? $( '#wpadminbar' ).height() : 0;

		entryHeaderBackground.css( {
			'height': $window.height() - ( toolbarHeight + mastheadHeight + headerImageHeight ) + 'px',
			'margin-left': '-' + entryHeaderOffset + 'px',
			'margin-right': '-' + entryHeaderOffset + 'px'
		} );
	}

	// Minimum height for sidebar.
	function sidebarSize() {
		if ( ! sidebar ) {
			return;
		}

		toolbarHeight = $body.is( '.admin-bar' ) ? $( '#wpadminbar' ).height() : 0;

		var sidebarMinHeight  = $window.height() - ( toolbarHeight + mastheadHeight + headerImageHeight );

		sidebar.css( {
			'min-height': sidebarMinHeight + 'px'
		} );
	}

	// Scroll up when the arrow is clicked.
	function scroll() {
		if ( ! $( '#scroll-indicator' ) ) {
			return;
		}

		$( '#scroll-indicator' ).on( 'click.resonar', function() {
			$( 'html, body' ).animate( {
				scrollTop: $( '#entry-header' ).offset().top + 24
			}, 300  );
			return false;
		} );
	}

	// Add a class to change opacity of the arrow and to move the entry header.
	$( function() {
		if ( ! $( '#scroll-indicator' ) ) {
			return;
		}

		$window.on( 'scroll.resonar', function() {
			if ( 0 < $window.scrollTop() ) {
				$( '#scroll-indicator, #entry-header' ).addClass ( 'scrolled' );
			} else {
				$( '#scroll-indicator, #entry-header' ).removeClass ( 'scrolled' );
			}
		} );
	} );

	// Add body classes to modify layout.
	function bodyClasses() {
		if ( 925 <= windowWidth ) {
			var siteBrandingWidth   = masthead.find( '.site-branding' ).width() + 32,
		        mainNavigationWidth = masthead.find( '.main-navigation' ).width() - 16,
		        mastheadWidth       = masthead.width();

			if ( ! widgets.length && ! social.length ) {
				$body.addClass( 'no-sidebar' );
			} else {
				$body.removeClass( 'no-sidebar' );
			}

			if ( mastheadWidth < ( siteBrandingWidth + mainNavigationWidth + sidebarToggle.width() ) ) {
				$body.addClass( 'menu-left' );
			} else {
				$body.removeClass( 'menu-left' );
			}
		} else {
			$body.removeClass( 'no-sidebar, menu-left' );
		}
	}

	// Add a class to big image and caption >= 1088px.
	function bigImageClass() {
		$( '.entry-content img.size-full' ).each( function() {
			var img = $( this ),
			    caption = $( this ).closest( 'figure' ),
			    newImg = new Image();

			newImg.src = img.attr( 'src' );

			$( newImg ).load( function() {
				var imgWidth = newImg.width;

				if ( 1088 <= imgWidth ) {
					$( img ).addClass( 'size-big' );
				}

				if ( caption.hasClass( 'wp-caption' ) && 1088 <= imgWidth ) {
					caption.addClass( 'caption-big' );
					caption.removeAttr( 'style' );
				}
			} );
		} );
	}

	// Change the toggle button text.
	function toggleButtonTxt() {
		if ( 925 >= windowWidth ) {
			if ( ( sidebarMenu.length || social.length ) && widgets.length ) {
				sidebarToggle.html( toggleButtonText.both );
			} else if ( ( sidebarMenu.length || social.length ) && ! widgets.length ) {
				sidebarToggle.html( toggleButtonText.menu );
			} else {
				sidebarToggle.html( toggleButtonText.widgets );
			}
		} else {
			sidebarToggle.html( toggleButtonText.widgets );
		}
	}

	// Close Sidebar with an escape key.
	$( document ).keyup( function( e ) {
		if ( 27 === e.keyCode && sidebarToggle.hasClass( 'toggled-on' ) ) {
			$body.removeClass( 'sidebar-open' );
			sidebarToggle.removeClass( 'toggled-on' ).attr( 'aria-expanded', 'false' );
			sidebar.attr( 'aria-hidden', 'true' );
		}
	} );

	$( document ).ready( function() {
		$window.on( 'resize.resonar', function() {
			windowWidth = window.innerWidth;
			clearTimeout( resizeTimer );
			resizeTimer = setTimeout( function() {
				sidebarSize();
				fullscreenFeaturedImage();
				bodyClasses();
				toggleButtonTxt();
			}, 300 );
		} );

		sidebarSize();
		fullscreenFeaturedImage();
		bodyClasses();
		bigImageClass();
		toggleButtonTxt();
		scroll();
	} );
} )( jQuery );
