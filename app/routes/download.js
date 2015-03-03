var router = require('express').Router();
var Sound = require('../models/sound');

router.get('/:uri/:type(original|mp3|ogg|zip)', function(req, res)
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
				case 'zip':
				{
					res.zip([
						{
								path: './public/sounds/web/' + sound.assetId + '.mp3', 
								name: sound.uri + '.mp3'
							},
							{
								path: './public/sounds/web/' + sound.assetId + '.ogg', 
								name: sound.uri + '.ogg'
							},
							{
								path: './public/sounds/original/' + sound.assetId + '.' + sound.type, 
								name: sound.uri + '.' + sound.type
							}
						], 
						sound.uri + '.zip'
					);
					return;
				}
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