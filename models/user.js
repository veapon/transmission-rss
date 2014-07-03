var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = new schema({
	email: {type:String, required: true, unique: true, validate: [is_email, 'Not a valid email address.']},
	pwd: {type:String, required: true},
	clients: []
})

userSchema.pre('save', function (next) {
	var md5 = require('MD5');
	this.pwd = md5(this.pwd);
  	next();
})

function is_email(str){
	return /^[a-z0-9]+([\+_\-\.]?[a-z0-9]+)*@(([a-z0-9]+\.)?[a-z0-9]+[\-]?[a-z0-9]+\.[a-z]{1,6})$/.test(str);
}

module.exports = userSchema;