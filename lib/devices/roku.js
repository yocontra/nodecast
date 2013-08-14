var Device = require('../Device');
var util = require('util');
var superagent = require('superagent');
var xml2json = require('xml2json');

function Roku() {
	Device.apply(this, arguments);
	this.types.push('roku');
}
util.inherits(Roku, Device);

Roku.matches = function(device) {
	return device.info.manufacturer === "Roku";
};

Roku.prototype.apps = function(cb) {
	var request = superagent.get("http://"+this.httpBase+"/query/apps");
	console.log("http://"+this.httpBase+"/query/apps");
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

module.exports = Roku;