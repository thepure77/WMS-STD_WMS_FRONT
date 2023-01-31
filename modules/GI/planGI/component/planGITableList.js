'use strict'
app.component('planGiTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, $window, commonService) {
        return "modules/GI/planGI/component/planGITableList.html";
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
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, planGoodsIssueFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = $scope.items || [];
        var viewModel = planGoodsIssueFactory;
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

        $scope.editItem = function (param) {
            pageLoading.show();
            viewModel.find(param.planGoodsIssue_Index).then(function (res) {
                if (res.data.userAssign == "" || res.data.userAssign == undefined
                    || res.data.userAssign == null || res.data.userAssign == $scope.userName) {
                    param.UserAssign = $scope.userName;
                    viewModel.updateUserAssign(param).then(function (res) {
                        pageLoading.hide();
                        if ($scope.onShow) {
                            $vm.isFilter = false;
                            $scope.onShow(param).then(function (result) {
                                $vm.isFilter = true;
                                $vm.triggerSearch();
                            }).catch(function (error) {
                                defer.reject({ 'Message': error });
                            });
                        }
                    }).catch(function (error) { pageLoading.hide(); });
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

        $scope.Check_Budget = function (param) {
            pageLoading.show()
            viewModel.Check_budget(param).then(function (res) {

                if (res.data.planGoodsIssue_no == null) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'PlanGoodsIssue No is not in FOC'
                        }
                    )
                }
                if (res.data.checkAvaliable != 'FOC') {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Check Budget',
                            message: res.data.planGoodsIssue_no + ' is ' + res.data.checkAvaliable
                        }
                    )
                } else {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: res.data.planGoodsIssue_no + ' is not in FOC'
                        }
                    )
                }
                pageLoading.hide()
            },
                function error(response) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: "Error API"
                        }
                    )
                });

        };



        $scope.Cancel_AMZ_08 = function (param, mark) {

            pageLoading.show()
            $scope.filterModel = {};
            $scope.filterModel.Adjust = mark;
            if (mark == undefined) {
                $scope.filterModel.plangoodsIssue_No = param.planGoodsIssue_No;
                // $scope.filterModel.remark = param;
            } else {
                $scope.filterModel.plangoodsIssue_No = param.planGoodsIssue_No;
                $scope.filterModel.remark = mark;
            }
            
            $scope.filterModel.userName = $scope.userName;
            viewModel.Cancel_AMZ_08($scope.filterModel).then(function (res) {
                if (res.data) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Success',
                            message: 'Success'
                        }
                    )
                }
                pageLoading.hide()
            },
                function error(response) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: "ไม่สามารถทำการสร้างข้อมูลได้้"
                        }
                    )
                });

        };

        $scope.remarkPopup = {
            onShow: false,
            delegates: {},
            onClick: function (param) {

                $scope.remarkPopup.onShow = !$scope.remarkPopup.onShow;
                $scope.remarkPopup.delegates(param);
            },
            config: {
                title: ""
            },
            invokes: {
                add: function (param) { },
                edit: function (param) { },
                selected: function (param) {

                    $scope.Cancel_AMZ_08(param, 'X');
                }
            }
        };

        $scope.popupPostdate = {
            onShow: false,
            delegates: {},
            onClick: function (param) {

                $scope.popupPostdate.onShow = !$scope.popupPostdate.onShow;
                $scope.popupPostdate.delegates(param);
            },
            config: {
                title: ""
            },
            invokes: {
                add: function (param) { },
                edit: function (param) { },
                selected: function (param) {
                    $scope.comfirmPostDate(param);
                }
            }
        };


        $scope.AMZ_07 = function (param, mark) {

            pageLoading.show()
            $scope.filterModel = {};
            $scope.filterModel.Reject = mark;
            $scope.filterModel.plangoodsIssue_No = param;
            $scope.filterModel.userName = $scope.userName;
            viewModel.AMZ_07($scope.filterModel).then(function (res) {
                if (res.data) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Success',
                            message: 'Success'
                        }
                    )
                }
                pageLoading.hide()
            },
                function error(response) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: "ไม่สามารถทำการสร้างข้อมูลได้้"
                        }
                    )
                });

        };

        $scope.AMZ_07_02 = function (param, mark) {

            pageLoading.show()
            $scope.filterModel = {};
            $scope.filterModel.Reject = mark;
            $scope.filterModel.plangoodsIssue_No = param;
            $scope.filterModel.userName = $scope.userName;
            viewModel.AMZ_07_02($scope.filterModel).then(function (res) {
                if (res.data) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Success',
                            message: 'Success'
                        }
                    )
                }
                pageLoading.hide()
            },
                function error(response) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: "ไม่สามารถทำการสร้างข้อมูลได้้"
                        }
                    )
                });

        };

        $scope.Resend_WB = function (param) {

            pageLoading.show()
            viewModel.Resend_WB(param).then(function (res) {
                if (res.data) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Success',
                            message: res.data
                        }
                    )
                }
                pageLoading.hide()
            },
                function error(response) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: "ไม่สามารถทำการสร้างข้อมูลได้้"
                        }
                    )
                });

        };

        $scope.Resend_E = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'ยืนยัน',
                message: 'คุณต้องการจะส่งของใช่หรือไม่'
            }).then(function () {
                viewModel.Resend_E(param).then(function (res) {
                    if (res.data) {
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Success',
                                message: res.data
                            }
                        )
                    }
                    pageLoading.hide()
                },
                    function error(response) {
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'ALERT',
                                message: "ไม่สามารถทำการสร้างข้อมูลได้้"
                            }
                        )
                    });
            });


        };


        $scope.printOutGI = function (param) {
            pageLoading.show();
            param.operations = "PRINT";
            viewModel.PrintReportPrintOutGI(param).then(
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

        $scope.printReportBilling = function (param) {

            pageLoading.show();
            param.operations = "PRINT";
            viewModel.printReportBilling(param).then(
                function success(results) {
                    pageLoading.hide();
                    $scope.popupReport.onClick(results);
                    deferred.resolve(results);
                },
                function error(response) {
                    pageLoading.hide();
                    dpMessageBox.alert({
                        title: 'Information.',
                        message: "ไม่มีเอกสารนี้"
                    })
                    deferred.reject(response);
                });
        }

        $scope.printOutDeliveryNote = function (param) {
            pageLoading.show();
            let data = $vm.searchResultModel.filter(c => c.selected);
            $scope.filterModelprint = {};
            $scope.filterModelprint.model = data;
            viewModel.printOutDeliveryNote($scope.filterModelprint).then(
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

        $scope.printOutDeliveryNoteemergency = function (param) {
            pageLoading.show();
            // let data = $vm.searchResultModel.filter(c => c.selected);
            // $scope.filterModelprint = {};
            // $scope.filterModelprint.model = data;
            viewModel.printOutDeliveryNoteemergency(param).then(
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

        $scope.printProductReturn = function (param) {
            pageLoading.show();
            param.operations = "PRINT"
            viewModel.printProductReturn(param).then(
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
                }
            );
        }


        $scope.delete = function (param) {

            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'ยกเลิก',
                message: 'คุณต้องการยกเลิกใบรับสินค้าสินค้าใช่หรือไม่ ?'
            }).then(function success() {
                param.cancel_By = localStorageService.get('userTokenStorage');
                param.operations = "DELETE";
                pageLoading.show();
                viewModel.getDelete(param).then(function success(res) {
                    pageLoading.hide();
                    if (res.data == false) {
                        dpMessageBox.alert({
                            ok: 'OK',
                            title: 'แจ้งเตือน',
                            message: 'ไม่สามารถยกเลิกใบรับสินค้าสินค้าได้ เนื่องจากใบเบิกสินค้า : (' + param.planGoodsIssue_No + ') ถูกใช้งานอยู่',
                        })
                    } else if (res.data == true) {
                        dpMessageBox.alert({
                            ok: 'OK',
                            title: 'แจ้งเตือน',
                            message: 'ยกเลิกใบรับสินค้าสินค้าสำเร็จ',
                        })
                    }
                    $vm.triggerSearch();
                }, function error(res) { });
            });

        };

        $scope.comfirmStatus = function (param) {
            if (param.document_Status == 0)
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

        $scope.comfirmPostDate = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'ยืนยันเอกสาร',
                message: 'คุณต้องการยืนยันวันที่เอกสารใช่หรือไม่ ?'
            }).then(function success() {
                param.update_By = localStorageService.get('userTokenStorage');
                param.operations = "CONFIRM";
                viewModel.comfirmPostDate(param).then(function success(res) {
                    if (res.data != 'ไม่สามารถอัปเดตวันที่ยืนยันได้') {
                        dpMessageBox.alert({
                            ok: 'OK',
                            title: 'ยืนยันเอกสาร',
                            message: res.data,
                        })
                    } else {
                        dpMessageBox.alert({
                            ok: 'OK',
                            title: 'ยืนยันเอกสารไม่สำเร็จ',
                            message: 'ไม่สามารถอัปเดตวันที่ยืนยันได้',
                        })
                    }
                    $vm.triggerSearch();
                }, function error(res) { });
            });

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

        $scope.firstOrder = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'ยืนยันเอกสาร',
                message: 'คุณต้องการปิดเอกสารใช่หรือไม่ ?'
            }).then(function success() {
                param.update_By = localStorageService.get('userTokenStorage');
                param.operations = "CLOSE";
                viewModel.firstOrder(param).then(function success(res) {
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

        // coload toggle
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

        $scope.popupSignerPGI = {
            onShow: false,
            delegates: {},
            onClick: function (param) {
                $scope.popupSignerPGI.onShow = !$scope.popupSignerPGI.onShow;
                $scope.popupSignerPGI.delegates.set(param);
            },
            config: {
                title: "ReportView"
            },
            invokes: {
                add: function (param) { },
                edit: function (param) { },
                selected: function (param) {
                    pageLoading.show();
                    param.operations = "PRINT";
                    param.user = $scope.userName;
                    viewModel.PrintOutPGI(param).then(
                        function success(results) {
                            pageLoading.hide();
                            $scope.popupReport.onClick(results);
                            deferred.resolve(results);
                        },
                        function error(response) {
                            dpMessageBox.alert({
                                title: 'Information.',
                                message: "Connect Service Fail."
                            })
                            deferred.reject(response);
                        });
                }
            }
        };

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
            param.operations = "PRINT";
            viewModel.PrintPlanGoodsIssue(param).then(
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

        $scope.Cancel_GI = function (param) {
            
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'ยืนยันสถานนะ',
                message: 'คุณต้องการยืนยันการยกเลิกใช่หรือไม่'
            }).then(function () {
                pageLoading.show()
                viewModel.Cancel_GI(param).then(function (res) {
                    if (res.data) {
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Success',
                                message: "Success"
                            }
                        )
                    } else {
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'ALERT',
                                message: "ไม่สามารถทำการยกเลิกได้"
                            }
                        )
                    }
                    pageLoading.hide()
                },
                    function error(response) {
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'ALERT',
                                message: "Error API"
                            }
                        )
                    });
            });
        };

        $scope.confirmPlanGI = function () {
            var status = false;
            if ($vm.searchResultModel == undefined) {
                dpMessageBox.alert({
                    title: 'Information.',
                    message: "Please select documents pending confirmation."
                })
            }
            else {
                let data = $vm.searchResultModel.filter(c => c.selected && c.document_Status == 0);

                if (data.length != 0) {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'ยืนยันเอกสาร',
                        message: 'คุณต้องการยืนยันเอกสารใช่หรือไม่ ?'
                    }).then(function success() {
                        for (var c = 0; c <= data.length - 1; c++) {
                            filtered[c].update_By = localStorageService.get('userTokenStorage');
                            filtered[c].operations = "CONFIRM";
                            viewModel.confirmStatus(filtered[c]).then(function success(res) {
                                if (res.data == true) {
                                    status = true;
                                }
                            }, function error(res) {
                                status = false;
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
                else {
                    dpMessageBox.alert({
                        title: 'Information.',
                        message: "Please select documents pending confirmation."
                    })
                }
            }
        };

        // $scope.printall = function () {
        //     var status = false;
        //     if ($vm.searchResultModel == undefined) {
        //         dpMessageBox.alert({
        //             title: 'Information.',
        //             message: "Please select documents pending confirmation."
        //         })
        //     }
        //     else {
        //         
        //         let data = $vm.searchResultModel.filter(c => c.selected);
        //         if (data.length != 0) {
        //             viewModel.confirmStatus(data).then(function success(res) {
        //                 if (res.data == true) {
        //                     status = true;
        //                 }
        //             }, function error(res) {
        //                 status = false;
        //             });
        //         }
        //         else {
        //             dpMessageBox.alert({
        //                 title: 'Information.',
        //                 message: "Please select documents pending confirmation."
        //             })
        //         }
        //     }
        // };

        $scope.detectCheckAll = function () {
            
            if ($scope.checkAll === true) {
                for (var c = 0; c <= $vm.searchResultModel.length; c++) {
                    $vm.searchResultModel[c].selected = true;
                    $scope.hide(c);
                }
            } else {
                for (var c = 0; c <= $vm.searchResultModel.length - 1; c++) {
                    $vm.searchResultModel[c].selected = false;
                    $scope.hide(c);
                }
            }
        }
        $scope.hide = function (param) {
            var setHideButton = false;
            for (var c = 0; c <= $vm.searchResultModel.length - 1; c++) {
                if (!setHideButton) {
                    if ($vm.searchResultModel[c].document_Status == 0) {
                        if ($vm.searchResultModel[c].selected == true) {
                            setHideButton = true;
                        }
                    }
                }
            }
            $scope.checkbox.Show = (setHideButton == true) ? false : true;

        };

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
                            $vm.searchResultModel = res.data.itemsPlanGI;
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

            $scope.userName = localStorageService.get('userTokenStorage');
            // $vm.filterModel.planGoodsReceive_Date = getToday();
            // $vm.filterModel.planGoodsReceive_Date_To = getToday();
        };
        init();

    }
});