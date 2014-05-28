angular.module(
    'de.cismet.smartAdmin.directives'
    ).directive('shortcutArea', [
    'ShortCutService',
    'LayoutService',
    function (ShortCutService, LayoutService) {
        'use strict';
        return {
//            templateUrl: 'templates/shortcut.html',
            restrict: 'A',
//            replace: true,
//            transclude:true,
            link: function (scope, elem) {
                /*
                 * SHORTCUTS
                 */

                // SHORT CUT (buttons that appear when clicked on user name)
//                elem.find('a').click(function (e) {

//                    e.preventDefault();
//                    window.location = $(this).attr('href');
//                    setTimeout(shortcut_buttons_hide, 300);

//                });

                scope.shortCutService = ShortCutService;
                // FIXME: SHORTCUT buttons goes away if mouse is clicked outside of the area
                // find another solution for this...
                $(document).mouseup(function (e) {
                    if (!elem.is(e.target)// if the target of the click isn't the container...
                        && elem.has(e.target).length === 0) {
                        if (scope.shortCutService.isVisible) {
                            scope.shortCutService.isVisible = false;
                            scope.$apply();
                        }
                    }
                });
                // SHORTCUT ANIMATE HIDE
                function shortcut_buttons_hide () {
                    elem.animate({
                        height: "hide"
                    }, 300, "easeOutCirc");
                    LayoutService.bodyClasses['shortcut-on'] = false;
                }

                // SHORTCUT ANIMATE SHOW
                function shortcut_buttons_show () {
                    console.log("shortcut_show!");
                    elem.animate({
                        height: "show"
                    }, 200, "easeOutCirc");
                    LayoutService.bodyClasses['shortcut-on'] = true;
                }

                scope.$watch('shortCutService.isVisible', function (newVal, oldVal) {
                    if (newVal !== oldVal) {
                        if (scope.shortCutService.isVisible) {
                            shortcut_buttons_show();
                        } else {
                            shortcut_buttons_hide();
                        }
                    }
                });
            }
        };
    }
]);