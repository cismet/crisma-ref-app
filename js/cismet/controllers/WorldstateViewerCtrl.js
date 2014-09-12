angular.module(
    'de.cismet.smartAdmin.controllers'
    ).controller('WorldstateViewerCtrl',
    [
        '$scope',
        'worldstate',
        function ($scope, Worldstate) {

            $scope.worldstate = Worldstate;
            $scope.visualisationData = [];
            $scope.mergedDataMap = {};
            //iterate through the worldstate dataslots and collect all renderingdescriptors.
            //for each renderering descriptor we wan't to add a directive that visualizes this dataslot
            //it is also possible to merge dataslots with an mergeId
            //we must also build a hashmap for merged dataslots
            //FIXME currently we use the renderin descriptor of the first dataslot for merged directives
            //
            var dataItems = $scope.worldstate.worldstatedata.concat($scope.worldstate.iccdata);
            for (var i = 0; i < dataItems.length; i++) {
                var dataslot = dataItems[i],
                    renderingdescriptors = dataslot.renderingdescriptor || dataslot.renderingDescriptor ;
                for (var j = 0; j < renderingdescriptors.length; j++) {
                    var obj = {
                        dataslot: dataslot,
                        renderingdescriptor: renderingdescriptors[j],
                        worldstate: $scope.worldstate
                    };
                    if (renderingdescriptors[j].mergeId) {
                        if ($scope.mergedDataMap.hasOwnProperty(renderingdescriptors[j].mergeId)) {
                            $scope.mergedDataMap[renderingdescriptors[j].mergeId].push(obj);
                        } else {
                            $scope.mergedDataMap[renderingdescriptors[j].mergeId] = [];
                            $scope.mergedDataMap[renderingdescriptors[j].mergeId].push(obj);
                        }
                    } else {
                        $scope.visualisationData.push(obj);
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

            for (var k = 0; k < $scope.visualisationData.length; k++) {
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
