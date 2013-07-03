var should = require('should')
var winston = require('winston')
var inspect = require('eyespect').inspector()
var assert = require('assert')
var fs = require('fs')
var routerLib = require('./index.js');
var optimist = require('optimist');
var nconf = require('nconf')
start()
function start() {
  var argv = optimist.demand(['config']).argv;
  var configFilePath = argv.config
  assert.ok(fs.existsSync(configFilePath), 'config file not found at path: ' + configFilePath);
  var config = nconf.argv().env().file({file: configFilePath});
  var logger = require('loggly-console-logger')
  logger.debug('spinning up docparse secure proxy', {
    type: 'secureProxy',
    configFilePath: configFilePath
  })
  routerLib(config, function (err, server) {
    should.not.exist(err, 'error starting secure proxy: ' + JSON.stringify(err))
    inspect('docparse router online')
    logger.debug('docparse router online', {
      type: 'secureProxy',
      service: 'docparse'
    })
  })
}
