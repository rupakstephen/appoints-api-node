var config = require('./config');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var FacebookStrategy = require('passport-facebook');
var User = require('./models/user');

function handleProviderResponse(provider, userId, email, displayName, accessToken, refreshToken, callback) {
  User.findByUserIdAndProvider(userId, provider, function (err, dbUser) {
    if (! dbUser) {
      dbUser = new User({
        provider: provider,
        userId: userId,
        email: email, 
        displayName: displayName || email
      });
    }

    dbUser.providerAccessToken = accessToken;
    dbUser.providerRefreshToken = refreshToken;
    dbUser.lastAuthenticated = new Date();

    dbUser.save(function (err, dbUser) {
      if (err) {
        throw err;
      }
      callback(null, dbUser);
    });
  });
}

exports.configure = function () {

  passport.use(new GoogleStrategy({
      clientID: config.settings.authProviders.google.clientId,
      clientSecret: config.settings.authProviders.google.clientSecret,
      callbackURL: config.settings.authProviders.google.callbackUrl
    },
    function(accessToken, refreshToken, profile, done) {
      return handleProviderResponse(profile.provider, profile.id, profile.emails[0].value, profile.displayName, accessToken, refreshToken, done);
    }
  ));

  passport.use(new FacebookStrategy({
    clientID: config.settings.authProviders.facebook.clientId,
    clientSecret: config.settings.authProviders.facebook.clientSecret,
    callbackURL: config.settings.authProviders.facebook.callbackUrl,
    profileFields: ['id','displayName', 'emails', 'name']
  },
  function(accessToken, refreshToken, profile, cb) {
    return handleProviderResponse(profile.provider, profile.id, profile.emails[0].value, profile.displayName, accessToken, refreshToken, cb);
  }
));

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (obj, done) {
    done(null, obj);
  });

  passport.serializeUser(function(user, cb) {
    cb(null, user);
  });

  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });

}