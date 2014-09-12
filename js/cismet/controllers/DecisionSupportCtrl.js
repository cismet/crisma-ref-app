angular.module(
    'de.cismet.smartAdmin.controllers'
    ).controller('DecisionSupportCtrl',
    [
        '$scope',
        'WorkspaceService',
        'de.cismet.crisma.ICMM.Worldstates',
        'SelectedCriteriaFunction',
        function ($scope, Workspace, Worldstates, SelectedCriteriaFunction) {
//            $scope.worldstates = [];
            var worldstates = [], createChartModels, getIndicators;
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

            getIndicators = function () {
                var indicatorGroup, indicatorProp, iccObject, group;
                if ($scope.worldstates && $scope.worldstates.length > 0) {
                    for (var j = 0; j < $scope.worldstates.length; j++) {
                        iccObject = Worldstates.utils.stripIccData([$scope.worldstates[j]], false)[0];
                        for (indicatorGroup in iccObject.data) {
                            if (iccObject.data.hasOwnProperty(indicatorGroup)) {
                                group = iccObject.data[indicatorGroup];
                                for (indicatorProp in group) {
                                    if (group.hasOwnProperty(indicatorProp)) {
                                        if (indicatorProp !== 'displayName' && indicatorProp !== 'iconResource') {
                                            if ($scope.indicatorVector.length > 0) {
                                                var indicatorName = group[indicatorProp].displayName;
                                                var indicator = group[indicatorProp];
                                                var add = true;
                                                $scope.indicatorVector.forEach(function (value,index,arr) {
                                                    if (indicatorName === value.displayName) {
                                                        add = false;
                                                    }
                                                    if(index === arr.length-1 && add){
                                                    $scope.indicatorVector.push(indicator);    
                                                    }
                                                });
                                            } else {
                                                $scope.indicatorVector.push(group[indicatorProp]);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };

            for (var i = 0; i < Workspace.worldstates.length; i++) {
                var objectKey = Workspace.worldstates[i].objectKey;
                var worldstateId = objectKey.substring(objectKey.lastIndexOf("/") + 1, objectKey.length);
                Worldstates.get({wsId: worldstateId}, function (worldstate) {
                    worldstates.push(worldstate);
                    if (worldstates.length === Workspace.worldstates.length) {
                        $scope.worldstates = worldstates;
                        createChartModels();
                        getIndicators();
                    }
                });
            }
            
            Worldstates.query({level:5},function (data) {
                $scope.allWorldstates = data;
            });

            $scope.$watch('worldstateRef', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    createChartModels();
                    getIndicators();
                }
            });

            $scope.indicatorVector = [];
            $scope.SelectedCriteriaFunction=SelectedCriteriaFunction;
            $scope.$watch('SelectedCriteriaFunction.selectedCriteriaFunction',function(){
                console.log("fuu");
            },true);
             $scope.persistCriteriaFunctions = function () {
                SelectedCriteriaFunction.persist();
            };
        }
    ]);
