var Device = require('../Device');
var App = require('../App');
var util = require('util');
var superagent = require('superagent');

function ChromeCast() {
	Device.apply(this, arguments);
	this.types.push('chromecast');
}
util.inherits(ChromeCast, Device);

ChromeCast.prototype.reboot = function(cb) {
	var request = superagent.post(this.httpBase+"/setup/reboot");
	request.buffer();
	request.type('json');
	request.end(function(err, res) {
		if (cb) cb(err, res);
	});
};

ChromeCast.matches = function(device) {
	return device.info.modelName === "Eureka Dongle";
};

// Override default app
function ChromeCastApp() {
	App.apply(this, arguments);
}
util.inherits(ChromeCastApp, App);

ChromeCastApp.prototype.send = function(data) {
	this.socket.send(JSON.stringify([this.name, data]));
	return this;
};

ChromeCastApp.prototype.getConnection = function(cb) {
	this.info(function(err, info) {
		if (err) return cb(err);
		var svcUrl = info.servicedata.connectionSvcURL;
		var request = superagent.post(svcUrl);
		request.type('json');
		request.end(function(err, res) {
			if (err) return cb(err);
			cb(null, res.body.URL);
		});
	});
};

ChromeCastApp.prototype.connect = function(cb) {
	var that = this;
	this.getConnection(function(err, sockUrl) {
		if (err && cb) return cb(err);
		that.socket = new WS(sockUrl);

		// RAMP parser
		that.socket.on('message', function(data) {
			var parsed = JSON.parse(data);
			if (Array.isArray(parsed)) { // command
				var protocol = parsed[0];
				var msg = parsed[1];
				that.emit('command', protocol, msg);
				that.emit(protocol+':command', msg);
			}
		});

		// handle system events
		that.on('cm:command', function(msg) {
			if (msg.type === "ping") {
				that.send('cm', {type: "pong"});
				that.emit('ping');
			}
		});

		if (cb) that.socket.on('open', cb);
	});
	return this;
};

ChromeCast.prototype.App = ChromeCastApp;

module.exports = ChromeCast;