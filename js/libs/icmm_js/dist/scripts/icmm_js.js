angular.module('de.cismet.cids.rest.collidngNames.Nodes', ['ngResource']).factory('de.cismet.collidingNameService.Nodes', [
    '$resource',
    '$timeout',
    'CRISMA_ICMM_API',
    'CRISMA_DOMAIN',
    function ($resource, $timeout, CRISMA_ICMM_API, CRISMA_DOMAIN) {
        'use strict';
        var transformResults, transformSingleResult, Nodes, utils;
        transformSingleResult = function (ws) {
            var hasChilds, node, that, getChildrenFunc = function (callback) {
                that = this;
                $timeout(function () {
                    Nodes.children({filter: 'parentworldstate.id:' + Nodes.utils.getRequestIdForNodeKey(that.key)}, callback);
                }, 1000);
            };
            if (!ws) {
                return null;
            }
            hasChilds = ws.childworldstates && ws.childworldstates.length > 0 ? true : false;
            var parent = ws.parentworldstate, nodeKey = [ws.id];
            while (parent && parent.parentworldstate) {
                nodeKey.push(parent.id);
                parent = parent.parentworldstate;
            }
            if (parent) {
                nodeKey.push(parent.id);
            }
            node = {
                key: nodeKey.reverse().join('.'),
                name: ws.name,
                classKey: 42,
                objectKey: ws.$self,
                type: 'objectNode',
                org: '',
                dynamicChildren: '',
                clientSort: false,
                derivePermissionsFromClass: false,
                icon: 'glyphicon glyphicon-globe',
                iconFactory: null,
                policy: 'default',
                leaf: !hasChilds,
                isLeaf: !hasChilds,
                getChildren: getChildrenFunc
            };
            return node;
        };
        transformResults = function (data) {
            var col = JSON.parse(data).$collection, res = [], i, node;
            for (i = 0; i < col.length; ++i) {
                node = transformSingleResult(col[i]);
                res.push(node);
            }
            return res;
        };
        Nodes = $resource(CRISMA_ICMM_API + '/nodes', {
            nodeId: '@id',
            domain: CRISMA_DOMAIN
        }, {
            get: {
                method: 'GET',
                params: {deduplicate: true},
                url: CRISMA_ICMM_API + '/' + CRISMA_DOMAIN + '.worldstates/' + ':nodeId?omitNullValues=false&deduplicate=true',
                transformResponse: function (data) {
                    var ws;
                    if (!data) {
                        return null;
                    }
                    ws = JSON.parse(data);
                    return transformSingleResult(ws);
                }
            },
            query: {
                method: 'GET',
                isArray: true,
                url: CRISMA_ICMM_API + '/' + CRISMA_DOMAIN + '.worldstates?limit=100&offset=0&level=1&filter=parentworldstate%3Anull&omitNullValues=false&deduplicate=true',
                transformResponse: function (data) {
                    return transformResults(data);
                }
            },
            children: {
                method: 'GET',
                isArray: true,
                params: {level: 2},
                url: CRISMA_ICMM_API + '/' + CRISMA_DOMAIN + '.worldstates',
                transformResponse: function (data) {
                    return transformResults(data);
                },
                dynamicChildren: {
                    method: 'POST',
                    url: '',
                    transformResult: function (data) {
                        return transformResults(data);
                    }
                }
            },
            scenarios: {
                method: 'GET',
                isArray: true,
                url: CRISMA_ICMM_API + '/' + CRISMA_DOMAIN + '.worldstates?level=5&filter=childworldstates:\\[\\]&omitNullValues=false&deduplicate=true',
                transformResponse: function (data) {
                    return transformResults(data);
                }
            }
        });
        utils = {
            getRequestIdForWorldstate: function (worldstate) {
                return worldstate.id;
            },
            getRequestIdForNodeKey: function (nodeKey) {
                if (nodeKey.indexOf('.') > -1) {
                    return nodeKey.substring(nodeKey.lastIndexOf('.') + 1, nodeKey.length);
                }
                return nodeKey;
            }
        };
        Nodes.utils = utils;
        return Nodes;
    }
]);
angular.module('de.cismet.crisma.ICMM.Worldstates', ['ngResource']).factory('de.cismet.crisma.ICMM.Worldstates', [
    '$resource',
    'CRISMA_ICMM_API',
    'CRISMA_DOMAIN',
    function ($resource, CRISMA_ICMM_API, CRISMA_DOMAIN) {
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
                        'categories': [{
                                '$self': '/CRISMA.categories/3',
                                'id': 3,
                                'key': 'ICC_DATA',
                                'classification': {
                                    '$self': '/CRISMA.classifications/2',
                                    'id': 2,
                                    'key': 'ICC_DATA'
                                }
                            }],
                        'defaultaccessinfocontenttype': 'application/json',
                        'defaultaccessinfo': null
                    },
                    renderingdescriptor: [
                        {
                            gridWidth: 'col-sm-12',
                            priority: 1,
                            displayHeader: true,
                            sortable: false,
                            fullSize: true,
                            collapsed: false,
                            collapsible: true,
                            bodyDirective: 'icc-data-body',
                            headerDirective: 'icc-data-header',
                            colourClasses: [
                                'panel-purple',
                                'panel-orange',
                                'panel-greenLight',
                                'panel-blue',
                                'panel-redLight'
                            ],
                            mergeId: 'iccIndicatorCriteriaWidget',
                            title: 'Indicator & Criteria'
                        },
                        {
                            gridWidth: 'col-sm-12',
                            priority: 0,
                            displayHeader: true,
                            sortable: false,
                            fullSize: true,
                            collapsed: false,
                            collapsible: true,
                            bodyDirective: 'mini-indicator-body',
                            colourClasses: [
                                'txt-color-blue',
                                'txt-color-purple',
                                'txt-color-greenDark',
                                'txt-color-orange',
                                'txt-color-redLight'
                            ],
                            widgetArea: false
                        }
                    ],
                    'actualaccessinfocontenttype': 'application/json',
                    'actualaccessinfo': '{"casualties":{"displayName":"Casualties","iconResource":"flower_16.png","noOfDead":{"displayName":"Number of dead","iconResource":"flower_dead_16.png","value":"257","unit":"People"},"noOfInjured":{"displayName":"Number of injured","iconResource":"flower_injured_16.png","value":"409","unit":"People"},"noOfHomeless":{"displayName":"Number of homeless","iconResource":"flower_homeless_16.png","value":"129","unit":"People"}},"cost":{"directDamageCost":{"displayName":"Direct damage cost","iconResource":"dollar_direct_16.png","value":"4582048.34","unit":"Dollar"},"displayName":"Economic cost","iconResource":"dollar_16.png","indirectDamageCost":{"displayName":"Indirect damage cost","iconResource":"dollar_indirect_16.png","value":"830923892.47","unit":"Dollar"},"restorationCost":{"displayName":"Direct restoration cost","iconResource":"dollar_restoration_16.png","value":"892930184.91","unit":"Dollar"}},"damagedBuildings":{"displayName":"Damaged buildings","iconResource":"home_16.png","lostBuildings":{"displayName":"Lost buildings","iconResource":"home_lost_16.png","value":"49","unit":"Buildings"},"unsafeBuildings":{"displayName":"Unsafe buildings","iconResource":"home_unsafe_16.png","value":"152","unit":"Buildings"}},"damagedInfrastructure":{"damagedRoadSegments":{"displayName":"Number of damaged road segments","iconResource":"road_damaged_16.png","value":"34","unit":"Roadsegments"},"displayName":"Damaged Infrastructure","iconResource":"road_16.png"},"evacuationCost":{"displayName":"Evacuation cost","iconResource":"money_evac_16.png","totalEvacuationCost":{"displayName":"Total evacuationcost","iconResource":"money_total_evac_16.png","value":"3494023211.23","unit":"Dollar"}}}',
                    'categories': [{
                            '$self': '/CRISMA.categories/2',
                            'id': 2,
                            'key': 'Indicators',
                            'classification': {
                                '$self': '/CRISMA.classifications/2',
                                'id': 2,
                                'key': 'ICC_DATA'
                            }
                        }]
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
                        'categories': [{
                                '$self': '/CRISMA.categories/3',
                                'id': 3,
                                'key': 'ICC_DATA',
                                'classification': {
                                    '$self': '/CRISMA.classifications/2',
                                    'id': 2,
                                    'key': 'ICC_DATA'
                                }
                            }],
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
                            colourClasses: [
                                'panel-purple',
                                'panel-orange',
                                'panel-greenLight',
                                'panel-blue',
                                'panel-redLight'
                            ],
                            mergeId: 'iccIndicatorCriteriaWidget',
                            title: 'Indicator & Criteria'
                        }],
                    'actualaccessinfocontenttype': 'application/json',
                    'actualaccessinfo': '{"casualties":{"displayName":"Casualties","iconResource":"flower_16.png","noOfDead":{"displayName":"Number of dead","iconResource":"flower_dead_16.png","value":"15","unit":"Percent"},"noOfInjured":{"displayName":"Number of injured","iconResource":"flower_injured_16.png","value":"80","unit":"Percent"},"noOfHomeless":{"displayName":"Number of homeless","iconResource":"flower_homeless_16.png","value":"5","unit":"Percent"}},"cost":{"directDamageCost":{"displayName":"Direct damage cost","iconResource":"dollar_direct_16.png","value":"90","unit":"Percent"},"displayName":"Economic cost","iconResource":"dollar_16.png","indirectDamageCost":{"displayName":"Indirect damage cost","iconResource":"dollar_indirect_16.png","value":"50","unit":"Percent"},"restorationCost":{"displayName":"Direct restoration cost","iconResource":"dollar_restoration_16.png","value":"34","unit":"Percent"}},"damagedBuildings":{"displayName":"Damaged buildings","iconResource":"home_16.png","lostBuildings":{"displayName":"Lost buildings","iconResource":"home_lost_16.png","value":"49","unit":"Percent"},"unsafeBuildings":{"displayName":"Unsafe buildings","iconResource":"home_unsafe_16.png","value":"29","unit":"Percent"}},"damagedInfrastructure":{"damagedRoadSegments":{"displayName":"Number of damaged road segments","iconResource":"road_damaged_16.png","value":"34","unit":"Percent"},"displayName":"Damaged Infrastructure","iconResource":"road_16.png"},"evacuationCost":{"displayName":"Evacuation cost","iconResource":"money_evac_16.png","totalEvacuationCost":{"displayName":"Total evacuationcost","iconResource":"money_total_evac_16.png","value":"80","unit":"Percent"}}}',
                    'categories': [{
                            '$self': '/CRISMA.categories/6',
                            'id': 6,
                            'key': 'Criteria',
                            'classification': {
                                '$self': '/CRISMA.classifications/2',
                                'id': 2,
                                'key': 'ICC_DATA'
                            }
                        }]
                }
            ];
            return worldstate;
        }, augmentWorldstateDataWithRenderingDescriptors = function (worldstate) {
            var renderingDescriptorPrototype = {
                gridWidth: 'col-sm-6',
                priority: 1,
                displayHeader: true,
                sortable: true,
                fullSize: true,
                collapsed: false,
                collapsible: true,
                bodyDirective: 'wms-leaflet',
                padding: 'no-padding'
            }, dataslot, i, tempRd;
            if (worldstate.worldstatedata) {
                for (i = 0; i < worldstate.worldstatedata.length; i++) {
                    dataslot = worldstate.worldstatedata[i];
                    tempRd = Object.create(renderingDescriptorPrototype);
                    tempRd.title = dataslot.name;
                    tempRd.priority = i + 2;
                    dataslot.renderingdescriptor = [];
                    dataslot.renderingdescriptor.push(tempRd);
                }
            }
        }, mergeWMSLayer = function (worldstate) {
            var osmMergeId = 'osmHelperLayer';
            var regionMergeId = 'regionHelperLayer';
            var backgroundMergeId = 'backgroundHelperLayer';
            var i, renderingdescriptor, dataslot;
            for (i = 0; i < worldstate.worldstatedata.length; i++) {
                renderingdescriptor = worldstate.worldstatedata[i].renderingdescriptor[0];
                dataslot = worldstate.worldstatedata[i];
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
        }, processResult = function (worldstateData) {
            if (!worldstateData) {
                return null;
            }
            var worldstate = JSON.parse(worldstateData);
            augmentWorldstateWithICCData(worldstate);
            augmentWorldstateDataWithRenderingDescriptors(worldstate);
            mergeWMSLayer(worldstate);
            return worldstate;
        }, processResults = function (worldstates) {
            var worldstatesArr = JSON.parse(worldstates).$collection, i;
            for (i = 0; i < worldstatesArr.length; i++) {
                augmentWorldstateWithICCData(worldstatesArr[i]);
                augmentWorldstateDataWithRenderingDescriptors(worldstatesArr[i]);
            }
            return worldstatesArr;
        }, Worldstate = $resource(CRISMA_ICMM_API + '/' + CRISMA_DOMAIN + '.worldstates/:wsId', {
            wsId: '@id',
            deduplicate: false,
            level: '5',
            omitNullValues: 'false'
        }, {
            'get': {
                method: 'GET',
                transformResponse: processResult
            },
            'query': {
                method: 'GET',
                isArray: true,
                params: {
                    level: '1',
                    omitNullValues: 'true'
                },
                transformResponse: processResults
            }
        }), worldstateUtils = function () {
            var publicApi;
            publicApi = {};
            publicApi.stripIccData = function (worldstates, forCriteria) {
                var data, dataVector, i, iccdata, j, k, worldstate;
                dataVector = [];
                for (i = 0; i < worldstates.length; ++i) {
                    worldstate = worldstates[i];
                    iccdata = worldstate.iccdata;
                    data = null;
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
                    dataVector.push({
                        name: worldstate.name,
                        data: JSON.parse(data.actualaccessinfo)
                    });
                }
                return dataVector;
            };
            return publicApi;
        }();
        Worldstate.utils = worldstateUtils;
        return Worldstate;
    }
]);