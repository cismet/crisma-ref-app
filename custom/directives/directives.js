angular.module(
        'de.cismet.custom.directives'
        ).directive(
        'wmsLeaflet',
        [
            'leafletData',
            function (leafletData) {
                return {
                    restrict: 'E',
                    templateUrl: 'custom/templates/leafletWMS.html',
                    replace: true,
                    link: function (scope, elem, attrs, controller) {


                        var createOverlayLayer = function (dataslot) {
                            var actualAccessInfo = JSON.parse(dataslot.actualaccessinfo);
                            var defaultAcessInfo = JSON.parse(dataslot.datadescriptor.defaultaccessinfo);
                            var wmsBaseUrl = defaultAcessInfo['capabilities'];
                            var zIndex = dataslot.categories[0].key === 'SUPPORTIVE_WMS' ? 0 : 1;
                            wmsBaseUrl = wmsBaseUrl.slice(0, wmsBaseUrl.indexOf('?'));
                            var layer = L.tileLayer.wms(wmsBaseUrl, {
                                format: 'image/png',
                                layers: actualAccessInfo.layername,
                                visible: (actualAccessInfo.visible && actualAccessInfo.visible === true),
                                transparent: true,
                                opacity: 0.75,
                                zIndex: zIndex
                            });

                            return layer;
                        };

                        // adding layers in link, otherwise sorting is broken!
                        // on init angular leaflet layer controls shows layers with visible = true first,
                        // regardless of sorting order! therefore we have to add the layers,
                        // when the map has been constructed
                        if (!scope.layersLoaded) {
                            leafletData.getLayers().then(function (map) {
                                scope.layersLoaded = true;
                                var overlays = {};

                                //console.log('lazy adding layers');
                                // FIXME: don't do that! using the same property for arrays and objects!
                                if (Object.prototype.toString.call(scope.dataslots) === '[object Array]') {
                                    for (var j = 0; j < scope.dataslots.length; j++) {
                                        var dataslotObj = scope.dataslots[j];

                                        // does not work! 
                                        //var overlayLayer =  createOverlayLayer(dataslotObj.dataslot);
                                        //overlayLayer.addTo(map);

                                        if (!overlays[dataslotObj.dataslot.name]) {
                                            //console.log('adding layer(s) ' + dataslotObj.dataslot.name);
                                            overlays[dataslotObj.dataslot.name] =
                                                    controller.createOverlayObject(dataslotObj.dataslot, j);
                                        }

                                    }
                                } else {
                                    var dataslot = scope.dataslots;

                                    // does not work! 
                                    //var overlayLayer = createOverlayLayer(dataslot);
                                    //overlayLayer.addTo(map);

                                    if (!overlays[dataslot.name]) {
                                        //console.log('adding layer ' + dataslot.name);
                                        overlays[dataslot.name] =
                                                controller.createOverlayObject(dataslot, 1);
                                    }
                                }

                                scope.layers.overlays = overlays;
                            });
                        }
                    },
                    controller: function ($scope) {
                        $scope.defaults = {
                            scrollWheelZoom: false
                        };
                        $scope.center = {
                            //coords of L'Aquila 
                            lat: 42.37274928510041,
                            lng: 13.374481201171875,
                            zoom: 10
                        };
                        $scope.layers = {
                            baselayers: {
                                googleRoadmap: {
                                    name: 'Google Streets',
                                    layerType: 'ROADMAP',
                                    type: 'google'
                                },
                                googleHybrid: {
                                    name: 'Google Hybrid',
                                    layerType: 'HYBRID',
                                    type: 'google'
                                },
                                googleTerrain: {
                                    name: 'Google Terrain',
                                    layerType: 'TERRAIN',
                                    type: 'google'
                                }
                            },
                            overlays: {}
                        };

                        this.createOverlayObject = function (dataslot, i) {
                            var actualAccessInfo = JSON.parse(dataslot.actualaccessinfo);
                            var defaultAcessInfo = JSON.parse(dataslot.datadescriptor.defaultaccessinfo);
                            var wmsBaseUrl = defaultAcessInfo['capabilities'];
                            var zIndex = i;
                            wmsBaseUrl = wmsBaseUrl.slice(0, wmsBaseUrl.indexOf('?'));
                            var result = {
                                name: actualAccessInfo.displayName || dataslot.name,
                                type: 'wms',
                                url: wmsBaseUrl,
                                visible: actualAccessInfo.visible && actualAccessInfo.visible === true,
                                zIndex: zIndex,
                                layerParams: {
                                    layers: actualAccessInfo.layername,
                                    format: 'image/png',
                                    transparent: true,
                                    opacity: 0.75,
                                    zIndex: zIndex
                                }
                            };
                            // fake get request to initiate basic authentication
//                            $.ajax({
//                                url: wmsBaseUrl,
//                                method: 'GET',
//                                error: function (jqXHR, textStatus, errorThrown) {
//                                    console.error(errorThrown);
//                                },
//                                success: function () {
//                                }
//
//                            });

                            return result;

                        };

                        // disabled, otherwiese sorting is broken, see link function
                        // FIXME: don't do that! using the same property for arrays and objects!
//                        if (Object.prototype.toString.call($scope.dataslots) === '[object Array]') {
//                            for (var j = 0; j < $scope.dataslots.length; j++) {
//                                var dataslotObj = $scope.dataslots[j];
//                                var overlayLayer = this.createOverlayObject(dataslotObj.dataslot, j);
//                                $scope.layers.overlays[dataslotObj.dataslot.name] = overlayLayer;
//
//                            }
//                        } else {
//                            var dataslot = $scope.dataslots;
//                            $scope.layers.overlays[dataslot.name] = this.createOverlayObject(dataslot, 1);
//                        }
                    }
                }
                ;
            }
        ]
        ).directive(
        'wmsBodyPilotE',
        [
            '$timeout',
            function ($timeout) {
                'use strict';
                return {
                    restrict: 'E',
                    templateUrl: 'custom/templates/wmsBodyPilotE.html',
                    replace: true,
//                scope:{
//                   dataslots:'=',
//                   worldstate:'='
//                },
                    controller: function ($scope) {
                        $scope.map = {
                            control: {},
                            center: {
                                latitude: 42.302748437320205,
                                longitude: 13.45535244941682
                            },
                            zoom: 10
                        };

                        if (Object.prototype.toString.call($scope.dataslots) === '[object Array]') {
                            $scope.dataslot = {};
                            var name = '';
                            for (var i = 0; i < $scope.dataslots.length; i++) {
                                var dataslotObj = $scope.dataslots[i];
                                name = name.concat(dataslotObj.dataslot.name + " / ");
                            }
                            $scope.dataslot.name = name;
                        } else {
                            $scope.dataslot = $scope.dataslots;
                        }

                        var createGMapOverlay = function (dataslotObj, gMap) {
                            return new google.maps.ImageMapType({
                                getTileUrl: function (coord, zoom) {

                                    var s = Math.pow(2, zoom);
                                    var twidth = 256;
                                    var theight = 256;
                                    //latlng bounds of the 4 corners of the google tile
                                    //Note the coord passed in represents the top left hand (NW) corner of the tile.
                                    var gBl = gMap.getProjection().fromPointToLatLng(
                                            new google.maps.Point(coord.x * twidth / s, (coord.y + 1) * theight / s)); // bottom left / SW
                                    var gTr = gMap.getProjection().fromPointToLatLng(
                                            new google.maps.Point((coord.x + 1) * twidth / s, coord.y * theight / s)); // top right / NE

                                    // Bounding box coords for tile in WMS pre-1.3 format (x,y)
                                    var bbox = gBl.lng() + "," + gBl.lat() + "," + gTr.lng() + "," + gTr.lat();
                                    var dataslot = dataslotObj;
                                    var actualAccessInfo = JSON.parse(dataslot.actualaccessinfo);
                                    var defaultAcessInfo = JSON.parse(dataslot.datadescriptor.defaultaccessinfo);
                                    var simplewms_getmap = defaultAcessInfo['simplewms_getmap'];
//                                var url = 'http://crisma.cismet.de/geoserver/crisma/wms?service=WMS&version=1.1.0&request=GetMap&layers='+actualAccessInfo.layername+'&bbox=' + bbox + '&width=256&height=256&srs=EPSG:4326&format=image/png&transparent=true';
                                    var url = simplewms_getmap.replace('<cismap:layers>', actualAccessInfo.layername);
                                    url = url.replace('<cismap:boundingBox>', bbox);
                                    url = url.replace('<cismap:width>', 256);
                                    url = url.replace('<cismap:height>', 256);
                                    url = url.replace('EPSG:3857', 'EPSG:4326');
                                    url = url.replace('EPSG:32633', 'EPSG:4326');
                                    return url; // return URL for the tile
                                },
                                tileSize: new google.maps.Size(256, 256),
                                opacity: 0.8, // setting image TRANSPARENCY 
                                isPng: true
                            });
                        };

                        $timeout(function () {

                            var gMap = $scope.map.control.getGMap();
                            if (Object.prototype.toString.call($scope.dataslots) === '[object Array]') {
                                for (var j = 0; j < $scope.dataslots.length; j++) {
                                    var dataslotObj = $scope.dataslots[j];

                                    gMap.overlayMapTypes.push(createGMapOverlay(dataslotObj.dataslot, gMap));
                                }
                            } else {
                                var SDLLayer = new google.maps.ImageMapType({
                                    getTileUrl: function (coord, zoom) {

                                        var s = Math.pow(2, zoom);
                                        var twidth = 256;
                                        var theight = 256;
                                        //latlng bounds of the 4 corners of the google tile
                                        //Note the coord passed in represents the top left hand (NW) corner of the tile.
                                        var gBl = gMap.getProjection().fromPointToLatLng(
                                                new google.maps.Point(coord.x * twidth / s, (coord.y + 1) * theight / s)); // bottom left / SW
                                        var gTr = gMap.getProjection().fromPointToLatLng(
                                                new google.maps.Point((coord.x + 1) * twidth / s, coord.y * theight / s)); // top right / NE

                                        // Bounding box coords for tile in WMS pre-1.3 format (x,y)
                                        var bbox = gBl.lng() + "," + gBl.lat() + "," + gTr.lng() + "," + gTr.lat();
                                        var dataslot = $scope.dataslot;
                                        var actualAccessInfo = JSON.parse(dataslot.actualaccessinfo);
                                        var defaultAcessInfo = JSON.parse(dataslot.datadescriptor.defaultaccessinfo);
                                        var simplewms_getmap = defaultAcessInfo['simplewms_getmap'];
//                                var url = 'http://crisma.cismet.de/geoserver/crisma/wms?service=WMS&version=1.1.0&request=GetMap&layers='+actualAccessInfo.layername+'&bbox=' + bbox + '&width=256&height=256&srs=EPSG:4326&format=image/png&transparent=true';
                                        var url = simplewms_getmap.replace('<cismap:layers>', actualAccessInfo.layername);
                                        url = url.replace('<cismap:boundingBox>', bbox);
                                        url = url.replace('<cismap:width>', 256);
                                        url = url.replace('<cismap:height>', 256);
                                        url = url.replace('EPSG:3857', 'EPSG:4326');
                                        url = url.replace('EPSG:32633', 'EPSG:4326');
                                        return url; // return URL for the tile
                                    },
                                    tileSize: new google.maps.Size(256, 256),
                                    opacity: 0.8, // setting image TRANSPARENCY 
                                    isPng: true
                                });
                                gMap.overlayMapTypes.push(SDLLayer);
                            }
                        }, 500);
                    }
                };
            }
        ]
        ).directive(
        'wmsHeaderPilotE',
        [
            function () {
                'use strict';
                return {
                    restrict: 'E',
                    templateUrl: 'custom/templates/wmsHeaderPilotE.html',
                    replace: true,
                    require: '^widgetContainer',
//                scope: {
//                    parentCtrl: '='
//                },
                    link: function (scope, elem, attrs, widgetContainerCtrl) {
                        scope.containerCtrl = widgetContainerCtrl;
                    },
                    controller: function ($scope) {
                        $scope.tabs = [
                            {
                                id: 1,
                                name: 'Tab 1',
                                icon: ['fa', 'fa-lg', 'fa-arrow-circle-o-down'],
                                active: true,
                                activeClass: {
                                    active: this.active
                                }
                            }, {
                                id: 2,
                                name: 'Tab 2',
                                icon: ['fa', 'fa-lg', 'fa-arrow-circle-o-up'],
                                active: false,
                            }
                        ];
                        $scope.activeTab = $scope.tabs[0];
                        $scope.parentCtrl.activeTab = $scope.activeTab;
                        $scope.activateTab = function (index) {
                            $scope.activeTab.active = false;
                            $scope.tabs[index].active = true;
                            $scope.activeTab = $scope.tabs[index];
                            $scope.parentCtrl.activeTab = $scope.activeTab;
                        };
                    }
                };
            }
        ]
        ).directive(
        'iccDataHeader',
        [
            function () {
                'use strict';
                return {
                    restrict: 'E',
                    templateUrl: 'custom/templates/iccDataHeader.html',
                    replace: true,
                    scope: {
                        parentCtrl: '='
                    },
                    controller: function ($scope) {
                        var i = 1;

//                    $scope.iccData = JSON.parse($scope.dataslot.actualaccessinfo);
//                    $scope.tabs = [{
//                            id: 1,
//                            name: 'Indicators & Criteria',
//                            active: true,
//                            activeClass: {
//                                active: this.active
//                            }
//                        }, {
//                            id: 2,
//                            name: 'Economic Impact',
//                            active: false,
//                            activeClass: {
//                                active: this.active
//                            }
//                        }];
//
//                    $scope.activeTab = $scope.tabs[0];
//                    $scope.parentCtrl.activeTab = $scope.activeTab;
//                    $scope.activateTab = function (index) {
//                        $scope.activeTab.active = false;
//                        $scope.tabs[index].active = true;
//                        $scope.activeTab = $scope.tabs[index];
//                        $scope.parentCtrl.activeTab = $scope.activeTab;
//                    };
                    }
                };
            }
        ]
        ).directive(
        'iccDataBody',
        [
            'IconService',
            'SelectedCriteriaFunction',
            'de.cismet.crisma.ICMM.Worldstates',
            function (IconService, SelectedCriteriaFunction, Worldstates) {
                'use strict';
                return {
                    restrict: 'E',
                    templateUrl: 'custom/templates/iccDataBody.html',
                    replace: true,
                    controller: function ($scope) {
                        var page, i, j, indicatorGroup, critFuncSet, critFun, item,
                                indicatorItem, pageCount, group;
                        //we need to split the indicators into groups of 3 items.
                        $scope.IconService = IconService;
                        $scope.SelectedCriteriaFunction = SelectedCriteriaFunction;

                        $scope.$watch('SelectedCriteriaFunction.selectedCriteriaFunction', function (newVal, oldVal) {
                            var i, j, critFuncSet, critFun, indicator, indicatorGroup, indicatorGroups;
                            if (newVal !== oldVal && SelectedCriteriaFunction.selectedCriteriaFunction) {
                                //we need to update the criteriaFunction binding in the groups..
                                indicatorGroups = [];
                                $scope.pagedIccGroups.forEach(function (group) {
                                    indicatorGroups = indicatorGroups.concat(group);
                                });
                                critFuncSet = SelectedCriteriaFunction.selectedCriteriaFunction.criteriaFunctions;
                                if (critFuncSet) {
                                    for (i = 0; i < indicatorGroups.length; i++) {
                                        indicatorGroup = indicatorGroups[i];
                                        for (j = 0; j < indicatorGroup.items.length; j++) {
                                            indicator = indicatorGroup.items[j];

                                            critFuncSet.forEach(function (cf) {
                                                if (cf.indicator === indicator.displayName) {
                                                    critFun = cf;
                                                }
                                            });
                                            indicator.criteriaFunction = critFun;
                                        }
                                    }
                                }
                            }
                        }, true);
                        
                        

                        $scope.getPanelColour = function (pageIndex, index) {
                            //console.log('pageIndex:'+pageIndex+', index:'+index+', color index:'+ ((2 * pageIndex) + index));
                            return $scope.renderingDescriptor.colourClasses[(2 * pageIndex) + index];
                        };

                        $scope.indicators = Worldstates.utils.stripIccData([$scope.dataslot[0].worldstate])[0].data;


                        $scope.pagedIccGroups = [];
                        page = [];
                        pageCount = 0;
                        for (i = 0; i < Object.keys($scope.indicators).length; i++) {
                            indicatorGroup = $scope.indicators[Object.keys($scope.indicators)[i]];

                            group = {
                                displayName: indicatorGroup.displayName,
                                iconResource: indicatorGroup.iconResource,
                                avgItems: {},
                                items: []
                            };

                            for (j = 0; j < Object.keys(indicatorGroup).length; j++) {
                                var property;
                                property = Object.keys(indicatorGroup)[j];
                                if (property !== 'displayName' && property !== 'iconResource') {
                                    indicatorItem = indicatorGroup[property];
                                    item = {
                                        iconResource: indicatorItem.iconResource,
                                        indicator: indicatorItem.value,
                                        indicatorUnit: indicatorItem.unit,
                                    };

                                    if (indicatorItem.displayName.indexOf('(Avg)') !== -1) {
                                        item.displayName = indicatorItem.displayName.substring(0, indicatorItem.displayName.indexOf('(Avg)'));
                                        if (!group.avgItems[item.displayName]) {
                                            group.avgItems[item.displayName] = {};
                                        }
                                        group.avgItems[item.displayName].avg = item;
                                    } else if (indicatorItem.displayName.indexOf('(Min)') !== -1) {
                                        item.displayName = indicatorItem.displayName.substring(0, indicatorItem.displayName.indexOf('(Min)'));
                                        if (!group.avgItems[item.displayName]) {
                                            group.avgItems[item.displayName] = {};
                                        }
                                        group.avgItems[item.displayName].min = item;
                                    } else if (indicatorItem.displayName.indexOf('(Max)') !== -1) {
                                        item.displayName = indicatorItem.displayName.substring(0, indicatorItem.displayName.indexOf('(Max)'));
                                        if (!group.avgItems[item.displayName]) {
                                            group.avgItems[item.displayName] = {};
                                        }
                                        group.avgItems[item.displayName].max = item;
                                    } else {
                                        item.displayName = indicatorItem.displayName;
                                        group.items.push(item);
                                    }

                                    if (SelectedCriteriaFunction.selectedCriteriaFunction) {
                                        critFuncSet = SelectedCriteriaFunction.selectedCriteriaFunction.criteriaFunctions;
                                        if (critFuncSet && critFuncSet.length > 0) {
                                            critFuncSet.forEach(function (cf) {
                                                if (cf.indicator === indicatorItem.displayName) {
                                                    critFun = cf;
                                                }
                                            });
                                            item.criteriaFunction = critFun;
                                        }
                                    }
                                }
                            }

                            // create a new group for AVG-MIN-MAX Indicators!
                            // FIXME: HACK!
                            if (indicatorGroup.displayName === 'Casualties' ||
                                    indicatorGroup.displayName === 'Economic cost' ||
                                    indicatorGroup.displayName === 'Damaged buildings')
                            {
                                group.averages = true;
                                // place average indicator groups on top
                                $scope.pagedIccGroups.unshift([group]);
                            } else {
                                pageCount++;
                                page.push(group);
                                if (pageCount > 0 && pageCount % 2 === 0) {
                                    $scope.pagedIccGroups.push(page);
                                    pageCount = 0;
                                    page = [];
                                }
                            }  
                        }

                        $scope.size = 50;
                        $scope.percent = 90; 
                    }
                };
            }
        ]
        ).directive(
        'miniIndicatorBody',
        [
            'IconService',
            'WorkspaceService',
            'de.cismet.collidingNameService.Nodes',
            'de.cismet.crisma.ICMM.Worldstates',
            '$modal',
            '$rootScope',
            function (IconService, WorkspaceService, Nodes, Worldstates, $modal, $rootScope) {
                'use strict';
                return {
                    restrict: 'E',
                    templateUrl: 'custom/templates/miniIndicatorVis.html',
                    replace: true,
                    controller: function ($scope) {
                        $scope.IconService = IconService;
                        $scope.indicators = Worldstates.utils.stripIccData([$scope.worldstate])[0].data;
                        $scope.importantIndicators = [];

                        $scope.getColor = function (index) {
                            return $scope.renderingDescriptor.colourClasses[index];
                        };
                        for (var i = 0; i < Object.keys($scope.indicators).length; i++) {
                            var indicatorGroup = $scope.indicators[Object.keys($scope.indicators)[i]];
                            for (var j = 0; j < Object.keys(indicatorGroup).length; j++) {
                                var indicatorItem = indicatorGroup[Object.keys(indicatorGroup)[j]];
                                if (indicatorItem.displayName === 'Number of injured') {
                                    $scope.importantIndicators.push(indicatorItem);
                                } else if (indicatorItem.displayName === 'Lost buildings') {
                                    $scope.importantIndicators.push(indicatorItem);
                                } else if (indicatorItem.displayName === 'Total evacuationcost') {
                                    $scope.importantIndicators.push(indicatorItem);
                                }
                            }
                        }

                        $scope.addToWorkspace = function () {
                            //FIXME We need a clever way for determining the node of a worldstate
                            var nodeId = [$scope.worldstate.id], ws = $scope.worldstate;
                            while (ws.parentworldstate) {
                                nodeId.push(ws.parentworldstate.id);
                                ws = ws.parentworldstate;
                            }
                            var nodeKey = nodeId.reverse().join('.');
                            Nodes.get({nodeId: nodeKey}, function (node) {
                                WorkspaceService.addWorldstate(node);
                            });
                        };

                        $scope.removeFromWorkspace = function () {
                            var nodeId = [$scope.worldstate.id], ws = $scope.worldstate;
                            while (ws.parentworldstate) {
                                nodeId.push(ws.parentworldstate.id);
                                ws = ws.parentworldstate;
                            }
                            var nodeKey = nodeId.reverse().join('.');
                            Nodes.get({nodeId: nodeKey}, function (node) {
                                WorkspaceService.removeWS(node);
                            });
                        };

                        $scope.simEq = function () {
                            var modalInstance, scope;

                            scope = $rootScope.$new(true);
                            scope.worldstate = $scope.worldstate;
                            scope.params = {};

                            modalInstance = $modal({
                                template: 'custom/templates/simEqModal.html',
                                scope: scope,
                                show: true,
                                backdrop: 'static'
                            });

                            scope.$watch('params', function (n) {
                                if (n && n.run) {
                                    console.log('TODO: run eq sim');
                                }
                            }, true);
                        };

                        $scope.buildingResistance = function () {
                            var modalInstance, scope;

                            scope = $rootScope.$new(true);
                            scope.worldstate = $scope.worldstate;
                            scope.params = {};

                            modalInstance = $modal({
                                template: 'custom/templates/buildingMitigationModal.html',
                                scope: scope,
                                show: true,
                                backdrop: 'static'
                            });

                            scope.$watch('params', function (n) {
                                if (n && n.run) {
                                    console.log('TODO: run building mitigation');
                                }
                            }, true);
                        };

                        $scope.peopleEvacuation = function () {
                            var modalInstance, scope;

                            scope = $rootScope.$new(true);
                            scope.worldstate = $scope.worldstate;
                            scope.params = {};

                            modalInstance = $modal({
                                template: 'custom/templates/populationEvacMitigationModal.html',
                                scope: scope,
                                show: true,
                                backdrop: 'static'
                            });

                            scope.$watch('params', function (n) {
                                if (n && n.run) {
                                    console.log('TODO: run population mitigation');
                                }
                            }, true);
                        };
                    }
                };
            }
        ]
        ).directive(
        'pieChart',
        [
            function () {
                'use strict';
                return {
                    restrict: 'A',
                    scope: {
                        data: '='
                    },
                    link: function (scope, elem) {
                        $.plot(elem, scope.data, {
                            series: {
                                pie: {
                                    show: true,
//                                innerRadius: 0.5,
                                    radius: 1,
                                    label: {
                                        show: true,
                                        radius: 2 / 3,
                                        formatter: function (label, series) {
                                            return '<div style="font-size:11px;text-align:center;padding:4px;color:#000;">' + label + '</div>';
                                        },
                                        threshold: 0.1
                                    }
                                }
                            },
                            legend: {
                                show: false,
                                noColumns: 1, // number of colums in legend table
                                labelFormatter: null, // fn: string -> string
                                labelBoxBorderColor: "#000", // border color for the little label boxes
                                container: null, // container (as jQuery object) to put legend in, null means default on top of graph
                                position: "ne", // position of default legend container within plot
                                margin: [5, 10], // distance from grid edge to default legend container within plot
                                backgroundColor: "#efefef", // null means auto-detect
                                backgroundOpacity: 1 // set to 0 to avoid background
                            },
                            grid: {
                                hoverable: true,
                                clickable: true
                            }
                        });

                        scope.$watchCollection('data', function (newVal, oldVal) {
                            if (newVal !== oldVal) {
                                elem.unbind();
                                $.plot(elem, scope.data, {
                                    series: {
                                        pie: {
                                            show: true,
//                                innerRadius: 0.5,
                                            radius: 1,
                                            label: {
                                                show: true,
                                                radius: 2 / 3,
                                                formatter: function (label, series) {
                                                    return '<div style="font-size:11px;text-align:center;padding:4px;color:white;">' + label + '<br/>' + Math.round(series.percent) + '%</div>';
                                                },
                                                threshold: 0.1
                                            }
                                        }
                                    },
                                    legend: {
                                        show: false,
                                        noColumns: 1, // number of colums in legend table
                                        labelFormatter: null, // fn: string -> string
                                        labelBoxBorderColor: "#000", // border color for the little label boxes
                                        container: null, // container (as jQuery object) to put legend in, null means default on top of graph
                                        position: "ne", // position of default legend container within plot
                                        margin: [5, 10], // distance from grid edge to default legend container within plot
                                        backgroundColor: "#efefef", // null means auto-detect
                                        backgroundOpacity: 1 // set to 0 to avoid background
                                    },
                                    grid: {
                                        hoverable: true,
                                        clickable: true
                                    }
                                });
                            }
                        });

                    }
                };
            }
        ]
        ).directive(
        'criteriaeasypie',
        [
            'eu.crismaproject.worldstateAnalysis.services.CriteriaCalculationService',
            function (CriteriaCalculationService) {
                'use strict';
                return {
                    restrict: 'E',
                    templateUrl: 'custom/templates/criteriaEasyPie.html',
                    replace: 'true',
                    scope: {
                        indicator: '=',
                        criteriaFunction: '=',
                        size: '='
                    },
                    controller: function ($scope) {
                        var barColor, updateCriteria;
                        updateCriteria = function () {
                            if (!$scope.criteriaFunction || !$scope.indicator) {
                                $scope.percent = 0;
                                return;
                            }
                            $scope.percent = CriteriaCalculationService.calculateCriteria($scope.indicator, $scope.criteriaFunction);
                            $scope.percent = Math.round($scope.percent * 10) / 10;
                        };
                        $scope.opts = {
                            barColor: function (percent) {
                                return CriteriaCalculationService.getColorForCriteria(percent, $scope.criteriaFunction);
                            },
                            trackColor: '#f2f2f2',
                            scaleColor: false,
                            lineCap: 'butt',
                            lineWidth: parseInt($scope.size / 8.5),
                            lineHeight: $scope.size,
                            animate: 1500,
                            rotate: -90,
                            size: $scope.size,
                        };
                        updateCriteria();
                        $scope.styleClasses = ['easy-pie-chart'];
                        $scope.styleClasses.push('easyPieChart');

                        $scope.$watch('indicator', function () {
                            updateCriteria();
                        });

                        $scope.$watch('criteriaFunction', function () {
                            updateCriteria();
                        }, true);
                    }
                };
            }
        ]
        ).filter(
        'strip',
        [
            function () {
                return function (text, textToStrip) {

                    if (typeof (text) === 'string') {
                        return text.replace(textToStrip, '');
                    } else {
                        return text;
                    }
                };
            }
        ]);