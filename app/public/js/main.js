(function($){

	$.fn.playback = function()
	{
		// Only can play one sound at a time
		// this is the current audio sound playing
		var current;

		var onAudioEnded = function()
		{
			resetButton(current);
			current.removeClass("active");
			current.data('audio').off('ended timeupdate');
			current = null;
		};

		var onProgress = function(progress)
		{
			progress.width((this.currentTime / this.duration * 100) + "%");
		};

		var resetButton = function(button)
		{
			button.data('progress').width(0).parent().removeClass('on');
			var audio = button.data('audio')
				.off('ended timeupdate');
			audio[0].pause();
			audio[0].currentTime = 0;
		};

		return this.each(function()
		{
			var button = $(this);
			var progress = $(button.data('progress'));
			var audio = button.find('audio');

			button.data('progress', progress)
				.data('audio', audio);

			resetButton(button);

			button.click(function()
			{
				// Stop the current
				if (current)
				{
					resetButton(current);
					if (current === button)
					{
						// User manually stopped the audio, don't restart! 
						current = null;
						return;
					}
					else
					{
						// Reset play button to play-arrow icon 
						current.removeClass("active");
					}
				}

				current = button;
				progress.width(0).parent().addClass('on');

				// If playback ends on its own
				audio.on('ended', onAudioEnded);
				audio.on('timeupdate', onProgress.bind(audio[0], progress));
				audio[0].play();
			});
		});
	};
	
}(jQuery));
(function($){
	
	/**
	 * Search setup
	 * @param  {object} options The options
	 * @param {string} options.service The service end-point to search
	 * @param {string} options.list The select where to add the tags to,
	 *        must contain a ul.
	 * @return {jquery} For chaining
	 */
	$.fn.tagSearch = function(options)
	{
		return this.each(function(){

			var input = $(this);
			var container = $(options.list);
			var list = container.find("ul").on('click', '.search-item', function(e)
			{
				container.removeClass('open');
				e.preventDefault();
				options.selected($(this).data('tag'));
			});

			var onSearchResults = function(tags)
			{
				if (!tags) return;

				container.addClass('open');

				if (!tags.length)
				{
					list.html("<li class='empty'>" + options.empty + "</li>");
				}
				else
				{
					var items = [];
					var item;
					var search = input.val();
					for (var i = 0; i < tags.length; i++)
					{
						var tag = tags[i];
						item = $("<li><button class='btn btn-link search-item'></button></li>");
						item.find('button')
							.html("#" + tag.name.replace(
								search, "<strong>" + search + "</strong>"
							))
							.data('tag', tag);
						items.push(item);
					}
					list.html(items);
				}
			};

			input.keyup(function(event)
			{
				if (!this.value)
				{
					list.empty();
					container.removeClass('open');
				}
				else if (this.value.length > 0)
				{
					$.post(options.service, { search: this.value }, onSearchResults);
				}
			}).focus(function(event)
			{
				// Is there at least one li for the current search?
				// If not, don't open until user starts typing
				if (list.find("li").length)
				{
					container.addClass('open');
				}
			}).blur(function(event)
			{
				if (!$(event.relatedTarget).hasClass('search-item'))
				{
					container.removeClass('open');
				}
			});
		});
	};

}(jQuery));
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
                if (true) console.log(data);
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
        empty: "（。々°）",
        selected: function(tag)
        {
            document.location.href = '/tag/' + tag.uri;
        }
    });
    
}());
//# sourceMappingURL=main.js.map