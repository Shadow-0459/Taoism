/*global require, exports*/
var mongodb = require('../../modules/mongodb');
var User = mongodb.User;

exports.queryUser = function (req, res) {
    'use strict';
    var rhn = req.query.rhn;
    User.findOne({rhn: rhn}).exec(function (error, user) {
        if (error) {
            res.status(500).send(error);
        }
        if (user) {
            res.json(user);
        } else {
            User.create({rhn: rhn}, function (error, user) {
                if (error) {
                    res.status(500).send(error);
                }
                res.json(user);
            });
        }
    });
};

exports.queryAllUser = function (req, res) {
    'use strict';
    User.find().exec(function (error, users) {
        if (error) {
            res.status(500).send(error);
        }
        var temp = [];
        users.forEach(function (user) {
            temp.push(user.rhn);
        });
        res.json(temp);
    });
};


exports.updateUser = function (req, res) {
    'use strict';
    var user = req.body;
    User.findOneAndUpdate({rhn: user.rhn}, {sbrs: user.sbrs}, {'new': true}, function (error, updatedUser) {
        if (error) {
            res.status(500).send(error);
        }
        res.json(updatedUser);
    });
};
