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

    registerHandlebarsHelpers();

    Handlebars.TEMPLATES = {};
  }

  function registerHandlebarsHelpers() {
    Handlebars.registerHelper('value',
     function value(context, key) {
      return context[key];
     }
    );
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
    $.get('/api/spies/all').done(function(data) {
      getTemplate('repos_list', data).then(function(html) {
        $('#repos_list').html(html);
      });
    }).fail(function() {
    });
  }

  function getTemplate(name, data) {
    if (Handlebars.TEMPLATES[name]) {
      return $.Deferred(function(def) {
        def.resolve(Handlebars.TEMPLATES[name](data));
      }).promise();
    }

    return $.get('/partials/'+name+'.hbs').then(function(src) {
      Handlebars.TEMPLATES[name] = Handlebars.compile(src);
      return Handlebars.TEMPLATES[name](data);
    });
  }

  var App = {
    start: start,
    refreshRepos: refreshRepos
  }

  exports.App = App;

})(window);

window.App.start();
