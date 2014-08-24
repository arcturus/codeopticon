'use strict';

var re = /https:\/\/github.com\/(.+)\/(.+)\/blob\/([\w_-]+)\/([\w\d\/-_.]+)#?(L(\d+)(-L(\d+))?)?/;

exports.GitHubUrl = function(url) {
  var parts = url.match(re);
  if (!parts) {
    return null;
  }

  var result = {
    user: parts[1],
    repo: parts[2],
    branch: parts[3],
    path: parts[4]
  };

  if (parts.length > 6) {
    result.L1 = parts[6];
  }

  if (parts.length > 8) {
    result.L2 = parts[8];
  }

  return result;
};
