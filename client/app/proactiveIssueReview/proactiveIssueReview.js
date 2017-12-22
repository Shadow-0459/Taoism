/*global angular*/

angular.module('taoismApp').config(function ($stateProvider) {
    'use strict';
    $stateProvider.state('main.proactiveissuereview', {
        url: 'proactiveissuereview',
        templateUrl: 'app/proactiveIssueReview/proactiveIssueReview.html',
        controller: 'proactiveIssueReviewCtrl',
        authenticate: true
    });
});
