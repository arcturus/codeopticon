'use strict';

(function(exports) {

  var repo,
      form;

  // Initialise all the thinigs \o/
  function start() {
    repo = document.getElementById('repos');
    // First screen can be null
    if (repo) {
      repo.addEventListener('click', clickHandler);
    }

    form = document.getElementById('addSpy');
    form.addEventListener('submit', addNewSpy);
  }

  // Delegate all the clicks here ... what could go wrong?
  function clickHandler(evt) {

  }

  function addNewSpy(e) {
    e.preventDefault();
    var url = form.querySelector('[name="githubUrl"]').value.trim();
    if (!url || url.length === 0) {
      return;
    }

    $.post(form.action, {
        githubUrl: url
      },
      refreshRepos
    ).fail(function() {
      alert('Could not add spy');
    });
    return false;
  }

  function refreshRepos() {
    alert('Refrescando repos');
  }

  var App = {
    start: start,
    refreshRepos: refreshRepos
  }

  exports.App = App;

})(window);

window.App.start();
