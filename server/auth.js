var express = require('express')
    , passport = require('passport')
    , GitHubStrategy = require('passport-github').Strategy
    , mongoData = require('../lib/data.js')
    , morgan  = require('morgan')
    , cookieParser = require('cookie-parser')
    , bodyParser = require('body-parser')
    , methodOverride = require('method-override')
    , session = require('express-session');

var GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || '';
var GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || '';

// Serialise use just by id
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// Deserialise by querying mongo
passport.deserializeUser(function(id, done) {
  mongoData.getUser(id).then(function(user) {
    done(null, user);
  });
});

passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: "http://7411887a.ngrok.com/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      mongoData.saveUser(profile).then(function() {
        return done(null, profile);
      });
    });
  }
));

var app = express();
// Logger
app.use(morgan('combined'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(methodOverride());
app.use(session({secret: '12crfwpSDFF WFS{}21\\~'}));
app.use(passport.initialize());
app.use(passport.session());


app.get('/auth/github',
  passport.authenticate('github'),
  function(req, res){
  }
);

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

module.exports.app = app;
module.exports.ensureAuthenticated = ensureAuthenticated;
