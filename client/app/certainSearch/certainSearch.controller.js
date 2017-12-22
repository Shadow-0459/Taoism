/*global angular, document, moment*/

angular.module('taoismApp').controller('certainSearchCtrl', function ($mdDialog, $scope, $http, Utilities) {
    'use strict';
    function query(queryParams) {
        $scope.promise = $http.get('api/kcsReview', {params: queryParams}).then(function (response) {
            $scope.kcsList = response.data;
            if (response.data && response.data.length === 0) {
                Utilities.showToast('No KCS Solution found!', 'bottom right');
            }
            $scope.isLoading = false;
        }, function (error, status) {
            $scope.isLoading = false;
            Utilities.showToastWithAction('Error ' + status + ': ' + error.message, 'bottom right');
        });
    }

    $scope.isLoading = false;
    $scope.formatDate = Utilities.formatDate;
    $scope.isHowTo = Utilities.isHowTo;
    $scope.kcsList = [];
    $scope.resultsOptions = {
        limit: 15,
        limitOptions: [15, 50, 100],
        page: 1
    };

    $scope.search = function functionName() {
        var queryParams = {
            //keyword: '',
            ids: [],
            limit: 100000
        };
        if ($scope.ids.length > 0) {
            $scope.kcsList = [];
            $scope.isLoading = true;
            queryParams.ids = $scope.ids.split(',');
            query(queryParams);
        }
    };

    $scope.showReviewDialog = function (ev, kcs) {
        $mdDialog.show({
            controller: 'reviewDialogCtrl',
            templateUrl: 'app/template/reviewDialog/reviewDialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            escapeToClose: false,
            locals: {
                kcs: kcs
            },
            fullscreen: true
        }).then(function (updatedKCS) {
            kcs.activities = updatedKCS.activities;
            kcs.reviewState = updatedKCS.reviewState;
            Utilities.showToast('KCS Solution ' + updatedKCS.id + ' has been updated!', 'bottom right');
        });
    };
});
