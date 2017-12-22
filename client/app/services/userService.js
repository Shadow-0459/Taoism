/*global angular*/

angular.module('taoismApp').factory('UserService', function ($resource) {
    'use strict';
    return $resource('/taoism/api/user/query', {rhn: '@rhn'});
});
