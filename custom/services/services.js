angular.module(
    'de.cismet.custom.services'
).factory('WPSService', 
    [
        '$http',
        function ($http) {
            var eqWps;
            
            eqWps = {
                run: function(params) {
                    
                    var cdata, f, feature, prop, xml;
                    
                    cdata = {
                        "type": "FeatureCollection",
                        "features": []
                    };
                    
                    feature = {
                      "type": "Feature",
                      "properties": {
                        "useShakemap": false,
                        "ShakeMapName": '',
                        "Latitude": 0,
                        "Longitude": 0,
                        "Magnitude": 0,
                        "Depth": 0
                      },
                      "geometry": {
                        "type": "Point",
                        "coordinates": []
                      }
                    }
                    
                    xml = '<wps:Execute version="1.0.0" service="WPS" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.opengis.net/wps/1.0.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:wcs="http://www.opengis.net/wcs/1.1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd"> <ows:Identifier>gs:TDVModel</ows:Identifier> <wps:DataInputs> <wps:Input> <ows:Identifier>noOfEvents</ows:Identifier> <wps:Data> <wps:LiteralData><noOfEvents></wps:LiteralData> </wps:Data> </wps:Input> <wps:Input> <ows:Identifier>eqTDVParList</ows:Identifier> <wps:Data> <wps:ComplexData mimeType="application/json"><![CDATA[<cdata>]]></wps:ComplexData> </wps:Data> </wps:Input> <wps:Input> <ows:Identifier>wsID</ows:Identifier> <wps:Data> <wps:LiteralData><wsId></wps:LiteralData> </wps:Data> </wps:Input> </wps:DataInputs> <wps:ResponseForm> <wps:ResponseDocument storeExecuteResponse="true"> <wps:Output asReference="true"> <ows:Identifier>string</ows:Identifier> </wps:Output> </wps:ResponseDocument> </wps:ResponseForm></wps:Execute>'
                    
                    for(prop in params) {
                        if(params.hasOwnProperty(prop) && prop.indexOf('eq') === 0 && params[prop] !== undefined) {
                            f = angular.copy(feature);
                            f.properties.useShakemap = params[prop].useShakemap;
                            f.properties.ShakeMapName = params[prop].shakemapName;
                            f.properties.Latitude = params[prop].latitude;
                            f.properties.Longitude = params[prop].longitude;
                            f.properties.Magnitude = params[prop].magnitude;
                            f.properties.Depth = params[prop].depth;
                            f.geometry.coordinates[0] = params[prop].latitude;
                            f.geometry.coordinates[1] = params[prop].longitude;
                            cdata.features.push(f);
                        }
                    }
                    
                    xml = xml.replace('<wsId>', params.wsId).replace('<noOfEvents>', params.tdvRounds).replace('<cdata>', JSON.stringify(cdata));
                    
                    console.log(xml);
                    
                    $http.post('http://wps.plinivs.it:8080/geoserver/wps', xml, {
                        headers: {
                            'Content-Type': 'xml',
                            'Authorization': 'Basic YWRtaW46bV9Mb2E1aEp6OFZi'
                        }
                    }).success(function(data, status, headers, config) {
                        console.log('success:' + status);
                        console.log(data);
                    }).error(function(data, status, headers, config) {
                        console.log('error:' + status);
                        console.log(data);
                    });
                }
            };
            
            return {
                getEqWPS: function () { return eqWps;}
            };
        }
    ]
).factory('IconService', [function () {
        'use strict';
        var public_api = {};

        public_api.getStyleClassForIconResource = function (iconResource) {
            var styleClass;

            switch (iconResource) {
                //casualties
                case 'flower_16.png':
                    styleClass = 'fa-user';
                    break;
                    //cost
                case 'dollar_16.png':
                    styleClass = 'fa-dollar';
                    break;
                    //damaged buildings
                case 'home_16.png':
                    styleClass = 'fa-home';
                    break;
                    //damaged infrastructure
                case 'road_16.png':
                    styleClass = 'fa-road';
                    break;
                    //total evacuation cost
                case 'money_evac_16.png':
                    styleClass = 'fa-dollar';
                    break;
                case 'flower_injured_16.png':
                    styleClass = 'fa-wheelchair';
                    break;
                case 'home_lost_16.png':
                    styleClass = 'fa-building';
                    break;
                case 'money_total_evac_16.png':
                    styleClass = 'fa-dollar';
                    break;

            }

            return styleClass;
        };

        return public_api;
    }]).factory('SelectedCriteriaFunction',
    [
        'localStorageService',
        function (localStorageService) {
            'use strict';
            var criteriaFunctions, selectedCriteriaFunction, persist;
            criteriaFunctions = localStorageService.get('criteriaFunctionSet') || [];
            selectedCriteriaFunction = criteriaFunctions[0] ;

            persist = function () {
                localStorageService.add('criteriaFunctionSet', criteriaFunctions);
            };

            var public_api = {
                selectedCriteriaFunction: selectedCriteriaFunction,
                criteriaFunctionSets: criteriaFunctions,
                persist: persist
            };
            return public_api;
        }]).factory('SelectedDecisionStrategy',
    [
        'localStorageService',
        function (localStorageService) {
            'use strict';
            var decisionStrategies, selectedDecisionStrategy, persist;
            decisionStrategies = localStorageService.get('decisionStrategies') || [];
            selectedDecisionStrategy = decisionStrategies[0];

            persist = function () {
                localStorageService.add('decisionStrategies', decisionStrategies);
            };

            var public_api = {
                selectedDecisionStrategy: selectedDecisionStrategy,
                decisionStrategies: decisionStrategies,
                persist: persist
            };
            return public_api;
        }]);