/*global angular*/

angular.module('taoismApp').config(function ($stateProvider) {
    'use strict';
    $stateProvider.state('main.reviewedkcs', {
        url: 'reviewedkcs',
        templateUrl: 'app/reviewedKCS/reviewedKCS.html',
        controller: 'reviewedKCSCtrl',
        authenticate: true
    });
});
