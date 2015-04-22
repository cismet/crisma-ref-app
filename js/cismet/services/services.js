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
                    bodyDirective: null,
                    padding: 'no-padding'
                }, dataslot, i, tempRd;
                if (worldstate.worldstatedata) {
                    for (i = 0; i < worldstate.worldstatedata.length; i++) {
                        dataslot = worldstate.worldstatedata[i];
                        dataslot.renderingdescriptor = [];
                        if(dataslot && dataslot.categories && dataslot.categories.length > 0 &&
                                dataslot.datadescriptor && dataslot.datadescriptor.categories && 
                                dataslot.datadescriptor.categories.length > 0) {
                            
                            // FIXME: move to custom service!
                            var category = dataslot.categories[0].key;
                            var title, priority;
                            switch(category) {
                                    case 'INTENSITY_GRID':
                                        title = 'Intensity Grid';
                                        priority = 101;
                                        break;
                                    case 'BUILDING_DAMAGE_MIN':
                                    case 'BUILDING_DAMAGE_MAX':
                                    case 'BUILDING_DAMAGE_AVG':
                                        title = 'Building Damage';
                                        priority = 102;
                                        break;
                                    case 'BUILDING_INVENTORY':
                                        title = 'Building Inventory';
                                        priority = 103;
                                        break;
                                    case 'PEOPLE_DISTRIBUTION':
                                        title = 'People Distribution';
                                        priority = 104;
                                        break;
                                    case 'PEOPLE_IMPACT_MIN':
                                    case 'PEOPLE_IMPACT_MAX':
                                    case 'PEOPLE_IMPACT_AVG':
                                        title = 'People Impact';
                                        priority = 105;
                                        break;    
                                    case 'SHAKEMAP':
                                        title = 'Shakemaps';
                                        priority = 106;
                                        break;
                                    default:
                                        title = category;
                                        priority = i + 2;
                            }
                            
                            // select the proper renderer for the dataslot
                            if(dataslot.datadescriptor.categories[0].key === ('WMS_CAPABILITIES')) {
                                // don't add a redering description for supportive WMS
                                // -> dont't show them in worldstate view 
                                // re-nabled because of rditms/dataslot/arrays mess
                                //if(dataslot.categories[0].key !== 'SUPPORTIVE_WMS') {
                                    tempRd = Object.create(renderingDescriptorPrototype);
                                    tempRd.title = title;
                                    tempRd.bodyDirective = 'wms-leaflet';
                                    tempRd.priority = i + 2;
                                    dataslot.renderingdescriptor.push(tempRd);
                                //}
                                
                            } else {
                                // TODO: define other rendering descriptors
                                console.warn('Dataslot Type "'+dataslot.categories[0].key+'" is currently not supported')
                            }
                        } else {
                            console.error('invalid dataslot "'+dataslot.name+'"!');
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
                            'panel-redLight',
                            'panel-blue',
                            'panel-greenLight'
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
                            'txt-color-redLight',
                            'txt-color-orange',
                            'txt-color-greenDark'
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
            /**
             * Merge Layers
             * 
             * @param {type} worldstate
             * @returns {unresolved}
             */
            serviceObj.mergeWMSLayer = function (worldstate) {
                var i, renderingdescriptor, dataslot;
                if (worldstate.worldstatedata) {

                    for (i = 0; i < worldstate.worldstatedata.length; i++) {
                        if(worldstate.worldstatedata[i].renderingdescriptor &&
                                worldstate.worldstatedata[i].renderingdescriptor.length > 0)
                        {
                            renderingdescriptor = worldstate.worldstatedata[i].renderingdescriptor[0];
                            dataslot = worldstate.worldstatedata[i];
                            switch (dataslot.categories[0].key) {
                                case 'SHAKEMAP':
                                    renderingdescriptor.mergeId = 'SHAKEMAP';
                                    renderingdescriptor.priority = 20;
                                    break;  
                                case 'PEOPLE_IMPACT_MIN':
                                case 'PEOPLE_IMPACT_MAX':
                                case 'PEOPLE_IMPACT_AVG':
                                    renderingdescriptor.mergeId = 'PEOPLE_IMPACT';
                                    renderingdescriptor.priority = 30;
                                    break;
                                case 'BUILDING_DAMAGE_MIN':
                                case 'BUILDING_DAMAGE_MAX':
                                case 'BUILDING_DAMAGE_AVG':
                                    renderingdescriptor.mergeId = 'BUILDING_DAMAGE';
                                    renderingdescriptor.priority = 30;
                                    break;
                                case 'SUPPORTIVE_WMS':
                                    renderingdescriptor.mergeId = 'SUPPORTIVE_WMS';
                                    renderingdescriptor.priority = 100;
                                    break;
                            }
                        }
                    }
                }
                return worldstate;
            };

            return serviceObj;
        }
    ]
    );

