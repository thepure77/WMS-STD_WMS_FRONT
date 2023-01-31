(function () {
    'use strict'
    app.component('tranferItemActive', {
        controllerAs: '$vm',
        templateUrl: "modules/Tranfer/TransferItemActive/component/tranferItemActive.html",
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',
            isLoading: '=?',
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, TransferStockAdjustmentFactory) {
            var $vm = this;
            var defer = {};
            $vm.isFilter = true;
            $scope.filterModel = {};


            var viewModel = TransferStockAdjustmentFactory;

            $vm.$onInit = function () {
                $scope.filter();
                $scope.filterModel.CreateBy = localStorageService.get('userTokenStorage');

            }

            $scope.Location = function () {
                $scope.filterModel = $scope.filterModel || {};


                viewModel.CheckScanLocation($scope.filterModel).then(function success(res) {


                    if (res.data == "true") {
                        $scope.ScanLocation($scope.filterModel).then(function success(res) {
                            if (res.data.length == 0) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information',
                                    message: 'Location นี้ไม่มีสินค้าในระบบ'
                                })
                            }
                            else if (res.data.length <= 0) {
                                $scope.filterModel.BinBalanceIndex = res.data[0].binBalance_Index
                                $scope.filterModel.LocationName = res.data[0].locationName;
                                $scope.filterModel.locationIndex = res.data[0].locationIndex;
                                $scope.filterModel.locationId = res.data[0].locationId;
                                $scope.filterModel.itemStatusIndex = res.data[0].itemStatus_Index;
                                $scope.filterModel.itemStatusName = res.data[0].itemStatus_Name;
                                $scope.filterModel.itemStatusId = res.data[0].itemStatus_Id;

                                $scope.filterModel.productConversion_Id = res.data[0].productConversion_Id;
                                $scope.filterModel.productConversion_Index = res.data[0].productConversion_Index;
                                $scope.filterModel.productConversion_Name = res.data[0].productConversion_Name;
                                $scope.filterModel.productId = res.data[0].product_Id;
                                $scope.filterModel.productIndex = res.data[0].product_Index;
                                $scope.filterModel.productName = res.data[0].product_Name;
                                $scope.filterModel.BinBalanceQtyBal = res.data[0].binBalance_QtyBal;
                                $scope.filterModel.ownerIndex = res.data[0].owner_Index;
                            }
                            else {
                                $scope.filterModel.Location = res.data[0].locationName;
                                $scope.model = res.data;

                                $scope.SumQty($scope.filterModel).then(function success(res) {
                                    $scope.sum = res.data;
                                });

                                // $vm.viewlocation($scope.model);
                            }

                        });
                    }

                    else {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information',
                            message: res.data
                        })
                    }

                });


                function error(res) {
                }
            }



            $scope.ScanLocation = function (model) {
                var deferred = $q.defer();
                viewModel.ScanLocation(model).then(
                    function success(res) {
                        deferred.resolve(res);
                    },
                    function error(response) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            $scope.SumQty = function (model) {
                var deferred = $q.defer();
                viewModel.SumQty(model).then(
                    function success(res) {
                        deferred.resolve(res);
                    },
                    function error(response) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }


            $scope.Product = function () {
                $scope.filterModel = $scope.filterModel || {};
                $scope.ScanProduct($scope.filterModel).then(function success(res) {
                    if (res.data.length == 1) {

                        $scope.filterModel.BinBalanceIndex = res.data[0].binBalance_Index
                        $scope.filterModel.BinBalanceQtyBal = res.data[0].binBalance_QtyBal;
                        $scope.filterModel.productConversion_Id = res.data[0].productConversion_Id;
                        $scope.filterModel.productConversion_Index = res.data[0].productConversion_Index;
                        $scope.filterModel.productConversion_Name = res.data[0].productConversion_Name;
                        $scope.filterModel.productConversionName = res.data[0].productConversion_Name;
                        $scope.filterModel.productConversion_Ratio = res.data[0].productConversion_Ratio;
                        $scope.filterModel.productId = res.data[0].product_Id;
                        $scope.filterModel.productIndex = res.data[0].product_Index;
                        $scope.filterModel.productName = res.data[0].product_Name;
                        $scope.filterModel.Location_Name = res.data[0].locationName;
                        $scope.filterModel.LocationName = res.data[0].locationName;
                    }
                    if (res.data.length != 0) {
                        $scope.model = res.data;
                        $scope.SumQty($scope.filterModel).then(function success(res) {
                            $scope.sum = res.data;
                        });
                    }


                });
                function error(res) {

                }
            }

            $scope.ScanProduct = function (model) {
                var deferred = $q.defer();
                viewModel.ScanProduct(model).then(
                    function success(res) {
                        if (res.data.length == 0) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information',
                                message: 'ไม่พบ BarCode ใน Location นี้'
                            })
                            $scope.filterModel.productConversionBarcode = null;

                        }
                        deferred.resolve(res);
                    },
                    function error(response) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information',
                            message: 'ไม่พบ BarCode ใน Location นี้'
                        })
                    });
                return deferred.promise;
            }


            $scope.filter = function () {
                $scope.filterModel = $scope.filterModel || {};
                pageLoading.show();
                $scope.filterowner($scope.filterModel).then(function success(res) {
                    pageLoading.hide();

                    $scope.filterModel.ownerIndex = res.data[0].ownerIndex;
                    $scope.filterModel.ownerId = res.data[0].ownerId;
                    $scope.filterModel.ownerName = res.data[0].ownerName;
                    $scope.filterWarehouse($scope.filterModel).then(function success(res) {

                        $scope.filterModel.WarehouseIndex = res.data[0].warehouseIndex
                        $scope.filterModel.warehouseName = res.data[0].warehouseName;
                    });
                },
                    function error(res) { });
            }

            $scope.filterowner = function (model) {
                var deferred = $q.defer();
                pageLoading.show();
                viewModel.filterowner(model).then(
                    function success(res) {
                        deferred.resolve(res);
                        pageLoading.hide(1000);
                    },
                    function error(response) {
                        deferred.reject(response);
                        pageLoading.hide(1000);
                    });
                return deferred.promise;
            }

            $scope.filterWarehouse = function (model) {
                var deferred = $q.defer();
                pageLoading.show();
                viewModel.filterWarehouse(model).then(
                    function success(res) {
                        deferred.resolve(res);
                        pageLoading.hide(1000);
                    },
                    function error(response) {
                        deferred.reject(response);
                        pageLoading.hide(1000);
                    });
                return deferred.promise;
            }

            $scope.Confirm = function () {
                $scope.popupReasonCode.onClick();

            }

            $scope.ConfirmSave = function () {
                var model = $scope.filterModel;
                $scope.filterModel.oldQty = model.Qty;
                if ($scope.filterModel.Qty == undefined
                    || $scope.filterModel.LocationName == null
                    || $scope.filterModel.LocationName == ""
                    || $scope.filterModel.LocationName == undefined) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: "กรุณากรอกข้อมูลให้ครบถ้วน"
                    })
                }
                else if ($scope.filterModel.BinBalanceQtyBal == $scope.filterModel.Qty && $scope.filterModel.Qty != undefined) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: "จำนวนในสต๊อกเท่ากับจำนวนยอดที่รับได้อยู่แล้ว"
                    })
                    $scope.filterModel = "";
                    $scope.filter();
                }
                else if ($scope.filterModel.Qty < 0) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: "QTY ห้ามติดลบ"
                    })
                    $scope.filterModel.Qty = undefined;
                    // $scope.filter();
                }
                else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'Confirm ?',
                        message: 'Do you want to Confirm !'
                    }).then(function () {
                        if (model.Qty != "") {
                            model.Qty = model.Qty * model.productConversion_Ratio;
                        }
                        Add(model).then(function success(res) {

                            if (res.data.length > 0) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: " Confirm Complete !!!"
                                })
                                $scope.filterModel = {};
                                $scope.filter();
                            }
                            else {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: " Confirm Error !!!"
                                })

                                $scope.filterModel = {};
                                $scope.filter();
                            }
                            $scope.filterModel = {};
                            $scope.filter();

                        }, function error(param) {

                        });
                    });

                    $scope.filterModel.Qty = $scope.filterModel.oldQty;
                }

            }

            function Add(param) {
                let deferred = $q.defer();
                var item = param;
                viewModel.add(item).then(
                    function success(results) {
                        // $state.reload();
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            $scope.popupOwner = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupOwner.onShow = !$scope.popupOwner.onShow;
                    $scope.popupOwner.delegates.ownerPopup(param, index);
                },
                config: {
                    title: "owner"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.ownerIndex = angular.copy(param.ownerIndex);
                        $scope.filterModel.ownerId = angular.copy(param.ownerId);
                        $scope.filterModel.ownerName = angular.copy(param.ownerName);

                    }
                }
            };

            $scope.popupWarehouse = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupWarehouse.onShow = !$scope.popupWarehouse.onShow;
                    $scope.popupWarehouse.delegates.warehousePopup(param, index);
                },
                config: {
                    title: "Warehouse"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.warehouseIndex = angular.copy(param.warehouseIndex);
                        $scope.filterModel.warehouseId = angular.copy(param.warehouseId);
                        $scope.filterModel.warehouseName = angular.copy(param.warehouseName);
                    }
                }
            };

            $scope.popupProductConversion = {
                onShow: false,
                delegates: {},
                onClick: function (index) {
                    if ($scope.filterModel.productIndex != null) {
                        index = $scope.filterModel.productIndex;
                    };
                    $scope.popupProductConversion.onShow = !$scope.popupProductConversion.onShow;
                    $scope.popupProductConversion.delegates.productConversionPopup(index);
                },
                config: {
                    title: "ProductConversion"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {

                        $scope.filterModel.productConversion_Ratio = angular.copy(param.productConversionRatio);
                        $scope.filterModel.productConversion_Index = angular.copy(param.productConversionIndex);
                        $scope.filterModel.productConversion_Id = angular.copy(param.productConversionId);
                        $scope.filterModel.productConversion_Name = angular.copy(param.productConversionName);

                    }
                }
            };

            $scope.popupReasonCode = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupReasonCode.onShow = !$scope.popupReasonCode.onShow;
                    $scope.popupReasonCode.delegates.reasonCodePopup(param, index);
                },
                config: {
                    title: "ResonCode"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.ReasonCodeIndex = angular.copy(param.reasonCodeIndex);
                        $scope.filterModel.ReasonCodeId = angular.copy(param.reasonCodeId);
                        $scope.filterModel.ReasonCodeName = angular.copy(param.reasonCodeName);

                        $scope.ConfirmSave();

                    }
                }
            };

            $scope.clearSearch = function (param) {
                $scope.filterModel = {};
                $scope.filter();
                // $state.reload();
                $window.scrollTo(0, 0);
            }


            $vm.viewlocation = function () {
                var model = $scope.model;
                var sum = $scope.sum;
                var Barcode = $scope.filterModel.productConversionBarcode;
                if ($scope.filterModel.LocationName == null || $scope.filterModel.LocationName == undefined) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: "ไม่พบข้อมูล Location"
                    })
                }
                else {
                    if ($scope.isLoading) {
                        $vm.isFilter = false;
                        $scope.isLoading(model, Barcode, sum).then(function (result) {
                            if (result.data != null) {
                                $scope.filterModel.BinBalanceIndex = result.data[0].binBalance_Index
                                $scope.filterModel.BinBalanceQtyBal = result.data[0].binBalance_QtyBal;
                                $scope.filterModel.productConversionId = result.data[0].productConversion_Id;
                                $scope.filterModel.productConversionIndex = result.data[0].productConversion_Index;
                                $scope.filterModel.productConversionName = result.data[0].productConversion_Name;
                                $scope.filterModel.productConversionId = result.data[0].productConversion_Id;

                                $scope.filterModel.productConversion_Index = result.data[0].productConversion_Index;
                                $scope.filterModel.productConversion_Id = result.data[0].productConversion_Id;
                                $scope.filterModel.productConversion_Name = result.data[0].productConversion_Name;
                                $scope.filterModel.productId = result.data[0].product_Id;
                                $scope.filterModel.productIndex = result.data[0].product_Index;
                                $scope.filterModel.productName = result.data[0].product_Name;
                                $scope.filterModel.productConversion_Ratio = result.data[0].productConversion_Ratio;
                                $scope.filterModel.Location_Name = result.data[0].locationName;
                                $scope.filterModel.LocationName = result.data[0].locationName;
                            }

                            $vm.isFilter = true;

                        }).catch(function (error) {
                            defer.reject({ 'Message': error });
                        });
                    }
                }

            }

            var init = function () {
                $scope.filter();
                $scope.filterModel.CreateBy = localStorageService.get('userTokenStorage');
            };
            init();
        }
    })
})();