angular.module(
    'de.cismet.smartAdmin.directives'
    ).directive('breadcrumb',
    [
        'MenuService',
        'Worldstates',
        'CommonWorldstateUtils',
        '$location',
        'Nodes',
        function (MenuService, Worldstates, WsUtils, $location, Nodes) {
            'use strict';
            return {
                templateUrl: 'templates/breadcrumb.html',
                restrict: 'E',
                replace: true,
                transclude: true,
                controller: function ($scope) {
                    var breadcrumbPathChanged = false;
                    $scope.selectedBreadCrumbIndex = 0;
                    $scope.loadWorldstate = function (index) {
                        var selectedWS = $scope.breadCrumbPath[index];
                        $scope.selectedBreadCrumbIndex = index;
                        breadcrumbPathChanged = true;
                        $location.path(selectedWS.objectKey);
                    };
                    $scope.isActive = function (index) {
                        return index === $scope.selectedBreadCrumbIndex ? 'active' : '';
                    };
                    $scope.breadCrumbPath = [];
                    $scope.$on('$routeChangeSuccess', function () {
                        if (breadcrumbPathChanged) {
                            breadcrumbPathChanged = false;
                            return;
                        }
                        var menuItemPath = MenuService.getPathToActiveItem();
                        
                        //FIXME WE need a proper way to get the node corresponding to the Worldstate
                        var activeItem = menuItemPath[menuItemPath.length - 1];
                        if (activeItem && activeItem.key) {
                            var splittedLink = activeItem.key.split(".");
                            //can we use the splittetLink array to retrive the single nodes??
                            var nodeKey = "";
                            $scope.breadCrumbPath.splice(0, $scope.breadCrumbPath.length);
                            for (var i = 0; i < splittedLink.length; i++) {
                                nodeKey = nodeKey + splittedLink[i];
                                $scope.breadCrumbPath.push(Nodes.get({nodeId: nodeKey}));
                                nodeKey = nodeKey + '.';
                            }
                            $scope.selectedBreadCrumbIndex = $scope.breadCrumbPath.length - 1;
                        }else{
                            $scope.breadCrumbPath.splice(0,$scope.breadCrumbPath.length);
                        }
                    });
                }
            };
        }
    ]);