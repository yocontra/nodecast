var nodecast = require('../');
var should = require('should');
require('mocha');

describe('app', function() {
  it('should return app object', function(done) {
    var ee = nodecast.find();
    ee.once('error', done);
    ee.once('device', function(device){
			var yt = device.app('YouTube');
      should.exist(yt);
			done();
    });
  });

  it('should .info()', function(done) {
    var ee = nodecast.find();
    ee.on('error', done);
    ee.once('device', function(device){
      var yt = device.app('YouTube');
      yt.info(function(err, info){
        should.not.exist(err);
        should.exist(info);
        should.exist(info.name);
        info.name.should.equal("YouTube");
        done();
      });
    });
  });

  it('should .start() with data then .stop()', function(done) {
    this.timeout(10000);
    var ee = nodecast.find();
    ee.on('error', done);
    ee.once('device', function(device){
      var yt = device.app('YouTube');
      yt.start('v=oHg5SJYRHA0', function(err) {
        should.not.exist(err);
        yt.info(function(err, info){
          should.not.exist(err);
          should.exist(info);
          should.exist(info.state);
          info.state.should.equal('running');
          yt.stop(function(err) {
            should.not.exist(err);
            yt.info(function(err, info){
              should.not.exist(err);
              should.exist(info);
              should.exist(info.state);
              info.state.should.equal('stopped');
              done();
            });
          });
        });
      });
    });
  });

  /*
  it('should .start() then connect', function(done) {
    var ee = nodecast.find();
    ee.on('error', done);
    ee.once('device', function(device){
      var yt = device.app('YouTube');
      yt.start(function(err) {
        should.not.exist(err);
        yt.connect(function(err) {
          should.not.exist(err);
          done();
        });
      });
    });
  });

  it('should .start() then get a ping', function(done) {
    var ee = nodecast.find();
    ee.on('error', done);
    ee.once('device', function(device){
      var yt = device.app('YouTube');
      yt.start(function(err) {
        should.not.exist(err);
        yt.connect(function(err) {
          should.not.exist(err);
          yt.on('ping', function(){
            done();
          });
        });
      });
    });
  });
  */

});