angular.module(
    'de.cismet.smartAdmin.directives',
    [
        'de.cismet.smartAdmin.services',
        'ngAnimate',
        'google-maps',
        'de.cismet.custom.directives',
        'leaflet-directive'
    ]
    ).directive('cismetHeader', [
    'LayoutService',
    function (LayoutService) {
        'use strict';
        return {
            templateUrl: 'templates/header.html',
            restrict: 'E',
            replace: true,
            controller: function ($scope, LayoutService) {
                $scope.searchMobile = function () {
                    LayoutService.bodyClasses['search-mobile'] = true;
                };

                $scope.cancelSearch = function () {
                    LayoutService.bodyClasses['search-mobile'] = false;
                };
            }
        };
    }]).directive('hideMenu', [
    'LayoutService',
    function (LayoutService) {
        return {
            link: function (scope, elem) {
                // HIDE MENU
                scope.hideMenu = function () {
                    if (LayoutService.bodyClasses['hidden-menu']) {
                        LayoutService.bodyClasses['hidden-menu'] = false;
                    } else {
                        LayoutService.bodyClasses['hidden-menu'] = true;
                    }
                };
                elem.bind('click', function () {
                    scope.hideMenu();
                    scope.$apply();
                });
            }
        };
    }
]);