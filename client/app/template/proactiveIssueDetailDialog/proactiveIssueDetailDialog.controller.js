/*global angular, document, moment*/

angular.module('taoismApp').controller('proactiveIssueDetailDialogCtrl', function ($mdDialog, $scope, issue, Utilities) {
    'use strict';
    $scope.issue = issue;
    $scope.formatDate = Utilities.formatDate;

    $scope.cancelDialog = function () {
        $mdDialog.cancel();
    };
    $scope.reviewAgain = function (ev, issue) {
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
        }).then(function (issue) {
            Utilities.showToast('Rule Nomination ' + issue.id + ' has been saved!', 'bottom right');
        });
    };
});
