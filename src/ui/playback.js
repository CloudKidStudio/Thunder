(function($){

	$.fn.playback = function()
	{
		// Only can play one sound at a time
		// this is the current audio sound playing
		var current;

		var onAudioEnded = function(audio)
		{
			resetButton(audio);
			// Reset play button to play-arrow icon 
			current.removeClass("active");
			current = null;
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
		};

		return this.click(function()
		{
			var audio = null; //{jquery}
			var isSame = null; //{boolean}
			var tempPlayButton = $(this);

			// Stop the current
			if (current)
			{
				resetButton(current.find("audio"));
				if (current.data('assetid') == tempPlayButton.data('assetid'))
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

			current = tempPlayButton;
			audio = current.find("audio");

			// If playback ends on its own
			audio.on('ended', onAudioEnded.bind(this, audio));
			audio[0].play();
		});
	};
	
}(jQuery));