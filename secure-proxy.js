var should = require('should')
var inspect = require('eyespect').inspector()
var assert = require('assert')
var fs = require('fs')
var argv = require('optimist').argv;
var config = require('nconf')
var configFilePath = argv.config
if (argv.config) {
  config.file({
    file: configFilePath
  });
} else {
  config.defaults({
    application: {
      router: {
        host: argv['router:host'].replace(/"/g, ''),
        port: argv['router:port']
      }
    },
    tls: {
      port: argv['tls:port'],
      keyFilePath: argv['tls:keyFilePath'],
      certFilePath: argv['tls:certFilePath']
    },
    loggly: {
      inputToken: argv['loggly:inputToken'],
      subdomain: argv['loggly:subdomain']
    }
  })
}
var logger = require('loggly-console-logger')
require('./index')(config, function(err, reply) {
  if (err) {
    logger.error('erorr starting secure proxy', {
      error: err,
      section: 'start',
      role: 'secure-proxy'
    })
  }
  should.not.exist(err, 'error starting secure proxy: ' + JSON.stringify(err))

  logger.info('secure proxy online', {
    error: err,
    section: 'start',
    role: 'secure-proxy',
    port: reply.port
  })

  if (process.send) {
    process.send('listening')
  }
})
