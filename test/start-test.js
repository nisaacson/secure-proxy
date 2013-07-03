var should = require('should')
var fs = require('fs')
var assert = require('assert')
var portfinder = require('portfinder')
var argv = require('optimist').demand('config').argv
var configFilePath = argv.config
assert.ok(fs.existsSync(configFilePath), 'config file not found at path: ' + configFilePath)
var config = require('nconf').env().argv().file({
  file: configFilePath
})
var secureProxy = require('../index')
describe('Secure Proxy', function() {
  it('should start secure proxy server', function(done) {
    portfinder.getPort(function(err, portReply) {
      should.not.exist(err, 'error getting available port')
      config.set('tls:port', portReply)
      secureProxy(config, function(err, reply) {
        should.not.exist(err, 'error starting secure proxy server')
        should.exist(reply, 'no reply in secure proxy server callback')
        should.exist(reply.server, 'server field missing in callback')
        should.exist(reply.port, 'server field missing in callback')
        reply.port.should.eql(portReply)
        done()
      })
    })
  })
})
