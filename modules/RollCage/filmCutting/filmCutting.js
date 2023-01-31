(function () {
    'use strict';
    app.component('filmCutting', {
        controllerAs: '$vm',
        bindings: {
        },
        templateUrl: 'modules/RollCage/filmCutting/filmCutting.html',
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