'use strict';
var Promise = require('promise');
var nodemailer = require('nodemailer');
var config = require('../config.js');
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.get('MAIL_USER'),
    pass: config.get('MAIL_PASSWORD');
  }
});

var msg = ['You are receiving this email cause PR',
'%PR%',
'is modifying the following file/files:',
'%FILES%'].join('\n');

var Mailer = {
  sendEmail: function(email, spies, pr) {
    var files = [];
    spies.forEach(function(spy) {
      files.push(spy.spy.path);
    });
    files = files.join('\n');

    var message = msg.replace('%FILES%', files).replace('%PR%', pr.html_url);

    var mailOptions = {
      from: 'no-reply@codeopticon.io',
      to: email,
      subject: '[Codeopticon] Changes are coming!',
      text: message
    };

    return new Promise(function(resolve, reject) {
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          reject(error);
        } else {
          resolve(info);
        }
      });
    });
  }
};


module.exports = Mailer;
