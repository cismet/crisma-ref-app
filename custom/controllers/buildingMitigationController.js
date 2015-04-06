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
            // TODO: proper validation, this should be false
            $scope.wizard.canProceed = true;
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

                // TODO: proper validation, this should be false
                return true;
            };

            $scope.wizard.proceedButtonText = 'Next';
            
            $scope.params.improvements = {};
            $scope.params.improvements.timeframe = 50;
            $scope.params.improvements.availableBudget = 0;
            $scope.params.improvements.interestRate = 0;
            $scope.params.improvements.aToB = 0;
            $scope.params.improvements.aToC = 0;
            $scope.params.improvements.aToD = 0;
            $scope.params.improvements.bToC = 0;
            $scope.params.improvements.bToD = 0;
            $scope.params.improvements.cToD = 0;
            
            $scope.params.energy = {};
            $scope.params.energy.aToD = {};
            $scope.params.energy.aToD.level = 1;
            $scope.params.energy.aToD.percentage = 0;
            $scope.params.energy.bToD = {};
            $scope.params.energy.bToD.level = 1;
            $scope.params.energy.bToD.percentage = 0;
            $scope.params.energy.cToD = {};
            $scope.params.energy.cToD.level = 1;
            $scope.params.energy.cToD.percentage = 0;
            $scope.params.energy.termalKWhPrice = 0;
            
            $scope.params.budget = {};
            $scope.params.budget.timeframeOptions = [{"value": 50, "label": '<i class="fa fa-calendar"/>&nbsp;50 Years'}];
            $scope.params.budget.government = 0;
            $scope.params.budget.citizens = 0;
            
            $scope.params.tax = {};
            $scope.params.tax.energy = 0;
            $scope.params.tax.seismic = 0;
            
            $scope.params.yearOfEvent = 0;

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
                    // TODO: proper validation, this should be false instead
                    $scope.wizard.canProceed = true;
                }

            }, true);
        }
    ]
);