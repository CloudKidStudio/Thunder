(function()
{
	if (!("ontouchstart" in window || 
			window.DocumentTouch && 
			document instanceof DocumentTouch
	))
	{
		$('[data-toggle="tooltip"]').tooltip({
	    	container: 'body'
	    });
	}

}());
(function()
{
    // //require('js/ui/buttons');
    $('.toggle').on('click', function()
    {
        $(this).toggleClass('active');
    });
}());
//# sourceMappingURL=main.js.map