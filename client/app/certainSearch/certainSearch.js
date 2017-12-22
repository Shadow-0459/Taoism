/*global angular*/

angular.module('taoismApp').config(function ($stateProvider) {
    'use strict';
    $stateProvider.state('main.certainSearch', {
        url: 'certainSearch',
        templateUrl: 'app/certainSearch/certainSearch.html',
        controller: 'certainSearchCtrl',
        authenticate: true
    });
});
