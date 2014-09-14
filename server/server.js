var express = require('express');
var bodyParser = require('body-parser');
var pullRequestHandler = require('../lib/pull_request_handler.js');
var auth = require('./auth.js');
var api = require('./api.js');
var exphbs  = require('express-handlebars');
var mongoData = require('../lib/data.js');
var hbsHelpers = require('../lib/helpers/handlebars.js');

var app = express();
app.use(bodyParser.json());
app.use(auth.app);
app.use(api.app);
app.engine('hbs', exphbs({
  extname: 'hbs',
  defaultLayout: 'main.hbs',
  helpers: hbsHelpers
}));
app.set('view engine', 'hbs');

function parsePing(req, res) {
  pullRequestHandler.ping(req.body.hook);
  res.status(200).end('Zen message: ' + req.body.zen);
}

function parsePullRequest(req, res) {
  var payload = req.body;
  if (!payload) {
    console.log('No payload :(');
    res.status(404).end();
    return;
  }

  var action = payload.action;
  var number = payload.number;
  var pullRequest = payload.pull_request;

  if (!action || !number || !pullRequest) {
    res.status(404).end('Missing parameters');
    return;
  }

  if (action === 'opened') {
    pullRequestHandler.pullRequest(action, number, pullRequest);
    res.status(200).end();
  } else {
    res.status(200).end('Action not implemented ' + action);
  }
}

app.post('/hook', function(req, res) {
  var payload = req.body;
  if (payload.zen) {
    parsePing(req, res);
  } else {
    parsePullRequest(req, res);
  }
});

// Static content
app.use(express.static(__dirname + '/../static/'));

app.get('/', function(req, res) {
  if (req.isAuthenticated()) {
    mongoData.getUserSpiedInfo(req.user).then(function(info) {
      res.render('main.hbs', {
        user: req.user,
        repos: info.repos
      });
    });
  } else {
    res.render('intro.hbs');
  }
});

var Server = {
  app: app,
  start: function() {
    var server = app.listen(3000, function() {
      console.log('Listening on port %d', server.address().port);
    });
  }
};

module.exports = Server;
