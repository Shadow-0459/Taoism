/*global angular, document, moment, google*/

angular.module('taoismApp').controller('proactiveIssueStatisticsCtrl', function ($scope, $http, Utilities) {
    'use strict';
    $scope.formatDate = function (date) {
        if (date) {
            return moment(date).format('MMMM Do YYYY');
        }
        return date;
    };
    $scope.individualStartDate = moment().subtract(1, 'weeks').startOf('week').toDate();
    $scope.individualEndDate = moment().subtract(1, 'weeks').endOf('week').toDate();
    $scope.typeStartDate = moment().subtract(1, 'weeks').startOf('week').toDate();
    $scope.typeEndDate = moment().subtract(1, 'weeks').endOf('week').toDate();
    $scope.totalStartDate = moment().subtract(1, 'weeks').startOf('week').toDate();
    $scope.totalEndDate = moment().subtract(1, 'weeks').endOf('week').toDate();

    $scope.isTotalLoading = false;
    $scope.isTypeLoading = false;
    $scope.isIndividualLoading = false;

    function queryByType() {
        var queryParams = {
            $gte: $scope.typeStartDate,
            $lte: $scope.typeEndDate
        };
        $scope.isTypeLoading = true;
        $http.post('api/activities/proactiveIssue/type', queryParams)
            .then(function (response) {
                var results = response.data;
                if (results && results.length === 0) {
                    Utilities.showToast('No Rule Nomination Statistics found!', 'bottom right');
                } else {
                    google.charts.setOnLoadCallback(function () {
                        var options = {
                            title: $scope.formatDate($scope.typeStartDate) + '  -  ' + $scope.formatDate($scope.typeEndDate),
                            //hAxis: {
                                //title: 'SBR'
                            //},
                            legend: {position: 'bottom'},
                            isStacked: 'percent'
                        },
                            chart = new google.visualization.ColumnChart(document.getElementById('typeChart')),
                            temp = [['Rule Nomination Source', 'Not a Candidate', 'Candidate', 'Already Converted to a Insights Rule', 'The Insights Rule is Retired', 'In Progress']];

                        results.forEach(function (result) {
                            temp.push([
                                result.type,
                                result.notCandidateCount,
                                result.candidateCount,
                                result.ruledCount,
                                result.ruleRetiredCount,
                                result.inProgressCount
                            ]);
                        });

                        chart.draw(google.visualization.arrayToDataTable(temp), options);
                    });
                }
                $scope.isTypeLoading = false;
            }, function (error, status) {
                $scope.isTypeLoading = false;
                Utilities.showToastWithAction('Error ' + status + ': ' + error.message, 'bottom right');
            });
    }
    function queryTotal() {
        var queryParams = {
            $gte: $scope.totalStartDate,
            $lte: $scope.totalEndDate
        };
        $scope.isTotalLoading = true;
        $http.post('api/activities/proactiveIssue/total', queryParams)
            .then(function (response) {
                var results = response.data;
                if (results && results.length === 0) {
                    Utilities.showToast('No Statistics found!', 'bottom right');
                } else {
                    google.charts.setOnLoadCallback(function () {
                        var options = {
                            legend: {position: 'labeled'},
                            pieSliceText: 'value',
                            pieHole: 0.4
                            //is3D: true
                        },
                            chart = new google.visualization.PieChart(document.getElementById('totalChart')),
                            temp = [['Review State', 'Rule Nomination Count']],
                            totalCount = 0;

                        results.forEach(function (result) {
                            if (result._id === 'Ruled') {
                                result._id = 'Already Converted to a Insights Rule';
                            }
                            if (result._id === 'Rule Retired') {
                                result._id = 'The Insights Rule is Retired';
                            }
                            temp.push([
                                result._id,
                                result.count
                            ]);
                            totalCount = totalCount + result.count;
                        });
                        options.title = totalCount + ' Rule Nomination(s): ' + $scope.formatDate($scope.totalStartDate) + '  -  ' + $scope.formatDate($scope.totalEndDate);

                        chart.draw(google.visualization.arrayToDataTable(temp), options);
                    });

                }
                $scope.isTotalLoading = false;
            }, function (error, status) {
                $scope.isTotalLoading = false;
                Utilities.showToastWithAction('Error ' + status + ': ' + error.message, 'bottom right');
            });
    }
    queryByType();
    queryTotal();
    function query(type, index, dateType) {
        if (type === 'type') {
            if (dateType === 'weeks') {
                if (index === '-1') {
                    Utilities.lastWeek($scope.typeStartDate, $scope.typeEndDate, $scope);
                }
                if (index === '+1') {
                    Utilities.nextWeek($scope.typeStartDate, $scope.typeEndDate, $scope);
                }
                $scope.typeStartDate = $scope.startDate;
                $scope.typeEndDate = $scope.endDate;
            } else if (dateType) {
                $scope.typeStartDate = moment().subtract(index, dateType).startOf(dateType).toDate();
                $scope.typeEndDate = moment().subtract(index, dateType).endOf(dateType).toDate();
            }
            queryByType();
        }
        if (type === 'total') {
            if (dateType === 'weeks') {
                if (index === '-1') {
                    Utilities.lastWeek($scope.totalStartDate, $scope.totalEndDate, $scope);
                }
                if (index === '+1') {
                    Utilities.nextWeek($scope.totalStartDate, $scope.totalEndDate, $scope);
                }
                $scope.totalStartDate = $scope.startDate;
                $scope.totalEndDate = $scope.endDate;
            } else if (dateType) {
                $scope.totalStartDate = moment().subtract(index, dateType).startOf(dateType).toDate();
                $scope.totalEndDate = moment().subtract(index, dateType).endOf(dateType).toDate();
            }
            queryTotal();
        }
    }
    $scope.lastWeek = function (type) {
        query(type, '-1', 'weeks');
    };
    $scope.nextWeek = function (type) {
        query(type, '+1', 'weeks');
    };
    $scope.lastMonth = function (type) {
        query(type, 1, 'months');
    };
    $scope.thisMonth = function (type) {
        query(type, 0, 'months');
    };
    $scope.thisYear = function (type) {
        query(type, 0, 'years');
    };
    $scope.runReport = function (type) {
        query(type, null, null);
    };
});
