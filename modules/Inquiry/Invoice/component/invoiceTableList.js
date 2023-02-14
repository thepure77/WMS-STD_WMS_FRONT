'use strict'
app.component('invoiceTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/Inquiry/Invoice/component/invoiceTableList.html";
    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',
        searchDataLocation: '=?',
        filterModelLo: '=?',

    },
    controller: function ($scope, $filter, $q, $compile, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, stockFactory, invoiceFactory) {
        var $vm = this;
        $scope.items = $scope.items || [];
        var item = $vm.searchResultModel;
        $scope.showColumnSetting = false;
        $scope.maxSize = 5;
        $scope.filterModel = {};
        var viewModel = invoiceFactory;
        $scope.selectedTabTable = function (t) {
            if (t == 1) {
                $scope.colortable1 = "#ec7229";
                $scope.colortable2 = "#D3D3D3";
            }
            else if (t == 2) {
                $scope.colortable1 = "#D3D3D3";
                $scope.colortable2 = "#ec7229";
            }
            $scope.selectedTable = t;
        }

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

        $vm.triggerCreate = function () {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow().then(function (result) {
                    $vm.triggerSearch();
                    $vm.isFilter = true;
                }).catch(function (error) {
                    // $vm.triggerSearch();
                    // $vm.isFilter = true;
                });
            }
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
            if ($vm.filterModelLo.currentPage != 0) {
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
            }

            var p = $scope.model;
            serchPage(p);
        }

        $scope.changeTableSizeLo = function (perPage, tab) {
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
            }

            var p = $scope.model;
            serchPage(p);
        }

        function serchPage(data) {
            if (data != null) {

                pageLoading.show();

                viewModel.filterInvoice(data).then(function (res) {
                    pageLoading.hide();
                    if (res.data.itemsStock.length != 0) {
                        $vm.filterModel.perPage = res.data.pagination.perPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }
                        $vm.searchResultModel = res.data.itemsStock;
                    }
                    else {
                        $vm.searchResultModel = res.data.itemsStock;
                    }
                });

            }
        }

        $scope.editItem = function (param) {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow(param).then(function (result) {
                    $vm.isFilter = true;
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        }

        $scope.deleteItem = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'Confirm Status',
                message: 'Do you want to Delete ?'
            }).then(function success() {
                param.cancel_By = localStorageService.get('userTokenStorage');
                viewModel.deleteInvoice(param).then(function success(res) {
                    if (res.data == true) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'Delete Success !!'
                        })
                        $vm.triggerSearch();
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'Delete Error !!'
                        })
                    }
                }, function error(res) { });
            });
        };

        function getToday() {
            var today = new Date();

            var mm = today.getMonth() + 1;
            var yyyy = today.getUTCFullYear();
            var dd = today.getDate();


            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;

            return yyyy.toString() + mm.toString() + dd.toString();
        }


        var init = function () {
            $scope.userName = localStorageService.get('userTokenStorage');
        };
        init();

    }
});