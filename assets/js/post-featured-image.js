document.addEventListener('DOMContentLoaded', function () {
	document.querySelectorAll( '.wp-block-group' ).forEach( function( group ) {
		const title = group.querySelector( '.wp-block-post-title a' );
		const image = group.querySelector( '.wp-block-post-featured-image img' );

		if ( title && image ) {
			title.addEventListener( 'mouseenter', function() {
				image.classList.add( 'is-hovered' );
			} );

			title.addEventListener('mouseleave', function() {
				image.classList.remove('is-hovered');
			} );
		}
	} );
} );
