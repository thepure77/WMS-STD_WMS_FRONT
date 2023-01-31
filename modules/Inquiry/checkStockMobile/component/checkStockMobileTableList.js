'use strict'
app.component('checkStockMobileTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/Inquiry/checkStockMobile/component/checkStockMobileTableList.html";
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
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, checkStockMobileFactory, planGoodsReceiveItemFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = $scope.items || [];
        var viewModel = checkStockMobileFactory;
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
        $vm.isShow = false,
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

        

        function serchPage(data) {
            if (data != null) {

                pageLoading.show();
                viewModel.mobileFilterByLocatuion(data).then(function (res) {
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
                    $vm.filterModelLo.currentPage = 5;
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