angular.module(
    'de.cismet.smartAdmin.directives',
    [
        'de.cismet.smartAdmin.services',
        'ngAnimate',
        'de.cismet.custom.directives',
        'de.cismet.custom.controllers',
        'leaflet-directive',
        'de.cismet.cids.widgets.nodeListWidget.directives',
        'de.cismet.cids.widgets.nodeListWidget.controllers',
        'de.cismet.cids.widgets.nodePathWidget.directives',
        'de.cismet.cids.widgets.nodePathWidget.controllers',
    ]
    ).directive('cismetHeader', [
    'LayoutService',
    'localStorageService',
    function (LayoutService,localStorageService) {
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