angular.module(
    'de.cismet.custom.directives'
).directive(
    'areaChooser',
    [
        'leafletData',
        function (leafletData) {
            var controller, link, scope;
            
            scope = {
                geom: '=',
                selectableAreas: '=',
                selectableAreasTitle: '='
            };
            
            controller = [
                '$scope',
                function ($scope) {
                    var circleLayer, defaultCtrlOpts, drawCtrl, editGroup, getCircleCtrlOpts, getPolygonCtrlOpts, polygonLayer, selectableAreaLayer;
                    
                    $scope.center = {lat: 42.355244, lng: 13.393662, zoom: 12};
                    $scope.selectedOption = 'freePolygon';
                    $scope.setRadius = function() {
                        if (circleLayer && $scope.distanceInput.$valid) {
                            circleLayer.setRadius($scope.selectedDistance);
                        }
                    };
                    
                    editGroup = new L.FeatureGroup();
                    defaultCtrlOpts = {
                        edit: {
                            edit: false,
                            remove: false
                        },
                        draw: {
                            polyline: false,
                            rectangle: false,
                            marker: false,
                            circle: false,
                            polygon: false
                        }
                    };
                    getDefaultCtrlOpts = function () {
                        var ctrlOpts;
                        
                        ctrlOpts = angular.copy(defaultCtrlOpts);
                        ctrlOpts.edit.featureGroup = editGroup;
                        
                        return ctrlOpts;
                    };
                    getCircleCtrlOpts = function () {
                        var ctrlOpts;
                        
                        ctrlOpts = getDefaultCtrlOpts();
                        ctrlOpts.draw.circle = {};
                        ctrlOpts.edit.edit = true;
                        
                        return ctrlOpts;
                    };
                    getPolygonCtrlOpts = function () {
                        var ctrlOpts;
                        
                        ctrlOpts = getDefaultCtrlOpts();
                        ctrlOpts.draw.polygon = {};
                        ctrlOpts.edit.edit = true;
                        
                        return ctrlOpts;
                    };
                    
                    // initial state is draw polygon
                    drawCtrl = new L.Control.Draw(getPolygonCtrlOpts());
                    
                    leafletData.getMap('areaChooser').then(function (map) {
                        map.addLayer(editGroup);
                        map.addControl(drawCtrl);
                        
                        map.on('draw:created', function (event) {
                            if (event.layerType === 'circle') {
                                if (circleLayer) {
                                    editGroup.removeLayer(circleLayer);
                                }
                                circleLayer = event.layer;
                                $scope.selectedDistance = Math.round(circleLayer.getRadius() * 100) / 100;
                            } else if (event.layerType === 'polygon') {
                                if (polygonLayer) {
                                    editGroup.removeLayer(polygonLayer);
                                }
                                polygonLayer = event.layer;
                            }
                            
                            editGroup.addLayer(event.layer);
                        });
                        
                        
                        map.on('draw:edited', function (event) {
                            // it should only be one layer
                            event.layers.eachLayer(function (layer) {
                                if (layer.getRadius) {
                                    $scope.selectedDistance = Math.round(circleLayer.getRadius() * 100) / 100;
                                } 
                            });
                        });
                    });
                    
                    $scope.$watch('selectedOption', function(n, o) {
                        if (n && n !== o) {
                            leafletData.getMap('areaChooser').then(function (map) {
                                var newCtrlOpts;
                                
                                editGroup.clearLayers();
                                if (n === 'freePolygon') {
                                    newCtrlOpts = getPolygonCtrlOpts();
                                    if (polygonLayer) {
                                        editGroup.addLayer(polygonLayer);
                                    }
                                } else if (n === 'pointDistance') {
                                    newCtrlOpts = getCircleCtrlOpts();
                                    if (circleLayer) {
                                        editGroup.addLayer(circleLayer);
                                    }
                                } else {
                                    newCtrlOpts = getDefaultCtrlOpts();
                                }

                                map.removeControl(drawCtrl);
                                drawCtrl = new L.Control.Draw(newCtrlOpts);
                                map.addControl(drawCtrl);
                            });
                        }
                    });
                }
            ];
            
            link = function (scope, elem, attrs, controller) {
            };
            
            return {
                restrict: 'E',
                templateUrl: 'custom/templates/areaChooser.html',
                replace: true,
                scope: scope,
                controller: controller,
                link: link
            };
        }
    ]
);