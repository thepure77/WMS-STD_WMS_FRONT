'use strict'
app.component('nonStandardizedTransactionsTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/Labor/nonStandardizedTransactions/component/nonStandardizedTransactionsTableList.html";
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
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, nonStandardizedTransactionsFactory) {
        var $vm = this;
        var Progressbar = pageLoading;
        $scope.items = $scope.items || [];
        var viewModel = nonStandardizedTransactionsFactory;
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
            // if (tab == 1) {
            //     $scope.colortab1 = "#97bee7";
            //     $scope.colortab2 = "#FFFFFF";

            //     $scope.fronttab1 = "#FFFFFF";
            //     $scope.fronttab2 = "#97bee7";

            // }
            // else if (tab == 2) {
            //     $scope.colortab1 = "#FFFFFF";
            //     $scope.colortab2 = "#97bee7";

            //     $scope.fronttab1 = "#97bee7";
            //     $scope.fronttab2 = "#FFFFFF";
            // }

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

        $scope.clickTab = function (tab) {
            $scope.checkAll = false;
            $scope.click = tab;
            $vm.filterModel.tab = tab;
            $vm.triggerSearch();
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


        function addZero(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
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
                            $vm.searchResultModel = res.data.itemsNonStandard;
                            $vm.filterModel.itemsNonStandard = $vm.searchResultModel;

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
            $scope.click = 1;
            // $scope.changeTableSize(50,1)

            $scope.userName = localStorageService.get('userTokenStorage');
        };
        init();

    }
});