var WS = require('ws');
var EventEmitter = require('events').EventEmitter;
var request = require('request');
var xml2json = require('xml2json');
var net = require('net');
var qs = require('querystring');

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

	app.start = function(data, cb) {
		
		if (device.info.modelName === 'Eureka Dongle') {
			var client = net.connect({
				host : device.address,
				port : device.port
			}, function() {
				if (typeof data !== 'string') {
					data = qs.stringify(data);
				}

				client.write([
					'POST /apps/' + appName + ' HTTP/1.1',
					'Content-Type: application/x-www-form-urlencoded',
					'Content-Length: ' + data.length,
					'Connection: close',
					'',
					data,
				].join('\r\n'));
			});

			var response = '';
			client.on('data', function(chunk) {
				response += chunk.toString();

				if (response.indexOf('\n') > -1) {
					var code = parseInt(response.split('\n')[0].split(' ')[1], 10);
					client.end();
					if (code !== 201) {
						cb(new Error('Device returned status:' + code))
					} else {
						cb(null);
					}
				}
			});

			client.on('error', cb);

		} else {
			// support sending with data
			// the spec says this is up to the app so we support json and text
			if (typeof data === 'function') {
				rOpt = {};
			} else if (typeof data === 'string') {
				rOpt = {
					headers: {
						"content-type": "text/plain"
					},
					body: data
				};
			} else if (typeof data === 'object') {
				rOpt = {json: data};
			}
			request.post(app.base, rOpt, cb);
		}
		return app;
	};

	app.stop = function(cb) {
		request.del(app.base, cb);
		return app;
	};

	// TODO: only have WS for RAMP protocol
	// support standard DIAL protocol
	// support specifying a custom protocol
	app.send = function(data) {
		app.socket.send(JSON.stringify([appName, data]));
		return app;
	};

	app.getConnection = function(cb) {
		app.info(function(err, info) {
			if (err) return cb(err);
			var svcUrl = info.servicedata.connectionSvcURL;
			request.post(svcUrl, {json: true}, function(err, res, body) {
				if (err) return cb(err);
				cb(null, body.URL);
			})
		});
	};

	app.connect = function(cb) {
		app.getConnection(function(err, sockUrl) {
			if (err && cb) return cb(err);
			app.socket = new WS(sockUrl);

			// RAMP parser
			app.socket.on('message', function(data) {
				console.log(data);
				var parsed = JSON.parse(data);
				if (Array.isArray(parsed)) { // command
					var protocol = parsed[0];
					var msg = parsed[1];
					app.emit('command', protocol, msg);
					app.emit(protocol+':command', msg);
				}
			});

			// handle system events
			app.on('cm:command', function(msg) {
				if (msg.type === "ping") {
					app.send('cm', {type: "pong"});
					app.emit('ping');
				}
			});

			if (cb) app.socket.on('open', cb);
		});
		return app;
	};

	return app;
};