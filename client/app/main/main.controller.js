/*global angular*/

angular.module('taoismApp').controller('MainCtrl', function ($mdSidenav, $scope, $state, $location, AuthenticationService, Utilities) {
    'use strict';
    $scope.currentUser = AuthenticationService.getCurrentUser();

    $scope.isLoggedIn = AuthenticationService.isLoggedIn;
    $scope.isOpen = false;
    $scope.logout = function () {
        AuthenticationService.logout();
        $location.path('/');
    };
    $scope.isShown = function () {
        return $state.is('main');
    };
    $scope.showUserSidenav = function () {
        $mdSidenav(Utilities.USER_PROFILE).toggle();
    };
});
