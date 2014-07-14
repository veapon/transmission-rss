var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var cfg = require('../config/server');
var user = require('./user');

// websocket
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: cfg.ws_port});
var wsClients = {};

wss.on('connection', function(ws) {
	ws.on('message', function(message) {
    	eval('var user = ' + message);
    	console.log(typeof user);
    });
});

/* GET home page. */
router.post('/', function(req, res) {
	var form = new formidable.IncomingForm();
	var filename = '';
	var client_id = '';

	form.parse(req, function(error, fields, files){
		filename = cfg.torrent_path + files.t.name;
		fs.rename(files.t.path, filename);
		client_id = fields.client;

	}).on('end', function(){
		if( wsClients && client_id && typeof wsClients[client_id] == 'object' ) {
			wsClients[client_id].send(cfg.torrent_host + filename)
		}
		res.send(filename);
	})
})

router.get('/torrents/*', function(req, res){
	var file = cfg.torrent_path + req.params[0];
	var filename = require('path').basename(file);
	var mimetype = require('mime').lookup(file); 
	res.setHeader('Content-disposition', 'attachment; filename=' + filename);
	res.setHeader('Content-type', mimetype);

	var filestream = fs.createReadStream(file);
	filestream.on('data', function(chunk) {
		res.write(chunk);
	});

	filestream.on('end', function() {
		res.end();
	});
})

router.get('/', user.home);

router.get('/signup', user.signup);
router.post('/signup', user.create);

router.get('/signin', user.login);
router.post('/signin', user.ensure);

module.exports = router;
