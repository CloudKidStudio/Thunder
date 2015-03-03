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

    ///// AUDIO PLAYBACK
    var currPlayButton;
    $(".sample-audio").click(function()
    {
        var audio = null; //{Element}
        var isSame = null; //{boolean}
        var tempPlayButton = $(this);
        if (currPlayButton)
        {
            resetButton(currPlayButton.find("audio"));
            if (currPlayButton[0].dataset.assetid == tempPlayButton[0].dataset.assetid)
            {
                // User manually stopped the audio, don't restart! 
                currPlayButton = null;
                return;
            }
            else
            {
                // Reset play button to play-arrow icon 
                currPlayButton.removeClass("active");
            }
        }

        currPlayButton = tempPlayButton;
        audio = currPlayButton.find("audio");

        // console.log("binding to ended " + currPlayButton);
        // If playback ends on its own
        audio.on('ended', onAudioEnded.bind(this, audio));
        audio[0].play();
    });

    var onAudioEnded = function(audio)
    {
        // console.log('onEnded curr: ' + currPlayButton + ' audio: ' + this);
        resetButton(audio);
        // Reset play button to play-arrow icon 
        currPlayButton.removeClass("active");
        currPlayButton = null;
        audio.off('ended');
    };

    var resetButton = function(audio)
    {
        // ~szk: "btn.removeClass("active");" can NOT be within this 
        // reset button function or else bootstrap will reapply 
        // ".active" to the element
        audio.off('ended');
        audio[0].pause();
        audio[0].currentTime = 0;
    }; ///// END AUDIO PLAYBACK

    $('.content-select').change(function(){
        $(this).closest('form').submit();
    });

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

    ///// SEARCH FUNCTIONALITY
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
        {
            searchDiv.addClass('open');
        }
    });

    searchBar.blur(function(event)
    {
        if (event && event.relatedTarget && event.relatedTarget.href)
        {
            event.relatedTarget.click();
        }
        else
        {
            searchDiv.removeClass('open');
        }
    });

    /**
     * Update the search field drop down menu
     * @param {Array->TagSchema} results from the dat
     */
    var onSearchResults = function(data)
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
             * if there is no .length to the data, user has likely:
             *  a. made a typo
             *  b. is trying to find an tag not in the database
             * ~szk: originally, this was an empty <li> so that the element
             * didn't awkwardly disappear (or really, oddly resize itslef)
             * but, a derp-face is just so much better, IMHO
             */
            searchList.append("<li style='margin:0 auto'>（。々°）</li>");
        }
    };
    ///// SEARCHFUNCTIONALITY
}());
//# sourceMappingURL=main.js.map