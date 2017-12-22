/*global angular*/

angular.module('taoismApp').config(function ($stateProvider) {
    'use strict';
    $stateProvider.state('main', {
        url: '/',
        abstract: true,
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl',
        authenticate: true
    });
});
