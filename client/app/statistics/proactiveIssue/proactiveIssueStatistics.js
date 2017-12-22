/*global angular*/

angular.module('taoismApp').config(function ($stateProvider) {
    'use strict';
    $stateProvider.state('main.proactiveIssueStatistics', {
        url: 'proactiveIssueStatistics',
        templateUrl: 'app/statistics/proactiveIssue/proactiveIssueStatistics.html',
        controller: 'proactiveIssueStatisticsCtrl',
        authenticate: true
    });
});
