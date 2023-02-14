'use strict'
app.component('bomTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/Tranfer/BOM/component/bomTableList.html"
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
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, bomFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = $scope.items || [];
        var viewModel =bomFactory;
        // var _viewModel = planGoodsReceiveItemFactory
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

            viewModel.getId(param.BOM_Index).then(function (res) {
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
            if (param.Document_Status != 0) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Cancel',
                    message: 'ไม่สามารถลบที่ใช้งานแล้วได้'
                })
            }
            else {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Cancel',
                    message: 'Do you want to Cancel ?'
                }).then(function success() {
                    param.cancel_By = localStorageService.get('userTokenStorage');
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
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'Confirm ?',
                message: 'Do you want to Confirm document !'
            }).then(function () {
                pageLoading.show()
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
            if (param.Document_Status != 3 && param.Document_Status != 1) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Cancel',
                    message: 'ไม่สามารถปิดเอกสารได้'
                })
            }
            else {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'Close ?',
                message: 'Do you want to Close document !'
            }).then(function () {
                pageLoading.show()
                viewModel.closeDocument(param).then(function (res) {
                    if (res.data) {
                        MessageBox.alert({
                                    ok: 'Close',
                                    title: 'Close Document',
                                    message: 'Close Document Success !!'
                                })
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
        }
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
            viewModel.PrintBOM(param).then(
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

        $scope.printOut = function (param) {
            pageLoading.show();
            viewModel.PrintOutBOM(param).then(
                function success(results) {
                    pageLoading.hide();
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
                            $vm.searchResultModel = res.data.itemsBOM;
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