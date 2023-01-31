(function () {
    'use strict'

    app.component('shortShipSummary', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function () {
            return "modules/GI/ShortShip/shortShipSummary.html";
        },
        controller: function ($scope) {
            var $vm = this;

            $scope.isFilter = true;

            $vm.filterModel = {
                currentPage: 1,
                PerPage: 50,
                totalRow: 0,
                key: '',
                advanceSearch: false,
                showError: false,
                type: 1
            };

            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });
            this.$onInit = function () {
            };
        }
    })
})();