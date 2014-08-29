angular.module('eu.crismaproject.worldstateAnalysis.controllers', [
  'nvd3ChartDirectives',
  'eu.crismaproject.worldstateAnalysis.services'
]).controller('eu.crismaproject.worldstateAnalysis.controllers.IndicatorCriteriaTableDirectiveController', [
  '$scope',
  '$filter',
  'de.cismet.crisma.ICMM.Worldstates',
  'ngTableParams',
  'eu.crismaproject.worldstateAnalysis.services.CriteriaCalculationService',
  function ($scope, $filter, WorldstateService, NgTableParams, ccs) {
    'use strict';
    var getOrderedProperties = function (obj) {
        var p, keys;
        keys = [];
        for (p in obj) {
          if (obj.hasOwnProperty(p)) {
            keys.push(p);
          }
        }
        keys.sort();
        return keys;
      }, updateTable = function () {
        var field, group, i, iccData, j, k_outer, k_inner, keys_outer, keys_inner, prop, val, criteriaFunction, k, indicatorVector = WorldstateService.utils.stripIccData($scope.worldstates);
        if (!(!$scope.worldstates || $scope.worldstates.length === 0)) {
          $scope.rows = [];
          $scope.columns = [{
              title: $scope.forCriteria ? 'Criteria' : 'Indicators',
              field: 'f1',
              visible: true
            }];
          j = 0;
          iccData = indicatorVector[0].data;
          keys_outer = getOrderedProperties(iccData);
          for (k_outer = 0; k_outer < keys_outer.length; ++k_outer) {
            group = iccData[keys_outer[k_outer]];
            $scope.rows[j++] = {
              f1: {
                name: group.displayName,
                icon: group.iconResource
              }
            };
            keys_inner = getOrderedProperties(group);
            for (k_inner = 0; k_inner < keys_inner.length; ++k_inner) {
              prop = keys_inner[k_inner];
              if (prop !== 'displayName' && prop !== 'iconResource') {
                $scope.rows[j++] = {
                  f1: {
                    name: group[prop].displayName,
                    icon: group[prop].iconResource
                  }
                };
              }
            }
          }
          for (i = 0; i < indicatorVector.length; ++i) {
            field = 'f' + (i + 2);
            $scope.columns.push({
              title: indicatorVector[i].name,
              field: field,
              visible: true
            });
            iccData = indicatorVector[i].data;
            j = 0;
            keys_outer = getOrderedProperties(iccData);
            for (k_outer = 0; k_outer < keys_outer.length; ++k_outer) {
              group = iccData[keys_outer[k_outer]];
              $scope.rows[j++][field] = null;
              keys_inner = getOrderedProperties(group);
              for (k_inner = 0; k_inner < keys_inner.length; ++k_inner) {
                prop = keys_inner[k_inner];
                if (prop !== 'displayName' && prop !== 'iconResource') {
                  for (k = 0; k < $scope.criteriaFunction.criteriaFunctions.length; k++) {
                    if ($scope.criteriaFunction.criteriaFunctions[k].indicator === group[prop].displayName) {
                      criteriaFunction = $scope.criteriaFunction.criteriaFunctions[k];
                      break;
                    }
                  }
                  if ($scope.forCriteria) {
                    val = ccs.calculateCriteria(group[prop].value, criteriaFunction);
                  } else {
                    val = group[prop].value;
                  }
                  if (val % 1 !== 0) {
                    val = $filter('number')(val, 2);
                  }
                  $scope.rows[j++][field] = { name: val + ' ' + group[prop].unit };
                }
              }
            }
          }
        }
        if ($scope.tableParams) {
          $scope.tableParams.reload();
        } else {
          $scope.tableParams = new NgTableParams({
            page: 1,
            count: $scope.rows.length
          }, {
            counts: [],
            total: $scope.worldstates.length,
            getData: function ($defer, params) {
              if ($scope.worldstates.length <= 0) {
                return null;
              }
              $defer.resolve($scope.rows.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
          });
        }
      };
    $scope.tableVisibleSwitch = '0';
    $scope.isGroupRow = function (row) {
      return row.f2 === null;
    };
    $scope.getRowStyle = function (index) {
      var row = $scope.rows[index], groupRowStyle = { 'font-weight': 'bold' };
      return $scope.isGroupRow(row) ? groupRowStyle : '';
    };
    $scope.getCellStyle = function (index) {
      var dataCellStyle = { 'text-align': 'right' };
      return index > 0 ? dataCellStyle : '';
    };
    $scope.$watchCollection('worldstates', function () {
      if ($scope.worldstates) {
        updateTable();
      }
    });
    $scope.$watch('forCriteria', function (newVal, oldVal) {
      if (newVal !== oldVal && $scope.worldstates) {
        updateTable();
      }
    });
    $scope.$watch('criteriaFunction', function (newVal, oldVal) {
      if (newVal !== oldVal && $scope.worldstates) {
        updateTable();
      }
    }, true);
  }
]);
angular.module('eu.crismaproject.worldstateAnalysis.directives', [
  'eu.crismaproject.worldstateAnalysis.controllers',
  'ngTable',
  'de.cismet.crisma.ICMM.Worldstates',
  'mgcrea.ngStrap.popover'
]).directive('indicatorCriteriaTable', [function () {
    'use strict';
    var scope;
    scope = {
      worldstates: '=',
      forCriteria: '=',
      criteriaFunction: '=',
      detailIcons: '@'
    };
    return {
      scope: scope,
      restrict: 'E',
      templateUrl: 'templates/indicatorCriteriaTableTemplate.html',
      controller: 'eu.crismaproject.worldstateAnalysis.controllers.IndicatorCriteriaTableDirectiveController'
    };
  }]);
// this is only used for demo/testing purposes
angular.module('eu.crismaproject.worldstateAnalysis.demoApp', [
  'eu.crismaproject.worldstateAnalysis.demoApp.controllers',
  'eu.crismaproject.worldstateAnalysis.directives',
  'eu.crismaproject.worldstateAnalysis.services',
  'de.cismet.crisma.widgets.worldstateTreeWidget',
  'mgcrea.ngStrap'
]);
angular.module('eu.crismaproject.worldstateAnalysis.controllers').controller('eu.crismaproject.worldstateAnalysis.controllers.CriteriaFunctionManagerDirectiveController', [
  '$scope',
  function ($scope) {
    'use strict';
    $scope.editable = [];
    $scope.currentIntervalFunctions = [];
    $scope.selectedCriteriaFunctionIndex = -1;
    $scope.tooltipDelete = { title: 'Delete this criteria function' };
    $scope.tooltipAdd = { title: 'Create a new criteria function' };
    $scope.tooltipSave = { title: 'Save changes' };
    $scope.tooltipRename = { title: 'Rename criteria function' };
    $scope.tooltipRenameDone = { title: 'Done' };
    $scope.addCriteriaFunction = function () {
      var i, criteriaFunctions = [];
      for (i = 0; i < $scope.indicators.length; i++) {
        criteriaFunctions.push({
          indicator: $scope.indicators[i].displayName,
          lowerBoundary: {
            criteriaValue: 0,
            indicatorValue: 0
          },
          upperBoundary: {
            criteriaValue: 100,
            indicatorValue: 0
          },
          intervals: []
        });
      }
      $scope.criteriaFunctionSet.push({
        name: 'Criteria function ' + ($scope.criteriaFunctionSet.length + 1),
        criteriaFunctions: criteriaFunctions
      });
      $scope.editable.push(false);
    };
    $scope.removeCriteriaFunction = function () {
      $scope.criteriaFunctionSet.splice($scope.selectedCriteriaFunctionIndex, 1);
    };
    $scope.isActiveItem = function (index) {
      if ($scope.selectedCriteriaFunctionIndex === index) {
        return 'list-group-item-info';
      } else {
        return '';
      }
    };
    $scope.setSelectedCriteriaFunction = function (index) {
      $scope.selectedCriteriaFunctionIndex = index;
      $scope.currentCriteriaFunction = $scope.criteriaFunctionSet[$scope.selectedCriteriaFunctionIndex];
    };
  }
]);
angular.module('eu.crismaproject.worldstateAnalysis.controllers').controller('eu.crismaproject.worldstateAnalysis.controllers.CriteriaRadarChartDirectiveController', [
  '$scope',
  'eu.crismaproject.worldstateAnalysis.services.CriteriaCalculationService',
  function ($scope, ccs) {
    'use strict';
    $scope.legendItems = [];
    $scope.convertToChartDataStructure = function (indicatorVector) {
      var i, j, indicatorData, groupName, group, criteriaProp, indiactor, result, dataItem, legendItems, criteriaFunction;
      result = [];
      legendItems = [];
      for (i = 0; i < indicatorVector.length; i++) {
        dataItem = [];
        indicatorData = indicatorVector[i].data;
        legendItems.push(indicatorVector[i].name);
        for (groupName in indicatorData) {
          if (indicatorData.hasOwnProperty(groupName)) {
            group = indicatorData[groupName];
            for (criteriaProp in group) {
              if (group.hasOwnProperty(criteriaProp) && criteriaProp !== 'displayName' && criteriaProp !== 'iconResource') {
                indiactor = group[criteriaProp];
                for (j = 0; j < $scope.criteriaFunction.criteriaFunctions.length; j++) {
                  if ($scope.criteriaFunction.criteriaFunctions[j].indicator === indiactor.displayName) {
                    criteriaFunction = $scope.criteriaFunction.criteriaFunctions[j];
                    break;
                  }
                }
                dataItem.push({
                  axis: indiactor.displayName,
                  value: ccs.calculateCriteria(indiactor.value, criteriaFunction)
                });
              }
            }
          }
        }
        result.push(dataItem);
      }
      return [
        result,
        legendItems
      ];
    };
  }
]);
angular.module('eu.crismaproject.worldstateAnalysis.controllers').controller('eu.crismaproject.worldstateAnalysis.controllers.IndicatorBandDirectiveController', [
  '$scope',
  'eu.crismaproject.worldstateAnalysis.services.CriteriaCalculationService',
  function ($scope, ccs) {
    'use strict';
    var initData, criteriaSortFunction;
    initData = {
      lowerBoundary: {
        criteriaValue: 0,
        indicatorValue: 0
      },
      upperBoundary: {
        criteriaValue: 100,
        indicatorValue: 0
      },
      intervals: []
    };
    criteriaSortFunction = function (intervalA, intervalB) {
      return intervalA.criteriaValue - intervalB.criteriaValue;
    };
    if (!$scope.criteriaFunction) {
      $scope.criteriaFunction = initData;
    }
    $scope.criteriaFunction.lowerBoundary = $scope.criteriaFunction.lowerBoundary || initData.lowerBoundary;
    $scope.criteriaFunction.upperBoundary = $scope.criteriaFunction.upperBoundary || initData.upperBoundary;
    $scope.criteriaFunction.intervals = $scope.criteriaFunction.intervals ? $scope.criteriaFunction.intervals.sort(criteriaSortFunction) || initData.intervals.sort(criteriaSortFunction) : initData.intervals.sort(criteriaSortFunction);
    $scope.$watch('criteriaFunction', function () {
      if ($scope.criteriaFunction) {
        $scope.criteriaFunction.lowerBoundary = $scope.criteriaFunction.lowerBoundary || initData.lowerBoundary;
        $scope.criteriaFunction.upperBoundary = $scope.criteriaFunction.upperBoundary || initData.upperBoundary;
        $scope.criteriaFunction.intervals = $scope.criteriaFunction.intervals ? $scope.criteriaFunction.intervals.sort(criteriaSortFunction) || initData.intervals.sort(criteriaSortFunction) : initData.intervals.sort(criteriaSortFunction);
      }
    }, true);
    $scope.getIntervalColor = function (interval) {
      var colorClass, colorValue;
      colorValue = ccs.getColor(interval, $scope.criteriaFunction);
      switch (colorValue) {
      case '#B5F4BC':
        colorClass = 'color-b';
        break;
      // C_FEELING_ORANGE;
      case '#FFBA6B':
        colorClass = 'color-e';
        break;
      //D_AFFINITY;
      case '#FF9F80':
        colorClass = 'color-d';
        break;
      //E_ORANGE_SHERBERT;
      case '#FFC48C':
        colorClass = 'color-e';
        break;
      // F_PEACE_BABY_YELLOW;
      case '#FFDC8A':
        colorClass = 'color-f';
        break;
      //G_JAYANTHI;
      case '#FFF19E':
        colorClass = 'color-g';
        break;
      //H_HONEY_DO;
      case '#EFFAB4':
        colorClass = 'color-h';
        break;
      //I_SPLASH_OF_LIME;
      case '#D1F2A5':
        colorClass = 'color-i';
        break;
      }
      return colorClass;
    };
    $scope.deleteInterval = function (interval) {
      var index = $scope.criteriaFunction.intervals.indexOf(interval);
      $scope.criteriaFunction.intervals.splice(index, 1);
    };
    $scope.updateLowerBoundary = function (indicatorVal) {
      $scope.criteriaFunction.lowerBoundary.indicatorValue = indicatorVal;
    };
    $scope.updateUpperBoundary = function (indicatorVal) {
      $scope.criteriaFunction.upperBoundary.indicatorValue = indicatorVal;
    };
    $scope.$on('band-item-removed', function (args, interval) {
      if (args.targetScope !== $scope) {
        $scope.$broadcast('band-item-removed');
      } else {
        $scope.deleteInterval(interval);
      }
    });
    $scope.createInterval = function (criteriaVal, indicatorVal) {
      var newInterval = {
          criteriaValue: criteriaVal,
          indicatorValue: indicatorVal
        };
      $scope.criteriaFunction.intervals.push(newInterval);
      $scope.criteriaFunction.intervals.sort(criteriaSortFunction);
      $scope.$broadcast('band-item-added');
    };
    // needed to place the interval marker at the rigth position
    $scope.getIntervalWidth = function (interval, previousInterval) {
      var sumBefore = 0;
      if (previousInterval) {
        sumBefore = previousInterval.criteriaValue || 0;
      }
      if (interval && interval.criteriaValue) {
        return { width: interval.criteriaValue - sumBefore + '%' };
      }
      return { width: 100 - sumBefore + '%' };
    };
  }
]);
angular.module('eu.crismaproject.worldstateAnalysis.controllers').controller('eu.crismaproject.worldstateAnalysis.controllers.IndicatorBandItemDirectiveController', [
  '$scope',
  '$filter',
  '$element',
  '$timeout',
  function ($scope, $filter, $element, $timeout) {
    'use strict';
    $scope.actualHeightExceeded = false;
    $scope.getElementHeight = function () {
      return $element.height();
    };
    $scope.getElementWidth = function () {
      return $element.width();
    };
    $scope.checkActualHeight = function () {
      $timeout(function () {
        var childElem = $scope.lowerBoundary || $scope.upperBoundary ? $element.children()[0] : $element.children()[1];
        if (angular.element(childElem).height() > angular.element($element.parent()).height()) {
          $scope.actualHeightExceeded = true;
        } else {
          if ($scope.actualHeightExceeded) {
            $timeout(function () {
              $scope.checkActualHeight();
            });
          }
          $scope.actualHeightExceeded = false;
        }
      }, 500);
    };
    $scope.actualHeightExceeded = false;
    $scope.checkActualHeight();
    $scope.$on('band-item-added', function () {
      $scope.checkActualHeight();
    });
    $scope.$on('band-item-removed', function () {
      $scope.checkActualHeight();
    });
    $scope.getCriteriaSuggestion = function () {
      var criteriaSuggestion;
      if (!$scope.interval || $scope.upperBoundary) {
        criteriaSuggestion = 100;
      } else if ($scope.lowerBoundary) {
        criteriaSuggestion = 0;
      } else {
        if (!$scope.previousInterval) {
          criteriaSuggestion = $scope.interval.criteriaValue / 2;
        } else {
          criteriaSuggestion = $scope.previousInterval.criteriaValue + ($scope.interval.criteriaValue - $scope.previousInterval.criteriaValue) / 2;
        }
      }
      return criteriaSuggestion;
    };
    $scope.$on('tooltip.show.before', function () {
      $scope.popOverItem.criteriaValue = $scope.getCriteriaSuggestion();
      $scope.popOverItem.indicatorValue = $filter('number')($scope.interval.indicatorValue || 0);
    });
    $scope.minWidth = 80;
    var indicatorVal = $scope.interval ? $scope.interval.indicatorValue || 0 : 0;
    $scope.popOverItem = {
      criteriaValue: $scope.getCriteriaSuggestion(),
      indicatorValue: $filter('number')(indicatorVal)
    };
    $scope.getPercent = function () {
      var sumBefore = 0;
      if ($scope.lowerBoundary || $scope.upperBoundary) {
        return 100;
      }
      if ($scope.previousInterval) {
        sumBefore = $scope.previousInterval.criteriaValue || 0;
      }
      if ($scope.interval && ($scope.interval.criteriaValue || $scope.interval.criteriaValue === 0)) {
        //                    return  Math.floor(($scope.interval.criteriaValue - sumBefore))
        if (sumBefore > $scope.interval.criteriaValue) {
          throw new Error('The criteriaValue of the previous interval can not be higher than the criteriaValue of the current Interval');
        }
        return $scope.interval.criteriaValue - sumBefore;
      }
      if (sumBefore > 100) {
        throw new Error('The criteriaValue of the previous interval can not be higher than the criteriaValue of the current Interval');
      }
      return 100 - sumBefore;
    };
    $scope.intervalWidth = function () {
      var percentage = $scope.getPercent();
      return { width: percentage + '%' };
    };
    $scope.getColorClass = function () {
      if ($scope.lowerBoundary) {
        return 'color-a';
      }
      if ($scope.upperBoundary) {
        return 'color-j';
      }
      return $scope.getColor({ interval: $scope.interval });
    };
    $scope.del = function (interval) {
      $scope.$emit('band-item-removed', interval);
    };
    $scope.updateInterval = function (event) {
      $scope.onIntervalChanged({
        criteriaValue: parseFloat($scope.popOverItem.criteriaValue),
        indicatorValue: parseFloat($scope.popOverItem.indicatorValue)
      });
      $scope.hidePopover();
      //this is necessary to avoid poping up the poover for the new created interval
      event.stopPropagation();
    };
    $scope.getTooltipTitle = function () {
      var title = '';
      title += 'Criteria: ';
      if ($scope.lowerBoundary) {
        title += '0%';
      } else if ($scope.upperBoundary) {
        title += '100%';
      } else {
        title += ($scope.previousInterval.criteriaValue || '0') + '% -' + $scope.interval.criteriaValue + '%';
      }
      title += 'Indicator Values: ';
      if ($scope.lowerBoundary) {
        title += '<= ' + ($scope.interval ? $scope.interval.indicatorValue || 0 : 0);
      } else if ($scope.upperBoundary) {
        title += '>= ' + ($scope.interval ? $scope.interval.indicatorValue || 0 : 0);
      } else {
        title += ($scope.interval ? $scope.interval.indicatorValue || 0 : 0) + '- ' + $scope.interval.indicatorValue;
      }
      return title;
    };
    if ($scope.previousInterval && $scope.interval) {
      $scope.tooltip = {
        title: $scope.getTooltipTitle(),
        checked: false
      };
    }
  }
]);
angular.module('eu.crismaproject.worldstateAnalysis.controllers').controller('eu.crismaproject.worldstateAnalysis.controllers.IndicatorCriteriaAxisChooserDirectiveController', [
  '$scope',
  function ($scope) {
    'use strict';
    var getAxisProperties, xAxis, defaultAxis;
    xAxis = $scope.isXAxis === 'true';
    defaultAxis = { name: xAxis ? 'Select a x-axis' : 'Select a y-axis' };
    getAxisProperties = function (iccData) {
      var group, axesGroup, prop, res = [];
      if (iccData) {
        var worldstateIccData = iccData.data;
        for (group in worldstateIccData) {
          if (worldstateIccData.hasOwnProperty(group)) {
            axesGroup = worldstateIccData[group];
            res.push({
              name: axesGroup.displayName,
              icon: axesGroup.iconResource,
              isGroup: true
            });
            for (prop in axesGroup) {
              if (axesGroup.hasOwnProperty(prop)) {
                if (prop !== 'displayName' && prop !== 'iconResource') {
                  res.push({
                    name: axesGroup[prop].displayName,
                    icon: axesGroup[prop].iconResource,
                    isGroup: false
                  });
                }
              }
            }
          }
        }
      }
      return res;
    };
    if (!$scope.selectedAxis) {
      $scope.selectedAxis = defaultAxis;
    }
    $scope.scales = [];
    $scope.axisSelected = function (index) {
      if ($scope.scales[index]) {
        $scope.selectedAxis = $scope.scales[index];
      } else {
        $scope.selectedAxis = defaultAxis;
      }
    };
    $scope.$watch('iccObject', function () {
      if ($scope.iccObject) {
        $scope.scales = getAxisProperties($scope.iccObject);
      }
    });
  }
]);
angular.module('eu.crismaproject.worldstateAnalysis.demoApp.controllers', [
  'de.cismet.crisma.ICMM.Worldstates',
  'de.cismet.cids.rest.collidngNames.Nodes',
  'LocalStorageModule'
]).controller('eu.crismaproject.worldstateAnalysis.demoApp.controllers.MainController', [
  '$scope',
  'de.cismet.collidingNameService.Nodes',
  'de.cismet.crisma.ICMM.Worldstates',
  'localStorageService',
  function ($scope, Nodes, Worldstates, localStorageService) {
    'use strict';
    $scope.criteriaFunctionSet = localStorageService.get('criteriaFunctionSet') || [];
    $scope.selectedCriteriaFunction = $scope.criteriaFunctionSet[0];
    $scope.persistCriteriaFunctions = function () {
      localStorageService.add('criteriaFunctionSet', $scope.criteriaFunctionSet);
    };
    $scope.$watch('criteriaFunctionSet', function (newVal, oldVal) {
      if (newVal !== oldVal) {
        console.log('received changes in criteria function');
      }
    }, true);
    $scope.activeItem = {};
    $scope.treeOptions = {
      checkboxClass: 'glyphicon glyphicon-unchecked',
      folderIconClosed: 'icon-world.png',
      folderIconOpen: 'icon-world.png',
      leafIcon: 'icon-world.png',
      imagePath: 'bower_components/crisma-worldstate-tree-widget-angular/dist/images/',
      multiSelection: true
    };
    // every time the treeSelection changes, we need to determine the
    // corresponding worldstates to the selected nodes. 
    $scope.treeSelection = [];
    $scope.$watchCollection('treeSelection', function (newVal, oldVal) {
      var i, wsId, wsNode, wsArr = [], worldstateCallback = function (worldstate) {
          wsArr.push(worldstate);
          if (wsArr.length === $scope.treeSelection.length) {
            if (!$scope.worldstates) {
              $scope.worldstates = [];
            } else {
              $scope.worldstates.splice(0, $scope.worldstates.length);
            }
            $scope.worldstates = wsArr;
          }
        };
      if (newVal !== oldVal) {
        //clear the old worldstate array
        if ($scope.treeSelection.length <= 0) {
          $scope.worldstates.splice(0, $scope.worldstates.length);
        }
        for (i = 0; i < $scope.treeSelection.length; i++) {
          wsNode = $scope.treeSelection[i].objectKey;
          wsId = wsNode.substring(wsNode.lastIndexOf('/') + 1, wsNode.length);
          Worldstates.get({ 'wsId': wsId }, worldstateCallback);
        }
      }
    });
    $scope.updateSelectedCriteriaFunction = function (index) {
      $scope.selectedCriteriaFunction = $scope.criteriaFunctionSet[index];
    };
    $scope.indicatorVector = [];
    // Retrieve the top level nodes from the icmm api
    $scope.treeNodes = Nodes.query(function () {
      var wsId, wsNode, ws, iccObject, group;
      wsNode = $scope.treeNodes[0].objectKey;
      wsId = wsNode.substring(wsNode.lastIndexOf('/') + 1, wsNode.length);
      ws = Worldstates.get({ 'wsId': wsId }, function () {
        var indicatorGroup, indicatorProp;
        iccObject = Worldstates.utils.stripIccData([ws], false)[0];
        for (indicatorGroup in iccObject.data) {
          if (iccObject.data.hasOwnProperty(indicatorGroup)) {
            group = iccObject.data[indicatorGroup];
            for (indicatorProp in group) {
              if (group.hasOwnProperty(indicatorProp)) {
                if (indicatorProp !== 'displayName' && indicatorProp !== 'iconResource') {
                  $scope.indicatorVector.push(group[indicatorProp]);
                }
              }
            }
          }
        }
      });
    });
  }
]);
angular.module('eu.crismaproject.worldstateAnalysis.controllers').controller('eu.crismaproject.worldstateAnalysis.controllers.RelationAnalysisChartDirectiveController', [
  '$scope',
  'de.cismet.crisma.ICMM.Worldstates',
  'eu.crismaproject.worldstateAnalysis.services.CriteriaCalculationService',
  function ($scope, WorldstateService, ccs) {
    'use strict';
    var controller = this;
    this.createChartData = function (iccData, xAxis, yAxis, xAxisCF, yAxisCf, forCriteria) {
      var i, iccItem, valueX, valueY, data = [];
      if (!iccData || !xAxis || !yAxis) {
        throw 'Invalid configuration. Can no determine chart data for (iccData, xAxis, yaxis):' + iccData + ' , ' + xAxis + ' , ' + yAxis;
      }
      var firstValueX = 0;
      for (i = 0; i < iccData.length; i++) {
        iccItem = iccData[0];
        if (!iccItem) {
          throw 'Invalid icc object ' + iccItem;
        }
        valueX = controller.getDataValueForAxis(xAxis, iccItem, xAxisCF, forCriteria);
        valueY = controller.getDataValueForAxis(yAxis, iccItem, yAxisCf, forCriteria);
        //                    valueX = Math.random() * 500 + 200;
        //                    valueY = Math.random() * 500 + 200;
        if (firstValueX === 0) {
          firstValueX = valueX;
        }
        data.push({
          key: i + 1 + '. ' + iccData[i].name,
          values: [{
              x: valueX,
              y: valueY
            }]
        });
      }
      return data;
    };
    this.getDataValueForAxis = function (axis, iccObject, criteriaFunction, forCriteria) {
      var axisProp, iccItem, iccGroup, iccProp, iccGroupProp;
      if (!(axis && axis.name)) {
        return null;
      }
      axisProp = axis.name;
      iccItem = iccObject.data;
      for (iccGroupProp in iccItem) {
        if (iccItem.hasOwnProperty(iccGroupProp)) {
          iccGroup = iccItem[iccGroupProp];
          for (iccProp in iccGroup) {
            if (iccGroup.hasOwnProperty(iccProp)) {
              if (iccGroup[iccProp].displayName === axisProp) {
                if (forCriteria) {
                  return ccs.calculateCriteria(iccGroup[iccProp].value, criteriaFunction);
                }
                return iccGroup[iccProp].value;
              }
            }
          }
        }
      }
      return null;
    };
    $scope.getXAxisLabel = function () {
      var res = '';
      if ($scope.xAxis && $scope.xAxis.name) {
        res = $scope.xAxis.name;
      }
      return res;
    };
    $scope.getYAxisLabel = function () {
      var res = '';
      if ($scope.yAxis && $scope.yAxis.name) {
        res = $scope.yAxis.name;
      }
      return res;
    };
    $scope.zScale = d3.scale.linear();
    $scope.yAxisTickFormatFunction = function () {
      return function (d) {
        return d3.round(d, 2);
      };
    };
    $scope.xAxisTickFormatFunction = function () {
      return function (d) {
        return d3.round(d, 2);
      };
    };
    this.dataChangedWatchCallback = function () {
      if ($scope.worldstates() && $scope.worldstates().length > 0) {
        $scope.iccData = WorldstateService.utils.stripIccData($scope.worldstates());
        $scope.iccObject = $scope.iccData[0];
        if ($scope.xAxis && $scope.yAxis) {
          if ($scope.xAxis.name.indexOf('Select') === -1 && $scope.yAxis.name.indexOf('Select') === -1) {
            $scope.chartdata = controller.createChartData($scope.iccData, $scope.xAxis, $scope.yAxis, $scope.xAxisCriteriaFunction, $scope.yAxisCriteriaFunction, $scope.forCriteria);
          }
        }
      }
    };
    this.updateAxisCriteriaFunctions = function () {
      var i;
      for (i = 0; i < $scope.criteriaFunctionSet.criteriaFunctions.length; i++) {
        if ($scope.criteriaFunctionSet.criteriaFunctions[i].indicator === $scope.xAxis.name) {
          $scope.xAxisCriteriaFunction = $scope.criteriaFunctionSet.criteriaFunctions[i];
        }
        if ($scope.criteriaFunctionSet.criteriaFunctions[i].indicator === $scope.yAxis.name) {
          $scope.yAxisCriteriaFunction = $scope.criteriaFunctionSet.criteriaFunctions[i];
        }
      }
    };
    this.axisWatchCallback = function () {
      if ($scope.xAxis && $scope.yAxis) {
        if ($scope.xAxis.name.indexOf('Select') === -1 && $scope.yAxis.name.indexOf('Select') === -1) {
          if ($scope.criteriaFunctionSet) {
            controller.updateAxisCriteriaFunctions();
          }
          $scope.chartdata = controller.createChartData($scope.iccData, $scope.xAxis, $scope.yAxis, $scope.xAxisCriteriaFunction, $scope.yAxisCriteriaFunction, $scope.forCriteria);
        }
      }
    };
    $scope.$watch('xAxis', this.axisWatchCallback);
    $scope.$watch('yAxis', this.axisWatchCallback);
    $scope.$watch('forCriteria', this.dataChangedWatchCallback);
    $scope.$watch('worldstates()', this.dataChangedWatchCallback);
    $scope.$watch('criteriaFunctionSet', this.axisWatchCallback, true);
  }
]);
angular.module('eu.crismaproject.worldstateAnalysis.directives').directive('criteriaFunctionManager', [function () {
    'use strict';
    var scope;
    scope = {
      indicators: '=',
      criteriaFunctionSet: '=criteriaFunctions'
    };
    return {
      scope: scope,
      restrict: 'E',
      templateUrl: 'templates/criteriaFunctionManagerTemplate.html',
      controller: 'eu.crismaproject.worldstateAnalysis.controllers.CriteriaFunctionManagerDirectiveController'
    };
  }]);
angular.module('eu.crismaproject.worldstateAnalysis.directives').directive('criteriaRadar', [
  'de.cismet.crisma.ICMM.Worldstates',
  function (WorldstateService) {
    'use strict';
    var scope, linkFunction, drawLegend;
    scope = {
      localModel: '&worldstates',
      criteriaFunction: '='
    };
    drawLegend = function (elem, chartConfig, legendItems) {
      var colorscale, legendSvg, legendContainer, rects, labelWidthHistory, labels, labelWidth, breakIndex, yOff;
      colorscale = d3.scale.category10();
      legendSvg = d3.select(elem[0]).append('div').append('svg').attr('width', chartConfig.w).attr('height', 5);
      //Initiate Legend
      legendContainer = legendSvg.append('g').attr('class', 'legend').attr('height', 5).attr('width', 50);
      //Create colour squares
      rects = legendContainer.selectAll('rect').data(legendItems).enter().append('rect').attr('y', 15).attr('x', 0).attr('width', 10).attr('height', 10).style('fill', function (d, i) {
        return colorscale(i);
      });
      //Create text next to squares
      labels = legendContainer.selectAll('text').data(legendItems).enter().append('text').attr('y', 24).attr('x', 0).attr('font-size', '11px').attr('fill', '#737373').text(function (d) {
        return d;
      });
      //                      we need to adjust the position of the legend labels
      //                      and break the line if necessary
      labelWidthHistory = [];
      labelWidth = [];
      breakIndex = 0;
      yOff = 0;
      labels.attr('transform', function (data, i) {
        var width, sumLabelWidth, sumRectWidth, margin, offset;
        width = d3.select(this).node().getBBox().width;
        sumLabelWidth = labelWidth.reduce(function (prev, curr) {
          return prev + curr;
        }, 0);
        labelWidth.push(width);
        labelWidthHistory.push(width);
        sumRectWidth = (i - breakIndex + 1) * 15;
        margin = (i - breakIndex) * 20;
        offset = sumLabelWidth + sumRectWidth + margin;
        if (offset + width > chartConfig.w) {
          yOff += 20;
          breakIndex = i;
          labelWidth = [width];
          offset = 15;
        }
        return 'translate(' + offset + ',' + yOff + ')';
      });
      yOff = 0;
      breakIndex = 0;
      rects.attr('transform', function (data, i) {
        var sumLabelWidth, sumRectWidth, margin, offset;
        sumLabelWidth = labelWidthHistory.reduce(function (prev, curr, index) {
          if (index < i && index >= breakIndex) {
            return prev + curr;
          }
          return prev;
        }, 0);
        sumRectWidth = (i - breakIndex) * 15;
        margin = (i - breakIndex) * 20;
        offset = sumLabelWidth + sumRectWidth + margin;
        if (offset + labelWidthHistory[i] + 15 > chartConfig.w) {
          yOff += 20;
          breakIndex = i;
          offset = 0;
        }
        return 'translate(' + offset + ',' + yOff + ')';
      });
      //set the size of the legend containers correctly
      legendSvg.attr('height', yOff + 50);
      legendContainer.attr('height', yOff + 50);
      //center the legend horizontally
      legendContainer.attr('transform', function () {
        var legendWidth, off;
        legendWidth = d3.select(this).node().getBBox().width;
        off = (chartConfig.w - legendWidth) / 2;
        off = off < 0 ? 0 : off;
        return 'translate(' + off + ',' + '0)';
      });
    };
    linkFunction = function (scope, elem) {
      var cfg, width, watchCallback;
      watchCallback = function () {
        var indicators, chartDataModel;
        elem.removeData();
        elem.empty();
        if (scope.localModel() && scope.localModel().length > 0) {
          // we are only interest in criteria data
          indicators = WorldstateService.utils.stripIccData(scope.localModel(), false);
          chartDataModel = scope.convertToChartDataStructure(indicators);
          scope.chartData = chartDataModel[0];
          scope.legendItems = chartDataModel[1];
          var divNode = d3.select(elem[0]).append('div').attr('style', 'display:block;margin: 0 auto;').node();
          RadarChart.draw(divNode, scope.chartData, cfg);
          drawLegend(elem, cfg, scope.legendItems);
        }
      };
      //we want the chart to adjust to the size of the element it is placed in
      width = elem.width ? elem.width() : 200;
      cfg = {
        w: width,
        h: width,
        maxValue: 100,
        levels: 4
      };
      scope.$watchCollection('localModel()', watchCallback);
      scope.$watch('criteriaFunction', watchCallback, true);
    };
    return {
      scope: scope,
      restrict: 'A',
      link: linkFunction,
      controller: 'eu.crismaproject.worldstateAnalysis.controllers.CriteriaRadarChartDirectiveController'
    };
  }
]);
angular.module('eu.crismaproject.worldstateAnalysis.directives').directive('indicatorBand', [function () {
    'use strict';
    var scope;
    scope = { criteriaFunction: '=?' };
    return {
      scope: scope,
      restrict: 'E',
      templateUrl: 'templates/indicatorBandTemplate.html',
      controller: 'eu.crismaproject.worldstateAnalysis.controllers.IndicatorBandDirectiveController'
    };
  }]).directive('indicatorBandItem', [
  '$popover',
  function ($popover) {
    'use strict';
    var scope;
    scope = {
      interval: '=',
      previousInterval: '=',
      first: '=',
      last: '=',
      lowerBoundary: '@',
      upperBoundary: '@',
      onIntervalChanged: '&',
      getColor: '&'
    };
    return {
      scope: scope,
      restrict: 'E',
      templateUrl: 'templates/indicatorBandItemTemplate.html',
      controller: 'eu.crismaproject.worldstateAnalysis.controllers.IndicatorBandItemDirectiveController',
      replace: true,
      link: function (scope, elem, attrs) {
        var popover = $popover(elem.find('#popover-target'), {
            scope: scope,
            title: attrs.title || 'Create a new interval',
            template: 'templates/indicatorBandPopoverTemplate.html',
            contentTemplate: 'templates/indicatorBandPopoverContentTemplate.html',
            placement: 'bottom',
            trigger: 'manual'
          });
        scope.togglePopover = function () {
          popover.$promise.then(popover.toggle);
        };
        scope.hidePopover = function () {
          popover.$promise.then(popover.hide);
        };
      }
    };
  }
]);
angular.module('eu.crismaproject.worldstateAnalysis.directives').directive('indicatorCriteriaAxisChooser', [function () {
    'use strict';
    var scope;
    scope = {
      iccObject: '=',
      isXAxis: '@',
      selectedAxis: '='
    };
    return {
      scope: scope,
      restrict: 'E',
      templateUrl: 'templates/indicatorCriteriaAxisChooserTemplate.html',
      controller: 'eu.crismaproject.worldstateAnalysis.controllers.IndicatorCriteriaAxisChooserDirectiveController'
    };
  }]);
angular.module('eu.crismaproject.worldstateAnalysis.directives').directive('relationAnalysisChart', [
  'de.cismet.crisma.ICMM.Worldstates',
  function () {
    'use strict';
    var scope;
    scope = {
      worldstates: '&',
      chartHeight: '@height',
      forCriteria: '=',
      criteriaFunctionSet: '=criteriaFunction'
    };
    return {
      scope: scope,
      restrict: 'E',
      templateUrl: 'templates/relationAnalysisChartTemplate.html',
      controller: 'eu.crismaproject.worldstateAnalysis.controllers.RelationAnalysisChartDirectiveController'
    };
  }
]);
angular.module('eu.crismaproject.worldstateAnalysis.services', []).factory('eu.crismaproject.worldstateAnalysis.services.AnalysisService', [function () {
    'use strict';
    var owa;
    owa = function () {
      var checkVector, checkVectorRange, epsilon, equals, eFactor, publicApi, self;
      // default tolerance
      epsilon = 1e-7;
      eFactor = 1000000;
      self = this;
      publicApi = {};
      equals = function (a, b, e) {
        return Math.abs(a - b) < e;
      };
      checkVectorRange = function (vector) {
        var i;
        for (i = 0; i < vector.length; ++i) {
          if (vector[i] < 0 || vector[i] > 1) {
            throw 'arg value not within range [0, 1]: arg[' + i + ']=' + vector[i];
          }
        }
      };
      checkVector = function (vector) {
        var i, sum;
        checkVectorRange(vector);
        sum = 0;
        for (i = 0; i < vector.length; ++i) {
          sum += vector[i];
        }
        if (!equals(sum, 1, epsilon)) {
          throw 'sum of vector is not 1: ' + sum;
        }
      };
      publicApi.orness = function (weights) {
        var i, n, orness;
        checkVector(weights);
        n = weights.length;
        orness = 0;
        for (i = 0; i < weights.length; ++i) {
          orness += (n - (i + 1)) * weights[i];
        }
        orness *= 1 / (n - 1);
        return orness;
      };
      publicApi.dispersion = function (weights) {
        var i, dispersion;
        checkVector(weights);
        dispersion = 0;
        for (i = 0; i < weights.length; ++i) {
          if (weights[i] !== 0) {
            dispersion += weights[i] * Math.log(weights[i]);
          }
        }
        dispersion *= -1;
        return dispersion;
      };
      // or in other words, emphasis on andness
      // exponential gratification (i^e)
      publicApi.lLSWeights = function (criteriaCount) {
        var i, sum, weights;
        sum = 0;
        for (i = 1; i <= criteriaCount; ++i) {
          sum = sum + Math.pow(i, Math.E);
        }
        weights = [];
        for (i = 1; i <= criteriaCount; ++i) {
          weights[i - 1] = Math.pow(i, Math.E) / sum;
        }
        checkVector(weights);
        return weights;
      };
      // or in other words, emphasis on orness
      publicApi.hLSWeights = function (criteriaCount) {
        return owa.lLSWeights(criteriaCount).reverse();
      };
      publicApi.meanWeights = function (criteriaCount) {
        var i, d, mean, weights;
        mean = 1 / criteriaCount;
        weights = [];
        for (i = 0; i < criteriaCount; ++i) {
          weights[i] = mean;
        }
        d = owa.dispersion(weights);
        if (!equals(d, Math.log(criteriaCount), epsilon)) {
          throw 'rounding error: [dispersion=' + d + '|log=' + Math.log(criteriaCount) + ']';
        }
        return weights;
      };
      publicApi.orderedArgs = function (vector) {
        return vector.slice(0).sort().reverse();
      };
      publicApi.aggregateLS = function (criteria, weights, importance) {
        var crit, i, ordered, res,
          // only needed if importance is not null
          andness, imp, multiplier, power, orness, sat;
        checkVector(weights);
        checkVectorRange(criteria);
        if (criteria.length !== weights.length) {
          throw 'criteria and weights must have the same amount of items';
        }
        if (importance) {
          checkVectorRange(importance);
          if (criteria.length !== importance.length) {
            throw 'criteria and importance must have the same amount of items';
          }
          crit = [];
          orness = owa.orness(weights);
          andness = 1 - orness;
          for (i = 0; i < importance.length; ++i) {
            imp = importance[i];
            sat = criteria[i];
            multiplier = Math.max(imp, andness);
            power = Math.max(imp, orness);
            res = multiplier * Math.pow(sat, power);
            crit[i] = res;
          }
        } else {
          crit = criteria;
        }
        ordered = owa.orderedArgs(crit);
        res = 0;
        for (i = 0; i < ordered.length; ++i) {
          res += ordered[i] * weights[i];
        }
        return res;
      };
      return publicApi;
    }();
    return {
      getOwa: function () {
        return owa;
      }
    };
  }]);
angular.module('eu.crismaproject.worldstateAnalysis.services').factory('eu.crismaproject.worldstateAnalysis.services.CriteriaCalculationService', [function () {
    'use strict';
    var calculateCriteria, interpolateValue, getColor, getColorForCriteria;
    interpolateValue = function (indicatorValue, lowerBound, upperBound) {
      var max, min, lowerCriteriaValue, upperCriteriaValue, rate;
      max = Math.max(lowerBound.indicatorValue, upperBound.indicatorValue);
      min = Math.min(lowerBound.indicatorValue, upperBound.indicatorValue);
      lowerCriteriaValue = lowerBound.criteriaValue;
      upperCriteriaValue = upperBound.criteriaValue;
      rate = (max - indicatorValue) / (max - min);
      return upperCriteriaValue + (lowerCriteriaValue - upperCriteriaValue) * rate;
    };
    calculateCriteria = function (indicatorValue, criteriaFunction) {
      var i, pre, suc, list = [];
      //check the format of the criteriaFunction
      if (!(criteriaFunction.lowerBoundary && criteriaFunction.upperBoundary && criteriaFunction.intervals)) {
        throw new Error('CriteriaFunction is not valid');
      }
      list.push(criteriaFunction.lowerBoundary);
      list = list.concat(criteriaFunction.intervals);
      list.push(criteriaFunction.upperBoundary);
      if (criteriaFunction.lowerBoundary.indicatorValue > criteriaFunction.upperBoundary.indicatorValue) {
        list.reverse();
      }
      //check if the indicatorValue is lower than the lowerBound
      if (indicatorValue <= list[0].indicatorValue) {
        return list[0].criteriaValue;
      } else if (indicatorValue >= list[list.length - 1].indicatorValue) {
        return list[list.length - 1].criteriaValue;
      } else {
        //loop through the intervals...
        for (i = 1; i < list.length; i++) {
          pre = list[i - 1];
          suc = list[i];
          if (indicatorValue >= pre.indicatorValue && indicatorValue <= suc.indicatorValue) {
            return interpolateValue(indicatorValue, pre, suc);
          }
        }
        return interpolateValue(indicatorValue, suc, criteriaFunction.upperBoundary);
      }
    };
    getColorForCriteria = function (criteriaValue, criteriaFunction) {
      var i, interval = null, tmpInterval;
      if (criteriaValue === 0) {
        return '#FF6543';
      }
      if (criteriaValue === 100) {
        return '#B5F4BC';
      }
      if (criteriaFunction.intervals) {
        for (i = 0; i < criteriaFunction.intervals.length; i++) {
          tmpInterval = criteriaFunction.intervals[i];
          if (criteriaValue < tmpInterval.criteriaValue) {
            return getColor(tmpInterval, criteriaFunction);
          }
        }
      }
      return getColor(interval, criteriaFunction);
    };
    getColor = function (interval, criteriaFunction) {
      var tmpInterval, i, total = criteriaFunction.intervals.length, c;
      var index = -1;
      if (interval) {
        for (i = 0; i < total; i++) {
          tmpInterval = criteriaFunction.intervals[i];
          if (tmpInterval.criteriaValue === interval.criteriaValue) {
            index = i;
          }
        }
      }
      if (total === 0) {
        //                E_ORANGE_SHERBERT;
        c = '#FFC48C';
      } else if (total === 1) {
        if (index === 0) {
          //                    c = D_AFFINITY;
          c = '#FF9F80';
        } else {
          //                    c = G_JAYANTHI;
          c = '#FFF19E';
        }
      } else if (total === 2) {
        if (index === 0) {
          //                    c = C_FEELING_ORANGE;
          c = '#FFBA6B';
        } else if (index === 1) {
          //                    c = F_PEACE_BABY_YELLOW;
          c = '#FFDC8A';
        } else {
          //                    c = H_HONEY_DO;
          c = '#EFFAB4';
        }
      } else if (total === 3) {
        if (index === 0) {
          //                    c = C_FEELING_ORANGE;
          c = '#FFBA6B';
        } else if (index === 1) {
          //                    c = E_ORANGE_SHERBERT;
          c = '#FFC48C';
        } else if (index === 2) {
          //                    c = F_PEACE_BABY_YELLOW;
          c = '#FFDC8A';
        } else {
          //                    c = H_HONEY_DO;
          c = '#EFFAB4';
        }
      } else if (total === 4) {
        if (index === 0) {
          //                    c = C_FEELING_ORANGE;
          c = '#FFBA6B';
        } else if (index === 1) {
          //                    c = D_AFFINITY;
          c = '#FF9F80';
        } else if (index === 2) {
          //                    c = F_PEACE_BABY_YELLOW;
          c = '#FFDC8A';
        } else if (index === 3) {
          //                    c = G_JAYANTHI;
          c = '#FFF19E';
        } else {
          //                    c = H_HONEY_DO;
          c = '#EFFAB4';
        }
      } else if (total === 5) {
        if (index === 0) {
          //                    c = C_FEELING_ORANGE;
          c = '#FFBA6B';
        } else if (index === 1) {
          //                    c = D_AFFINITY;
          c = '#FF9F80';
        } else if (index === 2) {
          //                    c = F_PEACE_BABY_YELLOW;
          c = '#FFDC8A';
        } else if (index === 3) {
          //                    c = G_JAYANTHI;
          c = '#FFF19E';
        } else if (index === 4) {
          //                    c = H_HONEY_DO;
          c = '#EFFAB4';
        } else {
          //                    c = I_SPLASH_OF_LIME;
          c = '#D1F2A5';
        }
      } else {
        if (index === 0) {
          //                    c = C_FEELING_ORANGE;
          c = '#FFBA6B';
        } else if (index === 1) {
          //                    c = D_AFFINITY;
          c = '#FF9F80';
        } else if (index === 2) {
          //                    c = E_ORANGE_SHERBERT;
          c = '#FFC48C';
        } else if (index === 3) {
          //                    c = F_PEACE_BABY_YELLOW;
          c = '#FFDC8A';
        } else if (index === 4) {
          //                    c = G_JAYANTHI;
          c = '#FFF19E';
        } else if (index === 5) {
          //                    c = H_HONEY_DO;
          c = '#EFFAB4';
        } else {
          //                    c = I_SPLASH_OF_LIME;
          c = '#D1F2A5';
        }
      }
      return c;
    };
    return {
      'calculateCriteria': calculateCriteria,
      'getColor': getColor,
      'getColorForCriteria': getColorForCriteria
    };
  }]);