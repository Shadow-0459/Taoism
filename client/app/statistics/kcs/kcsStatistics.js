/*global angular*/

angular.module('taoismApp').config(function ($stateProvider) {
    'use strict';
    $stateProvider.state('main.statistics', {
        url: 'kcsStatistics',
        templateUrl: 'app/statistics/kcs/kcsStatistics.html',
        controller: 'kcsStatisticsCtrl',
        authenticate: true
    });
});
