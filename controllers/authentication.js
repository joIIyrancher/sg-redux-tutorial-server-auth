const User = require('../models/user');

exports.signup = function(req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

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
      res.json({ success: true });
    });
  });
}