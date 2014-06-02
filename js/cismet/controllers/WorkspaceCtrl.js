angular.module(
    'de.cismet.smartAdmin.controllers'
    ).controller('WorkspaceCtrl',
    [
        '$scope',
        'WorkspaceService',
        'Worldstates',
        'Nodes',
        function ($scope, WorkspaceService, Worldstates, Nodes) {
            $scope.WorkspaceService = WorkspaceService;
            $scope.worldstates = [];
            for (var i = 0; i < $scope.WorkspaceService.worldstates.length; i++) {
                var wsNode = $scope.WorkspaceService.worldstates[i];
                var id = wsNode.objectKey.substring(wsNode.objectKey.lastIndexOf('/') + 1, wsNode.objectKey.length);
                $scope.worldstates.push(Worldstates.get({wsId: id}));
            }

            $scope.removeSelectionFromWorkSpace = function () {
                for (var j = 0; j < $scope.selectedWorldstates.length; j++) {
                    WorkspaceService.removeWS($scope.selectedWorldstates[j]);
                }
            };

        }
    ]);
