// Main starting point of the application

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// create an instance of express, which is our app
const app = express();
const router = require('./router');
const mongoose = require('mongoose'); 
const cors = require('cors');


// DB Setup
// by default, mongoose does not automatically connect to any mongoDB
// we have to tell it to do so
mongoose.connect('mongodb://localhost:auth/auth');
// internally, this creates a new db inside mongodb called 'auth'
// mongoose.connect('mongodb://localhost:auth/<db name>');



// Note about Nodemon module
// nodemon watches our project directory for any file changes
// if there are any changes, the server will restart and updated with new changes

// "dev": "nodemon index.js"     -- have added this in package.json under scripts
// npm run dev




// App Setup

// morgan and bodyParser are middleware in express; which any incoming
// request to our server will pass through


// morgan is a logging framework; logging incoming requests made to our server
app.use(morgan('combined'));
// cors is a middleware for express
app.use(cors());

// bodyParser is used to parse incoming requests, specifically json
// note: currently it'll parse any request type
app.use(bodyParser.json({ type: '*/*' }));
router(app);



// Server Setup - getting express app to talk to outside world

// if there's already an env variable called port already defined, use that
// otherwise, use 3090
const port = process.env.PORT || 3090;

// http is a native node library
const server = http.createServer(app);

// tell server to listen to port
server.listen(port);
console.log('Server listening on:', port);