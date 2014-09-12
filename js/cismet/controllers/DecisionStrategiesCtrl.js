angular.module(
    'de.cismet.smartAdmin.controllers'
    ).controller('DecisionStrategiesCtrl',
    [
        '$scope',
        '$timeout',
        'WorkspaceService',
        'de.cismet.crisma.ICMM.Worldstates',
        'SelectedDecisionStrategy',
        function ($scope, $timeout, Workspace, Worldstates, SelectedDecisionStrategy) {
//            $scope.worldstates = [];
            var worldstates = [], createChartModels, getIndicators;

            for (var i = 0; i < Workspace.worldstates.length; i++) {
                var objectKey = Workspace.worldstates[i].objectKey;
                var worldstateId = objectKey.substring(objectKey.lastIndexOf("/") + 1, objectKey.length);
                Worldstates.get({wsId: worldstateId}, function (worldstate) {
                    worldstates.push(worldstate);
                    if (worldstates.length === Workspace.worldstates.length) {
                        $scope.worldstates = worldstates;
                    }
                });
            }

            $scope.selectedDecisionStrategy = SelectedDecisionStrategy;
            $scope.persistDecisionStrategies = function () {
                $scope.showDsPersistSpinner = true;
                $scope.showDsPersistDone = false;
                $timeout(function () {
                    SelectedDecisionStrategy.persist();
                    $scope.showDsPersistSpinner = false;
                    $scope.showDsPersistDone = true;
                    $timeout(function () {
                        $scope.showDsPersistDone = false;
                    }, 1500);
                }, 500);
            };
        }
    ]);
