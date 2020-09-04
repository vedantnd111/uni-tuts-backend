const express = require('express');
const Router = express.Router();
const { signup,login,logout,requireLogIn } = require("../controllers/auth");
const { signUpValidator } = require('../validators');

Router.post('/signup', signUpValidator, signup);

Router.post('/login',login)

Router.get('/logout',logout);

module.exports = Router;