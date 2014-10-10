// ntServer.js

var clients = {};

// websocket server
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 8000});

wss.on('connection', function(ws) {
	ws.on('message', function(message) {
		console.log('received: %s', message);
		clients[message] = ws;
	});
});

// http
var http = require('http');
http.createServer(function (req, res) {

}).listen(8080);
