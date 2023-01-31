(function () {
    'use strict';
    app.component('pickToLight', {
        controllerAs: '$vm',
        bindings: {
        },
        templateUrl: 'modules/GI/PickToLight/PickToLight.html',
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