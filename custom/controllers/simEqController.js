angular.module(
    'de.cismet.custom.controllers'
).controller(
    'de.cismet.custom.controllers.simEqController', 
    [
        '$scope',
        'leafletData',
        function ($scope, leafletData) {
            'use strict';

            var epiCenterIcon, marker, setEpicenter;

            $scope.wizard = {};
            $scope.wizard.currentStep = '';
            // TODO: proper validation, this should be false
            $scope.wizard.canProceed = true;
            $scope.wizard.isFinishStep = function () {
                return $scope.wizard.currentStep.indexOf($scope.params.tdvRounds + '') > 0;
            };
            $scope.wizard.finish = function () {
//                $scope.params.run = true;
                $scope.$hide();
            };
            $scope.wizard.proceedButtonText = 'Next';
            
            $scope.center = {lat: 42.355244, lng: 13.393662, zoom: 12};
            
            $scope.paramArray = [];
            $scope.defaultParams = {
                useShakemap: false,
                latitude: 42.355244,
                longitude: 13.393662,
                depth: 0,
                magnitude: 0,
                shakemapName: 'shakemap_1'
            };
            $scope.currentParams = {
                useShakemap: false,
                latitude: 42.355244,
                longitude: 13.393662,
                depth: 0,
                magnitude: 0,
                shakemapName: 'shakemap_1'
            };
            
            $scope.magnitudeTooltip = 'The magnitude of the earthquake';
            $scope.depthTooltip = 'The depth of the earthquake in meters';
            
            $scope.params.tdvRounds = 1;
            // 0 is first step, the tdv round config
            $scope.currentRound = 0;
            
            $scope.beforeNext = function() {
                if($scope.currentRound > 0) {
                    $scope.params['eq' + $scope.currentRound] = angular.copy($scope.currentParams);
                    if($scope.params['eq' + ($scope.currentRound + 1)]) {
                        $scope.currentParams = angular.copy($scope.params['eq' + ($scope.currentRound + 1)]);
                    } else {
                        $scope.currentParams = angular.copy($scope.defaultParams);
                    }
                }
                $scope.currentRound++;
            };
            $scope.beforePrevious = function() {
                if($scope.currentRound > 1) {
                    $scope.params['eq' + $scope.currentRound] = angular.copy($scope.currentParams);
                    $scope.currentParams = angular.copy($scope.params['eq' + ($scope.currentRound - 1)]);
                }
                $scope.currentRound--;
            };
            
            // TODO: gotoStep impl
            // gotostep disabled in wizard source
            // wizard sources adapted to support step removal
            
            $scope.$watch('params.tdvRounds', function(n) {
                // intentional fall-through
                switch($scope.params.tdvRounds) {
                    case 1: {
                        $scope.params.eq2 = undefined;
                    };
                    case 2: {
                        $scope.params.eq3 = undefined;
                    };
                    case 3: {
                        $scope.params.eq4 = undefined;
                    };
                    case 4: {
                        $scope.params.eq5 = undefined;
                    };
                }
            });
            
            epiCenterIcon = L.icon({
                shadowUrl: null,
                iconAnchor: new L.Point(16, 16),
                iconSize: new L.Point(32, 32),
                iconUrl: 'images/epicenter_32.png'
            });
            
            marker = L.marker(
                [$scope.currentParams.latitude, $scope.currentParams.longitude], 
                {
                    icon: epiCenterIcon,
                    clickable: false,
                    keyboard: false,
                    title: 'Epicenter'
                }
            );
            
            setEpicenter = function (latlng) {
                marker.setLatLng(latlng);
                marker.update();
            };
            
            $scope.createLatLng = function () {
                setEpicenter([$scope.currentParams.latitude, $scope.currentParams.longitude]);
            };
            
            leafletData.getMap('eqParamMap').then(function (map) {
                map.on('click', function (event) {
                    $scope.currentParams.latitude = event.latlng.lat;
                    $scope.currentParams.longitude = event.latlng.lng;
                    setEpicenter(event.latlng);
                });

                marker.addTo(map);
            });
            
            $scope.$watch('wizard.currentStep', function (n) {
                if (n) {
                    if ($scope.wizard.isFinishStep()) {
                        $scope.wizard.proceedButtonText = 'Run Simulation';
                    } else {
                        $scope.wizard.proceedButtonText = 'Next';
                    }
                }
                
                leafletData.getMap('eqParamMap' + $scope.currentRound).then(function (map) {
                    map.invalidateSize(false);
                });
            });
        }
    ]
);