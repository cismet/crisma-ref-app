angular.module('eu.crismaproject.worldstateAnalysis.directives').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/criteriaFunctionManagerTemplate.html',
    "<div class=\"col-lg-12\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-lg-3\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"btn-group\" style=\"margin-bottom: 10px;\">\n" +
    "\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"list-group\">\n" +
    "                    <a class=\"list-group-item active\">\n" +
    "                        Criteria Functions \n" +
    "                        <i data-placement=\"top\" \n" +
    "                           data-type=\"info\" \n" +
    "                           data-delay=\"500\" \n" +
    "                           data-container=\"body\"\n" +
    "                           data-animation=\"am-fade-and-scale\" \n" +
    "                           bs-tooltip=\"tooltipSave.title\"\n" +
    "                           ng-click=\"addCriteriaFunction()\" class=\"pull-right glyphicon glyphicon-plus-sign\"></i>\n" +
    "                    </a>\n" +
    "                    <a class=\"list-group-item\" \n" +
    "                       ng-click=\"setSelectedCriteriaFunction($index)\"\n" +
    "                       ng-class=\"isActiveItem($index)\" \n" +
    "                       ng-repeat=\"cf in criteriaFunctionSet\">\n" +
    "                        <span ng-hide=\"editable[$index]\">{{cf.name}}</span>\n" +
    "                        <input style =\"color:black;\" ng-hide=\"!editable[$index]\" type=\"text\" ng-model=\"cf.name\">\n" +
    "                        <div class=\"pull-right\" ng-hide=\"$index!==selectedCriteriaFunctionIndex\">\n" +
    "\n" +
    "                            <i ng-hide=\"editable[$index]\" \n" +
    "                               data-placement=\"top\" data-type=\"info\" \n" +
    "                               data-delay=\"500\" \n" +
    "                               data-animation=\"am-fade-and-scale\" \n" +
    "                               data-container=\"body\"\n" +
    "                               bs-tooltip=\"tooltipRename.title\"\n" +
    "                               ng-click=\"editable[$index] = true\" \n" +
    "                               style=\"margin-right: 10px;\"\n" +
    "                               class=\"glyphicon glyphicon-pencil\"></i>\n" +
    "                            <i ng-hide=\"!editable[$index]\"\n" +
    "                               data-placement=\"top\" \n" +
    "                               data-type=\"info\" \n" +
    "                               data-delay=\"500\" \n" +
    "                               data-animation=\"am-fade-and-scale\" \n" +
    "                               data-container=\"body\"\n" +
    "                               bs-tooltip=\"tooltipRenameDone.title\"\n" +
    "                               ng-click=\"editable[$index] = false\"\n" +
    "                               style=\"margin-right: 10px;\"\n" +
    "                               class=\"glyphicon glyphicon-ok\"></i>\n" +
    "<!--                            <i data-placement=\"bottom\" data-type=\"info\" data-delay=\"500\" data-animation=\"am-fade-and-scale\" bs-tooltip=\"tooltipSave.title\"\n" +
    "                               ng-click=\"saveCriteriaFunctions()\"\n" +
    "                               style=\"margin-right: 10px;\"\n" +
    "                               class=\"glyphicon glyphicon-floppy-disk\"></i>-->\n" +
    "                            <i data-placement=\"top\" \n" +
    "                               data-type=\"info\" \n" +
    "                               data-delay=\"500\" \n" +
    "                               data-animation=\"am-fade-and-scale\" \n" +
    "                               bs-tooltip=\"tooltipSave.title\"\n" +
    "                               data-container=\"body\"\n" +
    "                               ng-click=\"removeCriteriaFunction()\"\n" +
    "                               class=\"glyphicon glyphicon-minus-sign\"></i>\n" +
    "                        </div>\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-lg-9\" ng-if=\"selectedCriteriaFunctionIndex >= 0 && criteriaFunctionSet[selectedCriteriaFunctionIndex]\">\n" +
    "            <div class=\"row\" ng-repeat=\"indicator in indicators\">\n" +
    "                <div class=\"col-lg-12\">\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col-lg-12 vCenter\">\n" +
    "                            <img ng-src=\"{{indicator.iconResource}}\" style=\"margin-right:5px;margin-bottom: 5px\" /> <label>{{indicator.displayName}}</label>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col-lg-12\" >\n" +
    "                            <indicator-band criteria-function=\"criteriaFunctionSet[selectedCriteriaFunctionIndex].criteriaFunctions[$index]\"></indicator-band>        \n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>   \n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/indicatorBandItemTemplate.html',
    "<div id=\"popover-parent\" class=\"progress-bar table-display\" \n" +
    "     aria-valuemin=\"0\" aria-valuemax=\"100\"\n" +
    "     aria-valunow=\"{{getPercent()}}\"\n" +
    "     ng-style=\"intervalWidth()\"\n" +
    "     ng-class=\"getColorClass()\"\n" +
    "     ng-click=\"togglePopover($event)\"\n" +
    "     style=\"cursor: pointer;\"\n" +
    "     >\n" +
    "    <div class=\"closeIcon vCenter\" ng-if=\"!lowerBoundary && !upperBoundary\"><i ng-click=\"del(previousInterval);\n" +
    "                $event.stopPropagation()\" ng-hide=\"first\" class=\"glyphicon glyphicon-remove\"></i></div>\n" +
    "    <div id=\"popover-target\" class=\"vCenter\" style=\"width:100%\">\n" +
    "        <div ng-hide=\"actualHeightExceeded\" class=\"progress-labels\" style=\"width:100%\">\n" +
    "\n" +
    "            <span ng-if=\"lowerBoundary\">0%</span>\n" +
    "            <span ng-if=\"upperBoundary\">100%</span>\n" +
    "            <span ng-if=\"!lowerBoundary && !upperBoundary\">{{previousInterval.criteriaValue||'0' | number}}% - {{interval.criteriaValue| number}}% </span>\n" +
    "            <br/> \n" +
    "            <span ng-if=\"lowerBoundary\">&lt;=</span>\n" +
    "            <span ng-if=\"upperBoundary\">&gt;=</span>\n" +
    "            <span ng-if=\"!lowerBoundary && !upperBoundary\">{{previousInterval.indicatorValue||'0' | number}} -</span>\n" +
    "            <span>{{interval.indicatorValue| number}}</span>\n" +
    "        </div>\n" +
    "        <div ng-hide=\"!actualHeightExceeded\">\n" +
    "            <i class=\"glyphicon glyphicon-info-sign \" style=\"color:black\" data-placement=\"top\" data-type=\"info\" data-animation=\"am-fade-and-scale\" bs-tooltip=\"tooltip\"></i>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div  class=\"closeIcon vCenter\" ng-if=\"!lowerBoundary && !upperBoundary\" ><i ng-click=\"del(interval);\n" +
    "                $event.stopPropagation()\" ng-hide=\"last\" class=\"glyphicon glyphicon-remove\"></i>\n" +
    "    </div>\n" +
    "</div>"
  );


  $templateCache.put('templates/indicatorBandPopoverContentTemplate.html',
    "<form role=\"form\">\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"exampleInputEmail1\">Level of satisfactory</label>\n" +
    "        <input ng-model=\"popOverItem.criteriaValue\"\n" +
    "               ng-disabled=\"lowerBoundary || upperBoundary\"\n" +
    "               type=\"text\" class=\"form-control\"\n" +
    "               placeholder=\"Level of satisfactory\">\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"exampleInputPassword1\">Indicator Value</label>\n" +
    "        <input ng-model=\"popOverItem.indicatorValue\" \n" +
    "               type=\"text\" class=\"form-control\"  \n" +
    "               placeholder=\"Indicator Value\">\n" +
    "    </div>\n" +
    "    <button type=\"submit\" class=\"btn btn-default\" ng-click=\"updateInterval($event);\n" +
    "                $hide()\">Save</button>\n" +
    "</form>"
  );


  $templateCache.put('templates/indicatorBandPopoverTemplate.html',
    "<div class=\"popover\" style=\"color:black\" ng-click=\"$event.stopPropagation();\">\n" +
    "  <div class=\"arrow\"></div>\n" +
    "  <h3 class=\"popover-title\" ng-bind=\"title\" ng-show=\"title\"></h3>\n" +
    "  <div class=\"popover-content\" ng-bind=\"content\"></div>\n" +
    "</div>"
  );


  $templateCache.put('templates/indicatorBandTemplate.html',
    "<div class=\"row\">\n" +
    "    <div class=\"col-lg-12\">\n" +
    "        <div class=\"row\">\n" +
    "            <div class=\"col-lg-2\" style=\"padding-right:5px;width:12.5%\">\n" +
    "                <div class=\"progress\">\n" +
    "                    <indicator-band-item \n" +
    "                        interval=\"criteriaFunction.lowerBoundary\" \n" +
    "                        lower-boundary=\"true\"\n" +
    "                        on-interval-changed=\"updateLowerBoundary(indicatorValue)\"\n" +
    "                        title=\"Criteria / Indicator values\">\n" +
    "                    </indicator-band-item>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-lg-9\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div class=\"progress\">\n" +
    "                        <indicator-band-item \n" +
    "                            ng-repeat=\"interval in criteriaFunction.intervals\"\n" +
    "                            interval=\"interval\"\n" +
    "                            previous-interval=\"$first ? criteriaFunction.lowerBoundary : criteriaFunction.intervals[$index-1]\"\n" +
    "                            first=\"$first\"\n" +
    "                            delete-interval=\"deleteInterval(interval)\"\n" +
    "                            on-interval-changed=\"createInterval(criteriaValue,indicatorValue)\"\n" +
    "                            get-color=\"getIntervalColor(interval)\"\n" +
    "                            >\n" +
    "                        </indicator-band-item>\n" +
    "                        <indicator-band-item \n" +
    "                            interval=\"criteriaFunction.upperBoundary\" \n" +
    "                            previous-interval=\"criteriaFunction.intervals[criteriaFunction.intervals.length-1] || criteriaFunction.lowerBoundary\"\n" +
    "                            last=\"true\"\n" +
    "                            first=\"criteriaFunction.intervals.length<=0\"\n" +
    "                            on-interval-changed=\"createInterval(criteriaValue,indicatorValue)\"\n" +
    "                            get-color=\"getIntervalColor(interval)\"\n" +
    "                            >\n" +
    "                        </indicator-band-item>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"row\" style=\"min-height: 20px;\">\n" +
    "                    <div class=\"intervalMarker\" ng-style=\"getIntervalWidth(interval, criteriaFunction.intervals[$index - 1])\" ng-repeat=\"interval in criteriaFunction.intervals\">\n" +
    "                        <span class=\"glyphicon glyphicon-chevron-up\" style=\"width:16px;float:right;margin-right: -8px;\"></span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"col-lg-2\"  style=\"padding-left:5px;width: 12.5%\">\n" +
    "                <div class=\"progress\">\n" +
    "                    <indicator-band-item \n" +
    "                        interval=\"criteriaFunction.upperBoundary\" \n" +
    "                        upper-boundary=\"true\"\n" +
    "                        on-interval-changed=\"updateUpperBoundary(indicatorValue)\"\n" +
    "                        title=\"Criteria / Indicator values\">\n" +
    "                    </indicator-band-item>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


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
