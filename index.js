var should = require('should');
var https = require('https')
var httpProxy = require('http-proxy');
var fs = require('fs');

module.exports = function(config, cb) {
  var logger = require('loggly-console-logger')
  var options = {}
  var router = config.get('application:router')
  if (!router) {
    return cb({
      message: 'failed to start secure-proxy, missing config',
      error: 'router field not set in config',
      stack: new Error().stack
    })
  }
  if (!router.host) {
    return cb({
      message: 'failed to start secure-proxy, missing config',
      error: 'host field not set in router config',
      stack: new Error().stack
    })
  }
  if (!router.port) {
    return cb({
      message: 'failed to start secure-proxy, missing config',
      error: 'port field not set in router config',
      stack: new Error().stack
    })
  }

  var tls = config.get('tls')
  if (!tls) {
    return cb({
      message: 'failed to start secure-proxy, missing config',
      error: 'tls field not set in config',
      stack: new Error().stack
    })
  }
  var keyFilePath = tls.keyFilePath
  var certFilePath = tls.certFilePath
  if (!fs.existsSync(keyFilePath)) {
    return cb({
      message: 'failed to start secure-proxy, tls config error with keyFilePath',
      error: 'key file does not exist at path: ' + keyFilePath,
      stack: new Error().stack
    })
  }
  if (!fs.existsSync(certFilePath)) {
    return cb({
      message: 'failed to start secure-proxy. tls config error with certFilePath',
      error: 'cert file does not exist at path: ' + certFilePath,
      stack: new Error().stack
    })
  }

  var key = fs.readFileSync(keyFilePath, 'utf8')
  var cert = fs.readFileSync(certFilePath, 'utf8')
  options = {
    https: {
      key: key,
      cert: cert
    }
  }
  var target = {
    host: router.host,
    port: router.port
  }

  var proxy = new httpProxy.HttpProxy({
    target: target
  });
  var server = https.createServer(options.https, function(req, res) {
    logger.info('proxying secure request', {
      role: 'secure-proxy',
      headers: req.headers,
      url: req.url
    })
    proxy.proxyRequest(req, res)
  })
  var proxyServerPort = tls.port || 443
  // var server = httpProxy.createServer(router.port, router.host, options)
  server.listen(proxyServerPort, function() {
    logger.debug('secure proxy listening on port', {
      role: 'secure-proxy',
      port: proxyServerPort
    })

    var output = {
      server: server,
      port: proxyServerPort
    }
    cb(null, output)
  })
}
