const Authentication = require('./controllers/authentication');
const passportService = require('./services/passport');
const passport = require('passport');

// middleware of sorts
// when a user is authenticated, don't create a session for them
const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
  // app has functions that are associated to http requests such as get and post
  // .get's 1st arguement is the path, 2nd is the callback function,
  // which gets called with 3 variables

  // req = request; object that represents the incoming http request
  // res = response; object that we will wrap up and send back to whoever made the
  //        request
  // next = error handling
  app.get('/', requireAuth, function(req, res, next) {
    res.send({ message: 'Super secret code is ABC123'});
  });

  // send user a token when user is auth'd
  app.post('/signin', requireSignin, Authentication.signin);
  // send user a token when user sign up
  app.post('/signup', Authentication.signup);

};