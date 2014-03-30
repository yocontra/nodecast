var Device = require('../Device');
var App = require('../App');
var util = require('util');
var superagent = require('superagent');
var xml2json = require('xml2json');

function ChromeCast() {
	Device.apply(this, arguments);
	this.types.push('chromecast');
}
util.inherits(ChromeCast, Device);

ChromeCast.matches = function(device) {
	return device.info.modelName === 'Eureka Dongle';
};

// reboots the app
ChromeCast.prototype.reboot = function(cb) {
	var request = superagent.post(this.url('/setup/reboot'));
	request.buffer();
	request.type('json');
	request.end(function(err, res) {
		if (cb) cb(err, res);
	});
};

// extended device details
// includes geolocation, wifi info, public key, etc.
ChromeCast.prototype.details = function(cb) {
	var request = superagent.get(this.url('/setup/eureka_info?options=detail'));
	request.buffer();
	request.type('json');
	request.end(function(err, res) {
		return cb(err, res.body);
	});
	return this;
};

// this API does not support JSON
// gets the current running app
ChromeCast.prototype.running = function(cb) {
	var request = superagent.get(this.url('/apps'));
	request.buffer();
	request.type('xml');
	request.end(function(err, res) {
		if (err) return cb(err);
		var parsed = xml2json.toJson(res.text, {object: true});
		var app = {
			name: parsed.service.name,
			description: parsed.service['activity-status'].description,
		};
		cb(null, app);
	});
	return this;
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
			if (msg.type === 'ping') {
				that.send('cm', {type: 'pong'});
				that.emit('ping');
			}
		});

		if (cb) that.socket.on('open', cb);
	});
	return this;
};

ChromeCast.prototype.App = ChromeCastApp;

module.exports = ChromeCast;