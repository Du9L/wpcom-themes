( function( $ ) {

	$( document ).ready( function() {

		var menuToggle   = $( ".menu-toggle" );
		var searchToggle = $( ".search-toggle" );
		var search       = $( ".mobile-search" );
		var menu         = $( ".main-navigation" );

		// Toggle mobile-menu
		menuToggle.on( "click", function(){
			$( this ).toggleClass( "active" );
			$( 'body' ).toggleClass( "toggle-active" );
			menu.slideToggle();

			if ( searchToggle.hasClass( "active" ) ) {
				searchToggle.removeClass( "active" );
				search.slideToggle();
			}
			return false;
		});


		// Toggle mobile-search
		searchToggle.on( "click", function(){
			$( this ).toggleClass( "active" );
			search.slideToggle();

			if ( menuToggle.hasClass( "active" ) ) {
				menuToggle.removeClass( "active" );
				menu.slideToggle();
			}
			return false;
		});


		// Hide/show mobile menu/search block > 1000
		$( window ).resize( function() {
			if ( $( window ).width() > 1000 ) {
				$( 'body' ).removeClass( "toggle-active" );
				menuToggle.removeClass( "active" );
				search.hide();
			}
		});

	});

})(jQuery);