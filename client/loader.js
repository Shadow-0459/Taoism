/*global document, window, jQuery, angular*/
(function () {
    'use strict';
    var deps;
    var base = '/taoism/';
    if (!window.LABS_DEBUG) {
        deps = ['app/vendor.js', 'app/app.js'];
    } else {
        deps = window.deps.map(function (dep) {
            return base + dep + '.js';
        });
    }
    // keep track of deferreds we are loading
    var dfds = [];
    var qLoad = function(mod, index) {
        var previousDfd = dfds[index - 1];
        dfds[index] = new jQuery.Deferred();
        // Internal load that actually wraps the chrometwo_require
        var _load = function() {
            require(mod.split(), function() {
                // All good, resolve deferred
                dfds[index].resolve();
            });
        };
        if (previousDfd) {
            // We have a previous mod loading, chain the next load
            previousDfd.then(_load);
        } else {
            // First module being loaded. Fire away
            _load();
        }
        return dfds[index].promise();
    };
    // Queue up loading of modules
    for (var i = 0; i < deps.length; i++) {
        qLoad(deps[i], i);
    }
    // Once all modules have loaded bootstrap it
    jQuery.when.apply(jQuery, dfds).then(function() {
        // Bootstrap angular app
        angular.bootstrap(document, ['taoismApp']);
        // Fade in main element
        jQuery('#md-progress-linear').fadeOut();
        jQuery('#taoism').fadeIn();
    });
})();
