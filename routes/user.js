var mongoose = require('mongoose');
var userSchema = require('../models/user');
var userModel = mongoose.model('user', userSchema);

/**
 * User home
 */
 module.exports.index = function(req, res) {

 }

/**
 * signup page
 */
module.exports.signup = function(req, res) {
	//console.log('aa');
	res.render('signup', {});
}

/**
 * User register
 */
module.exports.create = function(req, res) {
	userModel.create(req.body, function(err, user){
		var ret = {status: 0};
		if (err) {
			console.log(err);
			if (typeof(err.err) != 'undefined' && err.code == 11000) {
				ret.msg = 'Email is already taken';
			} else {
				ret.msg = 'All fields are required';
			}
		} else {
			ret.status = 1;
			ret.data = {uid: user._id};
		}

		res.send(ret);

	})
}

/**
 * login page
 */
module.exports.login = function(req, res) {

}

/**
 * login action
 */
module.exports.ensure = function(req , res) {

}