/*global require, module, exports*/

var mysql = require('mysql');
var pool  = mysql.createPool({
    host     : 'ibm-x3550m4-1.gsslab.rdu2.redhat.com',
    port     : '3306',
    user     : 'kcsdw_xiaoxwan',
    password : 'RW8Vn6S&kG*y',
    database : 'kcsdw'
});

exports.pool = pool;
