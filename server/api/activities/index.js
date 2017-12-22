/*global require, module*/

var express = require('express');
var controller = require('./activities');

var router = express.Router();

router.post('/proactiveIssue/total', controller.queryProactiveIssueTotal);
router.post('/proactiveIssue/type', controller.queryProactiveIssueByType);
router.post('/individual', controller.queryIndividual);
router.post('/sbr', controller.querySBR);
router.post('/total', controller.queryTotal);

module.exports = router;
