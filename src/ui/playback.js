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