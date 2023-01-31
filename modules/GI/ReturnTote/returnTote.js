(function () {
    'use strict';
    app.component('returnTote', {
        controllerAs: '$vm',
        bindings: {
        },
        templateUrl: 'modules/GI/ReturnTote/returnTote.html',
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