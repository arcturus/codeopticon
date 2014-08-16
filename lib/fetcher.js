var request = require('request')
   ,Promise = require('promise');


function get(url) {
  return new Promise(function(resolve, reject) {
    var options = {
      url: url,
      headers: {
        'User-Agent': 'Codeopticon'
      }
    };
    request(options, function(error, response, body) {
      if (error) {
        return reject(error);
      }

      resolve(body);
    });
  });
}

module.exports = {
  get: get
};
