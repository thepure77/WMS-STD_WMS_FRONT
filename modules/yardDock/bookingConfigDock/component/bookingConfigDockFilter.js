(function () {
    'use strict';
    app.component('bookingConfigDockFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/yardDock/bookingConfigDock/component/bookingConfigDockFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService, bookingConfignDockFactory, webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var viewModel = bookingConfignDockFactory;
            $scope.filterModel = {};
            $vm.filterModel = {
                currentPage: 1,
                PerPage: 50,
                totalRow: 0,
            };

            $scope.clearFilter = function () {
                $scope.filterModel = {};
                $scope.searchFilter();
            }

            $scope.hide = function () {
                $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
                $scope.header.advanceSearch = $scope.header.advanceSearch;
            };


            $scope.searchFilter = function (param) {
                dateformate($scope.filterModel.datePeriod);
                if ($scope.filterModel.wareHouse_Index == "" || $scope.filterModel.wareHouse_Index == undefined) {
                    $scope.filterModel.PerPage = $vm.filterModel.PerPage;
                    $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                    $scope.filterModel.wareHouse_Id = undefined;
                    $scope.filterModel.wareHouse_Index = undefined;
                    $scope.filterModel.wareHouse_Name = undefined;
                }
                if ($scope.filterModel.select_Warehouse != undefined) {
                    $scope.filterModel.DockQouta_Index = $scope.filterModel.select_Warehouse.dock_Index;
                    $scope.filterModel.DockQouta_Id = $scope.filterModel.select_Warehouse.dock_Id;
                } else {
                    $scope.filterModel.DockQouta_Index = undefined;
                    $scope.filterModel.DockQouta_Id = undefined;
                }
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();

                    if (res.data.dockQoutaModels.length != 0) {
                        $scope.filterModel.perPage = res.data.PerPage;
                        $vm.filterModel.totalRow = res.data.totalRow;
                        $vm.searchResultModel = res.data.dockQoutaModels;
                    }
                    else {
                        $vm.searchResultModel = {};
                    }
                });
            };

            function dateformate(param) {
                var date = param.split(' - ');
                var array1 = date[0].split('/');
                var ds = array1[2] + array1[1] + array1[0]
                $scope.filterModel.create_Date = convertDateFilter(ds);
                var array2 = date[1].split('/');
                var de = array2[2] + array2[1] + array2[0]
                $scope.filterModel.create_Date_To = convertDateFilterEnd(de);
            }
            $scope.selectWH = function () {
                if ($scope.filterModel.select_Warehouse != null || $scope.filterModel.select_Warehouse != undefined) {
                    $scope.filterModel.wareHouse_Id = $scope.filterModel.select_Warehouse.wareHouse_Id;
                    $scope.filterModel.wareHouse_Name = $scope.filterModel.select_Warehouse.wareHouse_Name;
                    $scope.filterModel.wareHouse_Index = $scope.filterModel.select_Warehouse.wareHouse_Index;
                } else {
                    $scope.filterModel.wareHouse_Id = ''
                    $scope.filterModel.wareHouse_Name = ''
                    $scope.filterModel.wareHouse_Index = ''
                }
            }

            function getToday() {
                var today = new Date();

                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();


                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }

            $scope.dropdownDock = function () {
                $scope.criteria = {};
                viewModel.FilterDock_search($scope.criteria).then(function (res) {
                    $scope.dock_Name = res.data;
                });

            }
            $vm.triggerSearch = function () {
                $vm.filterModel = $vm.filterModel || {};
                if ($scope.filterModel.datePeriod == undefined) {
                    var ds = getToday();
                    $vm.filterModel.appointment_Date = convertDateFilter(ds)
                    var de = getToday();
                    $vm.filterModel.appointment_Date_To = convertDateFilterEnd(de);
                }
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    $scope.dropdownDock();
                    if (res.data.dockQoutaModels.length != 0) {
                        $scope.filterModel.perPage = res.data.PerPage;
                        $vm.filterModel.totalRow = res.data.totalRow;
                        $vm.searchResultModel = res.data.dockQoutaModels;
                    }
                    else {
                        $vm.searchResultModel = {};
                    }
                });
            };

            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };


            $scope.selectSort = [
                {
                    value: "PlanGoodsReceive_No",
                    display: "เลขที่ใบสั่งซื้อสินค้า	"
                },
                {
                    value: "PlanGoodsReceive_Date",
                    display: "วันที่ใบสั่งซื้อสินค้า	"
                },
                {
                    value: "DocumentType_Name",
                    display: "ทะเบียนประเภทเอกสาร	"
                },
                {
                    value: "ProcessStatus_Name",
                    display: "สถานะ"
                },
                {
                    value: "Create_By",
                    display: "ผู้ใช้งาน"
                }
            ];
            function convertDateFilter(param) {
                var year = param.substring(0, 4);
                var month = param.substring(4, 6);
                var day = param.substring(6, 8);
                var a = year + '-' + month + '-' + day + 'T00:00:00Z'
                return a;
            }
            function convertDateFilterEnd(param) {
                var year = param.substring(0, 4);
                var month = param.substring(4, 6);
                var day = param.substring(6, 8);
                var a = year + '-' + month + '-' + day + 'T23:59:59Z'
                return a;
            }
            $scope.status = [
                {
                    value: "1",
                    display: "เปิดใช้งาน"
                },
                {
                    value: "0",
                    display: "ปิดใช้งาน"
                },
            ];
            // ----------------------------------------------------
            // This local function
            $vm.setDateFormate = function (v) {
                try {
                    return $filter("dateFormate")(v);
                } catch (e) {
                    return "-";
                }
            }
            function init() {
                $scope.dropdownDock();
            }

            init()

            this.$onInit = function () {
                // initialize();
            };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });
        }
    });

})();