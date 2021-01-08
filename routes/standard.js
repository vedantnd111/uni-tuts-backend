const express = require('express');
const Router = express.Router();

const { requireLogIn, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { list, read, create, standardById, update, remove, photo } = require('../controllers/standard');


Router.get('/standards', list);

Router.get('/standard/:standardId', read);

Router.post('/standard/create/:userId', requireLogIn, isAuth, isAdmin, create);

Router.put('/standard/:standardId/:userId', requireLogIn, isAdmin, update);

Router.delete('/standard/:standardId/:userId', requireLogIn, isAuth, isAdmin, remove);

Router.get('/standard/photo/:standardId', photo);

Router.param('standardId', standardById);



Router.param('userId', userById);
module.exports = Router;