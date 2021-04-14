jQuery(document).ready(function($) {

	// Cool header image scroll
	$(window).scroll(function(e){
		if ($(window).width() > 800) {
			$('.site-header-image').css({
				'bottom' : -($(this).scrollTop()/3)+"px",
			});
			var thisdist = $(this).scrollTop();
			var headerheight = $(".site-header-image").outerHeight();
			$('.site-branding-wrapper').css({
				'opacity' : (1 - thisdist/headerheight)
			});
		} else {
			$('.site-header-image').css({'bottom' : 'auto'});
			$('.site-branding-wrapper').css({'opacity' : "1" });
		}
	});

	// Smooth scroll to header
    $('.tothetop').click(function(){
		$('html,body').animate({scrollTop: 0}, 500);
		$(this).unbind("mouseenter mouseleave");
        return false;
    });

    // Triggers resize event to make sure video widgets in the footer maintain the correct aspect ratio
    $( window ).on( 'load', function() {
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


});
