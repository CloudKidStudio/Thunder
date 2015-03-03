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
    return this.findOne(
    {
        uri: uri
    }, callback);
};

TagSchema.statics.getAll = function(search, start, limit, callback)
{
    return this.find(
    {
        name: new RegExp(search, "i")
    }).skip(start).limit(limit).exec(callback);
};

module.exports = mongoose.model('Tag', TagSchema);