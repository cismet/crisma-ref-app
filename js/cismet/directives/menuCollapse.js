/*
 * This directive adopts the heigth of the body element according to the length
 * of the div with the id main to correctly set the scrollbar.
 * The behaviour is not added to te controller since it is necessary to 
 * access and manipulate the DOM. 
 * A solely CSS baseds solution was no found so far.
 */
angular.module(
    'de.cismet.smartAdmin.directives'
).directive('menuCollapse', [
    'LayoutService',
    function (LayoutService) {
        'use strict';
        return {
            restrict: 'A',
            link: function (scope, elem) {
                scope.LayoutService = LayoutService;
                // COLLAPSE LEFT NAV
                scope.minify = function () {
                    if (LayoutService.bodyClasses.minified) {
                        LayoutService.bodyClasses.minified = false;
                    } else {
                        LayoutService.bodyClasses.minified = true;
                    }
                };
                elem.bind('click', function () {
                    scope.minify();
                    scope.$apply();
                });
            }
        };
    }
]);

