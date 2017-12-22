/*global angular, document, moment*/

angular.module('taoismApp').controller('linkedKCSSearchSidenavCtrl', function ($mdSidenav, $rootScope, $http, $scope, Utilities, AuthenticationService) {
    'use strict';
    $scope.linkedKCSSBR = [];
    $scope.startDate = moment().subtract(1, 'weeks').startOf('week').toDate();
    $scope.endDate = moment().subtract(1, 'weeks').endOf('week').toDate();
    $scope.limitation = 30;
    $http.get('api/user/queryAll').then(function (response) {
        $scope.users = response.data;
    });
    $scope.sbrOptions = Utilities.sbrOptions;
    $scope.selectSearch = Utilities.selectSearch;

    $scope.refresh = function () {
        $scope.user = AuthenticationService.getCurrentUser();
        $scope.user.$promise.then(function () {
            if ($scope.user.sbrs && $scope.user.sbrs.length > 0) {
                $scope.linkedKCSSBR = angular.copy($scope.user.sbrs);
            }
        });
    };
    $scope.refresh();

    $scope.$on(Utilities.USER_PROFILE_UPDATED, function () {
        $scope.refresh();
    });

    $scope.hideSidenav = function () {
        $mdSidenav(Utilities.LINKED_KCS_SEARCH).close().then(function functionName() {
            var query = {
                SBR: $scope.linkedKCSSBR,
                startDate: $scope.startDate,
                endDate: $scope.endDate,
                limitation: $scope.limitation
            };

            $rootScope.$broadcast(Utilities.LINKED_KCS_SEARCH_CRITERIA_CHANGED, query);
        });
    };
    $scope.cancelSidenav = function () {
        $mdSidenav(Utilities.LINKED_KCS_SEARCH).close();
    };
    $scope.lastWeek = function () {
        Utilities.lastWeek($scope.startDate, $scope.endDate, $scope);
    };
    $scope.nextWeek = function () {
        Utilities.nextWeek($scope.startDate, $scope.endDate, $scope);
    };
});
