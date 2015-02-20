angular.module(
    'de.cismet.custom.controllers'
).controller(
    'de.cismet.custom.controllers.simEqController', 
    [
        '$scope',
        '$timeout',
        'leafletData',
        function ($scope, $timeout, leafletData) {
            'use strict';

            var epiCenterIcon, marker, setEpicenter;
            
            $scope.center = {lat: 42.355244, lng: 13.393662, zoom: 12};
            
            $scope.params.useShakemap = false;
            $scope.params.applyTDV = false;
            $scope.params.latitude = 42.355244;
            $scope.params.longitude = 13.393662;
            $scope.params.depth = 0;
            $scope.params.magnitude = 0;
            
            $scope.magnitudeTooltip = 'The magnitude of the earthquake';
            $scope.depthTooltip = 'The depth of the earthquake in meters';
            
            epiCenterIcon = L.icon({
                shadowUrl: null,
                iconAnchor: new L.Point(16, 16),
                iconSize: new L.Point(32, 32),
                iconUrl: 'images/epicenter_32.png'
            });
            
            marker = L.marker(
                [$scope.params.latitude, $scope.params.longitude], 
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
                setEpicenter([$scope.params.latitude, $scope.params.longitude]);
            };
            
            leafletData.getMap('mainmap').then(function (map) {
                map.on('click', function (event) {
                    $scope.params.latitude = event.latlng.lat;
                    $scope.params.longitude = event.latlng.lng;
                    setEpicenter(event.latlng);
                });

                marker.addTo(map);
            });
            
            $scope.startSimulation = function () {
                $scope.params.run = true;
                $scope.$hide();
            };
        }
    ]
);