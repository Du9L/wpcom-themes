jQuery( document ).ready( function( $ ) {

	// Focus styles for menus.
	$( '.main-navigation' ).find( 'a' ).on( 'focus.plane blur.plane', function() {
		$( this ).parents().toggleClass( 'focus' );
	} );

	// Header search
	$( '.search-toggle' ).on( 'click.plane', function() {
		$( this ).toggleClass( 'active' );
		$( '.search-expand' ).fadeToggle( 250 );
           	setTimeout( function() {
				$( '.search-expand .search-field' ).focus();
 			}, 300 );
	});

});
