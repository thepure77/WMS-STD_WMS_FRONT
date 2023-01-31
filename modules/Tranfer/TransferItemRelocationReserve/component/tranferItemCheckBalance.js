(function () {
    'use strict'
    app.component('tranferItemCheckBalance', {
        controllerAs: '$vm',
        templateUrl: "modules/Tranfer/TransferItemRelocationReserve/component/tranferItemCheckBalance.html",
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',
            isCheckBalance: '=?',
            isLoading: '=?',
        },
        controller: function ($scope, $q, $state, pageLoading, $window, commonService, localStorageService, $timeout, dpMessageBox, ownerFactory, productConversionBarcodeFactory, locationFactory, tranferFactory) {
            var $vm = this;
            var defer = {};
            $vm.isFilter = true;
            $scope.filterModel = {};
            $vm.loadingList = {};
            let viewModelConversionBarcode = productConversionBarcodeFactory;
            let viewModelTransfer = tranferFactory;
            $vm.isCheckBalance = function (model, sumLoc, sumLPN ) {
                defer = $q.defer();
                $vm.loadingList = $vm.isLoading;
                $scope.filterModel.ownerIndex = model.ownerIndex;
                $scope.filterModel.warehouseIndex = model.warehouseIndex;
                var sumLoc = sumLoc;
                var sumLPN = sumLPN;
                $vm.isLoading = false;
                $scope.isCheckBalance = true;

                if (model != null) {
                    // $scope.CheckBalance = model;
                    // $scope.filterModel.productId = model[0].productId;
                    // $scope.filterModel.productName = model[0].productName;                   
                }
                return defer.promise;
            };
            $scope.ScanProductConversion = function () {
                if($scope.filterModel.productConversionBarcode != "" && $scope.filterModel.productConversionBarcode != undefined){
                    pageLoading.show();
                    viewModelConversionBarcode.scanProductCon($scope.filterModel.productConversionBarcode).then(function success(res) {
                        pageLoading.hide();
                        if (res.data.length > 0) {
                            //$scope.scanTagNo = res.data;                       
                            $scope.filterModel.productConversionBarcodeId = res.data[0].productConversionBarcodeId;
                            $scope.filterModel.productConversionName = res.data[0].productConversionName;
                            $scope.filterModel.productName = res.data[0].productName;
                            $scope.filterModel.create_By = $scope.userName;
                            $scope.filterModel.update_By = $scope.userName;
                            $scope.checkProductName();
                            $scope.SumQty($scope.filterModel);
                        }
                        else {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: " ไม่พบรหัสของสินค้า กรุณาลองอีกครั้ง !!!"
                            })
                            $scope.CheckBalance = {};
                        }
                    },
                        function error(res) {    
                        });
                }
                else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: " รหัสของสินค้า ต้องไม่เป็นค่าว่าง !!!"
                    })
                    $scope.CheckBalance = {};
                }
            }
            $scope.checkProductName = function () {
                pageLoading.show();
                viewModelTransfer.checkProductList($scope.filterModel.productName).then(function success(res) {
                    pageLoading.hide();
                    if (res.data.itemsGroup.length > 0) {
                        $scope.CheckBalance = res.data.itemsGroup;       
                        $scope.filterModel.totalQty = res.data.itemsGroup.length;                 
                        
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: " ไม่พบสินค้าที่ค้นหา กรุณาลองอีกครั้ง !!!"
                        })
                        $scope.CheckBalance = {};
                    }
                },
                    function error(res) {

                    });
            }
            $scope.SumQty = function (model) {
                var deferred = $q.defer();
                viewModelTransfer.SumQty(model).then(
                    function success(res) {
                        $scope.sumLoc = res.data.sumQtyLoc;
                        $scope.sumLPN = res.data.sumQtyLPN;
                        deferred.resolve(res);
                    },
                    function error(response) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }
            $scope.select = function (param) {
                var item = angular.copy($scope.filterModel);
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
                $vm.isLoading = $vm.loadingList;
                $scope.CheckBalance = {};
                $scope.sumLoc = {};
                $scope.filterModel = {};
                defer.resolve('');
            }
            var init = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
            };
            init();
        }
    })
})();