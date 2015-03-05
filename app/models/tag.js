var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * The content tag model
 * @class Tag
 * @extends mongoose.Schema
 */
var TagSchema = new Schema(
{
    /**
     * The tag's full name
     * @property {String} name
     */
    name: String,

    /**
     * The URI slug for getting tag
     * @property {String} uri
     */
    uri:
    {
        type: String,
        match: /^[a-z\-0-9]+$/,
        unique: true
    }
});

TagSchema.plugin(require('mongoose-unique-validator'));

/**
 * Get a single tag by URI
 * @method getByUri
 * @static
 * @param {String} uri The tag URI slug
 * @return {Promise} The promise object for async action
 */
TagSchema.statics.getByUri = function(uri, callback)
{
    return this.findOne({ uri: uri }, callback);
};

/**
 * Get a tag by search term
 * @method getBySearch
 * @static
 * @param {String} search The search string
 * @param {int} start The starting index 
 * @param {int} limit The number of items to get
 * @return {Promise} The promise object for async action
 */
TagSchema.statics.getBySearch = function(search, start, limit, callback)
{
    return this.find(
    {
        name: new RegExp(search, "i")
    }).skip(start).limit(limit).exec(callback);
};

module.exports = mongoose.model('Tag', TagSchema);