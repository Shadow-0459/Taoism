/*global angular, document, moment*/

angular.module('taoismApp').controller('kcsReviewCtrl', function ($mdDialog, $mdSidenav, $scope, $http, AuthenticationService, Utilities) {
    'use strict';
    function query(queryParams) {
        $scope.promise = $http.get('api/kcsReview', {params: queryParams}).then(function (response) {
            response.data.forEach(function (kcs) {
                if (kcs.reviewState === 'In Progress') {
                    $scope.inProgressKCSList.push(kcs);
                } else {
                    $scope.kcsList.push(kcs);
                }
            });
            if (response.data && response.data.length === 0) {
                Utilities.showToast('No KCS Solution found!', 'bottom right');
            }
        }, function (error, status) {
            Utilities.showToastWithAction('Error ' + status + ': ' + error.message, 'bottom right');
        });
    }

    $scope.formatDate = Utilities.formatDate;
    $scope.isHowTo = Utilities.isHowTo;
    $scope.kcsList = [];
    $scope.inProgressKCSList = [];
    $scope.isShowInProgress = true;
    $scope.resultsOptions = {
        limit: 15,
        limitOptions: [15, 50, 100],
        page: 1
    };

    $scope.$on(Utilities.KCS_SEARCH_CRITERIA_CHANGED, function (event, args) {
        $scope.isShowInProgress = args.queryParams.isShowInProgress;
        $scope.subtitle = $scope.formatDate(args.queryParams.filter.startDate) + '  -  ' + $scope.formatDate(args.queryParams.filter.endDate);
        $scope.kcsList = [];
        $scope.inProgressKCSList = [];
        query(args.queryParams);
    });
    $scope.$on(Utilities.USER_PROFILE_UPDATED, function () {
        $scope.kcsList = [];
        $scope.inProgressKCSList = [];
        $scope.refresh();
    });

    // Display default search results
    $scope.refresh = function () {
        $scope.startDate = moment().subtract(1, 'weeks').startOf('week').toDate();
        $scope.endDate = moment().subtract(1, 'weeks').endOf('week').toDate();
        $scope.subtitle = $scope.formatDate($scope.startDate) + '  -  ' + $scope.formatDate($scope.endDate);
        $scope.user = AuthenticationService.getCurrentUser();
        $scope.user.$promise.then(function () {
            var queryParams = {
                keyword: '',
                filter: {
                    SBR: [],
                    product: '',
                    startDate: $scope.startDate,
                    endDate: $scope.endDate,
                    kcsState: ['verified']
                },
                isShowInProgress: true,
                limit: 100000
            };
            if ($scope.user.sbrs && $scope.user.sbrs.length > 0) {
                queryParams.filter.SBR = $scope.user.sbrs;
            }
            query(queryParams);
        });
    };
    $scope.refresh();

    $scope.showSearchSidenav = function () {
        $mdSidenav(Utilities.KCS_SEARCH).toggle();
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
            if (kcs.reviewState === Utilities.IN_PROGRESS) {
                if (Utilities.contains($scope.kcsList, kcs)) {
                    $scope.inProgressKCSList.unshift(kcs);
                    Utilities.remove($scope.kcsList, kcs);
                }
            } else {
                if (Utilities.contains($scope.inProgressKCSList, kcs)) {
                    $scope.kcsList.unshift(kcs);
                    Utilities.remove($scope.inProgressKCSList, kcs);
                }
            }
            Utilities.showToast('KCS Solution ' + updatedKCS.id + ' has been updated!', 'bottom right');
        });
    };

    $scope.closeInProgressSection = function () {
        $scope.isShowInProgress = false;
    };
    $scope.showInProgressSection = function () {
        $scope.isShowInProgress = true;
    };
});
