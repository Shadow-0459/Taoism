/*global angular, document, moment*/

angular.module('taoismApp').controller('reviewDialogCtrl', function ($mdDialog, $scope, $http, AuthenticationService, kcs, Utilities) {
    'use strict';
    var originalReviewState = kcs.reviewState;
    $scope.isLoading = false;
    $scope.kcs = angular.copy(kcs);
    $scope.currentUser = AuthenticationService.getCurrentUser().rhn;
    $scope.comment = '';
    $scope.formatDate = Utilities.formatDate;

    function addComment(currentDate, activities) {
        activities.push({
            kcsID: kcs.id,
            type: 'added a comment',
            date: currentDate,
            author: $scope.currentUser,
            content: $scope.comment
        });
    }
    function saveActivity(currentDate, activities) {
        $scope.kcs.lastReviewedDate = currentDate;
        $scope.kcs.lastReviewedBy = $scope.currentUser;
        $scope.kcs.devloperActionState = 'reviewed';
        $http.post('api/reviewedKCS/update', {kcs: $scope.kcs, activities: activities})
            .then(function (response) {
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
        if ($scope.kcs.reviewState !== originalReviewState) {
            if (!originalReviewState) {
                originalReviewState = 'null';
            }
            activities.push({
                kcsID: kcs.id,
                type: 'changed review state',
                date: currentDate,
                author: $scope.currentUser,
                content: 'Changed "Review State" from ' + originalReviewState + ' to ' + $scope.kcs.reviewState
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
