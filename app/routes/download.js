var router = require('express').Router();
var Sound = require('../models/sound');

router.get('/:uri', function(req, res)
{
    var uri = req.params.uri;
    var ampIndex = uri.indexOf('&');
    var type = uri.substr(uri.length - 4);
    var assetId = uri.substr(0, ampIndex);
    var path = './public/sounds/%FOLDER%' + assetId + type;
    switch (type)
    {
        case '.aif':
            path = path.replace('%FOLDER%', 'originals/');
            break;
        case '.mp3':
        case '.ogg':
            path = path.replace('%FOLDER%', 'web/');
            break;
    }

    var fileName = uri.substr(ampIndex + 1);
    res.download(path, fileName, function(err)
    {
        if (err)
        {
            console.log("No file at path ".red + path);
        }
    });
});

module.exports = router;