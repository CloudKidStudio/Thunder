(function(){
	
	// These scripts are specific to sound index pages
	// like home, categories, favorites and tag views

	// Toggle buttons like play and favorite
	$('.toggle').on('click', function()
	{
		$(this).toggleClass('active');
	});

	// Add favorite to user account
	$('.favorite').click(function()
	{
		$.post('/favorites', 
			{ id: $(this).data('id') },
			function(data)
			{
				if (DEBUG) console.log(data);
			}
		);
	});

	// Make the buttons playable
	$(".sample-audio").playback();

	// Search functionality
	$("#search").tagSearch({
		list: "#search-list",
		service: '/search',
		empty: "（。々°）",
		selected: function(tag)
		{
			document.location.href = '/tag/' + tag.uri;
		}
	});

}());