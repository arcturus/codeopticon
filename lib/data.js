var pmongo = require('promised-mongo');

var db = pmongo('codeopticon');
var collections = {};

function getCollection(name) {
  if (!(name in collections)) {
    collections[name] = db.collection(name);
  }

  return collections[name];
}

function saveRepo(repo) {
  var repos = getCollection('repos');

  if (typeof repo === 'string') {
    repo = JSON.parse(repo);
  }

  return repos.findOne({id: repo.id}).then(function(data) {
    if (data) {
      return;
    }
    return repos.save(repo);
  });
}

function getRepo(obj) {
  var repos = getCollection('repos');

  var filter = typeof obj === 'string' ?
   {id: obj} : obj;

  return repos.findOne(filter);
}

function getUser(id) {
  var users = getCollection('users');

  return users.findOne({id: id});
}

function saveUser(user) {
  var users = getCollection('users');

  return users.findOne({id: user.id}).then(function(data) {
    if (data) {
      return data;
    }

    return users.save(user);
  });
}

function saveSpy(spy) {
  var spies = getCollection('spies');
  return spies.findOne(spy).then(function(data) {
    if (data) {
      return data;
    }

    return spies.save(spy);
  });
}

function getSpies(user) {
  var spies = getCollection('spies');
  return spies.find({
    'user.id': user.id
  }).toArray();
}

function findSpy(filter) {
  var spies = getCollection('spies');
  return spies.find(filter).toArray();
}

function getSpiedReposByUser(user) {
  var spies = getCollection('spies');
  var group = {
    key: {
      'spy.user': '1',
      'spy.repo': '1'
    },
    reduce: function(curr, result) {
    },
    initial:{
    },
    cond: {
      'user.id': user.id
    }
  };

  return spies.group(group);
}

function getSpiedFilesByRepo(user, repoUser, repoName) {
  var spies = getCollection('spies');
  var group = {
    key: {
      'spy.path': '1'
    },
    reduce: function(curr, result) {
    },
    initial:{
    },
    cond: {
      'user.id': user.id,
      'spy.user': repoUser,
      'spy.repo': repoName
    }
  };

  return spies.group(group);
}

module.exports = {
  saveRepo: saveRepo,
  getRepo: getRepo,
  getUser: getUser,
  saveUser: saveUser,
  saveSpy: saveSpy,
  getSpies: getSpies,
  findSpy: findSpy,
  getSpiedReposByUser: getSpiedReposByUser,
  getSpiedFilesByRepo: getSpiedFilesByRepo
};
