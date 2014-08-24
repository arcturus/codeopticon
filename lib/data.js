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

module.exports = {
  saveRepo: saveRepo,
  getUser: getUser,
  saveUser: saveUser,
  saveSpy: saveSpy,
  getSpies: getSpies
};
