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
				if (DEBUG) console.log(data);
			}
		);
	});

}());