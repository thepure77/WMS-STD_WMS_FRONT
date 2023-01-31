'use strict'
app.component('claimTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, $window, commonService) {
        return "modules/claim/component/claimTableList.html";
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
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox,claimFactory) {
        var $vm = this;
        var Progressbar = pageLoading;
        $scope.items = $scope.items || [];
        var viewModel = claimFactory;
        // setting column
        $scope.showColumnSetting = false;
        $scope.maxSize = 5;

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

        $scope.actionToS4 = function (docNo, wmsDocNo, itemNo) {
            if ($scope.s4ReactPopupFunc) {
                $scope.s4ReactPopupFunc(docNo, wmsDocNo, itemNo).then(function (res) {
                    switch (res) {
                        case 'close':
                            break;
                        case 'confirm':
                            $vm.triggerSearch();
                            break;
                        default:
                            break;
                    }
                });
            }
        };

        $scope.editItem = function (param) {
            pageLoading.show();
            viewModel.getId(param.claim_Index).then(function (res) {
                if (res.data.userAssign == "" || res.data.userAssign == undefined
                    || res.data.userAssign == null || res.data.userAssign == $scope.userName) {
                    param.UserAssign = $scope.userName;
                    // viewModel.updateUserAssign(param).then(function (res) {
                    //     pageLoading.hide();
                        if ($scope.onShow) {
                            $vm.isFilter = false;
                            $scope.onShow(param).then(function (result) {
                                $vm.isFilter = true;
                                $vm.triggerSearch();
                            }).catch(function (error) {
                                defer.reject({ 'Message': error });
                            });
                        }
                    // }).catch(function (error) { pageLoading.hide(); });
                }
                else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'InformaTion',
                        message: 'มี User อื่นทำอยู่ จะ ทำแทน หรือไม่ ?'
                    }).then(function success() {
                        // param.UserAssign = $scope.userName;
                        // viewModel.updateUserAssign(param).then(function (res) {
                            if ($scope.onShow) {
                                $vm.isFilter = false;
                                $scope.onShow(param).then(function (result) {
                                    $vm.isFilter = true;
                                }).catch(function (error) {
                                    defer.reject({ 'Message': error });
                                });
                            }
                        // }, function error(res) { });
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
            if (param.status_Id == 0)
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยันเอกสาร',
                    message: 'คุณต้องการยืนยันเอกสารใช่หรือไม่ ?'
                }).then(function success() {
                    param.update_By = localStorageService.get('userTokenStorage');
                    param.operations = "CONFIRM";
                    viewModel.confirmStatus(param).then(function success(res) {
                        if (res.data == true) {
                            dpMessageBox.alert({
                                ok: 'OK',
                                title: 'ยืนยันเอกสาร',
                                message: 'ยืนยันเอกสารสำเร็จ',
                            })
                        }
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

        $scope.closeDocument = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'ยืนยันเอกสาร',
                message: 'คุณต้องการปิดเอกสารใช่หรือไม่ ?'
            }).then(function success() {
                param.update_By = localStorageService.get('userTokenStorage');
                param.operations = "CLOSE";
                viewModel.closeDocument(param).then(function success(res) {
                    if (res.data == "success") {
                        dpMessageBox.alert({
                            ok: 'OK',
                            title: 'แจ้งเตือน',
                            message: 'ปิดเอกสารสำเร็จ',
                        })
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'Yes',
                            title: 'error',
                            message: res.data
                        })
                    }
                    $vm.triggerSearch();
                }, function error(res) {
                    dpMessageBox.alert({
                        ok: 'Yes',
                        title: 'error',
                        message: 'ไม่ สามารถ ปิดเอกสารได้!'
                    })
                });
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
                $scope.colortab1 = "#0088cc";
                $scope.colortab2 = "#FFFFFF";

                $scope.fronttab1 = "#FFFFFF";
                $scope.fronttab2 = "#0088cc";

            }
            else if (tab == 2) {
                $scope.colortab1 = "#FFFFFF";
                $scope.colortab2 = "#0088cc";

                $scope.fronttab1 = "#0088cc";
                $scope.fronttab2 = "#FFFFFF";
            }

            $scope.selected = tab;

            let ChangeTable = 1;
            $scope.model = $vm.filterModel;
            if (perPage != null || perPage != undefined) {
                $scope.model.perPage = perPage;
            }

            var p = $scope.model;
            serchPage(p);
        }

        // $vm.filterModel = {

        //     num: 1,
        //     maxSize: 5,
        //     perPage: $vm.filterModel.perPage,
        // };

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
                            $vm.searchResultModel = res.data.items;
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
    }
});