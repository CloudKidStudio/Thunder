(function()
{
    // No tooltips on touch devices
    if (!("ontouchstart" in window ||
            window.DocumentTouch &&
            document instanceof DocumentTouch
        ))
    {
        $('[data-toggle="tooltip"]').tooltip(
        {
            container: 'body'
        });
    }

    // Toggle buttons
    $('.toggle').on('click', function()
    {
        $(this).toggleClass('active');
    });

    // Add favorite to user account
    $('.favorite').click(function()
    {
        $.post(
            '/favorites',
            {
                id: $(this).data('id')
            },
            function(data)
            {
                if (DEBUG) console.log(data);
            }
        );
    });

    // Select list to edit content
    $('.content-select').change(function(){
        $(this).parents('form').submit();
    });

    // Auto fill the uri
    $('[data-uri]').each(function(){
        var source = $(this);
        var target = $(source.data('uri'));
        source.keyup(function(){
            target.val(this.value
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^a-z0-9\-]/g, '')
            );
        });
    });

    // Make the buttons playable
    $(".sample-audio").playback();

    // Search functionality
    $("#search").tagSearch({
        list: "#search-list",
        service: '/search',
        empty: "（。々°）"
    });
    
}());