'use strict'
app.component('masterCarrierTypeTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window) {
        return "modules/masterData/masterCarrierType/component/masterCarrierTypeTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, localStorageService, dpMessageBox,masterCarrierTypeFactory) {
        var $vm = this;        
        var Progressbar = pageLoading;
        $scope.items = [];
        $scope.items = $scope.items || [];
        var viewModel = masterCarrierTypeFactory;
        // setting column
        $scope.showColumnSetting = false;
        $scope.maxSize = 5;
        $vm.triggerCreate = function () {
            if($scope.onShow)
            {
                $vm.isFilter = false;
                $scope.onShow().then(function (result) {                   
                    $vm.isFilter = true;
                    $vm.triggerSearch();
                }).catch(function(error) {
                    defer.reject({ 'Message': error });
                });
            }
        };
        $scope.editItem = function (param) {
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
                $scope.colortab1 = "#ec7229";
                $scope.colortab2 = "#FFFFFF";

                $scope.fronttab1 = "#FFFFFF";
                $scope.fronttab2 = "#ec7229";

            }
            else if (tab == 2) {
                $scope.colortab1 = "#FFFFFF";
                $scope.colortab2 = "#ec7229";

                $scope.fronttab1 = "#ec7229";
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
                            $vm.filterModel.perPage = res.data.pagination.perPage;
                            $vm.filterModel.currentPage = res.data.pagination.currentPage;
                            $vm.searchResultModel = res.data.itemsItemStatus;

                        }
                    }
                })
            }
        }

        $scope.delete = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'แจ้งเตือน',
                message: 'คุณต้องการลบข้อมูลใช่หรือไม่'
            }).then(function success() {                
                viewModel.getDelete(param).then(function success(res) {
                    if (res.data == true) {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'ลบข้อมูลสำเร็จ'
                            }
                        )
                    }
                    $vm.triggerSearch();
                }, function error(res) { });
            });
        };
        var init = function () {
            // $vm.triggerSearch();
            $scope.filterModel = {};
        };
        init();

    }
});