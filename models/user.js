const mongoose = require("mongoose");
const crypto = require("crypto");
const { v4: uuidv4 } = require('uuid');
const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        maxlength: 32
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    hashed_password: {
        type: String,
        required: true,
        unique: true
    },
    about: {
        type: String,
        trim: true
    },
    salt: String,
    role: {
        type: Number,
        default: 0
    },
    standard: {
        type: ObjectId,
        ref:'Standard'
    },
    active:{
        type:Boolean,
        default:false
    }
},
    { timestamps: true }
);

//virtual fields
userSchema.virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = uuidv4();
        this.hashed_password = this.encryptPassword(password);

    })
    .get(function () {
        return this._password
    });

userSchema.methods = {

    authanticate: function (plainPassword) {

        return this.encryptPassword(plainPassword) === this.hashed_password;
    },

    encryptPassword: function (password) {
        if (!password) return "";
        try {
            return crypto.createHmac('sha1', this.salt)
                .update(password)
                .digest("hex");
        }
        catch{
            return "";
        }
    }
};

module.exports = mongoose.model("User", userSchema);

