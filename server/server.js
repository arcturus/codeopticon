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
  console.log('Zen message: ' + req.body.zen);
  pullRequestHandler.ping(req.body.hook);
  res.status(200).end();
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
    console.log('Dont have all the parameters');
    res.status(404).end();
    return;
  }

  if (action === 'opened') {
    console.log('And here is where I parse the pull request');
    res.status(200).end();
  } else {
    console.log('Dont know this action :(');
    res.status(200).end();
  }
}

app.post('/hook', function(req, res) {
  console.log('Hook working! ' + JSON.stringify(req.body));
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
    mongoData.getSpiedReposByUser(req.user).then(function(repos) {
      console.log('0000000> sending ' + JSON.stringify(repos));
      res.render('main.hbs', {
        user: req.user,
        repos: repos
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
