/*global angular*/

angular.module('taoismApp').config(function ($stateProvider) {
    'use strict';
    $stateProvider.state('main.kcsreview', {
        url: 'kcsreview',
        templateUrl: 'app/kcsReview/kcsReview.html',
        controller: 'kcsReviewCtrl',
        authenticate: true
    });
});
