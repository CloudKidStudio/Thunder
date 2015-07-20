var router = require('express').Router();
var exec = require('child_process').exec;
var path = require('path');
var async = require('async');
var fs = require('fs.extra');
var Sound = require('../models/sound');
var Category = require('../models/category');
var upload = require('multer')({ dest: 'uploads/' });

router.post('/', upload.single('audio'), function(req, res)
{
	if (!req.file)
	{
		console.error("No file to upload");
		return res.redirect('back');
	}

	// Uploaded file
	var audio = req.file;

	// Rename the file with extension
	var source = "./"  + audio.path;
	
	// Sound assets
	var ext = path.extname(audio.originalname);
	var name = path.basename(audio.originalname, ext);
	var assetId = audio.filename;
	var uri = name.toLowerCase()
		.replace(/[ _]+/g, '-')
		.replace(/[^a-z0-9\-]+/g, '-');

	// Temp compile files
	var ogg = source + '.ogg';
	var mp3 = source + '.mp3';

	// Destination files
	var sourceDest = "./public/sounds/original/" + audio.filename + ext;
	var mp3Dest = "./public/sounds/web/" + audio.filename + '.mp3';
	var oggDest = "./public/sounds/web/" + audio.filename + '.ogg';

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
			exec("lame --cbr -b 80k ." + source + " ." + mp3,
				{cwd: './bin'},
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
			removeFile(source);
			removeFile(mp3);
			removeFile(ogg);
			removeFile(sourceDest);
			removeFile(oggDest);
			removeFile(mp3Dest);

			console.error(err);
			req.flash('error', String(err));
			res.redirect('/admin/sound');
			return;
		}
		
		req.flash('sound', results.saveSound);
		res.redirect('/admin/sound');
	});

	function removeFile(path)
	{
		if (fs.existsSync(path))
		{
			fs.unlinkSync(path);
		}
	}
});

module.exports = router;