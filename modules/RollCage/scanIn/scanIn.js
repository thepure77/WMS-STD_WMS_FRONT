'use strict'
app.component('scanIn', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/RollCage/scanIn/scanIn.html";

    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',
        searchDataRow: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, scanInFactory,reworkRollCageFactory, webServiceAPI, logsFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = $scope.items || [];
        var viewModel = scanInFactory;
        var item = $vm.searchResultModel;
        $scope.showColumnSetting = false;
        $scope.maxSize = 5;
        $scope.filterModel = {};


        var MessageBox = dpMessageBox;
        function getToday() {
            var today = new Date();

            var mm = today.getMonth() + 1;
            var yyyy = today.getUTCFullYear();
            var dd = today.getDate();


            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;

            return yyyy.toString() + mm.toString() + dd.toString();
        }

        function validate(param) {
            var msg = "";
            return msg;
        }

        $scope.ScanRollCage = function () {
            $scope.filterModel = $scope.filterModel || {};
            if ($scope.filterModel.rollCage_Id == "" || $scope.filterModel.rollCage_Id == undefined) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'แจ้งเตือน',
                    message: "กำลังรอข้อมูลตอบกลับจากรถ AGV กรุณารอซักครู่."
                })
                $scope.filterModel = {};
                document.getElementById("rollCageId").focus();
                return;
            }

            pageLoading.show();
            viewModel.scanRollCageActiveEmptyChute($scope.filterModel).then(function success(res) {
                pageLoading.hide();
                if (res.data.length > 0) {

                    $scope.filterModel.rollCage_Index = res.data[0].rollCage_Index;
                    $scope.filterModel.rollCage_Name = res.data[0].rollCage_Name;
                    $scope.filterModel.rollCage_Status = res.data[0].rollCage_Status;
                    $scope.filterModel.location_Index = res.data[0].location_Index;
                    $scope.filterModel.location_Id = res.data[0].location_Id;
                    $scope.filterModel.location_Name = res.data[0].location_Name;

                    //document.getElementById("scanQRCode").focus();
                    //document.getElementById("locationNew").focus();

                    viewModel.rebindScanSummary($scope.filterModel).then(function success(res) {
                        if (res.data.length > 0) {
                            $scope.filterModelItem = res.data;

                            var splice = $scope.filterModelItem;
                            angular.forEach(splice, function (vv, kk) {
                                // var indexof = response.data.indexOf(vv)
                                // response.data.splice(indexof, 1)

                                var _msg = "";
                                _msg = (vv.isComplete == 0) ? "Waiting" : "Completed";
                                vv.msgComplete = _msg;
                            });

                        }
                        else {
                            $scope.filterModelItem = {};
                        }
                        $scope.filterModel.qrcode = "";

                    });

                }
                else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: "ไม่พบตะกร้า"
                    })
                    $scope.filterModel = {};
                    document.getElementById("rollCageId").focus();
                }
            },
                function error(res) {
                    //document.getElementById("scanQRCode").focus();
                });
        }

        $scope.popUpTagOutPopup = {
            onShow: false,
            delegates: {},
            onClick: function (param) {
                debugger
                $scope.popUpTagOutPopup.onShow = !$scope.popUpTagOutPopup.onShow;
                $scope.popUpTagOutPopup.delegates.popUpTagOutPopup(param);

            },
            config: {
                title: "PlanGI"
            },
            invokes: {
                add: function (param) { },
                edit: function (param) { },
                selected: function (param) {

                }
            }
        };

        $scope.ActiveRollCage = function () {
            $scope.filterModel = $scope.filterModel || {};
            if ($scope.filterModel.rollCage_Index == "" || $scope.filterModel.rollCage_Index == undefined) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'แจ้งเตือน',
                    message: "กรุณาแสกนตะกร้า"
                })
                $scope.filterModel.rollCage_Id = "";
                document.getElementById("rollCageId").focus();
                return;
            }

            pageLoading.show();
            $scope.filterModel.isRework = false;
            viewModel.isActiveRollCage($scope.filterModel).then(function success(res) {
                pageLoading.hide();
                if (res.data == true) {
                    $scope.filterModel.rollCage_Status = 1;
                    document.getElementById("scanQRCode").focus();
                    //document.getElementById("locationNew").focus();
                }
                else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: "ไม่พบตะกร้า"
                    })
                    $scope.filterModel.rollCage_Status = 1;
                    document.getElementById("rollCageId").focus();
                }
            },
                function error(res) {
                    document.getElementById("scanQRCode").focus();
                });
            document.getElementById("scanQRCode").focus();
        }

        $scope.ActiveRollCageRework = function () {
            $scope.filterModel = $scope.filterModel || {};
            if ($scope.filterModel.rollCage_Index == "" || $scope.filterModel.rollCage_Index == undefined) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'แจ้งเตือน',
                    message: "กรุณาแสกนตะกร้า"
                })
                $scope.filterModel.rollCage_Id = "";
                document.getElementById("rollCageId").focus();
                return;
            }

            pageLoading.show();
            $scope.filterModel.isRework = true;
            viewModel.isActiveRollCage($scope.filterModel).then(function success(res) {
                pageLoading.hide();
                if (res.data == true) {
                    $scope.filterModel.rollCage_Status = 1;
                    $scope.filterModel.rollCageRework_Status = 1;
                    document.getElementById("scanQRCode").focus();
                    //document.getElementById("locationNew").focus();
                }
                else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: "ไม่พบตะกร้า"
                    })
                    $scope.filterModel.rollCage_Status = 1;
                    $scope.filterModel.rollCageRework_Status = 1;
                    document.getElementById("rollCageId").focus();
                }
            },
                function error(res) {
                    document.getElementById("scanQRCode").focus();
                });
            document.getElementById("scanQRCode").focus();
        }


        $scope.scanQRCode = function () {
            $scope.filterModel = $scope.filterModel || {};
            if ($scope.filterModel.rollCage_Index == "" || $scope.filterModel.rollCage_Index == undefined) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'แจ้งเตือน',
                    message: "กรุณาแสกนตะกร้า"
                })
                $scope.filterModel.rollCage_Id = "";
                document.getElementById("rollCageId").focus();
                return;
            }

            pageLoading.show();
            viewModel.scanQRCode($scope.filterModel).then(function success(res) {
                pageLoading.hide();
                //var _qrCode = $scope.filterModel.qrcode;

                if (res.data.truckLoad_No != null) {

                    $scope.filterModel.truckLoad_No = res.data.truckLoad_No;
                    $scope.filterModel.planGoodsIssue_No = res.data.planGoodsIssue_No;
                    $scope.filterModel.countScanBOX = res.data.countScanBOX;
                    $scope.filterModel.totalBOX = res.data.totalBOX;
                    $scope.filterModel.shipTo_Id = res.data.shipTo_Id;
                    $scope.filterModel.branch_Name = res.data.branch_Name;
                    $scope.filterModel.goodsIssue_No = res.data.goodsIssue_No;
                    $scope.filterModel.route_Id = res.data.route_Id;
                    $scope.filterModel.shipTo_Address = res.data.shipTo_Address;
                    $scope.filterModel.round_Name = res.data.round_Name;

                    $scope.filterModel.create_By = $scope.userName;

                    // let modelData = $scope.filterModel;
                    // modelData.qrcode = _qrCode;

                    viewModel.rebindScanSummary($scope.filterModel).then(function success(res) {
                        if (res.data.length > 0) {
                            $scope.filterModelItem = res.data;

                            var splice = $scope.filterModelItem;
                            angular.forEach(splice, function (vv, kk) {
                                // var indexof = response.data.indexOf(vv)
                                // response.data.splice(indexof, 1)

                                var _msg = "";
                                _msg = (vv.isComplete == 0) ? "Waiting" : "Completed";
                                vv.msgComplete = _msg;
                            });

                        }
                        $scope.filterModel.qrcode = "";

                    });

                    // dpMessageBox.alert({
                    //     ok: 'Close',
                    //     title: 'แจ้งเตือน',
                    //     message: "แสกน " + $scope.filterModel.qrcode + " สำเร็จ"
                    // })


                    document.getElementById("scanQRCode").focus();
                }
                else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: "ไม่พบ QRCode"
                    })
                    $scope.filterModel.qrcode = "";
                    document.getElementById("scanQRCode").focus();
                }
            },
                function error(res) {
                    document.getElementById("scanQRCode").focus();
                });
        }

        $scope.scanQRCodeOrder = function () {
            $scope.filterModel = $scope.filterModel || {};
            $scope.filterModel.create_By = $scope.userName;
            if ($scope.filterModel.rollCage_Index == "" || $scope.filterModel.rollCage_Index == undefined) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'แจ้งเตือน',
                    message: "กรุณาแสกนตะกร้า"
                })
                $scope.filterModel.rollCage_Id = "";
                document.getElementById("rollCageId").focus();
                return;
            }

            //pageLoading.show();
            $scope.filterModel.chute_Id = $scope.checkChute.chute_Id;
            viewModel.scanQRCodeOrder($scope.filterModel).then(function success(res) {
                if (res.data != '') {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: res.data
                    })
                }

                viewModel.findQRCodeDataTruckload($scope.filterModel).then(function success(res) {
                    pageLoading.hide();
                    //var _qrCode = $scope.filterModel.qrcode;
    
                    if (res.data.truckLoad_No != null) {
    
                        $scope.filterModel.truckLoad_No = res.data.truckLoad_No;
                        $scope.filterModel.planGoodsIssue_No = res.data.planGoodsIssue_No;
                        $scope.filterModel.countScanBOX = res.data.countScanBOX;
                        $scope.filterModel.totalBOX = res.data.totalBOX;
                        $scope.filterModel.shipTo_Id = res.data.shipTo_Id;
                        $scope.filterModel.branch_Name = res.data.branch_Name;
                        $scope.filterModel.goodsIssue_No = res.data.goodsIssue_No;
                        $scope.filterModel.route_Id = res.data.route_Id;
                        $scope.filterModel.shipTo_Address = res.data.shipTo_Address;
                        $scope.filterModel.round_Name = res.data.round_Name;
    
                        $scope.filterModel.create_By = $scope.userName;

                        $scope.filterModel.countTmpRollcageOrder = res.data.countTmpRollcageOrder;

                        $scope.filterModel.qrcode = "";

                        if(res.data.totalBOX > 0 && res.data.countScanBOX == res.data.totalBOX && $scope.filterModel.chute_Id == res.data.chuteId)
                        {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'ท่าน Scan ครบตามจำนวนเรียบร้อยแล้ว'
                            })
                            $state.go('wms.chute');
                        }
                    }
                });

                
                document.getElementById("scanQRCodeOrder").focus();
                
            },
                function error(res) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'ไม่สามารถเชื่อมต่อข้อมูลได้ในขณะนี้'
                    })
                    document.getElementById("scanQRCodeOrder").focus();
                });
        }

        $scope.ClearQRCode = function () {
            $scope.filterModel.qrcode = "";
            document.getElementById("scanQRCodeOrder").focus();
        }

        var init = function () {
            $scope.userName = localStorageService.get('userTokenStorage');
            $scope.checkChute = angular.fromJson($window.localStorage['isChute']);
            $scope.dataRE = reworkRollCageFactory.getParam();
            if ($scope.checkChute == undefined || $scope.checkChute.chute_Id == null) {
                $state.go('wms.chute');
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'แจ้งเตือน',
                    message: "เลือก Chute ก่อน"
                })
            }

            setTimeout(() => {
                $("#rollCageId").removeAttr("readonly");
                document.getElementById("rollCageId").focus();
            }, 200);
            
            
        };
        init();

        $("#rollCageId").bind("focus", function () {
            setTimeout(() => {
                $("#rollCageId").removeAttr("readonly");
            }, 200);
        }).bind("blur", function () {
            $("#rollCageId").attr("readonly", "readonly");
        });

        $("#scanQRCode").bind("focus", function () {
            setTimeout(() => {
                $("#scanQRCode").removeAttr("readonly");
            }, 200);
        }).bind("blur", function () {
            $("#scanQRCode").attr("readonly", "readonly");
        });

        // $("#scanQRCodeOrder").bind("focus", function () {
        //     setTimeout(() => {
        //         $("#scanQRCodeOrder").removeAttr("readonly");
        //     }, 200);
        // }).bind("blur", function () {
        //     $("#scanQRCodeOrder").attr("readonly", "readonly");
        // });

    }
});