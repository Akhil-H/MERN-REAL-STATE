const express = require('express');
const authrouter = express.Router();
const signup = require('../Controllers/auth.controller.js');
const signin = require('../Controllers/auth.controller.js');
const login =require('../Controllers/auth.controller.js');
const google =require('../Controllers/auth.controller.js');



authrouter.post('/signup', signup); // Pass signup function reference, not invoking it
authrouter.post('/signin', signin); // Pass signup function reference, not invoking it
authrouter.post('/api/login', login); // Pass signup function reference, not invoking it
authrouter.post('/api/google',google)

module.exports = authrouter;
