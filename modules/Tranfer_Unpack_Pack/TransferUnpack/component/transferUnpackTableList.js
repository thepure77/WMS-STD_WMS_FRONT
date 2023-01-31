'use strict'
app.component('transferUnpackTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/Tranfer_Unpack_Pack/TransferUnpack/component/transferUnpackTableList.html";
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
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, transferUnpackFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = $scope.items || [];
        var viewModel = transferUnpackFactory;
        var item = $vm.searchResultModel;
        // setting column
        $scope.showColumnSetting = false;

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
                    $vm.isFilter = true;
                    $vm.triggerSearch();
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        };

        $scope.editItem = function (param) {

            viewModel.getId(param.goodsTransfer_Index).then(function (res) {
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



        $scope.delete = function (param) {
            if (param.document_Status == 1) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Cancel',
                    message: 'ไม่สามารถยกเลิกข้อมูลที่ Confirm แล้วได้'
                })
            }
            else {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Cancel',
                    message: 'คุณต้องการยกเลิกใช่หรือไม่'
                }).then(function success() {
                    param.cancel_By = localStorageService.get('userTokenStorage');
                    viewModel.getDelete(param).then(function success(res) {
                        $vm.triggerSearch();
                        if (res.data == false) {
                            dpMessageBox.alert({
                                ok: 'OK',
                                title: 'InformaTion',
                                message: 'ไม่สามารถยกเลิกข้อมูลได้ เนื่องจากมีการผูกเอกสารแล้ว ?',
                            })
                        }
                    }, function error(res) { });
                });
            }
        };

        $scope.confirmTransfer = function (param) {

            if (param.document_Status == 1)
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยัน',
                    message: 'คุณต้องการยืนยันเอกสารใช่หรือไม่ ?'
                }).then(function success() {
                    pageLoading.show();
                    param.update_By = localStorageService.get('userTokenStorage');
                    param.operations = "CONFIRM";
                    viewModel.confirmTransfer(param).then(function success(res) {
                        pageLoading.hide();
                        if (res.data == false) {
                            dpMessageBox.alert({
                                ok: 'Yes',
                                title: 'แจ้งเตือน',
                                message: 'ไม่สามารถ Confirm Transfer ได้!'
                            });
                            $vm.triggerSearch();
                        }
                        else {
                            dpMessageBox.alert({
                                ok: 'Yes',
                                title: 'แจ้งเตือน',
                                message: 'ยืนยันเอกสารสำเร็จ'
                            });
                            $vm.triggerSearch();
                        }
                        $vm.triggerSearch();
                    }, function error(res) { pageLoading.hide(); });
                });
            else
                dpMessageBox.alert({
                    ok: 'Yes',
                    title: 'Confirm Status',
                    message: 'Status has been Confirmed !!!'
                })
        }

        $scope.comfirmStatus = function (param) {
            if (param.document_Status == 0)
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm Status',
                    message: 'Do you want to Confirm ?'
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
            viewModel.CheckDocumentStatus(param).then(function success(results) {
                if (results.data.length > 0) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        messageNewLine: results.data
                    })
                }
                else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'Confirm Status',
                        message: 'ต้องการปิดเอกสารหรือไม่ ?'
                    }).then(function success() {
                        param.update_By = localStorageService.get('userTokenStorage');
                        param.operations = "CLOSE";
                        viewModel.closeDocument(param).then(function success(results) {
                            if (results.data == true) {
                                MessageBox.alert({
                                    ok: 'Close',
                                    title: 'Close Document',
                                    message: 'Close Document Success !!'
                                })
                                $vm.triggerSearch();
                            }
                            else {
                                MessageBox.alert({
                                    ok: 'Close',
                                    title: 'Close Document',
                                    message: 'มีการผูกเอกสารไปแล้ว และยังทำการรับสินค้าไม่เสร็จสิ้น'
                                })
                            }
                            $vm.triggerSearch();
                        }, function error(res) { });
                    });
                }
                $vm.triggerSearch();
            }, function error(res) { });
        };

        function validate(param) {
            var msg = "";
            return msg;
        }

        var MessageBox = dpMessageBox;



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

        $scope.comfirmDocument = function (param) {
            debugger
            if (param.document_Status == 0)
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยัน',
                    message: 'คุณต้องการยืนยันเอกสารใช่หรือไม่ ?'
                }).then(function success() {
                    param.update_By = localStorageService.get('userTokenStorage');
                    viewModel.confirmDocument(param).then(function success(res) {
                        debugger
                        if (res.data == false) {
                            dpMessageBox.alert({
                                ok: 'Yes',
                                title: 'แจ้งเตือน',
                                message: 'ไม่สามารถยืนยันเอกสารได้'
                            });
                            $vm.triggerSearch();
                        }
                        else {
                            dpMessageBox.alert({
                                ok: 'Yes',
                                title: 'แจ้งเตือน',
                                message: 'ยืนยันเอกสารสำเร็จ'
                            });
                            $vm.triggerSearch();
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

        $scope.AutoTranfer = function (param) {

            if (param.document_Status == 2)
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยัน',
                    message: 'คุณต้องการยืนยันเอกสารใช่หรือไม่ ?'
                }).then(function success() {
                    pageLoading.show();
                    param.update_By = localStorageService.get('userTokenStorage');
                    viewModel.AutoTranfer(param).then(function success(res) {
                        pageLoading.hide();
                        if (res.data == false) {
                            dpMessageBox.alert({
                                ok: 'Yes',
                                title: 'แจ้งเตือน',
                                message: 'ไม่สามารถยืนยันเอกสารได้'
                            });
                            $vm.triggerSearch();
                        }
                        else {
                            dpMessageBox.alert({
                                ok: 'Yes',
                                title: 'แจ้งเตือน',
                                message: 'ยืนยันเอกสารสำเร็จ'
                            });
                            $vm.triggerSearch();
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

        $scope.ConfirmDynamic = function (param) {

            if (param.document_Status == 2)
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยัน',
                    message: 'คุณต้องการยืนยันเอกสาร Dynamic Slotting ใช่หรือไม่ ?'
                }).then(function success() {
                    param.docNo = param.goodsTransfer_No;
                    param.update_By = localStorageService.get('userTokenStorage');

                    dpMessageBox.alert({
                        ok: 'Yes',
                        title: 'แจ้งเตือน',
                        message: 'ยืนยันคำสั่ง'
                    });

                    // viewModel.ConfirmDynamic(param).then(function success(res) {
                    //     if (res.data == "") {
                    //         dpMessageBox.alert({
                    //             ok: 'Yes',
                    //             title: 'แจ้งเตือน',
                    //             message: 'ไม่สามารถยืนยันเอกสารได้'
                    //         });
                    //         $vm.triggerSearch();
                    //     }
                    //     else {
                    //         dpMessageBox.alert({
                    //             ok: 'Yes',
                    //             title: 'แจ้งเตือน',
                    //             message: 'ยืนยันเอกสารสำเร็จ'
                    //         });
                    //         $vm.triggerSearch();
                    //     }
                    //     $vm.triggerSearch();
                    // }, function error(res) { });
                });
            else
                dpMessageBox.alert({
                    ok: 'Yes',
                    title: 'Confirm Status',
                    message: 'Status has been Confirmed !!!'
                })
        };
        
        $scope.SendWCSBypass = function (param) {

            if (param.document_Status == 2)
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยัน',
                    message: 'คุณต้องการส่งคำสั่งไปยัง Crane ใช่หรือไม่ ?'
                }).then(function success() {
                    var model = {};

                    model.docNo = param.goodsTransfer_No;
                    model.updateBy = $scope.userName;

                    pageLoading.show()
                    viewModel.WCSBypass(model).then(function (res) {
                        if (res.data) {
                            pageLoading.hide();
                            debugger
                            //$scope.resMsg = res.data.message.description;
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'Success',
                                    message: (res.data.status == '11' || res.data.status == '12') ? 'ส่งคำสั่งเข้า WCS สำเร็จ : ' + model.docNo : res.data.message.description
                                }
                            )  
                        } else {
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: res.data.message.description
                                }
                            )
                        }
                        
                    },
                    function error(response) {
                        pageLoading.hide();
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'ALERT',
                                message: "Error API"
                            }
                        )
                    });

                });
            else
                dpMessageBox.alert({
                    ok: 'Yes',
                    title: 'Confirm Status',
                    message: 'Status has been Confirmed !!!'
                })
        };

        $scope.SendWCSRelocation = function (param) {

            if (param.document_Status == 2)
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยัน',
                    message: 'คุณต้องการส่งคำสั่งไปยัง Crane ใช่หรือไม่ ?'
                }).then(function success() {
                    var model = {};

                    model.docNo = param.goodsTransfer_No;
                    model.updateBy = $scope.userName;

                    pageLoading.show()
                    viewModel.WCSRelocation(model).then(function (res) {
                        if (res.data) {
                            pageLoading.hide();
                            debugger
                            //$scope.resMsg = res.data.message.description;
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'Success',
                                    message: (res.data.status == '10') ? 'ส่งคำสั่งเข้า WCS สำเร็จ : ' + model.docNo : res.data.message.description
                                }
                            )  
                        } else {
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: res.data.message.description
                                }
                            )
                        }
                        
                    },
                    function error(response) {
                        pageLoading.hide();
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'ALERT',
                                message: "Error API"
                            }
                        )
                    });

                });
            else
                dpMessageBox.alert({
                    ok: 'Yes',
                    title: 'Confirm Status',
                    message: 'Status has been Confirmed !!!'
                })
        };

        $scope.Make_AMZ = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'ยืนยันสถานนะ',
                message: 'คุณต้องการสร้างข้อมูลใช่หรือไม่'
            }).then(function () {
                pageLoading.show()
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
                                message: "ไม่สามารถสร้างข้อมูลได้"
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

        $scope.deleteDocument = function (param) {
            if (param.document_Status != 3)
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยกเลิก',
                    message: 'คุณต้องการยกเลิกรายการใช่หรือไม่ ?'
                }).then(function success() {
                    param.cancel_By = localStorageService.get('userTokenStorage');
                    param.operations = "DELETE";
                    viewModel.deleteDocument(param).then(function success(res) {
                        if (res.data == false) {
                            dpMessageBox.alert({
                                ok: 'Yes',
                                title: 'แจ้งเตือน',
                                message: 'ไม่สามารถยกเลิกเอกสารได้'
                            });
                            $vm.triggerSearch();
                        }
                        else {
                            dpMessageBox.alert({
                                ok: 'Yes',
                                title: 'แจ้งเตือน',
                                message: 'ยกเลิกรายการสำเร็จ'
                            });
                            $vm.triggerSearch();
                        }
                        $vm.triggerSearch();
                    }, function error(res) { });
                });
            else
                dpMessageBox.alert({
                    ok: 'Yes',
                    title: 'แจ้งเตือน',
                    message: 'ไม่สามารถยกเลิกเอกสารที่มีสถานะเสร็จสิ้นได้'
                })
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
                            $vm.searchResultModel = res.data.lstGoodsTranfer;
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

        $scope.detectCheckAll = function () {
            if ($scope.checkAll === true) {
                angular.forEach($vm.searchResultModel, function (v, k) {
                    $vm.searchResultModel[k].selected = true;
                    $scope.hide(k);
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

            var isFalse = false;
            angular.forEach(items, function (v, k) {

                if (items[k].document_Status != 3) {
                    isFalse = true;
                }

            });

            if (isFalse == true) {

                let msg = "ส่ง SAP ไม่สำเร็จ !,ส่งได้เฉพาะสถานะ เสร็จสิ้น เท่านั้น".split(',');
                dpMessageBox.alert({
                    title: 'แจ้งเตือน',
                    messageNewLine: msg
                })
                return "";
            }

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

        $scope.GetReport = function (data) {
            pageLoading.show();
            data.operations = "PRINT";
            viewModel.GetReport(data).then(
                function success(results) {
                    $scope.popupReport.onClick(results);
                    pageLoading.hide();

                },
                function error(response) {

                    dpMessageBox.alert({
                        title: 'แจ้งเตือน',
                        message: "ไม่สามารถพิมพ์รายงานที่มีสถานะยกเลิกเอกสารได้"
                    })
                }
            );
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

        $scope.memo = function (param, data) {
            viewModel.getId(param).then(function (res) {
                viewModel.setParam(res.data.goodsTransfer_Index);
                viewModel.setData(res.data);
                $state.go('wms.gt_memo', {});
            });
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
            var formpage = transferUnpackFactory.getParam() || {};
            if (formpage.formPgae) {

                let param = viewModel.getParam()
                if (param.dataGT) {
                    $scope.editItem(param.dataGT);

                }
                // $vm.isFilter = false;
                // $scope.onShow = false;
            }

            $scope.selected = 1;

            $scope.userName = localStorageService.get('userTokenStorage');
            // $vm.filterModel.planGoodsReceive_Date = getToday();
            // $vm.filterModel.planGoodsReceive_Date_To = getToday();
        };
        init();

    }
});