#!/usr/bin/env node

var nodecast = require('../');
var async = require('async');
var stream = nodecast.find('roku');

stream.on('device', function(device) {
	console.log('Found device', device.name);
	device.press('Home');

	device.apps(function(err, apps){
		if (err) return console.log(err);
		console.log("Found", apps.length, "apps:");
		apps.forEach(function(app){
			console.log(app.name, '=', app.id);
		});

		var spotify = device.app('Spotify');
		spotify.start(function(){
			// wait for load screen
			setTimeout(function(){
				// search for songs
				device.press(['Select', 'Select'], function(){
					device.type("elaquent");
				});
			}, 6000);
		});

	});
});