'use strict'
app.component('carInspectionTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, $window, commonService) {
        return "modules/yardDock/carInspection/component/carInspectionTableList.html";
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
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, carInspectionFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = $scope.items || [];
        var viewModel = carInspectionFactory;
        var item = $vm.searchResultModel;
        // setting column
        $scope.showColumnSetting = false;
        $scope.maxSize = 5;

        // var validateMsg = "";
        var validatestatus1 = "";
        var validatestatus3 = [];
        var validateChk = [];
        var validateDelete = [];
        var validateMsg = [];


        $vm.$onInit = function () {
        }

        $vm.triggerCreate = function () {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow().then(function (result) {
                    $vm.triggerSearch();
                    $vm.isFilter = true;
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        };

        $scope.clickTab = function (tab) {
            $scope.click = tab;
        }

        $scope.comfirmStatus = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'ยืนยันเอกสาร',
                message: 'คุณต้องการยืนยันการตรวจรถใช่หรือไม่ ?'
            }).then(function success() {
                param.update_By = localStorageService.get('userTokenStorage');
                viewModel.confirmStatus(param).then(function success(res) {
                    if (res.data.resultIsUse == true) {
                        dpMessageBox.alert({
                            ok: 'OK',
                            title: 'ยืนยันการตรวจสอบ',
                            message: 'ยืนยันสำเร็จ',
                        })
                    } else {
                        dpMessageBox.alert({
                            ok: 'OK',
                            title: 'ยืนยันการตรวจสอบ',
                            message: res.data.resultMsg,
                        })
                    }
                    $vm.triggerSearch();
                }, function error(res) { });
            });

        };

        $scope.rejectStatus = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'ยืนยันเอกสาร',
                message: 'คุณต้องการยืนยันการตรวจรถใช่หรือไม่ ?'
            }).then(function success() {
                param.update_By = localStorageService.get('userTokenStorage');
                viewModel.rejectStatus(param).then(function success(res) {
                    if (res.data.resultIsUse == true) {
                        dpMessageBox.alert({
                            ok: 'OK',
                            title: 'ยืนยันการตรวจสอบ',
                            message: 'ยืนยันสำเร็จ',
                        })
                    } else {
                        dpMessageBox.alert({
                            ok: 'OK',
                            title: 'ยืนยันการตรวจสอบ',
                            message: res.data.resultMsg,
                        })
                    }
                    $vm.triggerSearch();
                }, function error(res) { });
            });

        };

        $scope.show = {
            action: true,
            pagination: true,
            checkBox: false
        }
        $scope.model = {
            currentPage: 1,
            numPerPage: 50,
            totalRow: 0
        };

        $scope.showCoload = false;

        $scope.changePage = function () {
            var page = $vm.filterModel;
            var all = {
                currentPage: 0,
                numPerPage: 0
            };
            if ($vm.filterModel.currentPage != 0) {
                page.currentPage = page.currentPage;
            }
            serchPage(page);
        }

        function serchPage(data) {
            if (data != null) {
                pageLoading.show();
                viewModel.filter(data).then(function (res) {
                    pageLoading.hide();
                    if (res.data.length != 0 && res.data.length != undefined) {
                        $vm.filterModel.totalRow = res.data[0].count;
                        $vm.searchResultModel = res.data;

                    }
                    else {
                        if (res.data.pagination != null) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                            $vm.filterModel.currentPage = res.data.pagination.currentPage;
                            $vm.searchResultModel = res.data.itemsCarInspection;
                            let dataList = $vm.searchResultModel;
                            for (var i = 0; i <= dataList.length - 1; i++) {
                                $vm.searchResultModel[i].row = i + 1;
                            }
                            $vm.searchDataRow = dataList.length;
                        }
                    }
                })
            }
        }

        var init = function () {
            $scope.userName = localStorageService.get('userTokenStorage');
            $scope.click = 1;
        };
        init();

    }
});