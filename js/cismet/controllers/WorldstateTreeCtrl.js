angular.module(
    'de.cismet.smartAdmin.controllers'
    ).controller('WorldstateTreeCtrl',
    [
        '$scope',
        'de.cismet.collidingNameService.Nodes',
        'WorkspaceService',
        function ($scope, Nodes, WorkspaceService) {
            $scope.isWorldstateIcon = true;
            $scope.treeOptions = {
                multiSelection: true,
                checkboxClass: 'glyphicon glyphicon-unchecked',
//                folderIconClosed: 'icon-folder-close.png',
//                folderIconOpen: 'icon-folder-open.png',
                leafIcon: 'icon-file.png',
                imagePath: '/images/worldstate-tree/',
                folderIconClosed: 'icon-world.png',
                folderIconOpen: 'icon-world.png',
                leafIcon : 'icon-world.png'
            };
            $scope.switchIcon = function () {
                if (!$scope.isWorldstateIcon) {
                    $scope.treeOptions.folderIconClosed = 'icon-world.png';
                    $scope.treeOptions.folderIconOpen = 'icon-world.png';
                    $scope.treeOptions.leafIcon = 'icon-world.png';
                } else {
                    $scope.treeOptions.folderIconClosed = 'icon-folder-close.png';
                    $scope.treeOptions.folderIconOpen = 'icon-folder-open.png';
                    $scope.treeOptions.leafIcon = 'icon-file.png';
                }
                $scope.isWorldstateIcon = !$scope.isWorldstateIcon;
            };
            $scope.switchTreeMode = function () {
                $scope.treeOptions.multiSelection = !$scope.treeOptions.multiSelection;
            };

            $scope.nodes = Nodes.query();

            $scope.treeNodeSelection = WorkspaceService.worldstates.slice();

            $scope.$watchCollection("treeNodeSelection", function (newVal, oldVal) {
                if (newVal !== oldVal) {

                    //add all new items to the workspace service...
                    for (var i = 0; i < newVal.length; i++) {
                        var node = newVal[i];
                        if (!$scope.workspaceService.contains(node)) {
                            $scope.workspaceService.addWorldstate(node);
                        }
                    }

                    //remove worldstates that were deselected...
                    if (oldVal.length >= newVal.length) {
                        var itemsToDelete = _.difference(oldVal, newVal);
                        for (var j = 0; j < itemsToDelete.length; j++) {
                            if ($scope.workspaceService.contains(itemsToDelete[j])) {
                                $scope.workspaceService.removeWS(itemsToDelete[j]);
                            }

                        }
                    }
                }
            });
        }
    ]);