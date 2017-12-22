/*global angular*/

angular.module('taoismApp').config(function ($stateProvider) {
    'use strict';
    $stateProvider.state('main.landing', {
        url: '',
        templateUrl: 'app/landing/landing.html',
        controller: 'landingCtrl',
        authenticate: true
    });
});
