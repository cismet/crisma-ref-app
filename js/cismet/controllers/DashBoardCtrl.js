angular.module(
    'de.cismet.smartAdmin.controllers'
    ).controller('DashBoardCtrl',
    [
        '$scope',
        function ($scope) {
            $scope.spark1Values = [1000, 1050, 1100, 1300, 1600, 2000, 500, 4000, 30];
            $scope.spark1Sum = '$ ' + $scope.spark1Values.reduce(function (a, b) {
                return a + b;
            });

            $scope.spark2Values = [110, 150, 300, 130, 400, 240, 220, 310, 220, 300, 270, 210];
            $scope.spark2Sum = ' ' + 45;
            $scope.spark2Icon = 'fa fa-shopping-cart';

            $scope.spark3Values = [1000, 1050, 1100, 1300, 1600, 2000, 500, 4000, 30];
            $scope.spark3Sum = '$' + $scope.spark3Values.reduce(function (a, b) {
                return a + b;
            });

            $scope.dataslots = [{
                    directive: 'customTemplates/dataslotA.html'
                }, {
                    directive: 'customTemplates/dataslotB.html'
                }, {
                    directive: 'customTemplates/dataslotC.html'
                }, {
                    directive: 'customTemplates/dataslotB.html'
                }];

        }
    ]).controller('dsCtrl',
    [
        '$scope',
        function ($scope) {

            $scope.title = 'Dataslot c';
            $scope.icon = 'fa fa-locked';

        }
    ]);
