angular.module(
    'de.cismet.smartAdmin.directives'
    ).directive('breadcrumb',
    [
        'MenuService',
        '$location',
        'de.cismet.collidingNameService.Nodes',
        function (MenuService, $location,Nodes) {
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

                        var activeItem = menuItemPath[menuItemPath.length - 1];
                        //FIXME WE need a proper way to get the node corresponding to the Worldstate
                        if (activeItem instanceof Nodes) {
                            $scope.activeNode = activeItem;
                        }else{
                            $scope.activeNode = null;
                        }
                    });
                }
            };
        }
    ]);