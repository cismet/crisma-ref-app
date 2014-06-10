angular.module(
    'de.cismet.smartAdmin.directives'
    ).directive('breadcrumb',
    [
        'MenuService',
        '$location',
        function (MenuService, $location) {
            'use strict';
            return {
                templateUrl: 'templates/breadcrumb.html',
                restrict: 'E',
                replace: true,
                transclude: true,
                controller: function ($scope) {
                    $scope.selectedBreadcrumbNode;
                    $scope.$watch('selectedBreadcrumbNode', function (newVal, oldVal) {
                        if (newVal !== oldVal) {
                             $location.path($scope.selectedBreadcrumbNode.objectKey);
                        }
                    });

                    $scope.$on('$routeChangeSuccess', function () {
                        var menuItemPath = MenuService.getPathToActiveItem();

                        //FIXME WE need a proper way to get the node corresponding to the Worldstate
                        var activeItem = menuItemPath[menuItemPath.length - 1];
                        $scope.activeNode = activeItem;
                    });
                }
            };
        }
    ]);