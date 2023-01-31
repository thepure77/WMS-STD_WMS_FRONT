(function () {
    'use strict';
    app.component('grFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GR/GR/component/grFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            filterSearch: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, localStorageService, dpMessageBox, commonService, goodsReceiveFactory, webServiceAPI) {
            var $vm = this;
            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = goodsReceiveFactory;
            var model = $scope.filterModel;
            $vm.triggerSearch = function () {
                $vm.filterModel = $vm.filterModel || {};
                $vm.filterModel.goodsReceive_Date = getToday();
                $vm.filterModel.goodsReceive_Date_To = getToday();
                $scope.convertDate();
                pageLoading.show();
                viewModel.grSearch($vm.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.filterModel.goodsReceiveDate = undefined;

                    if (res.data.length != 0) {

                        $scope.filterModel.perPage = $vm.filterModel.perPage;
                        $scope.filterModel.currentPage = $vm.filterModel.currentPage;

                        $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        $vm.filterModel.currentPage = res.data.pagination.currentPage;
                        $vm.filterModel.perPage = res.data.pagination.perPage;
                        $vm.filterModel.numPerPage = res.data.pagination.perPage;


                        $vm.searchResultModel = res.data.itemsGR;
                    } else {

                        $vm.searchResultModel = res.data.itemsGR;
                    }
                });
            };

            $scope.selectSort = [{
                value: "GoodsReceive_No",
                display: "GR_NO"
            },
            {
                value: "Ref_Plan_No",
                display: "PLAN_NO"
            },
            // {
            //     value: "DocumentType_Name",
            //     display: "ทะเบียนประกอบเอกสาร"
            // },
            {
                value: "Owner_Name",
                display: "OWNER_NAME"
            },
            // {
            //     value: "Vendor_Name",
            //     display: "ทะเบียนผู้ขาย"
            // },
            {
                value: "Product_Lot",
                display: "เลขที่ล็อต"
            },
                // {
                //     value: "WHOwner_Name",
                //     display: "คลังเจ้าของสินค้า"
                // },
            ];

            $scope.status = [{
                value: 1,
                display: "ยืนยัน"
            },
            {
                value: 0,
                display: "รอการยืนยัน"
            },
            {
                value: 3,
                display: "มอบหมายงาน"
            },
            {
                value: 2,
                display: "รอจัดเก็บ"
            },
            {
                value: 4,
                display: "จัดเก็บเสร็จสิ้น	"
            },
            {
                value: -1,
                display: "ยกเลิก"
            },
            ];

            $scope.header = {
                advanceSearch: false
            };

            $scope.hide = function () {
                $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
                $scope.filterModel.advanceSearch = $scope.header.advanceSearch;
            };
            $scope.toggleSearch = function () {
                $vm.filterModel.advanceSearch = !$vm.filterModel.advanceSearch;
            };

            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };

            $scope.searchFilter = function (param) {
                var deferred = $q.defer();
                if(!param.advanceSearch)
                {
                    if($('input[name="datefilter"]').val().length > 0)
                    {
                        $scope.filterModel.date = $('input[name="datefilter"]').val();
                    }
                } else {
                    if($('input[name="datefilterAdv"]').val().length > 0)
                    {
                        $scope.filterModel.date = $('input[name="datefilterAdv"]').val();
                    }
                }
                $scope.filterModel.ref_Document_No = $scope.filterModel.planGoodsReceive_No;
                $scope.filterModel.ref_Document_Index = $scope.filterModel.planGoodsReceive_Index;
                if ($scope.filterModel.date != null) {
                    $scope.convertDate();
                }
                pageLoading.show();
                viewModel.grSearch($scope.filterModel).then(
                    function success(res) {
                        deferred.resolve(res);
                    },
                    function error(response) {
                        deferred.reject(response);
                    });

                return deferred.promise;
            }
            $scope.filterSearch = function () {
                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                $scope.filterModel.perPage = $vm.filterModel.perPage;
                $scope.filterModel.columnName = $vm.filterModel.columnName;
                $scope.filterModel.orderby = $vm.filterModel.orderby;

                if ($scope.dropdownDocumentType.model != null) {
                    $scope.filterModel.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
                    $scope.filterModel.documentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
                    $scope.filterModel.documentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
                }
                else {
                    $scope.filterModel.documentType_Index = null;
                    $scope.filterModel.documentType_Id = null;
                    $scope.filterModel.documentType_Name = null;
                }
                if ($scope.dropdownProcessStatus.model != null) {
                    $scope.filterModel.processStatus_Index = $scope.dropdownProcessStatus.model.processStatus_Index;
                    $scope.filterModel.processStatus_Id = $scope.dropdownProcessStatus.model.processStatus_Id;
                    $scope.filterModel.processStatus_Name = $scope.dropdownProcessStatus.model.processStatus_Name;
                }
                else {
                    $scope.filterModel.processStatus_Index = null;
                    $scope.filterModel.processStatus_Id = null;
                    $scope.filterModel.processStatus_Name = null;
                }
                $scope.searchFilter($scope.filterModel).then(function success(res) {
                    $vm.searchResultModel = res.data.itemsGR;
                    $vm.filterModel = $scope.filterModel;
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    $vm.filterModel.currentPage = res.data.pagination.currentPage;
                    $vm.filterModel.perPage = res.data.pagination.perPage;
                    $vm.filterModel.numPerPage = res.data.pagination.perPage;


                }, function error(res) { });
            }

            $scope.clearSearch = function () {
                $scope.filterModel = {};
                $scope.filterModel.date = formatDate();
                $scope.dropdownDocumentType.model = {};
                $scope.dropdownProcessStatus.model = {};
                $window.scrollTo(0, 0);
            }

            $scope.popupOwner = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupOwner.onShow = !$scope.popupOwner.onShow;
                    $scope.popupOwner.delegates.ownerPopup(param, index);
                },
                config: {
                    title: "owner"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.ownerIndex = angular.copy(param.ownerIndex);
                        $scope.filterModel.ownerId = angular.copy(param.ownerId);
                        $scope.filterModel.ownerName = angular.copy(param.ownerName);
                        $scope.filterModel.ownerNameTemp = $scope.filterModel.ownerName;
                    }
                }
            };

            $scope.popupDocumentType = {
                onShow: false,
                delegates: {},
                onClick: function (param, index, chk) {
                    chk = "1";
                    $scope.popupDocumentType.onShow = !$scope.popupDocumentType.onShow;
                    $scope.popupDocumentType.delegates.documentTypePopup(param, index, chk);
                },
                config: {
                    title: "DocumentType"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.documentTypeIndex = angular.copy(param.documentTypeIndex);
                        $scope.filterModel.documentTypeId = angular.copy(param.documentTypeId);
                        $scope.filterModel.documentTypeName = angular.copy(param.documentTypeName);
                        $scope.filterModel.documentTypeNameTemp = $scope.filterModel.documentTypeName;
                    }
                }
            };
            $scope.popupWarehouse = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupWarehouse.onShow = !$scope.popupWarehouse.onShow;
                    $scope.popupWarehouse.delegates.warehousePopup(param, index);
                },
                config: {
                    title: "Warehouse"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.warehouseIndex = angular.copy(param.warehouseIndex);
                        $scope.filterModel.warehouseId = angular.copy(param.warehouseId);
                        $scope.filterModel.warehouseName = angular.copy(param.warehouseName);
                        $scope.filterModel.warehouseNameTemp = $scope.filterModel.warehouseName;
                    }
                }
            };
            $scope.popupPlanGr = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    index = "1"
                    $scope.popupPlanGr.onShow = !$scope.popupPlanGr.onShow;
                    $scope.popupPlanGr.delegates.planGrPopup(param, index);
                },
                config: {
                    title: "PlanGr"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.planGoodsReceiveIndex = angular.copy(param.planGoodsReceiveIndex);
                        $scope.filterModel.planGoodsReceiveNo = angular.copy(param.planGoodsReceiveNo);
                        $scope.filterModel.planGoodsReceiveNoTemp = $scope.filterModel.planGoodsReceiveNo;
                    }
                }
            };

            $scope.popupWarehouseTo = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupWarehouseTo.onShow = !$scope.popupWarehouseTo.onShow;
                    $scope.popupWarehouseTo.delegates.warehouseToPopup(param, index);
                },
                config: {
                    title: "WarehouseTo"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.warehouseIndexTo = angular.copy(param.warehouseIndex);
                        $scope.filterModel.warehouseIdTo = angular.copy(param.warehouseId);
                        $scope.filterModel.warehouseNameTo = angular.copy(param.warehouseName);
                        $scope.filterModel.warehouseNameToTemp = $scope.filterModel.warehouseNameTo;
                    }
                }
            };

            $scope.popupProduct = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupProduct.onShow = !$scope.popupProduct.onShow;
                    $scope.popupProduct.delegates.productPopup(param, index);
                },
                config: {
                    title: "product"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {

                        $scope.filterModel.productIndex = angular.copy(param.productIndex);
                        $scope.filterModel.productId = angular.copy(param.productId);
                        $scope.filterModel.productName = angular.copy(param.productName);
                        $scope.filterModel.productNameTemp = $scope.filterModel.productName;

                    }
                }
            };
            $scope.popupDockDoor = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupDockDoor.onShow = !$scope.popupDockDoor.onShow;
                    $scope.popupDockDoor.delegates.dockDoorPopup(param, index);
                },
                config: {
                    title: "DockDoor"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.dockDoorIndex = angular.copy(param.dockDoorIndex);
                        $scope.filterModel.dockDoorId = angular.copy(param.dockDoorName);
                        $scope.filterModel.dockDoorName = angular.copy(param.dockDoorName);
                        $scope.filterModel.dockDoorNameTemp = $scope.filterModel.dockDoorName;
                    }
                }
            };

            $scope.popupVehicleType = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupVehicleType.onShow = !$scope.popupVehicleType.onShow;
                    $scope.popupVehicleType.delegates.vehicleTypePopup(param, index);
                },
                config: {
                    title: "VehicleType"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.vehicleTypeIndex = angular.copy(param.vehicleTypeIndex);
                        $scope.filterModel.vehicleTypeId = angular.copy(param.vehicleTypeId);
                        $scope.filterModel.vehicleTypeName = angular.copy(param.vehicleTypeName);
                        $scope.filterModel.vehicleTypeNameTemp = $scope.vehicleTypeName;
                    }
                }
            };



            $scope.popupStatus = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    index = 2;
                    $scope.popupStatus.onShow = !$scope.popupStatus.onShow;
                    $scope.popupStatus.delegates.statusPopup(param, index);
                },
                config: {
                    title: "Status"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {

                        $scope.filterModel.processStatusIndex = angular.copy(param.processStatusIndex);
                        $scope.filterModel.documentStatus = angular.copy(param.processStatusId);
                        $scope.filterModel.processStatusName = angular.copy(param.processStatusName);
                        $scope.filterModel.processStatusNameTemp = $scope.filterModel.processStatusName;
                    }
                }
            };


            // ----------------------------------------------------
            // This local function
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

            $scope.convertDate = function () {

                if ($scope.filterModel.date != null) {
                    var str = $scope.filterModel.date;

                    var DStart = str.substring(0, 2);
                    var MStart = str.substring(5, 3);
                    var YStart = str.substring(10, 6);

                    $scope.filterModel.goodsReceive_Date = YStart.toString() + MStart.toString() + DStart.toString();

                    var DEnd = str.substring(15, 13);
                    var MEnd = str.substring(18, 16);
                    var YEnd = str.substring(25, 19);

                    $scope.filterModel.goodsReceive_Date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
                }
            };


            //-------------------------------------------------------------
            //DropDown
            $scope.dropdownDocumentType = function () {
                viewModel.dropdownDocumentType($scope.filterModel).then(function (res) {

                    $scope.dropdownDocumentType = res.data;
                });
            };

            $scope.dropdownProcessStatus = function () {
                viewModel.dropdownProcessStatus($scope.filterModel).then(function (res) {
                    $scope.dropdownProcessStatus = res.data;
                });
            };


            this.$onInit = function () {
                // $vm.triggerSearch();
                $scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel.perPage = $vm.filterModel.perPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                $scope.filterModel.goodsReceive_Date = getToday();
                $scope.filterModel.goodsReceive_Date_To = getToday();
                $scope.filterModel.date = formatDate();
                $scope.dropdownDocumentType();
                $scope.dropdownProcessStatus();
            };

            this.$onDestroy = function () { };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });

            $scope.autoComplete = {
                GoodsReceive: "GoodsReceive/AutoFilterGoodsReceive",
                owner: "GoodsReceive/Ownerfilter",
                warehouse: "GoodsReceive/Warehousefilter",
                status: "GoodsReceive/Statusfilter",
                documentType: "GoodsReceive/DocumentTypefilter",
                productName: "GoodsReceive/autoProduct",
                productId: "GoodsReceive/autoSKU",
                PO: "GoodsReceive/PlanGRfilter",
                dockdoor: "GoodsReceive/DockDoorfilter",
                vehicletype: "GoodsReceive/VahicleTypefilter",
                containerType: "GoodsReceive/ContainerTypefilter",
                basicSearch: "GoodsReceive/autobasicSuggestion",
                whOwner: "GoodsReceive/autoWHOwnerfilter",
                vendor: "GoodsReceive/autoVenderfilter",
                invoice: "GoodsReceive/autoInvoice",
                productlot: "GoodsReceive/autoProductLot",
                documentref: "GoodsReceive/autoDocumentRef",
                autoPoV2: "AutoPlanGoodsReceive/autobasicSuggestionPO",


            };

            $scope.url = {
                GR: webServiceAPI.GR,
                PlanGR: webServiceAPI.PlanGR,
            };
        }
    });

})();