#!/usr/bin/env node

var nodecast = require('../');
var argv = require('optimist').argv;
var url = require('url');

var stream = nodecast.find();

if (!argv._[0]) throw "Missing URL argument";
var ytid = url.parse(argv._[0], true).query.v;
if (!ytid) throw "Invalid URL";

stream.on('device', function(device) {
	// This is how you would do a device filter
	//if (device.info.modelName !== "Eureka Dongle") return;

	console.log('Found device', device.name);

	var youtube = device.app('YouTube');

	youtube.start('v='+ytid, function(err) {
		if (err) console.log('error starting', err);
		console.log('Started on', device.name);
	});
});