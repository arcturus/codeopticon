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
    console.log('Getting information from ' + user + '/' + repo);
  }

  var App = {
    start: start,
  }

  exports.App = App;

})(window);

window.App.start();
