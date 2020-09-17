const express = require('express');
const Router = express.Router();
const { requireLogIn, isAdmin, isAuth } = require('../controllers/auth');
const { create, list, subjectById, read, remove, update, photo, readByStandard } = require('../controllers/subject');
const { userById } = require('../controllers/user');
const { standardById } = require('../controllers/standard');


Router.get('/subjects', requireLogIn, list);

Router.get('/subject/:subjectId', requireLogIn, read);

Router.post('/subject/create/:userId', requireLogIn, isAdmin, create);

Router.delete('/subject/:subjectId/:userId', requireLogIn, isAdmin, remove);

Router.put('/subject/:subjectId/:userId', requireLogIn, isAdmin, update);

Router.get('/subject/photo/:subjectId', photo);

Router.get('/subject/:standardId/:userId', requireLogIn, readByStandard);

Router.param('userId', userById);

Router.param('standardId',standardById);

Router.param('subjectId', subjectById);

module.exports = Router;