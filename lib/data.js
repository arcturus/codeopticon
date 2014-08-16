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

module.exports = {
  saveRepo: saveRepo
};
