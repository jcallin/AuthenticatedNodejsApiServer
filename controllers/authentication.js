const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
  // First argument is information we want to encode
  // Second argument is the secret we use to encrypt it
  // 'sub' is short for subject (who is this token for?)
  return jwt.encode({ sub: user.id }, config.secret);
}

exports.signin = function(req, res, next) {
  // User has already had their email and password auth'd

  // We just need to give them a token
  res.send({ token: tokenForUser(req.user) });
}

// Req is request made, res is response to send back, next is for error handling
exports.signup = function(req, res, next) {
  // For a post request, req.body is available
  const email = req.body.email;
  const password = req.body.password;
  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password' });
  }
  // First, see if a user with the given email exists
  User.findOne({ email: email }, function(err, existingUser) {
    if (err) { return next(err); }

    // If a user with email does exist, return error
    if (existingUser) {
      return res.status(422).send({ error: 'Email is in use' });
    }

    // If a user with email does NOT exist, create and save user record
    const user = new User({
      email: email,
      password: password
    });

    // Save the user to the database
    user.save(function(err) {
      if (err) { return next(err); }

      // Respond to request indicating that the user was created
      // Send back a token created for that specific user
      res.json({ token: tokenForUser(user)});

    });
  });
}
