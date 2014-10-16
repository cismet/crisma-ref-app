angular.module(
    'de.cismet.smartAdmin.controllers'
    ).controller('WorldstateViewerCtrl',
    [
        '$scope',
        'worldstate',
        'Utils',
        'de.cismet.crisma.ICMM.services.icmm',
        function ($scope, Worldstate, Utils, icmm) {
            var ws, i, j, k, dataslot, renderingdescriptors, rdItem;
            ws = Utils.augmentWorldstateDataWithRenderingDescriptors(Worldstate);
            $scope.worldstate = Utils.mergeWMSLayer(ws);
            ws = icmm.convertToCorrectIccDataFormat(ws);
            ws = Utils.augmentIccDataWithRenderingDescriptors(ws);
            $scope.visualisationData = [];
            $scope.mergedDataMap = {};
            
            //iterate through the worldstate dataslots and collect all renderingdescriptors.
            //for each renderering descriptor we wan't to add a directive that visualizes this dataslot
            //it is also possible to merge dataslots with an mergeId
            //we must also build a hashmap for merged dataslots
            //FIXME currently we use the rendering descriptor of the first dataslot for merged directives
            
            var dataItems = $scope.worldstate.worldstatedata.concat($scope.worldstate.iccdata);
            for (i = 0; i < dataItems.length; i++) {
                dataslot = dataItems[i];
                if(dataslot){
                    
                    renderingdescriptors = dataslot.renderingdescriptor;
                    for (j = 0; j < renderingdescriptors.length; j++) {
                        rdItem = {
                            dataslot: dataslot,
                            renderingdescriptor: renderingdescriptors[j],
                            worldstate: $scope.worldstate
                        };
                        if (renderingdescriptors[j].mergeId) {
                            if ($scope.mergedDataMap.hasOwnProperty(renderingdescriptors[j].mergeId)) {
                                $scope.mergedDataMap[renderingdescriptors[j].mergeId].push(rdItem);
                            } else {
                                $scope.mergedDataMap[renderingdescriptors[j].mergeId] = [];
                                $scope.mergedDataMap[renderingdescriptors[j].mergeId].push(rdItem);
                            }
                        } else {
                            $scope.visualisationData.push(rdItem);
                        }
                    }
                }
            }

            //for every mergeId we want to visualise one directive.
            for (var prop in $scope.mergedDataMap) {
                if ($scope.mergedDataMap.hasOwnProperty(prop)) {
                    var mergedDataslots = $scope.mergedDataMap[prop];
                    if (mergedDataslots.length >= 1) {
                        $scope.visualisationData.push({
                            dataslot: mergedDataslots,
                            renderingdescriptor: mergedDataslots[0].renderingdescriptor,
                            worldstate: mergedDataslots[0].worldstate
                        });
                    }
                }
            }

            //we divide all rendering items according to the widgetArea property of the rendering descriptor
            $scope.widgetAreaRenderer = [];
            $scope.normalAreaRenderer = [];

            for (k = 0; k < $scope.visualisationData.length; k++) {
                if ($scope.visualisationData[k].renderingdescriptor.hasOwnProperty('widgetArea')) {
                    if (!$scope.visualisationData[k].widgetArea) {
                        $scope.normalAreaRenderer.push($scope.visualisationData[k]);
                        continue;
                    }
                }
                $scope.widgetAreaRenderer.push($scope.visualisationData[k]);
            }

            $scope.worldstateHeaderProvided = (Worldstate.renderingdescriptor && Worldstate.renderingdescriptor.worldstateHeader) || false;

        }
    ]);
