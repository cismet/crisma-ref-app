angular.module(
    'de.cismet.smartAdmin.directives'
    ).directive('viewHeight', [
    '$window',
    function ($window) {
        'use strict';
        return {
            restrict: 'A',
            link: function (scope) {
                var windowH;

                scope.getViewHeight = function () {
                    windowH = $window.innerHeight;
                    return windowH;
                };
            }
        };
    }
]);