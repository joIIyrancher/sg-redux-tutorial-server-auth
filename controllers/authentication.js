const jwt = require('jwt-simple');

const User = require('../models/user');
const config = require('../config');

// arg is a user instance
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  // first arg is what we are going to encode, 2nd arg is the secret
  // that we are going to encrypt it with
  // better to encode user.id instead of user.email bc email can change over time
  
  // as a convention jwt has a 'sub' property, short for subject; 
  // sub = who this token about; whose the subject of this token

  // iat is another convention of jwt; iat = issue at time
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}


exports.signin = function(req, res, next) {
  // User has already had their email and password auth'd
  // We just need to give them a token
  // Passport assigned user to req.user for us in user.js
  res.send({ token: tokenForUser(req.user) });
}



exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(422).send({ error: 'You must provide email and password' });
  }

  // See if a user with a given email exists

  User.findOne({ email: email }, function(err, existingUser) {
    if (err) { return next(err); }

    // If a user with email does exist, return an error
    if (existingUser) {
      // http status 422 = unprocessable entity
      return res.status(422).send({ error: 'Email is in use' });
    }

    // If a user with email does NOT exist, create and sae user record
    const user = new User({
      email: email,
      password: password
    });
    // user has only been created but not saved to db. Need to save()
    // this is a call to the db and it will take some time, so we'll need
    // a callback, which will take in error as argument, in case it's not saved
    user.save(function (err) {
      if (err) {
        return next(err);
      }
      // Respond to request indicating the user was created
      res.json({ token: tokenForUser(user) });
    });
  });
}