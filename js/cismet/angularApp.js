//angular.module('de.cismet.smartAdmin.services', []);
//angular.module('de.cismet.smartAdmin.directives',[]);
//angular.module('de.cismet.smartAdmin.controllers',[]);

angular.module('de.cismet.smartAdmin', [
    'ngRoute',
    'ngAnimate',
    'de.cismet.smartAdmin.services',
    'de.cismet.smartAdmin.controllers',
    'de.cismet.smartAdmin.directives',
    'de.cismet.crisma.widgets.worldstateTreeWidget',
    'de.cismet.cids.rest.collidngNames.Nodes',
    'ngTable',
    'eu.crismaproject.worldstateAnalysis.controllers',
    'eu.crismaproject.worldstateAnalysis.directives',
]).config(function ($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: "partials/login.html"
    })
        .when('/register', {
            templateUrl: "partials/register.html"
        })
        .when('/lock', {
            templateUrl: "partials/lock.html"
        })
        .when('/error404', {
            templateUrl: "partials/error404.html"
        })
        .when('/error500', {
            templateUrl: "partials/error500.html"
        })
        .when('/dashboard', {
            templateUrl: "partials/dashboard.html",
            controller: 'DashBoardCtrl'
        })
        .when('/workspace', {
            templateUrl: "partials/workspace.html",
            controller: 'WorkspaceCtrl'
        })
        .when('/simulations', {
            templateUrl: "partials/simulationsView.html",
            controller: 'de.cismet.smartAdmin.controllers.simulationsViewController',
            resolve: {
                simulations: [
                    'de.cismet.smartAdmin.services.simulation',
                    function (simulationService) {
                        return simulationService.updateSimulations().$promise;
                    }
                ]
            }
        })
        .when('/simulations/:sId', {
            templateUrl: "partials/simulationsDetailView.html",
            controller: 'de.cismet.smartAdmin.controllers.simulationsDetailViewController',
            resolve: {
                simulation: [
                    '$route',
                    '$q',
                    'de.cismet.smartAdmin.services.simulation',
                    function ($route, $q, simulationService) {
                        var deferred;
                        
                        deferred = $q.defer();
                        
                        simulationService.updateSimulations().$promise.then(
                            function () {
                                var found;
                                
                                found = simulationService.allSimulations.some(function (v) {
                                    if(v.id.toString() === $route.current.params.sId) {
                                        deferred.resolve(v);
                                        return true;
                                    }
                                    
                                    return false;
                                });
                                
                                if(!found) {
                                    deferred.reject('No simulation with id');
                                }
                            },
                            function () {
                                deferred.reject('No simulation with id');
                            }
                        );
                
                        return deferred.promise;
                    }
                ]
            }
        })
        .when('/simulations/unknown', {
            templateUrl: "partials/simulationsDetailUnknown.html",
        })
        .when('/worldstateTreeWidget', {
            templateUrl: "partials/worldstateTree.html",
            controller: 'WorldstateTreeCtrl'
        })
        .when('/worldstateInformation', {
            templateUrl: "partials/dashboard.html",
            controller: 'DashBoardCtrl'
        })
        .when('/decisionSupport/criteriaFunctions', {
            templateUrl: "partials/criteriaFunctionManager.html",
            controller: 'CriteriaFunctionCtrl'
        })
        .when('/decisionSupport/decisionStrategies', {
            templateUrl: "partials/decisionStrategyManager.html",
            controller: 'DecisionStrategiesCtrl'
        })
        .when('/decisionSupport/analysis', {
            templateUrl: "partials/analysis.html",
            controller: 'DecisionSupportAnalysisCtrl'
        })
        .when('/CRISMA.worldstates/:wsId', {
            templateUrl: "partials/WorldstateViewer.html",
            controller: 'WorldstateViewerCtrl',
            resolve: {
                worldstate: [
                    '$route',
                    'de.cismet.crisma.ICMM.Worldstates',
                    function ($route, Worldstates) {
                        return Worldstates.get({wsId: $route.current.params.wsId}).$promise;
                    }
                ]
            }
        });

//    $locationProvider.html5Mode(true);
//    $locationProvider.hashPrefix('!');
});
