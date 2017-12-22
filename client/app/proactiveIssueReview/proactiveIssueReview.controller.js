/*global angular, document, moment*/

angular.module('taoismApp').controller('proactiveIssueReviewCtrl', function ($mdDialog, $mdSidenav, $scope, $http, AuthenticationService, Utilities) {
    'use strict';
    function query(queryParams) {
        $scope.promise = $http.post('api/proactiveIssue/query', queryParams).then(function (response) {
            response.data.forEach(function (issue) {
                if (issue.reviewState === Utilities.IN_PROGRESS) {
                    $scope.inProgressIssueList.push(issue);
                } else {
                    $scope.issueList.push(issue);
                }
            });
            if (response.data && response.data.length === 0) {
                Utilities.showToast('No Rule Nomination found!', 'bottom right');
            }
        }, function (error, status) {
            Utilities.showToastWithAction('Error ' + status + ': ' + error.message, 'bottom right');
        });
    }

    $scope.formatDate = Utilities.formatDate;
    $scope.isHowTo = Utilities.isHowTo;
    $scope.issueList = [];
    $scope.inProgressIssueList = [];
    $scope.isShowInProgress = true;
    $scope.resultsOptions = {
        limit: 15,
        limitOptions: [15, 50, 100],
        page: 1
    };

    $scope.$on(Utilities.PROACTIVE_ISSUE_SEARCH_CRITERIA_CHANGED, function (event, args) {
        var lastReportDate = args.queryParams.filter.lastReportDate;
        if (lastReportDate) {
            if (lastReportDate.$gte && lastReportDate.$lte) {
                $scope.subtitle = $scope.formatDate(lastReportDate.$gte) + '  -  ' + $scope.formatDate(lastReportDate.$lte);
            } else {
                if (lastReportDate.$gte) {
                    $scope.subtitle = $scope.formatDate(lastReportDate.$gte) + '  -  ∞';
                } else if (lastReportDate.$lte) {
                    $scope.subtitle = '∞  -  ' + $scope.formatDate(lastReportDate.$lte);
                }
            }
        } else {
            $scope.subtitle = '∞  -  ∞';
        }
        //$scope.isShowInProgress = args.queryParams.isShowInProgress;
        $scope.issueList = [];
        $scope.inProgressIssueList = [];
        query(args.queryParams);
    });
    $scope.$on(Utilities.USER_PROFILE_UPDATED, function () {
        $scope.issueList = [];
        $scope.inProgressIssueList = [];
        $scope.refresh();
    });

    // Display default search results
    $scope.refresh = function () {
        $scope.startDate = moment().subtract(0, 'weeks').startOf('week').toDate();
        $scope.endDate = moment().subtract(0, 'weeks').endOf('week').toDate();
        $scope.subtitle = $scope.formatDate($scope.startDate) + '  -  ' + $scope.formatDate($scope.endDate);
        $scope.user = AuthenticationService.getCurrentUser();
        $scope.user.$promise.then(function () {
            var queryParams = {
                filter: {
                    lastReportDate: {
                        $gte: $scope.startDate,
                        $lte: $scope.endDate
                    }
                },
                isShowInProgress: true
            };
            if ($scope.user.sbrs && $scope.user.sbrs.length > 0) {
                queryParams.filter.sbr = {
                    $in: angular.copy($scope.user.sbrs)
                };
            }
            query(queryParams);
        });
    };
    $scope.refresh();

    $scope.showSearchSidenav = function () {
        $mdSidenav(Utilities.PROACTIVE_ISSUE_SEARCH).toggle();
    };

    $scope.showReviewDialog = function (ev, issue) {
        $mdDialog.show({
            controller: 'proactiveIssueReviewDialogCtrl',
            templateUrl: 'app/template/proactiveIssueReviewDialog/proactiveIssueReviewDialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            escapeToClose: false,
            locals: {
                issue: issue
            },
            fullscreen: true
        }).then(function (updatedIssue) {
            issue.activities = updatedIssue.activities;
            issue.reviewState = updatedIssue.reviewState;
            if (issue.reviewState === Utilities.IN_PROGRESS) {
                if (Utilities.contains($scope.issueList, issue)) {
                    $scope.inProgressIssueList.unshift(issue);
                    Utilities.remove($scope.issueList, issue);
                }
            } else {
                if (Utilities.contains($scope.inProgressIssueList, issue)) {
                    $scope.issueList.unshift(issue);
                    Utilities.remove($scope.inProgressIssueList, issue);
                }
            }
            Utilities.showToast('Rule Nomination ' + updatedIssue.id + ' has been updated!', 'bottom right');
        });
    };

    $scope.closeInProgressSection = function () {
        $scope.isShowInProgress = false;
    };
    $scope.showInProgressSection = function () {
        $scope.isShowInProgress = true;
    };
});
