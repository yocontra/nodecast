var WS = require('ws');
var EventEmitter = require('events').EventEmitter;

module.exports = function(address, wsUrl, cb) {
	var device = new EventEmitter();
	device.address = address;
	device.socket = new WS(wsUrl);
	device.write = function(ns, data) {
		device.socket.write(JSON.stringify([ns, data]));
	};

	// RAMP parser
	device.socket.on('message', function(data) {
		var parsed = JSON.parse(data);
		if (Array.isArray(parsed)) { // command
			var ns = parsed[0];
			var msg = parsed[1];
			device.emit('command', ns, msg);
			device.emit('command:'+ns, msg);
		}
	});

	// handle system events
	device.on('command:cm', function(msg) {
		if (msg.type === "ping") {
			device.write('cm', {type: "pong"});
		}
	});

	cb(null, device);
};