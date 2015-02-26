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
            $scope.wizard.canProceed = false;
            $scope.wizard.isFinishStep = function () {
                return $scope.wizard.currentStep === 'Parameterize Earthquake';
            };
            $scope.wizard.finish = function () {
                $scope.params.run = true;
                $scope.$hide();
            };

            // the wizard framework is not sufficient for user friendly display of states
            $scope.wizard.validators = {noVal: function () { return true; }};
            $scope.wizard.validators['Select Area'] = function () {
                if ($scope.params.area && $scope.params.area.geometry.coordinates) {
                    return true;
                }

                return false;
            };

            $scope.wizard.proceedButtonText = 'Next';

            $scope.$watch('wizard.currentStep', function (n) {
                if (n) {
                    if ($scope.wizard.isFinishStep()) {
                        $scope.wizard.proceedButtonText = 'Finish';
                    } else {
                        $scope.wizard.proceedButtonText = 'Next';
                    }

                    if (n === 'Parameterize Earthquake') {
                        // this has to be done as the map won't render properly as it is loaded when not displayed yet
                        leafletData.getMap('eqParamMap').then(function (map) {
                            map.invalidateSize(false);
                        });
                    }
                } else {
                    $scope.wizard.proceedButtonText = 'Next';
                }
            });
            $scope.$watch('params', function () {
                // if currentstep is not set the wizard is just about to start
                if ($scope.wizard.currentStep && $scope.wizard.currentStep !== '') {
                    $scope.wizard.canProceed =
                        ($scope.wizard.validators[$scope.wizard.currentStep] || $scope.wizard.validators.noVal)();
                } else {
                    $scope.wizard.canProceed = false;
                }

            }, true);
        }
    ]
);