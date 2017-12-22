/*global angular, document, moment*/

angular.module('taoismApp').controller('detailDialogCtrl', function ($mdDialog, $scope, kcs, Utilities) {
    'use strict';
    $scope.kcs = kcs;
    $scope.formatDate = Utilities.formatDate;

    $scope.cancelDialog = function () {
        $mdDialog.cancel();
    };
    $scope.reviewAgain = function (ev, kcs) {
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
        }).then(function (kcs) {
            Utilities.showToast('KCS Solution ' + kcs.id + ' has been saved!', 'bottom right');
        });
    };
});
