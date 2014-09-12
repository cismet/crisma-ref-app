angular.module('eu.crismaproject.worldstateAnalysis.directives').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/criteriaEmphasesTemplate.html',
    "<div class=\"panel panel-default\">\n" +
    "    <div class=\"panel-heading\" style=\" white-space: nowrap;\n" +
    "         overflow: hidden;\n" +
    "         text-overflow: ellipsis;\">\n" +
    "        Criteria Emphasis\n" +
    "    </div>\n" +
    "    <div class=\"panel-body\" >\n" +
    "        <div class=\"row\">\n" +
    "\n" +
    "            <div  class=\"col-lg-2 col-md-2 col-sm-2 col-xs-4\" style=\"margin-bottom: 20px;\" ng-repeat=\"item in critEmphInternal\">\n" +
    "                <div class=\"row\">\n" +
    "                    <div  style=\"display:block;margin:0 auto;width:100px;\">\n" +
    "                        <knob knob-data=\"item.criteriaEmphasis\" knob-max=\"knobMax\" knob-options=\"knobOptions\"></knob>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "                <div class=\"row\">\n" +
    "                    <div  style=\"display:block;margin:0 auto;width:100px;text-align: center;\">\n" +
    "                        <span>{{item.indicator.displayName}}</span>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
  );


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


  $templateCache.put('templates/criteriaRadarPopupTemplate.html',
    "<div class=\"ngdialog-message\" \n" +
    "     style=\"width:500px;min-width: 500px\"\n" +
    "    criteria-radar \n" +
    "    worldstates=\"[ws]\" \n" +
    "    show-legend=\"false\"\n" +
    "    show-axis-text=\"true\"\n" +
    "    use-numbers=\"false\"\n" +
    "    criteria-function=\"criteriaFunction\">>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/decisionStrategyManagerTemplate.html',
    "<div class=\"col-lg-12\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"col-lg-3\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"list-group\">\n" +
    "                    <a class=\"list-group-item active\">\n" +
    "                        Decision Strategies\n" +
    "                        <i data-placement=\"top\" \n" +
    "                           data-type=\"info\" \n" +
    "                           data-delay=\"500\" \n" +
    "                           data-container=\"body\"\n" +
    "                           data-animation=\"am-fade-and-scale\" \n" +
    "                           bs-tooltip=\"tooltipSave.title\"\n" +
    "                           ng-click=\"addDecisionStrategy()\" class=\"pull-right glyphicon glyphicon-plus-sign\"></i>\n" +
    "                    </a>\n" +
    "                    <a class=\"list-group-item\" \n" +
    "                       ng-click=\"setSelectedDecisionStrategy($index)\"\n" +
    "                       ng-class=\"isActiveItem($index)\" \n" +
    "                       ng-repeat=\"cf in decisionStrategies\">\n" +
    "                        <span ng-hide=\"editable[$index]\">{{cf.name}}</span>\n" +
    "                        <input style =\"color:black;\" ng-hide=\"!editable[$index]\" type=\"text\" ng-model=\"cf.name\">\n" +
    "                        <div class=\"pull-right\" ng-hide=\"$index !== selectedDecisionStrategiesIndex\">\n" +
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
    "                            <i data-placement=\"top\" \n" +
    "                               data-type=\"info\" \n" +
    "                               data-delay=\"500\" \n" +
    "                               data-animation=\"am-fade-and-scale\" \n" +
    "                               bs-tooltip=\"tooltipSave.title\"\n" +
    "                               data-container=\"body\"\n" +
    "                               ng-click=\"removeDecisionStrategy()\"\n" +
    "                               class=\"glyphicon glyphicon-minus-sign\"></i>\n" +
    "                        </div>\n" +
    "                    </a>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "        <div class=\"col-lg-9\" ng-if=\"selectedDecisionStrategyIndex >= 0 && decisionStrategies[selectedDecisionStrategyIndex]\">\n" +
    "            <decision-strategy worldstates=\"worldstates\" decision-strategy=\"currentDecisionStrategy\">\n" +
    "\n" +
    "            </decision-strategy>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('templates/decisionStrategyTemplate.html',
    "<div>\n" +
    "    <div class=\"col-lg-3\">\n" +
    "        <level-of-emphasis \n" +
    "            satisfaction-emphasis=\"decisionStrategy.satisfactionEmphasis\"\n" +
    "            indicator-size=\"indicatorSize\"\n" +
    "            >\n" +
    "        </level-of-emphasis>\n" +
    "    </div>\n" +
    "    <div class=\"col-lg-9\">\n" +
    "        <div class=\"row\">\n" +
    "            <criteria-emphasis indicator-map=\"indicatorMap\" criteria-emphases=\"decisionStrategy.criteriaEmphases\">\n" +
    "                \n" +
    "            </criteria-emphasis>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>"
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
    "            <span ng-if=\"lowerBoundary\">&gt;=</span>\n" +
    "            <span ng-if=\"upperBoundary\">&lt;=</span>\n" +
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
    "        <label for=\"exampleInputEmail1\">Level of satisfaction</label>\n" +
    "        <input ng-model=\"popOverItem.criteriaValue\"\n" +
    "               ng-disabled=\"lowerBoundary || upperBoundary\"\n" +
    "               type=\"text\" class=\"form-control\"\n" +
    "               placeholder=\"Level of satisfactory\">\n" +
    "    </div>\n" +
    "    <div class=\"form-group\">\n" +
    "        <label for=\"exampleInputPassword1\">Indicator value</label>\n" +
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


  $templateCache.put('templates/indicatorBarChartTemplate.html',
    "<div>\n" +
    "    <div class=\"row\"ng-if=\"!worldstates || worldstates.length <= 0\">\n" +
    "        <div class=\"col-lg-12\">\n" +
    "            <div ng-hide=\"worldstates.length > 0\" class=\"alert alert-warning\">\n" +
    "                <strong>Warning: </strong>There are no worldstates selected.\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"row\" ng-if=\"worldstates && worldstates.length > 0\" >\n" +
    "        <div class=\"col-lg-12\" style=\"text-align: center; margin: 20px 0px;\">\n" +
    "            <span ng-repeat=\"ws in worldstates\" style=\"margin:0px 10px;\">\n" +
    "                <i class=\"glyphicon glyphicon-stop\" ng-style=\"getLegendColor($index)\"></i>{{ws.name}}\n" +
    "            </span>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"row\" ng-if=\"worldstates && worldstates.length > 0\">\n" +
    "        <div class=\"col-lg-4\"  ng-repeat=\"chartModel in chartModels\">\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-lg-12\" style=\"text-align: center\">\n" +
    "                    <label>{{chartModel[0].key}}</label>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "            <div class=\"row\">\n" +
    "                <div class=\"col-lg12\" nvd3-discrete-bar-chart style=\"margin-top: -40px;\"\n" +
    "                     data=\"chartModel\"\n" +
    "                     width=\"400\"\n" +
    "                     height=\"200\"\n" +
    "                     showXAxis=\"false\"\n" +
    "                     showYAxis=\"true\"\n" +
    "                     interactive=\"true\"\n" +
    "                     showValues=\"true\"\n" +
    "                     staggerlabels=\"true\"\n" +
    "                     forceY=\"{{chartModel.forceY}}\"\n" +
    "                     yaxistickformat=\"yAxisTickFormat\"\n" +
    "                     valueFormat=\"yAxisTickFormat\"\n" +
    "                     color=\"colorFunction()\"\n" +
    "                     tooltips=\"true\"\n" +
    "                     tooltipcontent=\"toolTipContentFunction()\">\n" +
    "                    <svg></svg>\n" +
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


  $templateCache.put('templates/levelOfEmphasisTemplate.html',
    "<div class=\"panel panel-default\">\n" +
    "    <div class=\"panel-heading\" style=\" white-space: nowrap;\n" +
    "         overflow: hidden;\n" +
    "         text-overflow: ellipsis;\">\n" +
    "        Level of satisfaction emphasis {{model.lse}}\n" +
    "    </div>\n" +
    "    <div class=\"panel-body\" >\n" +
    "        <div ng-if=\"!expertMode && indicatorSize>=1\">\n" +
    "            <form name=\"myForm\" >\n" +
    "\n" +
    "                <div class=\"radio\">\n" +
    "                    <label>\n" +
    "                        <input type=\"radio\" ng-model=\"model.lse\"  value=\"2\">\n" +
    "                        only positive\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "                <div class=\"radio\">\n" +
    "                    <label>\n" +
    "                        <input type=\"radio\" ng-model=\"model.lse\"  value=\"1\">\n" +
    "                        over-emphasise positives\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "                <div class=\"radio\">\n" +
    "                    <label>\n" +
    "                        <input type=\"radio\" ng-model=\"model.lse\"  value=\"0\" checked=\"true\">\n" +
    "                        neutral\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "                <div class=\"radio\">\n" +
    "                    <label>\n" +
    "                        <input type=\"radio\" ng-model=\"model.lse\"  value=\"-1\">\n" +
    "                        over-emphasise negatives\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "                <div class=\"radio\">\n" +
    "                    <label>\n" +
    "                        <input type=\"radio\" ng-model=\"model.lse\" value=\"-2\">\n" +
    "                        only negative\n" +
    "                    </label>\n" +
    "                </div>\n" +
    "            </form>\n" +
    "        </div>\n" +
    "        <div ng-if=\"expertMode\">\n" +
    "            <div class=\"alert alert-warning\" role=\"alert\">Expert Mode not yet implemented!</div>    \n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
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


  $templateCache.put('templates/worldstateAnalysisWidgetTemplate.html',
    "<div class=\"col-lg-12\">\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"panel panel-default\">\n" +
    "            <div class=\"panel-heading\">\n" +
    "                <span class=\"pull-left\">\n" +
    "                    <!--<i class=\"glyphicon glyphicon-list-alt\"></i>-->\n" +
    "                    <h3 style=\"display:inline\" class=\"panel-title\" ng-if=\"!forCriteriaTable\">Indicator table</h3>\n" +
    "                    <h3 style=\"display:inline\" class=\"panel-title\" ng-if=\"forCriteriaTable\">Criteria table</h3>\n" +
    "                </span>\n" +
    "                <span class=\"pull-right\">\n" +
    "                    <div class=\"btn-group\">\n" +
    "                        <button type=\"button\" class=\"btn btn-sm btn-primary dropdown-toggle\" data-toggle=\"dropdown\" ng-disabled=\"disabled\">\n" +
    "                            Change Mode <span class=\"caret\"></span>\n" +
    "                        </button>\n" +
    "                        <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "                            <li><a ng-click=\"forCriteriaTable = false\"><i ng-show=\"!forCriteriaTable\" class=\"glyphicon glyphicon-ok-circle\"></i> <span ng-style=\"{'padding-left' : !forCriteriaTable? '0px': '19px'}\">Indicator</span></a></li>\n" +
    "                            <li><a ng-click=\"forCriteriaTable = true\"><i ng-show=\"forCriteriaTable\" class=\"glyphicon glyphicon-ok-circle\"> </i>  <span ng-style=\"{'padding-left' : forCriteriaTable? '0px': '19px'}\">Criteria</span></a></li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </span>\n" +
    "                <span class=\"clearfix\"></span>\n" +
    "            </div>\n" +
    "            <div class=\"panel-body\">\n" +
    "                <indicator-criteria-table worldstates='worldstates' \n" +
    "                                          for-criteria='forCriteriaTable'\n" +
    "                                          criteria-function=\"selectedCriteriaFunction\"\n" +
    "                                          >\n" +
    "\n" +
    "                </indicator-criteria-table>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <!-- end widget -->\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"panel panel-default\">\n" +
    "            <div class=\"panel-heading\">\n" +
    "                <span class=\"pull-left\">\n" +
    "                    <!--<span class=\"widget-icon\"> <i class=\"fa fa-table\"></i> </span>-->\n" +
    "                    <h3 style=\"display:inline\" class=\"panel-title\">Worldstate relation analysis chart</h3>\n" +
    "                </span>\n" +
    "                <span class=\"pull-right\">\n" +
    "                    <div class=\"btn-group\">\n" +
    "                        <button type=\"button\" class=\"btn btn-sm btn-primary dropdown-toggle\" data-toggle=\"dropdown\" ng-disabled=\"disabled\">\n" +
    "                            Change Mode <span class=\"caret\"></span>\n" +
    "                        </button>\n" +
    "                        <ul class=\"dropdown-menu\" role=\"menu\">\n" +
    "                            <li><a ng-click=\"isCriteria = false\"><i ng-show=\"!isCriteria\" class=\"glyphicon glyphicon-ok-circle\"></i> <span ng-style=\"{'padding-left' : !isCriteria? '0px': '19px'}\">Indicator</span></a></li>\n" +
    "                            <li><a ng-click=\"isCriteria = true\"><i ng-show=\"isCriteria\" class=\"glyphicon glyphicon-ok-circle\"> </i>  <span ng-style=\"{'padding-left' : isCriteria? '0px': '19px'}\">Criteria</span></a></li>\n" +
    "                        </ul>\n" +
    "                    </div>\n" +
    "                </span>\n" +
    "                <span class=\"clearfix\"></span>\n" +
    "            </div>\n" +
    "            <div class=\"panel-body\">\n" +
    "                <relation-analysis-chart style=\"padding-left:50px\" height=\"350\" \n" +
    "                                         for-criteria='isCriteria' \n" +
    "                                         worldstates=\"worldstates\"\n" +
    "                                         criteria-function=\"selectedCriteriaFunction\"\n" +
    "                                         >\n" +
    "                </relation-analysis-chart>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"panel panel-default\">\n" +
    "            <div class=\"panel-heading\">\n" +
    "                <span class=\"pull-left\">\n" +
    "                    <!--<span class=\"widget-icon\"> <i class=\"fa fa-table\"></i> </span>-->\n" +
    "                    <h3 style=\"display:inline\" class=\"panel-title\">Criteria radar chart comparison</h3>\n" +
    "                </span>\n" +
    "                <span class=\"pull-right\">\n" +
    "\n" +
    "                </span>\n" +
    "                <span class=\"clearfix\"></span>\n" +
    "            </div>\n" +
    "            <div class=\"panel-body\">\n" +
    "                <div class=\"col-lg-3\">\n" +
    "                    <select multiple=\"\" ng-model=\"worldstateRef\" \n" +
    "                            ng-options=\"ws.name for ws in allWorldstates\"\n" +
    "                            style=\"width: 100%;height: 100%\">\n" +
    "                    </select>\n" +
    "                </div>\n" +
    "                <div class=\"col-lg-9\">\n" +
    "                    <div class=\"row\">\n" +
    "                        <div class=\"col-lg-4\" ng-repeat=\"chartModel in chartModels\">\n" +
    "                            <div class=\"panel panel-default\">\n" +
    "                                <div class=\"panel-heading\">\n" +
    "                                    <h3 class=\"panel-title ng-binding\">\n" +
    "                                        <i class=\"fa fa-globe\"></i>\n" +
    "                                        {{chartModel[0].name}}</h3>\n" +
    "                                </div>\n" +
    "                                <div class=\"panel-body no-padding text-align-center\">\n" +
    "                                    <div style=\"margin: 0 auto; padding-top: 20px\"  \n" +
    "                                         criteria-radar \n" +
    "                                         worldstates=\"chartModel\"\n" +
    "                                         criteria-function=\"selectedCriteriaFunction\"\n" +
    "                                         >\n" +
    "                                    </div>\n" +
    "                                </div>\n" +
    "                                <!--                            <div class=\"panel-footer no-padding\">\n" +
    "                                                            </div>-->\n" +
    "                            </div>\n" +
    "\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"row\">\n" +
    "        <div class=\"panel panel-default\">\n" +
    "            <div class=\"panel-heading\" style=\"display:table;width:100%\">\n" +
    "                <h3 style=\"display:table-cell;vertical-align: middle\n" +
    "                    \" class=\"panel-title\">Criteria functions</h3>\n" +
    "                <div class=\"pull-right\">\n" +
    "\n" +
    "                    <div class=\"input-group \">\n" +
    "                        <div class=\"input-group-btn \" style=\"display: block\" ng-click=\"persistCriteriaFunctions()\">\n" +
    "                            <button\n" +
    "                                type =\"button\" \n" +
    "                                class=\"btn btn-success btn-sm\">\n" +
    "                                Persist\n" +
    "                            </button>\n" +
    "                            <button type=\"button\" class=\"btn btn-success btn-sm\" >\n" +
    "                                <i ng-if=\"!showPersistSpinner && !showPersistDone\" class=\"glyphicon glyphicon-floppy-disk\"></i>\n" +
    "                                <i ng-if=\"showPersistSpinner\" class=\"spin glyphicon glyphicon-refresh\" ></i>\n" +
    "                                <i ng-if=\"showPersistDone\" class=\"glyphicon glyphicon-ok\"></i>\n" +
    "                            </button>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </div>\n" +
    "\n" +
    "            </div>\n" +
    "            <div class=\"panel-body\">\n" +
    "                <criteria-function-manager indicators=\"indicatorVector\"  criteria-functions=\"criteriaFunctionSets\"></criteria-function-manager>\n" +
    "            </div>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "<!-- end widget -->"
  );


  $templateCache.put('templates/worldstateRankingTableTemplate.html',
    "<div id=\"indicatorCriteriaTable\" style=\"overflow-x: auto\">\n" +
    "    <div ng-hide=\"worldstates.length > 0\" class=\"alert alert-warning\">\n" +
    "        <strong>Warning: </strong>There are no worldstates selected.\n" +
    "    </div>\n" +
    "    <table ng-hide=\"worldstates.length <= 0\" \n" +
    "           ng-table=\"tableParams\" \n" +
    "           show-filter=\"false\" \n" +
    "           class=\"table table-striped\"\n" +
    "           style=\"white-space: nowrap\">\n" +
    "        <thead>\n" +
    "            <tr>\n" +
    "                <th ng-repeat=\"column in columns\"\n" +
    "                     ng-if=\"$index < 3\"\n" +
    "                    class=\"\"\n" +
    "                    >\n" +
    "                    {{column.title}}\n" +
    "                </th>\n" +
    "                <th ng-if=\"showRadarChart\">\n" +
    "                    Criteria radar\n" +
    "                </th>\n" +
    "                <th ng-repeat=\"column in columns\"\n" +
    "                     ng-if=\"$index >= 3\"\n" +
    "                    class=\"\"\n" +
    "                    >\n" +
    "                    {{column.title}}\n" +
    "                </th>\n" +
    "            </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "            <tr ng-repeat=\"item in $data\">\n" +
    "                <td ng-repeat=\"col in columns\" ng-if=\"$index < 3\" style=\"vertical-align: middle\">\n" +
    "                    {{item[col.field]}}\n" +
    "                </td>\n" +
    "                <td ng-if=\"showRadarChart\"\n" +
    "                    style=\"min-width:150px; width:150px; margin: 0 auto; padding-top: 20px\" \n" +
    "                    criteria-radar \n" +
    "                    worldstates=\"[item.ws]\" \n" +
    "                    show-legend=\"false\"\n" +
    "                    show-axis-text=\"true\"\n" +
    "                    use-numbers=\"true\"\n" +
    "                    criteria-function=\"criteriaFunction\"\n" +
    "                    ng-click=\"clickToOpen($index)\"\n" +
    "                   >\n" +
    "                </td>\n" +
    "                <td ng-repeat=\"col in columns\"  ng-if=\"$index >= 3\" style=\"vertical-align: middle\">\n" +
    "                    <span>\n" +
    "                        {{item[col.field].indicator}}\n" +
    "                        <br/>\n" +
    "                        {{item[col.field].los}}\n" +
    "                    </span>\n" +
    "                </td>\n" +
    "\n" +
    "            </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "</div>"
  );

}]);
