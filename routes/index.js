var express = require('express');
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');

// websocket
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 8080});
var wsClients = {};

wss.on('connection', function(ws) {
   var client_id = require('shortid').generate();
   wsClients[client_id] = ws;
   ws.send(client_id);
   console.log("New user joined: " + client_id);
});

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { clients: wsClients });
});

router.post('/', function(req, res) {
    var form = new formidable.IncomingForm();
    var filename = '';
    var client_id = '';

    form.parse(req, function(error, fields, files){
    	filename = './torrents/'+files.t.name;
    	fs.rename(files.t.path, filename);
    	client_id = fields.client;

    }).on('end', function(){
    	if( wsClients && client_id && typeof wsClients[client_id] == 'object' ) {
    		wsClients[client_id].send(filename)
    	}
    	res.send(filename);
    })
})

module.exports = router;
