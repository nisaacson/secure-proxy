var request = require('request')
var inspect = require('eyespect').inspector()
var async = require('async')
var should = require('should')
var fork = require('child_process').fork
var path = require('path')
var portfinder = require('portfinder')
var insecureResponseBody = 'hello world'
var http = require('http')
var tlsPort, routerPort;
var child
var logger = require('loggly-console-logger')

// disable logging to console
logger.transports.console.level = 'silly'
describe('Command Line Config', function() {
  before(function(done) {
    async.series([
      function(cb) {
        portfinder.getPort(function(err, reply) {
          should.not.exist(err)
          should.exist(reply)
          tlsPort = reply
          cb()
        })
      },

      function(cb) {
        process.nextTick(function() {
          portfinder.getPort(function(err, reply) {
            should.not.exist(err)
            should.exist(reply)
            routerPort = reply+1
            cb()
          })
        })
      }
    ], done)
  })

  after(function() {
    if (child) {
      child.kill()
    }
  })

  it('should load command line options', function(done) {
    var script = path.join(__dirname, '../secure-proxy.js')
    var keyFilePath = path.join(__dirname, 'key.pem')
    var certFilePath = path.join(__dirname, 'cert.pem')
    var args = ['--router:host=127.0.0.1', '--router:port=' + routerPort, '--tls:keyFilePath=' + keyFilePath, '--tls:certFilePath=' + certFilePath, '--tls:port=' + tlsPort]
    var opts = {
      stdio: 'pipe'
    }
    child = fork(script, args, opts)
    child.on('message', function() {
      setupRouter(function() {
        var url = 'https://localhost:' + tlsPort
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
  })
})

  function setupRouter(cb) {
    var server = http.createServer(function(req, res) {
      res.writeHead(200)
      res.end(insecureResponseBody)
    })
    server.listen(routerPort, cb)
  }
