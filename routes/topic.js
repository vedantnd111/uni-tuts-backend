const express = require('express');
const Router = express.Router();
const { requireLogIn, isAdmin, isAuth } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { subjectById } = require('../controllers/subject');

const { create, readBySubject, read, topicById, photo,update,remove } = require('../controllers/topic');

Router.post('/topic/create/:userId', requireLogIn, isAdmin, create);

Router.get('/topic/:subjectId/:userId', requireLogIn, readBySubject);

Router.get('/topic/:topicId', requireLogIn, read);

Router.put('/topic/:topicId/:userId',requireLogIn,isAdmin,update);

Router.delete('/topic/:topicId/:userId',requireLogIn,isAdmin,remove);

Router.param('topicId', topicById);

Router.param('subjectId', subjectById);

Router.param('userId', userById);

module.exports = Router;