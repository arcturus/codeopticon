'use strict';

(function(exports) {

  // Initialise all the thinigs \o/
  function start() {
    var repo = document.getElementById('repos');
    // First screen can be null
    if (repo) {
      repo.addEventListener('click', clickHandler);
    }
  }

  // Delegate all the clicks here ... what could go wrong?
  function clickHandler(evt) {
    var target = evt.target;
    if (target.dataset.type === 'repo') {
      getRepoInformation(target.dataset.user, target.dataset.repo);
    }
  }

  function getRepoInformation(user, repo) {
    var url = '/api/spies/repos/:repoUser/:repoName'.
      replace(':repoUser', user).
      replace(':repoName', repo);

    var req = $.ajax({url: url}).done(function() {
      // Array of objects {spy.path: '....'}
      var files = req.responseJSON;
      var container = document.querySelector('#' + user + '_' + repo + ' section');
      container.innerHTML = '';
      files.forEach(function(file) {
        var div = document.createElement('div');
        div.textContent = file['spy.path'];
        container.appendChild(div);
      });
    });
  }

  var App = {
    start: start,
  }

  exports.App = App;

})(window);

window.App.start();
