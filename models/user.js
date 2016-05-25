// Local definition of user; teach mongoose how to handle our user model
const mongoose = require('mongoose');

// Schema tells mongoose the very particular fields that our models
// will have
const Schema = mongoose.Schema;




// Define our model
// we will need to define the fields and their type
// if we want to specify more than just type, then we have to put the props in a object

// unique does not enforce case sensitivity, so we force all strings
// to be lowercase before saving to db
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true }, 
  password: String   // String here is referring to JS type String
});




// Create the model class
const ModelClass = mongoose.model('user', userSchema); // loads schema into mongoose
// tells mongoose that userSchema corresponds to a collection called 'user'




// Export the model
module.exports = ModelClass;