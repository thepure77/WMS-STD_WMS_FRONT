(function () {
    'use strict'

    app.component('masterProductConversion', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterProductConversion/productConversionSummary.html";
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, $stateParams, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox) {
            var $vm = this;

            $scope.isFilter = true;
            $scope.filterModel = {
                currentPage: 1,
                numPerPage: 30,
                totalRow: 0,
                key: '',
                advanceSearch: false,
                showError: false,
                type: 1,
                perPage: 30,
                maxSize: 5
            };
            
            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });
        }
    })
})();