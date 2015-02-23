angular.module(
    'de.cismet.smartAdmin.services'
).factory(
    'de.cismet.smartAdmin.services.simulation', 
    [
        '$resource',
        '$interval',
        'CRISMA_DOMAIN',
        'CRISMA_ICMM_API',
        function ($resource, $interval, CRISMA_DOMAIN, CRISMA_ICMM_API) {
            'use strict';
            
            var allSimulations, getSimulation, getSimulations, processResults, res, runningSimulations, 
                    updateArray, updateSimulations;
            
            processResults = function (data) {
                if(data) {
                    return JSON.parse(data).$collection;
                } else {
                    return [];
                }
            };
            
            updateArray = function (arr, newArr) {
                var i, found;
                
                found = false;
                newArr.forEach(function (vo) {
                    found = arr.some(function (vi) {
                        return vi.id === vo.id;
                    });
                    
                    if (!found) arr.push(vo);
                });
                
                for (i = arr.length - 1; i >= 0; --i) {
                    found = newArr.some(function (v) {
                        return v.id === arr[i].id;
                    });
                    
                    if (!found) arr.splice(i, 1);
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
                console.log('update');
                
                simulations = getSimulations();
                
                simulations.$promise.then(function () {
                    var running;
                    
                    running = [];
                    simulations.forEach(function(simulation) {
                        if (simulation.transitionstatus) {
                            if(simulation.transitionstatus === 'running' || 
                                    JSON.parse(simulation.transitionstatus).status === 'running') {
                                running.push(simulation);
                            }
                        }
                    });
                    
                    updateArray(allSimulations, simulations);
                    updateArray(runningSimulations, running);
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