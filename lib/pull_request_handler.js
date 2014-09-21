var fetcher = require('./fetcher.js')
   , Promise = require('promise')
   , data = require('./data.js')
   , diffParser = require('diff-parse')
   , mailer = require('./helpers/mailer.js');

function ping(hook) {
  var url = hook.url.substr(0, hook.url.indexOf('/hook'));
  fetcher.get(url).then(data.saveRepo);
}

function checkRepo(scope) {
  if (!scope.repo) {
    return Promise.reject('No valid repo');
  }

  var repo = scope.repo;
  if (!repo.name || !repo.id) {
    return Promise.reject('Invalid repo info');
  }
  return data.getRepo(repo.id).then(function(doc) {
    if (!doc) {
      return Promise.reject('Unkonwn repo');
    } else {
      return scope;
    }
  });
}

function fetchData(scope) {
  if (!scope.diffUrl) {
    return Promise.reject('Could not find diff');
  }

  return fetcher.get(scope.diffUrl).then(function(diff) {
    scope.modifications = diffParser(diff);
    return scope;
  });
}

function analisePulRequest(scope) {
  var repoOwner = scope.repo.owner.login;
  var repoName = scope.repo.name;

  var promises = [];
  scope.modifications.forEach(function(mod) {
    promises.push(modifiesSpiedFile(repoOwner, repoName, mod));
  });

  return Promise.all(promises).then(function(modifications) {
    // Filter null results
    var changes = modifications.filter(function(x) {
      return x !== null;
    });

    scope.notifications = changes;
    return scope;
  });
}

function modifiesSpiedFile(repoOwner, repoName, change) {
  var spy = {
    'spy.user': repoOwner,
    'spy.repo': repoName,
    'spy.path': change.from
  };

  var lines = [];
  change.lines.forEach(function(line) {
    var lineNumber = line.ln || line.ln1 || line.ln2;
    if (lineNumber) {
      lines.push(lineNumber);
    }
  });

  return data.findSpy(spy).then(function(docs) {
    if (!docs || docs.length === 0) {
      return null;
    }

    var modifications = [];
    docs.forEach(function(doc) {
      if (doc.spy.L1 === doc.spy.L2 && doc.spy.L1 === null) {
        // Watching the whole file
        modifications.push(doc);
      } else {
        var filtered = lines.filter(function(x) {
          return x >= parseInt(doc.spy.L1);
        });
        filtered = filtered.filter(function(x) {
          return x <= doc.spy.L2 === null ? parseInt(doc.spy.L1) :
           parseInt(doc.spy.L2);
        });

        if (filtered.length > 0) {
          modifications.push(doc);
        }
      }
    });

    return modifications;
  });
}

function notify(scope) {
  // Filter (just one email per user) and group
  // by files
  var notifications = {};
  scope.notifications.forEach(function(spies) {
    spies.forEach(function(spy) {
      var userName = spy.user.username;
      if (!(userName in notifications)) {
        var email = spy.user.emails[0].value;
        notifications[userName] = {
          user: userName,
          email: email,
          spies: []
        };
      }
      notifications[userName].spies.push(spy);
    });
  });

  var emails = [];
  Object.keys(notifications).forEach(function(userName) {
    var email = notifications[userName].email;
    var spies = notifications[userName].spies;
    emails.push(mailer.sendEmail(email, spies, scope.pullRequest));
  });

  return Promise.all(emails);
}

function pullRequest(action, number, pr) {
  var diffUrl = pr.diff_url;
  var user = pr.user;
  var repo = pr.head.repo;

  var scope = {
    diffUrl: diffUrl,
    user: user,
    repo: repo,
    action: action,
    number: number,
    pullRequest: pr
  };

  return checkRepo(scope).then(fetchData).then(analisePulRequest).then(notify);
}

var PullRequestHandler = {
  ping: ping,
  pullRequest: pullRequest
};

module.exports = PullRequestHandler;
