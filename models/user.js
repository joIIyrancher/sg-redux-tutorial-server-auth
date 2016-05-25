// Local definition of user; teach mongoose how to handle our user model
const mongoose = require('mongoose');

// Schema tells mongoose the very particular fields that our models
// will have
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');



// Define our model
// we will need to define the fields and their type
// if we want to specify more than just type, then we have to put the props in a object

// unique does not enforce case sensitivity, so we force all strings
// to be lowercase before saving to db
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true }, 
  password: String   // String here is referring to JS type String
});



// On Save Hook, encrypt password
// Before saving a model, run this function  (this is a hook of sort)
userSchema.pre('save', function(next) {
  // context of 'this' is the user model; get access to the user model
  const user = this;

  // generate a salt; and it will take some time to generate. So we'll pass in a
  // callback to wait until genSalt finishes
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }

    // hash (encrypt) our password using the salt, which takes some time to do
    // so we pass in another callback
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err) { return next(err); }

      // overwrite plain text password with encrypted password
      user.password = hash;

      // save model
      // password value saved in db contains both salt and hashed password
      next();
    });
  });
});



// when we create a user object, it will have access to the methods property
userSchema.methods.comparePassword = function(candidatePassword, callback) {
  // bcrypt will take the salt from 'this.password' and hash the candidatePassword
  // then it compares the 2 hashed passwords
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return callback(err); }

    callback(null, isMatch);
  })
}





// Create the model class
const ModelClass = mongoose.model('user', userSchema); // loads schema into mongoose
// tells mongoose that userSchema corresponds to a collection called 'user'




// Export the model
module.exports = ModelClass;