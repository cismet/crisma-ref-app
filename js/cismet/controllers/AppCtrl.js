angular.module(
    'de.cismet.smartAdmin.controllers',
    [
        'de.cismet.smartAdmin.services',
        'de.cismet.crisma.ICMM.Worldstates',
        'de.cismet.crisma.ICMM.services'
    ]
).controller('AppCtrl',
    [
        '$scope',
        'LayoutService',
        'MenuService',
        'ShortCutService',
        'WorkspaceService',
        'SelectedCriteriaFunction',
        'SelectedDecisionStrategy',
        'de.cismet.smartAdmin.services.simulation',
        function ($scope, LayoutService, MenuService, ShortCutService, WorkspaceService, SelectedCriteriaFunction, SelectedDecisionStrategy, simulationService) {
            'use strict';
            
            $scope.simulationService = simulationService;
            
            $scope.scenarioNode = {
                name: 'Scenarios',
                icon: 'fa-globe',
//              This is needed to show the collapse symbole on the right
                children: [{}],
                directive: '<cids-node-list-widget selected-worldstate="selectedItem"/>'
            };

            $scope.workspaceNode = {
                name: 'Workspace',
                icon: 'fa-home',
                link: '/workspace',
                badge: function () {
                    return $scope.workspaceService.worldstates.length;
                }
            };
            
            $scope.simulationsNode = {
                name: 'Simulations',
                icon: 'fa-cogs',
                link: '/simulations',
                badge: function () {
                    return $scope.simulationService.runningSimulations.length;
                }
            };
            
            $scope.workspaceService = WorkspaceService;
            $scope.LayoutService = LayoutService;
            $scope.MenuService = MenuService;
            $scope.MenuService.menuItems = [{
                    name: 'Decision Support',
                    icon: 'fa-bar-chart-o',
//                    link: '/decisionSupport',
                    children: [
                        {
                            name: 'Decision Strategies',
                            icon: 'fa-circle-o-notch',
                            link: '/decisionSupport/decisionStrategies'
                        },{
                            name: 'Criteria Functions',
                            icon: 'fa-tasks',
                            link: '/decisionSupport/criteriaFunctions'
                        },
                        {
                            name: 'Analysis',
                            icon: 'fa-bar-chart-o',
                            link: '/decisionSupport/analysis'
                        },
                    ]
                }, {
                    name: 'Worldstate Tree Widget',
                    icon: 'fa-sitemap',
                    link: '/worldstateTreeWidget'
                },
//                {
//                    name: 'Worldstate Information',
//                    icon: 'fa-home',
//                    link: '/worldstateInformation',
//                },
                $scope.scenarioNode,
                $scope.workspaceNode,
                $scope.simulationsNode
            ];

            //we need to fetch all Scenario Worldstates and after that 
            //we need to fetch the respective 
//            Nodes.scenarios(function (data) {
//                $scope.scenarioNode.children = data;
//            });

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
                    $scope.workspaceNode.children = $scope.workspaceService.worldstates;
//                    for(var i=0;i< $scope.workspaceNode.children.length;i++){
//                        $scope.workspaceNode.children[i].link='/workspace';
//                    }
                }
            });
            
            $scope.$watchCollection('simulationService.runningSimulations', function (newVal, oldVal) {
                if (newVal !== oldVal) {
                    $scope.simulationsNode.children = $scope.simulationService.runningSimulations;
                    $scope.simulationsNode.children.forEach(function(v) {
                        v.link = 'simulations/' + v.id;
                    });
                }
            });

            $scope.showShortCut = function () {
                ShortCutService.isVisible = true;
            };


            $scope.SelectedCriteriaFunction = SelectedCriteriaFunction;
            $scope.updateSelectedCriteriaFunction = function (index) {
                SelectedCriteriaFunction.selectedCriteriaFunction = SelectedCriteriaFunction.criteriaFunctionSets[index];
            };
            $scope.SelectedDecisionStrategy= SelectedDecisionStrategy;
            $scope.updateSelectedDecisionStrategy = function (index) {
                SelectedDecisionStrategy.selectedDecisionStrategy = SelectedDecisionStrategy.decisionStrategies[index];
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
