/*global angular, document, moment*/

angular.module('taoismApp').controller('reviewedKCSSearchSidenavCtrl', function ($mdSidenav, $rootScope, $http, $scope, Utilities, AuthenticationService) {
    'use strict';
    $scope.reviewedKCSProduct = '';
    $scope.reviewedKCSSBR = [];
    $scope.lastReviewedBy = '';
    $scope.startDate = moment().subtract(0, 'weeks').startOf('week').toDate();
    $scope.endDate = moment().subtract(0, 'weeks').endOf('week').toDate();
    $http.get('api/user/queryAll').then(function (response) {
        $scope.users = response.data;
    });
    $scope.user = AuthenticationService.getCurrentUser();
    $scope.user.$promise.then(function () {
        $scope.lastReviewedBy = $scope.user.rhn;
        if ($scope.user.sbrs && $scope.user.sbrs.length > 0) {
            $scope.reviewedKCSSBR = angular.copy($scope.user.sbrs);
        }
    });
    $scope.sbrOptions = Utilities.sbrOptions;
    $scope.productOptions = Utilities.productOptions;
    $scope.selectSearch = Utilities.selectSearch;
    $scope.hideSidenav = function () {
        $mdSidenav(Utilities.REVIEWED_KCS_SEARCH).close().then(function functionName() {
            var query = {};
            if ($scope.lastReviewedBy) {
                query.lastReviewedBy = $scope.lastReviewedBy;
            }
            if ($scope.reviewedKCSSBR) {
                query.sbr = {
                    $in: [$scope.reviewedKCSSBR]
                };
            }
            if ($scope.reviewedKCSProduct) {
                query.product = {
                    $in: [$scope.reviewedKCSProduct]
                };
            }
            if ($scope.startDate && $scope.endDate) {
                query.lastReviewedDate = {
                    $gte: $scope.startDate,
                    $lte: $scope.endDate
                };
            } else {
                if ($scope.startDate) {
                    query.lastReviewedDate = {
                        $gte: $scope.startDate
                    };
                } else if ($scope.endDate) {
                    query.lastReviewedDate = {
                        $lte: $scope.endDate
                    };
                }
            }
            $rootScope.$broadcast(Utilities.REVIEWED_KCS_SEARCH_CRITERIA_CHANGED, query);
        });
    };
    $scope.cancelSidenav = function () {
        $mdSidenav(Utilities.REVIEWED_KCS_SEARCH).close();
    };
    $scope.lastWeek = function () {
        Utilities.lastWeek($scope.startDate, $scope.endDate, $scope);
    };
    $scope.nextWeek = function () {
        Utilities.nextWeek($scope.startDate, $scope.endDate, $scope);
    };
});
