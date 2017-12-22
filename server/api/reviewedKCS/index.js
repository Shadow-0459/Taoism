/*global require, module*/

var express = require('express');
var controller = require('./reviewedKCS');

var router = express.Router();

router.post('/update', controller.updateKCS);
router.post('/query', controller.queryKCS);

module.exports = router;
