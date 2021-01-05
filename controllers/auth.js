const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
// var nodemailer = require("nodemailer");
// var xoauth2 = require('xoauth2');
const sgmail = require("@sendgrid/mail");
const {
    errorHandler
} = require('../helpers/dbErrorHandlers');
const {
    response
} = require('express');


let active = false;
let emailGen = "";

exports.signup = (req, res) => {
    const user = new User(req.body);
    // console.log("user", user);
    user.save((err, user) => {
        if (err) {
            console.log(err);
            // console.log(errorHandler(err));
            return res.status(400).json({
                error: "enter valid email and password"
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
    const {
        email,
        password
    } = req.body;
    User.findOne({
        email
    }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "Enter valid email and password"
            });
        } else if (!user.authanticate(password)) {
            return res.status(401).json({
                error: "email and password do not match"
            });
        } else if (!user.active) {
            return res.status(400).json({
                error: "verify your account"
            });
        }
        const token = jwt.sign({
            _id: user._id
        }, process.env.JWT_SECRET);
        res.cookie("t", token, {
            expire: new Date() + 9999
        });
        const {
            _id,
            name,
            email,
            standard,
            role
        } = user;
        return res.json({
            token,
            user: {
                _id,
                name,
                email,
                role,
                standard
            }
        });

    })
};

// const createToken = (id) => {
//     jwt.sign({
//         _id: id
//     }, process.env.JWT_SECRET);
// }

exports.logout = (req, res) => {
    res.clearCookie('t').json({
        message: "logged out succesfully"
    });
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
        return res.status(403).json({
            error: "admin resource! access denied"
        });
    }
    next();
}

/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
// smtpTransport = nodemailer.createTransport({
//     service: 'Gmail',
//     auth: {
//         xoauth2: xoauth2.createXOAuth2Generator({
//             user: 'vedantnd111@gmail.com',
//             pass: "8308782546"
//         })
//     }
// });

// let smtpTransport = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: 'vedantnd291@gmail.com',
//         pass: '8308782546'
//     },
//     tls: {
//         rejectUnauthorized: false
//     }
// });

var rand, host, link;
let Message = {
    to: "",
    from: "vedantnd291@gmail.com",
    subject: "Please confirm your Email account",
    html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"

};

exports.OTPsend = (req, res) => {
    console.log("OPTSend fired");
    const {
        email
    } = req.body;
    emailGen = email;
    Message.to = email;

    rand = Math.floor((Math.random() * 100) + 54);
    host = req.get('host');
    link = "http://" + "localhost:5000/api" + "/verify?id=" + rand;
    sgmail.setApiKey(process.env.SENDGRID_API_KEY);
    let html = "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>";
    Message.html = html;

    // mailOptions = {
    //     to: req.query.to,
    //     subject: "Please confirm your Email account",
    //     html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
    // }
    // console.log(Message);
    sgmail.send(Message).then((response) => {
        // next();
        res.end("email sent");
        // console.log("response: ", response);
    }).catch(err => {
        console.log(err);
    })
    // smtpTransport.sendMail(Message, (error, response) => {
    //     if (error) {
    //         console.log(error);
    //         // res.end("error");
    //         res.json({
    //             error: "email address doesn't exists"
    //         })
    //     } else {
    //         console.log("Message sent: " + response.message);
    //         res.end("sent");
    //     }
    // });
};

exports.OTPverify = (req, res) => {
    console.log(req.protocol + ":/" + req.get('host'));
    if ((req.protocol + "://" + req.get('host')) == ("http://" + host)) {
        console.log("Domain is matched. Information is from Authentic email");
        if (req.query.id == rand) {
            // const response=userByMail(req,res,mailOptions.to,next);
            active = true;
            console.log("email is verified");
            // below code is to update active attribute in database
            User.updateOne({
                email: Message.to
            }, {
                active: true
            }, (err, user) => {
                if (err) {
                    console.log("error: ", err);
                    return res.status(400).json({
                        error: "user with this email doesn't exists"
                    });
                } else {
                    // res.json({
                    //     user: user
                    // });
                    // console.log(user);
                    console.log("user is verified successfully");
                }
            });
            res.end("<h1>Email " + Message.to + " is been Successfully verified");

        } else {
            console.log("email is not verified");
            res.end("<h1>Bad Request</h1>");
        }
    } else {
        res.end("<h1>Request is from unknown source</h1>");
    }
};