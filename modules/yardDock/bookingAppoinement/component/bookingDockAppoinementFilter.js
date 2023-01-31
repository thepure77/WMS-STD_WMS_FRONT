(function () {
    'use strict';
    app.component('bookingDockAppoinementFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/yardDock/bookingAppoinement/component/bookingDockAppoinementFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService,bookingDockAppoinementFactory,webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var viewModel = bookingDockAppoinementFactory;

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
                        }

                        $vm.searchResultModel = res.data;
                    }
                    else {

                        $vm.searchResultModel = {};
                    }
                });
            };
            $scope.filter = function () {
                $vm.triggerSearch();
            };

            $vm.triggerSearch = function () {
                $vm.filterModel =  $vm.filterModel || {};                
                pageLoading.show();
                
                viewModel.filter($vm.filterModel).then(function (res) {
                    pageLoading.hide();
                    if (res.data.length != 0) {
                        $scope.filterModel.perPage = $vm.filterModel.PerPage;
                        // $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        // $vm.filterModel.currentPage = res.data.pagination.currentPage;
                        // if (res.paginations != null || res.paginations != undefined) {
                        //     $vm.filterModel.totalRow = paginations.totalRow;
                        // }

                        $vm.searchResultModel = res.data;

                    }
                    else {
                        $vm.searchResultModel = {};
                    }
                });
            };
            
            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };
            // $scope.autoComplete = {
            //     WorkAreaName: "autoWorkArea/autoSearchWorkAreaFilter"
            // };
            
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
                    value: 0,
                    display: "รอยืนยัน"
                },
                {
                    value: 1,
                    display: "ยืนยัน"
                },
                {
                    value: 3,
                    display: "เสร็จสิ้น"
                },
                {
                    value: 4,
                    display: "ปิดเอกสาร"
                },
                {
                    value: -1,
                    display: "ยกเลิกเอกสาร"
                }
            ];
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