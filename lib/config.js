var fs = require('fs')
    , nconf = require('nconf')
    , path = require('path');

(function(exports) {
  nconf.use('memory');
  nconf.argv().env().file({ file: path.resolve(__dirname, '../config.json') });
  var config = nconf.get();
  exports.config = {
    get all() {
      return nconf.get();
    },
    'get': function(key) {
      return config[key];
    }
  };
})(module.exports);
