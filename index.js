// Main starting point of the applyMiddleware
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const router = require('./router');

const mongoose = require('mongoose');
// Db setup
mongoose.connect('mongodb://localhost:auth/auth');

//
// App setup (Get express working the way we want it to)
//

// Any incoming request gets passed into morgan and then into bodyparser
// morgan logs incoming requests
app.use(morgan('combined'));
// bodyParser parses requests into JSON
app.use(bodyParser.json({ type: '*/*' }));
// The router accepts our app, the router will send users to different
// parts of the app depending on the route
router(app);

//
// Server setup (Get our app to talk to the outside world)
//

// Any time an http request is received, forward it to 'app'
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on port: ', port);
