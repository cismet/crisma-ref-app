angular.module(
    'de.cismet.smartAdmin.controllers'
    ).controller('DecisionSupportAnalysisCtrl',
    [
        '$scope',
        'WorkspaceService',
        'de.cismet.crisma.ICMM.Worldstates',
        'SelectedCriteriaFunction',
        'SelectedDecisionStrategy',
        'de.cismet.crisma.ICMM.services.icmm',
        function ($scope, Workspace, Worldstates, SelectedCriteriaFunction, SelectedDecisionStrategy, Icmm) {
//            $scope.worldstates = [];
            var worldstates = [], createChartModels;
            $scope.SelectedCriteriaFunction = SelectedCriteriaFunction;
            $scope.SelectedDecisionStrategy = SelectedDecisionStrategy;
            $scope.worldstateRef;
            $scope.status = {
                isopen: false
            };
            $scope.isCriteria = true;
            $scope.chartModels = [];

            createChartModels = function () {
                $scope.chartModels = [];
                if ($scope.worldstates && $scope.worldstates.length > 0) {
                    for (var j = 0; j < $scope.worldstates.length; j++) {
                        var modelArr = [];
                        if ($scope.worldstates[j]) {
                            modelArr.push($scope.worldstates[j]);
                        }
                        if ($scope.worldstateRef) {
                            modelArr = modelArr.concat($scope.worldstateRef);
                        }
                        $scope.chartModels.push(modelArr);
                    }
                }
            };


            for (var i = 0; i < Workspace.worldstates.length; i++) {
                var objectKey = Workspace.worldstates[i].objectKey;
                var worldstateId = objectKey.substring(objectKey.lastIndexOf("/") + 1, objectKey.length);
                Worldstates.get({wsId: worldstateId,level: 3, fields: 'id,name,key,iccdata,actualaccessinfo, actualaccessinfocontenttype, categories', deduplicate: false}, function (worldstate) {
                    worldstates.push(Icmm.convertToCorrectIccDataFormat(worldstate));
                    if (worldstates.length === Workspace.worldstates.length) {
                        $scope.worldstates = worldstates;
                        createChartModels();
                    }
                });
            };
            
            Worldstates.query({level: 3, fields: 'id,name,key,iccdata,actualaccessinfo, actualaccessinfocontenttype, categories', deduplicate: false}, function (data) {
                data.forEach(function(ws){
                    ws = Icmm.convertToCorrectIccDataFormat(ws);
                });
                $scope.allWorldstates = data;
            });

            $scope.$watch('worldstateRef', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    createChartModels();
                }
            });
        }
    ]);
