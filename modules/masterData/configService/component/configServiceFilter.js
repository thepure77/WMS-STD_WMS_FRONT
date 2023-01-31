(function () {
    'use strict';
    app.component('configServiceFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/configService/component/configServiceFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService, configServiceFactory, webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object

            var MessageBox = commonService.messageBox;
            var viewModel = configServiceFactory;
            $scope.filterModel = {};
            $vm.filterModel = {
                currentPage: 1,
                PerPage: 50,
                totalRow: 0,
            };
            $vm.searchResultModel = {};
            
            $scope.clearFilter = function () {
                $scope.filterModel = {};
                $scope.searchFilter();
            }
            $scope.hide = function () {
                $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
                $scope.header.advanceSearch = $scope.header.advanceSearch;
            };

            $vm.triggerSearch = function () {
                $scope.filterModel = $scope.filterModel || {};
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    if (res.data.items.length != 0) {
                        $vm.filterModel.perPage = $vm.filterModel.PerPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        $vm.filterModel.currentPage = res.data.pagination.currentPage;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }

                        $vm.searchResultModel = res.data.items;
                    }
                    else {
                        $vm.searchResultModel = res.data.items;
                    }
                });
            };

            $scope.searchFilter = function (param) {
                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel.PerPage = $vm.filterModel.PerPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();

                    if (res.data.items.length != 0) {
                        $scope.filterModel.perPage = $vm.filterModel.PerPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                            $vm.filterModel.key = res.data.pagination.key;
                        }
                        $vm.searchResultModel = res.data.items;
                    }
                    else {
                        $vm.searchResultModel = res.data.items;
                    }
                    $vm.searchResultModel.owner_Index = $scope.filterModel.owner_Index;
                    $vm.searchResultModel.owner_Id = $scope.filterModel.owner_Id;
                    $vm.searchResultModel.owner_Name = $scope.filterModel.owner_Name;

                });
            };


            $scope.$watch('filterModel.owner_Name', function () {
                if ($scope.filterModel.owner_Name != null && $scope.filterModel.owner_Name != "" && $scope.filterModel.owner_Name != undefined) {
                    $vm.searchResultModel.owner_Index = $scope.filterModel.owner_Index;
                    $vm.searchResultModel.owner_Id = $scope.filterModel.owner_Id;
                    $vm.searchResultModel.owner_Name = $scope.filterModel.owner_Name;
                }
                else {
                    $vm.searchResultModel.owner_Index = null;
                    $vm.searchResultModel.owner_Id = null;
                    $vm.searchResultModel.owner_Name = null;
                }
            });

            $scope.filter = function () {

                $vm.triggerSearch();
            };

            $scope.autoComplete = {
                owner: "Autocomplete/autoOwnerId",
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };

            $scope.$watch("filterModel.owner_Id", function () {
                if ($scope.filterModel.owner_Id == undefined
                    || $scope.filterModel.owner_Id == null
                    || $scope.filterModel.owner_Id == "") {
                    $scope.index = undefined;
                    $scope.filterModel.owner_Index = null;
                    $scope.filterModel.owner_Id = null;
                    $scope.filterModel.owner_Name = null;
                }
            });





            // ----------------------------------------------------
            // This local function
            function initialize() {
            };

            this.$onInit = function () {
                initialize();
            };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });
        }
    });

})();