angular.module(
    'de.cismet.smartAdmin.controllers'
    ).controller('DecisionStrategiesCtrl',
    [
        '$scope',
        '$timeout',
        'WorkspaceService',
        'de.cismet.crisma.ICMM.Worldstates',
        'SelectedDecisionStrategy',
        'de.cismet.crisma.ICMM.services.icmm',
        function ($scope, $timeout, Workspace, Worldstates, SelectedDecisionStrategy, Icmm) {
//            $scope.worldstates = [];
            var worldstates = [];

            for (var i = 0; i < Workspace.worldstates.length; i++) {
                var objectKey = Workspace.worldstates[i].objectKey;
                var worldstateId = objectKey.substring(objectKey.lastIndexOf("/") + 1, objectKey.length);
                Worldstates.get({wsId: worldstateId, level: 3, fields: 'id,name,key,iccdata,actualaccessinfo, actualaccessinfocontenttype, categories', deduplicate: false}, function (worldstate) {
                    worldstates.push(Icmm.convertToCorrectIccDataFormat(worldstate));
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
