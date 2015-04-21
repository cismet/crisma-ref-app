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

            // collect all supportive WMS Layers and add them to scope
            var supportiveWMS = [];
            var dataItems = $scope.worldstate.worldstatedata;

            // collect all supportiveWMS
            for (i = 0; i < dataItems.length; i++) {
                dataslot = dataItems[i];
                if (dataslot.categories[0].key === 'SUPPORTIVE_WMS') {
                    rdItem = {
                                dataslot: dataslot,
                                renderingdescriptor: dataslot.renderingdescriptor[0],
                                worldstate: $scope.worldstate
                            };
                    supportiveWMS.push(rdItem);
                }
            }

            dataItems = $scope.worldstate.worldstatedata.concat($scope.worldstate.iccdata);
            for (i = 0; i < dataItems.length; i++) {
                dataslot = dataItems[i];
                if (dataslot && dataslot.renderingdescriptor && dataslot.renderingdescriptor.length > 0) {
                    if (dataslot.categories[0].key !== 'SUPPORTIVE_WMS') {
                        renderingdescriptors = dataslot.renderingdescriptor;
                        for (j = 0; j < renderingdescriptors.length; j++) {
                            rdItem = {
                                dataslot: dataslot,
                                renderingdescriptor: renderingdescriptors[j],
                                worldstate: $scope.worldstate
                            }
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
            
            // add the supportive WMS to the dataslot(arrays) of type wms capabilities
            for (k = 0; k < $scope.visualisationData.length; k++) {
                // FIXME: don't do that! using the same property for arrays and different objects!
                var rdItemObjectOrArray = $scope.visualisationData[k];
                
                // this is madness: check if dataslot is a plain dataslot or an array of rdItems!
                if (Object.prototype.toString.call(rdItemObjectOrArray.dataslot) === '[object Array]') {
                    var rdItemArray = rdItemObjectOrArray.dataslot;
                    for (var j = 0; j < rdItemArray.length; j++) {
                        var theRealDataslot = rdItemArray[j].dataslot;
                        if(theRealDataslot.datadescriptor.categories[0].key === ('WMS_CAPABILITIES')) {  
                            //merge supportive WMS rditems array with "dataslot" rdItems Array
                            $scope.visualisationData[k].dataslot = supportiveWMS.concat($scope.visualisationData[k].dataslot);
                            break;
                        }
                    }
                } else { 
                    var theRealDataslot =  rdItemObjectOrArray.dataslot;
                    if(theRealDataslot.datadescriptor.categories[0].key === ('WMS_CAPABILITIES')) {    
                        
                        var rdItemArray = supportiveWMS.concat([rdItemObjectOrArray]);
                        
                        // this is madness: FIX IT IN PRODUCTIVE VERSION!!!
                        rdItem = {
                            dataslot: rdItemArray,
                            renderingdescriptor: rdItemObjectOrArray.renderingdescriptor,
                            worldstate: rdItemObjectOrArray.worldstate
                        };
                            
                        $scope.visualisationData[k] = rdItem;
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
