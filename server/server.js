var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

function parsePing(req, res) {
  console.log('Zen message: ' + req.body.zen);
  res.status(200).end();
}

function parsePullRequest(req, res) {
  var payload = req.body;
  if (!payload) {
    console.log('No payload :(');
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

var Server = {
  app: app,
  start: function() {
    var server = app.listen(3000, function() {
      console.log('Listening on port %d', server.address().port);
    });
  }
};

module.exports = Server;
