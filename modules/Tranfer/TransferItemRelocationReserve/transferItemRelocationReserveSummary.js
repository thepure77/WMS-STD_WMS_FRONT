(function () {
    'use strict'

    app.component('transferItemRelocationReserveSummary', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs, $window, commonService) {
            return "modules/Tranfer/TransferItemRelocationReserve/transferItemRelocationReserveSummary.html";
        },
        controller: function ($scope, $filter, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox) {
            var $vm = this;

            $scope.isFilter = true;

            $scope.filterModel = {
                currentPage: 0,
                numPerPage: 30,
                totalRow: 0,
                key: '',
                advanceSearch: false,
                showError: false,
            };

            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });
        }
    })
})();