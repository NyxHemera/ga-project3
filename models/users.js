var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var User = new mongoose.Schema({
	local: {
		// email: {type: String, match: /.+\@.+\..+/},
		email: String,
		password: String
	},
	first_name: String,
	last_name: String,
	twitter: String,
	clouds: [ {type: mongoose.Schema.ObjectId, ref: 'WordCloud'} ]
});

User.methods.encrypt = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

User.methods.isValidPassword = function(password) {
	return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', User);
