/**
API DOC:

POST
/api/spies
Creates a new spy (look for needed parameters)

GET
/api/spies
Returns all spies for a user

GET
/api/spies/repos
Returns list of repos spied by user

GET
/api/spies/repos/:repoUser/:repoName
List of spies by user on an specific repo
**/

var express = require('express')
    , mongoData = require('../lib/data.js')
    , morgan  = require('morgan')
    , bodyParser = require('body-parser')
    , ghUrlParser = require('../lib/helpers/githuburl.js').GitHubUrl;

var app = express();
// Logger
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// All request to /api must be authenticated
app.use(function(req, res, next) {
  if (req.originalUrl.indexOf('/api') === -1) {
    next();
    return;
  }

  if (!req.isAuthenticated()) {
    res.status(400).send('User not authenticated');
    return;
  }
  next();
});

function standardReply(res, doc) {
  doc = doc || {};
  res.send(200, doc);
}

// Creates a new spy over a file
app.post('/api/spies', function(req, res) {
  var url = req.body.githubUrl;
  if (!url) {
    res.status(400).end();
    return;
  }
  var spy = ghUrlParser(url);
  if (!spy) {
    res.status(400).end();
    return;
  }
  var data = {
    user: req.user,
    spy: spy
  };

  mongoData.saveSpy(data).then(function(doc) {
    res.send(200, doc);
  });
});

app.get('/api/spies', function(req, res) {
  var user = req.user;

  mongoData.getSpies(user).then(function(doc) {
    standardReply(res, doc);
  });
});

app.get('/api/spies/repos', function(req, res) {
  var user = req.user;

  mongoData.getSpiedReposByUser(user).then(function(doc) {
    standardReply(res, doc);
  });
});

app.get('/api/spies/repos/:repoUser/:repoName', function(req, res) {
  var user = req.user;
  var repoName = req.params.repoName;
  var repoUser = req.params.repoUser;

  mongoData.getSpiedFilesByRepo(user, repoUser, repoName).then(function(doc) {
    standardReply(res, doc);
  });
});

module.exports.app = app;
