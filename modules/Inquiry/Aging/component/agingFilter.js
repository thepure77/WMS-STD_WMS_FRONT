(function () {
    'use strict';
    app.component('agingFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, $window, commonService) {
            return "modules/Inquiry/Aging/component/agingFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            searchDataRow: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, pageLoading, dpMessageBox, localStorageService, commonService, agingFactory, webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var viewModel = agingFactory;
$scope.filterModel = {};
            $vm.filterModel = {
                currentPage: 1,
                perPage: 50,
                totalRow: 0,
                advanceSearch: false,
            };

            $vm.triggerSearch = function () {
                $vm.filterModel = $vm.filterModel || {};
                pageLoading.show();
                viewModel.filter($vm.filterModel).then(function (res) {
                    pageLoading.hide();
                    if (res.data.itemsAging.length != 0) {
                        $vm.filterModel.perPage = $vm.filterModel.perPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }
                        $vm.searchResultModel = res.data.itemsAging;
                    }
                    else {
                        $vm.searchResultModel = res.data.itemsAging;
                    }
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                });
            };

            $scope.searchFilter = function () {
                $scope.filterModel.PerPage = $vm.filterModel.perPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;

                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    if (res.data.itemsAging.length != 0) {
                        $vm.filterModel.perPage = $vm.filterModel.perPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;

                        $vm.filterModel.currentPage = res.data.pagination.currentPage;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }
                        $vm.searchResultModel = res.data.itemsAging;
                    }
                    else {
                        $vm.searchResultModel = res.data.itemsAging;
                    }

                    $vm.filterModel.totalRow = res.data.pagination.totalRow;

                });
            };

            $scope.$watch("filterModel.owner_Name", function () {
                if ($scope.filterModel.owner_Name == undefined 
                || $scope.filterModel.owner_Name == ""
                || $scope.filterModel.owner_Name == null) {
                    $scope.filterModel.owner_Index = "";
                    $scope.filterModel.owner_Id = "";
                    $scope.filterModel.owner_Name = "";
                }
            });

            $scope.$watch("filterModel.owner_Id", function () {
                if ($scope.filterModel.owner_Id == undefined 
                || $scope.filterModel.owner_Id == ""
                || $scope.filterModel.owner_Id == null) 
                {
                    $scope.filterModel.owner_Index = "";
                    $scope.filterModel.owner_Id = "";
                    $scope.filterModel.owner_Name = "";
                }
            });

            $scope.$watch("filterModel.product_Name", function () {
                if ($scope.filterModel.product_Name == undefined 
                || $scope.filterModel.product_Name == ""
                || $scope.filterModel.product_Name == null) {

                    $scope.filterModel.product_Index = "";
                    $scope.filterModel.product_Id = "";
                    $scope.filterModel.product_Name = "";
                }
            });


            $scope.$watch("filterModel.product_Id", function () {
                if ($scope.filterModel.product_Id == undefined 
                || $scope.filterModel.product_Id == ""
                || $scope.filterModel.product_Id == null) 
                {
                    $scope.filterModel.product_Index = "";
                    $scope.filterModel.product_Id = "";
                    $scope.filterModel.product_Name = "";
                }
            });


            $scope.autoComplete = {
                ownerId: "PickBinbalance/AutoCompleterOwnerId",
                ownerName: "PickBinbalance/AutoCompleterOwnerName",
                sku: "PickBinbalance/AutoCompleteProductId",
                product: "PickBinbalance/AutoCompleteProductName",
            };

            $scope.url = {
                BinBalance: webServiceAPI.BinBalance,
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


            this.$onInit = function () {
            };

        }
    });

})();