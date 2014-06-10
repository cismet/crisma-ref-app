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
angular.module('de.cismet.cids.widgets.nodePathWidget', [
  'de.cismet.cids.widgets.nodePathWidget.directives',
  'de.cismet.cids.widgets.nodePathWidget.controllers',
  'de.cismet.cids.rest.collidngNames.Nodes'
]).controller('AppCtrl', [
  '$scope',
  'de.cismet.collidingNameService.Nodes',
  function ($scope, Nodes) {
    'use strict';
    $scope.selectedNode = {};
    Nodes.get({ nodeId: '55.56.57.58' }, function (node) {
      $scope.node = node;
    });
  }
]);
angular.module('de.cismet.cids.widgets.nodePathWidget.controllers', []).controller('de.cismet.cids.widgets.nodePathWidget.controllers.NodePathDirectiveController', [
  '$scope',
  'de.cismet.collidingNameService.Nodes',
  function ($scope, Nodes) {
    'use strict';
    var breadcrumbPathChanged = false, i;
    $scope.selectedBreadCrumbIndex = 0;
    $scope.loadWorldstate = function (index) {
      $scope.selectedBreadCrumbIndex = index;
      breadcrumbPathChanged = true;
      $scope.selectedNode = $scope.breadCrumbPath[index];
    };
    $scope.isActive = function (index) {
      return index === $scope.selectedBreadCrumbIndex ? 'active' : '';
    };
    $scope.breadCrumbPath = [];
    $scope.$watch('inputNode', function () {
      if (breadcrumbPathChanged) {
        breadcrumbPathChanged = false;
        return;
      }
      //FIXME WE need a proper way to get the node corresponding to the Worldstate
      if ($scope.inputNode && $scope.inputNode.key) {
        var splittedLink = $scope.inputNode.key.split('.');
        //can we use the splittetLink array to retrive the single nodes??
        var nodeKey = '';
        $scope.breadCrumbPath.splice(0, $scope.breadCrumbPath.length);
        for (i = 0; i < splittedLink.length; i++) {
          nodeKey = nodeKey + splittedLink[i];
          $scope.breadCrumbPath.push(Nodes.get({ nodeId: Nodes.utils.getRequestIdForNodeKey(nodeKey) }));
          nodeKey = nodeKey + '.';
        }
        $scope.selectedBreadCrumbIndex = $scope.breadCrumbPath.length - 1;
      } else {
        $scope.breadCrumbPath.splice(0, $scope.breadCrumbPath.length);
      }
    });
  }
]);
angular.module('de.cismet.cids.widgets.nodePathWidget.directives', []).directive('cidsNodePathWidget', function () {
  'use strict';
  return {
    scope: {
      selectedNode: '=',
      inputNode: '='
    },
    restrict: 'E',
    replace: true,
    templateUrl: 'templates/CidsNodePathWidgetTemplate.html',
    controller: 'de.cismet.cids.widgets.nodePathWidget.controllers.NodePathDirectiveController'
  };
});