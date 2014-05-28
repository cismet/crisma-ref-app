angular.module(
    'de.cismet.smartAdmin.directives'
    ).directive('userInfo', [
    'ShortCutService',
    function (ShortCutService) {
        'use strict';
        return {
            templateUrl: 'templates/userInfo.html',
            restrict: 'E',
            replace: true,
            link: function () {
               
            },
            controller: function ($scope, ShortCutService) {
                $scope.showShortcut = function () {
                   ShortCutService.isVisible = !ShortCutService.isVisible;
                };
            }
        };
    }
]);