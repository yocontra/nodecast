var util = require('util');
var url = require('url');
var WS = require('ws');
var EventEmitter = require('events').EventEmitter;
var superagent = require('superagent');
var xml2json = require('xml2json');

function App(device, appName) {
	EventEmitter.call(this);
	this.name = appName;
	this.device = device;
	this.base = this.device.appsBase+this.name;
}
util.inherits(App, EventEmitter);

App.prototype.info = function(cb) {
	var request = superagent.get(this.base);
	request.buffer();
	request.type('xml');

	request.end(function(err, res) {
		if (err) return cb(err);
		var parsed = xml2json.toJson(res.text, {object: true});
		cb(null, parsed.service);
	});
	return this;
};

App.prototype.start = function(data, cb) {
	var request = superagent.post(this.base);

	// support sending with data
	// the spec says this is up to the app so we support json and text
	if (typeof data === 'function') {
		cb = data;
		data = null;
	} else if (typeof data === 'string') {
		request.type('text');
		request.send(data);
	} else if (typeof data === 'object') {
		request.type('json');
		request.send(data);
	}
	request.end(function(err, res){
		cb(err);
	});
	return this;
};

App.prototype.stop = function(cb) {
	var request = superagent.del(this.base);
	request.end(function(err, res){
		cb(err);
	});
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
		var request = superagent.post(svcUrl);
		request.type('json');
		request.end(function(err, res) {
			if (err) return cb(err);
			cb(null, res.body.URL);
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

module.exports = App;
