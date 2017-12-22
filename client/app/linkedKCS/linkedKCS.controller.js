/*global angular, document, moment*/

angular.module('taoismApp').controller('linkedKCSCtrl', function ($mdDialog, $mdSidenav, $scope, $http, AuthenticationService, Utilities) {
    'use strict';
    function query(queryParams) {
        $scope.promise = $http.post('api/linkedKCS/query', queryParams).then(function (response) {
            $scope.kcsList = response.data;
            if (response.data && response.data.length === 0) {
                Utilities.showToast('No KCS Solution found!', 'bottom right');
            }
        }, function (error, status) {
            Utilities.showToastWithAction('Error ' + status + ': ' + error.message, 'bottom right');
        });
    }
    $scope.$on(Utilities.USER_PROFILE_UPDATED, function (event, args) {
        $scope.refresh();
    });
    $scope.$on(Utilities.LINKED_KCS_SEARCH_CRITERIA_CHANGED, function (event, args) {
        $scope.subtitle = $scope.formatDate(args.startDate) + '  -  ' + $scope.formatDate(args.endDate);
        query(args);
    });
    $scope.formatDate = Utilities.formatDate;
    $scope.isHowTo = Utilities.isHowTo;
    $scope.kcsList = [];
    $scope.reviewedKCS = [];
    $scope.csvHeader = [
        'Solution ID',
        'View URI',
        'Title',
        'Linked Case Count',
        'SBR',
        'Product'
    ];
    $scope.csvOrder = [
        'id',
        'view_uri',
        'title',
        'section_case_count',
        'sbr',
        'product'
    ];
    $scope.resultsOptions = {
        limit: 15,
        limitOptions: [15, 50, 100],
        page: 1
    };

    $scope.refresh = function () {
        $scope.startDate = moment().subtract(1, 'weeks').startOf('week').toDate();
        $scope.endDate = moment().subtract(1, 'weeks').endOf('week').toDate();
        $scope.subtitle = $scope.formatDate($scope.startDate) + '  -  ' + $scope.formatDate($scope.endDate);
        // Display default search results
        $scope.user = AuthenticationService.getCurrentUser();
        $scope.user.$promise.then(function () {
            var queryParams = {
                startDate: $scope.startDate,
                endDate: $scope.endDate,
                limitation: 30
            };
            if ($scope.user.sbrs && $scope.user.sbrs.length > 0) {
                queryParams.SBR = $scope.user.sbrs;
            }
            query(queryParams);
        });
    };
    $scope.refresh();

    $scope.showSearchSidenav = function () {
        $mdSidenav(Utilities.LINKED_KCS_SEARCH).toggle();
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
