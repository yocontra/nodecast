var WS = require('ws');
var EventEmitter = require('events').EventEmitter;
var request = require('request');
var xml2json = require('xml2json');

module.exports = function(device, appName) {
	var app = new EventEmitter();
	app.base = device.appsBase+"/"+appName;

	app.info = function(cb) {
		request.get(app.base, function(err, res, body) {
			if (err) return cb(err);
			var parsed = xml2json.toJson(body, {object: true});
			cb(null, parsed.service);
		});
		return app;
	};

	app.start = function(cb) {
		request.post(app.base, cb);
		return app;
	};

	app.stop = function(cb) {
		request.del(app.base, cb);
		return app;
	};

	app.write = function(data) {
		app.socket.write(JSON.stringify([appName, data]));
		return app;
	};

	app.connect = function(cb) {
		app.info(function(err, info) {
			if (err) return cb(err);
			var sockUrl = info.servicedata.connectionSvcURL;
			console.log(sockUrl);
			app.socket = new WS(sockUrl);

			// RAMP parser
			app.socket.on('message', function(data) {
				var parsed = JSON.parse(data);
				if (Array.isArray(parsed)) { // command
					var ns = parsed[0];
					var msg = parsed[1];
					app.emit('command', ns, msg);
					app.emit('command:'+ns, msg);
				}
			});

			// handle system events
			app.on('command:cm', function(msg) {
				if (msg.type === "ping") {
					app.write('cm', {type: "pong"});
				}
			});
		});
		return app;
	};

	return app;
};