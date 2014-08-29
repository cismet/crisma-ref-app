angular.module('de.cismet.custom.services',
    [
        'LocalStorageModule'
    ]).factory('WorldstateUtils', [function () {
        'use strict';
        var worldstateUtils;
        worldstateUtils = function () {
            var publicApi;

            publicApi = {};

            publicApi.stripIccData = function (worldstate, forCriteria) {
                var data, i, j, k, iccdata;

                data = null;
                iccdata = worldstate.iccdata;
                for (j = 0; j < iccdata.length && !data; ++j) {
                    for (k = 0; k < iccdata[j].categories.length && !data; ++k) {
                        if (forCriteria && 'Criteria' === iccdata[j].categories[k].key) {
                            data = iccdata[j];
                        } else if (!forCriteria && 'Indicators' === iccdata[j].categories[k].key) {
                            data = iccdata[j];
                        }
                    }
                }

                if (!data) {
                    throw 'worldstate without proper icc data:' + worldstate;
                }

                return JSON.parse(data.actualaccessinfo);

            };

            return publicApi;
        };
        return worldstateUtils();
    }]).factory('IconService', [function () {
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
            selectedCriteriaFunction = criteriaFunctions[0] || {};

            persist = function () {
                localStorageService.add('criteriaFunctionSet', criteriaFunctions);
            };

            var public_api = {
                selectedCriteriaFunction: selectedCriteriaFunction,
                criteriaFunctionSets: criteriaFunctions,
                persist: persist
            };
            return public_api;
        }]);