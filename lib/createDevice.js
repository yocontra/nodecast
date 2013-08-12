var WS = require('ws');
var EventEmitter = require('events').EventEmitter;
var request = require('request');

module.exports = function(opt, cb) {
	request(opt.appsUrl, {json:true}, function(err, res, body) {
		if (err) return cb(err);
		
		//TODO: grab ws url from body
		var device = new EventEmitter();
		device.name = opt.name;
		device.address = opt.address;
		device.socket = new WS(opt.appsUrl);
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
	});
};