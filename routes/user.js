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
			if (typeof(err.err) != 'undefined' && err.code == 11000) {
				ret.msg = 'Email is already taken';
			} else {
				ret.msg = 'All fields are required';
			}
		} else {
			ret.status = 1;
			ret.data = {link: 'signin?user='+user.email};
		}

		res.send(ret);
	})
}

/**
 * login page
 */
module.exports.login = function(req, res) {
	res.render('login', req.query)
}

/**
 * login action
 */
module.exports.ensure = function(req , res) {
	userModel.findOne({email: req.body.email}, 'pwd', function(err, data){
		var ret = {status: 0};
		if (err || !data) {
			ret.msg = 'There\'s something wrong';
			res.send(ret);
		} else {
			var md5 = require('MD5');
			
			if (typeof data.pwd != 'string') {
				ret.msg = 'Account not found.'
			} else if (md5(req.body.pwd) != data.pwd) {
				ret.msg = 'Password incorrect.';
			} else {
				ret.status = 1;
				ret.user = {uid: data._id, email: req.body.email};
				req.session.uid = data._id;
			}
			
			res.send(ret);
		}
	});
}

module.exports.home = function(req, res) {
	if (typeof(req.session.uid) == 'undefined' || !req.session.uid) {
		res.redirect('/signin');
	}

	if (typeof(wsClients) == 'undefined' || typeof(wsClients[req.session.uid]) == 'undefined') {
		var data = {uid: req.session.uid, msg: 'Account not found or no client of the account was connected to server.'};
	} else {
		var data = {clients: wsClients[req.session.uid], uid: req.session.uid};
	}
	res.render('index', data);
}