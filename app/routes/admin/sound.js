var router = require('express').Router();
var Sound = require('../../models/sound');
var Category = require('../../models/category');
var fs = require('fs.extra');

var template = 'admin/sound-edit';

router.get('/', function(req, res)
{
	var sound = req.flash('sound');

	if (sound.length > 0)
	{
		res.render(template, 
		{
			sound: Sound.getById(sound[0]._id),
			categories: Category.getAllSimple()
		});
	}
	else
	{
		res.render('admin/sound',
		{
			success: req.flash('success'),
			error: req.flash('error')
		});
	}
});

router.post('/', function(req, res)
{
	if (req.body.sound)
	{
		Sound.getById(req.body.sound, function(err, sound)
		{
			if (!sound)
			{
				return error('No sound found matching source, must have been deleted.');
			}
			res.render(template, 
			{
				sound: sound,
				categories: Category.getAllSimple()
			});
		});
	}
	else if (req.body.id)
	{
		if (req.body.action == "delete")
		{
			Sound.findById(req.body.id, function(err, sound)
			{
				if (err) return error(err);

				if (!sound) return error("Unable to find sound matching ID");

				// Remove the files
				removeFile("./public/sounds/original/" + sound.assetId + "." + sound.type);
				removeFile("./public/sounds/web/" + sound.assetId + ".ogg");
				removeFile("./public/sounds/web/" + sound.assetId + ".mp3");

				// Remove sound from database
				Sound.remove({ _id: sound._id }, function(err)
				{
					if (err) return error(err);

					req.flash('success', 'Successfully removed sound');
					res.redirect('/admin/sound');
				});
			});
		}
		else
		{
			req.checkBody('uri', 'URI is required').notEmpty();
			req.checkBody('name', 'Name is required').notEmpty();
			req.checkBody('category', 'Category is required').notEmpty();

			var errors = req.validationErrors();
		
			if (errors)
			{
				res.render(template,
				{
					errors: errors,
					sound: Sound.getById(req.body.id),
					categories: Category.getAllSimple()
				});
				return;
			}

			var tags = req.body.tags;

			// Convert a single tag to an array
			if (tags && !Array.isArray(tags))
			{
				tags = [tags];
			}

			Sound.update({_id: req.body.id}, 
			{
				uri: req.body.uri,
				name: req.body.name,
				category: req.body.category,
				tags: tags || []
			}, 
			function(err, tag)
			{
				if (err) return error(err);

				res.render(template,
				{
					success: 'Sound has been updated',
					sound: Sound.getById(req.body.id),
					categories: Category.getAllSimple()
				});
			});
		}
	}

	function removeFile(path)
	{
		if (fs.existsSync(path))
		{
			fs.unlinkSync(path);
		}
	}

	function error(err)
	{
		req.flash('error', err);
		res.redirect('/admin/sound');
	}
});

module.exports = router;