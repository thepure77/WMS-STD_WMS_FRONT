'use strict'
app.component('planTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/GR/planGR/component/planTableList.html";
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
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, planGoodsReceiveFactory, planGoodsReceiveItemFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = $scope.items || [];
        var viewModel = planGoodsReceiveFactory;
        var _viewModel = planGoodsReceiveItemFactory
        var item = $vm.searchResultModel;
        $scope.showColumnSetting = false;

        var validatestatus1 = "";
        var validatestatus3 = [];
        var validateChk = [];
        var validateDelete = [];
        var validateMsg = [];
        $scope.maxSize = 5;
        $scope.filterModel = {};

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

        $scope.editItem = function (param) {

            viewModel.getId(param.planGoodsReceive_Index).then(function (res) {
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


        $scope.printDN = function (param) {
            pageLoading.show();
            param.operations = "PRINT";
            viewModel.PrintReportDN(param).then(
                function success(results) {
                    pageLoading.hide();
                    $scope.popupReport.onClick(results);
                    deferred.resolve(results);
                },
                function error(response) {
                    pageLoading.hide();
                    dpMessageBox.alert({
                        title: 'Information.',
                        message: "Connect Service Fail."
                    })
                    deferred.reject(response);
                });
        }

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

        // $scope.cancelPlan = function (param) {
        //     dpMessageBox.confirm({
        //         ok: 'Yes',
        //         cancel: 'No',
        //         title: 'Confirm Status',
        //         message: 'Do you want to Cancel ?'
        //     }).then(function success() {
        //         param.cancel_By = localStorageService.get('userTokenStorage');
        //         viewModel.cancel(param).then(function success(res) {
        //             $vm.triggerSearch();
        //         }, function error(res) { });
        //     });
        // };

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
                            message: 'ไม่สามารถยกเลิกใบสั่งซื้อสินค้าได้ เนื่องจากใบสั่งซื้อสินค้า: (' + param.planGoodsReceive_No +  ')ถูกใช้งานอยู่'
                        })
                    }
                    $vm.triggerSearch();

                }, function error(res) { });
            });
            // if (param.document_Status == 4) {
            //     MessageBox.alert({
            //         ok: 'Close',
            //         title: 'แจ้งเตือน',
            //         message: 'มีการปิดเอกสารไปแล้ว ไม่สามารถยกเลิกได้ !!'
            //     })
            // }
            // else {
            //     dpMessageBox.confirm({
            //         ok: 'ใช่',
            //         cancel: 'ไม่',
            //         title: 'ยกเลิก',
            //         message: 'ต้องการยกเลิกเอกสารหรือไม่ ?'
            //     }).then(function success() {
            //         param.cancel_By = localStorageService.get('userTokenStorage');
            //         param.operations = "CANCEL";
            //         viewModel.cancel(param).then(function success(results) {
            //             if (results.data == true) {
            //                 MessageBox.alert({
            //                     ok: 'Close',
            //                     title: 'ยกเลิก',
            //                     message: 'ยกเลิกสำเร็จ !!'
            //                 })
            //                 // $vm.triggerSearch();
            //             }
            //             else {
            //                 MessageBox.alert({
            //                     ok: 'Close',
            //                     title: 'ยกเลิก',
            //                     message: 'ไม่สามารถยกเลิกใบสั่งซื้อสินค้าได้ เนื่องจากใบสั่งซื้อสินค้า: (' + param.planGoodsReceive_No +  ')ถูกใช้งานอยู่'
            //                 })
            //             }
            //             $vm.triggerSearch();

            //         }, function error(res) { });
            //     });
            // }
        };

        function validate(param) {
            var msg = "";
            return msg;
        }

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
        $scope.checkbox = {
            Show: true
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
                selected: function (param) {
                }
            }
        };


        $scope.print = function (param) {
            viewModel.PrintPlanGoodsReceive(param).then(
                function success(results) {
                    $scope.popupReport.onClick(results);
                },
                function error(response) {

                    dpMessageBox.alert({
                        title: 'Information.',
                        message: "Connect Service Fail."
                    })

                }
            );
        }

        $scope.confirmPlanGR = function () {
            // $vm.searchResultModel.where
            var status = false;
            if($vm.searchResultModel == undefined){
                dpMessageBox.alert({
                    title: 'Information.',
                    message: "Please select documents pending confirmation."
                })
            }
            else{
                var filtered = $.grep($vm.searchResultModel, function (cl) {
                    return cl.selected == true && cl.document_Status == 0;
                });
                if(filtered.length != 0)
                {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'ยืนยันเอกสาร',
                        message: 'คุณต้องการยืนยันเอกสารใช่หรือไม่ ?'
                    }).then(function success() {
                        for(var c = 0 ; c <= filtered.length -1 ; c++) {
                            filtered[c].update_By = localStorageService.get('userTokenStorage');
                            filtered[c].operations = "CONFIRM";
                            viewModel.confirmStatus(filtered[c]).then(function success(res) {
                            if (res.data == true) {
                                // dpMessageBox.alert({
                                //     ok: 'OK',
                                //     title: 'ยืนยันเอกสาร',
                                //     message: 'ยืนยันเอกสารสำเร็จ',
                                // })
                                status = true;
                            }
                            // $vm.triggerSearch();
                            }, function error(res) { 
                            });
                        }
                        $vm.triggerSearch();
                        dpMessageBox.alert({
                            ok: 'OK',
                            title: 'ยืนยันเอกสาร',
                            message: 'ยืนยันเอกสารสำเร็จ',
                        })
                    });
                }
                else{
                    dpMessageBox.alert({
                        title: 'Information.',
                        message: "Please select documents pending confirmation."
                    })
                }
            }
        };

        $scope.tranferGR = function () {
            viewModel.TransferGR().then(function (res) {
                dpMessageBox.alert(
                    {
                        ok: 'Close',
                        title: '',
                        message: res.data
                    }
                )
            });
        };

        $scope.detectCheckAll = function () {
            if ($scope.checkAll === true) {
                for(var c = 0 ; c <= $vm.searchResultModel.length -1 ; c++) 
                {
                    if($vm.searchResultModel[c].document_Status == 0)
                    {
                        $vm.searchResultModel[c].selected = true;
                        $scope.hide(c);
                    }
                    
                }
                // angular.forEach($vm.searchResultModel, function (v, k) {
                //     ;
                //     // if($vm.searchResultModel[k].document_Status == 3)
                //     // {
                //     $vm.searchResultModel[k].selected = true;
                //     $scope.hide(k);
                //     // }
                // });
            } else {
                for(var c = 0 ; c <= $vm.searchResultModel.length -1 ; c++) 
                {
                    $vm.searchResultModel[c].selected = false;
                    $scope.hide(c);
                }
                // angular.forEach($vm.searchResultModel, function (v, k) {
                //     $vm.searchResultModel[k].selected = false;
                //     $scope.hide(k);
                // });
            }
        }
        $scope.hide = function (param) {
            var setHideButton = false;
            for(var c = 0 ; c <= $vm.searchResultModel.length -1 ; c++) 
            {
                if (!setHideButton) {
                    if($vm.searchResultModel[c].document_Status == 0)
                    {
                        if ($vm.searchResultModel[c].selected == true) {
                            setHideButton = true;
                        }
                    }
                }
            }
            // angular.forEach($vm.searchResultModel, function (v, k) {
            //     if (!setHideButton) {
            //         if ($vm.searchResultModel[k].selected == true) {
            //             setHideButton = true;
            //         }
            //     }
            // });
            $scope.checkbox.Show = (setHideButton == true) ? false : true;

        };

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

        function validate(param) {
            var msg = "";
            return msg;
        }

        var init = function () {
            $scope.selected = 1;
            // $scope.changeTableSize(50,1)

            $scope.userName = localStorageService.get('userTokenStorage');
        };
        init();

    }
});