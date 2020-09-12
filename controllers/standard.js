const Standard = require('../models/standard');
const formidable = require('formidable');
const fs=require("fs");
const _=require('lodash');
const {errorHandler}=require('../helpers/dbErrorHandlers');

exports.standardById = (req, res, next, id) => {
    Standard.findById(id).exec((err, standard) => {
        if (err || !standard) {
            return res.status(400).json({ error: "no standard found!" });
        }
        req.standard = standard;
        next();
    })
};

exports.create = (req, res) => {
    let form = formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({ error: "Image could not be uploaded!!" });
        }
        const { name, photo, description } = fields;
        if (!name || !description) {
            return res.status(400).json({ error: "all fields are required!!" });
        }
        let standard = new Standard(fields);
        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(403).json({ error: "size of photo should be less than 1 mb" });
            }
            standard.photo.data = fs.readFileSync(files.photo.path);
            standard.photo.contentType = files.photo.type;
        }
        standard.save((err, result) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ error: errorHandler(err) });
            }
            res.json(result);
        })
    });

};


exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({ error: "Image could not be uploaded" });
        }
        const { name, description } = fields;
        if (!name || !description) {
            return res.json({ error: "all fields are required" });
        }
        let standard = req.standard;
        standard = _.extend(standard, fields);
        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(403).json({ error: "size of photo should be less than 1 mb" });
            }

            standard.photo.data = fs.readFileSync(files.photo.path);
            standard.photo.contentType = files.photo.type;
        }
        standard.save((err, result) => {
            if (err) {
               return res.status(400).json({ error: errorHandler(err) });
            }
            res.json(result);
        })

    });

}

exports.read = (req, res) => {
    return res.json(req.standard);
};

exports.list = (req, res) => {
    Standard.find()
    .select("-photo")
        .then((standards, err) => {
            if (err || !standards) {
                return res.status(400).json({ error: "no standards found" });
            }
            res.status(200).json(standards);
        })
};

exports.remove = (req, res) => {
    let standard = req.standard;
    Standard.deleteOne((err, deletedStandard) => {
        if (err) {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({ message: "standard deleted successfully" });
    })
};

exports.photo=(req,res)=>{
    if(req.standard.photo.data){
        res.set('Content-Type',req.standard.photo.contentType);
        return res.send(req.standard.photo.data);
    }   
    next();
};