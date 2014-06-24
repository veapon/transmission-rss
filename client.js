var cfg = require('./config/client.js');

var WebSocket = require('ws');
var ws = new WebSocket('ws://' + cfg.server);
ws.on('open', function() {
    ws.send('something');
});
ws.on('message', function(data, flags) {
    console.log(data);
    var path = require('path');
    if( path.extname(data) != '.torrent' ) return;

	var filename = path.basename(data);
	var dest = cfg.torrent_path + filename;
    require('http').get(data, function(res){
    	var file = require('fs').createWriteStream(dest);
    	res.pipe(file);
    	file.on('finish', function(){
    		file.close();
    	})
    })
});