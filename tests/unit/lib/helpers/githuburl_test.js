'use strict';
var githubUrlParser = require('../../../../lib/helpers/githuburl.js').GitHubUrl;
var assert = require('chai').assert;

suite('Github Url parser', function() {
  var url = 'https://github.com/arcturus/codeopticon/blob/master/server/server.js'
  test('> Invalid url returns null', function() {
    var result = githubUrlParser('http://example.com');
    assert.isNull(result);
  });
  test('> Whole known file', function() {
    var result = githubUrlParser(url);
    assert.isNotNull(result);
    assert.equal(result.user, 'arcturus');
    assert.equal(result.repo, 'codeopticon');
    assert.equal(result.branch, 'master');
    assert.equal(result.path, 'server/server.js');
    assert.equal(result.L1, undefined);
    assert.equal(result.L2, undefined);
  });
  test('> With single line selected', function() {
    var urlWithLine = url + '#L54';
    var result = githubUrlParser(urlWithLine);
    assert.equal(result.L1, '54');
    assert.equal(result.L2, undefined);
  });
  test('> With code interval', function() {
    var urlWithCodeInterval = url + '#L43-L56';
    var result = githubUrlParser(urlWithCodeInterval);
    assert.equal(result.L1, '43');
    assert.equal(result.L2, '56');
  });
});
