var fetcher = require('./fetcher.js')
   ,Promise = require('promise')
   ,data = require('./data.js');


function ping(hook) {
  var url = hook.url.substr(0, hook.url.indexOf('/hook'));
  fetcher.get(url).then(data.saveRepo);
}

var PullRequestHandler = {
  ping: ping
};

module.exports = PullRequestHandler;
