(function () {
    'use strict'
    app.component('scanRefTransferNo', {
        controllerAs: '$vm',
        templateUrl: "modules/Tranfer/ScanRefTransferNo/component/scanRefTransferNo.html",
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',
            isLoading: '=?',
        },
        controller: function ($scope, $q, $filter, $state, pageLoading, $window, commonService, localStorageService, $timeout, dpMessageBox, scanRefTransferNoFactory, webServiceAPI,taskTransferFactory) {
            var $vm = this;
            var defer = {};
            $vm.isFilter = true;
            $vm.isLoadingItem = false;
            let viewModel = scanRefTransferNoFactory;
            $scope.filterModel = {};
            var _viewModel = taskTransferFactory;

            function validate(param) {
                let defer = $q.defer();
                let msg = "";
                if (param.location_Name_New == null || param.location_Name_New == "") {
                    msg = 'ตำแหน่งใหม่ต้องไม่เป็นค่าว่าง'
                    defer.resolve(msg);
                }
                else if (param.location_Name == null || param.location_Name == "") {
                    msg = 'ตำแหน่งเดิมต้องไม่เป็นค่าว่าง'
                    defer.resolve(msg);
                }
                defer.resolve(msg);

                return defer.promise;
            }

            $scope.clearSearch = function () {
                init();
            }

            $scope.ScanRefTransferNo = function () {
                pageLoading.show();
                $scope.filterModelmodel.IsTransferPalletInspection = false;
                if($scope.filterModelmodel.documentType_Name == 'Pallet Inspection')
                {
                    $scope.filterModelmodel.IsTransferPalletInspection = true;
                }

                viewModel.ScanRefTransferNo($scope.filterModelmodel.goodsTransfer_No,$scope.userName).then(function success(res) {
                    pageLoading.hide();
                    if (res.data.goodsTransfer_Index != "00000000-0000-0000-0000-000000000000" && res.data) {
                        $scope.model = angular.copy(res.data);
                        $scope.filterModel = res.data;
                        $scope.filterModel.log_udf_2 =getToday();
                        $scope.filterModel.log_udf_3 =getTime();
                    } else {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: "ไม่พบเลขที่ใบโอนย้าย"
                        })

                        $scope.filterModel = {};
                    }
                },
                    function error(res) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: "ไม่พบเลขที่ใบโอนย้าย"
                        })

                        $scope.filterModel = {};
                    });
            }

            $scope.GetTransferItem = function () {
                if (!$scope.filterModel.goodsTransfer_Index) {
                    return dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                            message: "ไม่พบเลขที่ใบโอนย้าย"
                    })
                }
                pageLoading.show();
                viewModel.GetTransferItem($scope.filterModelmodel.goodsTransfer_Index,$scope.filterModelmodel.taskTransfer_Index).then(function success(res) {
                    pageLoading.hide();
                    if (res.data.goodsTransfer_Index != "00000000-0000-0000-0000-000000000000") {
                        if ($scope.isLoading) {
                            $vm.isFilter = false;
                            $scope.isLoading(res).then(function (result) {
                                if (result) {
                                    $scope.filterModel.goodsTransferItem_Index = result[0].goodsTransferItem_Index;
                                    $scope.filterModel.goodsTransfer_Index = result[0].goodsTransfer_Index;
                                    $scope.filterModel.goodsReceive_Index = result[0].goodsReceive_Index;
                                    $scope.filterModel.goodsReceiveItem_Index = result[0].goodsReceiveItem_Index;
                                    $scope.filterModel.goodsReceiveItemLocation_Index = result[0].goodsReceiveItemLocation_Index;
                                    $scope.filterModel.lineNum = result[0].lineNum;
                                    $scope.filterModel.tagItem_Index = result[0].tagItem_Index;
                                    $scope.filterModel.tag_Index = result[0].tag_Index;
                                    $scope.filterModel.tag_No = result[0].tag_No;
                                    $scope.filterModel.tag_Index_To = result[0].tag_Index_To;
                                    $scope.filterModel.product_Index = result[0].product_Index;
                                    $scope.filterModel.product_Index_To = result[0].product_Index_To;
                                    $scope.filterModel.product_Lot = result[0].product_Lot;
                                    $scope.filterModel.product_Lot_To = result[0].product_Lot_To;
                                    $scope.filterModel.itemStatus_Index = result[0].itemStatus_Index;
                                    $scope.filterModel.itemStatus_Index_To = result[0].itemStatus_Index_To;
                                    $scope.filterModel.productConversion_Index = result[0].productConversion_Index;
                                    $scope.filterModel.productConversion_Id = result[0].productConversion_Id;
                                    $scope.filterModel.productConversion_Name = result[0].productConversion_Name;
                                    $scope.filterModel.owner_Index = result[0].owner_Index;
                                    $scope.filterModel.owner_Index_To = result[0].owner_Index_To;
                                    $scope.filterModel.location_Index = result[0].location_Index;
                                    $scope.filterModel.location_Index_To = result[0].location_Index_To;
                                    $scope.filterModel.goodsReceive_EXP_Date = result[0].goodsReceive_EXP_Date;
                                    $scope.filterModel.goodsReceive_EXP_Date_To = result[0].goodsReceive_EXP_Date_To;
                                    $scope.filterModel.qty = result[0].qty;
                                    $scope.filterModel.ratio = result[0].ratio;
                                    $scope.filterModel.totalQty = result[0].totalQty;
                                    $scope.filterModel.weight = result[0].weight;
                                    $scope.filterModel.volume = result[0].volume;
                                    $scope.filterModel.documentRef_No1 = result[0].documentRef_No1;
                                    $scope.filterModel.documentRef_No2 = result[0].documentRef_No2;
                                    $scope.filterModel.documentRef_No3 = result[0].documentRef_No3;
                                    $scope.filterModel.documentRef_No4 = result[0].documentRef_No4;
                                    $scope.filterModel.documentRef_No5 = result[0].documentRef_No5;
                                    $scope.filterModel.uDF_1 = result[0].uDF_1;
                                    $scope.filterModel.uDF_2 = result[0].uDF_2;
                                    $scope.filterModel.uDF_3 = result[0].uDF_3;
                                    $scope.filterModel.uDF_4 = result[0].uDF_4;
                                    $scope.filterModel.uDF_5 = result[0].uDF_5;
                                    $scope.filterModel.ref_Process_Index = result[0].ref_Process_Index;
                                    $scope.filterModel.ref_Document_No = result[0].ref_Document_No;
                                    $scope.filterModel.ref_Document_Index = result[0].ref_Document_Index;
                                    $scope.filterModel.ref_DocumentItem_Index = result[0].ref_DocumentItem_Index;
                                    $scope.filterModel.tag_No_To = result[0].tag_No_To;
                                    $scope.filterModel.product_Id = result[0].product_Id;
                                    $scope.filterModel.product_Name = result[0].product_Name;
                                    $scope.filterModel.product_SecondName = result[0].product_SecondName;
                                    $scope.filterModel.product_ThirdName = result[0].product_ThirdName;
                                    $scope.filterModel.product_Id_To = result[0].product_Id_To;
                                    $scope.filterModel.product_Name_To = result[0].product_Name_To;
                                    $scope.filterModel.product_SecondName_To = result[0].product_SecondName_To;
                                    $scope.filterModel.product_ThirdName_To = result[0].product_ThirdName_To;
                                    $scope.filterModel.itemStatus_Id = result[0].itemStatus_Id;
                                    $scope.filterModel.itemStatus_Name = result[0].itemStatus_Name;
                                    $scope.filterModel.itemStatus_Id_To = result[0].itemStatus_Id_To;
                                    $scope.filterModel.itemStatus_Name_To = result[0].itemStatus_Name_To;
                                    $scope.filterModel.owner_Id = result[0].owner_Id;
                                    $scope.filterModel.owner_Name = result[0].owner_Name;
                                    $scope.filterModel.owner_Id_To = result[0].owner_Id_To;
                                    $scope.filterModel.owner_Name_To = result[0].owner_Name_To;
                                    $scope.filterModel.location_Id = result[0].location_Id;
                                    $scope.filterModel.location_Name = result[0].location_Name;
                                    $scope.filterModel.location_Id_To = result[0].location_Id_To;
                                    $scope.filterModel.location_Name_To = ($scope.filterModelmodel.IsTransferPalletInspection) ? 'BUF-IP' : result[0].location_Name_To;
                                    $scope.filterModel.suggest_location = ($scope.filterModelmodel.IsTransferPalletInspection) ? 'BUF-IP' : result[0].location_Name_To;
                                    $scope.filterModel.IsTransferPalletInspection = $scope.filterModelmodel.IsTransferPalletInspection; // addnew
                                // document.getElementById("location_Name_New").focus();
                                setTimeout(() => {
                                    var focusElem = jQuery('input[ng-model="filterModel.location_Name_New"]');
                                    focusElem[0].focus();
                    
                                }, 200);
                                }
                                // $scope.filterModel.location_Name_New = $scope.filterModel.location_Name_To;
                                $vm.isFilter = true;
                                $vm.isLoadingItem = false;
                            });
                        }
                    } else {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "TransferNo Not Found !!!"
                        })
                    }
                },
                    function error(res) {

                    });
            }

            // $scope.ScanLocation = function () {
            //     validate($scope.filterModel);
            //     debugger;
            //     if ($scope.filterModel.location_Name_New != $scope.filterModel.location_Name_To) {
            //         return dpMessageBox.alert({
            //             ok: 'Close',
            //             title: 'แจ้งเตือน',
            //             message: "ตำแหน่งจัดเก็บใหม่ไม่ตรงกับเอกสาร"
            //         })
            //     }
            //     else{
            //         pageLoading.show();
            //         viewModel.checkLocation($scope.filterModel).then(function success(res) {
            //             pageLoading.hide();
            //             if (res.data == 'ไม่สามารถย้ายได้ Qty เกิน Qty PerTag') {
            //                 dpMessageBox.alert(
            //                     {
            //                         ok: 'Close',
            //                         title: 'แจ้งเตือน',
            //                         message: res.data
            //                     }
            //                 )
            //             }
            //             else if (res.data == 'ไม่สามารถย้ายได้ ตำแหน่งนี้เจ้าของสินค้าหรือสินค้าไม่ตรงกัน') {
            //                 dpMessageBox.alert(
            //                     {
            //                         ok: 'Close',
            //                         title: 'แจ้งเตือน',
            //                         message: res.data
            //                     }
            //                 )
            //             }
            //             else if (res.data == 'ไม่สามารถย้ายได้ ตำแหน่งนี้มีการ Block') {
            //                 dpMessageBox.alert(
            //                     {
            //                         ok: 'Close',
            //                         title: 'แจ้งเตือน',
            //                         message: res.data
            //                     }
            //                 )
            //             }
            //         });

            //     }
            // }


            $scope.confirm = function () {
                $scope.isBlock = true;
                debugger;
                validate($scope.filterModel);
                $scope.filterModel.log_udf_4 =getToday();
                $scope.filterModel.log_udf_5 =getTime();
                if ($scope.filterModel.location_Name_New != $scope.filterModel.location_Name_To) {
                    return dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: "ตำแหน่งใหม่ไม่ตรงกับเอกสาร"
                    })
                }
                pageLoading.show();
                $scope.filterModel.username = $scope.userName;
                $scope.filterModel.operations = "CONFIRM "+ $scope.filterModel.goodsTransfer_No;
                viewModel.checkLocation($scope.filterModel).then(function success(res) {
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
                    // else{
                    if($scope.filterModel.IsTransferPalletInspection)
                    {
                        viewModel.UpdateRePutaway($scope.filterModel).then(function success(res) {
                            pageLoading.hide();
                            if (res.data == "โอนย้ายเอกสารสำเร็จ") {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: res.data
                                })
                                init();
                                $state.go('wms.task_transfer', {});
                            } else if (res.data == "โอนย้ายตำแหน่งสำเร็จ") {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: res.data
                                })
                                $state.go('wms.task_transfer', {});
                                $scope.filterModel = angular.copy($scope.model);
                            } {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: res.data
                                })
                            }
                        },
                        function error(res) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: res.data
                            })
                        });
                    }
                    else
                    {
                        viewModel.ConfirmTaskTransfer($scope.filterModel).then(function success(res) {
                            pageLoading.hide();
                            if (res.data == "โอนย้ายเอกสารสำเร็จ") {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: res.data
                                })
                                init();
                                if($scope.isReplenish == true)
                                {
                                    $state.go('wms.task_transfer_replenish', {});
                                } else {
                                    $state.go('wms.task_transfer', {});
                                }
                            } else if (res.data == "โอนย้ายตำแหน่งสำเร็จ") {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: res.data
                                })
                                debugger
                                if($scope.isReplenish == true)
                                {
                                    $state.go('wms.task_transfer_replenish', {});
                                } else {
                                    $state.go('wms.task_transfer', {});
                                }
                                $scope.filterModel = angular.copy($scope.model);
                            } {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: res.data
                                })
                            }
                        },
                        function error(res) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: res.data
                            })
                        });
                    } // End Else IsTransferPalletInspection
                    // }
                });
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
                debugger
                $scope.isBlock = false;
                let item = _viewModel.getParam();
                _viewModel.setParam(undefined);
                $scope.item = item;
                $scope.filterModel = {};
                $scope.filterModelmodel = {};
                $scope.model = {};
                $scope.filterModelmodel = $scope.item;
                if($scope.filterModelmodel != undefined)
                {
                    $scope.isReplenish =  $scope.filterModelmodel.IsReplenish
                } 
                $scope.userName = localStorageService.get('userTokenStorage');
                if($scope.item != null){
                    $scope.ScanRefTransferNo();
                }
                document.getElementById("goodsTransfer_No").focus();
            };

            $("#goodsTransfer_No").bind("focus", function () {
                setTimeout(() => {
                    $("#goodsTransfer_No").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#goodsTransfer_No").attr("readonly", "readonly");
            });


            $("#location_Name_New").bind("focus", function () {
                setTimeout(() => {
                    $("#location_Name_New").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#location_Name_New").attr("readonly", "readonly");
            });


            init();
        }
    })
})();