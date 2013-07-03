var request = require('request')
var inspect = require('eyespect').inspector()
var http = require('http')
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
var logger = require('loggly-console-logger')
// disable logging to console
logger.transports.console.level = 'silly'
var insecureResponseBody = 'hello world'
describe('Proxy', function() {
  var port
  before(function(done) {
    portfinder.getPort(function(err, portReply) {
      should.not.exist(err, 'error getting available port')
      config.set('tls:port', portReply)
      secureProxy(config, function(err, reply) {
        should.not.exist(err, 'error starting secure proxy server')
        should.exist(reply, 'no reply in secure proxy server callback')
        should.exist(reply.server, 'server field missing in callback')
        should.exist(reply.port, 'server field missing in callback')
        port = reply.port
        port.should.eql(portReply)
        done()
      })
    })
  })

  it('should proxy request', function(done) {
    setupRouter(function() {
      var url = 'https://localhost:' + port
      var opts = {
        url: url,
        strictSSL: false
      }
      request(opts, function(err, res, body) {
        should.not.exist(err)
        body.should.eql(insecureResponseBody)
        done()
      })
    })
  })
});

function setupRouter(cb) {
  var server = http.createServer(function(req, res) {
    res.writeHead(200)
    res.end(insecureResponseBody)
  })
  var port = config.get('application:router:port')
  server.listen(port, cb)
}
