(function() {
    'use strict';
    app.component('warehouseOwnerFilter', {
        controllerAs: '$vm',
        templateUrl: function($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterWHOwner/component/whOwnerFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService, warehouseOwnerFactory, webServiceAPI) {
            var $vm = this;
            // ----------------------------------------------------
            // This default object

            var MessageBox = commonService.messageBox;
            var viewModel = warehouseOwnerFactory;
            $scope.filterModel = {};
            $vm.filterModel = {
                currentPage: 1,
                PerPage: 50,
                totalRow: 0,
            };


            $scope.header = {
                advanceSearch: false
            };
            $scope.clearFilter = function (){
                $scope.filterModel = {};
                $scope.searchFilter();
            }
            $scope.hide = function () {
                $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
                $scope.header.advanceSearch = $scope.header.advanceSearch;
            };
            
            $vm.triggerSearch = function() {
                $vm.filterModel = $vm.filterModel || {};
                pageLoading.show();
                viewModel.filter($vm.filterModel).then(function(res) {
                    pageLoading.hide();
                    if (res.data.length != 0) {
                        $vm.filterModel.perPage = res.data.pagination.perPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        $vm.filterModel.currentPage = res.data.pagination.currentPage;
                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }

                        $vm.searchResultModel = res.data.itemsWHOwner;
                    } else {
                        $vm.searchResultModel = res.data.itemsWHOwner;
                    }
                });
            };

            $scope.searchFilter = function(param) {
                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel.PerPage = $vm.filterModel.PerPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function(res) {
                    pageLoading.hide();

                    if (res.data.length != 0) {
                        $scope.filterModel.perPage = $vm.filterModel.PerPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                            $vm.filterModel.key = res.data.pagination.key;

                        }

                        $vm.searchResultModel = res.data.itemsWHOwner;
                    } else {

                        $vm.searchResultModel = res.data.itemsWHOwner;
                    }
                });
            };

            $scope.filter = function() {

                $vm.triggerSearch();
            };

            $scope.getSearchParams = function() {
                return angular.copy($vm.filterModel);
            };

            $scope.autoComplete = {
                whOwner: "Autocomplete/autoSearchWHOwner",
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };


            // ----------------------------------------------------
            // This local function
            $vm.setDateFormate = function(v) {
                try {
                    return $filter("dateFormate")(v);
                } catch (e) {
                    return "-";
                }
            }

            function initialize() {};

            this.$onInit = function() {
                initialize();
            };

            this.$onDestroy = function() {};

            $scope.$on('$destroy', function() {
                $vm.$onDestroy();
            });
        }
    });

})();