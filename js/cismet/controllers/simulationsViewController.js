angular.module(
    'de.cismet.smartAdmin.controllers'
).controller(
    'de.cismet.smartAdmin.controllers.simulationsViewController',
    [
        '$scope',
        'simulations',
        'de.cismet.smartAdmin.services.simulation',
        function ($scope, simulations, simulationService) {
            'use strict';
            
            $scope.simulations = simulations;
            $scope.JSON = JSON;
            
            $scope.$watch('simulationService.allSimulations', function(n, o) {
                if(n !== o) {
                    $scope.simulations = simulationService.allSimulations;
                }
            }, true);
        }
    ]
);