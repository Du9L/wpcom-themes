/**
 * Custom js for sapor
 */

( function( $ ) {
    var $document = $( document ),
      slideMenu = $( '.sidebar' ),
      body = $( 'body' ),
      actionText = $('.action-text'),
      menuToggle = $( '.menu-toggle' );

    /**
    * Sliding panel
    *
    * Swaps classes for sliding panel so it uses CSS transformations.
    *
    */
    function slideControl() {
        menuToggle.on( 'click', function( e ) {
            e.stopPropagation();
            var $this = $( this );

            slideMenu.toggleClass( 'expanded' ).resize();
            body.toggleClass( 'sidebar-open' );

            $this.toggleClass( 'toggle-on' );
            $this.attr( 'aria-expanded', $( this ).attr( 'aria-expanded' ) == 'false' ? 'true' : 'false');

            if( slideMenu.hasClass( 'expanded' ) ) {
                actionText.text( 'close' );
            } else {
                actionText.text( 'show' );
            }
        } );

        //Close slide menu with double click
        body.on( 'dblclick', function( e ) {
            slideMenu.removeClass( 'expanded' ).resize();
            $( this ).removeClass( 'sidebar-open' );
            menuToggle.removeClass( 'toggle-on' );
        } );

    }

    /**
    * Close slide menu with escape key
    *
    * Adds in this functionality
    *
    */
    $document.keyup( function( e ) {
        if ( e.keyCode === 27 && slideMenu.hasClass( 'expanded' ) ) {
            body.removeClass( 'sidebar-open' );
            menuToggle.removeClass( 'toggle-on' );
            slideMenu.removeClass( 'expanded' ).resize();

            if( slideMenu.hasClass( 'expanded' ) ) {
                actionText.text( 'close' );
            } else {
                actionText.text( 'show' );
            }
        }
    } );

	/**
    * Navigation sub menu show and hide
    *
    * Show sub menus with an arrow click to work across all devices
    * This switches classes and changes the genericon.
    *
    */
    $( '.main-navigation .page_item_has_children > a, .main-navigation .menu-item-has-children > a' ).append( '<button class="showsub-toggle" aria-expanded="false"></button>' );

    $( '.showsub-toggle' ).click( function( e ) {
        e.preventDefault();
        var $this = $( this );
        $this.toggleClass( 'sub-on' );
        $this.parent().next( '.children, .sub-menu' ).toggleClass( 'sub-on' );
        $this.attr( 'aria-expanded', $this.attr( 'aria-expanded' ) == 'false' ? 'true' : 'false');
    } );

    $document.ready( function() {
        slideControl();
    } );

} )( jQuery );
