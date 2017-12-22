/*global angular, document, moment*/

angular.module('taoismApp').controller('reviewedProactiveIssueSearchSidenavCtrl', function ($mdSidenav, $rootScope, $scope, $http, Utilities, AuthenticationService) {
    'use strict';
    $scope.issueTypeOptions = {
        isCase: false,
        isKCS: false,
        isBug: false
    };
    $scope.sbrOptions = Utilities.sbrOptions;
    $scope.productOptions = Utilities.productOptions;
    $scope.selectSearch = Utilities.selectSearch;
    $http.get('api/user/queryAll').then(function (response) {
        $scope.users = response.data;
    });

    $scope.refresh = function () {
        $scope.user = AuthenticationService.getCurrentUser();
        $scope.user.$promise.then(function () {
            $scope.startDate = moment().subtract(1, 'weeks').startOf('week').toDate();
            $scope.endDate = moment().subtract(1, 'weeks').endOf('week').toDate();
            if ($scope.user.sbrs && $scope.user.sbrs.length > 0) {
                $scope.reviewedProactiveIssueSBR = angular.copy($scope.user.sbrs);
            }
        });
    };
    $scope.refresh();

    $scope.$on(Utilities.USER_PROFILE_UPDATED, function () {
        $scope.refresh();
    });

    $scope.hideSidenav = function () {
        $mdSidenav(Utilities.REVIEWED_PROACTIVE_ISSUE_SEARCH).close().then(function functionName() {
            var query = {
                filter: {
                    reviewState: {$ne: 'In Progress'},
                    devloperActionState: 'reviewed'
                }
            }, issueType = [];
            if ($scope.keyword) {
                query.filter.keyword = $scope.keyword;
            }
            if ($scope.lastReviewedBy) {
                query.filter.lastReviewedBy = $scope.lastReviewedBy;
            }
            if ($scope.reviewedProactiveIssueSBR) {
                query.filter.sbr = {
                    $in: [$scope.proactiveIssueSBR]
                };
            }
            if ($scope.reviewedProactiveIssueProduct) {
                query.filter.product = {
                    $in: [$scope.proactiveIssueProduct]
                };
            }
            if ($scope.startDate && $scope.endDate) {
                query.filter.lastReviewedDate = {
                    $gte: $scope.startDate,
                    $lte: $scope.endDate
                };
            } else {
                if ($scope.startDate) {
                    query.filter.lastReviewedDate = {
                        $gte: $scope.startDate
                    };
                } else if ($scope.endDate) {
                    query.filter.lastReviewedDate = {
                        $lte: $scope.endDate
                    };
                }
            }
            if ($scope.issueTypeOptions.isCase) {
                issueType.push('Case');
            }
            if ($scope.issueTypeOptions.isKCS) {
                issueType.push('KCS Solution');
            }
            if ($scope.issueTypeOptions.isBug) {
                issueType.push('Bugzilla Bug');
            }
            if (issueType && issueType.length > 0) {
                query.filter.issueType = {
                    $in: issueType
                };
            }
            $rootScope.$broadcast(Utilities.REVIEWED_PROACTIVE_ISSUE_SEARCH_CRITERIA_CHANGED, { queryParams: query });
        });
    };
    $scope.cancelSidenav = function () {
        $mdSidenav(Utilities.REVIEWED_PROACTIVE_ISSUE_SEARCH).close();
    };
    $scope.lastWeek = function () {
        Utilities.lastWeek($scope.startDate, $scope.endDate, $scope);
    };
    $scope.nextWeek = function () {
        Utilities.nextWeek($scope.startDate, $scope.endDate, $scope);
    };
});
