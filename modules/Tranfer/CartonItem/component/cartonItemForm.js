(function () {
    'use strict'

    app.component('cartonItemForm', {
        controllerAs: '$vm',
        templateUrl: "modules/Tranfer/CartonItem/component/cartonItemForm.html",
        bindings: {
            isLoading: '=?',
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',

        },
        controller: function ($scope, $q, $filter, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, ownerFactory, warehouseFactory, tranferCartonFactory, tranferCartonItemFactory, TransferStockAdjustmentFactory) {
            var $vm = this;
            var defer = {};

            let viewModelOwner = ownerFactory;
            let viewModelWH = warehouseFactory;
            let viewModelTransferCarton = tranferCartonFactory;
            var tranferCartonItemViewModel = tranferCartonItemFactory;
            var viewModel = TransferStockAdjustmentFactory;


            $vm.isFilterTable = true;
            $scope.onShow = false;

            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });

            $scope.filterDefault = function () {
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
                        setTimeout(() => {
                            var focusElem = jQuery('input[ng-model="filterModel.tagOutNo"]');
                            if (focusElem[0].focus != undefined) {
                                focusElem[0].focus();

                            }

                        }, 200);
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

            $vm.addItem = function () {
                var FromModel = $scope.filterModel;
                var FromVMModel = $vm.filterModel;
                var FromVMBarcode = $vm.filterBarcode;
                var SumQty = $scope.sumLoc;
                if ($scope.filterModel.isCheckCarton == 1) {
                    if ($scope.isLoading) {
                        $vm.isFilterTable = false;
                        $scope.isLoading(FromModel, FromVMModel, FromVMBarcode, SumQty).then(function (result) {
                            $vm.isFilterTable = true;

                            let itemsAll = $vm.filterModels;
                            let param = "";
                            if (result != null) {
                                var Activity = [];
                                for (var c = 0; c <= itemsAll.length - 1; c++) {
                                    if (result != undefined) {
                                        let newItem = {};
                                        if (itemsAll[c].rowIndex == result.rowIndex) {
                                            newItem.emtry = 2;
                                            newItem.create_By = $scope.userName;
                                            newItem.update_By = $scope.userName;
                                            newItem.tagOutItemIndex = result.tagOutItemIndex
                                            newItem.binBalance_Index = result.binBalanceIndex

                                            newItem.warehouseIndex = $scope.filterModel.WarehouseIndex;
                                            newItem.warehouseId = $scope.filterModel.warehouseId;
                                            newItem.warehouseName = $scope.filterModel.warehouseName;
                                            newItem.ownerIndex = $scope.filterModel.ownerIndex;
                                            newItem.ownerId = $scope.filterModel.ownerId;
                                            newItem.ownerName = $scope.filterModel.ownerName;
                                            newItem.goodsReceiveIndex = itemsAll[c].goodsReceiveIndex;
                                            newItem.goodsReceiveItemIndex = itemsAll[c].goodsReceiveItemIndex;
                                            newItem.itemStatusId_From = itemsAll[c].itemStatusId_From;
                                            newItem.itemStatusIndex_From = itemsAll[c].itemStatusIndex_From;
                                            newItem.itemStatusName_From = itemsAll[c].itemStatusName_From;
                                            newItem.exp_Date = itemsAll[c].exP_Date;
                                            newItem.mfg_Date = itemsAll[c].mfG_Date;
                                            newItem.locationIndex = itemsAll[c].locationConfirm_Index;
                                            newItem.locationId = itemsAll[c].locationConfirm_Id;
                                            newItem.locationName = itemsAll[c].locationConfirm_Name;
                                            newItem.productConversionId = itemsAll[c].productConversionId;
                                            newItem.productConversionIndex = itemsAll[c].productConversionIndex;
                                            newItem.productConversionName = itemsAll[c].productConversionName;
                                            newItem.qty = itemsAll[c].qty;
                                            newItem.totalQty = itemsAll[c].totalQty;
                                            newItem.ratio = itemsAll[c].ratio;
                                            newItem.volume = itemsAll[c].volume;
                                            newItem.weight = itemsAll[c].weight;
                                            newItem.tagOutStatus = itemsAll[c].tagOutStatus;
                                            newItem.productIndex = result.productIndex;
                                            newItem.productId = result.productId;
                                            newItem.productName = result.productName;
                                            $scope.filterModel.productId = result.productId;
                                            $scope.filterModel.productName = result.productName;
                                            $scope.filterModel.qty = result.qty;
                                            $scope.filterModel.productConversionName = result.productConversionName;
                                            $scope.filterModel.taskItemIndex = result.taskItemIndex;

                                        }
                                        else {
                                            newItem.emtry = 1;
                                        }
                                        if (newItem.emtry == 2) {
                                            Activity.push(newItem);
                                        }
                                    }
                                }
                                // for (var k = 0; k <= CheckTagOutItem.length - 1; k++) {
                                //     if (CheckTagOutItem[k] != undefined) {
                                //         if (CheckTagOutItem[k].productConversionName == productConversionName && CheckTagOutItem[k].productName == productName && CheckTagOutItem[k].productId == productId) {

                                //         }
                                //     }
                                // }
                            }
                            if (Activity) {
                                param = Activity;
                            }
                            let dataList = {
                                listTransferItemViewModel: param
                            }
                            $scope.filterModel.listTransferItemViewModel = dataList;
                            setTimeout(() => {
                                var focusElem = jQuery('input[ng-model="filterModel.tagNoNew"]');
                                if (focusElem[0].focus != undefined) {
                                    focusElem[0].focus();

                                }

                            }, 200);
                        }).catch(function (error) {
                            defer.reject({ 'Message': error });
                        });
                    }
                }
                else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: " ไม่พบ Carton ที่สแกน กรุณาสแกนใหม่ !"
                    })
                }

            }

            $scope.ScanTagNo = function (param) {
                let models = $scope.filterModel || {};
                validate(models).then(function (result) {
                    if (result) {
                        $scope.validateMsg = result;
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Validate',
                                message: result
                            }
                        )
                    }
                    else {
                        viewModelTransferCarton.scanTagNo(models.tagNoNew).then(function success(res) {
                            if (res.data.length > 0) {
                                $scope.confirm();
                                //$vm.searchResultModel = res.data;
                                // $scope.confirm();
                            }
                            else {
                                $scope.confirm();
                                // dpMessageBox.alert({
                                //     ok: 'Yes',
                                //     title: 'Information.',
                                //     message: "LPN:" + " " + $scope.filterModel.tagNoNew + " " + " ยังไม่มีในระบบ ยืนยันเพื่อสร้าง LPN ใหม่ !"
                                // })
                            }
                        },
                            function error(res) {

                            });
                    }
                })

            }
            $scope.confirm = function () {
                let models = $scope.filterModel;
                validate(models).then(function (result) {
                    if (result) {
                        $scope.validateMsg = result;
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Validate',
                                message: result
                            }
                        )
                    }
                    else {
                        if ($scope.filterModel.productId != undefined && $scope.filterModel.productName != undefined) {
                            let models = $scope.filterModel.listTransferItemViewModel;
                            for (var i = 0; i <= models.listTransferItemViewModel.length - 1; i++) {
                                models.listTransferItemViewModel[i].taskItemIndex = $scope.filterModel.taskItemIndex;
                                models.listTransferItemViewModel[i].tagNoNew = $scope.filterModel.tagNoNew;
                                if ($scope.filterModel.qty != models.listTransferItemViewModel[i].qty) {
                                    // models.listTransferItemViewModel[i].qty = $scope.filterModel.qty;
                                    models.listTransferItemViewModel[i].binBalanceQtyBal = $scope.filterModel.qty;
                                    models.listTransferItemViewModel[i].totalQty = $scope.filterModel.qty;
                                }
                            }
                            dpMessageBox.confirm({
                                ok: 'Yes',
                                cancel: 'No',
                                title: 'Confirm ?',
                                message: 'Do you want to Save !'
                            }).then(function () {
                                pageLoading.show();
                                tranferCartonItemViewModel.Save(models).then(function success(res) {
                                    pageLoading.hide();
                                    if (res.data == true) {
                                        // dpMessageBox.alert({
                                        //     ok: 'Close',
                                        //     title: 'Information.',
                                        //     message: " Confirm Complete !!!"
                                        // })
                                        // $vm.filterModel = {};
                                        // $scope.filterModel = {};
                                        // $scope.filterDefault();
                                        $state.reload();
                                    }
                                    else if (res.data == false) {
                                        dpMessageBox.alert({
                                            ok: 'Close',
                                            title: 'Information.',
                                            message: "ไม่สามารถย้ายมา Lpn นี้ได้"
                                        })
                                    }
                                    else {
                                        dpMessageBox.alert({
                                            ok: 'Close',
                                            title: 'Information.',
                                            message: " Qty ในสต๊อกเกิน ไม่สามารถ Tranfer ได้กรุณาลองใหม่ !!!"
                                        })
                                        init();
                                    }
                                    //$state.reload($state.current.name);
                                }, function error(param) {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'Information.',
                                        message: " ไม่พบข้อมูลในระบบ !!!"
                                    })
                                    init();
                                });
                            });
                        }
                        else {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: " คุณยังไม่ได้เลือกสินค้า เลือกสินค้าก่อน จะกด Confirm !"
                            })
                        }

                    }
                })

            }
            $scope.ScanProductBarcode = function () {
                $vm.filterBarcode = {};
                if ($scope.filterModel.tagOutNo != undefined) {
                    viewModelTransferCarton.SumQty($scope.filterModel).then(function success(res) {
                        var Activity = [];
                        let param = "";
                        if (res.data.sumQtyLoc.length > 0) {
                            let data = res.data.sumQtyLoc;
                            let dataAll = $vm.searchResultModel;
                            $scope.sumLoc = data
                            for (var c = 0; c <= data.length - 1; c++) {

                                for (var i = 0; i <= dataAll.length - 1; i++) {
                                    let newItem = {};
                                    if (data[c].productName == dataAll[i].productName) {
                                        newItem.emtry = 2;
                                        newItem.rowIndex = dataAll[i].rowIndex;
                                        newItem.productId = dataAll[i].productId;
                                        newItem.locationIndex = dataAll[i].locationIndex;
                                        newItem.productName = dataAll[i].productName;
                                        newItem.qty = dataAll[i].qty;
                                        newItem.productConversionName = dataAll[i].productConversionName;
                                        newItem.itemStatusName_From = dataAll[i].itemStatusName_From;
                                        newItem.expireDate = dataAll[i].expireDate;
                                        newItem.udf1 = dataAll[i].udf1;
                                        newItem.udf2 = dataAll[i].udf2;
                                        newItem.udf3 = dataAll[i].udf3;

                                    }
                                    else {
                                        newItem.emtry = 1;
                                    }
                                    if (newItem.emtry == 2) {
                                        Activity.push(newItem);
                                    }
                                }

                            }

                            if (Activity) {
                                param = Activity;
                            }
                            $vm.searchResultModel = param;
                            // let dataList = {
                            //     listTransferItemViewModel: param
                            // }
                            $vm.filterModel.tagOutNo = $scope.filterModel.tagOutNo;
                            $vm.filterBarcode.productId = res.data.sumQtyLoc[0].productId;
                            $vm.filterBarcode.productName = res.data.sumQtyLoc[0].productName;

                        }
                        else {
                            init();
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "ProductBarcode Not Found !!!"
                            })
                        }
                    },
                        function error(res) {

                        });
                }
                else {
                    dpMessageBox.alert({
                        ok: 'Yes',
                        title: 'Information.',
                        message: "Please Scan BarcodeLoction !"
                    })
                }

            }

            function validate(param) {
                let defer = $q.defer();
                let msg = "";
                if (param.tagOutNo == null || param.tagOutNo == "") {
                    msg = ' Barcode CTN ต้องไม่เป็นค่าว่าง !'
                    defer.resolve(msg);
                }
                else if (param.tagNoNew == null || param.tagNoNew == "") {
                    msg = ' Barcode LPN ปลายทาง ต้องไม่เป็นค่าว่าง !'
                    defer.resolve(msg);
                }
                defer.resolve(msg);

                return defer.promise;
            }

            $scope.ScanCTNBarcode = function () {
                if ($scope.filterModel.productId != "" && $scope.filterModel.productId != null) {
                    $scope.filterModel.productConversionBarcode = "";
                    $scope.filterModel.productId = "";
                    $scope.filterModel.productName = "";
                    $scope.filterModel.qty = "";
                    $scope.filterModel.tagNoNew = "";
                    $scope.filterModel.productConversionName = "";
                }
                if ($scope.filterModel.tagOutNo != undefined && $scope.filterModel.tagOutNo != "") {
                    pageLoading.show();
                    viewModelTransferCarton.scanCTNNo($scope.filterModel).then(function success(res) {
                        pageLoading.hide();
                        if (res.data.checkData.length > 0) {
                            if(res.data.itemsUse.length > 0){
                                $vm.ItemList = res.data.itemsUse;
                                $vm.filterModel.tagOutNo = res.data.itemsUse[0].tagOutNo;
                                $scope.filterModel.tagOutNo = res.data.itemsUse[0].tagOutNo;
                                $scope.filterModel.tagOutIndex = res.data.itemsUse[0].tagOutIndex;
                                $scope.filterModel.tagOutItemIndex = res.data.itemsUse[0].tagOutItemIndex;
                                $scope.filterModel.locationName = res.data.itemsUse[0].locationName;
                                $scope.filterModel.locationId = res.data.itemsUse[0].locationId;
                                $scope.filter = res.data.itemsUse;
                                $scope.filterModel.goodsIssueIndex = res.data.itemsUse[0].goodsIssueIndex;
                                $scope.filterModel.goodsIssueItemIndex = res.data.itemsUse[0].goodsIssueItemIndex;
                                $scope.filterModel.create_By = $scope.userName;
                                $scope.filterModel.update_By = $scope.userName;
                                $scope.CheckCarton();
                                $scope.SumQty($scope.filterModel);
                            }
                            else {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: "Barcode CTN :" + $scope.filterModel.tagOutNo + " นี้ไม่มีสินค้าในระบบ !"
                                })
                                document.getElementById("focusScanCTN").focus();
                                document.getElementById("focusScanCTN").select();
                            }
                        }
                        else {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "ไม่พบ CartonNo ที่ค้นหา กรุณาสแกนอีกครั้ง !"
                            })
                            document.getElementById("focusScanCTN").focus();
                            document.getElementById("focusScanCTN").select();
                        }
                    },
                        function error(res) {
                        });
                }
                else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: " Barcode CTN ต้องไม่เป็นค่าว่าง !"
                    })
                }
            }

            $scope.SumQty = function (model) {
                var deferred = $q.defer();
                viewModelTransferCarton.SumQty(model).then(
                    function success(res) {
                        $scope.sumLoc = res.data.sumQtyLoc;

                        deferred.resolve(res);
                    },
                    function error(response) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            $scope.CheckCarton = function () {
                let models = $scope.filterModel;
                pageLoading.show();
                viewModelTransferCarton.CheckCartonList(models).then(function success(res) {
                    pageLoading.hide();
                    $scope.filterModel.isCheckCarton = 0;
                    if (res.data.itemsGroup[0].productName != undefined) {
                        if (res.data.itemsGroup.length > 0) {
                            $scope.filterModel.isCheckCarton = 1;
                            $vm.searchResultModel = res.data.itemsGroup;
                            $vm.filterModels = res.data.itemsLPN;
                            $vm.filterModel.tagOutNo = $scope.filterModel.tagOutNo;
                            $vm.filterModel.locationName = $scope.filterModel.locationName;
                            //$scope.filterModel.qty = res.data.itemsGroup[0].qty;
                            $scope.filterModel.create_By = $scope.userName;
                            $scope.filterModel.update_By = $scope.userName;

                        }
                        // else {
                        //     dpMessageBox.alert({
                        //         ok: 'Close',
                        //         title: 'Information.',
                        //         message: "Barcode CTN :" + $scope.filterModel.tagOutNo + " นี้ไม่มีสินค้าในระบบ !"
                        //     })
                        //     document.getElementById("focusScanCTN").focus();
                        //     document.getElementById("focusScanCTN").select();
                        // }
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: " ไม่พบข้อมูล Barcode CTN: " + $scope.filterModel.tagOutNo
                        })
                    }
                },
                    function error(res) {

                    });
            }
            $scope.back = function () {
                $scope.filterModel = {};
                $scope.filterModel.planGoodsReceiveDate = getToday();
                $scope.filterModel.planGoodsReceiveDueDate = getToday();
                defer.resolve('1');
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

                        $scope.filterModel.ownerIndex = angular.copy(param.ownerIndex)
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



            $scope.clearSearch = function (param) {
                $scope.filterModel = {};
                $vm.filterModel = {};
                $scope.filterDefault();
            }


            var init = function () {
                $scope.filterModel = {};
                $vm.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterDefault();
            };

            init();
        }
    })
})();