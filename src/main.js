(function()
{
    // These scripts apply to all pages
    // regardless of content

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
    
    // Confirm action
    $('[data-toggle="confirm"]').click(function(e)
    {
        var message = $(this).data('message') || "Are you sure?";
        if (!confirm(message))
        {
            e.preventDefault();
        }
    });

}());