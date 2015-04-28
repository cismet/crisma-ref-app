//angular.module('tpltest', []).run(['$templateCache', function($templateCache) {
//    $templateCache.put('partials/worldstateSelector.html', 
//'<div>'
//    + '<select id="worldstate-selection-widget" multiple="true" size="10" data-ng-model="selectedWorldstates" '
//             +'data-ng-options="ws.name for ws in worldstates" >'
//    +'</select>'
//+'</div>'
//)    
//}]);
// this only combines all the modules in a single one 
angular.module('de.cismet.cids.widgets.nodeListWidget', [
  'de.cismet.cids.widgets.nodeListWidget.directives',
  'de.cismet.cids.widgets.nodeListWidget.controllers',
  'de.cismet.cids.rest.collidngNames.Nodes'
]);
angular.module('de.cismet.cids.widgets.nodeListWidget.controllers', []).controller('de.cismet.cids.widgets.nodeListWidget.controllers.NodeListDirectiveController', [
  '$scope',
  'de.cismet.collidingNameService.Nodes',
  function ($scope, Nodes) {
    'use strict';
        
      Nodes.scenarios(function (data) {
        $scope.scenarioNodes = data;
      });
            
    $scope.$on('worldstatesChanged', function() {
        console.log('ws changed in list')
        Nodes.scenarios(function (data) {
          $scope.scenarioNodes = data;
        });
    });
    
    $scope.activateItem = function (index) {
      $scope.selectedIndex = index;
      $scope.selectedWorldstate = $scope.scenarioNodes[index];
    };
    /*
             * Using the object key to compare nodes is a workaround of the limitation that the 
             * entity based node api currently does not correctly determine the key of node. 
             * Comparing nodes on the object key here means in the worst case that multiple 
             * Nodes are shown as selected.
             * This needs to be changed as soon as the limitation of the entity based nodes api is solved
             */
    $scope.isActive = function (index) {
      if ($scope.selectedWorldstate && $scope.scenarioNodes[index].objectKey === $scope.selectedWorldstate.objectKey) {
        return 'active';
      }
      return '';
    };
  }
]);
angular.module('de.cismet.cids.widgets.nodeListWidget.directives', []).directive('cidsNodeListWidget', function () {
  'use strict';
  return {
    scope: { selectedWorldstate: '=?' },
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/NodeListWidgetTemplate.html',
    controller: 'de.cismet.cids.widgets.nodeListWidget.controllers.NodeListDirectiveController'
  };
});