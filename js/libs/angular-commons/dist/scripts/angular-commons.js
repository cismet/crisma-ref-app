/* Common Angular tools */
angular.module('de.cismet.commons.angular.angularTools', []).
    factory('de.cismet.commons.angular.angularTools.AngularTools', function () {
        'use strict';

        var safeApply = function (scope, fn) {
            if (!scope || scope === null) {
                throw {
                    name: 'IllegalArgumentException',
                    message: 'scope must not be undefined or null'
                };
            }

            var phase = scope.$root.$$phase;
            if (phase === '$apply' || phase === '$digest') {
                if (fn && (typeof (fn) === 'function')) {
                    fn();
                }
            } else {
                scope.$apply(fn);
            }
        };

        return {
            safeApply: safeApply
        };
    });
