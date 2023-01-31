(function () {
    'use strict';
    app.component('callFullRollCage', {
        controllerAs: '$vm',
        bindings: {
        },
        templateUrl: 'modules/RollCage/callFullRollCage/callFullRollCage.html',
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