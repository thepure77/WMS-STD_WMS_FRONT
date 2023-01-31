(function () {
    'use strict';
    app.component('movementFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, $window, commonService) {
            return "modules/Inquiry/Movement/component/movementFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            searchDataRow: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, pageLoading, dpMessageBox, localStorageService, commonService, movementFactory, webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var viewModel = movementFactory;
            $scope.filterModel = {
                currentPage: 1,
                PerPage: 50,
                totalRow: 0,
                key: '',
                advanceSearch: false,
                showError: false,
                type: 1
            };

            $vm.triggerSearch = function (param) {
                if (param) {
                    $scope.filterModel.totalRow = param.totalRow;
                    $scope.filterModel.currentPage = param.currentPage;
                    $scope.filterModel.perPage = param.perPage;
                    $scope.filterModel.numPerPage = param.numPerPage;
                    $scope.filterSearch();
                }
            };

            $scope.filterSearch = function () {
                convertDate();
                $scope.filterModel.AdvanceSearch = $scope.header.advanceSearch;
                if ($scope.header.advanceSearch) {
                    advanceSearchconvertDate();

                    if ($scope.dropdownProductType.model != null) {
                        $scope.filterModel.productType_Index = $scope.dropdownProductType.model.productType_Index;
                        $scope.filterModel.productType_Id = $scope.dropdownProductType.model.productType_Id;
                        $scope.filterModel.productType_Name = $scope.dropdownProductType.model.productType_Name;
                    } else {
                        $scope.filterModel.productType_Index = "";
                        $scope.filterModel.productType_Id = "";
                        $scope.filterModel.productType_Name = "";
                    }

                    if ($scope.dropdownItemStatus.model != null) {
                        $scope.filterModel.itemStatus_Index = $scope.dropdownItemStatus.model.itemStatus_Index;
                        $scope.filterModel.itemStatus_Id = $scope.dropdownItemStatus.model.itemStatus_Id;
                        $scope.filterModel.itemStatus_Name = $scope.dropdownItemStatus.model.itemStatus_Name;
                    } else {
                        $scope.filterModel.itemStatus_Index = "";
                        $scope.filterModel.itemStatus_Id = "";
                        $scope.filterModel.itemStatus_Name = "";
                    }

                    if (!$scope.filterModel.owner_Index) {
                        $scope.filterModel.owner_Id = "";
                    }
                    if (!$scope.filterModel.product_Index) {
                        $scope.filterModel.product_Id = "";
                    }
                }

                pageLoading.show();
                viewModel.filter($scope.filterModel).then(
                    function success(res) {
                        if (res.data.length != 0) {

                            $scope.filterModel.perPage = $vm.filterModel.perPage;
                            $scope.filterModel.currentPage = $vm.filterModel.currentPage;

                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                            $vm.filterModel.currentPage = res.data.pagination.currentPage;
                            $vm.filterModel.perPage = res.data.pagination.perPage;
                            $vm.filterModel.numPerPage = res.data.pagination.perPage;

                            $vm.searchResultModel = res.data.items.filter(f => f.documentType_Name != "Begin");
                        } else {

                            $vm.searchResultModel = res.data.items;
                        }
                    },
                    function error(response) {
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

            function formatDate() {
                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();
                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return dd.toString() + "/" + mm.toString() + "/" + yyyy.toString() + " - " + dd.toString() + "/" + mm.toString() + "/" + yyyy.toString();;
            }

            function convertDate() {

                if ($scope.filterModel.date != null) {
                    var str = $scope.filterModel.date;

                    var DStart = str.substring(0, 2);
                    var MStart = str.substring(5, 3);
                    var YStart = str.substring(10, 6);

                    $scope.filterModel.date_From = YStart.toString() + MStart.toString() + DStart.toString();

                    var DEnd = str.substring(15, 13);
                    var MEnd = str.substring(18, 16);
                    var YEnd = str.substring(25, 19);

                    $scope.filterModel.date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
                }
            };

            function advanceSearchconvertDate() {

                if ($scope.filterModel.advanceSearch_Date != null) {
                    var str = $scope.filterModel.advanceSearch_Date;

                    var DStart = str.substring(0, 2);
                    var MStart = str.substring(5, 3);
                    var YStart = str.substring(10, 6);

                    $scope.filterModel.advanceSearch_Date_From = YStart.toString() + MStart.toString() + DStart.toString();

                    var DEnd = str.substring(15, 13);
                    var MEnd = str.substring(18, 16);
                    var YEnd = str.substring(25, 19);

                    $scope.filterModel.advanceSearch_Date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
                }
            };

            $scope.header = {
                advanceSearch: false
            };
            $scope.hide = function () {
                $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
                $scope.header.advanceSearch = $scope.header.advanceSearch;
            };

            $scope.dropdownProductType = function () {
                viewModel.dropdownProductType($scope.filterModel).then(function (res) {
                    $scope.dropdownProductType = res.data;
                });
            };
            $scope.dropdownItemStatus = function () {
                viewModel.dropdownItemStatus($scope.filterModel).then(function (res) {
                    $scope.dropdownItemStatus = res.data;
                });
            };

            $scope.autoComplete = {
                autoPo: "AutoPlanGoodsReceive/AutobasicSuggestion",
                owner: "AutoPlanGoodsReceive/AutoOwnerfilter",
                planGoodsReceive_No: "AutoPlanGoodsReceive/AutoPlanGoodsReceiveNo",
                product: "AutoPlanGoodsReceive/autoProductfilter",
                GRnadGI: "PickBinbalance/AutoCompleterGRandGI"
            };

            $scope.url = {
                PlanGR: webServiceAPI.PlanGR,
                binbalance: webServiceAPI.BinBalance,
            };

            this.$onInit = function () {
                $scope.filterModel.date = formatDate();
                $scope.dropdownItemStatus();
                $scope.dropdownProductType();
            };

        }
    });

})();