'use strict'
app.component('replenishOnDemandTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, $window, commonService) {
        return "modules/replenishOnDemand/component/replenishOnDemandTableList.html";
    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',
        isDisabledReplenish: '=?',
        checkAllItems:'=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, replenishOndemandFactory,kMessageBox) {
        var $vm = this;
        $scope.items = $scope.items || [];
        $scope.chkAll = {};
        var viewModel = replenishOndemandFactory;
        var item = $vm.searchResultModel;
        // setting column
        $scope.showColumnSetting = false;

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
                        $vm.triggerSearch();
                    }
                },
                changeSize: function () {
                    $vm.filterModel.numPerPage = $scope.pagging.perPage
                    $vm.triggerSearch();
                }
            }
            $scope.userName = localStorageService.get('userTokenStorage');

        }

        $scope.detectCheckAllItems = function () {
            if ($vm.checkAllItems === true) {
                angular.forEach($vm.searchResultModel, function (v, k) {
                    if($vm.searchResultModel[k].is_disable == true)
                    {
                        if($vm.searchResultModel[k].selected == false)
                           $vm.searchResultModel[k].selected = false;
                    }
                    else
                    {
                        $vm.searchResultModel[k].selected = true;
                    }
                    //$scope.checkItems(k);
                });
            } else {
                angular.forEach($vm.searchResultModel, function (v, k) {
                     if (!($vm.searchResultModel[k].selected == true && $vm.searchResultModel[k].is_disable == true))
                        $vm.searchResultModel[k].selected = false;
                    // $scope.checkItems(k);
                });
            }
        }

        $scope.checkItems = function (param) {
            if ($vm.checkAllItems == false) {
                $vm.searchResultModel[param].selected = false;
            } else {
                $vm.searchResultModel[param].selected = true;
                
            }
        }

       
        $scope.show = {
            action: true,
            pagination: true,
            checkBox: false
        }
        $scope.model = {
            currentPage: 1,
            numPerPage: 30,
            totalRow: 0,
            advanceSearch: false
        };
        // coload toggle
        $scope.showCoload = false;

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
            $scope.model = $vm.filterModel;
            if (perPage != null || perPage != undefined) {
                $scope.model.perPage = perPage;
            }

            var p = $scope.model;
            searchPage(p);
        };

        $scope.changePage = function () {
            var page = $vm.filterModel;

            var all = {
                currentPage: 0,
                perPage: 0
            };
            if ($vm.filterModel.currentPage != 0) {
                page.currentPage = page.currentPage;
            }

            $scope.searchPage(page);
        }

        // $scope.pageOption = [
        //     { value: 30 },
        //     { value: 50 },
        //     { value: 100 },
        //     { value: 500 }
        // ];

        $scope.sortBy = function (propertyName) {
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
        };

        function searchPage(data) {

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
                            $vm.filterModel.perPage = res.data.pagination.perPage;
                            $vm.filterModel.numPerPage = res.data.pagination.perPage;
                            $vm.searchResultModel = res.data.items;
                        }
                    }
                })
            }
        }

        var init = function () {
        };
        init();

    }
});