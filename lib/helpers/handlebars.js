'use strict';


function json(context) {
  return JSON.stringify(context);
}

function value(context, key) {
  return context[key];
}

exports.json = json;
exports.value = value;
