/*global angular*/

angular.module('taoismApp').config(function ($stateProvider) {
    'use strict';
    $stateProvider.state('main.reviewedproactiveissue', {
        url: 'reviewedproactiveissue',
        templateUrl: 'app/reviewedProactiveIssue/reviewedProactiveIssue.html',
        controller: 'reviewedProactiveIssueCtrl',
        authenticate: true
    });
});
