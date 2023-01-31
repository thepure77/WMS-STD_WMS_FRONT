'use strict'
app.component('bookingAssignDockTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window) {
        return "modules/yardDock/bookingAssignDock/component/bookingAssignDockTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, localStorageService, dpMessageBox, bookingAssignDockFactory) {
        var $vm = this;
        var Progressbar = pageLoading;
        $scope.items = [];
        $scope.items = $scope.items || [];
        var viewModel = bookingAssignDockFactory;
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
            $scope.itemModels.onShow = !$scope.itemModels.onShow;
            if ($scope.itemModels.delegates.set) {
                param.status = "EDIT"
                $scope.itemModels.delegates.set(param);
            }
        }

        $scope.models = {}
        $scope.itemModels = {
            onShow: false,
            invokes: {
                set: function (param, indexHeader) {
                    // $scope.itemParcelpopup.onShow = !$scope.itemParcelpopup.onShow
                    // $scope.getMapRoute(param, indexHeader);
                },
                add: function (param) {
                    $scope.itemModels.onShow = !$scope.itemModels.onShow;
                    // $scope.itemsBarcode = param;
                    $scope.SaveData(param);
                },
            }
        }

        function checkedlang() {
            $scope.switLang = {}
            if ($window.localStorage['LANGUAGE'] == "th") {
                $scope.switLang.name = 'TH'
            } else {
                $scope.switLang.name = 'EN'
            }
            return $scope.switLang;
        }

        $scope.SaveData = function (param) {
            if (param.isActive) {
                param.isActive = 1;
            }
            else {
                param.isActive = 0;
            }
            $scope.dropdownDisplayDate = {}
            $scope.itemsWarehouse = {}
            var checkLanguage = checkedlang()
            var messagebox = {}

            if (checkLanguage.name == 'TH') {
                messagebox.text = 'บันทึกข้อมูลเสร็จสิ้น';
            }
            else {
                messagebox.text = 'Save Success';
            }
            param.Create_By = localStorageService.get('userTokenStorage');
            if(param.status == "EDIT"){
                param.Update_By = localStorageService.get('userTokenStorage');
            }
            viewModel.SaveChanges(param).then(function (res) {
                if (res.status == 200) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Success',
                            message: messagebox.text
                        }
                    )
                }
                $scope.triggerSearch();
                $scope.filterWarehouse();

            }, function error(res) {
                $scope.response = "M_ERROR";
                if (res.Message.data != null) {
                    $scope.message = res.Message.data.Message;
                }
                else {
                    $scope.message = "Data not found";
                }
            })
        }
        $scope.filterWarehouse = function () {
            $scope.criteria = {};
            viewModel.FilterWarehouse($scope.criteria).then(function (res) {
                $scope.itemsWarehouse = res.data;
                $scope.itemsWarehouse.forEach(c => {
                    c.warehouse_Name = c.wareHouse_Name
                });

            }, function error(res) {
                $scope.response = "M_ERROR";
                if (res.Message.data != null) {
                    $scope.message = res.Message.data.Message;
                }
                else {
                    $scope.message = "Data not found";
                }
            })
        }
        $scope.triggerSearch = function () {
            $vm.filterModel = $vm.filterModel || {};
            pageLoading.show();
            viewModel.filter($vm.filterModel).then(function (res) {
                pageLoading.hide();
                if (res.data.length != 0) {
                    $scope.filterModel.perPage = $vm.filterModel.PerPage;
                    // $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    // $vm.filterModel.currentPage = res.data.pagination.currentPage;
                    // if (res.paginations != null || res.paginations != undefined) {
                    //     $vm.filterModel.totalRow = paginations.totalRow;
                    // }

                    $vm.searchResultModel = res.data.wareHouseQoutaModels;

                }
                else {
                    $vm.searchResultModel = {};
                }

                $scope.filterWarehouse();

            });
        };

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
            var checkLanguage = checkedlang()
            var messagebox = {}

            if (checkLanguage.name == 'TH') {
                messagebox.text = 'ต้องการลบข้อมูลหรือไม่ ?';
                messagebox.error = 'ลบข้อมูลเสร็จสิ้น';
                messagebox.alert = 'แจ้งเตือน';
                messagebox.success = 'เสร็จสิ้น';
            }
            else {
                messagebox.text = 'Do you want to Delete ?';
                messagebox.error = 'Delete Success';
                messagebox.alert = 'Information';
                messagebox.success = 'Success';
            }
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: messagebox.alert,
                message: messagebox.text
            }).then(function success() {
                var critaria = {}
                critaria.wareHouseQouta_Index = param.wareHouseQouta_Index
                viewModel.getDelete(critaria).then(function success(res) {
                    if (res.status == 200) {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: messagebox.success,
                                message: messagebox.error
                            }
                        )
                    }
                    // $scope.filterWarehouse = {};
                    // $scope.filterWarehouse();
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