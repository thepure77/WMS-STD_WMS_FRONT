(function () {
    'use strict';
    app.component('logFileFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, $window, commonService) {
            return "modules/logs/logFile/component/logFileFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            searchDataRow: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, pageLoading, dpMessageBox, localStorageService, commonService, logFileFactory, webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var viewModel = logFileFactory;
            $scope.filterModel = {};
            $vm.filterModel = {
                currentPage: 1,
                perPage: 50,
                totalRow: 0,
                advanceSearch: false,
            };

            $vm.triggerSearch = function () {
                $vm.filterModel = $vm.filterModel || {};
                $vm.filterModel.create_Date = getToday();
                $vm.filterModel.create_Date_To = getToday();
                pageLoading.show();
                viewModel.filter($vm.filterModel).then(function (res) {
                    pageLoading.hide();
                    if (res.data.listLogs.length != 0) {
                        $vm.filterModel.perPage = $vm.filterModel.perPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }
                        $vm.searchResultModel = res.data.listLogs;
                    }
                    else {
                        $vm.searchResultModel = res.data.listLogs;
                    }
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                });
            };

            $scope.filterSearch = function () {
                $scope.filterModel.PerPage = $vm.filterModel.perPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                if ($scope.filterModel.date != null || $scope.filterModel.dateDue != null) {
                    $scope.convertDate();
                }
                if ($scope.dropdownMenu.model != null) {
                    $scope.filterModel.menu_Index = $scope.dropdownMenu.model.menu_Index;
                    $scope.filterModel.menu_SecondName = $scope.dropdownMenu.model.menu_SecondName;
                    $vm.filterModel.menu_Index = $scope.dropdownMenu.model.menu_Index;

                } else {
                    $scope.filterModel.documentType_Index = "00000000-0000-0000-0000-000000000000";
                    $scope.filterModel.documentType_Name = "";
                    $vm.filterModel.documentType_Index = "00000000-0000-0000-0000-000000000000";
                    $vm.filterModel.documentType_Name = "";
                }
                $vm.filterModel.create_Date = $scope.filterModel.create_Date;
                $vm.filterModel.create_Date_To = $scope.filterModel.create_Date_To ;
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    if (res.data.listLogs.length != 0) {
                        $vm.filterModel.perPage = $vm.filterModel.perPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;

                        $vm.filterModel.currentPage = res.data.pagination.currentPage;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }
                        $vm.searchResultModel = res.data.listLogs;
                    }
                    else {
                        $vm.searchResultModel = res.data.listLogs;
                    }

                    $vm.filterModel.totalRow = res.data.pagination.totalRow;

                });
            };


            function getToday() {
                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();
                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;
                return yyyy.toString() + mm.toString() + dd.toString();
            }

            $scope.convertDate = function () {

                if ($scope.filterModel.date != null) {
                    var str = $scope.filterModel.date;

                    var DStart = str.substring(0, 2);
                    var MStart = str.substring(5, 3);
                    var YStart = str.substring(10, 6);

                    $scope.filterModel.create_Date = YStart.toString() + MStart.toString() + DStart.toString();

                    var DEnd = str.substring(15, 13);
                    var MEnd = str.substring(18, 16);
                    var YEnd = str.substring(25, 19);

                    $scope.filterModel.create_Date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
                }

            };

            function formatDate() {
                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();
                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return dd.toString() +"/"+ mm.toString() + "/"+ yyyy.toString() +  " - " + dd.toString() +"/"+ mm.toString() + "/"+ yyyy.toString();;
            }


            $scope.dropdownMenu = function () {
                viewModel.dropdownMenu($scope.filterModel).then(function (res) {
                    $scope.dropdownMenu = res.data;
                });
            };


            this.$onInit = function () {
                $scope.dropdownMenu();
            };

        }
    });

})();