'use strict'
app.component('stockOnRollcageTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/Inquiry/StockOnRollcage/component/stockOnRollcageTableList.html";
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
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, stockOnRollcageFactory, planGoodsReceiveItemFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = $scope.items || [];
        var viewModel = stockOnRollcageFactory;
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
            if ($vm.filterModelLo.currentPage != 0) {
                page.currentPage = page.currentPage;
            }
            serchPage(page);
        }

        $scope.changePageLo = function () {
            var page = $vm.filterModelLo;
            var all = {
                currentPage: 0,
                numPerPage: 0
            };

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

        $scope.changeTableSizeLo= function (perPage, tab) {
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
                var dataFilter = viewModel.getParam() || {};
                if(dataFilter != null)
                {
                    data.product_Index = dataFilter.product_Index;
                }

                viewModel.filterByProduct(data).then(function (res) {
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

                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                });

                viewModel.filterByLocatuion(data).then(function (res) {
                    pageLoading.hide();
                    if (res.data.itemsStockLo.length != 0) {
                        $vm.filterModelLo.perPage = res.data.pagination.perPage;
                        $vm.filterModelLo.totalRow = res.data.pagination.totalRow;
                        // $vm.filterModelLo.currentPage = res.data.pagination.currentPage;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModelLo.totalRow = res.data.pagination.totalRow;
                        }
                        $vm.searchDataLocation = res.data.itemsStockLo;
                    }
                    else {
                        $vm.searchDataLocation = res.data.itemsStockLo;
                    }
                    //$vm.filterModelLo.currentPage = 5;

                    $vm.filterModel.totalRow = res.data.pagination.totalRow;

                });




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
            $scope.colortab1 = "#990000";
            $scope.colortab2 = "#FFFFFF";
            $scope.colortable1 = "#ec7229";
            $scope.colortable2 = "#D3D3D3";
            $scope.selectedTable = 1;
            $scope.userName = localStorageService.get('userTokenStorage');
        };
        init();

    }
});