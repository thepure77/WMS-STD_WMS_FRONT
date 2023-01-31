
(function () {
    'use strict';
    app.component('configReplenishmentFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/configReplenishment/component/configReplenishmentFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService, replenishmentFactory, webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var viewModel = replenishmentFactory;
            $scope.filterModel = {};
            $vm.filterModel = {
                currentPage: 1,
                PerPage: 50,
                totalRow: 0,
            };

            $scope.header = {
                advanceSearch: false
            };
            $scope.hide = function () {
                $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
                $scope.header.advanceSearch = $scope.header.advanceSearch;
            };
            $scope.searchFilter = function (param) {

                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel.PerPage = $vm.filterModel.PerPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {

                    pageLoading.hide();

                    $vm.searchResultModel = res.data.itemsEquipment;
                });
            };
            // $scope.filter = function () {
            //     $vm.triggerSearch();
            // };

            $vm.triggerSearch = function () {

                $vm.filterModel = $vm.filterModel || {};
                pageLoading.show();
                viewModel.filter($vm.filterModel).then(function (res) {
                    pageLoading.hide();
                    if (res.data.replenishmentViewModels.length != 0) {
                        $scope.filterModel.perPage = $vm.filterModel.PerPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        $vm.filterModel.currentPage = res.data.pagination.currentPage;
                        if (res.paginations != null || res.paginations != undefined) {
                            $vm.filterModel.totalRow = paginations.totalRow;
                        }
                        $vm.searchResultModel = res.data.replenishmentViewModels;
                    }
                    else {
                        $vm.searchResultModel = res.data.replenishmentViewModels;
                    }

                    if ($vm.searchResultModel != undefined || $vm.searchResultModel != null) {
                        // convert Int to Text
                        angular.forEach($vm.searchResultModel, function (value, key) {
                            if (value.isActive == 0) {
                                value.isActive = "Yes";
                            }
                            else {
                                value.isActive = "No";
                            }
                            if (value.plan_By_Product == 0) {
                                value.plan_By_Product = "No"
                            }
                            else if (value.plan_By_Product == 1) {
                                value.plan_By_Product = "Yes"
                            }
                            else {
                                value.plan_By_Product = "All"
                            }
                            if (value.plan_By_Location == 0) {
                                value.plan_By_Location = "No"
                            }
                            else if (value.plan_By_Location == 1) {
                                value.plan_By_Location = "Yes"
                            }
                            else {
                                value.plan_By_Location = "All"
                            }
                        });
                    }
                });
            };

            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };
            $scope.autoComplete = {
                equipmentName: "autoEquipment/autoSearchEquipmentFilter"
            };

            $scope.clearFilter = function () {
                $scope.filterModel = {};
                $scope.searchFilter();
            }
            // $scope.autoComplete = {
            //     orderNo: "domesticLoadingItems/orderNo",
            //     SoNo: "domesticLoadingItems/SoNo",
            //     Plant: "domesticLoadingItems/Plant",
            //     OMSJobNo: "domesticLoadingItems/OMSJobNo",
            //     Material: "domesticLoadingItems/Material",
            //     Lot: "domesticLoadingItems/Lot",
            //     Customer: "domesticLoadingItems/Customer",
            //     DSNo: "domesticLoadingItems/DSNo",
            //     coloadNo: "domesticLoadingItems/coloadNo",
            //     basic: "DomesticPlantSelected/basicSuggestion",
            //     materialCode: "ExportPlantSelected/materialCode",
            // };


            // ----------------------------------------------------
            // This local function
            $vm.setDateFormate = function (v) {
                try {
                    return $filter("dateFormate")(v);
                } catch (e) {
                    return "-";
                }
            }

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