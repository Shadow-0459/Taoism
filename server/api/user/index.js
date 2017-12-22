/*global require, module*/

var express = require('express');
var controller = require('./user');

var router = express.Router();

router.get('/queryAll', controller.queryAllUser);
router.get('/query', controller.queryUser);
router.post('/update', controller.updateUser);

module.exports = router;
