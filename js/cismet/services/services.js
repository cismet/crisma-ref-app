angular.module('de.cismet.smartAdmin.services',
    [
        'ngResource',
        'de.cismet.custom.services'
    ]
    ).config(
    [
        '$provide',
        function ($provide) {
            'use strict';
            $provide.constant('DEBUG', 'true');
            $provide.constant('CRISMA_DOMAIN', 'CRISMA');
            $provide.constant('CRISMA_ICMM_API', 'http://localhost:8890');
        }
    ]
    ).service('ShortCutService',
    [
        'LayoutService',
        function () {
            'use strict';
            return {
                isVisble: false
            };
        }
    ]).service('LayoutService',
    function () {
        'use strict';
        return {
            bodyClasses: {
                'fixed-header': true,
                'fixed-ribbon': true,
                'fixed-navigation': true,
                'search-mobile': true,
                'mobile-view-activated': true,
                'minified': false,
                'collapsed': false
            }
        };
    }).service('MenuService',
    [
        function () {
            var activeMenuItem = {};
            'use strict';
            var serviceObj = {
                activeItem: activeMenuItem,
                menuItems: [],
                activePath: [],
                getPathToActiveItem: function () {
                    return serviceObj.activePath.slice(0).reverse();
                }
            };
            return serviceObj;
        }
    ]).service(
    'WorkspaceService',
    [
        function () {
            var serviceObj = {},
                workspaceWorldstates = [];

            serviceObj.addWorldstate = function (worldstate) {
                if (!serviceObj.contains(worldstate)) {
                    //this is necessary to not dynamically load children when clicked
                    worldstate.leaf = true;
                    serviceObj.worldstates.push(worldstate);
                }
            };

            serviceObj.removeWorldstate = function (worldstate) {
                workspaceWorldstates.splice(workspaceWorldstates.indexOf(worldstate), 1);
            };

            serviceObj.clear = function (worldstate) {
                workspaceWorldstates.splice(0, workspaceWorldstates.length);
            };

            serviceObj.contains = function (worldstate) {
                var result = false;
                for (var i = 0; i < serviceObj.worldstates.length; i++) {
                    var tmp = serviceObj.worldstates[i];
                    if (tmp.key === worldstate.key) {
                        result = true;
                        break;
                    }
                }
                return result;
            };

            serviceObj.removeWS = function (worldstate) {
                serviceObj.worldstates.splice(serviceObj.worldstates.indexOf(worldstate), 1);
            };

            serviceObj.worldstates = workspaceWorldstates;

            return serviceObj;
        }
    ]
    ).service(
    'CommonWorldstateUtils',
    [
        '$q',
        function ($q) {
            var serviceObj = {};

            serviceObj.getPathToRoot = getPathToRoot = function (worldstate) {
//                var defer = $q.defer();
                var wsPath = [], ws;
                ws = worldstate;
                while (ws.parentworldstate) {
                    wsPath.push(ws);
                    ws = ws.parentworldstate;
                }
                wsPath.push(ws);
                return wsPath.reverse();
//                return defer.promise;
            };

            return serviceObj;
        }
    ]
    );

