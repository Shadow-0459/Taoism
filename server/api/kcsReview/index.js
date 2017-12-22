/*global require, module*/

var express = require('express');
var controller = require('./kcsReview');

var router = express.Router();

router.get('*', controller.solr);

module.exports = router;
