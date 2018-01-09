const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local strategy
// Use the email field as a source for the username
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  // Verify the username and password


  // Call done if the username and password is correct

  // Otherwise call done with false
  User.findOne({ email: email }, function(err, user) {
    if (err) { return done(err); }
    if (!user) { return done(null, false); }

    // Compare passwords - is password equal to user.password?
    user.comparePassword(password, function(err, isMatch) {
        // Return the error
        if (err) { return done(err); }
        // No error this time (null), but 'false' indicates we did not find user
        if (!isMatch) { return done(null, false); }

        // Otherwise, return no error and the user
        return done(null, user);
    });
  });

});

// Setup options for JWT Strategy
// Tell the strategy where to look on the request for the jwt
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT Strategy
// Payload is the decoded jwt token
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // The callback sees if the user ID in the payload exists in our database
  // If it does, call done with that user

  // Otherwise, call done without a user object
  User.findById(payload.sub, function(err, user) {
    // Return an error saying we didn't find a user
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }

  });
});

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
