(function () {
    'use strict'
    app.component('palletInspection', {
        controllerAs: '$vm',
        templateUrl: "modules/Tranfer/PalletInspection/component/PalletInspection.html",
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',
            isLoading: '=?',
        },
        controller: function ($scope, $q, $filter, $state, pageLoading, $window, commonService, localStorageService, $timeout, dpMessageBox, ownerFactory, warehouseFactory, locationFactory, palletInspectionFactory,webServiceAPI) {
            var $vm = this;
            var defer = {};
            $vm.isFilter = true;
            
            $vm.isLoadingItem = false;
            $scope.filterModel = {};
            let viewModelOwner = ownerFactory;
            let viewModelWH = warehouseFactory;
            let viewModelLocation = locationFactory;
            let viewModelpalletInspection = palletInspectionFactory;


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
                viewModelpalletInspection.GetScanLpnNoPalletscanLpnNo($scope.filterModel).then(function success(res) {
                    pageLoading.hide();
                    
                    if (res.data.length > 0) {
                        $scope.filterModel.lstPickProduct = res.data;
                        let totalQty = 0;
                        angular.forEach($scope.filterModel.lstPickProduct, function (v, k) {
                            $scope.filterModel.lstPickProduct[k].pick = $scope.filterModel.lstPickProduct[k].binBalance_QtyBal - $scope.filterModel.lstPickProduct[k].binBalance_QtyReserve;
                            totalQty += (parseFloat($scope.filterModel.lstPickProduct[k].binBalance_QtyBal) - parseFloat($scope.filterModel.lstPickProduct[k].binBalance_QtyReserve));
                        });

                        //$vm.searchResultModel = res.data;
                        // $vm.filterModel.locationName = res.data[0].location_Name;
                        
                        //$scope.filterModel.productCount = res.data.length;
                        $scope.filterModel.productSelect = res.data.length;
                        $scope.filterModel.lpnNo = $scope.filterModel.lpnNo;
                        $scope.filterModel.locationName = res.data[0].location_Name;
                        $scope.filterModel.locationNewset = res.data[0].locationNew;
                        $scope.filterModel.location_Name_To = res.data[0].locationNew;
                        $scope.filterModel.location_type = res.data[0].location_type;
                        $scope.filterModel.locationType_Index = res.data[0].locationType_Index;
                        $scope.filterModel.go_type = res.data[0].go_type;
                        $scope.filterModel.productId = res.data[0].product_Id;
                        $scope.filterModel.productIndex = res.data[0].product_Index;
                        $scope.filterModel.productName = res.data[0].product_Name;
                        $scope.filterModel.qty = res.data[0].binBalance_QtyBal - $scope.filterModel.lstPickProduct[0].binBalance_QtyReserve;
                        $scope.filterModel.totalQty = totalQty;
                        $scope.filterModel.productConversion_Name = res.data[0].productConversion_Name;
                        $scope.filterModel.location_Name = res.data[0].location_Name;
                        $scope.filterModel.ItemStatus_Name = res.data[0].itemStatus_Name;
                        $scope.filterModel.create_By = $scope.userName;
                        $scope.filterModel.update_By = $scope.userName;
                        $scope.filterModel.tagItem_Index = res.data[0].tagItem_Index;
                        $scope.filterModel.goodsReceive_Index = res.data[0].goodsReceive_Index;
                        $scope.filterModel.goodsReceiveItem_Index = res.data[0].goodsReceiveItem_Index;
                        $scope.filterModel.product_Index = res.data[0].product_Index;
                        $scope.filterModel.itemStatus_Index = res.data[0].itemStatus_Index;
                        $scope.filterModel.productConversion_Index = res.data[0].productConversion_Index;

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
                            title: 'แจ้งเตือน',
                            message: "ไม่พบเลขที่พาเลท"
                        })
                    }
                },
                    function error(res) {

                    });
            }

            $scope.ScanTransferNo = function () {
                $scope.filterModel = {};
                viewModelpalletInspection.scanTransferNo($scope.modelTransfer).then(function success(res) {
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
                viewModelpalletInspection.SumQty(model).then(
                    function success(res) {
                        $scope.sumQty = res.data.sumQtyLPN;
                        deferred.resolve(res);
                    },
                    function error(response) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            $vm.onShow = function (param) {
                $scope.disabled = 0;
                $scope.filterModel.tag_No = param.tag_No;
                $scope.filterModel.lpnNo = param.tag_No;

                $scope.filterModel.taskGR_No = param.taskGR_No;

                $scope.filterModel.log_udf_2 = getToday();
                $scope.filterModel.log_udf_3 = getTime();
                
                $scope.TaskModel = param;
                defer = $q.defer();
                $scope.onShow = true;
                // setTimeout(() => {
                //     var focusElem = jQuery('input[ng-model="filterModel.tag_No"]');
                //     focusElem[0].focus();
    
                // }, 200);
                if($scope.filterModel.tag_No != undefined){
                    $scope.ScanBarcode();
                }else{
                    
                }

                return defer.promise;
            }

            $scope.confirm = function () {
                $scope.filterModel.log_udf_4 =getToday();
                $scope.filterModel.log_udf_5 =getTime();
                if($scope.filterModel.lstPickProduct == undefined || $scope.filterModel.lstPickProduct.length == 0)
                {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณาระบุเลขที่พาเลท'
                        }
                    )
                }
                else
                {
                    $scope.filterModel.documentType_Index = 'C56EDA23-FFC7-4065-ACA1-1CFCEB1A001F';
                    $scope.filterModel.wareHouse_Index = '72885519-D256-4AAD-9C37-A783B90E1DF2';
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
                                    title: 'แจ้งเตือน',
                                    message: result
                                }
                            )
                        }
                        else {
                            if (true) {
                                dpMessageBox.confirm({
                                    ok: 'Yes',
                                    cancel: 'No',
                                    title: 'ยืนยัน',
                                    message: 'คุณต้องการยืนยันการย้ายตำแหน่งจัดเก็บใช่หรือไม่ ?'
                                }).then(function () {
                                    pageLoading.show();
                                    models.operations = "CONFIRM "+$scope.filterModel.tag_No;
                                    
                                    $scope.filterModel.location_Name_To = $scope.filterModel.locationNew;   
                                    viewModelpalletInspection.checkLocation($scope.filterModel).then(function success(res) {
                                        pageLoading.hide();
                                        if (res.data == 'ไม่สามารถย้ายได้ Qty เกิน Qty PerTag') {
                                            dpMessageBox.alert(
                                                {
                                                    ok: 'Close',
                                                    title: 'แจ้งเตือน',
                                                    message: res.data
                                                }
                                            )
                                        }
                                        else if (res.data == 'ไม่สามารถย้ายได้ ตำแหน่งนี้เจ้าของสินค้าหรือสินค้าไม่ตรงกัน') {
                                            dpMessageBox.alert(
                                                {
                                                    ok: 'Close',
                                                    title: 'แจ้งเตือน',
                                                    message: res.data
                                                }
                                            )
                                        }
                                        else if (res.data == 'ไม่สามารถย้ายได้ ตำแหน่งนี้มีการ Block') {
                                            dpMessageBox.alert(
                                                {
                                                    ok: 'Close',
                                                    title: 'แจ้งเตือน',
                                                    message: res.data
                                                }
                                            )
                                        }
                                        else{
                                            viewModelpalletInspection.Save(models).then(function success(res) {
                                                pageLoading.hide();
                                                debugger
                                                if (res.data.resultIsUse == true) {

                                                    viewModelpalletInspection.savelogsRequest(models).then(function () {
                                                    });

                                                    dpMessageBox.alert({
                                                        ok: 'Close',
                                                        title: 'แจ้งเตือน',
                                                        message: " การย้ายพาเลทเสร็จสิ้น"
                                                    })
                                                    init();
                                                    defer.resolve('-99');
                                                }
                                                else {
                                                    dpMessageBox.alert({
                                                        ok: 'Close',
                                                        title: 'แจ้งเตือน',
                                                        message: res.data.resultMsg
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
                                    title: 'แจ้งเตือน',
                                    message: "ไม่สามารถโอน พาเลท ไปยัง ตำแหน่งเดิมได้ !"
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
                    if ($scope.filterModel.locationNew != param.locationName) {
                        viewModelpalletInspection.scanLocation(models).then(function success(res) {
                        
                            if (res.data != true) {
                                dpMessageBox.alert({
                                    ok: 'Yes',
                                    title: 'Information.',
                                    message: "ไม่พบ Location ที่กำหนด"
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
                            debugger
                            $scope.filterModel.location_Name_To = $scope.filterModel.locationNew;
                            pageLoading.show();
                            viewModelpalletInspection.checkLocation($scope.filterModel).then(function success(res) {
                                pageLoading.hide();
                                // if (res.data == 'ไม่สามารถย้ายได้ Qty เกิน Qty PerTag') {
                                //     dpMessageBox.alert(
                                //         {
                                //             ok: 'Close',
                                //             title: 'แจ้งเตือน',
                                //             message: res.data
                                //         }
                                //     )
                                // }
                                // else if (res.data == 'ไม่สามารถย้ายได้ ตำแหน่งนี้เจ้าของสินค้าหรือสินค้าไม่ตรงกัน') {
                                //     dpMessageBox.alert(
                                //         {
                                //             ok: 'Close',
                                //             title: 'แจ้งเตือน',
                                //             message: res.data
                                //         }
                                //     )
                                // }
                                // else if (res.data == 'ไม่สามารถย้ายได้ ตำแหน่งนี้มีการ Block') {
                                //     dpMessageBox.alert(
                                //         {
                                //             ok: 'Close',
                                //             title: 'แจ้งเตือน',
                                //             message: res.data
                                //         }
                                //     )
                                // }
                                // else if (res.data == 'ไม่สามารถย้ายได้ ตำแหน่งนี้สินค้าอยู่แล้ว') {
                                //     dpMessageBox.alert(
                                //         {
                                //             ok: 'Close',
                                //             title: 'แจ้งเตือน',
                                //             message: res.data
                                //         }
                                //     )
                                // }
                            });

                        },
                            function error(res) {
                            });
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'Yes',
                            title: 'Information.',
                            message: "ไม่สามารถโอนสินค้าใน LPN ไปยัง Location เดิมได้ !"
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
                    msg = ' New Location ต้องไม่เป็นค่าว่าง !'
                    defer.resolve(msg);
                }
                else if (param.locationName == null || param.locationName == "") {
                    msg = ' Location เดิมต้องไม่เป็นค่าว่าง !'
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
                            //$scope.filterModel = viewModelpalletInspection.getParam() || {};
                        
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
                        title: 'แจ้งเตือน',
                        message: "กรุณาระบุเลขที่พาเลท"
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
                viewModelpalletInspection.dropdownItemStatus($scope.filterModel).then(function (res) {
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
    
            function getTime() {
                var Minute = new Date().getMinutes();
                var Hour = new Date().getHours();
    
                if (Minute < 10) Minute = '0' + Minute;
    
                return Hour.toString() + ':' + Minute.toString()
            }

            var init = function () {
                $scope.model = {};
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
                // $vm.filterModel.locationName = "";
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