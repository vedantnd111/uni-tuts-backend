const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandlers');

exports.signup = (req, res) => {
    const user = new User(req.body);
    user.save((err, user) => {
        if (err) {
            console.log(errorHandler(err));
            return res.status(400).json({
                error: errorHandler(err)
            });


        }
        user.salt = undefined;
        user.hashed_password = undefined;
        res.json({
            user
        });
    })
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({ error: "Enter valid email and password" });
        }
        
        else if (!user.authanticate(password)) {
            return res.status(401).json({ error: "email and password do not match" });
        }
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.cookie("t", token, { expire: new Date() + 9999 });
        const { _id, name, email,standard, role } = user;
        return res.json({ token, user: { _id, name, email, role,standard } });

    })
};

exports.logout = (req, res) => {
    res.clearCookie('t').json({ message: "logged out succesfully" });
}

exports.requireLogIn = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    userProperty: "auth",
});

//   return keyword is imp in if block if not used then it will send headers can't be set after send to clients
exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            error: "access denied"
        });
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if (req.profile.role == 0) {
        return res.status(403).json({ error: "admin resource! access denied" });
    }
    next();
}
