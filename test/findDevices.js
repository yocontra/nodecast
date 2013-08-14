var nodecast = require('../');
var should = require('should');
require('mocha');

describe('find()', function() {
  it('should find devices', function(done) {
    var ee = nodecast.find();
    ee.once('error', done);
    ee.once('device', function(device){
			should.exist(device);
			done();
    });
  });

  it('should find with filter', function(done) {
    var ee = nodecast.find('chromecast');
    ee.once('error', done);
    ee.once('device', function(device){
			should.exist(device);
			done();
    });
  });
});