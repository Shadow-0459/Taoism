/*global require, exports*/
var mongodb = require('../../modules/mongodb');
var ReviewedKCS = mongodb.ReviewedKCS;
var Activities = mongodb.Activities;
var ProactiveIssue = mongodb.ProactiveIssue;
var User = mongodb.User;
var Promise = require('bluebird');
var Lodash = require('lodash');
var SBR = 'sbr';
var INDIVIDUAL = 'Individual';
var defaultSBRs = ['Stack', 'Virtualization', 'Networking', 'Storage', 'Containers', 'Kernel', 'SysMgmt', 'Clusterha', 'Filesystem'];
var ruleDevelopers = [ 'rhn-support-yizha', 'rhn-support-lichen', 'rhn-support-jiazhang', 'rhn-support-xialiu', 'rhn-support-jnewton', 'rhn-support-zzhou', 'rhn-support-xhao', 'rhn-support-xbai', 'rhn-support-qguo', 'rhn-support-xiaoxwan', 'rhn-support-mhuth', 'rhn-support-chenderso'];
var reviewStates = ['Not a Candidate', 'Candidate', 'Ruled', 'In Progress', 'Rule Retired'];

function queryBaseOnReviewState(res, queryParams, type) {
    'use strict';
    var promiseList = [], statistics = [];
    function query(propertyName, queryParams) {
        return ReviewedKCS.aggregate(queryParams).exec(function (error, results) {
            if (error) {
                res.status(500).send(error);
            } else {
                Lodash.each(results, function (result) {
                    var temp  = {id: result._id};
                    temp[propertyName] = result.count;
                    statistics.push(temp);
                });
            }
        });
    }
    function parseResult(id, statistic, finalList) {
        var hasSame = false;
        Lodash.each(finalList, function (item) {
            if (id === item.id) {
                hasSame = true;
                item.notCandidateCount = item.notCandidateCount + statistic.notCandidateCount;
                item.candidateCount = item.candidateCount + statistic.candidateCount;
                item.ruledCount = item.ruledCount + statistic.ruledCount;
                item.inProgressCount = item.inProgressCount + statistic.inProgressCount;
                item.ruleRetiredCount = item.ruleRetiredCount + statistic.ruleRetiredCount;
            }
        });
        if (!hasSame) {
            finalList.push({
                id: id,
                notCandidateCount: statistic.notCandidateCount,
                candidateCount: statistic.candidateCount,
                ruledCount: statistic.ruledCount,
                inProgressCount: statistic.inProgressCount,
                ruleRetiredCount: statistic.ruleRetiredCount
            });
        }
    }

    promiseList.push(query('notCandidateCount', queryParams));
    queryParams[0].$match.reviewState = 'Candidate';
    promiseList.push(query('candidateCount', queryParams));
    queryParams[0].$match.reviewState = 'Ruled';
    promiseList.push(query('ruledCount', queryParams));
    queryParams[0].$match.reviewState = 'In Progress';
    promiseList.push(query('inProgressCount', queryParams));
    queryParams[0].$match.reviewState = 'Rule Retired';
    promiseList.push(query('ruleRetiredCount', queryParams));

    Promise.all(promiseList).then(function () {
        var finalList = [];
        Lodash.each(statistics, function (statistic) {
            if (!statistic.notCandidateCount) {
                statistic.notCandidateCount = 0;
            }
            if (!statistic.candidateCount) {
                statistic.candidateCount = 0;
            }
            if (!statistic.ruledCount) {
                statistic.ruledCount = 0;
            }
            if (!statistic.inProgressCount) {
                statistic.inProgressCount = 0;
            }
            if (!statistic.ruleRetiredCount) {
                statistic.ruleRetiredCount = 0;
            }
        });
        if (type === SBR) {
            Lodash.each(statistics, function (statistic) {
                Lodash.each(statistic.id, function (id) {
                    if (Lodash.indexOf(defaultSBRs, id) !== -1) {
                        parseResult(id, statistic, finalList);
                    }
                });
            });
            Lodash.each(defaultSBRs, function (defaultSBR) {
                var hasSBR = false;
                Lodash.each(statistics, function (statistic) {
                    Lodash.each(statistic.id, function (id) {
                        if (defaultSBR === id) {
                            hasSBR = true;
                            return false;
                        }
                    });
                    if (hasSBR) {
                        return false;
                    }
                });
                if (!hasSBR) {
                    finalList.push({
                        id: defaultSBR,
                        notCandidateCount: 0,
                        candidateCount: 0,
                        ruledCount: 0,
                        inProgressCount: 0,
                        ruleRetiredCount: 0
                    });
                }
            });
        } else if (type === INDIVIDUAL) {
            Lodash.each(statistics, function (statistic) {
                parseResult(statistic.id, statistic, finalList);
            });
            Lodash.each(ruleDevelopers, function (ruleDeveloper) {
                var hasUser = false;
                Lodash.each(statistics, function (statistic) {
                    if (ruleDeveloper === statistic.id) {
                        hasUser = true;
                        return false;
                    }
                });
                if (!hasUser) {
                    finalList.push({
                        id: ruleDeveloper,
                        notCandidateCount: 0,
                        candidateCount: 0,
                        ruledCount: 0,
                        inProgressCount: 0,
                        ruleRetiredCount: 0
                    });
                }
            });
        }
        res.json(finalList);
    });
}
exports.queryIndividual = function (req, res) {
    'use strict';
    var queryParams = [
        {
            $match: {
                lastReviewedDate: req.body,
                reviewState: 'Not a Candidate'
            }
        },
        {
            $group: {
                _id: '$lastReviewedBy',
                count: {$sum: 1}
            }
        }
    ];
    queryBaseOnReviewState(res, queryParams, INDIVIDUAL);
};

