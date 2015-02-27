var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Email = mongoose.SchemaTypes.Email;

var userSchema = new Schema({
    username: String,
    password: String,
    privilege: {
    	type: Number,
    	default: 0
    },
    email: Email,
    name: String
});

module.exports = mongoose.model('User', userSchema);