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
    doc = doc || {};
    res.send(200, doc);
  });
})

module.exports.app = app;
