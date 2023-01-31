'use strict'
app.component('emerGencyTruckManifestTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, $window, commonService) {
        return "modules/EmergencyReport/emerGencyTruckManifest/component/emerGencyTruckManifestTableList.html";
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
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, emerGencyTruckManifestFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = $scope.items || [];
        var viewModel = emerGencyTruckManifestFactory;
        var item = $vm.searchResultModel;
        // setting column
        $scope.showColumnSetting = false;
        $scope.maxSize = 5;
        var MessageBox = dpMessageBox;

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

            viewModel.find(param.truckLoad_Index).then(function (res) {
                if (res.data.userAssign == "" || res.data.userAssign == undefined
                    || res.data.userAssign == null || res.data.userAssign == $scope.userName) {
                    param.UserAssign = $scope.userName;
                    //viewModel.updateUserAssign(param).then(function (res) {
                    if ($scope.onShow) {
                        $vm.isFilter = false;
                        $scope.onShow(param).then(function (result) {
                            $vm.isFilter = true;
                            $vm.triggerSearch();
                        }).catch(function (error) {
                            defer.reject({ 'Message': error });
                        });
                    }
                    //});
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
            if (param.document_Status == 1) {
                dpMessageBox.alert({
                    ok: 'OK',
                    title: 'ข้อมูล',
                    message: 'ไม่สามารถลบข้อมูลได้',
                })
            }
            else {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยัน',
                    message: 'ต้องการยกเลิกเอกสารใช่หรือไม่ ?'
                }).then(function success() {
                    param.cancel_By = localStorageService.get('userTokenStorage');
                    param.operations = "DELETE";
                    viewModel.delete(param).then(function success(res) {
                        $vm.triggerSearch();
                        if (res.data == false) {
                            dpMessageBox.alert({
                                ok: 'OK',
                                title: 'ข้อมูล',
                                message: 'ไม่สามารถลบข้อมูลได้',
                            })
                        }
                    }, function error(res) { });
                });
            }

        };

        $scope.comfirmStatus = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'ยืนยัน',
                message: 'คุณต้องการยืนยันเอกสารใช่หรือไม่?'
            }).then(function success() {
                param.approve_By = localStorageService.get('userTokenStorage');
                param.operations = "UPDATE";
                viewModel.comfirmStatus(param).then(function success(res) {
                    $vm.triggerSearch();
                    if (res.data == false) {
                        dpMessageBox.alert({
                            ok: 'OK',
                            title: 'ข้อมูล',
                            message: 'ไม่สามารถ comfirm เอกสารได้',
                        })
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'OK',
                            title: 'ข้อมูล',
                            message: 'ยืนยันเอกสารสำเร็จ',
                        })
                    }
                }, function error(res) { });
            });
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

        $scope.ConfirmList = function (param) {
            var validateChk = "";
            for (let index = 0; index < $vm.searchResultModel.length; index++) {
                if ($vm.searchResultModel[index].selected) {
                    // if ($vm.searchResultModel[index].documentStatus != "-1")
                    validateChk = validateChk + ' ' + $vm.searchResultModel[index].truckLoad_No;
                }

            }
            if (validateChk == "") {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Close Document',
                    message: 'กรุณาเลือกข้อมูล !!'
                });
                return;
            }
            else {
                MessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยัน',
                    message: 'คุณต้องการยืนยันเอกสารใช่หรือไม่?'
                }).then(function success() {
                    var item = angular.copy($vm.searchResultModel);
                    var models = [];
                    angular.forEach(item, function (v, k) {
                        if (v.selected) {
                            models.push(v);
                        }
                    });

                    let dataList = models;
                    for (var i = 0; i <= dataList.length - 1; i++) {
                        models[i].approve_By = $scope.userName;
                    }
                    $scope.filterModel = {};
                    $scope.filterModel.ListTruckload = models
                    $scope.filterModel.operations = "UPDATE";
                    viewModel.listcomfirmStatus($scope.filterModel).then(function success(res) {
                        $vm.triggerSearch();
                        if (res.data == false) {
                            dpMessageBox.alert({
                                ok: 'OK',
                                title: 'ข้อมูล',
                                message: 'ไม่สามารถ comfirm เอกสารได้',
                            })
                        }
                        else {
                            dpMessageBox.alert({
                                ok: 'OK',
                                title: 'ข้อมูล',
                                message: 'ยืนยันเอกสารสำเร็จ',
                            })
                        }
                    }, function error(res) { });


                });
            }
        }

        $scope.printOutShipment = function (param) {
            pageLoading.show();
            param.operations = "PRINT";
            viewModel.PrintReportPrintOutShipment(param).then(
                function success(results) {
                    pageLoading.hide();
                    $scope.popupReport.onClick(results);
                    deferred.resolve(results);
                },
                function error(response) {
                    pageLoading.hide();
                    dpMessageBox.alert({
                        title: 'Information.',
                        message: "กรุณารอ Wave สำเร็จ แล้วทำการปริ้นเอกสารอีกครั้ง"
                    })
                    deferred.reject(response);
                });
        }

        $scope.printOutTruckMenifest = function (param) {
            pageLoading.show();
            param.operations = "PRINT";
            viewModel.printOutTruckMenifest(param).then(
                function success(results) {
                    pageLoading.hide();
                    $scope.popupReport.onClick(results);
                    deferred.resolve(results);
                },
                function error(response) {
                    pageLoading.hide();
                    dpMessageBox.alert({
                        title: 'Information.',
                        message: "กรุณารอ การตอบกลับจาก SAP แล้วทำการปริ้นเอกสารอีกครั้ง"
                    })
                    deferred.reject(response);
                });
        }

        $scope.printOutDeliveryNote = function (param) {
            pageLoading.show();
            param.operations = "PRINT";
            viewModel.printOutDeliveryNote(param).then(
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

        $scope.ConfirmCutStock = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'แจ้งเตือน',
                message: 'คุณต้องการตัดสต๊อกใช่หรือไม่ ?'
            }).then(function () {
                pageLoading.show()
                viewModel.ConfirmCutStock(param).then(function (res) {
                    if (res.data == "success") {
                        $vm.triggerSearch();
                    } else {
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
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
                                title: 'แจ้งเตือน',
                                message: "พบปัญหาการติดต่อกับเซอร์วิซ"
                            }
                        )
                    });
            });
        }

        $scope.closeDocument = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'แจ้งเตือน',
                message: 'คุณต้องการปิดเอกสารใช่หรือไม่ ?'
            }).then(function () {
                pageLoading.show()
                viewModel.closeDocument(param).then(function (res) {
                    if (res.data == "success") {
                        $vm.triggerSearch();
                    } else {
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
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
                                title: 'แจ้งเตือน',
                                message: "พบปัญหาการติดต่อกับเซอร์วิซ"
                            }
                        )
                    });
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
            $scope.selected = 1;
            $scope.userName = localStorageService.get('userTokenStorage');
        };
        init();

    }
});