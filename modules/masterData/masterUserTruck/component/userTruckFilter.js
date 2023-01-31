(function () {
    'use strict';
    app.component('userTruckFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterUserTruck/component/userTruckFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService, userTruckFactory, webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            // var xString = commonService.string;
            // var xObject = commonService.objects;
            // var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = userTruckFactory;
            $scope.filterModel = {};
            $vm.filterModel = {
                currentPage: 1,
                PerPage: 50,
                totalRow: 0,
            };
            
            $scope.clearFilter = function (){
                $scope.filterModel = {};
                $scope.searchFilter();
            }
            $scope.hide = function () {
                $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
                $scope.header.advanceSearch = $scope.header.advanceSearch;
            };
            
            $vm.triggerSearch = function () {
                $vm.filterModel = $vm.filterModel || {};
                pageLoading.show();
                viewModel.filter($vm.filterModel).then(function (res) {
                    pageLoading.hide();
                    if (res.data.length != 0) {
                        $vm.filterModel.perPage = $vm.filterModel.PerPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        $vm.filterModel.currentPage = res.data.pagination.currentPage;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }

                        $vm.searchResultModel = res.data.itemsUser;
                    }
                    else {
                        $vm.searchResultModel = res.data.itemsUser;
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

                    if (res.data.length != 0) {
                        $scope.filterModel.perPage = $vm.filterModel.PerPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                            $vm.filterModel.key = res.data.pagination.key;

                        }

                        $vm.searchResultModel = res.data.itemsUser;
                    }
                    else {

                        $vm.searchResultModel = res.data.itemsUser;
                    }
                });
            };

            $scope.filter = function () {

                $vm.triggerSearch();
            };

            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };

            $scope.autoComplete = {
                //user: "Autocomplete/autoUser",
                user: "Autocomplete/autoSearchUser",
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };

            $scope.$watch("filterModel.user_Name", function () {
                if ($scope.filterModel.user_Name != undefined) {
                    $vm.filterModel.user_Name = $scope.filterModel.user_Name;
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