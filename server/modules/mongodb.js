/*global require, process, console, exports, Schema*/

var env = process.env.NODE_ENV || 'development';
var port_mongo = process.env.OPENSHIFT_MONGODB_DB_PORT || 27017;
var host_mongo = process.env.OPENSHIFT_MONGODB_DB_HOST || 'localhost';
var db_username = process.env.OPENSHIFT_MONGODB_DB_USER || 'admin';
var db_password = process.env.OPENSHIFT_MONGODB_DB_PASSWORD || 'redhat';
var url_mongo = 'mongodb://' + host_mongo + ':' + port_mongo + '/taoism';
var mongoose = require('mongoose');
if ('production' === env) {
    url_mongo = 'mongodb://' + db_username + ':' + db_password + '@' + host_mongo + ':' + port_mongo + '/taoism';
} else {
    mongoose.set('debug', true);
}

mongoose.Promise = require('bluebird');
mongoose.connect(url_mongo, { useMongoClient: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    'use strict';
    console.log('MongoDB connection success!');
});

var userSchema = mongoose.Schema({
    rhn: String,
    sbrs: Array,
    role: String, //"rule devleper", "manager", "admin"
    status: String // "active", "inactive"
});

var User = mongoose.model('User', userSchema);
exports.User = User;

var activitiesSchema = mongoose.Schema({
    kcsID: String,
    author: String,
    content: String,
    type: String,
    date: String
});
var Activities = mongoose.model('Activities', activitiesSchema);
exports.Activities = Activities;

var reviewedKCSSchema = mongoose.Schema({
    view_uri: String,
    title: String,
    id: String,
    case_count: Number,
    section_case_count: Number,
    sbr: Array,
    tag: Array,
    product: Array,
    lastModifiedDate: String,
    lastModifiedBySSOName: String,
    kcsState: String,
    lastReviewedDate: String,
    lastReviewedBy: String,
    reviewState: String,
    devloperActionState: String,
    activities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activities'
    }]
    //activities: [{type: String, date: String, author: String, content: String}]
    //comments: [{createDate: String, author: String, content: String}]
});

var ReviewedKCS = mongoose.model('ReviewedKCS', reviewedKCSSchema);
exports.ReviewedKCS = ReviewedKCS;

var proactiveIssueSchema = mongoose.Schema({
    view_uri: String,
    issueType: String,
    id: String,
    title: String,
    proactiveIssueState: String,
    sbr: Array,
    product: Array,
    lastReportBy: String,
    lastReportDate: String,
    lastReviewedBy: String,
    lastReviewedDate: String,
    reviewState: String,
    devloperActionState: String,
    activities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activities'
    }]
});
var ProactiveIssue = mongoose.model('ProactiveIssue', proactiveIssueSchema);
exports.ProactiveIssue = ProactiveIssue;
