angular.module(
    'de.cismet.smartAdmin.directives'
    ).directive('navArea',
    [
        'MenuService',
        function (MenuService) {
            'use strict';
            return {
                templateUrl: 'templates/navArea.html',
                restrict: 'E',
                replace: true,
                link: function () {
//                     SHOW & HIDE MOBILE SEARCH FIELD
                    $('#cancel-search-js').click(function () {
                        $.root_.removeClass('search-mobile');
                    });
                },
                controller: function ($scope) {
                    $scope.MenuService = MenuService;
                }
            };
        }]);