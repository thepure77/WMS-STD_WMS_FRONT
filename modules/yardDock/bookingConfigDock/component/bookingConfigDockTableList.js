'use strict'
app.component('bookingConfigDockTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window) {
        return "modules/yardDock/bookingConfigDock/component/bookingConfigDockTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, localStorageService, dpMessageBox,bookingConfignDockFactory) {
        var $vm = this;        
        var Progressbar = pageLoading;
        $scope.items = [];
        $scope.items = $scope.items || [];
        var viewModel = bookingConfignDockFactory;
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
        function checkedlang() {
            $scope.switLang = {}
            if ($window.localStorage['LANGUAGE'] == "th") {
                $scope.switLang.name = 'TH'
            } else {
                $scope.switLang.name = 'EN'
            }
            return $scope.switLang;
        }
        $scope.delete = function (param) {
            param.isRemove = 1;
            var checkLanguage = checkedlang()
            var messagebox = {}

            if (checkLanguage.name == 'TH') {
                messagebox.text = 'คุณต้องการลบข้อมูลใช่หรือไม่'
                messagebox.success = 'ลบข้อมูลเสร็จสิ้น'
                 messagebox.alert = 'แจ้งเตือน'
                
            } 
            else {
                messagebox.text = 'Do you want to Delete ?'
                messagebox.success = 'Delete Success'
                messagebox.alert = 'Information'
                
            }
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: messagebox.alert,
                message: messagebox.text
            }).then(function success() {                
                viewModel.getDelete(param).then(function success(res) {
                    if (res.data != undefined) {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Success',
                                message: messagebox.success
                            }
                        )
                    }
                    $vm.triggerSearch();
                }, function error(res) { });
            });
        };
        var init = function () {
            $scope.filterModel = {};
        };
        init();

    }
});