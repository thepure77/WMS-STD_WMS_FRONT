'use strict'
app.component('giTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/GI/GI/component/giTableList.html";
    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate,kMessageBox, dpMessageBox, goodIssueFactory, goodsIssueItemFactory, transferFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        var MessageBox = dpMessageBox;
        $scope.items = [];
        $scope.items = $scope.items || [];
        var viewModel = goodIssueFactory;
        $scope.maxSize = 5;
        $scope.showColumnSetting = false;
        $vm.$onInit = function () {
        }

        $vm.triggerCreate = function () {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow().then(function (result) {
                    $vm.isFilter = true;
                    $vm.triggerSearch();
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        };

        $scope.editItem = function (param) {
            viewModel.find(param.goodsIssue_Index).then(function (res) {
                if ($scope.onShow) {
                    $vm.isFilter = false;
                    $scope.onShow(param).then(function (result) {
                        $vm.isFilter = true;
                        $vm.triggerSearch();
                    }).catch(function (error) {
                        defer.reject({ 'Message': error });
                    });
                }
            });
        }

        $scope.CutSlots = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'แจ้งเตือน',
                message: 'คุณต้องการตัดสต๊อกใช่หรือไม่ ?'
            }).then(function () {
                pageLoading.show()
                viewModel.CutSlots(param).then(function (res) {
                    if (res.data) {
                        $vm.triggerSearch();
                    } else {
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: "ไม่สามารถตัดสต๊อกได้"
                            }
                        )
                    }
                    pageLoading.hide()
                },
                    function error(response) {
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: "พบปัญหาการติดต่อกับเซอร์วิซ"
                            }
                        )
                    });
            });
        }


        $scope.delete = function (param) {
            if (param.document_Status == 2) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'ยกเลิก',
                    message: 'ไม่สามารถยกเลิกใบจ่ายสินค้าที่มีสถานนะมอบหมายงานแล้วได้'
                })
            }
            else if (param.document_Status == 3) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'ยกเลิก',
                    message: 'ไม่สามารถยกเลิกใบจ่ายสินค้าที่มีสถานนะเสร็จสินแล้วได้'
                })
            }

            else {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยกเลิก',
                    message: 'คุณต้องการยกเลิกรายการใช่หรือไม่'
                }).then(function success() {
                    param.cancel_By = localStorageService.get('userTokenStorage');
                    param.operations = "DELETE";
                    pageLoading.show();
                    viewModel.deleteDocument(param).then(function success(res) {
                        pageLoading.hide();
                        if (res.data != "SUCCESShavePGI") {
                            dpMessageBox.alert({
                                ok: 'OK',
                                title: 'แจ้งเตือน',
                                message: res.data,
                            })
                            $vm.triggerSearch();
                        }
                        else {
                            dpMessageBox.confirm({
                                ok: 'Yes',
                                cancel: 'No',
                                title: 'ยกเลิก',
                                message: 'คุณต้องการยกเลิกรายการ Plan GI ใช่หรือไม่'
                            }).then(function success() {
                                param.cancel_By = localStorageService.get('userTokenStorage');
                                pageLoading.show();
                                param.operations = "CANCEL";
                                viewModel.CancelPGI(param).then(function success(res) {
                                    pageLoading.hide();
                                    dpMessageBox.alert({
                                        ok: 'OK',
                                        title: 'แจ้งเตือน',
                                        message: 'ยกเลิกสำเร็จ',
                                    })
                                    $vm.triggerSearch();
                                }, function error(res) { });
                            }, function error(res) { $vm.triggerSearch(); });
                        }
                    }, function error(res) { });
                });
            }
        };

        $scope.exportFile = {
            ExportExcel: function (param) {
              dpMessageBox.confirm({
                title: 'Confirm.',
                message: 'Do you want to download?'
              }).then(function success() {
                ExportExcel(param);
              })
            },
          }
    
          function ExportExcel(param) {
            $scope.filterexport = {};
            $scope.filterexport = param;
            $scope.filterexport.excelName = 'Picking_Plan';
            var deferred = $q.defer();
            viewModel.ExportExcel($scope.filterexport).then(
              function success(results) {
                deferred.resolve(results);
              },
              function error(response) {
    
                dpMessageBox.alert({
                  title: 'Information.',
                  message: "Connect Service Fail."
                })
                deferred.reject(response);
              }
            );
            return deferred.promise;
          }


        
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

        $scope.comfirmStatus = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'ยืนยัน',
                message: 'คุณต้องการยืนยันเอกสารใช่หรือไม่'
            }).then(function () {
                pageLoading.show()
                param.operations = "CONFIRM";
                viewModel.confirmStatus(param).then(function (res) {
                    if (res.data) {
                        $vm.triggerSearch();
                    } else {
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Validate',
                                message: "Error"
                            }
                        )
                    }
                    pageLoading.hide()
                },
                    function error(response) {
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Validate',
                                message: "Error API"
                            }
                        )
                    });
            });
        };

        $scope.hide = function (param) {
            var setHideButton = false;
            angular.forEach($vm.searchResultModel, function (v, k) {
                if (!setHideButton) {
                    if ($vm.searchResultModel[k].selected == true) {
                        setHideButton = true;
                    }
                }
            });
            $scope.checkbox.Show = (setHideButton == true) ? false : true;

        };

        $scope.closeDocument = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'ยืนยันสถานนะ',
                message: 'คุณต้องการปิดเอกสารใช่หรือไม่'
            }).then(function () {
                pageLoading.show()
                param.operations = "CLOSE";
                viewModel.CloseDocument(param).then(function (res) {
                    if (res.data) {
                        $vm.triggerSearch();
                    } else {
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'ALERT',
                                message: "Error"
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

        $scope.Make_AMZ = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'ยืนยันสถานนะ',
                message: 'คุณต้องการสร้างข้อมูลใช่หรือไม่'
            }).then(function () {
                pageLoading.show()
                param.operations = "CLOSE";
                viewModel.makeAMZ(param).then(function (res) {
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
                                message: "ไม่สามารถทำการสร้างข้อมูลได้้"
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

        $scope.Make_tagout_V3 = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'ยืนยันสถานนะ',
                message: 'คุณต้องการสร้างข้อมูลใช่หรือไม่'
            }).then(function () {
                pageLoading.show()
                param.operations = "CLOSE";
                viewModel.Make_tagout_V3(param).then(function (res) {
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
                                message: "ไม่สามารถทำการสร้างข้อมูลได้้"
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

        $scope.StartWave = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'ยืนยันสถานนะ',
                message: 'คุณต้องการเริ่ม Wave ใช่หรือไม่'
            }).then(function () {
                pageLoading.show()
                param.operations = "CLOSE";
                viewModel.StartWave(param).then(function (res) {
                    if (res.data.resultIsUse) {
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
                                message: res.data.resultMsg
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

        $scope.CloseWave = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'ยืนยันสถานนะ',
                message: 'คุณต้องการปิด Wave ใช่หรือไม่'
            }).then(function () {
                pageLoading.show()
                param.operations = "CLOSE";
                viewModel.CloseWave(param).then(function (res) {
                    if (res.data.resultIsUse) {
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
                                message: res.data.resultMsg
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

        $scope.Send_Retail = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'ยืนยันสถานนะ',
                message: 'คุณต้องการสร้างข้อมูลใช่หรือไม่'
            }).then(function () {
                pageLoading.show()
                // param.operations = "CLOSE";
                viewModel.Send_Retail(param).then(function (res) {
                    debugger
                    if (res.data.status == "SUCCESS") {
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
                                message: "ไม่สามารถทำการสร้างข้อมูลได้้"
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

        // $scope.Cancel_GI = function (param) {
        //     debugger
        //     dpMessageBox.confirm({
        //         ok: 'Yes',
        //         cancel: 'No',
        //         title: 'ยืนยันสถานนะ',
        //         message: 'คุณต้องการสร้างข้อมูลใช่หรือไม่'
        //     }).then(function () {
        //         pageLoading.show()
        //         viewModel.Cancel_GI(param).then(function (res) {
        //             if (res.data) {
        //                 return dpMessageBox.alert(
        //                     {
        //                         ok: 'Close',
        //                         title: 'Success',
        //                         message: "Success"
        //                     }
        //                 )
        //             } else {
        //                 return dpMessageBox.alert(
        //                     {
        //                         ok: 'Close',
        //                         title: 'ALERT',
        //                         message: "ไม่สามารถทำการยกเลิกได้"
        //                     }
        //                 )
        //             }
        //             pageLoading.hide()
        //         },
        //             function error(response) {
        //                 return dpMessageBox.alert(
        //                     {
        //                         ok: 'Close',
        //                         title: 'ALERT',
        //                         message: "Error API"
        //                     }
        //                 )
        //             });
        //     });
        // };

        $scope.Cancel_GI_WB = function (param) {
            debugger
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'ยืนยันสถานนะ',
                message: 'คุณต้องการสร้างข้อมูลใช่หรือไม่'
            }).then(function () {
                pageLoading.show()
                viewModel.Cancel_GI_WB(param).then(function (res) {
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

        function validate(param) {
            var msg = "";
            return msg;
        }

        $scope.Check_Budget = function (param) {    
            pageLoading.show()
            viewModel.Check_budget(param).then(function (res) {
                {
                    let message = res.data.split(",");
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Check Budget',
                        messageNewLine: message
                    });
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


        $scope.pageMode = 'Master';

        $scope.$watch('tblHeader', function (n, o) {
            if (n) {
                localStorageService.set(_storageName, n);
            }
        }, true);

        function isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        $scope.calColor = function (value) {
            // if (isNumber(value)) {
            //     if (value > 10) return '#C1FDC2';
            //     else if (value > 0) return '#FBFDC0';
            //     else return '#FF7777';
            // }
            if (value) {
                if (value > 10) return '#C1FDC2';
                else if (value > 0) return '#FBFDC0';
                else return '#FF7777';
            }

            return '';
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

        // $vm.filterModel = {

        //     num: 1,
        //     maxSize: 5,
        //     perPage: $vm.filterModel.perPage,
        // };

        function serchPage(data) {

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

        $scope.detectCheckAll = function () {
            if ($scope.checkAll === true) {
                angular.forEach($vm.searchResultModel, function (v, k) {
                    // if($vm.searchResultModel[k].document_Status == 3)
                    // {
                    $vm.searchResultModel[k].selected = true;
                    $scope.hide(k);
                    // }
                });
            } else {
                angular.forEach($vm.searchResultModel, function (v, k) {
                    $vm.searchResultModel[k].selected = false;
                    $scope.hide(k);
                });
            }
        }

        $scope.SentToSap = function () {
            let items = $vm.searchResultModel.filter(f => f.selected);
            items.create_By = localStorageService.get('userTokenStorage');
            pageLoading.show();
            viewModel.SentToSap({ items: items }).then(function (res) {
                pageLoading.hide();
                let msg = res.data.split(',');
                dpMessageBox.alert({
                    title: 'แจ้งเตือน',
                    messageNewLine: msg
                })
                angular.forEach($vm.searchResultModel, function (v, k) {
                    $vm.searchResultModel[k].selected = false;
                    $scope.hide(k);
                });
            })
        };

        $scope.popupSignerGI = {
            onShow: false,
            delegates: {},
            onClick: function (param) {
                $scope.popupSignerGI.onShow = !$scope.popupSignerGI.onShow;
                $scope.popupSignerGI.delegates.set(param);
            },
            config: {
                title: "ReportView"
            },
            invokes: {
                add: function (param) { },
                edit: function (param) { },
                selected: function (param) {
                    pageLoading.show()
                    param.user = $scope.userName;
                    param.operations = "PRINT";
                    viewModel.PrintGI(param).then(
                        function success(results) {
                            pageLoading.hide()
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
                selected: function (param) { }
            }
        };

        $scope.memo = function (param,data) {
            debugger
            viewModel.setParam(param);
            viewModel.setParamitem(data);
            $state.go('wms.gi_memo', {});
        }

        $scope.popUpCheckWaveFilter = {
            onShow: false,
            delegates: {},
            onClick: function (param) {
                debugger
                $scope.popUpCheckWaveFilter.onShow = !$scope.popUpCheckWaveFilter.onShow;
                $scope.popUpCheckWaveFilter.delegates.popUpCheckWaveFilter(param);

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

        var init = function () {

            var formpage = transferFactory.getParam() || {};
            if (formpage.formPgae) {
                let param = viewModel.getParam()
                $scope.editItem(param);
                // $vm.isFilter = false;
                // $scope.onShow = false;
            }

            $scope.selected = 1;

            $scope.userName = localStorageService.get('userTokenStorage');
            // $vm.filterModel.GoodsIssue_Date = getToday();
            // $vm.filterModel.GoodsIssue_Date_To = getToday();
        };
        init();

    }
});