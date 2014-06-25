var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = new schema({
	email: String,
	pwd: String,
	clients: []
})