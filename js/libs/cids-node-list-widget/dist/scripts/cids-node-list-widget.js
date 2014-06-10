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
    $scope.activateItem = function (index) {
      $scope.selectedIndex = index;
      $scope.selectedWorldstate = $scope.scenarioNodes[index];
    };
    $scope.isActive = function (index) {
      if ($scope.scenarioNodes[index] === $scope.selectedWorldstate) {
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