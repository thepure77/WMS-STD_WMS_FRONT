'use strict'
app.component('bookingDockAppoinementTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window) {
        return "modules/yardDock/bookingAppoinement/component/bookingDockAppoinementTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, localStorageService, dpMessageBox, workAreaFactory) {
        var $vm = this;
        var Progressbar = pageLoading;
        $scope.items = [];
        $scope.items = $scope.items || [];
        var viewModel = workAreaFactory;
        // setting column
        $scope.showColumnSetting = false;
        $scope.maxSize = 5;
        $vm.triggerCreate = function () {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow().then(function (result) {
                    $vm.isFilter = true;
                    $vm.triggerSearch();
                }).catch(function (error) {
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
        $scope.userSelected = [];
        $scope.selectItem = function (id, index, checked, datarow, tab) {
            if (tab == 1) {
                
                $scope.userSelected[index] = {};
                $scope.userSelected[index].index = index;
                $scope.userSelected[index].checked = checked;
                $scope.userSelected[index].datarow = datarow;

                if (checked == "checking") {
                    $scope.userSelected[index].datarow.inserted = 1
                    $scope.openPopup(datarow);
                }
                else {
                    $scope.userSelected[index].datarow.inserted = 0
                }
            }
        }

        $scope.openPopup = function (param) {
            var sentItem = {};
            sentItem = param
            $scope.itemModels.onShow = !$scope.itemModels.onShow;
            if ($scope.itemModels.delegates.set)
                $scope.itemModels.delegates.set(sentItem);
        }

        $scope.itemModels = {
            onShow: false,
            config: {
                title: "Route"
            },
            invokes: {
                set: function (param, indexHeader) {
                    // $scope.itemParcelpopup.onShow = !$scope.itemParcelpopup.onShow
                    // $scope.getMapRoute(param, indexHeader);
                },
                add: function (param) {
                    $scope.itemModels.onShow = !$scope.itemModels.onShow;
                    // $scope.itemsBarcode = param;
                    $scope.editItem(param);
                },
            }
        }

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
                            $vm.filterModel.perPage = res.data.pagination.perPage;
                            $vm.filterModel.currentPage = res.data.pagination.currentPage;
                            $vm.searchResultModel = res.data.itemsWorkArea;

                        }
                    }
                })
            }
        }

        $scope.delete = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'InformaTion',
                message: 'Do you want to Delete ?'
            }).then(function success() {
                viewModel.getDelete(param).then(function success(res) {
                    if (res.data == true) {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Success',
                                message: 'Delete Success'
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