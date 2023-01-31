(function () {
    'use strict'

    app.component('cartonLists', {
        controllerAs: '$vm',
        templateUrl: "modules/Tranfer/CartonItem/component/cartonList.html",
        bindings: {

            isLoading: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilterTable: '=?',
            isFilter: '=?',
        },
        controller: function ($scope, $q, $filter, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, tranferPalletFactory) {
            var $vm = this;
            $vm.filterModel = {};
            $vm.filterBarcode = {};
            $scope.filterModel = {};
            $scope.isLoading = false;
            let viewModelTransferPallet = tranferPalletFactory
            var defer = {};

            $vm.isLoading = function (param, Items, dataList, SumQty) {
                defer = $q.defer();
                $scope.filterModel = param;
                $scope.SumModel = SumQty;
                $vm.filterModel = Items;
                $vm.filterBarcode = dataList;
                $scope.isLoading = true;

                return defer.promise;
            };


            $scope.detectCheck = function (item) {
                let isCheck = $vm.searchResultModel;
                for (var i = 0; i <= isCheck.length - 1; i++) {
                    // if (item.qty  == isCheck[i].qty && item.tag_Index == isCheck[i].tag_Index && item.productName == isCheck[i].productName && item.productConversionName == isCheck[i].productConversionName
                    if (item.rowIndex == isCheck[i].rowIndex  && item.selected == isCheck[i].selected) {

                        isCheck[i].selected = true;
                    }
                    else {
                        isCheck[i].selected = false;
                    }

                    if(isCheck[i].selected == true){
                        $scope.sendSelected = item;
                    }
                }            
            }

            $scope.select = function () {
                var result = $scope.sendSelected;               
                defer.resolve(result);
            }

            $scope.back = function () {
                $scope.filterModel = {};

                if ($scope.checkAll === true) {
                    angular.forEach($vm.searchResultModel, function (v, k) {
                        $vm.searchResultModel[k].selected = false;
                    });
                } else {
                    angular.forEach($vm.searchResultModel, function (v, k) {
                        $vm.searchResultModel[k].selected = false;
                    });
                }
                defer.resolve('-99');
            }

            var init = function () {

                $scope.filterModel = {};
            };
            init();
        }
    })
})();