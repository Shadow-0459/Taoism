/*global angular*/

angular.module('taoismApp').factory('AuthenticationService', function ($cookies, UserService) {
    'use strict';
    var authenticationService = {},
        userKey = 'rh_user',
        currentUser = {};
    if ($cookies.get(userKey)) {
        currentUser = UserService.get({rhn: $cookies.get(userKey).split('|')[0].slice(1)});
    }
    authenticationService.isLoggedIn = function () {
        if ($cookies.get(userKey)) {
            return true;
        }
        return false;
    };
    authenticationService.logout = function () {
        $cookies.remove(userKey);
    };
    authenticationService.getCurrentUser = function () {
        return currentUser;
    };
    authenticationService.refreshCurrentUser = function () {
        currentUser = UserService.get({rhn: $cookies.get(userKey).split('|')[0].slice(1)});
    };

    return authenticationService;
});
