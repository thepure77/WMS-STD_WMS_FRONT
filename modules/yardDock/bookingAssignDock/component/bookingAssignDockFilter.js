(function () {
    'use strict';
    app.component('bookingAssignDockFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/yardDock/bookingAssignDock/component/bookingAssignDockFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, dpMessageBox, localStorageService, bookingAssignDockFactory, webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object

            var viewModel = bookingAssignDockFactory;
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

            $scope.selectWH = function () {
                if ($scope.filterModel.select_Warehouse != null || $scope.filterModel.select_Warehouse != undefined) {
                    $scope.filterModel.WareHouse_Id = $scope.filterModel.select_Warehouse.wareHouse_Id;
                    $scope.filterModel.WareHouse_Name = $scope.filterModel.select_Warehouse.warehouse_Name;
                    $scope.filterModel.WareHouse_Index = $scope.filterModel.select_Warehouse.wareHouse_Index;
                } else {
                    $scope.filterModel.WareHouse_Id = ''
                    $scope.filterModel.WareHouse_Name = ''
                    $scope.filterModel.WareHouse_Index = ''
                }
            }

            $scope.searchFilter = function (param) {

                $scope.filterModels = $scope.filterModel || {};
                if ($scope.filterWarehouse.model != null) {
                    $scope.filterModels = $scope.filterWarehouse.model;
                } else {
                    $scope.filterModels.wareHouseQouta_Id = undefined;
                    $scope.filterModels.wareHouseQouta_Index = undefined;
                    $scope.filterModels.wareHouse_Id = undefined;
                    $scope.filterModels.wareHouse_Name = undefined;
                }
                $scope.filterModels.PerPage = $vm.filterModel.PerPage;
                $scope.filterModels.currentPage = $vm.filterModel.currentPage;
                pageLoading.show();
                viewModel.filter($scope.filterModels).then(function (res) {
                    pageLoading.hide();

                    if (res.data.length != 0) {
                        $scope.filterModel.perPage = $vm.filterModel.PerPage;
                        if (res.paginations != null || res.paginations != undefined) {
                            $vm.filterModel.totalRow = paginations.totalRow;
                        }
                        $vm.searchResultModel = res.data.wareHouseQoutaModels;
                    }
                    else {
                        $vm.searchResultModel = {};
                    }

                    dropdownDisplayDate();
                });
            };

            $scope.createWH = function () {
                var sentItem = {};
                // $scope.dropdownWarehouse = {};
                $scope.dropdownDisplayDate = {};
                $scope.itemModels.onShow = !$scope.itemModels.onShow;
                if ($scope.itemModels.delegates.set) {
                    sentItem.status = "NEW"
                    $scope.itemModels.delegates.set(sentItem);
                }
            }

            $scope.models = {}
            $scope.itemModels = {
                onShow: false,
                config: {
                    title: "Route"
                },
                invokes: {
                    set: function (param, indexHeader) {
                    },
                    add: function (param) {
                        $scope.itemModels.onShow = !$scope.itemModels.onShow;
                        param.status = "NEW"
                        $scope.SaveData(param);
                    },
                }
            }

            $scope.dropdownWarehouse = function () {
                $scope.filterModels = {};
                viewModel.filter($scope.filterModels).then(function (res) {
                    $scope.filterWarehouse = res.data.wareHouseQoutaModels;
                    $scope.filterWarehouse.model = $scope.filterWarehouse[0];
                });
            }

            $scope.SaveData = function (param) {
                var sentData = param;
                if (param.isActive) {
                    param.isActive = 1;
                }
                else {
                    param.isActive = 0;
                }


                param.Create_By = localStorageService.get('userTokenStorage');
                viewModel.SaveChanges(param).then(function (res) {
                    if (res.status == 200) {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Success',
                                message: sentData.messagebox.text
                            }
                        )
                    }
                    
                    $vm.triggerSearch();

                }, function error(res) {
                    $scope.response = "M_ERROR";
                    if (res.Message.data != null) {
                        $scope.message = res.Message.data.Message;
                    }
                    else {
                        $scope.message = messagebox.error;
                    }
                })
            }
            $vm.triggerSearch = function () {
                
                $vm.filterModel = $vm.filterModel || {};
                pageLoading.show();
                viewModel.filter($vm.filterModel).then(function (res) {
                    
                    $scope.dropdownWarehouse();
                    pageLoading.hide();
                    if (res.data.length != 0) {
                        $scope.filterModel.perPage = $vm.filterModel.PerPage;
                        if (res.paginations != null || res.paginations != undefined) {
                            $vm.filterModel.totalRow = paginations.totalRow;
                        }

                        $vm.searchResultModel = res.data.wareHouseQoutaModels;

                    }
                    else {
                        $vm.searchResultModel = res.data.wareHouseQoutaModels;
                    }

                    dropdownDisplayDate();
                });
            };


            function dropdownDisplayDate() {
                let data = [
                    {
                        'displayDate': '1 วัน',
                        'value': 1
                    },
                    {
                        'displayDate': '2 วัน',
                        'value': 2
                    },
                    {
                        'displayDate': '3 วัน',
                        'value': 3
                    },
                    {
                        'displayDate': '7 วัน',
                        'value': 7
                    },
                    {
                        'displayDate': '15 วัน',
                        'value': 15
                    },
                    {
                        'displayDate': '30 วัน',
                        'value': 30
                    }
                ];

                $scope.dropdownDisplayDate = data;
            }

            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };

            $scope.url = {
                Master: webServiceAPI.Master,
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
                $scope.dropdownWarehouse();
            }

            init()

            this.$onInit = function () {
                // viewModelLocation.set()
            };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });
        }
    });

})();