/*global angular*/

angular.module('taoismApp').controller('userSidenavCtrl', function ($http, $mdSidenav, $mdToast, $rootScope, $scope, $state, AuthenticationService, Utilities) {
    'use strict';
    $scope.sbrOptions = Utilities.sbrOptions;
    //$scope.productOptions = Utilities.productOptions;
    $scope.selectSearch = Utilities.selectSearch;
    $scope.searchTerm = '';
    AuthenticationService.getCurrentUser().$promise.then(function (user) {
        $scope.user = angular.copy(user);
        if (!$scope.user.sbrs) {
            $scope.user.sbrs = [];
        }
    });
    $scope.hideSidenav = function () {
        AuthenticationService.getCurrentUser().$promise.then(function (user) {
            if (angular.equals($scope.user, user)) {
                $mdSidenav(Utilities.USER_PROFILE).close();
            } else {
                $http.post('api/user/update', $scope.user).then(function (response) {
                    var updatedUser = response.data;
                    AuthenticationService.refreshCurrentUser();
                    $mdSidenav(Utilities.USER_PROFILE).close();
                    $mdToast.show(
                        $mdToast.simple().textContent('User ' + updatedUser.rhn + ' has been updated!').position('bottom right').hideDelay(3000)
                    );
                    if ($state.is('main.kcsreview') || $state.is('main.linkedkcs') || $state.is('main.proactiveissuereview')) {
                        $rootScope.$broadcast(Utilities.USER_PROFILE_UPDATED);
                    }
                }, function (error, status) {
                    Utilities.showToastWithAction('Error ' + status + ': ' + error.message, 'bottom right');
                });
            }
        });
    };
    $scope.cancelSidenav = function () {
        AuthenticationService.getCurrentUser().$promise.then(function (user) {
            $scope.user = angular.copy(user);
            $mdSidenav(Utilities.USER_PROFILE).close();
        });
    };
});
