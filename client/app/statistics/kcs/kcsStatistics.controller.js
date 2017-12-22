/*global angular, document, moment, google*/

angular.module('taoismApp').controller('kcsStatisticsCtrl', function ($scope, $http, Utilities) {
    'use strict';
    $scope.formatDate = function (date) {
        if (date) {
            return moment(date).format('MMMM Do YYYY');
        }
        return date;
    };
    $scope.individualStartDate = moment().subtract(1, 'weeks').startOf('week').toDate();
    $scope.individualEndDate = moment().subtract(1, 'weeks').endOf('week').toDate();
    $scope.sbrStartDate = moment().subtract(1, 'weeks').startOf('week').toDate();
    $scope.sbrEndDate = moment().subtract(1, 'weeks').endOf('week').toDate();
    $scope.totalStartDate = moment().subtract(1, 'weeks').startOf('week').toDate();
    $scope.totalEndDate = moment().subtract(1, 'weeks').endOf('week').toDate();

    $scope.isTotalLoading = false;
    $scope.isSBRLoading = false;
    $scope.isIndividualLoading = false;
    function queryIndividual() {
        var queryParams = {
            $gte: $scope.individualStartDate,
            $lte: $scope.individualEndDate
        };
        $scope.isIndividualLoading = true;
        $http.post('api/activities/individual', queryParams)
            .then(function (response) {
                var results = response.data;
                if (results && results.length === 0) {
                    Utilities.showToast('No Individual Statistics found!', 'bottom right');
                } else {
                    google.charts.setOnLoadCallback(function () {
                        var options = {
                            title: $scope.formatDate($scope.individualStartDate) + '  -  ' + $scope.formatDate($scope.individualEndDate),
                            hAxis: {
                                title: 'KCS Solutions Count'
                            },
                            isStacked: true
                        },
                            chart = new google.visualization.BarChart(document.getElementById('individualChart')),
                            temp = [['RHN Account', 'Not a Candidate', 'Candidate', 'Already Converted to a Insights Rule', 'The Insights Rule is Retired', 'In Progress']];

                        results.forEach(function (result) {
                            //var total = result.notCandidateCount + result.candidateCount + result.ruledCount + result.inProgressCount;
                            temp.push([
                                result.id,
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
                $scope.isIndividualLoading = false;
            }, function (error, status) {
                $scope.isIndividualLoading = false;
                Utilities.showToastWithAction('Error ' + status + ': ' + error.message, 'bottom right');
            });
    }
    function querySBR() {
        var queryParams = {
            $gte: $scope.sbrStartDate,
            $lte: $scope.sbrEndDate
        };
        $scope.isSBRLoading = true;
        $http.post('api/activities/sbr', queryParams)
            .then(function (response) {
                var results = response.data;
                if (results && results.length === 0) {
                    Utilities.showToast('No SBR Statistics found!', 'bottom right');
                } else {
                    google.charts.setOnLoadCallback(function () {
                        var options = {
                            title: $scope.formatDate($scope.sbrStartDate) + '  -  ' + $scope.formatDate($scope.sbrEndDate),
                            //hAxis: {
                                //title: 'SBR'
                            //},
                            legend: {position: 'bottom'},
                            isStacked: 'percent'
                        },
                            chart = new google.visualization.ColumnChart(document.getElementById('sbrChart')),
                            temp = [['SBR', 'Not a Candidate', 'Candidate', 'Already Converted to a Insights Rule', 'The Insights Rule is Retired', 'In Progress']];

                        results.forEach(function (result) {
                            temp.push([
                                result.id.replace('&amp;', '&'),
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
                $scope.isSBRLoading = false;
            }, function (error, status) {
                $scope.isSBRLoading = false;
                Utilities.showToastWithAction('Error ' + status + ': ' + error.message, 'bottom right');
            });
    }
    function queryTotal() {
        var queryParams = {
            $gte: $scope.totalStartDate,
            $lte: $scope.totalEndDate
        };
        $scope.isTotalLoading = true;
        $http.post('api/activities/total', queryParams)
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
                            temp = [['Review State', 'KCS Solution Count']],
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
                        options.title = totalCount + ' KCS Solution(s): ' + $scope.formatDate($scope.totalStartDate) + '  -  ' + $scope.formatDate($scope.totalEndDate);

                        chart.draw(google.visualization.arrayToDataTable(temp), options);
                    });
                }
                $scope.isTotalLoading = false;
            }, function (error, status) {
                $scope.isTotalLoading = false;
                Utilities.showToastWithAction('Error ' + status + ': ' + error.message, 'bottom right');
            });
    }
    queryIndividual();
    querySBR();
    queryTotal();
    function query(type, index, dateType) {
        if (type === 'Individual') {
            if (dateType === 'weeks') {
                if (index === '-1') {
                    Utilities.lastWeek($scope.individualStartDate, $scope.individualEndDate, $scope);
                }
                if (index === '+1') {
                    Utilities.nextWeek($scope.individualStartDate, $scope.individualEndDate, $scope);
                }
                $scope.individualStartDate = $scope.startDate;
                $scope.individualEndDate = $scope.endDate;
            } else if (dateType) {
                $scope.individualStartDate = moment().subtract(index, dateType).startOf(dateType).toDate();
                $scope.individualEndDate = moment().subtract(index, dateType).endOf(dateType).toDate();
            }
            queryIndividual();
        }
        if (type === 'sbr') {
            if (dateType === 'weeks') {
                if (index === '-1') {
                    Utilities.lastWeek($scope.sbrStartDate, $scope.sbrEndDate, $scope);
                }
                if (index === '+1') {
                    Utilities.nextWeek($scope.sbrStartDate, $scope.sbrEndDate, $scope);
                }
                $scope.sbrStartDate = $scope.startDate;
                $scope.sbrEndDate = $scope.endDate;
            } else if (dateType) {
                $scope.sbrStartDate = moment().subtract(index, dateType).startOf(dateType).toDate();
                $scope.sbrEndDate = moment().subtract(index, dateType).endOf(dateType).toDate();
            }
            querySBR();
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
