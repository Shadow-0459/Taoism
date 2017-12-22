/*global angular, document, moment*/

angular.module('taoismApp').controller('kcsSearchSidenavCtrl', function ($mdSidenav, $rootScope, $scope, Utilities, AuthenticationService) {
    'use strict';
    $scope.kcsStateOptions = {
        isVerified: true,
        isUnverified: false,
        isInProgress: false
    };
    $scope.sbrOptions = Utilities.sbrOptions;
    $scope.productOptions = Utilities.productOptions;
    $scope.selectSearch = Utilities.selectSearch;

    $scope.refresh = function () {
        $scope.user = AuthenticationService.getCurrentUser();
        $scope.user.$promise.then(function () {
            $scope.query = {
                keyword: '',
                filter: {
                    SBR: [],
                    product: '',
                    startDate: moment().subtract(1, 'weeks').startOf('week').toDate(),
                    endDate: moment().subtract(1, 'weeks').endOf('week').toDate(),
                    kcsState: []
                },
                isShowInProgress: false,
                limit: 100000
            };
            if ($scope.user.sbrs && $scope.user.sbrs.length > 0) {
                $scope.query.filter.SBR = angular.copy($scope.user.sbrs);
            }
        });
    };
    $scope.refresh();

    $scope.$on(Utilities.USER_PROFILE_UPDATED, function () {
        $scope.refresh();
    });

    $scope.hideSidenav = function () {
        $mdSidenav(Utilities.KCS_SEARCH).close().then(function functionName() {
            if ($scope.kcsStateOptions.isVerified) {
                $scope.query.filter.kcsState.push('verified');
            }
            if ($scope.kcsStateOptions.isUnverified) {
                $scope.query.filter.kcsState.push('unverified');
            }
            if ($scope.kcsStateOptions.isInProgress) {
                $scope.query.filter.kcsState.push('wip');
            }
            $rootScope.$broadcast(Utilities.KCS_SEARCH_CRITERIA_CHANGED, { queryParams: $scope.query });
        });
    };
    $scope.cancelSidenav = function () {
        $mdSidenav(Utilities.KCS_SEARCH).close();
    };
    $scope.lastWeek = function () {
        Utilities.lastWeek($scope.query.filter.startDate, $scope.query.filter.endDate, $scope.query.filter);
    };
    $scope.nextWeek = function () {
        Utilities.nextWeek($scope.query.filter.startDate, $scope.query.filter.endDate, $scope.query.filter);
    };
});
