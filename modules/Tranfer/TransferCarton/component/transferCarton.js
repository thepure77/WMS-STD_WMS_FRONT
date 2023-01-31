(function () {
    'use strict'
    app.component('transferCarton', {
        controllerAs: '$vm',
        templateUrl: "modules/Tranfer/TransferCarton/component/transferCarton.html",
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',
            isLoading: '=?',
        },
        controller: function ($scope, $filter, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, ownerFactory, warehouseFactory, tranferCartonFactory, TransferStockAdjustmentFactory) {
            var $vm = this;
            var defer = {};
            $vm.isFilter = true;
            $scope.filterModel = {};
            let viewModelOwner = ownerFactory;
            let viewModelWH = warehouseFactory;
            var viewModelTransferCarton = tranferCartonFactory;
            var viewModel = TransferStockAdjustmentFactory;



            $vm.cartonlist = function () {

                if ($scope.isLoading) {
                    var FromVMFilterModel = $vm.filterModel;
                    var SumQty = $scope.sumLoc;
                    if (FromVMFilterModel == undefined || $scope.filterModel.tagOutNo == "") {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "ไม่พบ Carton ที่สแกน กรุณาสแกนใหม่"
                        })
                    }
                    else {
                        $vm.isFilter = false;
                        $scope.isLoading(FromVMFilterModel, SumQty).then(function (result) {
                            $vm.isFilter = true;
                        }).catch(function (error) {
                            defer.reject({ 'Message': error });
                        });
                    }

                }
            }

            $scope.ScanCTNBarcode = function () {
                $scope.filterModel.tagNoNew = '';
                pageLoading.show();
                viewModelTransferCarton.scanCTNNo($scope.filterModel).then(function success(res) {
                    pageLoading.hide();
                    if (res.data.checkData.length > 0) {
                        if (res.data.itemsUse.length > 0) {
                            $vm.filterModel.tagOutNo = res.data.itemsUse[0].tagOutNo;
                            $scope.filterModel.tagOutNo = res.data.itemsUse[0].tagOutNo;
                            $scope.filterModel.tagOutIndex = res.data.itemsUse[0].tagOutIndex;
                            if (res.data.itemsUse.length == 1) {
                                $scope.filterModel.locationConfirmIndex = res.data.itemsUse[0].locationIndex;
                                $scope.filterModel.locationConfirmId = res.data.itemsUse[0].locationId;
                                $scope.filterModel.locationConfirmName = res.data.itemsUse[0].locationName;
                            }
                            $scope.filterModel.goodsIssueIndex = res.data.itemsUse[0].goodsIssueIndex;
                            $scope.filterModel.goodsIssueItemIndex = res.data.itemsUse[0].goodsIssueItemIndex;
                            $scope.filterModel.createBy = $scope.userName;
                            $scope.filterModel.updateBy = $scope.userName;
                            $scope.CheckCarton();
                        }
                        else {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "Carton นี้มีการย้ายสินค้าออกไปเรียบร้อยแล้ว"
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
                    if (res.data.itemsGroup.length > 0) {
                        $vm.searchResultModel = res.data.itemsGroup;
                        
                        $vm.filterModels = res.data.itemsLPN;
                        $vm.filterModel.tagOutNo = $scope.filterModel.tagOutNo;
                        $vm.filterModel.locationName = res.data.itemsGroup[0].locationName;
                        
                        if(res.data.msgResult != null)
                        {
                            dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'Information.',
                                        message: res.data.msgResult
                                    })
                        }

                        //$scope.filterModel.qty = res.data.itemsGroup[0].qty;
                        $scope.filterModel.create_By = $scope.userName;
                        $scope.filterModel.update_By = $scope.userName;
                        $scope.SumQty($scope.filterModel).then(function success(res) {
                            $scope.sum = res.data;
                            setTimeout(() => {
                                var focusElem = jQuery('input[ng-model="filterModel.tagNoNew"]');
                                if (focusElem[0].focus != undefined) {
                                    focusElem[0].focus();

                                }

                            }, 200);
                        });

                    }
                    // else {
                    //     dpMessageBox.alert({
                    //         ok: 'Close',
                    //         title: 'Information.',
                    //         message: "Carton นี้มีการย้ายสินค้าออกไปเรียบร้อยแล้ว"
                    //     })
                    //     document.getElementById("focusScanCTN").focus();
                    //     document.getElementById("focusScanCTN").select();
                    // }
                },
                    function error(res) {

                    });
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
                        $scope.filterModel.ownerName = angular.copy(param.ownerId) + " - " + angular.copy(param.ownerName);

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
                                //$vm.searchResultModel = res.data;
                                $scope.confirm();
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
                        if ($scope.filterModel.tagNoNew != undefined) {
                            // for (var i = 0; i <= models.listTransferItemViewModel.length - 1; i++) {
                            //     models.listTransferItemViewModel[i].tagNoNew = $scope.filterModel.tagNoNew;
                            // }
                            dpMessageBox.confirm({
                                ok: 'Yes',
                                cancel: 'No',
                                title: 'Confirm ?',
                                message: 'Do you want to Save !'
                            }).then(function () {
                                pageLoading.show();
                                viewModelTransferCarton.Save(models).then(function success(res) {
                                    if (res.data == "false") {
                                        dpMessageBox.alert({
                                            ok: 'Close',
                                            title: 'Information.',
                                            message: "ไม่สามารถย้ายมา Lpn นี้ได้"
                                        })
                                        $vm.filterModel = {};
                                        $scope.filterModel = {};
                                        $scope.filter();
                                        document.getElementById("focusScanCTN").focus();
                                        document.getElementById("focusScanCTN").select();
                                    }
                                    else {
                                        // pageLoading.hide();
                                        // dpMessageBox.alert({
                                        //     ok: 'Close',
                                        //     title: 'Information.',
                                        //     message: " Complete !!!"
                                        // })
                                        $vm.filterModel = {};
                                        $scope.filterModel = {};
                                        $scope.filter();
                                        document.getElementById("focusScanCTN").focus();
                                        document.getElementById("focusScanCTN").select();
                                    }

                                }, function error(param) {
                                    dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                                });
                            });
                        }
                        else {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: " Confirm Not Complete !!!"
                            })
                            init();
                        }
                    }
                })

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


            $scope.clearSearch = function (param) {
                $vm.filterModel = {};
                $scope.filterModel = {};
                $scope.sumLoc = {};
                $scope.filter();
            }

            var init = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
                $scope.filter();

            };
            init();

        }
    })
})();