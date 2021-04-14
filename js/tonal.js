(function($) {

    $(document).ready(function() {

        function showSection() {

            var menu = $('#menu-nav');
            var menuShow = $('#menu-block');

            function switchClass($myvar) {
                if ($myvar.hasClass('active')) {
                    $myvar.removeClass('active');
                } else {
                    $myvar.addClass('active');
                }
            }

            menu.on('click', function() {
                switchClass($(this));
                menuShow.slideToggle().resize();

                // Remove mejs players from sidebar
				$( '.widget-areas .mejs-container' ).each( function( i, el ) {
					if ( mejs.players[ el.id ] ) {
						mejs.players[ el.id ].remove();
					}
				} );

				if ( $( this ).hasClass( 'active' ) ) {
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

            });

        }

        $(window).on('load', showSection);
    });

    /*
     * A function to move the image above the entry-title if post format is image.
     * A function to move the video above the entry-title if post format is video.
     */
    function post_format() {
        var image = $('.format-image.hentry img'),
            video = $('.hentry.format-video .jetpack-video-wrapper');

        image.each(function() {
            $(this).first().prependTo($(this).closest('.format-image.hentry'));
            $(this).addClass('active');
            $(this).show();
        });

        video.each(function() {
            $(this).first().prependTo($(this).closest('.hentry.format-video'));
            $(this).addClass('active');
            $(this).show();
        });
    }
    $(window).load(post_format);
    $(document).on('post-load', post_format);

})(jQuery);
