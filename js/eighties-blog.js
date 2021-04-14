/**
 * Eighties Blog & Archive JavaScript
 *
 * The main JavaScript file for Eighties. Sets up
 * the navigation and sidebar toggles.
*/
( function( $ ) {
	$( '.format-image' ).each( function( index, element ) {
		var id = '#' + element.id;

		if ( $( id ).hasClass( 'has-post-thumbnail' ) ) {
			$( id ).backstretch( $( id + ' .entry-summary' ).data( 'backstretch' ) ).find( '.entry-image img' ).css( 'visibility', 'hidden' );
		}
	});

	// Custom event for loading when using infinite scroll.
	$( document.body ).on( 'post-load', function() {
		$( '.format-image' ).each( function( index, element ) {
			var id = '#' + element.id;

			if ( $( id ).hasClass( 'has-post-thumbnail' ) ) {
				$( id ).backstretch( $( id + ' .entry-summary' ).data( 'backstretch' ) ).find( '.entry-image img' ).css( 'visibility', 'hidden' );
			}
		});
	});
} )( jQuery );
