(function () {
    'use strict';
    app.component('tranferOneZeroFour', {
        controllerAs: '$vm',
        bindings: {
        },
        templateUrl: 'modules/Tranfer/tranferOneZeroFour/tranferOneZeroFour.html',
        controller: function ($scope) {
            var $vm = this;

            $scope.scanReceive = {};
            this.$onInit = function () {
                $scope.selected = 1;
            }

            $scope.selectedTab = function (tab) {
                $scope.selected = tab;
                
            }
            

        }
    });
})();