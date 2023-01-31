(function () {
    'use strict';
    app.component('tranferTaskUnpackSummary', {
        controllerAs: '$vm',
        bindings: { 
        },
        templateUrl: 'modules/Tranfer_Unpack_Pack/Unpack/tranferTaskUnpackSummary.html',
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