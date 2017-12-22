/*global angular, document, moment*/

angular.module('taoismApp').controller('reviewedProactiveIssueCtrl', function ($mdDialog, $mdSidenav, $scope, $http, AuthenticationService, Utilities) {
    'use strict';
    function query(queryParams) {
        $scope.promise = $http.post('api/proactiveIssue/query', queryParams).then(function (response) {
            $scope.issueList = response.data;
            if (response.data && response.data.length === 0) {
                Utilities.showToast('No Rule Nomination found!', 'bottom right');
            }
        }, function (error, status) {
            Utilities.showToastWithAction('Error ' + status + ': ' + error.message, 'bottom right');
        });
    }
    $scope.$on(Utilities.REVIEWED_PROACTIVE_ISSUE_SEARCH_CRITERIA_CHANGED, function (event, args) {
        //$scope.subtitle = $scope.formatDate(args.lastReviewedDate.$gte) + '  -  ' + $scope.formatDate(args.lastReviewedDate.$lte);
        query(args.queryParams);
    });
    $scope.formatDate = Utilities.formatDate;
    // Display default search results
    $scope.user = AuthenticationService.getCurrentUser();
    $scope.user.$promise.then(function () {
        var queryParams = {
            filter: {
                lastReviewedBy: $scope.user.rhn,
                reviewState: {$ne: 'In Progress'},
                devloperActionState: 'reviewed'
            }
            //lastReviewedDate: {
                //$gte: moment().subtract(0, 'weeks').startOf('week').toDate(),
                //$lte: moment().subtract(0, 'weeks').endOf('week').toDate()
            //}
        };
        query(queryParams);
    });

    $scope.issueList = [];
    $scope.resultsOptions = {
        limit: 15,
        limitOptions: [15, 50, 100],
        page: 1
    };

    $scope.showSearchSidenav = function () {
        $mdSidenav(Utilities.REVIEWED_PROACTIVE_ISSUE_SEARCH).toggle();
    };
    $scope.showDetailDialog = function (ev, issue) {
        $mdDialog.show({
            controller: 'proactiveIssueDetailDialogCtrl',
            templateUrl: 'app/template/proactiveIssueDetailDialog/proactiveIssueDetailDialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            escapeToClose: false,
            locals: {
                issue: issue
            },
            fullscreen: true
        }).then(function (issue) {
            Utilities.showToast('Rule Nomination ' + issue.id + ' has been saved!', 'bottom right');
        });
    };
});
