var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Email = mongoose.SchemaTypes.Email;

var UserSchema = new Schema({
	username: String,
	password: String,
	privilege: 
	{
		type: Number,
		default: 0
	},
	email: Email,
	favorites: 
	[{
		type: Schema.Types.ObjectId,
		ref: 'Sound'
	}],
	name: String
});

UserSchema.methods.getFavorites = function(callback)
{
	return this.model('Sound')
		.find({_id: {"$in": this.favorites }})
		.populate('category tags')
		.exec(callback);
};

UserSchema.methods.toggleFavorite = function(soundId, callback)
{
	if (this.favorites.indexOf(soundId) > -1)
	{
		// remove the sound id
		return this.update(
			{$pull: { favorites : soundId }}, 
			callback
		);
	}
	else
	{
		// add the sound id
		return this.update(
			{$push: { favorites : soundId }}, 
			callback
		);
	}
};

module.exports = mongoose.model('User', UserSchema);