app.component("dockToStaging", {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/GR/putAway/dockToStaging/dockToStaging.html";

    },
    bindings: {
        isLoading: '=?',
        onShow: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: '=?',
        triggerCreate: '=?',
        isFilter: '=?',
    },
    controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, dpMessageBox, putAwayFactory,palletInspectionFactory, locationFactory) {
        var $vm = this;
        var defer = {};
        $scope.filterModel = {};
        var viewModel = putAwayFactory;
        let viewModelpalletInspection = palletInspectionFactory;
        
        $vm.isFilterTable = true;
        $scope.onShow = false;
        $scope.TaskModel = {};
        $scope.disabled = 0;
        // var _viewModel = locationFactory;
        $vm.$onInit = function () {
            $scope.userName = localStorageService.get('userTokenStorage');
            // document.getElementById("lpnNo").focus();
        }
        $scope.filterModel = {
            isSku: false
        };
        $scope.filterModel.log_udf_2 = getToday();
        $scope.filterModel.log_udf_3 = getTime();

        this.$onDestroy = function () {

        }

        $vm.onShow = function (param) {
            $scope.disabled = 0;
            $scope.TaskModel = param;
            defer = $q.defer();
            $scope.onShow = true;
            setTimeout(() => {
                var focusElem = jQuery('input[ng-model="filterModel.tag_No"]');
                focusElem[0].focus();

            }, 200);
            return defer.promise;
        }

        $scope.sku = {
            chk: false
        };

        $scope.hide = function () {
            $scope.sku.chk = $scope.sku.chk === false ? true : false;
            $scope.filterModel.isSku = $scope.sku.chk;
        };

        $scope.ScanLPN = function (model) {
            var deferred = $q.defer();
            model.taskGR_No = $scope.TaskModel.taskGR_No;
            pageLoading.show();
            viewModel.scanLpnDockToStaging(model).then(
                function success(res) {
                    pageLoading.hide();
                    if (res.data.length == 0) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: "ไม่พบเลขพาเลทนี้"
                        })
                    }
                    else {
                        $scope.filterModel.tag_No = res.data[0].tag_No;
                        $scope.filterModel.suggest_Location_Name = res.data[0].suggest_Location_Name;
                        $scope.filterModel.goodsReceive_Index = res.data[0].goodsReceive_Index;
                        $scope.filterModel.tag_Index = res.data[0].tag_Index;
                        document.getElementById("confirmLocation").focus();
                    }
                },
                function error(response) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: "เลขที่พาเลทไม่ถูกต้อง "
                    })
                    deferred.reject(response);
                });
            return deferred.promise;
        }

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
            $scope.filterModel.tag_No = $scope.filterModel.lpnNo;
            viewModel.chkTagItem($scope.filterModel).then(
            function success(res) {
                pageLoading.hide();
                if (res.data == false) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน.',
                        message: "ไม่พบเลขที่พาเลท"
                    })
                    $scope.filterModel.lpnNo = "";
                    document.getElementById("lpnNo").focus();
                }
                else {
                    viewModelpalletInspection.scanLpnNo($scope.filterModel).then(function success(res) {
                        pageLoading.hide();
                        
                        if (res.data.length > 0) {
                            $scope.filterModel.lstPickProduct = res.data;
                            let totalQty = 0;
                            angular.forEach($scope.filterModel.lstPickProduct, function (v, k) {
                                $scope.filterModel.lstPickProduct[k].pick = $scope.filterModel.lstPickProduct[k].binBalance_QtyBal - $scope.filterModel.lstPickProduct[k].binBalance_QtyReserve;
                                totalQty += (parseFloat($scope.filterModel.lstPickProduct[k].binBalance_QtyBal) - parseFloat($scope.filterModel.lstPickProduct[k].binBalance_QtyReserve));
                            });
        
                            //$vm.searchResultModel = res.data;
                            //$vm.filterModel.locationName = res.data[0].location_Name;
                            
                            //$scope.filterModel.productCount = res.data.length;
                            $scope.filterModel.productSelect = res.data.length;
                            $scope.filterModel.lpnNo = $scope.filterModel.lpnNo;
                            $scope.filterModel.tag_No = $scope.filterModel.lpnNo;
                            $scope.filterModel.locationName = res.data[0].location_Name;
                            //$scope.filterModel.locationNew = "STF0001";
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
        
                            document.getElementById("confirmLocation").focus();
                            //document.getElementById("locationNew").focus();
                        }
                        else {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: "ไม่พบเลขที่พาเลท"
                            })
                            $scope.filterModel.lpnNo = "";
                            document.getElementById("lpnNo").focus();
                        }
                    },
                    function error(res) {
        
                    });
                }
            },
            function error(response) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'แจ้งเตือน.',
                    message: "เลขที่พาเลทไม่ถูกต้อง "
                })
                deferred.reject(response);
            });

        }

        $scope.ScanSKU = function (model) {
            var deferred = $q.defer();
            if ($scope.filterModel.lpnNo == undefined
                || $scope.filterModel.lpnNo == ""
                || $scope.filterModel.lpnNo == null) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'แจ้งเตือน',
                    message: "กรุณาระบุเลขที่พาเลท"
                })
                return "";
            }
            else {
                pageLoading.show();
                viewModel.scanSKU(model).then(
                    function success(res) {
                        pageLoading.hide();
                        if (res.data.length == 0) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน.',
                                message: "ไม่เจอ SKU ใน LPN นี้"
                            })
                        }
                        else {
                            $scope.filterModel.qty = res.data[0].binBalance_QtyBal;
                            $scope.filterModel.productConversion_Name = res.data[0].productConversion_Name;
                            $scope.filterModel.product_Index = res.data[0].product_Index;
                            document.getElementById("confirmLocation").focus();
                        }
                    },
                    function error(response) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน.',
                            message: "เลขที่พาเลทไม่ถูกต้อง "
                        })
                        deferred.reject(response);
                    });
            }

            return deferred.promise;
        }


        $scope.sugesstion = function (param) {

            $scope.tagModel = $scope.tagModel || {};
            $scope.tagModel.listLPNItemViewModel = [];
            $scope.tagModel.listLPNItemViewModel.push(param);
            $scope.tagModel.update_By = $scope.userName;
            pageLoading.show();
            $scope.tagModel.operations = "SUGGESTION_LOCATION";
            viewModel.sugesstionLocation($scope.tagModel).then(function (res) {
                pageLoading.hide();

                let message = res.data.split(",");

                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'แนะนำตำแหน่ง',
                    messageNewLine: message
                });
                $scope.ScanLPN(param);
            });
        };

        $scope.confirmLocation = function (param) {
            var deferred = $q.defer();
            $scope.filterModel.location_Name = param.confirm_Location_Name;
            $scope.filterModel.locationNew = param.confirm_Location_Name;
            debugger
            if ($scope.filterModel.lpnNo == undefined
                || $scope.filterModel.lpnNo == ""
                || $scope.filterModel.lpnNo == null) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'แจ้งเตือน',
                    message: "กรุณาระบุเลขที่พาเลท"
                })
                return "";
            }
            if ($scope.filterModel.isSku == true && $scope.filterModel.product_Index == undefined || $scope.product_Id == "") {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'แจ้งเตือน',
                    message: "Please Scan SKU"
                })
                return "";
            }
            // if ($scope.filterModel.suggest_Location_Name != $scope.filterModel.confirm_Location_Name) {
            //     dpMessageBox.alert({
            //         ok: 'Close',
            //         title: 'แจ้งเตือน',
            //         message: "ตำแหน่งจัดเก็บไม่ตรงกับตำแหน่งที่แนะนำ"
            //     })
            //     return "";
            // }
            else {
                pageLoading.show();
                $scope.filterModel.operations = "CHECK_LOCATION";
                viewModel.chkLocationDockToStaging($scope.filterModel).then(
                    function success(res) {
                        pageLoading.hide();

                        if (res.data.length == 0) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'ไม่พบตำแหน่งจัดเก็บ'
                            })
                            $scope.filterModel.confirm_Location_Index = null;
                            $scope.filterModel.confirm_Location_Id= null;
                            $scope.filterModel.confirm_Location_Name = "";
                            document.getElementById("confirmLocation").focus();
                        }
                        // if (res.data[0].location_Name != $scope.filterModel.suggest_Location_Name) {
                        //     dpMessageBox.alert({
                        //         ok: 'Close',
                        //         title: 'แจ้งเตือน',
                        //         message: 'ตำแหน่งจัดเก็บไม่ตรงกับตำแหน่งที่แนะนำ'
                        //     })
                        //     $scope.filterModel.confirm_Location_Index = res.data[0].location_Index;
                        //     $scope.filterModel.confirm_Location_Id = res.data[0].location_Id;
                        // }
                        if (res.data.length == 1) {
                            $scope.filterModel.confirm_Location_Index = res.data[0].location_Index;
                            $scope.filterModel.confirm_Location_Id = res.data[0].location_Id;
                        }
                    },
                    function error(response) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "error"
                        })
                        deferred.reject(response);
                    });
            }
            return deferred.promise;
        };

        $scope.SaveDockToStaging = function () {

            $scope.disabled = 1;
            var deferred = $q.defer();
            $scope.filterModel.create_By = $scope.userName;
            if ($scope.filterModel.lpnNo == undefined
                || $scope.filterModel.lpnNo == ""
                || $scope.filterModel.lpnNo == null) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'ALERT',
                    message: "กรุณาระบุเลขที่พาเลท"
                })
                $scope.disabled = 0;
                return "";
            }
            if ($scope.filterModel.isSku == true && $scope.filterModel.product_Index == undefined || $scope.product_Id == "") {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'ALERT',
                    message: "Please Scan SKU"
                })
                $scope.disabled = 0;
                return "";
            }
            if ($scope.filterModel.confirm_Location_Index == undefined
                || $scope.filterModel.confirm_Location_Index == ""
                || $scope.filterModel.confirm_Location_Index == null) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'ALERT',
                    message: "กรุณาสแกนตำแหน่งจัดเก็บ"
                })
                $scope.disabled = 0;
                return "";
            }
            else {
                pageLoading.show();
                $scope.filterModel.taskGR_No = $scope.TaskModel.taskGR_No;
                $scope.filterModel.userAssign = $scope.userName;
                $scope.filterModel.update = 2;
                $scope.filterModel.operations = "Add dock to staging " + $scope.filterModel.lpnNo;
                $scope.filterModel.log_udf_4 =getToday();
                $scope.filterModel.log_udf_5 =getTime();
                pageLoading.show();
                viewModel.checkUserassign($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    if (res.data.msg == false) {
                        $scope.disabled = 0;
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'ALERT',
                                message: "UserAssign ไม่ตรงกับ ผู้ใช้งาน"
                            }
                        )
                        
                        defer.resolve('1');
                    }
                    else {
                        viewModel.SaveDockToStaging($scope.filterModel).then(
                            function success(res) {
                                pageLoading.hide();
                                if (res.data == "Done") {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: "บันทึกสำเร็จ"
                                    })

                                    if ($scope.filterModel.isSku == false) {
                                        $scope.filterModel = {};
                                        $scope.filterModel.isSku = false;
                                    }
                                    else if ($scope.filterModel.isSku == true) {
                                        $scope.filterModel = {};
                                        $scope.filterModel.isSku = true;
                                    }
                                    $scope.disabled = 0;
                                    document.getElementById("lpnNo").focus();
                                }
                                else if (res.data == "TaskSuccess") {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: "เลขที่งาน " + $scope.filterModel.taskGR_No + " จัดเก็บเสร็จสิ้น"
                                    }).then(function () { $scope.back(); });

                                    if ($scope.filterModel.isSku == false) {
                                        $scope.filterModel = {};
                                        $scope.filterModel.isSku = false;
                                    }
                                    else if ($scope.filterModel.isSku == true) {
                                        $scope.filterModel = {};
                                        $scope.filterModel.isSku = true;
                                    }
                                    $scope.disabled = 0;
                                }
                                else if(res.data == "blockPut"){
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: "location Block กรุณาติดต่อ Inventory"
                                    })
                                    $scope.disabled = 0;
                                    //SAต๋อง คิด msg นี้ 17/09/2020
                                }
                            },
                            function error(response) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: "error"
                                })
                                deferred.reject(response);
                            });
                    }

                });
            }

            return deferred.promise;
        };

        $scope.confirm = function () {
            debugger;
            $scope.filterModel.operations = "Confirm Scan dock to staging "+$scope.filterModel.lpnNo;
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

                // angular.forEach($scope.filterModel.lstPickProduct, function (v, k) {
                //     if ($scope.dropdownItemStatus.model != null) {
                //         $scope.filterModel.lstPickProduct[k].status_Index = $scope.filterModel.lstPickProduct[k].ItemStatus_Name
                //         $scope.filterModel.lstPickProduct[k].status_Id = $scope.filterModel.lstPickProduct[k].ItemStatus_Name
                //         $scope.filterModel.lstPickProduct[k].status_Name = $scope.filterModel.lstPickProduct[k].ItemStatus_Name
                //     }
                //     $scope.filterModel.lstPickProduct[k].location_Name = $scope.filterModel.locationNew;
                // });

                if($scope.filterModel.lstPickProduct != undefined && $scope.filterModel.lstPickProduct.length == 1)
                {
                    $scope.filterModel.lstPickProduct[0].location_Name = $scope.filterModel.locationNew;
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
                        if ($scope.filterModel.locationNew != $scope.filterModel.locationName) {
                            dpMessageBox.confirm({
                                ok: 'Yes',
                                cancel: 'No',
                                title: 'ยืนยัน',
                                message: 'คุณต้องการยืนยันการย้ายตำแหน่งจัดเก็บใช่หรือไม่ ?'
                            }).then(function () {
                                pageLoading.show();
                                // models.operations = "CONFIRM";
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
                                        viewModelpalletInspection.SaveTF(models).then(function success(res) {
                                            pageLoading.hide();
                                            if (res.data == true) {
                                                dpMessageBox.alert({
                                                    ok: 'Close',
                                                    title: 'แจ้งเตือน',
                                                    message: " การย้ายพาเลทเสร็จสิ้น"
                                                })

                                                viewModel.SaveDockToStaging($scope.filterModel).then(
                                                    function success(res) {
                                                        pageLoading.hide();
                                                        if (res.data == "Done") {
                                                            // dpMessageBox.alert({
                                                            //     ok: 'Close',
                                                            //     title: 'แจ้งเตือน',
                                                            //     message: "บันทึกสำเร็จ"
                                                            // })
                        
                                                            if ($scope.filterModel.isSku == false) {
                                                                $scope.filterModel = {};
                                                                $scope.filterModel.isSku = false;
                                                            }
                                                            else if ($scope.filterModel.isSku == true) {
                                                                $scope.filterModel = {};
                                                                $scope.filterModel.isSku = true;
                                                            }
                                                            $scope.disabled = 0;
                                                            document.getElementById("lpnNo").focus();
                                                        }
                                                        else if (res.data == "TaskSuccess") {
                                                            dpMessageBox.alert({
                                                                ok: 'Close',
                                                                title: 'แจ้งเตือน',
                                                                message: "เลขที่งาน " + $scope.filterModel.taskGR_No + " จัดเก็บเสร็จสิ้น"
                                                            }).then(function () { $scope.back(); });
                        
                                                            if ($scope.filterModel.isSku == false) {
                                                                $scope.filterModel = {};
                                                                $scope.filterModel.isSku = false;
                                                            }
                                                            else if ($scope.filterModel.isSku == true) {
                                                                $scope.filterModel = {};
                                                                $scope.filterModel.isSku = true;
                                                            }
                                                            $scope.disabled = 0;
                                                        }
                                                        else if(res.data == "blockPut"){
                                                            dpMessageBox.alert({
                                                                ok: 'Close',
                                                                title: 'แจ้งเตือน',
                                                                message: "location Block กรุณาติดต่อ Inventory"
                                                            })
                                                            $scope.disabled = 0;
                                                            //SAต๋อง คิด msg นี้ 17/09/2020
                                                        }
                                                        else if(res.data == "NOTAG"){
                                                            // dpMessageBox.alert({
                                                            //     ok: 'Close',
                                                            //     title: 'แจ้งเตือน',
                                                            //     message: "location Block กรุณาติดต่อ Inventory"
                                                            // })
                                                            $scope.disabled = 0;
                                                            //SAต๋อง คิด msg นี้ 17/09/2020
                                                        }
                                                    },
                                                    function error(response) {
                                                        dpMessageBox.alert({
                                                            ok: 'Close',
                                                            title: 'Information.',
                                                            message: "error"
                                                        })
                                                        deferred.reject(response);
                                                    });

                                                init();
                                            }
                                            else {
                                                dpMessageBox.alert({
                                                    ok: 'Close',
                                                    title: 'แจ้งเตือน',
                                                    message: " ย้ายพาเลทไม่สำเร็จ"
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

        $scope.back = function () {
            pageLoading.show();
            $scope.filterModel.taskGR_No = $scope.TaskModel.taskGR_No;
            viewModel.deleteUserassign($scope.filterModel).then(function (res) {
                pageLoading.hide();
                defer.resolve('1');
            });
        };

        $("#lpnNo").bind("focus", function () {
            setTimeout(() => {
                $("#lpnNo").removeAttr("readonly");
            }, 200);
        }).bind("blur", function () {
            $("#lpnNo").attr("readonly", "readonly");
        });

        $("#confirmLocation").bind("focus", function () {
            setTimeout(() => {
                $("#confirmLocation").removeAttr("readonly");
            }, 200);
        }).bind("blur", function () {
            $("#confirmLocation").attr("readonly", "readonly");
        });

        $("#product").bind("focus", function () {
            setTimeout(() => {
                $("#product").removeAttr("readonly");
            }, 200);
        }).bind("blur", function () {
            $("#product").attr("readonly", "readonly");
        });

    }
})