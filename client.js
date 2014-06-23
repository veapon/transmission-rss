var cfg = require('./config/client.js');

var WebSocket = require('ws');
var ws = new WebSocket('ws://localhost:8080');
ws.on('open', function() {
    ws.send('something');
});
ws.on('message', function(data, flags) {
    console.log(data);
	var filename = require('path').basename(data);
	var dest = cfg.torrent_path + filename;
    require('http').get(data, function(res){
    	var file = require('fs').createWriteStream(dest);
    	res.pipe(file);
    	file.on('finish', function(){
    		file.close();
    	})
    })
});