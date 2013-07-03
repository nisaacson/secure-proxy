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
}
else {
  config.defaults({
    router: {
      host: argv['router:host'].replace(/"/g,''),
      port: argv['router:port']
    },
    tls: {
      port: argv['tls:port'],
      keyFilePath: argv['tls:keyFilePath'],
      certFilePath: argv['tls:certFilePath']
    }
  })
}

require('./index')(config, function(err, reply) {
  should.not.exist(err, 'error starting secure proxy: ' + JSON.stringify(err))
  process.send('listening')
})
