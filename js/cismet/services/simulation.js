angular.module(
    'de.cismet.smartAdmin.services'
).factory(
    'de.cismet.smartAdmin.services.simulation',
    [
        '$resource',
        '$interval',
        'de.cismet.smartAdmin.services.utils',
        'CRISMA_DOMAIN',
        'CRISMA_ICMM_API',
        function ($resource, $interval, utils, CRISMA_DOMAIN, CRISMA_ICMM_API) {
            'use strict';

            var allSimulations, getSimulation, getSimulations, processResults, res, runningSimulations,
                simEquals, updateSimulations;

            simEquals = function (other) {
                if (other) {
                    if (this === other) {
                        return true;
                    } else {
                        return this.id === other.id &&
                            this.transitionstatus === other.transitionstatus;
                    }
                }

                return false;
            };

            processResults = function (data) {
                if (data) {
                    var arr;
                    arr = JSON.parse(data).$collection;
                    arr.forEach(function (v) {
                        v.equals = simEquals;
                    });

                    return arr;
                } else {
                    return [];
                }
            };

            res = $resource(CRISMA_ICMM_API + '/' + CRISMA_DOMAIN + '.transitions/:tId',
                {
                    tId: '@id',
                    deduplicate: false,
                    level: '1',
                    omitNullValues: 'false'
                },
                {
                    'get': {
                        method: 'GET'
                    },
                    'query': {
                        method: 'GET',
                        isArray: true,
                        transformResponse: processResults
                    }
                });

            getSimulations = function () {
                return res.query();
            };

            getSimulation = function (sId) {
                return res.get({tId: sId});
            };

            runningSimulations = [];
            allSimulations = [];

            updateSimulations = function () {
                var simulations;
                //console.log('update');

                simulations = getSimulations();

                simulations.$promise.then(function () {
                    var running;

                    running = [];
                    simulations.forEach(function (simulation) {
                        if (simulation.transitionstatus) {
                            if (simulation.transitionstatus.toLowerCase() === 'running' ||
                                    JSON.parse(simulation.transitionstatus).status.toLowerCase() === 'running') {
                                running.push(simulation);
                            }
                        }
                    });

                    utils.updateArray(allSimulations, simulations);
                    utils.updateArray(runningSimulations, running);
                });

                return simulations;
            };

            // poll simulations
            $interval(
                function () {
                    updateSimulations();
                },
                10000,
                0,
                true
            );

            updateSimulations();

            return {
                getSimulations: getSimulations,
                getSimulation: getSimulation,
                runningSimulations: runningSimulations,
                allSimulations: allSimulations,
                updateSimulations: updateSimulations
            };
        }
    ]
);