const Authentication = require('./controllers/authentication');
// Not used, but we need our custom passport code to be run
require('./services/passport');
const passport = require('passport');

// By default, passport tries to make a cookie based session,
// since we are using tokens, set that to false
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
  // User needs authorization of some form to access this resource
  app.get('/', requireAuth, function(req, res) {
    res.send({ hi: 'there' });
  });

  // User must be signed in before hitting the signin route handler
  app.post('/signin', requireSignin, Authentication.signin);
  // Signup is available to all users
  app.post('/signup', Authentication.signup);
}
