(function () {
    'use strict'
    app.component('tranferItemRelocationReserveList', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, $window, commonService) {
            return "modules/Tranfer/TransferItemRelocationReserve/component/tranferItemRelocationReserveList.html";
        },
        bindings: {
            isLoading: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: "=?",
            triggerCreate: '=?',
            isFilter: '=?',
            isCheckBalance: '=?',

        },
        controller: function ($scope, $filter, $q, $compile, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox) {
            var $vm = this;
            var defer = {};
            $scope.items = $scope.items || [];
            $vm.checkBalanceList = {};
            $scope.filterModel = {};
            // setting column       
            $scope.isLoading = false;


            $vm.isLoading = function (model, searchBarcode, sumLPN) {
                defer = $q.defer();
                $vm.checkBalanceList = $vm.isCheckBalance;
                $vm.isCheckBalance = false;
                $scope.SumModel = sumLPN;
                $scope.isLoading = true;
                if (model != null) {
                    $vm.searchResultModel = model;
                    // $scope.filterModel.LocationName = model[0].locationName;
                    $scope.filterModel.tagNo = model[0].tag_No;
                    $scope.filterModel.itemStatusName = model[0].itemStatusName_From;
                    //$scope.filterModel.productName = model[0].productName;

                    if (searchBarcode != undefined) {
                        $scope.filterModel.productName = searchBarcode[0].productName;
                        $scope.filterModel.itemStatusName = searchBarcode[0].itemStatusName_From;
                    }

                    // $scope.SumModel = sum;
                } else {
                    $scope.filterModel = {};
                    $scope.SumModel = {};
                    $vm.searchResultModel = "";
                }
                return defer.promise;
            };
            function onLoad() {

                history.pushState(null, null, location.href);
                window.onpopstate = function () {
                    //history.go(1);
                    //$vm.isCheckBalance = $vm.checkBalanceList;
                    history.go('wms.transfer_item_relocation_reserve_summary');
                };
            }
            $scope.detectCheck = function (item) {
                let isCheck = $vm.searchResultModel;
                for (var i = 0; i <= isCheck.length - 1; i++) {
                    if (item.binBalanceIndex == isCheck[i].binBalanceIndex && item.qty == isCheck[i].qty && item.tag_Index == isCheck[i].tag_Index && item.productName == isCheck[i].productName && item.productConversionName == isCheck[i].productConversionName
                        && item.selected == isCheck[i].selected) {

                        isCheck[i].selected = true;
                    }
                    else {
                        isCheck[i].selected = false;
                    }
                }
            }

            $scope.select = function () {
                $vm.isCheckBalance = $vm.checkBalanceList;
                var item = angular.copy($vm.searchResultModel);
                var models = {};
                var idx = [];
                angular.forEach(item, function (v, k) {
                    if (v.selected) {
                        idx.push(v)
                    }
                });
                models = { 'data': idx };
                defer.resolve(models);
            }

            $scope.back = function () {
                $vm.isCheckBalance = $vm.checkBalanceList;
                if ($scope.checkAll === true) {
                    angular.forEach($vm.searchResultModel, function (v, k) {
                        $vm.searchResultModel[k].selected = false;
                    });
                } else {
                    angular.forEach($vm.searchResultModel, function (v, k) {
                        $vm.searchResultModel[k].selected = false;
                    });
                }
                defer.resolve('false');
            }
            var init = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
                onLoad();
            };
            init();

        }
    })
})();