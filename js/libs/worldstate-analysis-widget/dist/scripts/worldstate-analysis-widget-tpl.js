angular.module('eu.crismaproject.worldstateAnalysis.directives').run(['$templateCache', function($templateCache) {
  'use strict';

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

}]);
