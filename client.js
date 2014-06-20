var WebSocket = require('ws');
var ws = new WebSocket('ws://10.1.10.3:8080');
ws.on('open', function() {
    ws.send('something');
});
ws.on('message', function(data, flags) {
    console.log(data);
});