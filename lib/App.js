var util = require('util');
var WS = require('ws');
var EventEmitter = require('events').EventEmitter;
var request = require('request');
var xml2json = require('xml2json');

function App(device, appName) {
	EventEmitter.call(this);
	this.name = appName;
	this.device = device;
	this.base = this.device.appsBase+"/"+this.name;
}

App.prototype.info = function(cb) {
	request.get(this.base, function(err, res, body) {
		if (err) return cb(err);
		var parsed = xml2json.toJson(body, {object: true});
		cb(null, parsed.service);
	});
	return this;
};

App.prototype.start = function(data, cb) {
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
	request.post(this.base, rOpt, cb);
	return this;
};

App.prototype.stop = function(cb) {
	request.del(this.base, cb);
	return this;
};

// TODO: only have WS for RAMP protocol
// support standard DIAL protocol
// support specifying a custom protocol
App.prototype.send = function(data) {
	this.socket.send(JSON.stringify([this.name, data]));
	return this;
};

App.prototype.getConnection = function(cb) {
	this.info(function(err, info) {
		if (err) return cb(err);
		var svcUrl = info.servicedata.connectionSvcURL;
		request.post(svcUrl, {json: true}, function(err, res, body) {
			if (err) return cb(err);
			cb(null, body.URL);
		});
	});
};

App.prototype.connect = function(cb) {
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

util.inherits(App, EventEmitter);

module.exports = App;
