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

	// Add favorite
	$('.favorite').click(function(){
		$.post(
			'/favorites', 
			{ id: $(this).data('id') }, 
			function(data)
			{
				if (true) console.log(data);
			}
		);
	});

	$('[data-toggle="confirm"]').click(function(e){
		var message = $(this).data('confirm') || "Are you sure you want to continue?";
		if (!confirm(message))
		{
			e.preventDefault();
		}
	});

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