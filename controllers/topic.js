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
    form.parse(req, (err, fields) => {
        if (err) {
            return res.status(400).json({ error: "topic can't be added!" });
        }
        const { name, description, url, subject } = fields;
        if (!name || !description || !url || !subject) {
            return res.status(400).json({ error: "all fields required!" });
        }
        let topic = new Topic(fields);
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

    form.parse(req, (err, fields) => {
        if (err) {
            return res.status(400).json({ error: "topic could not be updated!!" });
        }
        const { name, description, subject, url } = fields;
        if (!name || !description || !subject || !url) {
            return res.status(400).json({ error: "all fields are required!!" });
        }
        let topic = req.topic;
        topic = _.extend(topic, fields);
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