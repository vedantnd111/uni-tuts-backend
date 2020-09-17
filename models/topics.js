const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;
const validate = require('mongoose-validator');

const topicSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
    ,
    description: {
        type: String,
        required: true
    },
    about: {
        type: String
    },
    subject: {
        type: ObjectId,
        ref: "Subject",
        required: true
    },
    url: {
        type: String,
        required:true,
        unique:true
    }

},
    {timestamps:true});

topicSchema.path('url').validate((val) => {
    urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
    return urlRegex.test(val);
}, 'Invalid URL.');

module.exports = mongoose.model('Topic', topicSchema);