/*global require, exports*/

var solr = require('../../modules/solr');
var mongodb = require('../../modules/mongodb');
var _ = require('lodash');

exports.solr = function (req, res) {
    'use strict';
    var ids = req.query.ids,
        keyword = req.query.keyword,
        filter,
        sort,
        limit = +req.query.limit,
        isShowInProgress = req.query.isShowInProgress;
    if (req.query.filter) {
        filter = JSON.parse(req.query.filter);
    }
    if (req.query.sort) {
        sort = JSON.parse(req.query.sort);
    }
    solr.query({
        ids: ids,
        keyword: keyword,
        filter: filter,
        sort: sort,
        limit: limit,
        cb: solrCallback
    });

    function solrCallback(error, obj) {
        if (error) {
            res.status(500).send(error);
        }
        var results = obj.response.docs;
        if (results && results.length > 0) {
            results = _.uniq(results, 'id');
            var resultIDs = _.map(results, 'id');
            mongodb.ReviewedKCS.find({id: {$in: resultIDs}}).populate('activities').exec(function (error, solutions) {
                if (error) {
                    res.status(500).send(error);
                } else {
                    _.each(results, function (result) {
                        var solution = _.find(solutions, {id: result.id});
                        if (solution) {
                            if (solution.lastModifiedDate === result.lastModifiedDate) {
                                result.devloperActionState = solution.devloperActionState;
                            }
                            result.lastReviewedDate = solution.lastReviewedDate;
                            result.lastReviewedBy = solution.lastReviewedBy;
                            result.activities = solution.activities;
                            result.reviewState = solution.reviewState;
                        }
                        //entry.date = new Date(entry.lastModifiedDate);
                        //entry._sbrs = ((entry.sbr && entry.sbr.join(', ')) || (entry.sbrs && entry.sbrs.sbr && entry.sbrs.sbr.join(', ')) || '—');
                        //entry._products = ((entry.product && entry.product.join(', ')) || (entry.products && entry.products.product && entry.products.product.join(', ')) || '—');
                    });
                    if (isShowInProgress === 'true') {
                        var query = {reviewState: 'In Progress'};
                        if (filter.SBR) {
                            if (Array.isArray(filter.SBR)) {
                                query.sbr = {$in: filter.SBR};
                            } else {
                                query.sbr = {$in: [filter.SBR]};
                            }
                        }
                        mongodb.ReviewedKCS.find(query).populate('activities').exec(function (error, solutions) {
                            if (error) {
                                res.status(500).send(error);
                            } else {
                                if (solutions) {
                                    results = solutions.concat(results);
                                    results = _.uniq(results, 'id');
                                }
                                res.json(results);
                            }
                        });
                    } else {
                        res.json(results);
                    }
                }
            });
        } else {
            res.json(results);
        }
    }
};
