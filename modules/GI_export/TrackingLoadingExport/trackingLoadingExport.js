(function () {
    'use strict';
    app.component('trackingLoadingExport', {
        controllerAs: '$vm',
        bindings: {
        },
        templateUrl: 'modules/GI_export/TrackingLoadingExport/trackingLoadingExport.html',
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