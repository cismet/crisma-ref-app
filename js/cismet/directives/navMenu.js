angular.module(
    'de.cismet.smartAdmin.directives'
    ).directive('navMenu',
    [
        function () {
            'use strict';
            return {
                templateUrl: 'templates/navMenu.html',
                restrict: 'E',
                replace: true,
                scope: {
                    menuitems: '='
                }
            };
        }]).directive('navSubMenu',
    function () {
        'use strict';
        return {
            templateUrl: 'templates/navSubMenu.html',
            restrict: 'E',
            replace: true,
            scope: {
                menuitems: '=',
                parentMenu: '@'
            },
            controller: function ($scope) {
                $scope.getOpenSignClass = function () {
                    return 'fa fa-expand-o';
                };
            }
        };
    }).directive('navMenuEntry', [
    '$compile',
    '$animate',
    '$location',
    'MenuService',
    '$timeout',
    function ($compile, $animate, $location, MenuService, $timeout) {
        'use strict';
        return {
            templateUrl: 'templates/navMenuEntry.html',
            restrict: 'E',
            replace: true,
            scope: {
                menuitem: '='
            },
            link: function (scope, elem) {
                var collapseSignExpand = 'fa fa-expand-o',
                    collapseSignCollapse = 'fa fa-collapse-o',
                    subMenuElem;
                scope.$watchCollection('menuitem.children', function (newval, oldval) {
                    if (scope.menuitem.children && scope.menuitem.children.length > 0) {
                        var subMenuElemWasVisible = false;
                        if (subMenuElem) {
                            subMenuElemWasVisible = subMenuElem.is(':visible');
                            var domChilds = elem.children();
                            domChilds[domChilds.length - 1].remove();
                        }
                        subMenuElem = $compile('<nav-sub-menu menuitems="menuitem.children" parent-menu={{false}}></nav-sub-menu>')(scope);
                        elem.append(subMenuElem);
                        if (subMenuElemWasVisible) {
                            $timeout(function () {
                                //since we apply the slideDown directly we need to add the open class manually
                                subMenuElem.slideDown(0);
                                subMenuElem.addClass('open');
                            }, 0);
                        }
                    }
                });

                scope.menuItemParent = {
                    'menu-item-parent': scope.$parent.parentMenu
                };

                scope.MenuService = MenuService;

                scope.$watch('MenuService.activeItem', function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        if (scope.MenuService.activeItem === scope.menuitem) {
                            elem.addClass("active");
                        } else {
                            //This implements accordion fuctionality...
                            //FIXME This will only work for a two level hierarchy
                            elem.removeClass("active");
                            if (subMenuElem && subMenuElem.is(':visible')) {
                                var closeSubMenu = true;
                                for (var i = 0; i < scope.menuitem.children.length; i++) {
                                    var childElem = scope.menuitem.children[i];
                                    if (childElem === scope.MenuService.activeItem) {
                                        closeSubMenu = false;
                                    }
                                }
                                if (closeSubMenu) {
                                    $animate.removeClass(subMenuElem, 'open');
                                }
                            }
                        }
                    }
                });

                scope.$on('menuEntryActivated', function () {
                    MenuService.activePath.push(scope.menuitem);
                });

                scope.collapseSign = collapseSignExpand;

                scope.toggleOpen = function () {

                    //change the collapse sign
                    if (scope.collapseSign === collapseSignExpand) {
                        scope.collapseSign = collapseSignCollapse;
                    } else {
                        scope.collapseSign = collapseSignExpand;
                    }

                    if (scope.menuitem.children) {

                        if (subMenuElem.is(':visible') && !subMenuElem.hasClass('active')) {
                            $animate.removeClass(subMenuElem, 'open');
                        } else {
                            $animate.addClass(subMenuElem, 'open');
                        }
                    } else if (scope.menuitem.getChildren && !scope.menuitem.leaf) {
                        if (!scope.isLoading) {
                            //append a loading node and load the nodes...
                            scope.isLoading = true;
                            subMenuElem = $compile('<ul><li><a>Loading...</a></li></ul>')(scope);
                            elem.append(subMenuElem);
                            $animate.addClass(subMenuElem, 'open');
                            scope.menuitem.getChildren().then(function (children) {
                                $timeout(function () {
                                    scope.menuitem.children = children;
                                    var clonedElem = $compile('<nav-sub-menu menuitems="menuitem.children" parent-menu={{false}}></nav-sub-menu>')(scope);
//                                    var clonedElem = $compile('<ul><li><a>Loading done</a></li></ul>')(scope);
                                    subMenuElem.remove();
                                    subMenuElem = clonedElem;
                                    elem.append(subMenuElem);
                                    $timeout(function () {
                                        //since we apply the slideDown directly we need to add the open class manually
                                        subMenuElem.slideDown(0);
                                        subMenuElem.addClass('open');
                                    }, 0);
                                }, 500);

                            }, function () {
                                subMenuElem.remove();
                            });
                        } else {
                            if (subMenuElem.is(':visible') && !subMenuElem.hasClass('active')) {
                                $animate.removeClass(subMenuElem, 'open');
                            } else {
                                $animate.addClass(subMenuElem, 'open');
                            }
                        }
                    }

                    //activate the currently clicked MenuEntry and emit an event to the parent MenuEntries
                    MenuService.activePath.splice(0, MenuService.activePath.length);
                    MenuService.activeItem = scope.menuitem;

                    scope.$emit('menuEntryActivated', scope.menuitem);
                    //finally change the route according to the link
                    if (scope.menuitem.link) {
                        $location.path(scope.menuitem.link);
                    }

                };

            },
            controller: function ($scope) {

            }
        };
    }]).animation('.open', function () {
    'use strict';
    return {
        addClass: function (element) {
            element.slideDown(200);
        },
        removeClass: function (element) {
            element.slideUp(200);
        }
    };
});

