/*global angular, document, moment*/

angular.module('taoismApp').controller('reviewedKCSCtrl', function ($mdDialog, $mdSidenav, $scope, $http, AuthenticationService, Utilities) {
    'use strict';
    function query(queryParams) {
        $scope.promise = $http.post('api/reviewedKCS/query', queryParams).then(function (response) {
            $scope.kcsList = response.data;
            if (response.data && response.data === 0) {
                Utilities.showToast('No KCS Solution found!', 'bottom right');
            }
        }, function (error, status) {
            Utilities.showToastWithAction('Error ' + status + ': ' + error.message, 'bottom right');
        });
    }
    $scope.$on(Utilities.REVIEWED_KCS_SEARCH_CRITERIA_CHANGED, function (event, args) {
        //$scope.subtitle = $scope.formatDate(args.lastReviewedDate.$gte) + '  -  ' + $scope.formatDate(args.lastReviewedDate.$lte);
        query(args);
    });
    $scope.formatDate = Utilities.formatDate;
    // Display default search results
    $scope.user = AuthenticationService.getCurrentUser();
    $scope.user.$promise.then(function () {
        var queryParams = {
            lastReviewedBy: $scope.user.rhn
            //lastReviewedDate: {
                //$gte: moment().subtract(0, 'weeks').startOf('week').toDate(),
                //$lte: moment().subtract(0, 'weeks').endOf('week').toDate()
            //}
        };
        query(queryParams);
    });

    $scope.kcsList = [];
    $scope.reviewedKCS = [];
    $scope.resultsOptions = {
        limit: 15,
        limitOptions: [15, 50, 100],
        page: 1
    };

    $scope.showSearchSidenav = function () {
        $mdSidenav(Utilities.REVIEWED_KCS_SEARCH).toggle();
    };
    $scope.showDetailDialog = function (ev, kcs) {
        $mdDialog.show({
            controller: 'detailDialogCtrl',
            templateUrl: 'app/template/detailDialog/detailDialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            escapeToClose: false,
            locals: {
                kcs: kcs
            },
            fullscreen: true
        }).then(function (kcs) {
            Utilities.showToast('KCS Solution ' + kcs.id + ' has been saved!', 'bottom right');
        });
    };
});
