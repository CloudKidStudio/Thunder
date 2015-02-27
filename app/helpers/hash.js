var bCrypt = require('bcrypt-nodejs');

module.exports = {
	compare: function(user, password){
		return bCrypt.compareSync(password, user.password);
	},
	create: function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	}
}