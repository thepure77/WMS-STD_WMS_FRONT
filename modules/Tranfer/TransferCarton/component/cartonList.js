(function () {
    'use strict'
    app.component('cartonList', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Tranfer/TransferCarton/component/cartonList.html";
        },
        bindings: {
            isLoading: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: "=?",
            triggerCreate: '=?',
            isFilter: '=?',

        },
        controller: function ($scope, $filter, $q, $http, $state,  pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox,tranferPalletFactory) {
            var $vm = this;
            var defer = {};
            $vm.filterModel = {};
            $scope.filterModel = {};
            $scope.items = $scope.items || [];
            let viewModelTransferPallet = tranferPalletFactory


            // setting column       
            $scope.isLoading = false;
            $vm.isLoading = function (FromVMFilterModel , sumQty) { 
                
                $vm.filterModel = FromVMFilterModel;
                $scope.SumModel = sumQty;
                defer = $q.defer();
                $scope.isLoading = false;     
                return defer.promise;
            };                   

            $scope.back = function () {                
                $scope.filterModel = {};
                defer.resolve('0');
            }

            var init = function () {
            };
            init();

        }
    })
})();