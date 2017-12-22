/*global angular*/

angular.module('taoismApp').config(function ($stateProvider) {
    'use strict';
    $stateProvider.state('main.linkedkcs', {
        url: 'linkedkcs',
        templateUrl: 'app/linkedKCS/linkedKCS.html',
        controller: 'linkedKCSCtrl',
        authenticate: true
    });
});
