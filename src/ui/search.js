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

			var container = $(options.list);
			var list = container.find("ul").on('click', '.search-item', function(e)
			{
				container.removeClass('open');
				e.preventDefault();
				options.handler($(this));
			});

			var onSearchResults = function(data)
			{
				if (!data) return;

				container.addClass('open');

				if (!data.length)
				{
					list.html("<li class='empty'>" + options.empty + "</li>");
				}
				else
				{
					var items = [];
					var html = "";
					for (var i = 0; i < data.length; i++)
					{
						var d = data[i];
						html += "<li><button class='btn btn-link search-item' data-uri='" + d.uri + "'>#" + d.name + "</button></li>";
					}
					list.html(html);
				}
			};

			$(this).keyup(function(event)
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