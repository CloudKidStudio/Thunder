var router = require('express').Router();
var Sound = require('../models/sound');

router.get('/:uri([a-z\-0-9]+)', function(req, res)
{
    Sound.findOne(
        {
            // The name of the sound file to display in
            // this singular sound page view
            uri: req.params.uri
        })
        .populate('tags category')
        .exec(function(err, sound)
        {
            res.locals.download = function(path, fileName)
            {
                res.download(path, fileName, function(err)
                {
                    if (err)
                        console.log("Asset " + path + " does not exist".red);
                });
            };
            res.locals.assetId = sound.assetId;
            res.render('sound',
            {
                sound: sound
            });
        });
});

module.exports = router;