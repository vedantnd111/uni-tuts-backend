const express = require('express');
const Router = express.Router();
const { requireLogIn, isAdmin, isAuth } = require("../controllers/auth");
const { userById,read,update } = require("../controllers/user");

Router.get('/secret/:userId', requireLogIn, isAuth,isAdmin, (req, res) => {
    res.json({ user: req.profile });
});

Router.get('/user/:userId', requireLogIn, isAuth,read);

// Router.get("/user/mail/:mailId",findByMail);

Router.put('/user/:userId', requireLogIn, isAuth,update);

Router.param('userId', userById);

// Router.param("mailId",userByMail);

module.exports = Router;