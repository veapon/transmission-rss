
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// websocket
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 8080});
var wsClients = {};

wss.on('connection', function(ws) {
   var client_id = require('shortid').generate();
   wsClients[client_id] = ws;
   ws.send(client_id);
   console.log("New user joined: " + client_id);
   console.log(wsClients);
});

app.get('/', function(req, res){
	//console.log(wss);
	res.render('index', { clients: wsClients });
});

app.post('/', function(req, res){
	var file = req.files;
	var dest = "./";
	fs.rename(file.path, dest, function(err){
		res.send('upload error: '+ err);
	})
	res.send('upload success');
})

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
