const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true
    },
    description: {
        type: String,
        required: true
    },
    photo:{
        data:Buffer,
        ContentType:String
    },
    standard: {
        type: ObjectId,
        ref:'Standard',
        required: true
    }
},
    { timestamps: true });

module.exports = mongoose.model('Subject', subjectSchema);