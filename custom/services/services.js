angular.module(
    'de.cismet.custom.services'
).factory('IconService', [function () {
        'use strict';
        var public_api = {};

        public_api.getStyleClassForIconResource = function (iconResource) {
            var styleClass;

            switch (iconResource) {
                //casualties
                case 'flower_16.png':
                    styleClass = 'fa-user';
                    break;
                    //cost
                case 'dollar_16.png':
                    styleClass = 'fa-dollar';
                    break;
                    //damaged buildings
                case 'home_16.png':
                    styleClass = 'fa-home';
                    break;
                    //damaged infrastructure
                case 'road_16.png':
                    styleClass = 'fa-road';
                    break;
                    //total evacuation cost
                case 'money_evac_16.png':
                    styleClass = 'fa-dollar';
                    break;
                case 'flower_injured_16.png':
                    styleClass = 'fa-wheelchair';
                    break;
                case 'home_lost_16.png':
                    styleClass = 'fa-building';
                    break;
                case 'money_total_evac_16.png':
                    styleClass = 'fa-dollar';
                    break;

            }

            return styleClass;
        };

        return public_api;
    }]).factory('SelectedCriteriaFunction',
    [
        'localStorageService',
        function (localStorageService) {
            'use strict';
            var criteriaFunctions, selectedCriteriaFunction, persist;
            criteriaFunctions = localStorageService.get('criteriaFunctionSet') || [];
            selectedCriteriaFunction = criteriaFunctions[0] ;

            persist = function () {
                localStorageService.add('criteriaFunctionSet', criteriaFunctions);
            };

            var public_api = {
                selectedCriteriaFunction: selectedCriteriaFunction,
                criteriaFunctionSets: criteriaFunctions,
                persist: persist
            };
            return public_api;
        }]).factory('SelectedDecisionStrategy',
    [
        'localStorageService',
        function (localStorageService) {
            'use strict';
            var decisionStrategies, selectedDecisionStrategy, persist;
            decisionStrategies = localStorageService.get('decisionStrategies') || [];
            selectedDecisionStrategy = decisionStrategies[0];

            persist = function () {
                localStorageService.add('decisionStrategies', decisionStrategies);
            };

            var public_api = {
                selectedDecisionStrategy: selectedDecisionStrategy,
                decisionStrategies: decisionStrategies,
                persist: persist
            };
            return public_api;
        }]);