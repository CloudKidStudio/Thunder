var router = require('express').Router();
var exec = require('child_process').exec;
var path = require('path');
var async = require('async');
var fs = require('fs.extra');
var Sound = require('../models/sound');
var Category = require('../models/category');

router.post('/', function(req, res)
{
	if (!req.files || !req.files.audio)
	{
		return res.redirect('back');
	}

	// Uploaded file
	var audio = req.files.audio;

	// The file source
	var source = audio.path;
	
	// Sound assets
	var ext = path.extname(source);
	var name = path.basename(audio.originalname, ext);
	var assetId = path.basename(source, ext);
	var uri = name.toLowerCase()
		.replace(/[ _]+/g, '-')
		.replace(/[^a-z0-9\-]+/g, '-');

	// Temp compile files
	var ogg = source.replace(path.extname(source), '.ogg');
	var mp3 = source.replace(path.extname(source), '.mp3');

	// Destination files
	var sourceDest = "./public/sounds/original/" + audio.name;
	var mp3Dest = "./public/sounds/web/" + path.basename(mp3);
	var oggDest = "./public/sounds/web/" + path.basename(ogg);

	var uncategorized = null;

	async.series({
		uncategorized: function(done)
		{
			Category.getEmpty(function(err, category)
			{
				if (err) return done(err);
				uncategorized = category;
				done(null, category);
			});
		},
		uri: function(done)
		{
			Sound.checkUri(uri, function(err, count)
			{
				if (err) return done(err);
				if (!count)
				{
					done(null, true);
				}
				else
				{
					uri += '-alt';
					Sound.checkUri(uri, function(err, count)
					{
						if (err) return done(err);
						if (!count)
						{
							done(null, true);
						}
						else
						{
							done('URI is taken, try renaming file');
						}
					});
				}
			});
		},
		// Encode the ogg file
		ogg: function(done)
		{			
			exec("./bin/oggenc2 -b 128 -o " + ogg + " " + source, 
				function(err, stdout, stderr)
				{
					//console.log(String(stderr).gray);
					if (err) return done(err);
					done(null, ogg);
				}
			);
		},
		// Encode the mp3 file
		mp3: function(done)
		{			
			exec("./bin/lame --cbr -b 80k " + source + " " + mp3,
				function(err, stdout, stderr)
				{
					//console.log(String(stderr).gray);
					if (err) return done(err);
					done(null, mp3);
				}
			);
		},
		moveSource: function(done)
		{
			fs.move(source, sourceDest, function(err)
			{
				if (err) return done(err);
				done(null, true);
			});
		},
		moveMp3: function(done)
		{
			fs.move(mp3, mp3Dest, function(err)
			{
				if (err) return done(err);
				done(null, true);
			});
		},
		moveOgg: function(done)
		{
			fs.move(ogg, oggDest, function(err)
			{
				if (err) return done(err);
				done(null, true);
			});
		},
		saveSound: function(done)
		{
			var sound = new Sound({
				uri: uri,
				size: audio.size,
				type: ext.substr(1), // remove the dot in front of extension
				name: name,  
				assetId: assetId,
				category: req.body.category || uncategorized._id,
				tags: req.body.tag ? [req.body.tag] : [],
				created: new Date(),
				update: new Date()
			});

			sound.save(function(err, sound)
			{
				if (err) return done(err);

				// Add to favorites
				if (req.body.favorite)
				{
					req.user.toggleFavorite(sound._id, function(err)
					{
						if (err) return done(err);
						done(null, sound);
					});
				}
				else 
				{
					done(null, sound);
				}				
			});
		}
	},
	// Files encoded!
	function(err, results)
	{
		if (err)
		{
			// Clean-up any saved files
			fs.unlinkSync(source);
			fs.unlinkSync(mp3);
			fs.unlinkSync(ogg);
			fs.unlinkSync(sourceDest);
			fs.unlinkSync(oggDest);
			fs.unlinkSync(mp3Dest);

			req.flash('error', err);
			res.redirect('/admin/sound');
			return;
		}
		
		req.flash('sound', results.saveSound);
		res.redirect('/admin/sound');
	});
});

module.exports = router;