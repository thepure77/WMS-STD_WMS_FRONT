(function () {
    'use strict';
    app.component('scanReceive', {
        controllerAs: '$vm',
        bindings: {
        },
        templateUrl: 'modules/GR/scanReceive/scanReceive.html',
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