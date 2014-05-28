/*
 * This directive adopts the heigth of the body element according to the length
 * of the div with the id main to correctly set the scrollbar.
 * The behaviour is not added to te controller since it is necessary to 
 * access and manipulate the DOM. 
 * A solely CSS baseds solution was no found so far.
 */
angular.module(
    'de.cismet.smartAdmin.directives'
).directive(
    'bodyHeightAdopter',
    [
        function () {
            return {
                restrict: 'A',
                link: function (scope, elem) {
                    //the function is called whenever digest is called
                    scope.$watch(function () {
                        var currHeight = elem.find('#main').height();

                        elem.css('min-height', currHeight+80 + 'px');
                    });
                }
            };
        }
    ]
    );
