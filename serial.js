
// Util
function trim(str) {
	return str.replace(/^\s+|\s+$/g,"");
}

// Config
var WEB_PORT = 3000;
var SERIAL_PORT = "COM3";

// Web
var express = require('express'), http = require('http');
var app = express();
var server = http.createServer(app).listen(WEB_PORT);
var io = require('socket.io').listen(server); 
console.log("Listening on port " + WEB_PORT);

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

// Configura Puerto Serial
var splib = require("serialport");
var SerialPort = splib.SerialPort;
var serialPort = new SerialPort(SERIAL_PORT, {
	baudrate: 19200,
	parser: splib.parsers.readline("\r")
});

splib.list(function (err, ports) {
	ports.forEach(function(port) {
		console.log(port.comName);
	});
});

serialPort.on("open", function (data) {
});

serialPort.on("data", function (data) {
	data = trim(data);
	console.log("	 DEV >- " + data);
	io.sockets.emit('toBrowser', data);
});

// IO
io.sockets.on('connection', function (socket) {
	io.sockets.emit('toBrowser', "Conexión Ok!");
	socket.on('toServer', function (data) {
		console.log(data['msg']);
		serialPort.write(data['msg']);
	});
});


