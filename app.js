const express = require("express");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require("dotenv").config();
const morgan = require('morgan');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const expressValidator = require('express-validator');
const cors=require('cors');

//app
const app = express();

// db
mongoose.connect(process.env.mongoUrl, {
    user: process.env.MONGO_USER,
    pass: process.env.MONGO_PASSWORD,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => { console.log("connected to database") });

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

//routes middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);

const port = process.env.PORT || 5000
;
app.listen(port, () => {
    console.log(`the site is on port: ${port}`)
});
