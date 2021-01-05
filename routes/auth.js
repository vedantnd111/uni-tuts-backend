const express = require('express');
const Router = express.Router();
const { signup, login, logout,OTPsend,OTPverify } = require("../controllers/auth");
const { signUpValidator } = require('../validators');
const { userById,userByMail } = require('../controllers/user');

Router.post('/signup', signup);

Router.post('/login', login)

Router.get('/logout', logout);

Router.param('userId', userById);

Router.post('/send',OTPsend);

Router.get('/verify',OTPverify);

module.exports = Router;