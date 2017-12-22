/*global require, process, console*/

var moment = require('moment');
var express = require('express');
var cors = require('cors');
var path = require('path');
var fs = require('fs');
var pkg = require('../package');
var appPath = '/' + pkg.name + '/';
var port = process.env.PORT || 9000;
var ip = process.env.IP || 'localhost';
var publicDir = 'client';
var app = express();
var server = require('http').createServer(app);
var bodyParser = require('body-parser');

app.use(cors({
    origin: true,
    methods: 'GET,POST,OPTIONS',
    preflightContinue: true,
    allowedHeaders: 'Content-Type,X-Requested-With,Authorization',
    credentials: true
}));

var env = process.env.NODE_ENV || 'development';
if ('production' === env) {
    publicDir = 'public';
    ip = process.env.OPENSHIFT_NODEDIY_IP || ip;
    port = process.env.OPENSHIFT_NODEDIY_PORT || port;
    if (!process.env.OPENSHIFT_NODEDIY_IP) {
        publicDir = 'dist/public';
    }
} else {
    app.use(appPath, express.static(path.resolve('.tmp')));
}

app.use(appPath, express.static(path.resolve(publicDir)));
app.use(bodyParser.json());

app.use(appPath + 'api/kcsReview', require('./api/kcsReview'));
app.use(appPath + 'api/linkedKCS', require('./api/linkedKCS'));
app.use(appPath + 'api/reviewedKCS', require('./api/reviewedKCS'));
app.use(appPath + 'api/user', require('./api/user'));
app.use(appPath + 'api/activities', require('./api/activities'));
app.use(appPath + 'api/proactiveIssue', require('./api/proactiveIssue'));

app.get('/', function (req, res) {
    'use strict';
    res.send(200);
});

app.get(appPath + '*', function (req, res) {
    'use strict';
    res.sendFile(path.resolve(publicDir + '/index.html'));
});

// Start server
server.listen(port, ip, function () {
    'use strict';
    console.log(moment().format() + ' Express server listening on %d, in %s mode', port, app.get('env'));
});
