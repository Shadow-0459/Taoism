/*global angular, document, moment*/

angular.module('taoismApp').controller('proactiveIssueSearchSidenavCtrl', function ($mdSidenav, $rootScope, $scope, Utilities, AuthenticationService) {
    'use strict';
    $scope.issueTypeOptions = {
        isCase: false,
        isKCS: false,
        isBug: false
    };
    $scope.sbrOptions = Utilities.sbrOptions;
    $scope.productOptions = Utilities.productOptions;
    $scope.selectSearch = Utilities.selectSearch;
    $scope.proactiveIssueSBR = [];

    $scope.refresh = function () {
        $scope.user = AuthenticationService.getCurrentUser();
        $scope.user.$promise.then(function () {
            $scope.startDate = moment().subtract(1, 'weeks').startOf('week').toDate();
            $scope.endDate = moment().subtract(1, 'weeks').endOf('week').toDate();
            if ($scope.user.sbrs && $scope.user.sbrs.length > 0) {
                $scope.proactiveIssueSBR = angular.copy($scope.user.sbrs);
            }
        });
    };
    $scope.refresh();

    $scope.$on(Utilities.USER_PROFILE_UPDATED, function () {
        $scope.refresh();
    });

    $scope.hideSidenav = function () {
        $mdSidenav(Utilities.PROACTIVE_ISSUE_SEARCH).close().then(function functionName() {
            var query = {
                filter: {}
            }, issueType = [];
            if ($scope.keyword) {
                query.filter.keyword = $scope.keyword;
            }
            if ($scope.proactiveIssueSBR && $scope.proactiveIssueSBR.length > 0) {
                query.filter.sbr = {
                    $in: $scope.proactiveIssueSBR
                };
            }
            if ($scope.proactiveIssueProduct) {
                query.filter.product = {
                    $in: [$scope.proactiveIssueProduct]
                };
            }
            if ($scope.startDate && $scope.endDate) {
                query.filter.lastReportDate = {
                    $gte: $scope.startDate,
                    $lte: $scope.endDate
                };
            } else {
                if ($scope.startDate) {
                    query.filter.lastReportDate = {
                        $gte: $scope.startDate
                    };
                } else if ($scope.endDate) {
                    query.filter.lastReportDate = {
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
            $rootScope.$broadcast(Utilities.PROACTIVE_ISSUE_SEARCH_CRITERIA_CHANGED, { queryParams: query });
        });
    };
    $scope.cancelSidenav = function () {
        $mdSidenav(Utilities.PROACTIVE_ISSUE_SEARCH).close();
    };
    $scope.lastWeek = function () {
        Utilities.lastWeek($scope.startDate, $scope.endDate, $scope);
    };
    $scope.nextWeek = function () {
        Utilities.nextWeek($scope.startDate, $scope.endDate, $scope);
    };
});
