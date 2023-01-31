'use strict'
app.component('scanOut', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/RollCage/scanOut/scanOut.html";

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
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, scanOutFactory, webServiceAPI, logsFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = $scope.items || [];
        var viewModel = scanOutFactory;
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
                    message: "ไม่พบตะกร้า"
                })
                $scope.filterModel.rollCage_Id = "";
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

                    document.getElementById("scanQRCode").focus();
                }
                else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: "ไม่พบตะกร้า"
                    })
                    $scope.filterModel.rollCage_Id = "";
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
            viewModel.scanOutQRCode($scope.filterModel).then(function success(res) {
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

                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: "แสกนยกเลิกสำเร็จ"
                    })

                    $scope.filterModel.qrcode = "";
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

        var init = function () {
            $scope.userName = localStorageService.get('userTokenStorage');
            $scope.checkChute = angular.fromJson($window.localStorage['isChute']);

            if($scope.checkChute == undefined || $scope.checkChute.chute_Id == null)
            {
                $state.go('wms.chute');
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'แจ้งเตือน',
                    message: "เลือก Chute ก่อน"
                })
            }

        };
        init();

    }
});