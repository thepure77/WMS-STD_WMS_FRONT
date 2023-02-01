'use strict'
app.component('agingTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/Inquiry/Aging/component/agingTableList.html";
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
    controller: function ($scope, $filter, $q, $compile, $http,  $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, agingFactory) {
        var $vm = this;
        var viewModel = agingFactory;
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

        $scope.changeTableSize = function (perPage, tab) {
            if (tab == 1) {
                $scope.colortab1 = "#97bee7";
                $scope.colortab2 = "#FFFFFF";

                $scope.fronttab1 = "#FFFFFF";
                $scope.fronttab2 = "#97bee7";

            }
            else if (tab == 2) {
                debugger
                $scope.colortab1 = "#FFFFFF";
                $scope.colortab2 = "#97bee7";

                $scope.fronttab1 = "#97bee7";
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

                viewModel.filter(data).then(function (res) {
                    pageLoading.hide();
                    if (res.data.itemsAging.length != 0) {
                        $vm.filterModel.perPage = $vm.filterModel.perPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }
                        $vm.searchResultModel = res.data.itemsAging;
                    }
                    else {
                        $vm.searchResultModel = res.data.itemsAging;
                    }
                });

            }
        }


        var init = function () {
            $scope.colortab1 = "#97bee7";
            $scope.colortab2 = "#FFFFFF";
        };
        init();

    }

});