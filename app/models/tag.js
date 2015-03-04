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

TagSchema.statics.getBySearch = function(search, start, limit, callback)
{
    return this.find(
    {
        name: new RegExp(search, "i")
    }).skip(start).limit(limit).exec(callback);
};

TagSchema.statics.getById = function(id, callback)
{
    return this.findOne({ _id : id }, callback);
};

module.exports = mongoose.model('Tag', TagSchema);