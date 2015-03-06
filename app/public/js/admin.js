(function(){
	
	// Admin section only scripts

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

	var template = $("#tagTemplate");
	var tags = $("#tags").on('click', '.tag', function(e)
	{
		$(this).remove();
	});

	var addTag = function(id, name, property)
	{
		tags.append(
			template.html().trim()
				.replace("%property%", property)
				.replace("%id%", id)
				.replace("%name%", name)
		);
	};

	// Search functionality
	var search = $("#search").tagSearch({
		list: "#search-list",
		service: '/search',
		empty: "Press [Enter] to add the new tag.",
		autoClear: true,
		selected: function(tag)
		{
			addTag(tag._id, tag.name, "tags");
			search.focus();
		},
		enterPress: function()
		{
			addTag(this.value, this.value, "newTags");
			search.val("");
		}
	});

}());
//# sourceMappingURL=admin.js.map