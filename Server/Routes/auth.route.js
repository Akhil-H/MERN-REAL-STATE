const express = require('express');
const authrouter = express.Router();
const {signup,signin,google,signOut} = require('../Controllers/auth.controller.js');




authrouter.post('/signup', signup); // Pass signup function reference, not invoking it
authrouter.post('/signin', signin); // Pass signup function reference, not invoking it
authrouter.get('/signout', signOut)
authrouter.post('/api/google',google)

module.exports = authrouter;
