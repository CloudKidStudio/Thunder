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
				options.selected($(this).data('tag'));

				if (options.autoClear)
				{
					clear();
				}
			});

			var clear = function()
			{
				input.val("");
				list.empty();
				container.removeClass('open');
			};

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
			input.keydown(function(e){
				// Stop the enter key press
				if (e.keyCode == 13)
				{
					e.preventDefault();
				}
			})
			.keyup(function(e)
			{
				var active = list.find('.active');
				if (e.keyCode == 38) // up
				{
					if (active.length)
					{
						active.removeClass('active')
							.prev().addClass('active');
					}
					e.preventDefault();
				}
				else if (e.keyCode == 40) // down
				{
					if (active.length)
					{
						active.removeClass('active')
							.next().addClass('active');
					}
					else
					{
						list.find('li:first').addClass('active');
					}
					e.preventDefault();
				}
				else if (e.keyCode == 13) //enter
				{
					if (active.length)
					{
						active.find('.search-item').click();
						e.preventDefault();
					}
					else if (options.enterPress && this.value)
					{
						options.enterPress.call(this);
						e.preventDefault();
						clear();
					}
				}
				else
				{
					if (!this.value)
					{
						clear();
					}
					else
					{
						this.value = this.value.toLowerCase();
						$.post(options.service, { search: this.value }, onSearchResults);
					}
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