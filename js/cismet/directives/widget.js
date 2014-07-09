angular.module(
    'de.cismet.smartAdmin.directives'
    ).directive(
    'widgetGrid',
    [
        '$timeout',
        function ($timeout) {
            'use strict';
            return {
                restrict: 'E',
                templateUrl: 'templates/widget-grid.html',
                replace: true,
                transclude: true,
                link: function ($scope, $element) {
                    $timeout(function () {
                    $element.jarvisWidgets({
                        grid: 'article',
                        widgets: '.jarviswidget',
//                        localStorage: true,
                        deleteSettingsKey: '#deletesettingskey-options',
                        settingsKeyLabel: 'Reset settings?',
                        deletePositionKey: '#deletepositionkey-options',
                        positionKeyLabel: 'Reset position?',
                        sortable: true,
                        buttonsHidden: false,
                        // toggle button
                        toggleButton: true,
                        toggleClass: 'fa fa-minus | fa fa-plus',
                        toggleSpeed: 200,
//                            onToggle: function () {
//                            },
                        // delete btn
                        deleteButton: true,
                        deleteClass: 'fa fa-times',
                        deleteSpeed: 200,
//                            onDelete: function () {
//                            },
                        // edit btn
                        editButton: true,
                        editPlaceholder: '.jarviswidget-editbox',
                        editClass: 'fa fa-cog | fa fa-save',
                        editSpeed: 200,
//                            onEdit: function () {
//                            },
                        // color button
                        colorButton: true,
                        // full screen
                        fullscreenButton: true,
                        fullscreenClass: 'fa fa-expand | fa fa-compress',
                        fullscreenDiff: 3,
//                            onFullscreen: function () {
//                            },
                        // custom btn
//                            customButton: false,
//                            customClass: 'folder-10 | next-10',
//                            customStart: function () {
//                                alert('Hello you, this is a custom button...')
//                            },
//                            customEnd: function () {
//                                alert('bye, till next time...')
//                            },
                        // order
                        buttonOrder: '%refresh% %custom% %edit% %toggle% %fullscreen% %delete%',
                        opacity: 1.0,
                        dragHandle: '> header',
                        placeholderClass: 'jarviswidget-placeholder',
                        indicator: true,
                        indicatorTime: 600,
                        ajax: true,
                        timestampPlaceholder: '.jarviswidget-timestamp',
                        timestampFormat: 'Last update: %m%/%d%/%y% %h%:%i%:%s%',
                        refreshButton: true,
                        refreshButtonClass: 'fa fa-refresh',
                        labelError: 'Sorry but there was a error:',
                        labelUpdated: 'Last Update:',
                        labelRefresh: 'Refresh',
                        labelDelete: 'Delete widget:',
//                            afterLoad: function () {
//                            },
                        rtl: false, // best not to toggle this!
//                            onChange: function () {
//
//                            },
//                            onSave: function () {
//
//                            },
                        ajaxnav: false // declears how the localstorage should be saved
                    });
                    }, 0);
                }
            };
        }
    ]
    ).directive(
    'widgetContainer',
    [
        function () {
            'use strict;'
            return {
                restrict: 'E',
                templateUrl: 'templates/widget-container.html',
                replace: true,
                scope: {
                    dataslot: '=',
                    renderingDescriptor: '=',
                    worldstate: '='
                },
                controller: function ($scope) {
                    this.dataslot = $scope.dataslot;
                    this.worldstate = $scope.worldstate;
//                    if (Object.prototype.toString.call($scope.dataslot) === '[object Array]') {
//                        $scope.renderingDescriptor = $scope.dataslot[0].renderingDescriptor[0];
//                    }else{

//                    $scope.renderingDescriptor = $scope.dataslot.renderingDescriptor[0];
//                    }
                    $scope.containerClasses = [];
                    $scope.containerClasses.push($scope.renderingDescriptor.gridWidth);
                },
                link: function (scope, elem) {
                }
            };
        }
    ]
    ).directive(
    'widgetBody',
    [
        '$compile',
        function ($compile) {
            'use strict';
            return {
                restrict: 'A',
                require: '^widgetContainer',
                link: function (scope, elem, attrs, widgetContainerCtrl) {
                    var directiveToInclude = scope.renderingDescriptor.bodyDirective || false,
                        template, compiledBody;
                    scope.parentCtrl = widgetContainerCtrl;
                    scope.dataslots = widgetContainerCtrl.dataslot;
                    scope.worldstate = widgetContainerCtrl.worldstate;
                    if (directiveToInclude) {
                        template = '<' + directiveToInclude + ' dataslots="dataslots" worldstate="worldstate" renderingdescriptor="renderingdescriptor">' + '</' + directiveToInclude + '>'
                        compiledBody = $compile(template)(scope);
                        elem.append(compiledBody);
                    }
                }
            };
        }
    ]
    ).directive(
    'widgetHeader',
    [
        '$compile',
        function ($compile) {
            'use strict';
            return {
                restrict: 'A',
                require: '^widgetContainer',
                link: function (scope, elem, attrs, widgetContainerCtrl) {
                    var directiveToInclude = scope.renderingDescriptor.headerDirective || false,
                        template, compiledBody;
                    scope.parentCtrl = widgetContainerCtrl;
                    if (directiveToInclude) {
                        template = '<' + directiveToInclude + ' parent-ctrl="parentCtrl">' + '</' + directiveToInclude + '>';
                        compiledBody = $compile(template)(scope);
                        elem.append(compiledBody);
                    }

                }
            };
        }
    ]
    ).directive(
    'directiveIncluder',
    [
        '$compile',
        function ($compile) {
            'use strict;'
            return {
                restrict: 'A',
                scope: {
                    dataslot: '=',
                    renderingDescriptor: '=',
                    worldstate: '='
                },
                link: function (scope, elem) {
                    var directiveToInclude = scope.renderingDescriptor.bodyDirective || false,
                        template, compiledBody;
                    if (directiveToInclude) {
                        template = '<' + directiveToInclude + '>' + '</' + directiveToInclude + '>'
                        compiledBody = $compile(template)(scope);
                        elem.append(compiledBody);
                    }
                }
            };
        }
    ]
    );

