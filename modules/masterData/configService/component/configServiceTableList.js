'use strict'
app.component('configServiceTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, $window) {
        return "modules/masterData/configService/component/configServiceTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, $state, pageLoading, $window, localStorageService, dpMessageBox, configServiceFactory) {
        var $vm = this;
        var Progressbar = pageLoading;
        $scope.items = [];
        $scope.items = $scope.items || [];
        var viewModel = configServiceFactory;
        $scope.showColumnSetting = false;


        $scope.editItem = function (param) {
            if (param.dEFAULT_Process_Index == "2aab40fe-454e-4b61-8a74-37c7430a1e44") {
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
            else if (param.dEFAULT_Process_Index == "6a877ea3-7fdd-43e8-a409-4b6bbe2bf199") {
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
            else if (param.dEFAULT_Process_Index == "fbedc6ef-3871-4cdf-84ee-fe3ff618113d") {
                if ($scope.onStorage) {
                    $vm.isFilter = false;
                    $scope.onStorage(param).then(function (result) {
                        $vm.isFilter = true;
                        $vm.triggerSearch();
                    }).catch(function (error) {
                        defer.reject({ 'Message': error });
                    });
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
        $scope.changeTableSize = function (perPage, tab) {

            if (tab == 1) {
                $scope.colortab1 = "#97bee7";
                $scope.colortab2 = "#FFFFFF";

                $scope.fronttab1 = "#FFFFFF";
                $scope.fronttab2 = "#97bee7";

            }
            else if (tab == 2) {
                $scope.colortab1 = "#FFFFFF";
                $scope.colortab2 = "#97bee7";

                $scope.fronttab1 = "#97bee7";
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
                            $vm.filterModel.currentPage = res.data.pagination.currentPage;
                            $vm.searchResultModel = res.data.items;

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

        $scope.addServiceChargeList = {
            onShow: false,
            delegates: {},
            onClick: function (param) {
                if(param.owner_Name == undefined || param.owner_Name == "" || param.owner_Name == null)
                {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'MSG_Alert_Owner'
                        }
                    )
                    return "";
                }
                $scope.index = {};
                if (param.length > 0) {
                    $scope.index.owner_Index = param[0].owner_Index;
                    $scope.index.owner_Id = param[0].owner_Id;
                    $scope.index.owner_Name = param[0].owner_Name;
                }
                else {
                    $scope.index.owner_Index = param.owner_Index;
                    $scope.index.owner_Id = param.owner_Id;
                    $scope.index.owner_Name = param.owner_Name;
                }
                $scope.addServiceChargeList.onShow = !$scope.addServiceChargeList.onShow;
                $scope.addServiceChargeList.delegates($scope.index);
            },
            invokes: {
                selected: function (param) {
                    $vm.triggerSearch();
                }
            }
        };

        var init = function () {
            // $vm.triggerSearch();
            $scope.filterModel = {};
        };
        init();

    }
});