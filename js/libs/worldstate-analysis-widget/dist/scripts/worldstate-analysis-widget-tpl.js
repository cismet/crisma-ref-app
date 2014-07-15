angular.module('eu.crismaproject.worldstateAnalysis.directives').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/indicatorCriteriaAxisChooserTemplate.html',
    "<div class=\"btn-group\">\n" +
    "    <button type=\"button\" class=\"btn btn-default btn-sm\"> <img ng-src=\"{{selectedAxis.icon}}\" style=\"margin-right:5px;float:left\"/>{{selectedAxis.name}}</button>\n" +
    "    <button type=\"button\" class=\"btn btn-default btn-sm dropdown-toggle\" data-toggle=\"dropdown\">\n" +
    "        <span class=\"caret\"></span>\n" +
    "        <span class=\"sr-only\">Toggle Dropdown</span>\n" +
    "    </button>\n" +
    "    <ul class=\"dropdown-menu\" role=\"menu\" >\n" +
    "        <li ng-repeat=\"scale in scales\" role=\"presentation\" ng-click=\"axisSelected($index)\" ng-class=\"{'dropdown-header':scale.isGroup}\">\n" +
    "            <a ng-if=\"!scale.isGroup\">{{scale.name}}</a>\n" +
    "            <img ng-if=\"scale.isGroup\" ng-src=\"{{scale.icon}}\" style=\"margin-right:5px;float:left\"/>\n" +
    "            <span ng-if=\"scale.isGroup\" style=\"margin-top: 4px\">{{scale.name}}</span>\n" +
    "        </li>\n" +
    "    </ul>\n" +
    "</div>"
  );


  $templateCache.put('templates/indicatorCriteriaTableTemplate.html',
    "<div id=\"indicatorCriteriaTable\">\n" +
    "    <div ng-hide=\"worldstates.length > 0\" class=\"alert alert-warning\">\n" +
    "        <strong>Warning: </strong>There are no worldstates selected.\n" +
    "    </div>\n" +
    "    <table ng-hide=\"worldstates.length <= 0\" data-ng-table=\"tableParams\" class=\"table\" template-pagination=\"templates/nopager.html\">\n" +
    "        <thead>\n" +
    "            <tr>\n" +
    "                <th ng-repeat=\"column in columns\" class=\"text-left\" ng-style=\"getCellStyle($index)\">\n" +
    "                    {{column.title}}\n" +
    "                </th>\n" +
    "            </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "            <tr data-ng-repeat=\"row in $data\" ng-class=\"{'info':isGroupRow(row)}\" \n" +
    "                ng-style=\"getRowStyle($index)\">\n" +
    "                <td data-ng-repeat=\"col in columns\" ng-style=\"getCellStyle($index)\">\n" +
    "                    <img ng-if=\"isGroupRow(row) || detailIcons\" ng-src=\"{{row[col.field].icon}}\"/>\n" +
    "                    {{row[col.field].name}}\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "        </tbody>\n" +
    "    </table>  \n" +
    "</div>"
  );


  $templateCache.put('templates/nopager.html',
    ""
  );


  $templateCache.put('templates/relationAnalysisChartTemplate.html',
    "<div class=\"col-lg-12\">\n" +
    "    <style>\n" +
    "        .nvd3 .nv-axis.nv-x path.domain {\n" +
    "            stroke-opacity: .75;\n" +
    "        }\n" +
    "    </style>\n" +
    "    <div  ng-hide=\"worldstates().length > 0\" class=\"row\">\n" +
    "        <!--two dropdowns for x and y axis-->\n" +
    "        <div class=\"alert alert-warning\">\n" +
    "            <strong>Warning: </strong>There are no worldstates selected.\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div  ng-hide=\"!(worldstates() && worldstates().length>0)\" class=\"row\">\n" +
    "        <!--two dropdowns for x and y axis-->\n" +
    "        <div style=\"float: right;margin-bottom: 10px;\">\n" +
    "            <indicator-criteria-axis-chooser is-x-axis=\"false\" icc-object=\"iccObject\" selected-axis=\"yAxis\"></indicator-criteria-axis-chooser>\n" +
    "            <indicator-criteria-axis-chooser is-x-axis=\"true\" icc-object=\"iccObject\" selected-axis=\"xAxis\"></indicator-criteria-axis-chooser>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div  ng-hide=\"!(worldstates() && worldstates().length>0)\" class=\"row\"> \n" +
    "        <!--chart-->\n" +
    "        <div class=\"col-lg-12\" nvd3-scatter-chart\n" +
    "             data=\"chartdata\"\n" +
    "             showLegend=\"true\"\n" +
    "             interactive=\"true\"\n" +
    "             tooltips=\"true\"\n" +
    "             sizerange=\"[80,80]\"\n" +
    "             zscale=\"zScale\"\n" +
    "             showDistX=\"true\"\n" +
    "             showDistY=\"true\"\n" +
    "             xaxislabel=\"{{xAxis.name}}\"\n" +
    "             yaxislabel=\"{{yAxis.name}}\"\n" +
    "             margin='{left:90,top:0,bottom:50,right:50}'\n" +
    "             yAxisTickFormat=\"yAxisTickFormatFunction()\"\n" +
    "             xAxisTickFormat=\"xAxisTickFormatFunction()\"\n" +
    "             height=\"{{chartHeight}}\"\n" +
    "             >\n" +
    "            <svg></svg>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );

}]);
