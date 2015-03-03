(function()
{
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

    // Add favorite
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

    $('[data-toggle="confirmation"]').each(function(){
        var button = $(this);
        button.confirmation({
            singleton: true,
            popout: true,
            btnOkLabel: "Yes",
            btnCancelLabel: "No",
            container: 'body',
            placement: button.data('placement') || "top"
        });
    });

}());