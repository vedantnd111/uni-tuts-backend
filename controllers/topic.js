const Topic = require('../models/topics');
const formidable = require('formidable');
const _ = require('lodash');
const { errorHandler } = require('../helpers/dbErrorHandlers');
const fs = require('fs');

exports.topicById = (req, res, next, id) => {
    Topic.findById(id).exec((err, topic) => {
        if (err || !topic) {
            return res.status(400).json({ error: "no tpic found !" });
        }
        req.topic = topic;
        next();
    })
};

exports.create = (req, res) => {
    let form = formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({ error: "topic can't be added!" });
        }
        const { name, description, url, subject, standard } = fields;
        if (!name || !description || !url || !subject || !standard) {
            return res.status(400).json({ error: "all fields required!" });
        }
        let topic = new Topic(fields);
        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(403).json({ error: "size of photo should be less than 1 mb" });
            }

            topic.photo.data = fs.readFileSync(files.photo.path);
            topic.photo.contentType = files.photo.type;
        }
        topic.save((err, result) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ error: errorHandler(err) });
            }
            res.status(200).json(result);
        })

    })

};

exports.read = (req, res) => {
    return res.json(req.topic);
};

exports.photo = (req, res) => {
    if (req.topic.photo.data) {
        res.set('Content-Type', req.topic.photo.contentType);
        return res.send(req.topic.photo.data);
    }
    next();
};

exports.readBySubject = (req, res) => {
    Topic.find({ subject: req.subject._id })
        .then((data, err) => {
            if (err || !data) {
                return res.status(400).json({ error: errorHandler(err) });
            }
            res.status(200).json(data);
        })
};

exports.update = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({ error: "Image can not be uploaded!!" });
        }
        const { name, description, standard, subject, url } = fields;
        if (!name || !description || !standard || !subject || !url) {
            return res.json({ error: "all fields are required" });
        }
        let topic = req.topic;
        topic = _.extend(topic, fields);
        if (files.photo) {
            if (files.photo.size > 1000000) {
                return res.status(403).json({ error: "size of photo should be less than 1 mb" });
            }

            topic.photo.data = fs.readFileSync(files.photo.path);
            topic.photo.contentType = files.photo.type;
        }
        topic.save((err, result) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ error: errorHandler(err) });
            }
            res.json(result);
        })

    });

};

exports.remove = (req, res) => {
    let topic = req.topic;
    Topic.deleteOne((err, deletedTopic) => {
        if (err || !deletedTopic) {
            console.log(err)
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({ message: "topic deleted successfully" });
    })
}