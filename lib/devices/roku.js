var Device = require('../Device');
var App = require('../App');

var util = require('util');
var superagent = require('superagent');
var xml2json = require('xml2json');
var async = require('async');

// tmpvar did all of the hard work
// check out https://github.com/tmpvar/node-roku

function Roku() {
	Device.apply(this, arguments);
	this.types.push('roku');
}
util.inherits(Roku, Device);

Roku.matches = function(device) {
	return device.info.manufacturer === "Roku";
};

Roku.prototype.apps = function(cb) {
	var request = superagent.get(this.httpBase+"/query/apps");
	request.buffer();
	request.type('xml');
	request.end(function(err, res) {
		if (err) return cb(err);
		var parsed = xml2json.toJson(res.text, {object: true});
		var apps = parsed.apps.app.map(function(app){
			app.name = app['$t'];
			delete app['$t'];
			return app;
		});
		cb(null, apps);
	});
	return this;
};

Roku.prototype.type = function(text, cb) {
	var keys = text.split('').map(function(t){
		return 'Lit_'+escape(t);
	});

	this.press(keys);
	return this;
};

Roku.prototype.press = function(key, cb) {
	if (Array.isArray(key)) {
		async.forEachSeries(key, this.press.bind(this), cb);
		return this;
	}
	var request = superagent.post(this.httpBase+'/keypress/'+key);
	request.end(function(err, res) {
		if (cb) cb(err, res);
	});
};

// Override default app
function RokuApp() {
	App.apply(this, arguments);
}
util.inherits(RokuApp, App);

RokuApp.prototype.start = function(qs, cb) {
	var that = this;
	if (typeof qs === 'function') {
		cb = qs;
		qs = null;
	}

	this.device.apps(function(err, apps){
		if (err) {
			if (cb) cb(err);
			return;
		}

		var app = apps.filter(function(app){
			return app.name.toLowerCase() === that.name.toLowerCase();
		})[0];

		if (!app) {
			if (cb) cb(new Error("App not installed"));
			return;
		}
		var request = superagent.post(that.device.httpBase+"/launch/"+app.id);
		request.buffer();
		if (qs) req.query(qs);
		request.end(function(err, res){
			if (cb) cb(err);
		});
	});
	return this;
};

Roku.prototype.App = RokuApp;

module.exports = Roku;