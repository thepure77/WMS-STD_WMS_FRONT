'use strict'
app.component('brTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/Pallets/borrowingReturning/component/brTableList.html";
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
    controller: function ($scope, $filter, $q, $compile, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, purchaseOrderFactory, purchaseOrderItemFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        $scope.items = $scope.items || [];
        var viewModel = purchaseOrderFactory;
        var _viewModel = purchaseOrderItemFactory
        var item = $vm.searchResultModel;
        $scope.maxSize = 5;
        $scope.filterModel = {};

        var MessageBox = dpMessageBox;

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

        function validate(param) {
            var msg = "";
            return msg;
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

        $scope.editItem = function (param) {

            viewModel.getId(param.purchaseOrder_Index).then(function (res) {
                if (res.data.userAssign == "" || res.data.userAssign == undefined
                    || res.data.userAssign == null || res.data.userAssign == $scope.userName) {
                    param.UserAssign = $scope.userName;
                    viewModel.updateUserAssign(param).then(function (res) {
                        if ($scope.onShow) {
                            $vm.isFilter = false;
                            $scope.onShow(param).then(function (result) {
                                $vm.isFilter = true;
                            }).catch(function (error) {
                                defer.reject({ 'Message': error });
                            });
                        }
                    });
                }
                else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'InformaTion',
                        message: 'มี User อื่นทำอยู่ จะ ทำแทน หรือไม่ ?'
                    }).then(function success() {
                        param.UserAssign = $scope.userName;
                        viewModel.updateUserAssign(param).then(function (res) {
                            if ($scope.onShow) {
                                $vm.isFilter = false;
                                $scope.onShow(param).then(function (result) {
                                    $vm.isFilter = true;
                                }).catch(function (error) {
                                    defer.reject({ 'Message': error });
                                });
                            }
                        }, function error(res) { });
                    });
                }
            });
        }


        $scope.delete = function (param) {
            if (param.document_Status == 1 || param.document_Status == 3) {
                dpMessageBox.alert({
                    ok: 'ปิด',
                    title: 'ลบ',
                    message: 'ไม่สามารถลบข้อมูลที่ยืนยันเอกสารแล้วได้'
                })
            }
            else {
                dpMessageBox.confirm({
                    ok: 'ใช่',
                    cancel: 'ไม่',
                    title: 'ลบ',
                    message: 'ต้องการลบเอกสารหรือไม่'
                }).then(function success() {
                    param.cancel_By = localStorageService.get('userTokenStorage');
                    param.operations = "DELETE";
                    viewModel.getDelete(param).then(function success(res) {
                        $vm.triggerSearch();
                        if (res.data == false) {
                            dpMessageBox.alert({
                                ok: 'OK',
                                title: 'InformaTion',
                                message: 'ไม่สามารถลบข้อมูลได้ เนื่องจากมีการผูกเอกสารแล้ว ?',
                            })
                        }
                    }, function error(res) { });
                });
            }
        };

        $scope.comfirmStatus = function (param) {
            if (param.document_Status == 0)
                dpMessageBox.confirm({
                    ok: 'ใช่',
                    cancel: 'ไม่',
                    title: 'ยืนยันสถานะ',
                    message: 'คุณต้องการยืนยันสถานะใช่หรือไม่?'
                }).then(function success() {
                    param.update_By = localStorageService.get('userTokenStorage');
                    param.operations = "CONFIRM";
                    viewModel.confirmStatus(param).then(function success(res) {
                        $vm.triggerSearch();
                    }, function error(res) { });
                });
            else
                dpMessageBox.alert({
                    ok: 'Yes',
                    title: 'Confirm Status',
                    message: 'Status has been Confirmed !!!'
                })
        };

        $scope.detectCheckAll = function () {
            if ($scope.checkAll === true) {
                angular.forEach($vm.searchResultModel, function (v, k) {
                    $vm.searchResultModel[k].selected = true;
                });
            } else {
                angular.forEach($vm.searchResultModel, function (v, k) {
                    $vm.searchResultModel[k].selected = false;
                });
            }
        }

        $scope.closeDocument = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'ปิดเอกสาร',
                message: 'ต้องการปิดเอกสารหรือไม่ ?'
            }).then(function success() {
                param.update_By = localStorageService.get('userTokenStorage');
                param.operations = "CLOSE";
                viewModel.closeDocument(param).then(function success(results) {
                    if (results.data == true) {
                        MessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'ปิดเอกสารสำเร็จ'
                        })
                        $vm.triggerSearch();
                    }
                    $vm.triggerSearch();
                }, function error(res) { });
            });
        };


        $scope.cancelPlan = function (param) {
            dpMessageBox.confirm({
                ok: 'ใช่',
                cancel: 'ไม่',
                title: 'ยกเลิก',
                message: 'ต้องการยกเลิกเอกสารหรือไม่ ?'
            }).then(function success() {
                param.cancel_By = localStorageService.get('userTokenStorage');
                param.operations = "CANCEL";
                pageLoading.show();
                viewModel.cancel(param).then(function success(results) {
                    pageLoading.hide();
                    if (results.data == true) {
                        MessageBox.alert({
                            ok: 'Close',
                            title: 'ยกเลิก',
                            message: 'ยกเลิกสำเร็จ !!'
                        })
                        // $vm.triggerSearch();
                    }
                    else {
                        MessageBox.alert({
                            ok: 'Close',
                            title: 'ยกเลิก',
                            message: 'ไม่สามารถยกเลิกใบสั่งซื้อวัสดุได้ เนื่องจากใบสั่งซื้อวัสดุ: (' + param.purchaseOrder_No +  ')ถูกใช้งานอยู่'
                        })
                    }
                    $vm.triggerSearch();

                }, function error(res) { });
            });
        };

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

        $scope.changeTableSize = function (perPage, tab) {
            if (tab == 1) {
                $scope.colortab1 = "#990000";
                $scope.colortab2 = "#FFFFFF";

                $scope.fronttab1 = "#FFFFFF";
                $scope.fronttab2 = "#990000";

            }
            else if (tab == 2) {
                $scope.colortab1 = "#FFFFFF";
                $scope.colortab2 = "#990000";

                $scope.fronttab1 = "#990000";
                $scope.fronttab2 = "#FFFFFF";
            }

            $scope.selected = tab;

            let ChangeTable = 1;
            $scope.model = {};
            $scope.model = $vm.filterModel;
            if (perPage != null || perPage != undefined) {
                $scope.model.perPage = perPage;
                console.log($scope.model.perPage)
                console.log(perPage)
            }

            var p = $scope.model;
            serchPage(p);
        }


        function serchPage(data) {

            if (data != null) {

                pageLoading.show();
                viewModel.FilterSearch(data).then(function (res) {
                    pageLoading.hide();
                    if (res.data.length != 0 && res.data.length != undefined) {
                        $vm.filterModel.totalRow = res.data[0].count;
                        $vm.searchResultModel = res.data;

                    }
                    else {
                        if (res.data.pagination != null) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                            $vm.filterModel.currentPage = res.data.pagination.currentPage;
                            $vm.searchResultModel = res.data.itemsPlanGR;
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
            $scope.selected = 1;
            $scope.userName = localStorageService.get('userTokenStorage');
        };
        init();

    }
});