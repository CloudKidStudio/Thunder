var router = require('express').Router();
var Sound = require('../models/sound');

router.get('/:uri/:type(original|mp3|ogg)', function(req, res)
{
	Sound.getByUri(req.params.uri, function(err, sound)
	{
		if (!sound)
		{
			res.redirect('/');
		}
		else
		{
			var ext, path;

			// Select which download to use
			switch(req.params.type)
			{
				case 'original' : 
					ext = sound.type;
					path = 'original'; 
					break;
				case 'mp3':
				case 'ogg': 
					ext = req.params.type;
					path = 'web'; 
					break;
			}
			
			// Download the file
			var source = './public/sounds/' + path + '/' + sound.assetId + '.' + ext;
			var target = sound.uri + '.' + ext;
			res.download(source, target, function(err)
			{
				if (err)
				{
					console.log("No file at path ".red + source);
				}
			});
		}
	});
});

module.exports = router;