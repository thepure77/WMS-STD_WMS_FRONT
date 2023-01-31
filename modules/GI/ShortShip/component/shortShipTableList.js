'use strict'
app.component('shortShipTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, $window, commonService) {
        return "modules/GI/ShortShip/component/shortShipTableList.html";
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
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, ShortShipFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = $scope.items || [];
        var viewModel = ShortShipFactory;
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
            //$scope.onShow = true;
            //pageLoading.show();
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow(param).then(function (result) {
                    $vm.isFilter = true;
                    $vm.triggerSearch();
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
           
        }



        $scope.delete = function (param) {

            // if (param.document_Status == 4) {
            //     dpMessageBox.alert({
            //         ok: 'Close',
            //         title: 'ลบ',
            //         message: 'ไม่สามารถยกเลิกข้อมูลที่ยืนยันเอกสารแล้วได้'
            //     })
            // }

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

        // $scope.approve = function () {
        //     // $vm.searchResultModel.where
        //     var status = false;
        //     if ($vm.searchResultModel == undefined) {
        //         dpMessageBox.alert({
        //             title: 'Information.',
        //             message: "Please select documents pending confirmation."
        //         })
        //     }
        //     else {
        //         var filtered = $.grep($vm.searchResultModel, function (cl) {
        //             return cl.selected == true && cl.document_Status == 0;
        //         });
        //         if (filtered.length != 0) {
        //             dpMessageBox.confirm({
        //                 ok: 'Yes',
        //                 cancel: 'No',
        //                 title: 'ยืนยันเอกสาร',
        //                 message: 'คุณต้องการยืนยันเอกสารใช่หรือไม่ ?'
        //             }).then(function success() {
        //                 for (var c = 0; c <= filtered.length - 1; c++) {
        //                     filtered[c].update_By = localStorageService.get('userTokenStorage');
        //                     filtered[c].operations = "CONFIRM";
        //                     viewModel.confirmStatus(filtered[c]).then(function success(res) {
        //                         if (res.data == true) {
        //                             // dpMessageBox.alert({
        //                             //     ok: 'OK',
        //                             //     title: 'ยืนยันเอกสาร',
        //                             //     message: 'ยืนยันเอกสารสำเร็จ',
        //                             // })
        //                             status = true;
        //                         }
        //                         // $vm.triggerSearch();
        //                     }, function error(res) {
        //                         // dpMessageBox.alert({
        //                         //     title: 'Information.',
        //                         //     message: "ERROR."
        //                         // })
        //                         status = false;
        //                     });
        //                 }
        //                 $vm.triggerSearch();
        //                 dpMessageBox.alert({
        //                     ok: 'OK',
        //                     title: 'ยืนยันเอกสาร',
        //                     message: 'ยืนยันเอกสารสำเร็จ',
        //                 })
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
        $scope.approve = function (param) {
            if (param.documentType_Id == 0)
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยันเอกสาร',
                    message: 'คุณต้องการยืนยันเอกสารใช่หรือไม่ ?'
                }).then(function success() {
                    param.update_By = localStorageService.get('userTokenStorage');
                    param.operations = "CONFIRM";
                    viewModel.approveStatus(param).then(function success(res) {
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

        $scope.printShortShip = function (param) {
            pageLoading.show();
            param.operations = "PRINT"
            viewModel.printShortShip(param).then(
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
                            $vm.searchResultModel = res.data.shortShipList;
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