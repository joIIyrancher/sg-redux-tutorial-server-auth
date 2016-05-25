const Authentication = require('./controllers/authentication');

module.exports = function(app) {
  // app has functions that are associated to http requests such as get and post
  // .get's 1st arguement is the path, 2nd is the callback function,
  // which gets called with 3 variables

  // req = request; object that represents the incoming http request
  // res = response; object that we will wrap up and send back to whoever made the
  //        request
  // next = error handling
  app.get('/', function(req, res, next) {
    res.send(['waterbottle', 'phone', 'paper']);
  });

  app.post('/signup', Authentication.signup);


};