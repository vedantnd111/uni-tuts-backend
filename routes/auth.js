const express = require('express');
const Router = express.Router();
const { signup, login, logout, requireLogIn, isAdmin } = require("../controllers/auth");
const { signUpValidator } = require('../validators');
const { userById } = require('../controllers/user');

Router.post('/signup/:userId', signup);

Router.post('/login', login)

Router.get('/logout', logout);

Router.param('userId', userById);

module.exports = Router;