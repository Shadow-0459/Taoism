/*global angular, document, moment*/

angular.module('taoismApp').controller('proactiveIssueReviewDialogCtrl', function ($mdDialog, $scope, $http, AuthenticationService, issue, Utilities) {
    'use strict';
    var originalReviewState = issue.reviewState;
    $scope.isLoading = false;
    $scope.issue = angular.copy(issue);
    $scope.currentUser = AuthenticationService.getCurrentUser().rhn;
    $scope.comment = '';
    $scope.formatDate = Utilities.formatDate;

    function addComment(currentDate, activities) {
        activities.push({
            kcsID: issue.id,
            type: 'added a comment',
            date: currentDate,
            author: $scope.currentUser,
            content: $scope.comment
        });
    }
    function saveActivity(currentDate, activities) {
        $scope.issue.lastReviewedDate = currentDate;
        $scope.issue.lastReviewedBy = $scope.currentUser;
        $scope.issue.devloperActionState = 'reviewed';
        $http.post('api/proactiveIssue/update', {proactiveIssue: $scope.issue, activities: activities}).then(function (response) {
            $scope.isLoading = false;
            $mdDialog.hide(response.data);
        }, function (error, status) {
            $scope.isLoading = false;
            Utilities.showToastWithAction('Error ' + status + ': ' + error.message, 'bottom right');
        });
    }
    $scope.hideDialog = function () {
        var currentDate = moment(new Date()).utc().format(),
            activities = [];
        $scope.isLoading = true;
        if ($scope.issue.reviewState !== originalReviewState) {
            if (!originalReviewState) {
                originalReviewState = 'null';
            }
            activities.push({
                kcsID: issue.id,
                type: 'changed review state',
                date: currentDate,
                author: $scope.currentUser,
                content: 'Changed "Review State" from ' + originalReviewState + ' to ' + $scope.issue.reviewState
            });
            if ($scope.comment && $scope.comment.length > 0) {
                addComment(currentDate, activities);
            }
            saveActivity(currentDate, activities);
        } else if ($scope.comment && $scope.comment.length > 0) {
            addComment(currentDate, activities);
            saveActivity(currentDate, activities);
        } else {
            $scope.isLoading = false;
            $mdDialog.cancel();
        }
    };
    $scope.cancelDialog = function () {
        $mdDialog.cancel();
    };
});
