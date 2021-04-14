/**
 * navigation.js
 *
 * Handles toggling the navigation menu for small screens and enables tab
 * support for dropdown menus.
 */
( function() {
	var container, mobileContainer, button, buttonLabel, menu, mobileMenu, links, subMenus, expanders;

	container = document.getElementById( 'site-navigation' );
	if ( ! container ) {
		return;
	}

	mobileContainer = document.getElementById( 'mobile-navigation' );
	if ( ! mobileContainer ) {
		return;
	}

	button = container.getElementsByTagName( 'button' )[0];
	if ( 'undefined' === typeof button ) {
		return;
	}

	menu = container.getElementsByTagName( 'ul' )[0];
	mobileMenu = mobileContainer.getElementsByTagName( 'ul' )[0];
	buttonLabel = button.innerHTML;

	// Hide menu toggle button if menu is empty and return early.
	if ( 'undefined' === typeof menu ) {
		button.style.display = 'none';
		return;
	}

	menu.setAttribute( 'aria-expanded', 'false' );
	if ( -1 === menu.className.indexOf( 'nav-menu' ) ) {
		menu.className += ' nav-menu';
	}

	button.onclick = function() {
		if ( -1 !== mobileContainer.className.indexOf( 'toggled' ) ) {
			mobileContainer.className = container.className.replace( ' toggled', 'inner' );
			button.setAttribute( 'aria-expanded', 'false' );
			mobileMenu.setAttribute( 'aria-expanded', 'false' );
			button.innerHTML = buttonLabel;
		} else {
			mobileContainer.className += ' toggled inner';
			button.setAttribute( 'aria-expanded', 'true' );
			mobileMenu.setAttribute( 'aria-expanded', 'true' );
			button.innerHTML = button.getAttribute( 'data-close-label' );
		}
	};

	// Get all the link elements within the menu.
	links     = menu.getElementsByTagName( 'a' );
	subMenus  = menu.getElementsByTagName( 'ul' );
	expanders = mobileMenu.getElementsByClassName( 'dropdown-toggle' );

	// Set menu items with submenus to aria-haspopup="true".
	for ( var i = 0, len = subMenus.length; i < len; i++ ) {
		subMenus[i].parentNode.setAttribute( 'aria-haspopup', 'true' );
	}

	// Each time a menu link is focused or blurred, toggle focus.
	for ( i = 0, len = links.length; i < len; i++ ) {
		links[i].addEventListener( 'focus', toggleFocus, true );
		links[i].addEventListener( 'blur', toggleFocus, true );
	}

	// Setup expander click events
	for (i = 0, len = expanders.length; i < len; i++ ) {
		expanders[i].onclick = function() {
			if ( 'true' === this.getAttribute( 'aria-expanded' ) ) {
				this.setAttribute( 'aria-expanded', 'false' );
				this.parentNode.setAttribute( 'aria-expanded', 'false' );
			} else {
				this.setAttribute( 'aria-expanded', 'true' );
				this.parentNode.setAttribute( 'aria-expanded', 'true' );
			}
		}
		expanders[i].focus = function() {
			var event = document.createEvent( 'HTMLEvents' );
			event.initEvent( 'blur', true, false );
			this.dispatchEvent(event);
		}
	}

	/**
	 * Sets or removes .focus class on an element.
	 */
	function toggleFocus() {
		var self = this;

		// Move up through the ancestors of the current link until we hit .nav-menu.
		while ( -1 === self.className.indexOf( 'nav-menu' ) ) {

			// On li elements toggle the class .focus.
			if ( 'li' === self.tagName.toLowerCase() ) {
				if ( -1 !== self.className.indexOf( 'focus' ) ) {
					self.className = self.className.replace( ' focus', '' );
				} else {
					self.className += ' focus';
				}
			}

			self = self.parentElement;
		}
	}
} )();
