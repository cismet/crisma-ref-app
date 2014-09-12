angular.module('eu.crismaproject.worldstateAnalysis.controllers', [
  'nvd3ChartDirectives',
  'eu.crismaproject.worldstateAnalysis.services',
  'ngDialog'
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
        var field, group, i, iccData, j, k_outer, k_inner, keys_outer, keys_inner, prop, val, criteriaFunction, k, unit, indicatorVector;
        indicatorVector = WorldstateService.utils.stripIccData($scope.worldstates);
        if (!(!$scope.worldstates || $scope.worldstates.length === 0)) {
          $scope.rows = [];
          $scope.columns = [{
              title: $scope.forCriteria ? 'Level of satisfaction (higher is better)' : 'Indicators',
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
                unit = $scope.forCriteria ? '% LoS' : group[prop].unit;
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
                  $scope.rows[j++][field] = { name: val + ' ' + unit };
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
            count: 10000
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
angular.module('eu.crismaproject.worldstateAnalysis.controllers').controller('eu.crismaproject.worldstateAnalysis.controllers.DecisionStrategyDirectiveController', [
  '$scope',
  'de.cismet.crisma.ICMM.Worldstates',
  function ($scope, Worldstates) {
    'use strict';
    var ctrl;
    ctrl = this;
    this.extractIndicators = function (worldstates) {
      var indicatorGroup, indicatorProp, iccObject, group, j, indicatorMap;
      indicatorMap = {};
      $scope.indicatorSize = 0;
      if (worldstates && worldstates.length > 0) {
        for (j = 0; j < worldstates.length; j++) {
          iccObject = Worldstates.utils.stripIccData([worldstates[j]], false)[0];
          for (indicatorGroup in iccObject.data) {
            if (iccObject.data.hasOwnProperty(indicatorGroup)) {
              group = iccObject.data[indicatorGroup];
              for (indicatorProp in group) {
                if (group.hasOwnProperty(indicatorProp)) {
                  if (indicatorProp !== 'displayName' && indicatorProp !== 'iconResource') {
                    if (!indicatorMap[indicatorProp]) {
                      indicatorMap[indicatorProp] = group[indicatorProp];
                      $scope.indicatorSize++;
                    }
                  }
                }
              }
            }
          }
        }
      }
      return indicatorMap;
    };
    $scope.decisionStrategy = $scope.decisionStrategy || {};
    $scope.indicatorSize = $scope.indicatorSize || 0;
    $scope.indicatorMap = $scope.indicatorMap || {};
    $scope.$watch('worldstates', function () {
      $scope.indicatorMap = ctrl.extractIndicators($scope.worldstates);
    }, true);
  }
]);
angular.module('eu.crismaproject.worldstateAnalysis.controllers').controller('eu.crismaproject.worldstateAnalysis.controllers.levelOfEmphasisDirectiveController', [
  '$scope',
  'eu.crismaproject.worldstateAnalysis.services.AnalysisService',
  function ($scope, AnalysisService) {
    'use strict';
    var controller, owa, i;
    controller = this;
    owa = AnalysisService.getOwa();
    this.updateLseVectors = function () {
      if ($scope.indicatorSize >= 1) {
        controller.onlyPositiveLse = [];
        for (i = 0; i < $scope.indicatorSize; i++) {
          if (i === 0) {
            this.onlyPositiveLse[i] = 1;
          } else {
            this.onlyPositiveLse[i] = 0;
          }
        }
        controller.overEmphPosLse = owa.hLSWeights($scope.indicatorSize <= 1 ? 1 : $scope.indicatorSize);
        controller.neutralLse = owa.meanWeights($scope.indicatorSize <= 1 ? 1 : $scope.indicatorSize);
        controller.overEmphNegLse = owa.lLSWeights($scope.indicatorSize <= 1 ? 1 : $scope.indicatorSize);
        controller.onlyNegativeLse = [];
        for (i = 0; i < $scope.indicatorSize; i++) {
          if (i === $scope.indicatorSize - 1) {
            controller.onlyNegativeLse[i] = 1;
          } else {
            controller.onlyNegativeLse[i] = 0;
          }
        }
      }
    };
    this.updateSatisfactionEmphasis = function (lse) {
      var weights;
      switch (parseInt(lse)) {
      case -2: {
          weights = controller.onlyNegativeLse;
          break;
        }
      case -1: {
          weights = controller.overEmphNegLse;
          break;
        }
      case 0: {
          weights = controller.neutralLse;
          break;
        }
      case 1: {
          weights = controller.overEmphPosLse;
          break;
        }
      case 2: {
          weights = controller.onlyPositiveLse;
          break;
        }
      }
      return weights;
    };
    this.satisfactionEmphasisEquals = function (v1, v2) {
      var i;
      if (v1 && v2) {
        if (v1.length === v2.length) {
          for (i = 0; i < v1.length; i++) {
            if (v1[i] !== v2[i]) {
              return false;
            }
          }
          return true;
        }
      }
      return false;
    };
    this.updateInternalModel = function (satisfactionEmphVector) {
      if (controller.satisfactionEmphasisEquals(satisfactionEmphVector, this.onlyNegativeLse)) {
        return -2;
      } else if (controller.satisfactionEmphasisEquals(satisfactionEmphVector, this.overEmphNegLse)) {
        return -1;
      } else if (controller.satisfactionEmphasisEquals(satisfactionEmphVector, this.neutralLse)) {
        return 0;
      } else if (controller.satisfactionEmphasisEquals(satisfactionEmphVector, this.overEmphPosLse)) {
        return 1;
      } else if (controller.satisfactionEmphasisEquals(satisfactionEmphVector, this.onlyPositiveLse)) {
        return 2;
      }
      return 0;
    };
    controller.updateLseVectors();
    if ($scope.indicatorSize >= 1) {
      $scope.model = { lse: $scope.satisfactionEmphasis ? controller.updateInternalModel($scope.satisfactionEmphasis) : 0 };
    }
    $scope.satisfactionEmphasis = $scope.satisfactionEmphasis || controller.updateSatisfactionEmphasis(0);
    $scope.$watch('model', function (newVal, oldVal) {
      if (newVal !== oldVal && $scope.indicatorSize >= 1) {
        $scope.satisfactionEmphasis = controller.updateSatisfactionEmphasis($scope.model.lse);
      }
    }, true);
    $scope.$watch('satisfactionEmphasis', function (newVal, oldVal) {
      if (newVal !== oldVal && $scope.indicatorSize >= 1) {
        $scope.model.lse = controller.updateInternalModel($scope.satisfactionEmphasis);
      }
    }, true);
    $scope.$watch('indicatorSize', function () {
      controller.updateLseVectors();
      if ($scope.indicatorSize >= 1) {
        if (!($scope.model && $scope.model.lse)) {
          $scope.model = { lse: $scope.satisfactionEmphasis ? controller.updateInternalModel($scope.satisfactionEmphasis) : 0 };
        }
        $scope.satisfactionEmphasis = controller.updateSatisfactionEmphasis($scope.model.lse);
      }
    }, true);
  }
]);
angular.module('eu.crismaproject.worldstateAnalysis.controllers').controller('eu.crismaproject.worldstateAnalysis.controllers.WorldstateAnalysisWidgetDirectiveController', [
  '$scope',
  'de.cismet.crisma.ICMM.Worldstates',
  'localStorageService',
  '$timeout',
  function ($scope, Worldstates, localStorageService, $timeout) {
    'use strict';
    var createChartModels, getIndicators;
    $scope.forCriteriaTable = true;
    $scope.chartModels = [];
    createChartModels = function () {
      var j, modelArr;
      $scope.chartModels = [];
      if ($scope.worldstates && $scope.worldstates.length > 0) {
        for (j = 0; j < $scope.worldstates.length; j++) {
          modelArr = [];
          if ($scope.worldstates[j]) {
            modelArr.push($scope.worldstates[j]);
          }
          if ($scope.worldstateRef) {
            modelArr = modelArr.concat($scope.worldstateRef);
          }
          $scope.chartModels.push(modelArr);
        }
      }
    };
    getIndicators = function () {
      var indicatorGroup, indicatorProp, iccObject, group, j, indicatorName, indicator, add, forEachFunc;
      forEachFunc = function (value, index, arr) {
        if (indicatorName === value.displayName) {
          add = false;
        }
        if (index === arr.length - 1 && add) {
          $scope.indicatorVector.push(indicator);
        }
      };
      if ($scope.worldstates && $scope.worldstates.length > 0) {
        for (j = 0; j < $scope.worldstates.length; j++) {
          iccObject = Worldstates.utils.stripIccData([$scope.worldstates[j]], false)[0];
          for (indicatorGroup in iccObject.data) {
            if (iccObject.data.hasOwnProperty(indicatorGroup)) {
              group = iccObject.data[indicatorGroup];
              for (indicatorProp in group) {
                if (group.hasOwnProperty(indicatorProp)) {
                  if (indicatorProp !== 'displayName' && indicatorProp !== 'iconResource') {
                    if ($scope.indicatorVector.length > 0) {
                      indicatorName = group[indicatorProp].displayName;
                      indicator = group[indicatorProp];
                      add = true;
                      $scope.indicatorVector.forEach(forEachFunc);
                    } else {
                      $scope.indicatorVector.push(group[indicatorProp]);
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
    $scope.persistCriteriaFunctions = function () {
      $scope.showPersistSpinner = true;
      $scope.showPersistDone = false;
      $timeout(function () {
        localStorageService.add('criteriaFunctionSet', $scope.criteriaFunctionSets);
        $scope.showPersistSpinner = false;
        $scope.showPersistDone = true;
        $timeout(function () {
          $scope.showPersistDone = false;
        }, 1500);
      }, 500);
    };
    Worldstates.query({ level: 5 }, function (data) {
      $scope.allWorldstates = data;
    });
    $scope.$watch('worldstateRef', function (newVal, oldVal) {
      if (newVal !== oldVal) {
        createChartModels();
        getIndicators();
      }
    });
    $scope.$watch('worldstates', function (newVal, oldVal) {
      if (newVal !== oldVal && $scope.worldstates) {
        createChartModels();
        getIndicators();
      }
    }, true);
    $scope.indicatorVector = [];
  }
]);
angular.module('eu.crismaproject.worldstateAnalysis.controllers').controller('eu.crismaproject.worldstateAnalysis.controllers.criteriaEmphasesController', [
  '$scope',
  function ($scope) {
    'use strict';
    var ctrl, criteriaEmpInternalWatch;
    ctrl = this;
    this.updateCriteriaEmphases = function () {
      var i, item;
      for (i = 0; i < $scope.critEmphInternal.length; i++) {
        item = $scope.critEmphInternal[i];
        if ($scope.criteriaEmphases[i]) {
          $scope.criteriaEmphases[i].criteriaEmphasis = item.criteriaEmphasis;
        } else {
          $scope.criteriaEmphases.push({
            indicator: item.indicator,
            criteriaEmphasis: item.criteriaEmphasis
          });
        }
      }
    };
    this.updateInternalCriteriaEmphases = function () {
      var critEmphExists, newCritEmphInternal, indicatorName;
      newCritEmphInternal = [];
      for (indicatorName in $scope.indicatorMap) {
        if ($scope.indicatorMap.hasOwnProperty(indicatorName)) {
          //check if there is a value for that indicator in the bounded critEmphases
          critEmphExists = false;
          if ($scope.criteriaEmphases && $scope.criteriaEmphases.length !== 0) {
            /*jshint -W083 */
            $scope.criteriaEmphases.forEach(function (critEmph) {
              if (critEmph.indicator.displayName === $scope.indicatorMap[indicatorName].displayName) {
                critEmphExists = true;
                newCritEmphInternal.push(critEmph);
              }
            });
          }
          // create a default criteriaEmphasis of 100
          if (!critEmphExists) {
            newCritEmphInternal.push({
              indicator: $scope.indicatorMap[indicatorName],
              criteriaEmphasis: 100
            });
          }
        }
      }
      $scope.critEmphInternal = newCritEmphInternal;
    };
    this.registerInternalWatch = function () {
      //internal changes (knob) must be propagated...
      criteriaEmpInternalWatch = $scope.$watch('critEmphInternal', function (newVal, oldVal) {
        if (newVal !== oldVal) {
          ctrl.updateCriteriaEmphases();
        }
      }, true);
    };
    $scope.knobMax = 100;
    $scope.knobOptions = {
      'width': 100,
      'height': 80,
      'displayInput': true,
      'angleOffset': -125,
      'angleArc': 250
    };
    $scope.criteriaEmphases = $scope.criteriaEmphases || [];
    $scope.indicatorMap = {};
    $scope.$watch('indicatorMap', function () {
      if ($scope.indicatorMap && Object.keys($scope.indicatorMap).length !== 0) {
        ctrl.updateInternalCriteriaEmphases();
      }
    }, true);
    $scope.$watch('criteriaEmphases', function (newVal, oldVal) {
      // we need to derigster the watch for the internal model, because it changes the external model
      if (newVal !== oldVal) {
        criteriaEmpInternalWatch();
        ctrl.updateInternalCriteriaEmphases();
        $scope.criteriaEmphases = $scope.critEmphInternal;
        ctrl.registerInternalWatch();
      }
    }, true);
    ctrl.registerInternalWatch();
  }
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
                  axis: $scope.useNumbers ? dataItem.length + 1 : indiactor.displayName,
                  tooltip: indiactor.displayName,
                  value: Math.round(ccs.calculateCriteria(indiactor.value, criteriaFunction) * 100) / 100
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
angular.module('eu.crismaproject.worldstateAnalysis.controllers').controller('eu.crismaproject.worldstateAnalysis.controllers.decisionStrategyManagerDirectiveController', [
  '$scope',
  'de.cismet.crisma.ICMM.Worldstates',
  function ($scope, Worldstates) {
    'use strict';
    $scope.editable = [];
    $scope.currentIntervalFunctions = [];
    $scope.selectedDecisionStrategyIndex = -1;
    $scope.tooltipDelete = { title: 'Delete this decision strategy' };
    $scope.tooltipAdd = { title: 'Create a new decision strategy' };
    $scope.tooltipSave = { title: 'Save changes' };
    $scope.tooltipRename = { title: 'Rename decision strategy' };
    $scope.tooltipRenameDone = { title: 'Done' };
    $scope.addDecisionStrategy = function () {
      var i, decisionStrategy = [];
      for (i = 0; i < $scope.worldstates.length; i++) {
        decisionStrategy.push({ indicator: $scope.worldstates[i].displayName });
      }
      $scope.decisionStrategies.push({ name: 'Decision Strategy ' + ($scope.decisionStrategies.length + 1) });
      $scope.editable.push(false);
    };
    $scope.removeDecisionStrategy = function () {
      $scope.decisionStrategies.splice($scope.selectedDecisionStrategyIndex, 1);
    };
    $scope.isActiveItem = function (index) {
      if ($scope.selectedDecisionStrategyIndex === index) {
        return 'list-group-item-info';
      } else {
        return '';
      }
    };
    $scope.setSelectedDecisionStrategy = function (index) {
      $scope.selectedDecisionStrategyIndex = index;
      $scope.currentDecisionStrategy = $scope.decisionStrategies[$scope.selectedDecisionStrategyIndex];
    };
    $scope.updateModel = function () {
      var i, indicatorGroup, indicatorProp, iccObject, group;
      $scope.indicatorVector = [];
      for (i = 0; i < $scope.worldstates.length; i++) {
        iccObject = Worldstates.utils.stripIccData([$scope.worldstates[i]], false)[0];
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
      }
    };
    $scope.worldstates = $scope.worldstates || [];
    $scope.$watch('worldstates', function () {
      $scope.updateModel();
    }, true);
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
        colorClass = 'color-c';
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
angular.module('eu.crismaproject.worldstateAnalysis.controllers').controller('eu.crismaproject.worldstateAnalysis.controllers.indicatorBarChartDirectiveController', [
  '$scope',
  'de.cismet.crisma.ICMM.Worldstates',
  '$filter',
  function ($scope, WorldstateService, $filter) {
    'use strict';
    var ctrl, formatValueFunc;
    ctrl = this;
    formatValueFunc = d3.format('.3s');
    this.createChartModels = function () {
      var i, indicatorMap, indicators, indicatorGroup, indicatorGroupProp, indicatorProp;
      indicatorMap = {};
      for (i = 0; i < $scope.worldstates.length; i++) {
        indicators = WorldstateService.utils.stripIccData([$scope.worldstates[i]])[0].data;
        for (indicatorGroupProp in indicators) {
          if (indicators.hasOwnProperty(indicatorGroupProp)) {
            indicatorGroup = indicators[indicatorGroupProp];
            for (indicatorProp in indicatorGroup) {
              if (indicatorGroup.hasOwnProperty(indicatorProp) && indicatorProp !== 'displayName' && indicatorProp !== 'iconResource') {
                if (!indicatorMap[indicatorProp]) {
                  indicatorMap[indicatorProp] = {
                    key: indicatorGroup[indicatorProp].displayName,
                    forceY: [
                      0,
                      0
                    ],
                    values: []
                  };
                }
                if (parseInt(indicatorGroup[indicatorProp].value) > indicatorMap[indicatorProp].forceY) {
                  indicatorMap[indicatorProp].forceY[1] = parseInt(indicatorGroup[indicatorProp].value);
                }
                indicatorMap[indicatorProp].values.push([
                  $scope.worldstates[i].name,
                  parseInt(indicatorGroup[indicatorProp].value)
                ]);
              }
            }
          }
        }
      }
      var a = [];
      for (indicators in indicatorMap) {
        if (indicatorMap.hasOwnProperty(indicators)) {
          a.push([indicatorMap[indicators]]);
        }
      }
      $scope.chartModels = a;
    };
    var colorCategory = d3.scale.category20().range();
    $scope.colorFunction = function () {
      return function (d, i) {
        return colorCategory[i % colorCategory.length];
      };
    };
    $scope.yAxisTickFormat = function (d) {
      var d3String = formatValueFunc(d);
      return d3String.replace('M', 'Mio').replace('G', 'Mrd').replace('T', 'B');
    };
    $scope.toolTipContentFunction = function () {
      return function (key, x, y, e) {
        return '<h3 style="font-weight:normal; font-size:18px">' + x + '</h3>' + '<p>' + key + ': ' + $filter('number')(e.value) + '</p>';
      };
    };
    $scope.getLegendColor = function ($index) {
      return { 'color': $scope.colorFunction()(0, $index) };
    };
    $scope.$watch('worldstates', function () {
      if ($scope.worldstates && $scope.worldstates.length > 0) {
        ctrl.createChartModels();
      }
    }, true);
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
  '$timeout',
  function ($scope, Nodes, Worldstates, localStorageService, $timeout) {
    'use strict';
    var createChartModels, getIndicators;
    $scope.forCriteriaTable = false;
    $scope.chartModels = [];
    createChartModels = function () {
      var j, modelArr;
      $scope.chartModels = [];
      if ($scope.worldstates && $scope.worldstates.length > 0) {
        for (j = 0; j < $scope.worldstates.length; j++) {
          modelArr = [];
          if ($scope.worldstates[j]) {
            modelArr.push($scope.worldstates[j]);
          }
          if ($scope.worldstateRef) {
            modelArr = modelArr.concat($scope.worldstateRef);
          }
          $scope.chartModels.push(modelArr);
        }
      }
    };
    getIndicators = function () {
      var indicatorGroup, indicatorProp, iccObject, group, j, indicatorName, indicator, add, forEachFunc;
      forEachFunc = function (value, index, arr) {
        if (indicatorName === value.displayName) {
          add = false;
        }
        if (index === arr.length - 1 && add) {
          $scope.indicatorVector.push(indicator);
        }
      };
      if ($scope.worldstates && $scope.worldstates.length > 0) {
        for (j = 0; j < $scope.worldstates.length; j++) {
          iccObject = Worldstates.utils.stripIccData([$scope.worldstates[j]], false)[0];
          for (indicatorGroup in iccObject.data) {
            if (iccObject.data.hasOwnProperty(indicatorGroup)) {
              group = iccObject.data[indicatorGroup];
              for (indicatorProp in group) {
                if (group.hasOwnProperty(indicatorProp)) {
                  if (indicatorProp !== 'displayName' && indicatorProp !== 'iconResource') {
                    if ($scope.indicatorVector.length > 0) {
                      indicatorName = group[indicatorProp].displayName;
                      indicator = group[indicatorProp];
                      add = true;
                      $scope.indicatorVector.forEach(forEachFunc);
                    } else {
                      $scope.indicatorVector.push(group[indicatorProp]);
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
    $scope.persistCriteriaFunctions = function () {
      $scope.showPersistSpinner = true;
      $scope.showPersistDone = false;
      $timeout(function () {
        localStorageService.add('criteriaFunctionSet', $scope.criteriaFunctionSets);
        $scope.showPersistSpinner = false;
        $scope.showPersistDone = true;
        $timeout(function () {
          $scope.showPersistDone = false;
        }, 1500);
      }, 500);
    };
    Worldstates.query({ level: 5 }, function (data) {
      $scope.allWorldstates = data;
    });
    $scope.$watch('worldstateRef', function (newVal, oldVal) {
      if (newVal !== oldVal) {
        createChartModels();
        getIndicators();
      }
    });
    $scope.$watch('worldstates', function (newVal, oldVal) {
      if (newVal !== oldVal && $scope.worldstates) {
        createChartModels();
        getIndicators();
      }
    }, true);
    $scope.indicatorVector = [];
    $scope.criteriaFunctionSet = localStorageService.get('criteriaFunctionSet') || [];
    $scope.criteriaFunctionSets = $scope.criteriaFunctionSet;
    $scope.selectedCriteriaFunction = $scope.criteriaFunctionSet[0];
    $scope.$watch('criteriaFunctionSet', function (newVal, oldVal) {
      if (newVal !== oldVal) {
        console.log('received changes in criteria function');
      }
    }, true);
    $scope.showDsPersistSpinner = false;
    $scope.showDsPersistDone = false;
    $scope.decisionStrategies = localStorageService.get('decisionStrategies') || [];
    $scope.selectedDecisionStrategy = $scope.decisionStrategies[0];
    $scope.persistDecisionStrategies = function () {
      $scope.showDsPersistSpinner = true;
      $scope.showDsPersistDone = false;
      $timeout(function () {
        localStorageService.add('decisionStrategies', $scope.decisionStrategies);
        $scope.showDsPersistSpinner = false;
        $scope.showDsPersistDone = true;
        $timeout(function () {
          $scope.showDsPersistDone = false;
        }, 1500);
      }, 500);
    };
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
    $scope.updateSelectedDecisionStrategy = function (index) {
      $scope.selectedDecisionStrategy = $scope.decisionStrategies[index];
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
        iccItem = iccData[i];
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
angular.module('eu.crismaproject.worldstateAnalysis.controllers').controller('eu.crismaproject.worldstateAnalysis.controllers.worldstateRankingTableDirectiveController', [
  '$scope',
  '$filter',
  'ngTableParams',
  'de.cismet.crisma.ICMM.Worldstates',
  'eu.crismaproject.worldstateAnalysis.services.CriteriaCalculationService',
  'eu.crismaproject.worldstateAnalysis.services.AnalysisService',
  'ngDialog',
  function ($scope, $filter, NgTableParams, Worldstates, ccs, as, ngDialog) {
    'use strict';
    var getOrderedProperties, updateTable, getRankedWorldstates, getCriteriaVectorForWorldstate, extractIndicators, getCritAndWeightVector;
    getOrderedProperties = function (obj) {
      var p, keys;
      keys = [];
      for (p in obj) {
        if (obj.hasOwnProperty(p)) {
          keys.push(p);
        }
      }
      keys.sort();
      return keys;
    };
    extractIndicators = function (worldstate) {
      var indicatorGroup, indicatorProp, iccObject, group, indicators;
      indicators = [];
      if (worldstate) {
        iccObject = Worldstates.utils.stripIccData([worldstate], false)[0];
        for (indicatorGroup in iccObject.data) {
          if (iccObject.data.hasOwnProperty(indicatorGroup)) {
            group = iccObject.data[indicatorGroup];
            for (indicatorProp in group) {
              if (group.hasOwnProperty(indicatorProp)) {
                if (indicatorProp !== 'displayName' && indicatorProp !== 'iconResource') {
                  indicators.push(group[indicatorProp]);
                }
              }
            }
          }
        }
      }
      return indicators;
    };
    getCriteriaVectorForWorldstate = function (ws, critFunc) {
      var indicators, criterias, i;
      indicators = extractIndicators(ws);
      criterias = [];
      if (indicators && indicators.length === critFunc.criteriaFunctions.length) {
        for (i = 0; i < indicators.length; i++) {
          /*jshint -W083 */
          critFunc.criteriaFunctions.forEach(function (cf) {
            if (cf.indicator === indicators[i].displayName) {
              criterias.push({
                indicator: indicators[i],
                criteria: ccs.calculateCriteria(indicators[i].value, cf) / 100
              });
            }
          });
        }
      }
      return criterias;
    };
    getCritAndWeightVector = function (dec, criteria) {
      var critWeight, i, critEmph;
      critWeight = {};
      critWeight.criteria = [];
      critWeight.weights = [];
      for (i = 0; i < dec.criteriaEmphases.length; i++) {
        critEmph = dec.criteriaEmphases[i];
        /*jshint -W083 */
        criteria.forEach(function (c) {
          if (c.indicator.displayName === critEmph.indicator.displayName) {
            critWeight.criteria.push(c.criteria);
            critWeight.weights.push(critEmph.criteriaEmphasis / 100);
          }
        });
      }
      return critWeight;
    };
    getRankedWorldstates = function (worldstates, criteriaFunction, decisionStrategy) {
      var i, ws, crit, score, critWeight, rankedWs, insertIndex;
      rankedWs = [];
      for (i = 0; i < worldstates.length; i++) {
        ws = worldstates[i];
        crit = getCriteriaVectorForWorldstate(ws, criteriaFunction);
        critWeight = getCritAndWeightVector(decisionStrategy, crit);
        score = as.getOwa().aggregateLS(critWeight.criteria, decisionStrategy.satisfactionEmphasis, critWeight.weights);
        if (rankedWs.length === 0) {
          rankedWs.push({
            worldstate: ws,
            score: score
          });
        } else {
          insertIndex = -1;
          /*jshint -W083 */
          rankedWs.forEach(function (rankItem, index) {
            if (insertIndex === -1 && rankItem && rankItem.score && score <= rankItem.score) {
              insertIndex = index;
            }
          });
          if (insertIndex !== -1) {
            rankedWs.splice(insertIndex, 0, {
              worldstate: ws,
              score: score
            });
          } else {
            rankedWs.push({
              worldstate: ws,
              score: score
            });
          }
        }
      }
      rankedWs = rankedWs.reverse();
      rankedWs.forEach(function (item, index) {
        item.rank = index + 1;
      });
      return rankedWs;
    };
    $scope.clickToOpen = function (index) {
      $scope.ws = $scope.tableData[index].ws;
      ngDialog.open({
        template: 'templates/criteriaRadarPopupTemplate.html',
        scope: $scope,
        className: 'ngdialog-theme-default ngdialog-theme-custom ngdialog-theme-width'
      });
    };
    updateTable = function () {
      var rankedWorldstates, i, obj, iccData, indicatorGroup, group, indicatorProp, indicator, crit, addedCriteriaCols;
      if ($scope.criteriaFunction && $scope.decisionStrategy && $scope.worldstates && $scope.worldstates.length > 0) {
        addedCriteriaCols = [];
        //assume the getRankedWorldstates method returns an ascending ordered array / map etc
        rankedWorldstates = getRankedWorldstates($scope.worldstates, $scope.criteriaFunction, $scope.decisionStrategy);
        if (!rankedWorldstates && rankedWorldstates.length <= 0) {
          throw new Error('Could not rank the worldstates...');
        }
        $scope.tooltip = { checked: false };
        $scope.tooltip.title = '';
        $scope.tableData = [];
        if ($scope.showRadarChart) {
          var f = extractIndicators($scope.worldstates[0]);
          for (i = 0; i < f.length; i++) {
            $scope.tooltip.title = $scope.tooltip.title + '<br/>' + (i + 1) + ': ' + f[i].displayName;
          }
        }
        $scope.columns = [
          {
            title: 'Rank',
            field: 'rank'
          },
          {
            title: 'Worldstate',
            field: 'worldstate'
          },
          {
            title: 'Score',
            field: 'score'
          }
        ];
        for (i = 0; i < rankedWorldstates.length; i++) {
          obj = {
            'rank': rankedWorldstates[i].rank,
            'worldstate': rankedWorldstates[i].worldstate.name,
            'ws': rankedWorldstates[i].worldstate,
            'score': $filter('number')(rankedWorldstates[i].score * 100, 2) + ' %'
          };
          if ($scope.showIndicators) {
            //we want to add the indicator and criteria....
            iccData = Worldstates.utils.stripIccData([rankedWorldstates[i].worldstate])[0].data;
            for (indicatorGroup in iccData) {
              if (iccData.hasOwnProperty(indicatorGroup)) {
                group = iccData[indicatorGroup];
                for (indicatorProp in group) {
                  if (group.hasOwnProperty(indicatorProp) && indicatorProp !== 'displayName' && indicatorProp !== 'iconResource') {
                    indicator = group[indicatorProp];
                    crit = 0;
                    /*jshint -W083 */
                    $scope.criteriaFunction.criteriaFunctions.forEach(function (cf) {
                      if (cf.indicator === indicator.displayName) {
                        crit = ccs.calculateCriteria(indicator.value, cf);
                      }
                    });
                    obj[indicator.displayName] = {
                      indicator: $filter('number')(indicator.value) + ' ' + indicator.unit,
                      los: $filter('number')(crit, 2) + ' % LoS'
                    };
                    if (addedCriteriaCols.indexOf(indicator.displayName) === -1) {
                      addedCriteriaCols.push(indicator.displayName);
                      $scope.columns.push({
                        title: $scope.showRadarChart ? indicator.displayName + ' (' + ($scope.columns.length - 2) + ')' : indicator.displayName,
                        field: indicator.displayName
                      });
                    }
                  }
                }
              }
            }
          }
          $scope.tableData.push(obj);
        }
        if ($scope.tableParams) {
          $scope.tableParams.reload();
        } else {
          $scope.tableParams = new NgTableParams({
            page: 1,
            count: 1000,
            sorting: { name: 'asc' }
          }, {
            counts: [],
            total: 1,
            getData: function ($defer, params) {
              // use build-in angular filter
              var orderedData = params.sorting() ? $filter('orderBy')($scope.tableData, params.orderBy()) : $scope.tableData;
              params.total(orderedData.length);
              // set total for recalc pagination
              $defer.resolve($scope.tableData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
            }
          });
        }
      }
    };
    $scope.tableVisibleSwitch = '0';
    $scope.$watch('worldstates', function () {
      if ($scope.worldstates && $scope.worldstates.length > 0) {
        updateTable();
      }
    }, true);
    $scope.$watch('decisionStrategy', function (newVal, oldVal) {
      if (newVal !== oldVal && $scope.worldstates && $scope.worldstates.length > 0) {
        updateTable();
      }
    }, true);
    $scope.$watch('criteriaFunction', function (newVal, oldVal) {
      if (newVal !== oldVal && $scope.worldstates && $scope.worldstates.length > 0) {
        updateTable();
      }
    }, true);
    $scope.$watch('showIndicators', function (newVal, oldVal) {
      if (newVal !== oldVal && $scope.worldstates && $scope.worldstates.length > 0) {
        updateTable();
      }
    });
    $scope.$watch('showRadarChart', function (newVal, oldVal) {
      if (newVal !== oldVal && $scope.worldstates && $scope.worldstates.length > 0) {
        updateTable();
      }
    });
  }
]);
angular.module('eu.crismaproject.worldstateAnalysis.directives').directive('knob', function () {
  'use strict';
  return {
    restrict: 'EACM',
    template: function () {
      return '<input ng-model="knobData">';
    },
    replace: true,
    scope: {
      knobData: '=',
      knobOptions: '='
    },
    link: function (scope, elem) {
      var renderKnob = function () {
        var $elem, knobOptions;
        knobOptions = scope.knobOptions || {
          'max': 100,
          'width': 100,
          'height': 100,
          'displayInput': false,
          'angleOffset': -125,
          'angleArc': 250
        };
        knobOptions.release = function (v) {
          scope.knobData = v;
          scope.$apply();
        };
        $elem = elem;
        $elem.val(scope.knobData);
        $elem.knob(knobOptions);
        //
        elem.find('div').css('display', 'block').css('margin', '0 auto');
      };
      scope.$watch('knobData', function () {
        renderKnob();
      }, true);
      scope.$watch('knobOptions', function () {
        renderKnob();
      });
    }
  };
});
angular.module('eu.crismaproject.worldstateAnalysis.directives').directive('criteriaEmphasis', [function () {
    'use strict';
    var scope;
    scope = {
      criteriaEmphases: '=',
      indicatorMap: '='
    };
    return {
      scope: scope,
      restrict: 'E',
      templateUrl: 'templates/criteriaEmphasesTemplate.html',
      controller: 'eu.crismaproject.worldstateAnalysis.controllers.criteriaEmphasesController'
    };
  }]);
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
    var scope, linkFunction, drawLegend, augmentWithTooltips;
    scope = {
      localModel: '&worldstates',
      criteriaFunction: '=',
      showLegend: '=',
      showAxisText: '=',
      useNumbers: '='
    };
    augmentWithTooltips = function (elem) {
      d3.select(elem[0]).selectAll('circle').select('title').text(function (j) {
        return j.tooltip + ': ' + Math.max(j.value, 0);
      });
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
          if (scope.showLegend) {
            drawLegend(elem, cfg, scope.legendItems);
          }
          if (scope.useNumbers) {
            augmentWithTooltips(elem, cfg, scope.legendItems);
          }
        }
      };
      //we want the chart to adjust to the size of the element it is placed in
      width = elem.width ? elem.width() : 200;
      //                width =  200;
      cfg = {
        w: width,
        h: width,
        maxValue: 100,
        levels: 4,
        axisText: angular.isDefined(scope.showAxisText) ? scope.showAxisText ? true : false : false,
        showTooltip: scope.useNumbers
      };
      scope.$watchCollection('localModel()', watchCallback);
      scope.$watch('criteriaFunction', watchCallback, true);
    };
    return {
      scope: scope,
      restrict: 'AE',
      link: linkFunction,
      controller: 'eu.crismaproject.worldstateAnalysis.controllers.CriteriaRadarChartDirectiveController'
    };
  }
]);
angular.module('eu.crismaproject.worldstateAnalysis.directives').directive('decisionStrategy', [function () {
    'use strict';
    var scope;
    scope = {
      worldstates: '=',
      decisionStrategy: '='
    };
    return {
      scope: scope,
      restrict: 'E',
      templateUrl: 'templates/decisionStrategyTemplate.html',
      controller: 'eu.crismaproject.worldstateAnalysis.controllers.DecisionStrategyDirectiveController'
    };
  }]);
angular.module('eu.crismaproject.worldstateAnalysis.directives').directive('decisionStrategyManager', [function () {
    'use strict';
    var scope;
    scope = {
      worldstates: '=',
      decisionStrategies: '='
    };
    return {
      scope: scope,
      restrict: 'E',
      templateUrl: 'templates/decisionStrategyManagerTemplate.html',
      controller: 'eu.crismaproject.worldstateAnalysis.controllers.decisionStrategyManagerDirectiveController'
    };
  }]);
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
angular.module('eu.crismaproject.worldstateAnalysis.directives').directive('indicatorBarCharts', [function () {
    'use strict';
    var scope;
    scope = { worldstates: '=' };
    return {
      scope: scope,
      restrict: 'E',
      templateUrl: 'templates/indicatorBarChartTemplate.html',
      controller: 'eu.crismaproject.worldstateAnalysis.controllers.indicatorBarChartDirectiveController'
    };
  }]);
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
angular.module('eu.crismaproject.worldstateAnalysis.directives').directive('levelOfEmphasis', [function () {
    'use strict';
    var scope;
    scope = {
      satisfactionEmphasis: '=',
      indicatorSize: '=',
      expertMode: '='
    };
    return {
      scope: scope,
      restrict: 'E',
      templateUrl: 'templates/levelOfEmphasisTemplate.html',
      controller: 'eu.crismaproject.worldstateAnalysis.controllers.levelOfEmphasisDirectiveController'
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
angular.module('eu.crismaproject.worldstateAnalysis.directives').directive('worldstateAnalysisWidget', [function () {
    'use strict';
    var scope;
    scope = {
      worldstates: '=',
      criteriaFunctionSets: '=',
      selectedCriteriaFunction: '='
    };
    return {
      scope: scope,
      restrict: 'E',
      templateUrl: 'templates/worldstateAnalysisWidgetTemplate.html',
      controller: 'eu.crismaproject.worldstateAnalysis.controllers.WorldstateAnalysisWidgetDirectiveController'
    };
  }]);
angular.module('eu.crismaproject.worldstateAnalysis.directives').directive('worldstateRankingTable', [function () {
    'use strict';
    var scope;
    scope = {
      worldstates: '=',
      criteriaFunction: '=',
      decisionStrategy: '=',
      showIndicators: '=',
      showRadarChart: '='
    };
    return {
      scope: scope,
      restrict: 'E',
      templateUrl: 'templates/worldstateRankingTableTemplate.html',
      controller: 'eu.crismaproject.worldstateAnalysis.controllers.worldstateRankingTableDirectiveController'
    };
  }]);
var RadarChart = {
    draw: function (id, d, options) {
      var cfg = {
          radius: 5,
          w: 600,
          h: 600,
          factor: 1,
          factorLegend: 0.85,
          levels: 3,
          maxValue: 0,
          radians: 2 * Math.PI,
          opacityArea: 0.5,
          ToRight: 5,
          TranslateX: 80,
          TranslateY: 30,
          ExtraWidthX: 100,
          ExtraWidthY: 100,
          color: d3.scale.category10()
        };
      if ('undefined' !== typeof options) {
        for (var i in options) {
          if ('undefined' !== typeof options[i]) {
            cfg[i] = options[i];
          }
        }
      }
      cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function (i) {
        return d3.max(i.map(function (o) {
          return o.value;
        }));
      }));
      var allAxis = d[0].map(function (i, j) {
          return i.axis;
        });
      var total = allAxis.length;
      var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
      var Format = d3.format('%');
      d3.select(id).select('svg').remove();
      var g = d3.select(id).append('svg').attr('width', cfg.w + cfg.ExtraWidthX).attr('height', cfg.h + cfg.ExtraWidthY).append('g').attr('transform', 'translate(' + cfg.TranslateX + ',' + cfg.TranslateY + ')');
      ;
      var tooltip;
      //Circular segments
      for (var j = 0; j < cfg.levels - 1; j++) {
        var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
        g.selectAll('.levels').data(allAxis).enter().append('svg:line').attr('x1', function (d, i) {
          return levelFactor * (1 - cfg.factor * Math.sin(i * cfg.radians / total));
        }).attr('y1', function (d, i) {
          return levelFactor * (1 - cfg.factor * Math.cos(i * cfg.radians / total));
        }).attr('x2', function (d, i) {
          return levelFactor * (1 - cfg.factor * Math.sin((i + 1) * cfg.radians / total));
        }).attr('y2', function (d, i) {
          return levelFactor * (1 - cfg.factor * Math.cos((i + 1) * cfg.radians / total));
        }).attr('class', 'line').style('stroke', 'grey').style('stroke-opacity', '0.75').style('stroke-width', '0.3px').attr('transform', 'translate(' + (cfg.w / 2 - levelFactor) + ', ' + (cfg.h / 2 - levelFactor) + ')');
      }
      //Text indicating at what % each level is
      for (var j = 0; j < cfg.levels; j++) {
        var levelFactor = cfg.factor * radius * ((j + 1) / cfg.levels);
        g.selectAll('.levels').data([1]).enter().append('svg:text').attr('x', function (d) {
          return levelFactor * (1 - cfg.factor * Math.sin(0));
        }).attr('y', function (d) {
          return levelFactor * (1 - cfg.factor * Math.cos(0));
        }).attr('class', 'legend').style('font-family', 'sans-serif').style('font-size', '10px').attr('transform', 'translate(' + (cfg.w / 2 - levelFactor + cfg.ToRight) + ', ' + (cfg.h / 2 - levelFactor) + ')').attr('fill', '#737373').text(Format((j + 1) * cfg.maxValue / cfg.levels));
      }
      series = 0;
      var axis = g.selectAll('.axis').data(allAxis).enter().append('g').attr('class', 'axis');
      axis.append('line').attr('x1', cfg.w / 2).attr('y1', cfg.h / 2).attr('x2', function (d, i) {
        return cfg.w / 2 * (1 - cfg.factor * Math.sin(i * cfg.radians / total));
      }).attr('y2', function (d, i) {
        return cfg.h / 2 * (1 - cfg.factor * Math.cos(i * cfg.radians / total));
      }).attr('class', 'line').style('stroke', 'grey').style('stroke-width', '1px');
      axis.append('text').attr('class', 'legend').text(function (d) {
        return d;
      }).style('font-family', 'sans-serif').style('font-size', '11px').attr('text-anchor', 'middle').attr('dy', '1.5em').attr('transform', function (d, i) {
        return 'translate(0, -10)';
      }).attr('x', function (d, i) {
        return cfg.w / 2 * (1 - cfg.factorLegend * Math.sin(i * cfg.radians / total)) - 60 * Math.sin(i * cfg.radians / total);
      }).attr('y', function (d, i) {
        return cfg.h / 2 * (1 - Math.cos(i * cfg.radians / total)) - 20 * Math.cos(i * cfg.radians / total);
      });
      d.forEach(function (y, x) {
        dataValues = [];
        g.selectAll('.nodes').data(y, function (j, i) {
          dataValues.push([
            cfg.w / 2 * (1 - parseFloat(Math.max(j.value, 0)) / cfg.maxValue * cfg.factor * Math.sin(i * cfg.radians / total)),
            cfg.h / 2 * (1 - parseFloat(Math.max(j.value, 0)) / cfg.maxValue * cfg.factor * Math.cos(i * cfg.radians / total))
          ]);
        });
        dataValues.push(dataValues[0]);
        g.selectAll('.area').data([dataValues]).enter().append('polygon').attr('class', 'radar-chart-serie' + series).style('stroke-width', '2px').style('stroke', cfg.color(series)).attr('points', function (d) {
          var str = '';
          for (var pti = 0; pti < d.length; pti++) {
            str = str + d[pti][0] + ',' + d[pti][1] + ' ';
          }
          return str;
        }).style('fill', function (j, i) {
          return cfg.color(series);
        }).style('fill-opacity', cfg.opacityArea).on('mouseover', function (d) {
          z = 'polygon.' + d3.select(this).attr('class');
          g.selectAll('polygon').transition(200).style('fill-opacity', 0.1);
          g.selectAll(z).transition(200).style('fill-opacity', 0.7);
        }).on('mouseout', function () {
          g.selectAll('polygon').transition(200).style('fill-opacity', cfg.opacityArea);
        });
        series++;
      });
      series = 0;
      d.forEach(function (y, x) {
        g.selectAll('.nodes').data(y).enter().append('svg:circle').attr('class', 'radar-chart-serie' + series).attr('r', cfg.radius).attr('alt', function (j) {
          return Math.max(j.value, 0);
        }).attr('cx', function (j, i) {
          dataValues.push([
            cfg.w / 2 * (1 - parseFloat(Math.max(j.value, 0)) / cfg.maxValue * cfg.factor * Math.sin(i * cfg.radians / total)),
            cfg.h / 2 * (1 - parseFloat(Math.max(j.value, 0)) / cfg.maxValue * cfg.factor * Math.cos(i * cfg.radians / total))
          ]);
          return cfg.w / 2 * (1 - Math.max(j.value, 0) / cfg.maxValue * cfg.factor * Math.sin(i * cfg.radians / total));
        }).attr('cy', function (j, i) {
          return cfg.h / 2 * (1 - Math.max(j.value, 0) / cfg.maxValue * cfg.factor * Math.cos(i * cfg.radians / total));
        }).attr('data-id', function (j) {
          return j.axis;
        }).style('fill', cfg.color(series)).style('fill-opacity', 0.9).on('mouseover', function (d) {
          newX = parseFloat(d3.select(this).attr('cx')) - 10;
          newY = parseFloat(d3.select(this).attr('cy')) - 5;
          tooltip.attr('x', newX).attr('y', newY).text(Format(d.value)).transition(200).style('opacity', 1);
          z = 'polygon.' + d3.select(this).attr('class');
          g.selectAll('polygon').transition(200).style('fill-opacity', 0.1);
          g.selectAll(z).transition(200).style('fill-opacity', 0.7);
        }).on('mouseout', function () {
          tooltip.transition(200).style('opacity', 0);
          g.selectAll('polygon').transition(200).style('fill-opacity', cfg.opacityArea);
        }).append('svg:title').text(function (j) {
          return Math.max(j.value, 0);
        });
        series++;
      });
      //Tooltip
      tooltip = g.append('text').style('opacity', 0).style('font-family', 'sans-serif').style('font-size', '13px');
    }
  };
var RadarChart = {
    draw: function (e, t, n) {
      var r = {
          radius: 5,
          w: 600,
          h: 600,
          factor: 1,
          factorLegend: 0.85,
          levels: 3,
          maxValue: 0,
          radians: 2 * Math.PI,
          opacityArea: 0.5,
          color: d3.scale.category10()
        };
      if ('undefined' !== typeof n) {
        for (var i in n) {
          if ('undefined' !== typeof n[i]) {
            r[i] = n[i];
          }
        }
      }
      r.maxValue = Math.max(r.maxValue, d3.max(t, function (e) {
        return d3.max(e.map(function (e) {
          return e.value;
        }));
      }));
      var s = t[0].map(function (e, t) {
          return e.axis;
        });
      var o = s.length;
      var u = r.factor * Math.min(r.w / 2, r.h / 2);
      d3.select(e).select('svg').remove();
      var a = d3.select(e).append('svg').attr('width', r.w).attr('height', r.h).append('g');
      var f;
      for (var l = 0; l < r.levels; l++) {
        var c = r.factor * u * ((l + 1) / r.levels);
        a.selectAll('.levels').data(s).enter().append('svg:line').attr('x1', function (e, t) {
          return c * (1 - r.factor * Math.sin(t * r.radians / o));
        }).attr('y1', function (e, t) {
          return c * (1 - r.factor * Math.cos(t * r.radians / o));
        }).attr('x2', function (e, t) {
          return c * (1 - r.factor * Math.sin((t + 1) * r.radians / o));
        }).attr('y2', function (e, t) {
          return c * (1 - r.factor * Math.cos((t + 1) * r.radians / o));
        }).attr('class', 'line').style('stroke', 'grey').style('stroke-width', '0.5px').attr('transform', 'translate(' + (r.w / 2 - c) + ', ' + (r.h / 2 - c) + ')');
      }
      series = 0;
      var h = a.selectAll('.axis').data(s).enter().append('g').attr('class', 'axis');
      h.append('line').attr('x1', r.w / 2).attr('y1', r.h / 2).attr('x2', function (e, t) {
        return r.w / 2 * (1 - r.factor * Math.sin(t * r.radians / o));
      }).attr('y2', function (e, t) {
        return r.h / 2 * (1 - r.factor * Math.cos(t * r.radians / o));
      }).attr('class', 'line').style('stroke', 'grey').style('stroke-width', '1px');
      h.append('text').attr('class', 'legend').text(function (e) {
        return e;
      }).style('font-family', 'sans-serif').style('font-size', '10px').attr('transform', function (e, t) {
        return 'translate(0, -10)';
      }).attr('x', function (e, t) {
        return r.w / 2 * (1 - r.factorLegend * Math.sin(t * r.radians / o)) - 20 * Math.sin(t * r.radians / o);
      }).attr('y', function (e, t) {
        return r.h / 2 * (1 - Math.cos(t * r.radians / o)) + 20 * Math.cos(t * r.radians / o);
      });
      t.forEach(function (e, t) {
        dataValues = [];
        a.selectAll('.nodes').data(e, function (e, t) {
          dataValues.push([
            r.w / 2 * (1 - parseFloat(Math.max(e.value, 0)) / r.maxValue * r.factor * Math.sin(t * r.radians / o)),
            r.h / 2 * (1 - parseFloat(Math.max(e.value, 0)) / r.maxValue * r.factor * Math.cos(t * r.radians / o))
          ]);
        });
        dataValues.push(dataValues[0]);
        a.selectAll('.area').data([dataValues]).enter().append('polygon').attr('class', 'radar-chart-serie' + series).style('stroke-width', '2px').style('stroke', r.color(series)).attr('points', function (e) {
          var t = '';
          for (var n = 0; n < e.length; n++) {
            t = t + e[n][0] + ',' + e[n][1] + ' ';
          }
          return t;
        }).style('fill', function (e, t) {
          return r.color(series);
        }).style('fill-opacity', r.opacityArea).on('mouseover', function (e) {
          z = 'polygon.' + d3.select(this).attr('class');
          a.selectAll('polygon').transition(200).style('fill-opacity', 0.1);
          a.selectAll(z).transition(200).style('fill-opacity', 0.7);
        }).on('mouseout', function () {
          a.selectAll('polygon').transition(200).style('fill-opacity', r.opacityArea);
        });
        series++;
      });
      series = 0;
      t.forEach(function (e, t) {
        a.selectAll('.nodes').data(e).enter().append('svg:circle').attr('class', 'radar-chart-serie' + series).attr('r', r.radius).attr('alt', function (e) {
          return Math.max(e.value, 0);
        }).attr('cx', function (e, t) {
          dataValues.push([
            r.w / 2 * (1 - parseFloat(Math.max(e.value, 0)) / r.maxValue * r.factor * Math.sin(t * r.radians / o)),
            r.h / 2 * (1 - parseFloat(Math.max(e.value, 0)) / r.maxValue * r.factor * Math.cos(t * r.radians / o))
          ]);
          return r.w / 2 * (1 - Math.max(e.value, 0) / r.maxValue * r.factor * Math.sin(t * r.radians / o));
        }).attr('cy', function (e, t) {
          return r.h / 2 * (1 - Math.max(e.value, 0) / r.maxValue * r.factor * Math.cos(t * r.radians / o));
        }).attr('data-id', function (e) {
          return e.axis;
        }).style('fill', r.color(series)).style('fill-opacity', 0.9).on('mouseover', function (e) {
          newX = parseFloat(d3.select(this).attr('cx')) - 10;
          newY = parseFloat(d3.select(this).attr('cy')) - 5;
          f.attr('x', newX).attr('y', newY).text(e.value).transition(200).style('opacity', 1);
          z = 'polygon.' + d3.select(this).attr('class');
          a.selectAll('polygon').transition(200).style('fill-opacity', 0.1);
          a.selectAll(z).transition(200).style('fill-opacity', 0.7);
        }).on('mouseout', function () {
          f.transition(200).style('opacity', 0);
          a.selectAll('polygon').transition(200).style('fill-opacity', r.opacityArea);
        }).append('svg:title').text(function (e) {
          return Math.max(e.value, 0);
        });
        series++;
      });
      f = a.append('text').style('opacity', 0).style('font-family', 'sans-serif').style('font-size', 13);
    }
  };
var RadarChart = {
    draw: function (id, d, options) {
      var cfg = {
          radius: 5,
          w: 600,
          h: 600,
          factor: 0.95,
          factorLegend: 1,
          levels: 3,
          maxValue: 0,
          radians: 2 * Math.PI,
          opacityArea: 0.5,
          color: d3.scale.category10(),
          fontSize: 10
        };
      if ('undefined' !== typeof options) {
        for (var i in options) {
          if ('undefined' !== typeof options[i]) {
            cfg[i] = options[i];
          }
        }
      }
      cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function (i) {
        return d3.max(i.map(function (o) {
          return o.value;
        }));
      }));
      var allAxis = d[0].map(function (i, j) {
          return i.axis;
        });
      var total = allAxis.length;
      var radius = cfg.factor * Math.min(cfg.w / 2, cfg.h / 2);
      d3.select(id).select('svg').remove();
      var g = d3.select(id).append('svg').attr('width', cfg.w).attr('height', cfg.h).append('g');
      var tooltip;
      function getPosition(i, range, factor, func) {
        factor = typeof factor !== 'undefined' ? factor : 1;
        return range * (1 - factor * func(i * cfg.radians / total));
      }
      function getHorizontalPosition(i, range, factor) {
        return getPosition(i, range, factor, Math.sin);
      }
      function getVerticalPosition(i, range, factor) {
        return getPosition(i, range, factor, Math.cos);
      }
      for (var j = 0; j < cfg.levels; j++) {
        var levelFactor = radius * ((j + 1) / cfg.levels);
        g.selectAll('.levels').data(allAxis).enter().append('svg:line').attr('x1', function (d, i) {
          return getHorizontalPosition(i, levelFactor);
        }).attr('y1', function (d, i) {
          return getVerticalPosition(i, levelFactor);
        }).attr('x2', function (d, i) {
          return getHorizontalPosition(i + 1, levelFactor);
        }).attr('y2', function (d, i) {
          return getVerticalPosition(i + 1, levelFactor);
        }).attr('class', 'line').style('stroke', 'grey').style('stroke-width', '0.5px').attr('transform', 'translate(' + (cfg.w / 2 - levelFactor) + ', ' + (cfg.h / 2 - levelFactor) + ')');
      }
      series = 0;
      var axis = g.selectAll('.axis').data(allAxis).enter().append('g').attr('class', 'axis');
      axis.append('line').attr('x1', cfg.w / 2).attr('y1', cfg.h / 2).attr('x2', function (j, i) {
        return getHorizontalPosition(i, cfg.w / 2, cfg.factor);
      }).attr('y2', function (j, i) {
        return getVerticalPosition(i, cfg.h / 2, cfg.factor);
      }).attr('class', 'line').style('stroke', 'grey').style('stroke-width', '1px');
      if (cfg.axisText) {
        axis.append('text').attr('class', 'legend').text(function (d) {
          return d;
        }).style('font-family', 'sans-serif').style('font-size', cfg.fontSize + 'px').style('text-anchor', function (d, i) {
          var p = getHorizontalPosition(i, 0.5);
          return p < 0.4 ? 'start' : p > 0.6 ? 'end' : 'middle';
        }).attr('transform', function (d, i) {
          var p = getVerticalPosition(i, cfg.h / 2);
          return p < cfg.fontSize ? 'translate(0, ' + (cfg.fontSize - p) + ')' : '';
        }).attr('x', function (d, i) {
          return getHorizontalPosition(i, cfg.w / 2, cfg.factorLegend);
        }).attr('y', function (d, i) {
          return getVerticalPosition(i, cfg.h / 2, cfg.factorLegend);
        });
      }
      d.forEach(function (y, x) {
        dataValues = [];
        g.selectAll('.nodes').data(y, function (j, i) {
          dataValues.push([
            getHorizontalPosition(i, cfg.w / 2, parseFloat(Math.max(j.value, 0)) / cfg.maxValue * cfg.factor),
            getVerticalPosition(i, cfg.h / 2, parseFloat(Math.max(j.value, 0)) / cfg.maxValue * cfg.factor)
          ]);
        });
        dataValues.push(dataValues[0]);
        g.selectAll('.area').data([dataValues]).enter().append('polygon').attr('class', 'radar-chart-serie' + series).style('stroke-width', '2px').style('stroke', cfg.color(series)).attr('points', function (d) {
          var str = '';
          for (var pti = 0; pti < d.length; pti++) {
            str = str + d[pti][0] + ',' + d[pti][1] + ' ';
          }
          return str;
        }).style('fill', function (j, i) {
          return cfg.color(series);
        }).style('fill-opacity', cfg.opacityArea).on('mouseover', function (d) {
          z = 'polygon.' + d3.select(this).attr('class');
          g.selectAll('polygon').transition(200).style('fill-opacity', 0.1);
          g.selectAll(z).transition(200).style('fill-opacity', 0.7);
        }).on('mouseout', function () {
          g.selectAll('polygon').transition(200).style('fill-opacity', cfg.opacityArea);
        });
        series++;
      });
      series = 0;
      d.forEach(function (y, x) {
        g.selectAll('.nodes').data(y).enter().append('svg:circle').attr('class', 'radar-chart-serie' + series).attr('r', cfg.radius).attr('alt', function (j) {
          return Math.max(j.value, 0);
        }).attr('cx', function (j, i) {
          dataValues.push([
            getHorizontalPosition(i, cfg.w / 2, parseFloat(Math.max(j.value, 0)) / cfg.maxValue * cfg.factor),
            getVerticalPosition(i, cfg.h / 2, parseFloat(Math.max(j.value, 0)) / cfg.maxValue * cfg.factor)
          ]);
          return getHorizontalPosition(i, cfg.w / 2, Math.max(j.value, 0) / cfg.maxValue * cfg.factor);
        }).attr('cy', function (j, i) {
          return getVerticalPosition(i, cfg.h / 2, Math.max(j.value, 0) / cfg.maxValue * cfg.factor);
        }).attr('data-id', function (j) {
          return j.axis;
        }).style('fill', cfg.color(series)).style('fill-opacity', 0.9).on('mouseover', function (d) {
          newX = parseFloat(d3.select(this).attr('cx')) - 10;
          newY = parseFloat(d3.select(this).attr('cy')) - 5;
          tooltip.attr('x', newX).attr('y', newY).text(d.value).transition(200).style('opacity', 1);
          z = 'polygon.' + d3.select(this).attr('class');
          g.selectAll('polygon').transition(200).style('fill-opacity', 0.1);
          g.selectAll(z).transition(200).style('fill-opacity', 0.7);
        }).on('mouseout', function () {
          tooltip.transition(200).style('opacity', 0);
          g.selectAll('polygon').transition(200).style('fill-opacity', cfg.opacityArea);
        }).append('svg:title').text(function (j) {
          return Math.max(j.value, 0);
        });
        series++;
      });
      //Tooltip
      tooltip = g.append('text').style('opacity', 0).style('font-family', 'sans-serif').style('font-size', '13px');
    }
  };
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