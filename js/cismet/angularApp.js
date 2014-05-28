//angular.module('de.cismet.smartAdmin.services', []);
//angular.module('de.cismet.smartAdmin.directives',[]);
//angular.module('de.cismet.smartAdmin.controllers',[]);

angular.module('de.cismet.smartAdmin', [
    'ngRoute',
    'ngAnimate',
    'de.cismet.smartAdmin.services',
    'de.cismet.smartAdmin.controllers',
    'de.cismet.smartAdmin.directives',
    'ui.bootstrap',
    'de.cismet.crisma.widgets.worldstateTreeWidget',
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
        .when('/worldstateTreeWidget', {
            templateUrl: "partials/worldstateTree.html",
            controller: 'WorldstateTreeCtrl'
        })
        .when('/worldstateInformation', {
            templateUrl: "partials/dashboard.html",
            controller: 'DashBoardCtrl'
        })
        .when('/decisionSupport', {
            templateUrl: "partials/dashboard.html",
            controller: 'DashBoardCtrl'
        })
        .when('/CRISMA.worldstates/:wsId', {
            templateUrl: "partials/WorldstateViewer.html",
            controller: 'WorldstateViewerCtrl',
            resolve: {
                worldstate: function ($route, Worldstates) {
                    return Worldstates.get({wsId: $route.current.params.wsId}).$promise;
                }
            }
        });

//    $locationProvider.html5Mode(true);
//    $locationProvider.hashPrefix('!');
});
