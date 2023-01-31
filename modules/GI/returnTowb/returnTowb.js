(function () {
    'use strict';
    app.component('returnTowb', {
        controllerAs: '$vm',
        bindings: {
        },
        templateUrl: 'modules/GI/returnTowb/returnTowb.html',
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