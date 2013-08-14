var nodecast = require('../');
var should = require('should');
require('mocha');

describe('device', function() {
  it('should have all the fields', function(done) {
    var ee = nodecast.find();
    ee.on('error', done);
    ee.once('device', function(device){
			should.exist(device);
			should.exist(device.address);
			should.exist(device.name);
      should.exist(device.app);
      should.exist(device.info);
      should.exist(device.type);
			done();
    });
  });

  // you really need to be running the emulator for this test
  it('should mix in chromecast data', function(done) {
    var ee = nodecast.find();
    ee.on('error', done);
    ee.once('device', function(device){
      should.exist(device);
      should.exist(device.address);
      should.exist(device.name);
      should.exist(device.app);
      should.exist(device.info);
      should.exist(device.type);
      device.type.should.equal('chromecast');
      done();
    });
  });

});