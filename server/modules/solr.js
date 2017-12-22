/*global require, module*/

var solr = require('solr-client');
var querystring = require('querystring');

/*var client = solr.createClient({
    host: 'gss-solr01.web.prod.ext.phx2.redhat.com',
    port: '8888',
    path: '/solr/collection1'
});*/
var client = solr.createClient({
    host: 'pnt-gss-solr04.web.prod.ext.phx2.redhat.com',
    port: '8888',
    path: '/solr/access_shard2_replica2'
});

function or(val) {
    'use strict';
    if (Array.isArray(val)) {
        return '("' + val.join('" OR "') + '")';
    }
    var valArr = val.split(',');
    if (valArr.length === 1) {
        return '"' + val + '"';
    }
    return '("' + valArr.join('" OR "') + '")';
}

function isNumeric(num) {
    'use strict';
    var test = num.replace(' ', '', 'g').replace(',', '', 'g');
    return !isNaN(test);
}

var fields = 'view_uri,title,id,case_count:caseCount,sbr,tag,product,lastModifiedDate,lastModifiedBySSOName,kcsState';

module.exports.query = function (args) {
    'use strict';
    var Q = {
            '+documentKind': 'Solution',
            '+language': 'en',
            '+ModerationState': 'published'
        },
        query = client.createQuery().fl(fields),
        keyword = args.keyword,
        ids = args.ids,
        filter = args.filter;

    if (args.limit) {
        query.rows(args.limit);
    }

    if (keyword && isNumeric(keyword)) {
        Q = {};
        Q['+id'] = or(keyword);
    } else if (keyword) {
        Q['+body'] = keyword;
    }

    if (ids && ids.length) {
        if (Q['+id']) {
            Array.prototype.push.apply(ids, keyword.split(','));
        }
        Q['+id'] = or(ids);
    }

    /*if (filter.verified || typeof filter.verified === 'undefined') {
        Q['+kcsState'] = 'verified';
        Q['+ModerationState'] = 'published';
        //Q['+caseCount'] = '[1 TO *]';
    }*/
    if (filter) {
        Q['+kcsState'] = or(filter.kcsState);
        if (filter.SBR && filter.SBR.length > 0) {
            if (Array.isArray(filter.SBR)) {
                filter.SBR.forEach(function (item) {
                    item = item.replace('&', '&amp;');
                });
            } else {
                filter.SBR = filter.SBR.replace('&', '&amp;');
            }
            Q['+sbr'] = or(filter.SBR);
        }
        if (filter.product) {
            filter.product = filter.product.replace('&', '&amp;');
            Q['+product'] = or(filter.product);
        }
        if (filter.startDate && filter.endDate) {
            //filter.product = filter.product.replace('&', '&amp;');
            Q['+lastModifiedDate'] = '[' + filter.startDate + ' TO ' + filter.endDate + ']';
        } else if (filter.startDate) {
            Q['+lastModifiedDate'] = '[' + filter.startDate + ' TO *]';
        } else if (filter.endDate) {
            Q['+lastModifiedDate'] = '[* TO ' + filter.endDate + ']';
        }
        /*if (filter['Document Type']) {
            if (filter['Document Type'].indexOf('Article') !== -1) {
                delete Q['+kcsState'];
            }
            Q['+documentKind'] = or(filter['Document Type']);
        }*/
    }
/*
    var sort = args.sort;
    if (sort && (sort.title || sort.kcsState || sort.id || sort.product)) {
        query.sort(sort);
    } else if (sort && sort.date) {
        query.sort({
            lastModifiedDate: sort.date
        });
    } else if (sort && sort.case_count) {
        query.sort({
            caseCount: sort.case_count
        });
    }*/
    query.sort({
        //lastModifiedDate: 'desc' //'asc'
        caseCount: 'desc'
    });
    query.set('q=' + querystring.stringify(Q, '%20', ':'));
    client.search(query, args.cb);
};
