var nodecast = require('../');
var should = require('should');
require('mocha');

describe('find()', function() {
  it('should find devices', function(done) {
    var ee = nodecast.find();
    ee.on('error', done);
    ee.on('device', function(device){
			should.exist(device);
			should.exist(device.address);
			done();
    });
  });
});