exports.querySBR = function (req, res) {
    'use strict';
    var queryParams = [
        {
            $match: {
                lastReviewedDate: req.body,
                reviewState: 'Not a Candidate'
            }
        },
        {
            $group: {
                _id: '$sbr',
                count: {$sum: 1}
            }
        }
    ];
    queryBaseOnReviewState(res, queryParams, SBR);
};

exports.queryTotal = function (req, res) {
    'use strict';
    var queryParams = [
        {
            $match: {
                lastReviewedDate: req.body
            }
        },
        {
            $group: {
                _id: '$reviewState',
                count: {$sum: 1}
            }
        }
    ];
    ReviewedKCS.aggregate(queryParams).exec(function (error, results) {
        if (error) {
            res.status(500).send(error);
        } else {
            Lodash.each(reviewStates, function (reviewState) {
                var hasReviewState = false;
                Lodash.each(results, function (result) {
                    if (reviewState === result._id) {
                        hasReviewState = true;
                        return false;
                    }
                });
                if (!hasReviewState) {
                    results.push({
                        _id: reviewState,
                        count: 0
                    });
                }
            });
            res.json(results);
        }
    });
};

exports.queryProactiveIssueTotal = function (req, res) {
    'use strict';
    var queryParams = [
        {
            $match: {
                lastReviewedDate: req.body
            }
        },
        {
            $group: {
                _id: '$reviewState',
                count: {$sum: 1}
            }
        }
    ];
    ProactiveIssue.aggregate(queryParams).exec(function (error, results) {
        if (error) {
            res.status(500).send(error);
        } else {
            Lodash.each(reviewStates, function (reviewState) {
                var hasReviewState = false;
                Lodash.each(results, function (result) {
                    if (reviewState === result._id) {
                        hasReviewState = true;
                        return false;
                    }
                });
                if (!hasReviewState) {
                    results.push({
                        _id: reviewState,
                        count: 0
                    });
                }
            });
            res.json(results);
        }
    });
};

exports.queryProactiveIssueByType = function (req, res) {
    'use strict';
    var queryParams = [
        {
            $match: {
                lastReviewedDate: req.body,
                issueType: 'Case'
            }
        },
        {
            $group: {
                _id: '$reviewState',
                count: {$sum: 1}
            }
        }
    ],
    finnalResult = [];
    function parseProactiveIssueResult(type, results) {
        var parsedResult = {
            type: type,
            notCandidateCount: 0,
            candidateCount: 0,
            ruledCount: 0,
            inProgressCount: 0,
            ruleRetiredCount: 0
        };
        Lodash.each(results, function (result) {
            switch (result._id) {
                case 'Not a Candidate':
                    parsedResult.notCandidateCount = result.count;
                    break;
                case 'Candidate':
                    parsedResult.candidateCount = result.count;
                    break;
                case 'Ruled':
                    parsedResult.ruledCount = result.count;
                    break;
                case 'In Progress':
                    parsedResult.inProgressCount = result.count;
                    break;
                case 'Rule Retired':
                    parsedResult.ruleRetiredCount = result.count;
                    break;
                default:

            }
        });
        return parsedResult;
    }
    ProactiveIssue.aggregate(queryParams).exec(function (error, results) {
        if (error) {
            res.status(500).send(error);
        } else {
            finnalResult.push(parseProactiveIssueResult('Case', results));
            queryParams[0].$match.issueType = 'KCS Solution';
            ProactiveIssue.aggregate(queryParams).exec(function (error, results) {
                if (error) {
                    res.status(500).send(error);
                } else {
                    finnalResult.push(parseProactiveIssueResult('KCS Solution', results));
                    queryParams[0].$match.issueType = 'Bugzilla Bug';
                    ProactiveIssue.aggregate(queryParams).exec(function (error, results) {
                        if (error) {
                            res.status(500).send(error);
                        } else {
                            finnalResult.push(parseProactiveIssueResult('Bugzilla Bug', results));
                            res.json(finnalResult);
                        }
                    });
                }
            });
        }
    });
};
