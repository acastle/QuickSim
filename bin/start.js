var debug = require('debug')('RaidTrack');
var http = require('http');
var app = require('../app');
var server = http.createServer(app);
global.socket = require('socket.io').listen(server);

app.set('port', process.env.PORT || 3000);

server.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});
