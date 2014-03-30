#!/usr/bin/env node

var nodecast = require('../');
var stream = nodecast.find();

stream.on('device', function(device) {
	console.log('Found', device.name);//,  device.info);
  if (typeof device.apps === 'function') {
    device.apps(function(err, apps){
      console.log('Applications for', device.name, apps);
    });
  }
  if (typeof device.details === 'function') {
    device.details(function(err, details){
      console.log('Details for', device.name, details);
    });
  }
  if (typeof device.running === 'function') {
    device.running(function(err, app){
      console.log('Currently running app for', device.name, app);
    });
  }
});