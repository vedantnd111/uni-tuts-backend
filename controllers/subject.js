const Subject = require('../models/subject');
const { errorHandler } = require('../helpers/dbErrorHandlers');
const _ = require('lodash');
const formidable = require('formidable');
const fs = require("fs");
const topics = require('../models/topics');

exports.subjectById = (req, res, next, id) => {
    Subject.findById(id).exec((err, subject) => {
        if (err || !subject) {
            console.log("error: ",err);
            console.log("subject: ",subject);
            return res.status(400).json({ error: "no products found!!" });
        }
        req.subject = subject;
        next()
    })

};

exports.read = (req, res, next) => {
    return res.json(req.subject);
};

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({ error: "Image could not be uploaded!!" });
        }
        const { name, description, standard } = fields;
        if (!name || !description || !standard) {
            return res.status(400).json({ error: "all fields are required!!" });
        }
        let subject = new Subject(fields);
        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(403).json({ error: "size of photo should be less than 1 mb" });
            }

            subject.photo.data = fs.readFileSync(files.photo.path);
            subject.photo.contentType = files.photo.type;
        }
        subject.save((err, result) => {
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
            return res.status(400).json({ error: "Image can not be uploaded!!" });
        }
        const { name, description, standard } = fields;
        if (!name || !description || !standard) {
            return res.json({ error: "all fields are required" });
        }
        let subject = req.subject;
        subject = _.extend(subject, fields);
        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(403).json({ error: "size of photo should be less than 1 mb" });
            }

            subject.photo.data = fs.readFileSync(files.photo.path);
            subject.photo.contentType = files.photo.type;
        }
        subject.save((err, result) => {
            if (err) {
                // console.log(err);
                return res.status(400).json({ error: errorHandler(err) });
            }
            res.json(result);
        })

    });

};

exports.list = (req, res, next) => {
    Subject.find()
        .then((err, subjects) => {
            if (err || !subjects) {
                return res.status(400).json({ error: "subjects not found!" })
            }
            else {
                res.status(200).json(subjects);
            }
        })
        .catch(err => console.log(err))

};

exports.remove = (req, res) => {
    let subject = req.subject;
    Subject.deleteOne((err, deletedSubject) => {
        if (err || !deletedSubject) {
            console.log(err)
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({ message: "subject deleted successfully" });
    })
};


exports.photo = (req, res) => {
    if (req.subject.photo.data) {
        res.set('Content-Type', req.subject.photo.contentType);
        return res.send(req.subject.photo.data);
    }
    next();
};

exports.readByStandard = (req, res) => {
    const standardid = req.standard._id;
    Subject.find({ standard: standardid })
        .then((subjects,err) => {
            if (err || !subjects || subjects.length===0) {
                return res.status(400).json({ error: "no subjects found!!" });
            }
            res.status(200).json(subjects);
        })
        .catch(err => console.log(err))
};
