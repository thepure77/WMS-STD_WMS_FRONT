'use strict'
app.component('logTransfersTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window) {
        return "modules/logs/logTransfers/component/logTransfersTableList.html";
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
    controller: function ($scope, $filter, $q, $compile, $http,  $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, logTransfersFactory) {
        var $vm = this;
        var viewModel = logTransfersFactory;
        $scope.items = [];
        $scope.items = $scope.items || [];
        $scope.showColumnSetting = false;
        $scope.maxSize = 5;
        $scope.maxSize = 5;

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
        $vm.$onInit = function () {
            $scope.pagging = {
                totalRow: 0,
                currentPage: 1,
                numPerPage: $vm.filterModel.numPerPage,
                num: 1,
                maxSize: 2,
                perPage: 20,
                change: function () {
                    $vm.filterModel.currentPage = this.currentPage - 1;
                    if ($vm.triggerSearch) {
                        //$vm.triggerSearch();
                    }
                },
                changeSize: function () {
                    $vm.filterModel.numPerPage = $scope.pagging.perPage
                    //$vm.triggerSearch();
                }
            }
        }
        
        $scope.model = {
            currentPage: 1,
            numPerPage: 30,
            totalRow: 0,
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
        $scope.changeTableSize = function (perPage,tab) {

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
            debugger
            $scope.model = $vm.filterModel;
            if (perPage != null || perPage != undefined) {
                $scope.model.perPage = perPage;
            }

            var p = $scope.model;
            serchPage(p);
        }
        
        function serchPage(data) {
            debugger
            if (data != null) {

                pageLoading.show();
                viewModel.filter(data).then(function (res) {
                    pageLoading.hide();
                    if (res.data.length != 0 && res.data.length != undefined) {debugger
                        $vm.filterModel.totalRow = res.data[0].count;
                        $vm.searchResultModel = res.data;
                        
                    }
                    else {
                        if (res.data.pagination != null) {            
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                            $vm.filterModel.currentPage = res.data.pagination.currentPage;
                            $vm.searchResultModel = res.data.itemslogtransfers;
                            let dataList = $vm.searchResultModel;
                            for (var i = 0; i <= dataList.length - 1; i++) {
                                $vm.searchResultModel[i].row = i + 1;
                            }
                            $vm.searchDataRow = dataList.length;
                            debugger
                        }
                    }
                })
            }
        }


        var init = function () {
            $scope.colortab1 = "#990000";
            $scope.colortab2 = "#FFFFFF";
        };
        init();

    }
});