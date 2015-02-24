angular.module('de.cismet.smartAdmin.services'
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
    'Utils',
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

            serviceObj.augmentWorldstateDataWithRenderingDescriptors = function (worldstate) {
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
                        if(dataslot){
                            tempRd = Object.create(renderingDescriptorPrototype);
                            tempRd.title = dataslot.name;
                            tempRd.priority = i + 2;
                            dataslot.renderingdescriptor = [];
                            dataslot.renderingdescriptor.push(tempRd);
                        }
                    }
                }
                return worldstate;
            };
            
            serviceObj.augmentIccDataWithRenderingDescriptors = function (worldstate) {
                var rd;
                rd = [
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
                ];
                
                if(worldstate && worldstate.iccdata){
                    var i, iccItem;
                    for(i=0;i<worldstate.iccdata.length;i++){
                        iccItem =worldstate.iccdata[i];
                        if(iccItem){
                            iccItem.renderingdescriptor = Object.create(rd);
                        }
                    }
                }
                
                return worldstate;
            };
            serviceObj.mergeWMSLayer = function (worldstate) {
                var osmMergeId = 'osmHelperLayer';
                var regionMergeId = 'regionHelperLayer';
                var backgroundMergeId = 'backgroundHelperLayer';
                var i, renderingdescriptor, dataslot;
                if (worldstate.worldstatedata) {

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
                }
                return worldstate;
            };

            return serviceObj;
        }
    ]
    );

