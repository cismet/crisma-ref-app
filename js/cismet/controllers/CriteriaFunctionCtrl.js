angular.module(
    'de.cismet.smartAdmin.controllers'
    ).controller('CriteriaFunctionCtrl',
    [
        '$scope',
        '$timeout',
        'WorkspaceService',
        'de.cismet.crisma.ICMM.Worldstates',
        'SelectedCriteriaFunction',
        'de.cismet.crisma.ICMM.services.icmm',
        function ($scope, $timeout, Workspace, Worldstates, SelectedCriteriaFunction,Icmm) {
            var worldstates = [];

            for (var i = 0; i < Workspace.worldstates.length; i++) {
                var objectKey = Workspace.worldstates[i].objectKey;
                var worldstateId = objectKey.substring(objectKey.lastIndexOf("/") + 1, objectKey.length);
                Worldstates.get({wsId: worldstateId,level: 3, fields: 'id,name,key,iccdata,actualaccessinfo, actualaccessinfocontenttype, categories', deduplicate: false}, function (worldstate) {
                    worldstates.push(Icmm.convertToCorrectIccDataFormat(worldstate));
                    if (worldstates.length === Workspace.worldstates.length) {
                        $scope.worldstates = worldstates;
                    }
                });
            }

            $scope.indicatorVector = [];
            $scope.SelectedCriteriaFunction = SelectedCriteriaFunction;

            $scope.showPersistSpinner = false;
            $scope.showPersistDone = false;
            $scope.persistCriteriaFunctions = function () {
                $scope.showPersistSpinner = true;
                $scope.showPersistDone = false;
                $timeout(function () {
                    SelectedCriteriaFunction.persist();
                    $scope.showPersistSpinner = false;
                    $scope.showPersistDone = true;
                    $timeout(function () {
                        $scope.showPersistDone = false;
                    }, 1500);
                }, 500);
            };
        }
    ]);
