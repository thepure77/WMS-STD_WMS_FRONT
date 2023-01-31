(function () {
    'use strict'

    app.component('scanPickStgToDockExportForm', {
        controllerAs: '$vm',
        templateUrl: "modules/GI_export/scanPickStgToDockExport/component/scanPickStgToDockExportForm.html",
        bindings: {
            isLoading: '=?',
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',
        },
        controller: function ($scope, $q, $filter, $http,$location,$anchorScroll, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, scanPickStgToDockExportFactory, scanPickStgToDockItemExportFactory, webServiceAPI) {
            var $vm = this;
            var defer = {};
            var viewModel = scanPickStgToDockExportFactory;
            var viewModelItem = scanPickStgToDockItemExportFactory;
            $scope.filterModel = {};
            $scope.filterModel2 = {};
            $scope.isConfirm = false;
            $scope.isShortPick = false;
            $vm.isFilterTable = true;
            $scope.onShow = false;
            $scope.isConfrimlocation = false;
            $scope.filterModel.isBarcode = true;

            $vm.onShow = function (param) {
                defer = $q.defer();
                $vm.isFilterTable = true;
                $scope.isConfirm = false;
                $scope.isShortPick = false;
                $scope.onShow = true;
                $scope.filterModel.log_udf_2 = getToday();
                $scope.filterModel.log_udf_3 = getTime();
                if (param != undefined) {
                    search(param);
                }
                return defer.promise;
            };


            //#region  pick
            //ScanLocationPick
            $scope.ScanLocationPick = function () {
                if ($scope.filterModel.location_Name == $scope.filterModel.confirmlocation_Name) {
                    $scope.filterModel.confirmlocation_Index = $scope.filterModel.location_Index;
                    $scope.filterModel.isBarcode = true;
                    setTimeout(() => {
                        document.getElementById("productConversionBarcode").focus();
                        document.getElementById("productConversionBarcodeM").focus();
                    }, 200);
                }
                else {
                    $scope.filterModel.confirmlocation_Index = undefined;
                    $scope.filterModel.pick_ProductConversion_Index = undefined;
                    $scope.filterModel.pick_ProductConversion_Id = undefined;
                    $scope.filterModel.pick_ProductConversion_Name = undefined;
                    $scope.filterModel.pick_ProductConversion_Ratio = undefined;
                    $scope.filterModel.productConversionBarcode = undefined;
                    $scope.filterModel.pick_Qty = undefined;
                    $scope.filterModel.isBarcode = false;
                    $scope.filterModel.isPickQty = false;
                    $scope.filterModel.isCarton = false;
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'ตำแหน่งที่ยืนยันต้องเป็นตำแหน่งเดียวกันเท่านั้น'
                        }
                    )
                }
            }

            //ScanBarcode
            $scope.ScanBarcode = function () {
                pageLoading.show()
                $scope.filterModel.operations = "SCAN_BARCODE";
                viewModel.ScanBarcode($scope.filterModel).then(function (res) {
                    pageLoading.hide()
                    if (res.data.resultIsUse) {
                        // if (res.data.itemsDetail.length > 0) {
                        //     $scope.filterModel.pick_ProductConversion_Index = res.data.itemsDetail[0].pick_ProductConversion_Index;
                        //     $scope.filterModel.pick_ProductConversion_Id = res.data.itemsDetail[0].pick_ProductConversion_Id;
                        //     $scope.filterModel.pick_ProductConversion_Name = res.data.itemsDetail[0].pick_ProductConversion_Name;
                        //     $scope.filterModel.pick_ProductConversion_Ratio = res.data.itemsDetail[0].pick_ProductConversion_Ratio;
                            $scope.filterModel.isCarton = true;
                            document.getElementById("tagOut_No").focus();
                        // }
                    }
                    else {
                        $scope.filterModel.pick_ProductConversion_Index = undefined;
                        $scope.filterModel.pick_ProductConversion_Id = undefined;
                        $scope.filterModel.pick_ProductConversion_Name = undefined;
                        $scope.filterModel.pick_ProductConversion_Ratio = undefined;
                        $scope.filterModel.pick_Qty = undefined;
                        $scope.filterModel.isPickQty = false;
                        $scope.filterModel.isCarton = false;
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: res.data.resultMsg
                            }
                        )
                    }
                },
                    function error(response) {
                        $scope.filterModel.pick_ProductConversion_Index = undefined;
                        $scope.filterModel.pick_ProductConversion_Id = undefined;
                        $scope.filterModel.pick_ProductConversion_Name = undefined;
                        $scope.filterModel.pick_ProductConversion_Ratio = undefined;
                        $scope.filterModel.pick_Qty = undefined;
                        $scope.filterModel.isPickQty = false;
                        $scope.filterModel.isCarton = false;
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'Error'
                            }
                        )
                    })
            }

            //ScanCartonPick
            $scope.ScanCartonPick = function () {
                pageLoading.show()
                viewModel.ScanCarton($scope.filterModel).then(function (res) {
                    pageLoading.hide()
                    if (res.data.resultIsUse) {
                        if (res.data.itemsDetail.length > 0) {
                            $scope.filterModel.tagOut_Index = res.data.itemsDetail[0].tagOut_Index;
                            $scope.filterModel.tagOut_No = res.data.itemsDetail[0].tagOut_No;
                        }
                    }
                    else {
                        $scope.filterModel.tagOut_Index = undefined;
                        $scope.filterModel.tagOut_No = undefined;
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: res.data.resultMsg
                            }
                        )
                    }
                },
                    function error(response) {
                        $scope.filterModel.tagOut_Index = undefined;
                        $scope.filterModel.tagOut_No = undefined;
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'Error'
                            }
                        )
                    })
            }

            //getTagOut
            $scope.getTagOut = function () {
                dpMessageBox.confirm({
                    ok: 'ใช่',
                    cancel: 'ไม่',
                    title: 'ยืนยัน ?',
                    message: 'คุณต้องการสร้างเลขที่พาเลทหรือไม่'
                }).then(function () {
                    pageLoading.show()
                    viewModel.GetTagOut($scope.filterModel).then(function (res) {
                        pageLoading.hide()
                        if (res.data.resultIsUse) {
                            if (res.data.itemsDetail.length > 0) {
                                $scope.filterModel.tagOut_Index = res.data.itemsDetail[0].tagOut_Index;
                                $scope.filterModel.tagOut_No = res.data.itemsDetail[0].tagOut_No;
                            }
                        }
                        else {
                            $scope.filterModel.tagOut_Index = undefined;
                            $scope.filterModel.tagOut_No = undefined;
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: res.data.resultMsg
                                }
                            )
                        }
                    },
                        function error(response) {
                            $scope.filterModel.tagOut_Index = undefined;
                            $scope.filterModel.tagOut_No = undefined;
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'Error'
                                }
                            )
                        })
                })
            }

            $scope.getTagOutAuto = function () {
                viewModel.GetTagOut($scope.filterModel).then(function (res) {
                    if (res.data.resultIsUse) {
                        if (res.data.itemsDetail.length > 0) {
                            $scope.filterModel.tagOut_Index = res.data.itemsDetail[0].tagOut_Index;
                            $scope.filterModel.tagOut_No = res.data.itemsDetail[0].tagOut_No;
                        }
                    }
                    else {
                        $scope.filterModel.tagOut_Index = undefined;
                        $scope.filterModel.tagOut_No = undefined;
                    }
                })
            }

            //confirmPick
            $scope.confirmPick = function () {
                debugger
                $scope.isBlock = true;
                // if (!$scope.filterModel.confirmlocation_Index) {
                //     return dpMessageBox.alert(
                //         {
                //             ok: 'Close',
                //             title: 'แจ้งเตือน',
                //             message: 'ตำแหน่งจัดเก็บไม่ถูกต้อง กรุณายืนยันตำแหน่งใหม่อีกครั้ง'
                //         }
                //     )
                // }
                // if (!$scope.filterModel.pick_ProductConversion_Index) {
                //     return dpMessageBox.alert(
                //         {
                //             ok: 'Close',
                //             title: 'แจ้งเตือน',
                //             message: 'กรุณายืนยัน บาร์โค้ด ใหม่อีกครั้ง !'
                //         }
                //     )
                // }
                // if (!$scope.filterModel.tagOut_Index) {
                //     return dpMessageBox.alert(
                //         {
                //             ok: 'Close',
                //             title: 'แจ้งเตือน',
                //             message: 'กรุณายืนยัน Carton ใหม่อีกครั้ง !'
                //         }
                //     )
                // }
                // if ($scope.filterModel.pick_Qty == undefined || $scope.filterModel.pick_Qty == null) {
                //     return dpMessageBox.alert(
                //         {
                //             ok: 'Close',
                //             title: 'แจ้งเตือน',
                //             message: 'กรุณาใส่จำนวน '
                //         }
                //     )
                // }
                // else if (($scope.filterModel.pick_Qty * $scope.filterModel.pick_ProductConversion_Ratio) > $scope.filterModel.totalQty) {
                //     return dpMessageBox.alert(
                //         {
                //             ok: 'Close',
                //             title: 'แจ้งเตือน',
                //             message: 'กรอกยืนยันจำนวนเกินจำนวนที่รับ '
                //         }
                //     )
                // }
                // else if (($scope.filterModel.pick_Qty * $scope.filterModel.pick_ProductConversion_Ratio) < $scope.filterModel.totalQty) {
                //     $vm.isFilterTable = false;
                //     $scope.isShortPick = true;
                //     if ($scope.formData != null) {
                //         $scope.formData = {};
                //     }

                //     viewModel.GetReasonCode({}).then(function (res) {
                //         pageLoading.hide()
                //         if (res.data.length > 0) {
                //             $scope.reasonCodeAllItem = res.data;
                //         }
                //     },
                //         function error(response) {
                //             dpMessageBox.alert(
                //                 {
                //                     ok: 'Close',
                //                     title: 'แจ้งเตือน',
                //                     message: 'Save Error'
                //                 }
                //             )
                //         })
                // }
                //  else {
                    pageLoading.show()
                    $scope.filterModel.operations = "SCAN_CONFIRM";
                    $scope.filterModel.log_udf_4 =getToday();
                    $scope.filterModel.log_udf_5 =getTime();
                    $scope.filterModel.operations = $scope.filterModel.operations+" "+$scope.filterModel.task_No;
                    viewModel.ScanConfirm($scope.filterModel).then(function (res) {
                        pageLoading.hide()
                        $scope.isBlock = false;
                        if (res.data.resultIsUse) {
                            search(res.config.data);
                        }
                        else {
                            $scope.isBlock = false;
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: res.data.resultMsg
                                }
                            )
                        }
                    },
                        function error(response) {
                            $scope.isBlock = false;
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'Error'
                                }
                            )
                        })
                // }
            }

            //clearPick
            $scope.clearPick = function () {
                $scope.filterModel = angular.copy($scope.initialData)
            }

            $scope.clearLocation = function () {
                $scope.filterModel2.location_Index = undefined;
                $scope.filterModel2.location_Id = undefined;
                $scope.filterModel2.location_Name = undefined;
                $scope.filterModel2.confirmLocation = undefined;
            }

            //#endregion

            //#region confirmLocation
            //scanLocation
            $scope.scanLocation = function () {
                pageLoading.show()
                viewModel.ScanLocaton($scope.filterModel2).then(function (res) {
                    pageLoading.hide()
                    if (res.data.length > 0) {
                        $scope.filterModel2.location_Index = res.data[0].location_Index;
                        $scope.filterModel2.location_Id = res.data[0].location_Id;
                        $scope.filterModel2.location_Name = res.data[0].location_Name;
                        setTimeout(() => {
                            var focusElem = jQuery('input[ng-model="filterModel2.tagOut_No"]');
                            focusElem[0].focus();
                        }, 200);
                    }
                    else {
                        $scope.filterModel2.location_Index = undefined;
                        $scope.filterModel2.location_Id = undefined;
                        $scope.filterModel2.location_Name = undefined;
                        return dpMessageBox.alert(
                            {
                                ok: 'ปิด',
                                title: 'แจ้งเตือน',
                                message: 'ตำแหน่งจัดเก็บไม่ถูกต้อง กรุณายืนยันตำแหน่งใหม่อีกครั้ง',
                            }
                        )
                    }
                },
                    function error(response) {
                        $scope.filterModel2.location_Index = undefined;
                        $scope.filterModel2.location_Id = undefined;
                        $scope.filterModel2.location_Name = undefined;
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'Error'
                            }
                        )
                    })
            }

            $scope.scanLocationConfrim = function () {
                pageLoading.show()
                debugger
                viewModel.ScanLocaton($scope.filterModel).then(function (res) {
                    pageLoading.hide()
                    debugger
                    if (res.data.length > 0) {
                        $scope.filterModel.confirm_location_Index = res.data[0].location_Index;
                        $scope.filterModel.confirm_location_Id = res.data[0].location_Id;
                        $scope.filterModel.confirm_location_Name = res.data[0].location_Name;
                        setTimeout(() => {
                            var focusElem = jQuery('input[ng-model="filterModel.tagOut_No"]');
                            focusElem[0].focus();
                        }, 200);
                    }
                    else {
                        $scope.filterModel.confirm_location_Index = undefined;
                        $scope.filterModel.confirm_location_Id = undefined;
                        $scope.filterModel.confirm_location_Name = undefined;
                        return dpMessageBox.alert(
                            {
                                ok: 'ปิด',
                                title: 'แจ้งเตือน',
                                message: 'ตำแหน่งจัดเก็บไม่ถูกต้อง กรุณายืนยันตำแหน่งใหม่อีกครั้ง',
                            }
                        )
                    }
                },
                    function error(response) {
                        $scope.filterModel.confirm_location_Index = undefined;
                        $scope.filterModel.confirm_location_Id = undefined;
                        $scope.filterModel.confirm_location_Name = undefined;
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'Error'
                            }
                        )
                    })
            }

            //scanCartonLocation
            $scope.scanCartonLocation = function () {
                if (!$scope.filterModel2.location_Index) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'ตำแหน่งจัดเก็บไม่ถูกต้อง กรุณายืนยันตำแหน่งใหม่อีกครั้ง !'
                        }
                    )
                }
                pageLoading.show()
                $scope.filterModel2.isChkUpdate = true;
                viewModel.ScanCarton($scope.filterModel2).then(function (res) {
                    pageLoading.hide()
                    if (res.data.resultIsUse) {
                        if (res.data.itemsDetail.length > 0) {
                            $scope.filterModel2.tagOut_Index = res.data.itemsDetail[0].tagOut_Index;
                            $scope.filterModel2.tagOut_No = res.data.itemsDetail[0].tagOut_No;
                        }
                    }
                    else {
                        $scope.filterModel2.tagOut_Index = undefined;
                        $scope.filterModel2.tagOut_No = undefined;
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: res.data.resultMsg
                            }
                        )
                    }
                },
                    function error(response) {
                        $scope.filterModel.tagOut_Index = undefined;
                        $scope.filterModel.tagOut_No = undefined;
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'Error'
                            }
                        )
                    })
            }

            //confirmLocation
            $scope.confirmLocation = function () {
                if (!$scope.filterModel2.location_Index || !$scope.filterModel2.confirmLocation) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'ตำแหน่งจัดเก็บไม่ถูกต้อง กรุณายืนยันตำแหน่งใหม่อีกครั้ง !'
                        }
                    )
                }
                // if (!$scope.filterModel2.tagOut_Index) {
                //     return dpMessageBox.alert(
                //         {
                //             ok: 'Close',
                //             title: 'Error',
                //             message: 'กรุณา ยืนยัน TagOut ใหม่อีกครั้ง !'
                //         }
                //     )
                // }
                pageLoading.show()
                $scope.filterModel2.operations = "SCAN_CONFIRM_LOCATION";
                if (!$scope.isConfrimlocation) {
                    $scope.isConfrimlocation = true;
                    viewModel.ScanConfirmLocaton($scope.filterModel2).then(function (res) {
                        pageLoading.hide()
                        $scope.isConfrimlocation = false;
                        if (res.data) {
                            $vm.isFilterTable = true;
                            $scope.isConfirm = false;
                            $scope.filterModel2 = {};
                            defer.resolve(true);
                        }
                        else {
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: res.data.resultMsg
                                }
                            )
                        }
                    },
                        function error(response) {

                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'Error'
                                }
                            )
                        })
                }
            }
            //#endregion

            $scope.pickQty = function () {
                document.getElementById("tagOut_No").focus();
            }

            $scope.test = function () {
                if ($scope.isLoading) {
                    $vm.isFilterTable = false;
                    $scope.isLoading({}).then(function (result) {
                        $vm.isFilterTable = true;
                        $scope.filterModel.listPlanGoodsReceiveItemViewModel = $scope.filterModel.listPlanGoodsReceiveItemViewModel || []
                        if (result != '-99') {
                            if (result.planGoodsReceiveIndex == undefined)
                                result.flagUpdate = true;
                            $scope.filterModel.listPlanGoodsReceiveItemViewModel.push(angular.copy(result));
                        }

                    }).catch(function (error) {
                        defer.reject({ 'Message': error });
                    });
                }
            }

            function search(param) {
                $vm.isFilterTable = true;
                $scope.isConfirm = false;
                $scope.isShortPick = false;
                $scope.onShow = true;
                $scope.filterModel2 = {};
                pageLoading.show()
                let whereconfirmlocation = angular.copy(param);
                debugger
                viewModelItem.GetDataScanTaskItem(param).then(function (res) {
                    pageLoading.hide()
                    debugger
                    if (res.data.resultIsUse) {
                        if (res.data.itemsDetail.length > 0) {
                            $scope.filterModel = res.data.itemsDetail[0];
                            // $scope.filterModel.qty = $scope.filterModel.qty.toFixed(3);
                            $scope.filterModel.userName = $scope.userName
                            $scope.initialData = angular.copy($scope.filterModel)
                            document.getElementById("confirmlocation_Name").focus();
                            $scope.getTagOutAuto();
                        }else {
                            $scope.filterModel = {};
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'ทำการ Scan เรียบร้อยแล้ว'
                                }
                            )
                            defer.resolve(true);
                        }
                        //  else {
                        //     $vm.isFilterTable = false;
                        //     $scope.isConfirm = true;
                        //     $scope.filterModel2.task_Index = whereconfirmlocation.task_Index;
                        //     $scope.filterModel2.task_No = whereconfirmlocation.task_No;
                        //     $scope.filterModel2.process_Index = whereconfirmlocation.process_Index || whereconfirmlocation.ref_Process_Index;
                        //     $scope.filterModel2.goodsissue_Index = whereconfirmlocation.goodsissue_Index || whereconfirmlocation.ref_Document_Index;
                        //     $scope.filterModel2.goodsissue_No = whereconfirmlocation.goodsissue_No || whereconfirmlocation.ref_Document_No;
                        //     $scope.filterModel2.userName = $scope.userName;
                            
                        //     // document.getElementById("dropconfirmLocation").focus();
                        //     setTimeout(() => {
                        //         var focusElem = jQuery('input[ng-model="filterModel2.confirmLocation"]');
                        //         focusElem[0].focus();
                        //         $location.hash('top');

                        //         // call $anchorScroll()
                        //         $anchorScroll();
                        //     }, 200);
                        // }
                    }
                    else {
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: res.data.resultMsg
                            }
                        )
                    }
                },
                    function error(response) {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'Save Error'
                            }
                        )
                    })
            }

            function validate() {
                let defer = $q.defer();
                let formData = $scope.formData;
                let msg = "";
                if (formData == undefined || formData == null) {
                    msg = ' กรุณาเลือกเหตุผลที่จะ Short Pick !'
                    defer.resolve(msg);
                }
                else if (formData.reasonCodeIndex == undefined || formData.reasonCodeIndex == "") {
                    msg = ' กรุณาเลือกเหตุผลที่จะ Short Pick !'
                    defer.resolve(msg);
                }
                defer.resolve(msg);

                return defer.promise;
            }

            $scope.reasonCode = function () {
                let selectedReason = $scope.formData;
                if (selectedReason != null) {
                    let newItem = [];
                    let item = $scope.reasonCodeAllItem;
                    if (item != true) {
                        for (var i = 0; i <= item.length - 1; i++) {
                            let addparam = {};
                            if (selectedReason.reasonCodeName != null) {
                                if (selectedReason.reasonCodeName == item[i].reasonCodeName) {
                                    addparam.reasonCodeIndex = item[i].reasonCodeIndex;
                                    addparam.reasonCodeName = item[i].reasonCodeName;
                                    addparam.reasonCodeId = item[i].reasonCodeId;

                                    newItem.push(addparam);
                                }
                            }

                        }
                        if ($scope.formData.reasonCodeName != null) {
                            $scope.formData.reasonCodeName = newItem[0].reasonCodeName;
                            $scope.formData.reasonCodeIndex = newItem[0].reasonCodeIndex;
                            $scope.formData.reasonCodeId = newItem[0].reasonCodeId;
                        }
                        else {
                            $scope.formData = null;
                        }
                    }
                }
                else {
                    dpMessageBox.alert({
                        ok: 'Yes',
                        title: 'Information',
                        message: 'ReasonCode Name is Null'
                    }).then(function ok() { });
                }
            }

            $scope.Confirm = function () {
                $scope.validateMsg = "";
                validate().then(function (result) {
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
                        pageLoading.show();
                        $scope.filterModel.reasonCode_Index = $scope.formData.reasonCodeIndex;
                        $scope.filterModel.reasonCode_Id = $scope.formData.reasonCodeId;
                        $scope.filterModel.reasonCode_Name = $scope.formData.reasonCodeName;
                        $scope.filterModel.operations = "SCAN_CONFIRM";
                        $scope.filterModel.log_udf_4 =getToday();
                        $scope.filterModel.log_udf_5 =getTime();
                        $scope.filterModel.operations = $scope.filterModel.operations+" "+$scope.filterModel.task_No;
                        viewModel.ScanConfirm($scope.filterModel).then(function success(res) {
                            pageLoading.hide();
                            $vm.isFilterTable = true;
                            $scope.isShortPick = false;
                            search($scope.initialData);
                        }, function error(param) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: " Error !!"
                            })
                        });
                    }
                })
            }

            $scope.NotConfirm = function () {
                $vm.isFilterTable = true;
                $scope.isShortPick = false;
            }


            //back
            $scope.back = function () {
                $vm.isFilterTable = true;
                $scope.isConfirm = false;
                $scope.isShortPick = false;
                defer.resolve(true);
            }

            $scope.chkPickQty = function () {
                debugger
                if ($scope.filterModel.pick_Qty >= 0 && $scope.filterModel.pick_Qty != null) {
                    if (($scope.filterModel.pick_Qty * $scope.filterModel.pick_ProductConversion_Ratio) > $scope.filterModel.totalQty) {
                        if (!$scope.filterModel.tagOut_Index) {
                            $scope.filterModel.isCarton = false;
                        }
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'กรอกยืนยันจำนวนเกินจำนวนที่รับ'
                            }
                        )
                    }
                    else {
                        $scope.filterModel.isCarton = true;
                    }
                }
                else {
                    if (!$scope.filterModel.tagOut_Index) {
                        $scope.filterModel.isCarton = false;
                    }
                }
            }

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
                $scope.isBlock = false;
                $scope.userName = localStorageService.get('userTokenStorage');
            };
            init();

            $("#confirmlocation_Name").bind("focus", function () {
                setTimeout(() => {
                    $("#confirmlocation_Name").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#confirmlocation_Name").attr("readonly", "readonly");
            });

            $("#productConversionBarcodeM").bind("focus", function () {
                setTimeout(() => {
                    $("#productConversionBarcodeM").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#productConversionBarcodeM").attr("readonly", "readonly");
            });

            $("#tagOut_No").bind("focus", function () {
                setTimeout(() => {
                    $("#tagOut_No").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#tagOut_No").attr("readonly", "readonly");
            });

            $("#dropconfirmLocation").bind("focus", function () {
                setTimeout(() => {
                    $("#dropconfirmLocation").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#dropconfirmLocation").attr("readonly", "readonly");
            });
        }
    })
})();