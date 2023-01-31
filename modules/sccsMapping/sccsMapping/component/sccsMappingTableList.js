'use strict'
app.component('sccsMappingTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window) {
        return "modules/SccsMapping/sccsMapping/component/sccsMappingTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, localStorageService, dpMessageBox,replenishmentFactory) {
        var $vm = this;        
        var Progressbar = pageLoading;
        $scope.items = [];
        $scope.items = $scope.items || [];
        var viewModel = replenishmentFactory;
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
                            $vm.searchResultModel = res.data.itemsEquipmentType;

                        }
                    }
                })
            }
        }

        function formatDate(date) {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return [year, month, day].join('');
        }
        function convertDate(param){
            var year = param.substring(0, 4);
            var month = param.substring(4, 6);
            var day = param.substring(6, 8);
            month = parseInt(month) - 1;
            var a = new Date(year, month, day);
            return a;
        }

        $scope.delete = function (param) {

            if (param.trigger_Date != null) {
                var ds = formatDate(param.trigger_Date);
                param.trigger_Date = ds;
            }
            if (param.trigger_Date_End != null) {
                var de = formatDate(param.trigger_Date_End);
                param.trigger_Date_End = de;
            }

            if (param.trigger_Date != null) {
                var ds = convertDate(param.trigger_Date);             
                param.trigger_Date = ds;
            }
            if (param.trigger_Date_End != null) {
                var de = convertDate(param.trigger_Date_End);     
                param.trigger_Date_End = de;
            }

            if (param.plan_By_Location == 'No') {
                param.plan_By_Location = 0;
                $scope.filterModel.chkallLocation = false;
            }
            else if (param.plan_By_Location == 'All') {
                param.plan_By_Location = 2;
                $scope.filterModel.chkallLocation = true;
            }
            else{
                param.plan_By_Location = 1;
            }

            if (param.plan_By_Product == 'No') {
                param.plan_By_Product = 0;
                $scope.filterModel.chkAllProduct = false;
            }
            else if (param.plan_By_Product == 'All') {
                param.plan_By_Product = 2;
                $scope.filterModel.chkAllProduct = true;
            }else{
                param.plan_By_Product = 1;
            }

            if (param.isActive == 'No') {
                param.isActive = 0;
                $scope.filterModel.isActive = false;
            }
            else {
                param.isActive = 1;
                $scope.filterModel.isActive = true;
            }
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