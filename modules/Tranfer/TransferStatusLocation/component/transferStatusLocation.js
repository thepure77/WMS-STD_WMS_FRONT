(function () {
    'use strict'
    app.component('transferStatusLocation', {
        controllerAs: '$vm',
        templateUrl: "modules/Tranfer/TransferStatusLocation/component/transferStatusLocation.html",
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',
            isLoading: '=?',
        },
        controller: function ($scope, $q, $filter, $state, pageLoading, $window, commonService, localStorageService, $timeout, dpMessageBox, ownerFactory, warehouseFactory, locationFactory, transferStatusLocationFactory,webServiceAPI) {
            var $vm = this;
            var defer = {};
            $vm.isFilter = true;
            
            $vm.isLoadingItem = false;
            $scope.filterModel = {};
            let viewModelOwner = ownerFactory;
            let viewModelWH = warehouseFactory;
            let viewModelLocation = locationFactory;
            let viewModelTransferStatusLocation = transferStatusLocationFactory;
            //let viewModelTransferPallet = TransferPalletFactory;
            //let viewModelTransferPallet = tranferPalletFactory;


            $scope.ScanBarcode = function () {
                $scope.filterModel = $scope.filterModel || {};
                if ($scope.filterModel.productId != "" && $scope.filterModel.productId != null) {
                    $scope.filterModel.locationName = "";
                    $scope.filterModel.productId = "";
                    $scope.filterModel.productName = "";
                    $scope.filterModel.qty = "";
                    $scope.filterModel.tagNoNew = "";

                }
                pageLoading.show();
                viewModelTransferStatusLocation.scanLpnNo($scope.filterModel).then(function success(res) {
                    pageLoading.hide();
                    
                    if (res.data.length > 0) {
                        $scope.filterModel.lstPickProduct = res.data;
                        let totalQty = 0;
                        angular.forEach($scope.filterModel.lstPickProduct, function (v, k) {
                            $scope.filterModel.lstPickProduct[k].pick = $scope.filterModel.lstPickProduct[k].binBalance_QtyBal - $scope.filterModel.lstPickProduct[k].binBalance_QtyReserve;
                            totalQty += (parseInt($scope.filterModel.lstPickProduct[k].binBalance_QtyBal) - parseInt($scope.filterModel.lstPickProduct[k].binBalance_QtyReserve));
                        });

                        //$vm.searchResultModel = res.data;
                        $vm.filterModel.locationName = res.data[0].location_Name;
                        //$scope.filterModel.productCount = res.data.length;
                        $scope.filterModel.productSelect = res.data.length;
                        $scope.filterModel.lpnNo = $scope.filterModel.lpnNo;
                        $scope.filterModel.locationName = res.data[0].location_Name;
                        $scope.filterModel.productId = res.data[0].product_Id;
                        $scope.filterModel.productIndex = res.data[0].product_Index;
                        $scope.filterModel.productName = res.data[0].product_Name;
                        $scope.filterModel.qty = res.data[0].binBalance_QtyBal - $scope.filterModel.lstPickProduct[0].binBalance_QtyReserve;
                        $scope.filterModel.totalQty = totalQty;
                        $scope.filterModel.productConversion_Name = res.data[0].productConversion_Name;
                        $scope.filterModel.location_Name = res.data[0].location_Name;
                        $scope.filterModel.ItemStatus_Name = res.data[0].itemStatus_Name;
                        // $scope.filterModel.productId = res.data[0].product_Id;
                        // $scope.filterModel.productIndex = res.data[0].product_Index;
                        // $scope.filterModel.productName = res.data[0].product_Name;
                        $scope.filterModel.create_By = $scope.userName;
                        $scope.filterModel.update_By = $scope.userName;
                        //$scope.SumQty($scope.filterModel);
                        // setTimeout(() => {
                        //     var focusElem = jQuery('input[ng-model="filterModel.TagNoNew"]');
                        //     if (focusElem[0].focus != undefined) {
                        //         focusElem[0].focus();

                        //     }

                        // }, 200);
                        //$scope.checkLocationBalance();
                        document.getElementById("locationNew").focus();
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: '???????????????????????????',
                            message: "????????????????????????????????????????????????"
                        })
                    }
                },
                    function error(res) {

                    });
            }

            $scope.ScanTransferNo = function () {
                $scope.filterModel = {};
                viewModelTransferStatusLocation.scanTransferNo($scope.modelTransfer).then(function success(res) {
                    pageLoading.hide();
                    if (res.data.length > 0) {
                        $scope.filterModel.lstGoodsTransfer = res.data;
                        $scope.transferItemHide();
                    }else {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "TransferNo Not Found !!!"
                        })

                        $scope.filterModel = {};
                        $scope.transferItemHide();
                    }
                },
                function error(res) {

                });
            }

            $scope.SumQty = function (model) {
                var deferred = $q.defer();
                viewModelTransferStatusLocation.SumQty(model).then(
                    function success(res) {
                        $scope.sumQty = res.data.sumQtyLPN;
                        deferred.resolve(res);
                    },
                    function error(response) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            $scope.confirm = function () {
                
                if($scope.filterModel.lstPickProduct == undefined || $scope.filterModel.lstPickProduct.length == 0)
                {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: '???????????????????????????',
                            message: '????????????????????????????????????????????????????????????'
                        }
                    )
                }
                else
                {
                    $scope.filterModel.documentType_Index = '485DAA74-BF94-441F-828D-3D6BFB2C616F';
                    $scope.filterModel.documentType_Id = 'TF10';
                    $scope.filterModel.documentType_Name = '???????????????????????????????????????';
                    $scope.filterModel.wareHouse_Index = 'B0AD4E8F-A7B1-4952-BAC7-1A9482BABA79';
                    $scope.filterModel.goodsTransfer_Date = getToday();

                    angular.forEach($scope.filterModel.lstPickProduct, function (v, k) {
                        if ($scope.dropdownItemStatus.model != null) {
                            $scope.filterModel.lstPickProduct[k].status_Index = $scope.filterModel.lstPickProduct[k].ItemStatus_Name
                            $scope.filterModel.lstPickProduct[k].status_Id = $scope.filterModel.lstPickProduct[k].ItemStatus_Name
                            $scope.filterModel.lstPickProduct[k].status_Name = $scope.filterModel.lstPickProduct[k].ItemStatus_Name
                        }
                        $scope.filterModel.lstPickProduct[k].location_Name = $scope.filterModel.locationNew;
                    });

                    if($scope.filterModel.lstPickProduct != undefined && $scope.filterModel.lstPickProduct.length == 1)
                    {
                        $scope.filterModel.lstPickProduct[0].pick = $scope.filterModel.qty;
                    }
                    let models = $scope.filterModel;
                    validate(models).then(function (result) {
                        if (result) {
                            $scope.validateMsg = result;
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: '???????????????????????????',
                                    message: result
                                }
                            )
                        }
                        else {
                            if ($scope.filterModel.locationNew != $vm.filterModel.locationName) {
                                dpMessageBox.confirm({
                                    ok: 'Yes',
                                    cancel: 'No',
                                    title: '??????????????????',
                                    message: '????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????? ?'
                                }).then(function () {
                                    pageLoading.show();
                                    models.operations = "CONFIRM";
                                    viewModelTransferStatusLocation.checkLocation($scope.filterModel).then(function success(res) {
                                        pageLoading.hide();
                                        if (res.data == '???????????????????????????????????????????????? Qty ???????????? Qty PerTag') {
                                            dpMessageBox.alert(
                                                {
                                                    ok: 'Close',
                                                    title: '???????????????????????????',
                                                    message: res.data
                                                }
                                            )
                                        }
                                        else if (res.data == '???????????????????????????????????????????????? ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????') {
                                            dpMessageBox.alert(
                                                {
                                                    ok: 'Close',
                                                    title: '???????????????????????????',
                                                    message: res.data
                                                }
                                            )
                                        }
                                        else if (res.data == '???????????????????????????????????????????????? ????????????????????????????????????????????? Block') {
                                            dpMessageBox.alert(
                                                {
                                                    ok: 'Close',
                                                    title: '???????????????????????????',
                                                    message: res.data
                                                }
                                            )
                                        }
                                        else if (res.data == '???????????????????????????????????????????????? ????????????????????????????????????????????????????????????????????????') {
                                            dpMessageBox.alert(
                                                {
                                                    ok: 'Close',
                                                    title: '???????????????????????????',
                                                    message: res.data
                                                }
                                            )
                                        }
                                        else{
                                            viewModelTransferStatusLocation.Save(models).then(function success(res) {
                                                pageLoading.hide();
                                                if (res.data == true) {
                                                    dpMessageBox.alert({
                                                        ok: 'Close',
                                                        title: '???????????????????????????',
                                                        message: " ???????????????????????????????????????????????????????????????"
                                                    })
                                                    init();
                                                }
                                                else {
                                                    dpMessageBox.alert({
                                                        ok: 'Close',
                                                        title: '???????????????????????????',
                                                        message: " ??????????????????????????????????????????????????????"
                                                    })
                                                    init();
                                                }
        
                                            }, function error(param) {
                                                dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                                            });
                                        }
                                    });
                                });
                            }
                            else {
                                dpMessageBox.alert({
                                    ok: 'Yes',
                                    title: '???????????????????????????',
                                    message: "???????????????????????????????????? ??????????????? ??????????????? ?????????????????????????????????????????? !"
                                })
                                $scope.filterModel.TagNoNew = "";
                            }
                        }
                    })
                }
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

            $scope.filter = function () {
                $scope.filterModel = $scope.filterModel || {};
                pageLoading.show();
                // $scope.filterowner($scope.filterModel).then(function success(res) {
                //     pageLoading.hide();

                //     $scope.filterModel.ownerIndex = res.data[0].ownerIndex;
                //     $scope.filterModel.ownerId = res.data[0].ownerId;
                //     $scope.filterModel.ownerName = res.data[0].ownerName;
                //     $scope.filterWarehouse($scope.filterModel).then(function success(res) {

                //         $scope.filterModel.WarehouseIndex = res.data[0].warehouseIndex
                //         $scope.filterModel.warehouseName = res.data[0].warehouseName;
                //         setTimeout(() => {
                //             var focusElem = jQuery('input[ng-model="filterModel.lpnNo"]');
                //             if (focusElem[0].focus != undefined) {
                //                 focusElem[0].focus();

                //             }

                //         }, 200);
                //     });
                // },
                //     function error(res) { });
            }

            // $scope.filterowner = function (model) {
            //     var deferred = $q.defer();
            //     pageLoading.show();
            //     viewModel.filterowner(model).then(
            //         function success(res) {
            //             deferred.resolve(res);
            //             pageLoading.hide(1000);
            //         },
            //         function error(response) {
            //             deferred.reject(response);
            //             pageLoading.hide(1000);
            //         });
            //     return deferred.promise;
            // }

            // $scope.filterWarehouse = function (model) {
            //     var deferred = $q.defer();
            //     pageLoading.show();
            //     viewModel.filterWarehouse(model).then(
            //         function success(res) {
            //             deferred.resolve(res);
            //             pageLoading.hide(1000);
            //         },
            //         function error(response) {
            //             deferred.reject(response);
            //             pageLoading.hide(1000);
            //         });
            //     return deferred.promise;
            // }

            $scope.ScanLocation = function (param) {
                
                let models = $scope.filterModel;
                if ($scope.filterModel.locationNew != undefined) {
                    if ($scope.filterModel.locationNew != $vm.filterModel.locationName) {
                        viewModelTransferStatusLocation.scanLocation(models).then(function success(res) {
                        
                            if (res.data != true) {
                                dpMessageBox.alert({
                                    ok: 'Yes',
                                    title: 'Information.',
                                    message: "??????????????? Location ????????????????????????"
                                })
                                //$scope.filterModel.TagNoNew = "";
                                setTimeout(() => {
                                    var focusElem = jQuery('input[ng-model="filterModel.locationNew"]');
                                    focusElem[0].focus();
                    
                                }, 200);
                            }
                            $scope.filterModel.owner_Index = $scope.filterModel.lstPickProduct[0].owner_Index;
                            $scope.filterModel.product_Index = $scope.filterModel.productIndex;
                            $scope.filterModel.tagNo_New = $scope.filterModel.TagNoNew;
                            $scope.filterModel.location_Name_To = $scope.filterModel.locationNew;
                            pageLoading.show();
                            viewModelTransferStatusLocation.checkLocation($scope.filterModel).then(function success(res) {
                                pageLoading.hide();
                                if (res.data == '???????????????????????????????????????????????? Qty ???????????? Qty PerTag') {
                                    dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: '???????????????????????????',
                                            message: res.data
                                        }
                                    )
                                }
                                else if (res.data == '???????????????????????????????????????????????? ??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????') {
                                    dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: '???????????????????????????',
                                            message: res.data
                                        }
                                    )
                                }
                                else if (res.data == '???????????????????????????????????????????????? ????????????????????????????????????????????? Block') {
                                    dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: '???????????????????????????',
                                            message: res.data
                                        }
                                    )
                                }
                                else if (res.data == '???????????????????????????????????????????????? ????????????????????????????????????????????????????????????????????????') {
                                    dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: '???????????????????????????',
                                            message: res.data
                                        }
                                    )
                                }
                            });

                        },
                            function error(res) {
                            });
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'Yes',
                            title: 'Information.',
                            message: "???????????????????????????????????????????????????????????? LPN ??????????????? Location ????????????????????? !"
                        })
                        setTimeout(() => {
                            var focusElem = jQuery('input[ng-model="filterModel.locationNew"]');
                            focusElem[0].focus();
            
                        }, 200);
                        $scope.filterModel.TagNoNew = "";
                    }
                }
            }

            function validate(param) {
                let defer = $q.defer();
                let msg = "";
                if (param.locationNew == null || param.locationNew == "") {
                    msg = ' New Location ?????????????????????????????????????????????????????? !'
                    defer.resolve(msg);
                }
                else if (param.locationName == null || param.locationName == "") {
                    msg = ' Location ?????????????????????????????????????????????????????????????????? !'
                    defer.resolve(msg);
                }
                defer.resolve(msg);

                return defer.promise;
            }

            $vm.locationlist = function () {
                if ($scope.filterModel.locationName != undefined) {
                    
                    if ($scope.isLoading) {
                        $vm.isFilter = false;
                       //var datalist = $vm.searchResultModel;
                       var datalist = $scope.filterModel.lstPickProduct
                        var items = $scope.filterModel;
                        var newItems = $vm.filterModel;
                        var sum = 0;
                        
                        $scope.isLoading(datalist, items, newItems, sum).then(function (result) {
                            //$scope.filterModel = viewModelTransferStatusLocation.getParam() || {};
                        
                            var countSelectItem = datalist.length;
                            $scope.filterModel.productSelect = countSelectItem;

                            if($scope.filterModel.lstPickProduct.length > 0)
                            {
                                $scope.filterModel.locationName = datalist[0].location_Name;
                                $scope.filterModel.productId = datalist[0].product_Id;
                                $scope.filterModel.productIndex = datalist[0].product_Index;
                                $scope.filterModel.productName = datalist[0].product_Name;
                                $scope.filterModel.qty = datalist[0].binBalance_QtyBal - $scope.filterModel.lstPickProduct[0].binBalance_QtyReserve;
                                $scope.filterModel.productConversion_Name = datalist[0].productConversion_Name;
                                $scope.filterModel.location_Name = datalist[0].location_Name;
                                $scope.filterModel.ItemStatus_Name = datalist[0].itemStatus_Name;
                            }
                            else
                            {
                                $scope.filterModel.locationName = "";
                                $scope.filterModel.productId = "";
                                $scope.filterModel.productIndex = "";
                                $scope.filterModel.productName = "";
                                $scope.filterModel.qty = "";
                                $scope.filterModel.location_Name = "";
                                $scope.filterModel.ItemStatus_Name = "";
                            }

                            // if($scope.filterModel.productCount != countSelectItem || $scope.filterModel.productSelect == 1)
                            // {
                            //     if($scope.filterModel.lstPickProduct.length > 0)
                            //     {
                            //         $scope.filterModel.locationName = $scope.filterModel.lstPickProduct[0].location_Name;
                            //         $scope.filterModel.productId = $scope.filterModel.lstPickProduct[0].product_Id;
                            //         $scope.filterModel.productIndex = $scope.filterModel.lstPickProduct[0].product_Index;
                            //         $scope.filterModel.productName = $scope.filterModel.lstPickProduct[0].product_Name;
                            //         $scope.filterModel.qty = $scope.filterModel.lstPickProduct[0].binBalance_QtyBal - $scope.filterModel.lstPickProduct[0].binBalance_QtyReserve;
                            //         $scope.filterModel.productConversion_Name = $scope.filterModel.lstPickProduct[0].productConversion_Name;
                            //         $scope.filterModel.location_Name = $scope.filterModel.lstPickProduct[0].location_Name;
                            //         $scope.filterModel.ItemStatus_Name = $scope.filterModel.lstPickProduct[0].itemStatus_Name;
                            //     }
                            // }
                            // else
                            // {
                            //     $scope.filterModel.locationName = "";
                            //     $scope.filterModel.productId = "";
                            //     $scope.filterModel.productIndex = "";
                            //     $scope.filterModel.productName = "";
                            //     $scope.filterModel.qty = "";
                            // }

                            $vm.isFilter = true;
                            $vm.isLoadingItem = false;

                        }).catch(function (error) {

                        });
                    }
                }
                else {
                    dpMessageBox.alert({
                        ok: 'Yes',
                        title: '???????????????????????????',
                        message: "????????????????????????????????????????????????????????????"
                    })
                }
            }

            $scope.clearSearch = function () {
                init();
            }

            $scope.chk = {
                IsRefTransferNo: false,
                IsRefTransferItem: false,
                IsSplitProduct: false
            };

            $scope.transferNoHide =function () {
                $scope.chk.IsRefTransferNo = $scope.chk.IsRefTransferNo === false ? true : false;
                if( $scope.chk.IsRefTransferNo == false)
                {
                    $scope.filterModel = {};
                    $scope.transferItemHide();
                }

                //$scope.filterModel.isSku = $scope.chk.IsRefTransferNo;
            }

            $scope.transferItemHide =function () {
                
                $scope.chk.IsRefTransferItem = ($scope.filterModel.lstGoodsTransfer != undefined && $scope.filterModel.lstGoodsTransfer.length > 0 ) ? true : false;

                //$scope.filterModel.lstGoodsTransfer.length > 0 ? true : false;
                //$scope.filterModel.isSku = $scope.chk.IsRefTransferNo;
            }

            $scope.splitProductHide =function () {
            
            if($scope.filterModel.lstPickProduct != undefined && $scope.filterModel.lstPickProduct.length == 1)
            {
                $scope.chk.IsSplitProduct = $scope.chk.IsSplitProduct === false ? true : false;
            }
                
                //$scope.filterModel.isSku = $scope.chk.IsRefTransferNo;
            }

            $vm.barcodelpn = function () {
                if ($scope.checkBalance) {
                    $vm.isFilter = false;
                    $scope.checkBalance().then(function (result) {
                        $vm.isFilter = true;
                    }).catch(function (error) {
                        defer.reject({ 'Message': error });
                    });
                }
            }

            $scope.autoComplete = {
                owner: "AutoGoodsTransfer/autoOwnerfilter",
                warehouse_Name: "AutoGoodsTransfer/autoWarehousefilter",

            };

            $scope.url = {
                GT: webServiceAPI.GT,
            };

            $scope.dropdownItemStatus = function () {
                viewModelTransferStatusLocation.dropdownItemStatus($scope.filterModel).then(function (res) {
                    $scope.dropdownItemStatus = res.data;
                });
            };

            function getToday() {
                var today = new Date();

                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();


                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }

            var init = function () {
                $scope.model = {};
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
                $vm.filterModel.locationName = "";
                $scope.filter();
                
                if ($scope.dropdownItemStatus.length == 0) {
                    $scope.dropdownItemStatus();
                }
                // document.getElementById("lpnNo").focus();
                setTimeout(() => {
                    var focusElem = jQuery('input[ng-model="filterModel.lpnNo"]');
                    focusElem[0].focus();
    
                }, 200);
                pageLoading.hide();
            };

            
            $("#lpnNo").bind("focus", function () {
                setTimeout(() => {
                    $("#lpnNo").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#lpnNo").attr("readonly", "readonly");
            });

            
            $("#locationNew").bind("focus", function () {
                setTimeout(() => {
                    $("#locationNew").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#locationNew").attr("readonly", "readonly");
            });

            init();
        }
    })
})();