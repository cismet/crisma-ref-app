angular.module('de.cismet.cids.widgets.nodePathWidget.directives').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/CidsNodePathWidgetTemplate.html',
    "<ol class=\"breadcrumb\">\n" +
    "    <li ng-repeat=\"item in breadCrumbPath\"><a ng-click=\"loadWorldstate($index)\" ng-class=\"isActive($index)\">{{item.name}}</a></li>\n" +
    "</ol>"
  );

}]);
