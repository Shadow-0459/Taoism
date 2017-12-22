/*global angular, window, google*/

angular.module('taoismApp', [
    'md.data.table',
    'ui.router',
    'ngCsv',
    'ngCookies',
    'ngResource',
    'ngMaterial',
    'ngSanitize',
    'ngMessages'
]).config(function ($locationProvider, $urlRouterProvider) {
    'use strict';
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
}).config(function ($mdThemingProvider) {
    'use strict';
    $mdThemingProvider.theme('default').primaryPalette('blue');
}).run(function ($rootScope, $cookies) {
    'use strict';
    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', function (event, next) {
        if (next.authenticate && !$cookies.get('rh_user')) {
            //window.location = 'https://www.redhat.com/wapps/sso/login.html?redirect=' + window.location;
            window.location = 'https://access.redhat.com/login?redirectTo=' + encodeURIComponent(window.location);
            event.preventDefault();
        }
    });
    google.charts.load('current', {'packages': ['corechart', 'bar']});
});
