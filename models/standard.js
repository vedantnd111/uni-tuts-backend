const mongoose = require('mongoose');

const standardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description:{
        type:String,
        required:true
    },
    photo:{
        data:Buffer,
        ContentType:String
    }
},{
    timestamps:true
});

module.exports = mongoose.model('Standard', standardSchema);