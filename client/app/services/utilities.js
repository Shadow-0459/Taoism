/*global angular, moment*/

angular.module('taoismApp').factory('Utilities', function ($mdToast) {
    'use strict';
    var utilities = {};
    utilities.KCS_SEARCH_CRITERIA_CHANGED = 'kcs search criteria changed';
    utilities.KCS_SEARCH = 'kcsSearch';
    utilities.LINKED_KCS_SEARCH = 'linkedKCSSearch';
    utilities.LINKED_KCS_SEARCH_CRITERIA_CHANGED = 'linked kcs search criteria changed';
    utilities.REVIEWED_KCS_SEARCH_CRITERIA_CHANGED = 'reviewed kcs search criteria changed';
    utilities.REVIEWED_KCS_SEARCH = 'reviewedKCSSearch';
    utilities.USER_PROFILE = 'userProfile';
    utilities.USER_PROFILE_UPDATED = 'user profile updated';
    utilities.IN_PROGRESS = 'In Progress';
    utilities.PROACTIVE_ISSUE_SEARCH_CRITERIA_CHANGED = 'proative issue search criteria changed';
    utilities.PROACTIVE_ISSUE_SEARCH = 'proactiveIssueSearch';
    utilities.REVIEWED_PROACTIVE_ISSUE_SEARCH_CRITERIA_CHANGED = 'reivewed proative issue search criteria changed';
    utilities.REVIEWED_PROACTIVE_ISSUE_SEARCH = 'reviewedProactiveIssueSearch';
    utilities.sbrOptions = [
        'Clusterha',
        'Filesystem',
        'Kernel',
        'Networking',
        'Stack',
        'Storage',
        'Virtualization',
        'Anaconda',
        'Business Rule Frameworks',
        'Ceph',
        'CFME',
        'Cloud Architects',
        'Cloud Prods & Envs',
        'Containers',
        'Desktop',
        'ESB',
        'FeedHenry',
        'FuseSource',
        'Gluster',
        'Hibernate/JPA',
        'Identity Management',
        'JBCP',
        'JBDS',
        'JBoss Base AS',
        'JBoss Clustering',
        'JBoss Deployers',
        'JBoss Portal',
        'JBoss Security',
        'JON',
        'JVM & Diagnostics',
        'Low Volume',
        'Messaging & Remoting',
        'MRG',
        'Non-Technical',
        'Portal',
        'Red Hat On-line Learning',
        'SAP',
        'Security Vulnerabilities',
        'Services',
        'Shells',
        'Shift',
        'SysMgmt',
        'Teiid/MMX',
        'Tools',
        'Transactions & JCA & SQL',
        'Web Frameworks',
        'Web Services',
        'Webservers'
    ];
    utilities.productOptions = [
        'Red Hat Enterprise Linux',
        'Red Hat OpenStack Platform',
        'Red Hat Enterprise Virtualization',
        'Red Hat CloudForms',
        'Red Hat Network',
        'Red Hat Storage Server',
        'Red Hat Storage Software Appliance',
        'Inktank Ceph Enterprise',
        'Red Hat Ceph Storage',
        'Red Hat Cloud Infrastructure',
        'Red Hat Cloud Suite',
        'Red Hat Enterprise Linux Atomic Host',
        'Red Hat Enterprise Linux for Real Time',
        'Red Hat Enterprise Linux Server for ARM',
        'Red Hat Enterprise Linux for SAP HANA',
        'Red Hat Gluster Storage',
        'Ansible Tower',
        'OpenShift Dedicated by Red Hat',
        'Red Hat Access Labs',
        'Red Hat Identity Management',
        'Red Hat Insights',
        'Red Hat Mobile Application Platform',
        'Red Hat Single Sign-On',
        'Red Hat Training',
        'Red Hat JBoss BPM Suite',
        'Red Hat JBoss Data Virtualization',
        'Red Hat JBoss Enterprise Application Platform',
        'Red Hat JBoss Fuse Service Works',
        'Red Hat Online Learning',
        'Red Hat Software Collections',
        'Subscription Asset Manager',
        'Red Hat JBoss Developer Studio',
        'Red Hat JBoss Operations Network',
        'Red Hat JBoss Portal',
        'Red Hat JBoss SOA Platform',
        'Red Hat JBoss Data Services',
        'Red Hat JBoss Data Grid',
        'Red Hat Enterprise MRG Grid',
        'Red Hat Enterprise MRG Realtime',
        'Red Hat Enterprise MRG Messaging',
        'Red Hat HPC',
        'Red Hat JBoss BRMS',
        'Red Hat JBoss Web Server',
        'Red Hat Update Infrastructure',
        'Red Hat Satellite or Proxy',
        'JBoss Communications Platform',
        'JBoss Enterprise Web Platform',
        'FuseSource',
        'Red Hat JBoss A-MQ',
        'Fuse Services Framework',
        'Red Hat JBoss Fuse',
        'Fuse Message Broker',
        'Fuse Mediation Router',
        'Fuse ESB',
        'Fuse IDE',
        'Fuse Management Console',
        'Fuse HQ',
        'JBoss jBPM',
        'JBoss Rules',
        'Red Hat Certificate System',
        'Red Hat Customer Portal',
        'Red Hat Developer Toolset',
        'Red Hat Directory Server',
        'Red Hat Application Stack',
        'JBoss Site Publisher',
        'JBoss Web Framework Kit',
        'MetaMatrix Enterprise Data Services Platform',
        'OpenShift Enterprise by Red Hat',
        'OpenShift Online by Red Hat',
        'Other'
    ];
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);
        return function filterFn(item) {
            return (item.toLowerCase().indexOf(lowercaseQuery) === 0);
        };
    }
    utilities.selectSearch = function (query, options) {
        var results = query ? options.filter(createFilterFor(query)) : options;
        return results;
    };
    utilities.showToast = function (textContent, position) {
        $mdToast.show(
            $mdToast.simple()
                .textContent(textContent)
                .position(position)
                .hideDelay(500)
        );
    };
    utilities.showToastWithAction = function (textContent, position) {
        $mdToast.show(
            $mdToast.simple()
                .textContent(textContent)
                .position(position)
                .hideDelay(0)
                .action('Close')
                .highlightAction(true)
                .highlightClass('md-accent')
        );
    };
    utilities.formatDate = function (date) {
        if (date) {
            return moment(date).format('MMMM Do YYYY, HH:mm:ss');
        }
        return date;
    };
    utilities.lastWeek = function (startDate, endDate, $scope) {
        if (!startDate && !endDate) {
            $scope.startDate = moment().subtract(1, 'weeks').startOf('week').toDate();
            $scope.endDate = moment().subtract(1, 'weeks').endOf('week').toDate();
        }
        if (!startDate && endDate) {
            $scope.startDate = moment(endDate).subtract(1, 'weeks').startOf('week').toDate();
            $scope.endDate = moment(endDate).subtract(1, 'weeks').endOf('week').toDate();
        }
        if (startDate) {
            $scope.startDate = moment(startDate).subtract(1, 'weeks').startOf('week').toDate();
            $scope.endDate = moment(startDate).subtract(1, 'weeks').endOf('week').toDate();
        }
    };
    utilities.nextWeek = function (startDate, endDate, $scope) {
        if (!startDate && !endDate) {
            $scope.startDate = moment().add(1, 'weeks').startOf('week').toDate();
            $scope.endDate = moment().add(1, 'weeks').endOf('week').toDate();
        }
        if (!startDate && endDate) {
            $scope.startDate = moment(endDate).add(1, 'weeks').startOf('week').toDate();
            $scope.endDate = moment(endDate).add(1, 'weeks').endOf('week').toDate();
        }
        if (startDate) {
            $scope.startDate = moment(startDate).add(1, 'weeks').startOf('week').toDate();
            $scope.endDate = moment(startDate).add(1, 'weeks').endOf('week').toDate();
        }
    };
    utilities.isHowTo = function (title) {
        var checkList = [/\bhow to\b/, /\bhow\b/], isHowTo = false, i = 0;
        for (i = 0; i < checkList.length; i = i + 1) {
            if (checkList[i].test(title.toLowerCase())) {
                isHowTo = true;
            }
        }
        return isHowTo;
    };
    utilities.contains = function (array, object) {
        var i = 0;
        for (i = 0; i < array.length; i = i + 1) {
            if (array[i].id === object.id) {
                return true;
            }
        }
        return false;
    };
    utilities.remove = function (array, object) {
        var i = 0;
        for (i = 0; i < array.length; i = i + 1) {
            if (object.id === array[i].id) {
                array.splice(i, 1);
                break;
            }
        }
    };
    return utilities;
});
