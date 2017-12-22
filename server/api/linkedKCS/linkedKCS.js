/*global require, exports*/
var kcsdw = require('../../modules/kcsdw.js');
var mongodb = require('../../modules/mongodb');
var Lodash = require('lodash');

function convertStringToArray(string) {
    'use strict';
    var temp = string.split('#'),
        array = [];
    temp.forEach(function (o) {
        if (o) {
            array.push(o);
        }
    });
    return array;
}
exports.queryKCS = function (req, res) {
    'use strict';
    var query = req.body;
    kcsdw.pool.getConnection(function (err, connection) {
        if (err) {
            res.status(500).send(err);
        } else {
            var sql = "SELECT k.resource_display_id id, nr.title, c.sbr_groups sbr, sc.products product,"
                + " Count(k.resource_display_id) section_case_count"
                + " FROM case_resource_relationships k, node_revisions nr, cases c, solution_content sc"
                + " WHERE k.type = 'Link'"
                + " AND k.resource_display_id = nr.nid"
                + " AND k.caseid = c.id"
                + " AND k.resource_display_id = sc.nid"
                + " AND nr.published = 1"
                + " AND nr.current = 1"
                + " AND sc.language = 'en'",
                temp = '';
            if (query.startDate) {
                sql = sql + " AND k.linked_at > '" + query.startDate + "'";
            }
            if (query.endDate) {
                sql = sql + " AND k.linked_at < '" + query.endDate + "'";
            }
            if (query.SBR && query.SBR.length > 0) {
                query.SBR.forEach(function (sbr) {
                    temp = temp + 'c.sbr_groups LIKE \'%' + sbr + '%\' OR ';
                });
                temp = temp.slice(0, temp.length - 4);
                sql = sql + " AND (" + temp + ")";
            }
            sql = sql + " GROUP BY k.resource_display_id"
                + " ORDER BY section_case_count DESC"
                + " LIMIT " + query.limitation;
            connection.query(sql, function (err, rows) {
                // And done with the connection.
                connection.release();
                // Don't use the connection here, it has been returned to the pool.
                if (err) {
                    res.status(500).send(err);
                } else {
                    var resultIDs = Lodash.map(rows, 'id');
                    rows.forEach(function (row) {
                        row.sbr = convertStringToArray(row.sbr);
                        row.product = convertStringToArray(row.product);
                        row.reviewState = '';
                        row.view_uri = 'https://access.redhat.com/solutions/' + row.id;
                    });
                    mongodb.ReviewedKCS.find({id: {$in: resultIDs}}).populate('activities').exec(function (error, solutions) {
                        if (error) {
                            res.status(500).send(error);
                        } else {
                            Lodash.each(rows, function (result) {
                                var solution = Lodash.find(solutions, {id: result.id});
                                if (solution) {
                                    if (solution.lastModifiedDate === result.lastModifiedDate) {
                                        result.devloperActionState = solution.devloperActionState;
                                    }
                                    result.lastReviewedDate = solution.lastReviewedDate;
                                    result.lastReviewedBy = solution.lastReviewedBy;
                                    result.activities = solution.activities;
                                    result.reviewState = solution.reviewState;
                                }
                            });
                            res.json(rows);
                        }
                    });
                }
            });
        }
    });
};
