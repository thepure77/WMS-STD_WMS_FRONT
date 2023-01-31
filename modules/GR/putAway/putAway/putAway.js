app.component("putAway", {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/GR/putAway/putAway/putAway.html";

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
    controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, dpMessageBox, putAwayFactory, locationFactory) {
        var $vm = this;
        var defer = {};
        $scope.filterModel = {};
        var viewModel = putAwayFactory;
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

        this.$onDestroy = function () {

        }

        $vm.onShow = function (param) {
            $scope.disabled = 0;
            $scope.TaskModel = param;
            defer = $q.defer();
            $scope.onShow = true;
            $scope.log_udf_2 =getToday();
            $scope.log_udf_3 =getTime();
            $scope.filterModel.log_udf_2 = getToday();
            $scope.filterModel.log_udf_3 = getTime();
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
            viewModel.scanLpn(model).then(
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


        $scope.ScanSKU = function (model) {
            var deferred = $q.defer();
            if ($scope.filterModel.tag_Index == undefined
                || $scope.filterModel.tag_Index == ""
                || $scope.filterModel.tag_Index == null) {
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
            if ($scope.filterModel.tag_Index == undefined
                || $scope.filterModel.tag_Index == ""
                || $scope.filterModel.tag_Index == null) {
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
            if ($scope.filterModel.suggest_Location_Name != $scope.filterModel.confirm_Location_Name) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'แจ้งเตือน',
                    message: "ตำแหน่งจัดเก็บไม่ตรงกับตำแหน่งที่แนะนำ"
                })
                return "";
            }
            else {
                pageLoading.show();
                $scope.filterModel.operations = "CONFIRM_LOCATION";
                viewModel.confirmLocation($scope.filterModel).then(
                    function success(res) {
                        pageLoading.hide();

                        if (res.data.length == 0) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'ไม่พบตำแหน่งจัดเก็บ'
                            })
                            $scope.filterModel.location_Name = "";
                        }
                        if (res.data[0].location_Name != $scope.filterModel.suggest_Location_Name) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'ตำแหน่งจัดเก็บไม่ตรงกับตำแหน่งที่แนะนำ'
                            })
                            $scope.filterModel.confirm_Location_Index = res.data[0].location_Index;
                            $scope.filterModel.confirm_Location_Id = res.data[0].location_Id;
                        }
                        else {
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

        $scope.SavePutaway = function () {
            $scope.disabled = 1;
            var deferred = $q.defer();
            $scope.filterModel.create_By = $scope.userName;
            if ($scope.filterModel.tag_Index == undefined
                || $scope.filterModel.tag_Index == ""
                || $scope.filterModel.tag_Index == null) {
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
                $scope.filterModel.operations = "ADD";
                $scope.filterModel.operations = "ADD "+$scope.TaskModel.taskGR_No;
                $scope.filterModel.log_udf_2 =$scope.log_udf_2;
                $scope.filterModel.log_udf_3 =$scope.log_udf_3;
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
                        viewModel.SavePutaway($scope.filterModel).then(
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