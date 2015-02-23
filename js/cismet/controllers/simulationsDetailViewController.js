angular.module(
    'de.cismet.smartAdmin.controllers'
).controller(
    'de.cismet.smartAdmin.controllers.simulationsDetailViewController',
    [
        '$scope',
        'simulation',
        function ($scope, simulation) {
            'use strict';
            
            $scope.simulation = simulation;
            $scope.JSON = JSON;
        }
    ]
);