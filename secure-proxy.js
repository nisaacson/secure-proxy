var should = require('should')
var inspect = require('eyespect').inspector()
var assert = require('assert')
var fs = require('fs')
var optimist = require('optimist');
var nconf = require('nconf')
var argv = optimist.demand(['config']).argv;
var configFilePath = argv.config
assert.ok(fs.existsSync(configFilePath), 'config file not found at path: ' + configFilePath);
var config = nconf.argv().env().file({
  file: configFilePath
});

require('./index')(config, function(err, reply) {
  should.not.exist(err, 'error starting secure proxy: ' + JSON.stringify(err))
  inspect(reply.port, 'docparse router online')
})
