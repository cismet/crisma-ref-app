angular.module(
    'de.cismet.smartAdmin.controllers',
    [
        'de.cismet.smartAdmin.services'
    ]
    ).controller('AppCtrl',
    [
        '$scope',
        'LayoutService',
        'MenuService',
        '$q',
        '$timeout',
        'Nodes',
        'de.cismet.crisma.widgets.scenarioListWidget.services.ScenarioWorldstatesService',
        'ShortCutService',
        'WorkspaceService',
        '$location',
        'Worldstates',
        function ($scope, LayoutService, MenuService, $q, $timeout, Nodes, ScenarioWorldstatesService, ShortCutService, WorkspaceService, $location, Worldstates) {
            'use strict';
            $scope.scenarioNode = {
                name: 'Scenarios',
                icon: 'fa-globe'
            };

            $scope.workspaceNode = {
                name: 'Workspace',
                icon: 'fa-home',
                badge: function () {
                    return $scope.workspaceService.worldstates.length;
                }
            };
            $scope.workspaceService = WorkspaceService;
            $scope.LayoutService = LayoutService;
            $scope.MenuService = MenuService;
            $scope.MenuService.menuItems = [{
                    name: 'Worldstate Tree Widget',
                    icon: 'fa-sitemap',
                    link: '/worldstateTreeWidget'
                }, {
                    name: 'Worldstate Information',
                    icon: 'fa-home',
                    link: '/worldstateInformation',
                }, {
                    name: 'Decision Support',
                    icon: 'fa-bar-chart-o',
                    link: '/decisionSupport'
                },
                $scope.scenarioNode,
                $scope.workspaceNode
            ];

            //we need to fetch all Scenario Worldstates and after that 
            //we need to fetch the respective 
            Nodes.scenarios(function (data) {
                $scope.scenarioNode.children = data;
            });

            $scope.worldstateNode = {
                name: 'Worldsates',
                icon: 'fa-globe'
            };

            $scope.MenuService = MenuService;
            $scope.MenuService.activeItem;
            
            
            // If the Worldstates in the Workspace has changed we need to update
            // the Workspace menu....
            $scope.$watchCollection('workspaceService.worldstates', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    $scope.workspaceNode.children=$scope.workspaceService.worldstates;
                    for(var i=0;i< $scope.workspaceNode.children.length;i++){
                        $scope.workspaceNode.children[i].link='/workspace';
                    }
                }
            });

            $scope.showShortCut = function () {
                ShortCutService.isVisible = true;
            };
            //FIXME: Need to be removed
            // Note: You will also need to change this variable in the "variable.less" file.
            $.navbar_height = 49;

            /*
             * APP DOM REFERENCES
             * Description: Obj DOM reference, please try to avoid changing these
             */

            $.enableJarvisWidgets = true;

            // Warning: Enabling mobile widgets could potentially crash your webApp if you have too many 
            // 			widgets running at once (must have $.enableJarvisWidgets = true)
            $.enableMobileWidgets = false;

        }
    ]);
