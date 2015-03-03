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

    $('.toggle').on('click', function()
    {
        $(this).toggleClass('active');
    });

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
                if (true) console.log(data);
            }
        );
    });


    var searchBar = $("#search");
    var searchDiv = $("#search-list");
    var searchList = searchDiv.find("ul");

    searchBar.keyup(function(event)
    {
        if (this.value.length > 0)
        {
            $.post(
                '/search',
                {
                    search: this.value
                },
                onSearchResults
            );
        }
    });

    searchBar.focus(function(event)
    {
        // Is there at least one li for the current search?
        // If not, don't open until user starts typing
        var hasLi = searchList.find("li")[0] ? true : false;
        if (hasLi)
            searchDiv.addClass('open');
    });

    searchBar.blur(function(event)
    {
        if (event && event.relatedTarget && event.relatedTarget.href)
            event.relatedTarget.click();
        else
            searchDiv.removeClass('open');
    });

    /**
     * Update the search field drop down menu
     * @param {Array->TagSchema} results from the dat
     */
    function onSearchResults(data)
    {
        if (!data)
            return;
        searchDiv.addClass('open');
        searchList.empty();
        if (data.length)
        {
            var items = [];
            for (var i = 0; i < data.length; i++)
            {
                var d = data[i];
                var list = "<li><a href='/tag/" + d.uri + "'>#" + d.name + "</a></li>";
                searchList.append(list);
            }
        }
        else
        {
            /**
            * if there is no .length to the data, user has likely
            *  a. made a typo
            *  b. is trying to find an tag not in the database
            * ~szk: originally, this was an empty <li> so that the element
            * didn't awkwardly disappear (or really, oddly resize itslef)
            * but, a derp-face is just so much better, IMHO
            */searchList.append("<li style='margin:0 auto'>（。々°）</li>");
        }
    }
    
}());
//# sourceMappingURL=main.js.map