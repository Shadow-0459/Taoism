/*global require, exports*/
var mongodb = require('../../modules/mongodb');
var ReviewedKCS = mongodb.ReviewedKCS;
var Activities = mongodb.Activities;
var _ = require('lodash');

exports.queryKCS = function (req, res) {
    'use strict';
    var query = req.body;
    query.reviewState = {$ne: 'In Progress'};
    query.devloperActionState = 'reviewed';
    ReviewedKCS.find(query).populate('activities').exec(function (err, results) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json(results);
        }
    });
};

exports.updateKCS = function (req, res) {
    'use strict';
    var reviewedKCS = _.omit(req.body.kcs, ['_id']),
        activities = req.body.activities;
    Activities.create(activities, function (error, updatedActivites) {
        if (error) {
            res.status(500).send(error);
        } else {
            var activityIDs = [],
                kcs = {
                    view_uri: reviewedKCS.view_uri,
                    title: reviewedKCS.title,
                    id: reviewedKCS.id,
                    sbr: reviewedKCS.sbr,
                    tag: reviewedKCS.tag,
                    product: reviewedKCS.product,
                    lastModifiedDate: reviewedKCS.lastModifiedDate,
                    lastModifiedBySSOName: reviewedKCS.lastModifiedBySSOName,
                    kcsState: reviewedKCS.kcsState,
                    lastReviewedDate: reviewedKCS.lastReviewedDate,
                    lastReviewedBy: reviewedKCS.lastReviewedBy,
                    devloperActionState: reviewedKCS.devloperActionState,
                    reviewState: reviewedKCS.reviewState,
                    $push: {activities: { $each: activityIDs }}
                };
            if (reviewedKCS.case_count) {
                kcs.case_count = reviewedKCS.case_count;
            }
            if (reviewedKCS.section_case_count) {
                kcs.section_case_count = reviewedKCS.section_case_count;
            }
            if (!reviewedKCS.activities) {
                reviewedKCS.activities = [];
            }
            updatedActivites.forEach(function (activity) {
                activityIDs.push(activity._id);
            });
            ReviewedKCS.findOneAndUpdate({id: reviewedKCS.id}, kcs, {'upsert': true, 'new': true})
                .populate('activities')
                .exec(function (error, updatedKCS) {
                    if (error) {
                        res.status(500).send(error);
                    } else {
                        res.json(updatedKCS);
                    }
                });
        }
    });
};
