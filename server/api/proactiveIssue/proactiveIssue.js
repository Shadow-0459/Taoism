/*global require, exports*/
var mongodb = require('../../modules/mongodb');
var ProactiveIssue = mongodb.ProactiveIssue;
var Activities = mongodb.Activities;
var lodash = require('lodash');

function isNumeric(num) {
    'use strict';
    var test = num.replace(' ', '', 'g').replace(',', '', 'g');
    return !isNaN(test);
}

exports.queryIssue = function (req, res) {
    'use strict';
    var query = req.body.filter,
        keyword = query.keyword;
    if (keyword) {
        if (isNumeric(keyword)) {
            query.id = keyword;
        } else {
            query.title = { $regex: keyword };
        }
        query = lodash.omit(query, 'keyword');
    }
    ProactiveIssue.find(query).sort([['issueType', 'ascending']]).populate('activities').exec(function (err, results) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
};

exports.reportIssue = function (req, res) {
    'use strict';
    var proactiveIssue = req.body.proactiveIssue,
        activities = req.body.activities;
    Activities.create(activities, function (error, updatedActivites) {
        if (error) {
            res.status(500).send(error);
        } else {
            var activityIDs = [],
                issue = {
                    view_uri: proactiveIssue.view_uri,
                    issueType: proactiveIssue.issueType,
                    id: proactiveIssue.id,
                    title: proactiveIssue.title,
                    proactiveIssueState: proactiveIssue.proactiveIssueState,
                    sbr: proactiveIssue.sbr,
                    product: proactiveIssue.product,
                    lastReportBy: proactiveIssue.reportBy,
                    lastReportDate: proactiveIssue.reportDate,
                    lastReviewedBy: '',
                    lastReviewedDate: '',
                    reviewState: '',
                    devloperActionState: '',
                    $push: {activities: { $each: activityIDs }}
                };
            updatedActivites.forEach(function (activity) {
                activityIDs.push(activity._id);
            });
            ProactiveIssue.findOneAndUpdate({id: proactiveIssue.id}, issue, {'upsert': true, 'new': true})
                .populate('activities')
                .exec(function (error, createdIssue) {
                    if (error) {
                        res.status(500).send(error);
                    } else {
                        res.json(createdIssue);
                    }
                });
        }
    });
};

exports.updateIssue = function (req, res) {
    'use strict';
    var proactiveIssue = req.body.proactiveIssue,
        activities = req.body.activities;
    Activities.create(activities, function (error, updatedActivites) {
        if (error) {
            res.status(500).send(error);
        } else {
            var activityIDs = [],
                issue = {
                    view_uri: proactiveIssue.view_uri,
                    issueType: proactiveIssue.issueType,
                    id: proactiveIssue.id,
                    title: proactiveIssue.title,
                    proactiveIssueState: proactiveIssue.proactiveIssueState,
                    sbr: proactiveIssue.sbr,
                    product: proactiveIssue.product,
                    lastReportBy: proactiveIssue.lastReportBy,
                    lastReportDate: proactiveIssue.lastReportDate,
                    lastReviewedBy: proactiveIssue.lastReviewedBy,
                    lastReviewedDate: proactiveIssue.lastReviewedDate,
                    reviewState: proactiveIssue.reviewState,
                    devloperActionState: proactiveIssue.devloperActionState,
                    $push: {activities: { $each: activityIDs }}
                };
            updatedActivites.forEach(function (activity) {
                activityIDs.push(activity._id);
            });
            ProactiveIssue.findOneAndUpdate({id: proactiveIssue.id}, issue, {'upsert': true, 'new': true})
                .populate('activities')
                .exec(function (error, createdIssue) {
                    if (error) {
                        res.status(500).send(error);
                    } else {
                        res.json(createdIssue);
                    }
                });
        }
    });
};
