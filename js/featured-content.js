( function( $ ) {

	$( window ).load( function() {

		/* Use Featured Image as a Background Image */
		var featuredContent = $( '#featured-content' );
		if ( ! featuredContent.length ) {
			return;
		}

		featuredContent.find( 'article' ).each( function() {
			if ( ! $( this ).hasClass( 'background-done' ) && $( this ).hasClass( 'has-post-thumbnail' ) && ( $( this ).hasClass( 'format-image' ) || $( this ).hasClass( 'format-gallery' ) || $( this ).hasClass( 'format-standard' ) || $( this ).hasClass( 'page' ) ) ) {
				var entryImage = $( this ).find( '.post-thumbnail' ),
				    thumbnail = $( this ).find( 'img' );
				entryImage.css( 'background-image', 'url(' + thumbnail.attr( 'src' ) + ')' );
				$( this ).addClass( 'background-done' );
			}
		} );

	} );

} )( jQuery );
