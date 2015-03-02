var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TagSchema = new Schema(
{
    name: String,
    uri:
    {
        type: String,
        match: /^[a-z\-0-9]+$/,
        unique: true
    }
});

TagSchema.plugin(require('mongoose-unique-validator'));

TagSchema.statics.getByUri = function(uri, callback)
{
	return this.findOne({uri: uri}, callback);
};

module.exports = mongoose.model('Tag', TagSchema);