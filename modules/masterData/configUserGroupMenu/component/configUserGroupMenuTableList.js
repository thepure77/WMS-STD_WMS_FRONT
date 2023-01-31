'use strict'
app.component('configUserGroupMenuTableList', {
    controllerAs: '$vm',
    templateUrl: function($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/masterData/configUserGroupMenu/component/configUserGroupMenuTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, configUserGroupMenuFactory) {
        var $vm = this;
        //var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;

        var viewModel = configUserGroupMenuFactory;
        $scope.items = [];
        $scope.items = $scope.items || [];
        // setting column
        $scope.showColumnSetting = false;
        $scope.maxSize = 5;

        $vm.triggerCreate = function() {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow().then(function(result) {
                    $vm.isFilter = true;
                    $vm.triggerSearch();
                }).catch(function(error) {
                    defer.reject({ 'Message': error });
                });
            }
        };
        $scope.editItem = function(param) {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow(param).then(function(result) {
                    $vm.isFilter = true;
                    $vm.triggerSearch();
                }).catch(function(error) {
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
            debugger
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
                            $vm.searchResultModel = res.data.itemsWave;

                        }
                    }
                })
            }
        }

        $scope.delete = function(param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'InformaTion',
                message: 'Do you want to Delete ?'
            }).then(function success() {
                viewModel.getDelete(param).then(function success(res) {
                    if (res.data == true) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Success',
                            message: 'Delete Success'
                        })
                    }
                    $vm.triggerSearch();
                }, function error(res) {});
            });
        };

        $scope.detectCheckAll = function (c) {
            if (c === true) {
                angular.forEach($vm.searchResultModel, function (v, k) {
                    $vm.searchResultModel[k].isActive = true;
                });
            } else {
                angular.forEach($vm.searchResultModel, function (v, k) {
                    $vm.searchResultModel[k].isActive = false;
                });
            }
        }

        $scope.detectCheck = function (model,c) {
            if (c === true) {

                if(model.sub_Menu_Index == null && model.menuType_Index == 'af28c8e7-21d4-43a9-99e1-373b3242686d')
                {
                    angular.forEach($vm.searchResultModel, function (v, k) {

                        if(model.menu_Index == $vm.searchResultModel[k].sub_Menu_Index)
                        {
                            $vm.searchResultModel[k].isActive = true;
                        }
                    });
                } else {
                    angular.forEach($vm.searchResultModel, function (v, k) {

                        if(model.sub_Menu_Index == $vm.searchResultModel[k].menu_Index)
                        {
                            $vm.searchResultModel[k].isActive = true;
                        }
                    });
                }

            } else {
                if(model.sub_Menu_Index == null && model.menuType_Index == 'af28c8e7-21d4-43a9-99e1-373b3242686d')
                {
                    angular.forEach($vm.searchResultModel, function (v, k) {

                        if(model.menu_Index == $vm.searchResultModel[k].sub_Menu_Index)
                        {
                            $vm.searchResultModel[k].isActive = false;
                        }
                    });
                }

            }
        }

        $scope.getColor = function (menuType_Index) {
            if (menuType_Index == 'af28c8e7-21d4-43a9-99e1-373b3242686d') {
                // if (value > 10) return '#C1FDC2';
                // else if (value > 0) return '#FBFDC0';
                // else return '#FF7777';
                $scope.fontColor = "#FFFFFF";
                //$scope.bgColor = "#FF7777";
                return '#848484';
            } 

            if (menuType_Index == 'e9bdeb46-cf40-411f-a5cd-bf87e7963251') {
                $scope.fontColor = "#000000";
                //$scope.bgColor = "#FBFDC0";
                return '#FFFFFF';
            } 

            return '';
        }

        var init = function() {

        };
        init();

    }
});