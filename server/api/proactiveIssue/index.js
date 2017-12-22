/*global require, module*/

var express = require('express');
var controller = require('./proactiveIssue');

var router = express.Router();

router.post('/query', controller.queryIssue);
router.post('/update', controller.updateIssue);
router.post('/report', controller.reportIssue);

module.exports = router;
