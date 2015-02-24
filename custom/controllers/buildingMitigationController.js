angular.module(
    'de.cismet.custom.controllers'
).controller(
    'de.cismet.custom.controllers.buildingMitigationController', 
    [
        '$scope',
        'WizardHandler',
        'leafletData',
        function ($scope, WizardHandler, leafletData) {
            'use strict';
            
            $scope.wizard = {};
            $scope.wizard.currentStep = '';
            $scope.wizard.isFinishStep = function() {
                return $scope.wizard.currentStep === 'Parameterize Earthquake';
            };
            $scope.wizard.finish = function() {
                $scope.params.run = true;
                $scope.$hide();
            };
            
            $scope.wizard.proceedButtonText = 'Next';
            
            $scope.$watch('wizard.currentStep', function (n) {
                if(n && $scope.wizard.isFinishStep()) {
                    $scope.wizard.proceedButtonText = 'Finish';
                    
                    // this has to be done as the map won't render properly as it is loaded when not displayed
                    // maybe we should make this 'nicer' as the 'finish' step may not be the one with the map
                    leafletData.getMap('eqParamMap').then(function (map) {
                        map.invalidateSize(false);
                    });
                } else {
                    $scope.wizard.proceedButtonText = 'Next';
                }
            });
        }
    ]
);