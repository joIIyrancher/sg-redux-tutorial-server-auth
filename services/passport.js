// passport is an authentication library for node and express
// it's normally used to cookie-based authentication

const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
// a strategy is a method for authenticating a user
const LocalStrategy = require('passport-local');


// Create local strategy
const localOptions = { usernameField: 'email' };

// first arg in LocalStrategy is to tell it where to find email
const localLogin = new LocalStrategy(localOptions, function (email, password, done) {
  // Verify this email and password, call done with the user
  // if it is the correct email and password
  // otherwise, call done with false
  User.findOne({ email: email }, function(err, user){
    if (err) { return done(err); }
    if (!user) { return done(null, false); }

    // compare passwords - is `password` (the one supplied by the request) equal to user.password?
    user.comparePassword(password, function(err, isMatch) {
      if (err) { return done(err); }
      if (!isMatch) { return done(null, false); }

      // passport assigns the user to req.user for us
      return done(null, user);
    })
  })
})



// Setup options for JWT Strategy (tell it where to find token and what secret for decode)
const jwtOptions = {
  // we are telling jwt strategy that whenever a request comes in,
  // and we want passport to handle it.. it needs to look at the request
  // header and specifically a header called authorization to find the token

  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret
};

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  // payload is the decoded jwt token
  // done is a callback function that we need to call, depending on
  // whether we are able to successfully authenicate the user

  // See if the user ID in the payload exists in our database
  // If it does, call 'done' with that user
  // otherwise, call done without a user object
  User.findById(payload.sub, function(err, user) {
    //  1st arg for done is error, 2nd is user if found
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    }
    else {
      done(null, false);
    }
  })
})

// Tell passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);