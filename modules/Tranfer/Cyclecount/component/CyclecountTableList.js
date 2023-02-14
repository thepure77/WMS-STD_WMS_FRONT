'use strict'
app.component('cyclecountTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, $window, commonService) {
        return "modules/Tranfer/Cyclecount/component/CyclecountTableList.html";
    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, cyclecountFactory,kMessageBox) {
        var $vm = this;
        $scope.items = $scope.items || [];
        var viewModel = cyclecountFactory;
        var item = $vm.searchResultModel;
        // setting column
        $scope.showColumnSetting = false;

        $vm.$onInit = function () {
            $scope.pagging = {
                totalRow: 0,
                currentPage: 1,
                numPerPage: $vm.filterModel.numPerPage,
                num: 1,
                maxSize: 2,
                perPage: 20,
                change: function () {
                    $vm.filterModel.currentPage = this.currentPage - 1;
                    if ($vm.triggerSearch) {
                        $vm.triggerSearch();
                    }
                },
                changeSize: function () {
                    $vm.filterModel.numPerPage = $scope.pagging.perPage
                    $vm.triggerSearch();
                }
            }
            $scope.userName = localStorageService.get('userTokenStorage');

        }

        // $scope.detectCheckAll = function () {
        //     if ($scope.checkAll === true) {
        //         angular.forEach($vm.searchResultModel, function (v, k) {
        //             $vm.searchResultModel[k].selected = true;
        //         });
        //     } else {
        //         angular.forEach($vm.searchResultModel, function (v, k) {
        //             $vm.searchResultModel[k].selected = false;
        //         });
        //     }
        // }

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


        $scope.edit = function (param) {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow(param).then(function (result) {
                    $vm.triggerSearch();
                    $vm.isFilter = true;
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        };

        $scope.delete = function (param) {
            param.cancel_By = $scope.userName;
            dpMessageBox.confirm({
                ok: 'ใช่',
                cancel: 'ไม่',
                title: 'แจ้งเตือน',
                message: 'คุณต้องการยกเลิกเอกสารใช่หรือไม่?'
            }).then(function success() {
                param.operations = "DELETE";
                viewModel.getDelete(param).then(function success(res) {
                    $vm.triggerSearch();
                    if (res.data == true) {
                        dpMessageBox.alert({
                            ok: 'OK',
                            title: 'แจ้งเตือน',
                            message: 'ยกเลิกเอกสารสำเร็จ',
                        })
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'OK',
                            title: 'แจ้งเตือน',
                            message: 'ไม่สามารถยกเลิกข้อมูลได้',
                        })
                    }
                }, function error(res) {
                    dpMessageBox.alert({
                        ok: 'OK',
                        title: 'แจ้งเตือน',
                        message: 'ไม่สามารถยกเลิกข้อมูลได้',
                    })
                });
            });
        };

        // $scope.delete = function (param) {
        //     param.cancel_By = $scope.userName;

        //     viewModel.getDelete(param).then(function success(res) {
        //         $vm.triggerSearch();
        //         if (res.data == true) {
        //             dpMessageBox.alert({
        //                 ok: 'OK',
        //                 title: 'ยกเลิก',
        //                 message: 'ยกเลิกเอกสารสำเร็จ',
        //             })
        //         }
        //         else {
        //             dpMessageBox.alert({
        //                 ok: 'OK',
        //                 title: 'แจ้งเตือน',
        //                 message: 'ไม่สามารถยกเลิกข้อมูลได้',
        //             })
        //         }
        //     }, function error(res) {
        //         dpMessageBox.alert({
        //             ok: 'OK',
        //             title: 'แจ้งเตือน',
        //             message: 'ไม่สามารถยกเลิกข้อมูลได้',
        //         })
        //     });
        // };

        $scope.popupReport = {
            onShow: false,
            delegates: {},
            onClick: function (param) {
                $scope.popupReport.onShow = !$scope.popupReport.onShow;
                $scope.popupReport.delegates.reportPopup(param);
            },
            config: {
                title: "ReportView"
            },
            invokes: {
                add: function (param) { },
                edit: function (param) { },
                selected: function (param) { }
            }
        };

        $scope.print = function (param) {
            pageLoading.show();
            param.operations = "PRINT";
            viewModel.PrintOutCycleCount(param).then(function success(res) {
                pageLoading.hide();
                if (res.data != "") {
                    $scope.popupReport.onClick(res);
                }
                else {
                    dpMessageBox.alert({
                        ok: 'OK',
                        title: 'InformaTion',
                        message: 'ไม่พบข้อมูล',
                    })
                }
            }, function error(res) {
                dpMessageBox.alert({
                    ok: 'OK',
                    title: 'InformaTion',
                    message: 'ไม่พบข้อมูล',
                })
            });
        }


        $scope.show = {
            action: true,
            pagination: true,
            checkBox: false
        }
        $scope.model = {
            currentPage: 1,
            numPerPage: 30,
            totalRow: 0,
            advanceSearch: false
        };
        // coload toggle
        $scope.showCoload = false;

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
            $scope.model = $vm.filterModel;
            if (perPage != null || perPage != undefined) {
                $scope.model.perPage = perPage;
            }

            var p = $scope.model;
            searchPage(p);
        };

        $scope.changePage = function () {
            var page = $vm.filterModel;

            var all = {
                currentPage: 0,
                perPage: 0
            };
            if ($vm.filterModel.currentPage != 0) {
                page.currentPage = page.currentPage;
            }

            $scope.searchPage(page);
        }

        // $scope.pageOption = [
        //     { value: 30 },
        //     { value: 50 },
        //     { value: 100 },
        //     { value: 500 }
        // ];

        $scope.sortBy = function (propertyName) {
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
        };

        $scope.comfirmStatus = function (param) {

            if (param.document_Status == 0)
                dpMessageBox.confirm({
                    title: 'ยืนยันสถานะ',
                    message: 'คุณต้องการยืนยันเอกสารใช่หรือไม่ ?'
                }).then(function success() {
                    // param.create_Date = null;
                    // param.update_Date = null;
                    // param.cancel_Date = null;
                    param.update_By = localStorageService.get('userTokenStorage');
                    // param.operations = "CONFIRM";
                    pageLoading.show();
                    viewModel.confirmStatus(param).then(function success(res) {
                        dpMessageBox.alert({
                            title: 'ยืนยันสถานะ',
                            message: 'การยืนยันเอกสารสำเร็จ !'
                        });
                        $vm.triggerSearch();

                    }, function error(res) { });
                });
            else
                dpMessageBox.alert({
                    title: 'ยืนยันสถานะ',
                    message: 'Status has been Confirmed !!!'
                })
        };

        function searchPage(data) {

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
                            $vm.filterModel.perPage = res.data.pagination.perPage;
                            $vm.filterModel.numPerPage = res.data.pagination.perPage;
                            $vm.searchResultModel = res.data.items;
                        }
                    }
                })
            }
        }

        $scope.complete = function (param) {
            param.update_By = $scope.userName;
            dpMessageBox.confirm({
                ok: 'ใช่',
                cancel: 'ไม่',
                title: 'แจ้งเตือน',
                message: 'คุณต้องการยืนยันเอกสารเสร็จสินใช่หรือไม่?'
            }).then(function success() {
                // param.operations = "DELETE";
                viewModel.confirm(param).then(function success(res) {
                    $vm.triggerSearch();
                    if (res.data == true) {
                        dpMessageBox.alert({
                            ok: 'OK',
                            title: 'แจ้งเตือน',
                            message: 'ยืนยันเอกสารเสร็จสินสำเร็จ',
                        })
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'OK',
                            title: 'แจ้งเตือน',
                            message: 'ไม่สามารถยืนยันเอกสารเสร็จสินได้',
                        })
                    }
                }, function error(res) {
                    dpMessageBox.alert({
                        ok: 'OK',
                        title: 'แจ้งเตือน',
                        message: 'ไม่สามารถยืนยันเอกสารเสร็จสินได้',
                    })
                });
            });
        };

        $scope.adjustStock = function (param) {
            if(!param.owner_Index){
                return dpMessageBox.alert({
                    ok: 'OK',
                    title: 'แจ้งเตือน',
                    message: 'ไม่สามารถปรับยอดได้ เนื่องจาก ไม่มี Vendor',
                })
            }
            param.create_By = $scope.userName;
            dpMessageBox.confirm({
                ok: 'ใช่',
                cancel: 'ไม่',
                title: 'แจ้งเตือน',
                message: 'คุณต้องการปรับสต๊อกใช่หรือไม่?'
            }).then(function success() {
                // param.operations = "DELETE";
                pageLoading.show();
                viewModel.adjustStock(param).then(function success(res) {
                    pageLoading.hide();
                    $vm.triggerSearch();
                    let message = res.data.split(",");
                    kMessageBox.alert({
                        ok: 'Close',
                        title: 'ตำแหน่งจัดเก็บ',
                        messageNewLine: message
                    });
                }, function error(res) {
                    pageLoading.hide();
                    dpMessageBox.alert({
                        ok: 'OK',
                        title: 'แจ้งเตือน',
                        message: res.Message.Message || "Error API",
                    })
                });
            });
        };

        var init = function () {
        };
        init();

    }
});