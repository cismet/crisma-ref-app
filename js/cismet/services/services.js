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
    'Nodes',
    [
        '$resource',
        '$timeout',
        'CRISMA_ICMM_API',
        'CRISMA_DOMAIN',
        function ($resource, $timeout, CRISMA_ICMM_API, CRISMA_DOMAIN) {
            'use strict';
            var transformResult, Nodes;
            transformResult = function (data) {
                var nodes = JSON.parse(data).$collection, i, currNode, that,
                    NodeChildren = $resource(CRISMA_ICMM_API + '/nodes/' + CRISMA_DOMAIN + '.:nodeId' + '/children'),
                    getChildrenFunc = function (callback) {
                        var children;
                        that = this;
                        children = Nodes.children({nodeId: that.key}, callback);
                        return children.$promise;
                    };
                var wsNodes = [];
                for (i = 0; i < nodes.length; ++i) {
                    if (nodes[i].key !== '-1') {
                        currNode = nodes[i];
                        // we augment the node object of the rest api with a method how the children are generated
                        currNode.icon = 'fa fa-globe';
//                    currNode.leaf = true;
                        currNode.getChildren = getChildrenFunc;
                        currNode.link = currNode.objectKey;
                        currNode.icon = !currNode.leaf ? 'fa fa-folder-o' : 'fa fa-globe';
                        currNode.isLeaf = currNode.leaf;
                        wsNodes.push(currNode);
                    }
                }
                return wsNodes;
            };
            Nodes = $resource(
                CRISMA_ICMM_API + '/nodes',
                {nodeId: '@id', domain: CRISMA_DOMAIN},
            {
                //belongs to the GET /nodes/{domain}.{nodekey} action of the icmm api
                get: {
                    method: 'GET',
                    params: {deduplicate: true},
                    url: CRISMA_ICMM_API + '/nodes/' + CRISMA_DOMAIN + '.:nodeId',
                    transformResponse: function (data) {
                        var node = JSON.parse(data), that,
                            NodeChildren = $resource(CRISMA_ICMM_API + '/nodes/' + CRISMA_DOMAIN + '.:nodeId' + '/children'),
                            getChildrenFunc = function (callback) {
                                var children;
                                that = this;
                                children = Nodes.children({nodeId: that.key}, callback);
                                return children.$promise;
                            };
                        // we augment the node object of the rest api with a method how the children are generated
                        node.icon = 'fa fa-globe';
//                    currNode.leaf = true;
                        node.getChildren = getChildrenFunc;
                        node.link = node.objectKey;
                        node.icon = !node.leaf ? 'fa fa-folder-o' : 'fa fa-globe';
                        node.isLeaf = node.leaf;
                        return node;
                    }
                },
                // belongs to the /nodes action of the icmm api
                query: {
                    method: 'GET',
                    isArray: true,
//                        url: CRISMA_ICMM_API + '/' + CRISMA_DOMAIN + '.worldstates?limit=100&offset=0&level=1&omitNullValues=false&deduplicate=true',
                    transformResponse: function (data) {
                        return transformResult(data);
                    }
                },
                children: {
                    method: 'GET',
                    isArray: true,
                    params: {level: 2},
                    url: CRISMA_ICMM_API + '/nodes/' + CRISMA_DOMAIN + '.:nodeId' + '/children',
                    transformResponse: function (data) {
                        return transformResult(data);
                    }
                },
                scenarios: {
                    method: 'GET',
                    isArray: true,
                    params: {deduplicate: true},
                    url: CRISMA_ICMM_API + '/nodes/' + CRISMA_DOMAIN + '.-1' + '/children',
                    transformResponse: function (data) {
                        return transformResult(data);
                    }

                }
            }
            );
            return Nodes;
        }
    ]).service(
    'de.cismet.crisma.widgets.scenarioListWidget.services.ScenarioWorldstatesService',
    [
        'CRISMA_ICMM_API',
        'CRISMA_DOMAIN',
        '$resource',
        function (CRISMA_ICMM_API, CRISMA_DOMAIN, $resource) {
            'use strict';
            var getScenarioWorldstates;
            getScenarioWorldstates = function () {
                return $resource(
                    CRISMA_ICMM_API + '/' + CRISMA_DOMAIN + '.worldstates/:wsId',
                    {wsId: '@id', deduplicate: true, fields: 'id,name', level: '1', omitNullValues: 'false'},
                {
                    'get': {method: 'GET', cache: true},
                    'query': {method: 'GET', params: {filter: 'childworldstates:\\[\\]'}, isArray: true, transformResponse: function (data) {
                            return JSON.parse(data).$collection;
                        }}
                }
                );
            };
            return {
                getScenarioWorldstates: getScenarioWorldstates
            };
        }
    ]
    ).service(
    'Worldstates',
    [
        'CRISMA_ICMM_API',
        'CRISMA_DOMAIN',
        '$resource',
        '$q',
        function (CRISMA_ICMM_API, CRISMA_DOMAIN, $resource, $q) {
            'use strict';
            var augmentWorldstateWithICCData = function (worldstate) {
                worldstate.iccdata = [
                    {
                        '$self': '/CRISMA.dataitems/2',
                        'id': 2,
                        'name': 'Indicators',
                        'description': 'Indicator data',
                        'lastmodified': new Date().toISOString(),
                        'temporalcoveragefrom': '2010-11-20T10:05:00.000Z',
                        'temporalcoverageto': '2010-11-20T11:55:00.000Z',
                        'spatialcoverage': 'SRID=4326;POINT (47.493611111111 11.100833333333)',
                        'datadescriptor': {
                            '$self': '/CRISMA.datadescriptors/1',
                            'id': 1,
                            'name': 'icc_slot',
                            'description': 'Dataslot for icc data',
                            'categories': [
                                {
                                    '$self': '/CRISMA.categories/3',
                                    'id': 3,
                                    'key': 'ICC_DATA',
                                    'classification': {
                                        '$self': '/CRISMA.classifications/2',
                                        'id': 2,
                                        'key': 'ICC_DATA'
                                    }
                                }
                            ],
                            'defaultaccessinfocontenttype': 'application/json',
                            'defaultaccessinfo': null
                        },
                        renderingdescriptor: [{
                                gridWidth: 'col-sm-12',
                                priority: 1,
                                displayHeader: true,
                                sortable: false,
                                fullSize: true,
                                collapsed: false,
                                collapsible: true,
                                bodyDirective: 'icc-data-body',
                                headerDirective: 'icc-data-header',
                                colourClasses: ['panel-purple', 'panel-orange', 'panel-greenLight', 'panel-blue', 'panel-redLight'],
                                mergeId: 'iccIndicatorCriteriaWidget',
                                title: 'Indicator & Criteria'
                            }
//                            , {
//                                gridWidth: 'col-sm-12',
//                                priority: 1,
//                                displayHeader: true,
//                                sortable: false,
//                                fullSize: true,
//                                collapsed: false,
//                                collapsible: true,
//                                bodyDirective: 'icc-data-body',
//                                colourClasses: ['panel-purple', 'panel-orange', 'panel-greenLight', 'panel-blue', 'panel-redLight'],
//                                mergeId: 'iccIndicatorCriteria',
//                                widgetArea: false
//                            }
                            , {
                                gridWidth: 'col-sm-12',
                                priority: 0,
                                displayHeader: true,
                                sortable: false,
                                fullSize: true,
                                collapsed: false,
                                collapsible: true,
                                bodyDirective: 'mini-indicator-body',
//                                headerDirective: 'icc-data-header',
                                colourClasses: ['txt-color-blue', 'txt-color-purple', 'txt-color-greenDark', 'txt-color-orange', 'txt-color-redLight'],
                                widgetArea: false
                            }],
                        'actualaccessinfocontenttype': 'application/json',
                        'actualaccessinfo': '{"casualties":{"displayName":"Casualties","iconResource":"flower_16.png","noOfDead":{"displayName":"Number of dead","iconResource":"flower_dead_16.png","value":"257","unit":"People"},"noOfInjured":{"displayName":"Number of injured","iconResource":"flower_injured_16.png","value":"409","unit":"People"},"noOfHomeless":{"displayName":"Number of homeless","iconResource":"flower_homeless_16.png","value":"129","unit":"People"}},"cost":{"directDamageCost":{"displayName":"Direct damage cost","iconResource":"dollar_direct_16.png","value":"4582048.34","unit":"Dollar"},"displayName":"Economic cost","iconResource":"dollar_16.png","indirectDamageCost":{"displayName":"Indirect damage cost","iconResource":"dollar_indirect_16.png","value":"830923892.47","unit":"Dollar"},"restorationCost":{"displayName":"Direct restoration cost","iconResource":"dollar_restoration_16.png","value":"892930184.91","unit":"Dollar"}},"damagedBuildings":{"displayName":"Damaged buildings","iconResource":"home_16.png","lostBuildings":{"displayName":"Lost buildings","iconResource":"home_lost_16.png","value":"49","unit":"Buildings"},"unsafeBuildings":{"displayName":"Unsafe buildings","iconResource":"home_unsafe_16.png","value":"152","unit":"Buildings"}},"damagedInfrastructure":{"damagedRoadSegments":{"displayName":"Number of damaged road segments","iconResource":"road_damaged_16.png","value":"34","unit":"Roadsegments"},"displayName":"Damaged Infrastructure","iconResource":"road_16.png"},"evacuationCost":{"displayName":"Evacuation cost","iconResource":"money_evac_16.png","totalEvacuationCost":{"displayName":"Total evacuationcost","iconResource":"money_total_evac_16.png","value":"3494023211.23","unit":"Dollar"}}}', // TODO: icc data
                        'categories': [
                            {
                                '$self': '/CRISMA.categories/2',
                                'id': 2,
                                'key': 'Indicators',
                                'classification': {
                                    '$self': '/CRISMA.classifications/2',
                                    'id': 2,
                                    'key': 'ICC_DATA'
                                }
                            }
                        ]
                    },
                    {
                        '$self': '/CRISMA.dataitems/3',
                        'id': 3,
                        'name': 'Criteria',
                        'description': 'Criteria data',
                        'lastmodified': new Date().toISOString(),
                        'temporalcoveragefrom': '2010-11-20T10:05:00.000Z',
                        'temporalcoverageto': '2010-11-20T11:55:00.000Z',
                        'spatialcoverage': 'SRID=4326;POINT (47.493611111111 11.100833333333)',
                        'datadescriptor': {
                            '$self': '/CRISMA.datadescriptors/1',
                            'id': 1,
                            'name': 'icc_slot',
                            'description': 'Dataslot for icc data',
                            'categories': [
                                {
                                    '$self': '/CRISMA.categories/3',
                                    'id': 3,
                                    'key': 'ICC_DATA',
                                    'classification': {
                                        '$self': '/CRISMA.classifications/2',
                                        'id': 2,
                                        'key': 'ICC_DATA'
                                    }
                                }
                            ],
                            'defaultaccessinfocontenttype': 'application/json',
                            'defaultaccessinfo': null
                        },
                        renderingdescriptor: [{
                                gridWidth: 'col-sm-12',
                                priority: 1,
                                displayHeader: true,
                                sortable: false,
                                fullSize: true,
                                collapsed: false,
                                collapsible: true,
                                bodyDirective: 'icc-data-body',
                                headerDirective: 'icc-data-header',
                                colourClasses: ['panel-purple', 'panel-orange', 'panel-greenLight', 'panel-blue', 'panel-redLight'],
                                mergeId: 'iccIndicatorCriteriaWidget',
                                title: 'Indicator & Criteria'
                            }
//                            , {
//                                gridWidth: 'col-sm-12',
//                                priority: 1,
//                                displayHeader: true,
//                                sortable: false,
//                                fullSize: true,
//                                collapsed: false,
//                                collapsible: true,
//                                bodyDirective: 'icc-data-body',
//                                headerDirective: 'icc-data-header',
//                                colourClasses: ['panel-purple', 'panel-orange', 'panel-greenLight', 'panel-blue', 'panel-redLight'],
//                                mergeId: 'iccIndicatorCriteria',
//                                widgetArea: false
//                            }
                        ],
                        'actualaccessinfocontenttype': 'application/json',
                        'actualaccessinfo': '{"casualties":{"displayName":"Casualties","iconResource":"flower_16.png","noOfDead":{"displayName":"Number of dead","iconResource":"flower_dead_16.png","value":"15","unit":"Percent"},"noOfInjured":{"displayName":"Number of injured","iconResource":"flower_injured_16.png","value":"80","unit":"Percent"},"noOfHomeless":{"displayName":"Number of homeless","iconResource":"flower_homeless_16.png","value":"5","unit":"Percent"}},"cost":{"directDamageCost":{"displayName":"Direct damage cost","iconResource":"dollar_direct_16.png","value":"90","unit":"Percent"},"displayName":"Economic cost","iconResource":"dollar_16.png","indirectDamageCost":{"displayName":"Indirect damage cost","iconResource":"dollar_indirect_16.png","value":"50","unit":"Percent"},"restorationCost":{"displayName":"Direct restoration cost","iconResource":"dollar_restoration_16.png","value":"34","unit":"Percent"}},"damagedBuildings":{"displayName":"Damaged buildings","iconResource":"home_16.png","lostBuildings":{"displayName":"Lost buildings","iconResource":"home_lost_16.png","value":"49","unit":"Percent"},"unsafeBuildings":{"displayName":"Unsafe buildings","iconResource":"home_unsafe_16.png","value":"29","unit":"Percent"}},"damagedInfrastructure":{"damagedRoadSegments":{"displayName":"Number of damaged road segments","iconResource":"road_damaged_16.png","value":"34","unit":"Percent"},"displayName":"Damaged Infrastructure","iconResource":"road_16.png"},"evacuationCost":{"displayName":"Evacuation cost","iconResource":"money_evac_16.png","totalEvacuationCost":{"displayName":"Total evacuationcost","iconResource":"money_total_evac_16.png","value":"80","unit":"Percent"}}}', // TODO: icc data
                        'categories': [
                            {
                                '$self': '/CRISMA.categories/6',
                                'id': 6,
                                'key': 'Criteria',
                                'classification': {
                                    '$self': '/CRISMA.classifications/2',
                                    'id': 2,
                                    'key': 'ICC_DATA'
                                }
                            }
                        ]
                    }
                ];
                return worldstate;
            },
                augmentWorldstateDataWithRenderingDescriptors = function (worldstate) {
                    var renderingDescriptorPrototype = {
                        gridWidth: 'col-sm-6',
                        priority: 1,
                        displayHeader: true,
                        sortable: true,
                        fullSize: true,
                        collapsed: false,
                        collapsible: true,
                        bodyDirective: 'wms-leaflet',
//                        headerDirective: 'leaflet-wms',
                        padding: 'no-padding'
                    }, dataslot;
                    if (worldstate.worldstatedata) {
                        for (var i = 0; i < worldstate.worldstatedata.length; i++) {
                            dataslot = worldstate.worldstatedata[i];
                            var tempRd = Object.create(renderingDescriptorPrototype);
                            tempRd.title = dataslot.name;
                            tempRd.priority = i + 2;
                            dataslot.renderingdescriptor = [];
                            dataslot.renderingdescriptor.push(tempRd);
                        }
                    }
                },
                mergeWMSLayer = function (worldstate) {
                    var osmMergeId = 'osmHelperLayer';
                    var regionMergeId = 'regionHelperLayer';
                    var backgroundMergeId = 'backgroundHelperLayer';
                    for (var i = 0; i < worldstate.worldstatedata.length; i++) {
                        var renderingdescriptor = worldstate.worldstatedata[i].renderingdescriptor[0];
                        var dataslot = worldstate.worldstatedata[i]
                        switch (dataslot.name) {
                            case 'planet_osm_polygon':
                            case 'ortho':
                            case 'planet_osm_line':
                            case 'planet_osm_point':
                                renderingdescriptor.mergeId = osmMergeId;
                                renderingdescriptor.priority = 20;
                                break;
                            case 'regione':
                            case 'province':
                            case 'comune_aq':
                            case 'hospitals':
                            case 'schools':
                            case 'power_towers':
                                renderingdescriptor.mergeId = regionMergeId;
                                renderingdescriptor.priority = 30;
                                break;
                            case 'contour_dem_25':
                            case 'zones':
                            case 'clc2006':
                                renderingdescriptor.mergeId = backgroundMergeId;
                                renderingdescriptor.priority = 40;
                                break;

                        }
                    }
                },
                processResult = function (worldstateData) {
                    if (!worldstateData) {
                        return null;
                    }
                    var worldstate = JSON.parse(worldstateData);
                    augmentWorldstateWithICCData(worldstate);
                    augmentWorldstateDataWithRenderingDescriptors(worldstate);
                    mergeWMSLayer(worldstate);
                    return worldstate;
                },
                processResults = function (worldstates) {
                    var worldstatesArr = JSON.parse(worldstates);
                    for (var i = 0; i < worldstatesArr.length; i++) {
                        augmentWorldstateWithICCData(worldstatesArr[i]);
                        augmentWorldstateDataWithRenderingDescriptors(worldstatesArr[i]);
                    }
                    return worldstatesArr;
                };
            var Worldstate = $resource(
                CRISMA_ICMM_API + '/' + CRISMA_DOMAIN + '.worldstates/:wsId',
                {wsId: '@id', deduplicate: false, level: '5', omitNullValues: 'false'},
            {
                'get': {method: 'GET', transformResponse: processResult},
                'query': {method: 'GET', isArray: true, transformResponse: processResults}
            }
            );
            return Worldstate;
        }
    ]
    ).service(
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

