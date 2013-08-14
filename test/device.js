var nodecast = require('../');
var should = require('should');
require('mocha');

describe('device', function() {
  it('should have all the fields', function(done) {
    var ee = nodecast.find('chromecast');
    ee.once('error', done);
    ee.once('device', function(device){
			should.exist(device);
			should.exist(device.address, 'address');
			should.exist(device.name, 'name');
      should.exist(device.info, 'info');
      should.exist(device.types, 'types');
      should.exist(device.appsBase, 'appsBase');
      should.exist(device.httpBase, 'httpBase');
			done();
    });
  });

  // you really need to be running the emulator for this test
  it('should mix in chromecast data', function(done) {
    var ee = nodecast.find('chromecast');
    ee.once('error', done);
    ee.once('device', function(device){
      should.exist(device);
      should.exist(device.address, 'address');
      should.exist(device.name, 'name');
      should.exist(device.info, 'info');
      should.exist(device.types, 'types');
      should.exist(device.appsBase, 'appsBase');
      should.exist(device.httpBase, 'httpBase');
      device.types.should.eql(['generic', 'chromecast']);
      device.is('chromecast').should.equal(true);
      done();
    });
  });

});