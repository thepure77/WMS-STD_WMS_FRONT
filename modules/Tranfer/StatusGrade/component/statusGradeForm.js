(function () {
    'use strict'

    app.component('statusGradeForm', {
        controllerAs: '$vm',
        templateUrl: "modules/Tranfer/StatusGrade/component/statusGradeForm.html",
        bindings: {
            isLoading: '=?',
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',

        },
        controller: function ($scope, $q, $filter, $http, $state, pageLoading, $window, localStorageService, $timeout, dpMessageBox, planGoodsReceiveFactory, planGoodsReceiveItemFactory, statusGradeFactory, ownerFactory, warehouseFactory, TransferStockAdjustmentFactory) {
            var $vm = this;

            let defer = {};
            let viewModelOwner = ownerFactory;
            let viewModelWH = warehouseFactory;
            let viewModelStatusGrade = statusGradeFactory
            var viewModel = TransferStockAdjustmentFactory;

            $vm.isFilterTable = true;
            $scope.onShow = false;
            $scope.filterModel = {};
            $scope.AllData = {};
            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });

            $scope.show = {
                action: true,
                pagination: true,
                checkBox: false
            }

            $scope.selectedTab = function (tab) {
                $scope.selected = tab;
            }

            $scope.clickTab = function (tab) {
                $scope.click = tab;
            }

            $scope.ScanBarcode = function () {
                let model = $scope.filterModel;
                if (model.tag_No != undefined && model.tag_No != "") {
                    $scope.filterModel = $scope.filterModel || {};
                    viewModelStatusGrade.ScanBarcode($scope.filterModel).then(function success(res) {
                        if (res.data.length > 0) {
                            if (res.data.length == 1) {
                                $vm.searchResultModel = res.data;
                                $vm.filterModel.locationName = res.data[0].locationName;
                                $vm.filterModel.tag_No = res.data[0].tag_No;
                                $scope.filterModel.update_By = $scope.userName;
                                $scope.filterModel.tag_Index = res.data[0].tag_Index;
                                $scope.filterModel.tag_No = res.data[0].tag_No;
                                $scope.filterModel.locationName = res.data[0].locationName;
                                $scope.filterModel.productId = res.data[0].productId;
                                $scope.filterModel.productName = res.data[0].productName;
                                $scope.filterModel.ItemStatusName_From = res.data[0].itemStatusName_From;
                                $scope.filterModel.ItemStatusId_From = res.data[0].itemStatusId_From;
                                $scope.filterModel.ItemStatusIndex_From = res.data[0].itemStatusIndex_From;
                                $scope.filterModel.balanceQty_Begin = res.data[0].balanceQty_Begin;
                                $scope.filterModel.balanceQty_Balance = res.data[0].balanceQty_Balance;
                                $scope.filterModel.binBalanceQtyBal = res.data[0].binBalanceQtyBal;
                                $scope.filterModel.productConversionName = res.data[0].productConversionName;
                                $scope.SumQty($scope.filterModel);
                            }
                            else {
                                $vm.searchResultModel = res.data;
                                $vm.filterModel.locationName = res.data[0].locationName;
                                $vm.filterModel.tag_No = res.data[0].tag_No;

                                $scope.filterModel.ItemStatusName_From = res.data[0].itemStatusName_From;
                                $scope.filterModel.ItemStatusId_From = res.data[0].itemStatusId_From;
                                $scope.filterModel.ItemStatusIndex_From = res.data[0].itemStatusIndex_From;
                                $scope.filterModel.binBalanceQtyBal = res.data[0].binBalanceQtyBal;
                                $scope.filterModel.productConversionName = res.data[0].productConversionName;

                                $scope.AllData.update_By = $scope.userName;
                                $scope.AllData.tag_Index = res.data[0].tag_Index;
                                $scope.AllData.tag_No = res.data[0].tag_No;
                                $scope.AllData.locationName = res.data[0].locationName;
                                $scope.AllData.productId = res.data[0].productId;
                                $scope.AllData.productName = res.data[0].productName;
                                $scope.AllData.ItemStatusName_From = res.data[0].itemStatusName_From;
                                $scope.AllData.ItemStatusId_From = res.data[0].itemStatusId_From;
                                $scope.AllData.ItemStatusIndex_From = res.data[0].itemStatusIndex_From;
                                $scope.AllData.balanceQty_Begin = res.data[0].balanceQty_Begin;
                                $scope.AllData.balanceQty_Balance = res.data[0].balanceQty_Balance;
                                $scope.AllData.binBalanceQtyBal = res.data[0].binBalanceQtyBal;
                                $scope.AllData.productConversionName = res.data[0].productConversionName;
                                $scope.SumQty($scope.AllData);
                            }
                        }
                        else {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: " ไม่พบ Barcode LPN กรุณาสแกนใหม่ !!!"
                            })
                        }
                    },
                        function error(res) {
                        });
                }
                else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: " Barcode LPN ต้องไม่เป็นค่าว่าง !!"
                    })
                }

            }

            $vm.addItem = function (param) {
                if ($scope.isLoading) {
                    $vm.isFilterTable = false;
                    var dataList = $vm.searchResultModel;
                    var sumLPN = $scope.sumLPN;
                    var items = $scope.filterModel;
                    $scope.isLoading(dataList, sumLPN, items).then(function (result) {
                        $vm.isFilterTable = true;
                        // $scope.filterModel.listPlanGoodsReceiveItemViewModel = $scope.filterModel.listPlanGoodsReceiveItemViewModel || []
                        // if (result != '-99') {
                        //     if (result.planGoodsReceiveIndex == undefined)
                        //         result.flagUpdate = true;
                        //     $scope.filterModel.listPlanGoodsReceiveItemViewModel.push(angular.copy(result));
                        // }

                    }).catch(function (error) {
                        defer.reject({ 'Message': error });
                    });
                }
            }

            $scope.Confirm = function (param) {

                

                let models = $scope.filterModel;
                let allData = $scope.AllData;
                
                // if(allData != undefined || allData != null){
                //     models = $scope.AllData;                    
                // }
                // if(allData.itemStatusIndex_To != ""){
                //     if(allData.tag_Index != undefined){
                //         models = $scope.AllData;   
                //     }
                // }
                
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
                        dpMessageBox.confirm({
                            ok: 'Yes',
                            cancel: 'No',
                            title: 'Confirm ?',
                            message: 'Do you Want to Confirm !'
                        }).then(function () {
                            viewModelStatusGrade.confirmScan(models).then(function success(res) {
                                if (res.data == true) {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'Information.',
                                        message: "Success"
                                    }).then(function success() {

                                    })
                                    init();

                                }
                                else {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'Information.',
                                        message: "Confirm Error !!"
                                    })
                                    init();
                                }
                            },
                                function error(res) {

                                });
                        });

                    }
                })

            };

            function validate(param) {
                let defer = $q.defer();
                let msg = "";
                if (param.tag_No == undefined || param.tag_No == "") {
                    msg = ' Barcode LPN is ต้องไม่เป็นค่าว่าง !'
                    defer.resolve(msg);
                }
                else if (param.itemStatusName_To == undefined || param.itemStatusName_To == "") {
                    msg = ' สถานะสินค้าใหม่ ต้องไม่เป็นค่าว่าง !'
                    defer.resolve(msg);
                }
                defer.resolve(msg);

                return defer.promise;
            }

            $scope.popupOwner = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupOwner.onShow = !$scope.popupOwner.onShow;
                    $scope.popupOwner.delegates.ownerPopup(param, index);
                },
                config: {
                    title: "Owner"
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

            $scope.popupItemStatus = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupItemStatus.onShow = !$scope.popupItemStatus.onShow;
                    $scope.popupItemStatus.delegates.itemStatusPopup(param, index);
                },
                config: {
                    title: "ItemStatus"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {

                        if (param.itemStatusIndex == $scope.filterModel.ItemStatusIndex_From) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "Status สินค้าตรงกัน !!"
                            })
                            $scope.filterModel.itemStatusIndex_To = "";
                            $scope.filterModel.itemStatusId_To = "";
                            $scope.filterModel.itemStatusName_To = "";

                            $scope.AllData.itemStatusIndex_To = "";
                            $scope.AllData.itemStatusId_To = "";
                            $scope.AllData.itemStatusName_To = "";
                        }
                        else {
                            $scope.filterModel.itemStatusIndex_To = angular.copy(param.itemStatusIndex);
                            $scope.filterModel.itemStatusId_To = angular.copy(param.itemStatusId);
                            $scope.filterModel.itemStatusName_To = angular.copy(param.itemStatusName);

                            $scope.AllData.itemStatusIndex_To = angular.copy(param.itemStatusIndex);
                            $scope.AllData.itemStatusId_To = angular.copy(param.itemStatusId);
                            $scope.AllData.itemStatusName_To = angular.copy(param.itemStatusName);
                        }
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
            $scope.SumQty = function (model) {
                var deferred = $q.defer();
                viewModelStatusGrade.SumQty(model).then(
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
                        setTimeout(() => {
                            var focusElem = jQuery('input[ng-model="filterModel.tag_No"]');
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

            $scope.clearSearch = function (param) {
                // $scope.filterModel = {};
                // $state.reload();
                // $window.scrollTo(0, 0);
                init();
            }
            var init = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
                $vm.searchResultModel = {};
                $scope.filter();


            };
            init();
        }
    })
})();