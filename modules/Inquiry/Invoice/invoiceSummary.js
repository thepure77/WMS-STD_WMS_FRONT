(function () {
    'use strict'

    app.component('invoiceSummary', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs,  $window, commonService) {
            return "modules/Inquiry/Invoice/invoiceSummary.html";
        },
        controller: function ($scope, $filter, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, logsFactory) {
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

            function init(){                
            }
            //init();

        }
    })
})();