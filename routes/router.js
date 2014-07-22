var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var cfg = require('../config/server');
var user = require('./user');

// websocket
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: cfg.ws_port});
global.wsClients = {};

wss.on('connection', function(ws) {
	ws.on('message', function(message) {
    	eval('var client = ' + message);
    	
    	if (typeof client == 'undefined' || typeof client.uid == 'undefine') {
    		ws.send('Cannot find specified account');
    	}
    	wsClients[client.uid] = {};
    	wsClients[client.uid][client.name] = ws;
    	ws.send('new connection accept')
    });
});

/* GET home page. */
router.post('/', function(req, res) {
	var form = new formidable.IncomingForm();
	var filename = '';
	var uid = '';
	var client_id = '';

	form.parse(req, function(error, fields, files){
		filename = cfg.torrent_path + files.t.name;
		uid = fields.uid;
		client_id = fields.client;
		fs.rename(files.t.path, filename, function(err){
			if (err) throw err;
			console.log('Now sending torrent to '+uid+'...');
		});

	}).on('end', function(){
		if( wsClients && uid && typeof wsClients[uid] == 'object' ) {
			for (var i in wsClients[uid]) {
				if (i == client_id) {
					wsClients[uid][i].send(cfg.torrent_host + filename);
				}
			}
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
