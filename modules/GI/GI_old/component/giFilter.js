(function () {
    'use strict';
    app.component('giFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/GI/component/giFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            filterSearch: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading,dpMessageBox, commonService, goodIssueFactory) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = goodIssueFactory;
            var model = $scope.filterModel;
            $vm.triggerSearch = function () {                
                $vm.filterModel = $vm.filterModel || {};
                $vm.filterModel.goodsIssueDate =  getToday();
                
                pageLoading.show();                              
                viewModel.giSearch($vm.filterModel).then(function (res) {
                    pageLoading.hide();             
                    $vm.filterModel.goodsIssueDate =  getToday();
                    
                    if (res.data.length != 0) {                        
                        $scope.filterModel.perPage = $vm.filterModel.perPage;
                        $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                        
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        $vm.filterModel.currentPage = res.data.pagination.currentPage; 
                        $vm.filterModel.perPage = res.data.pagination.perPage;   
                        $vm.filterModel.numPerPage = res.data.pagination.perPage;   
                        
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


            $scope.header = {
                Search: true
            };

            $scope.hide = function () {
                $scope.header.Search = $scope.header.Search === false ? true : false;
            };


            $scope.toggleSearch = function () {
                $vm.filterModel.advanceSearch = !$vm.filterModel.advanceSearch;
            };


            $scope.filter = function () {
                $vm.triggerSearch();
            };

            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };          
            

            $scope.clearSearch = function (){ 
                $scope.filterModel = {};
                $scope.filterModel.goodsIssueDate = getToday();
                $scope.filterModel.goodsIssueDateTo = getToday();
                $scope.searchFilter();
                $window.scrollTo(0, 0);  
            }  

            $vm.setDateFormate = function (v) {
                try {
                    return $filter("dateFormate")(v);
                } catch (e) {
                    return "-";
                }
            }

            // -----------------SET DAY default-----------------//
            function getToday() {
                var today = new Date();

                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();


                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }


            $scope.searchFilter = function (param) {                
                var deferred = $q.defer();      
                          
                if ((param.goodsIssueNo == "" || param.goodsIssueNo === undefined) && (param.planGoodsIssueNo == "" || param.planGoodsIssueNo === undefined) && (param.ownerName == "" || param.ownerName === undefined) && (param.shipToName == "" || param.shipToName === undefined) && param.goodsIssueDate == "" && param.goodsIssueDateTo == ""
                && (param.pickTicketNo =="" || param.pickTicketNo === undefined) && (param.productName == "" || param.productName === undefined) && (param.documentTypeName == "" || param.documentTypeName === undefined) && (param.processStatusName == "" || param.processStatusName === undefined) && (param.routeName == "" || param.routeName === undefined)
                && (param.roundName == "" || param.roundName === undefined) && (param.warehouseName == "" || param.warehouseName === undefined) && (param.warehouseNameTo == "" || param.warehouseNameTo === undefined) && (param.zoneName == "" || param.zoneName === undefined) && (param.createBy == "" || param.createBy === undefined))
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'Confirm.',
                        message: 'Do you want to Search Data ?'
                    }).then(function success() {
                        
                        $vm.filterModel;
                        param = {currentPage:$vm.filterModel.currentPage,perPage:$vm.filterModel.perPage};
                        viewModel.giSearch(param).then(
                            function success(res) {
                                deferred.resolve(res);
                            },
                            function error(response) {
                                deferred.reject(response);
                            });
                    });
                else {                    
                    viewModel.giSearch(param).then(
                        function success(res) {
                            deferred.resolve(res);
                        },
                        function error(response) {
                            deferred.reject(response);
                        });
                }
                return deferred.promise;
            }
            $scope.filterSearch = function (){      
                          
                $scope.filterModel = $scope.filterModel || {};
                var item = $scope.filterModel;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                $scope.filterModel.perPage = $vm.filterModel.perPage;
                
                $scope.searchFilter($scope.filterModel).then(function success(res) { 
                    
                    $vm.searchResultModel = res.data.items;
                    $vm.filterModel = $scope.filterModel;
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    $vm.filterModel.currentPage = res.data.pagination.currentPage; 
                    $vm.filterModel.perPage = res.data.pagination.perPage;    
               
                }, function error(res) { });
            }  

            //Check GIDate----------------------------
            $scope.$watch('filterModel.goodsIssueDate', function () {
                var pattern = /(\d{4})(\d{2})(\d{2})/;
                if($scope.filterModel.goodsIssueDate != undefined && $scope.filterModel.goodsIssueDateTo != undefined){
                    var ds = Date.parse($scope.filterModel.goodsIssueDate.replace(pattern, '$1-$2-$3'));
                    var de = Date.parse($scope.filterModel.goodsIssueDateTo.replace(pattern, '$1-$2-$3'));                    
                }
           
                if(ds > de)
                {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'ระบุวันที่ไม่ถูกต้อง !'
                    })
                    $scope.filterModel.goodsIssueDate = $scope.filterModel.goodsIssueDateTo;
                }
                    
            })
            $scope.$watch('filterModel.goodsIssueDateTo', function () {
                var pattern = /(\d{4})(\d{2})(\d{2})/;
                if($scope.filterModel.goodsIssueDate != undefined && $scope.filterModel.goodsIssueDateTo != undefined){
                    var ds = Date.parse($scope.filterModel.goodsIssueDate.replace(pattern, '$1-$2-$3'));
                    var de = Date.parse($scope.filterModel.goodsIssueDateTo.replace(pattern, '$1-$2-$3'));                    
                }
              
                if(de < ds)
                {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'ระบุวันที่ไม่ถูกต้อง !'
                    })
                    $scope.filterModel.goodsIssueDateTo = $scope.filterModel.goodsIssueDate;
                }                    
            })

            //Clear Index
            $scope.$watch('filterModel.ownerName', function () {
                if($scope.filterModel.ownerName != $scope.filterModel.ownerNameTemp)
                {
                    $scope.filterModel.ownerIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
            $scope.$watch('filterModel.planGoodsIssueNo', function () {
                if($scope.filterModel.planGoodsIssueNo != $scope.filterModel.planGoodsIssueNoTemp)
                {
                    $scope.filterModel.planGoodsIssueIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
            $scope.$watch('filterModel.shipToName', function () {
                if($scope.filterModel.shipToName != $scope.filterModel.shipToNameTemp)
                {
                    $scope.filterModel.shipToIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
            $scope.$watch('filterModel.pickTicketNo', function () {
                if($scope.filterModel.pickTicketNo != $scope.filterModel.pickTicketNoTemp)
                {
                    $scope.filterModel.pickTicketNo = "";
                }
            })
            $scope.$watch('filterModel.productName', function () {
                if($scope.filterModel.productName != $scope.filterModel.productNameTemp)
                {
                    $scope.filterModel.productIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
            $scope.$watch('filterModel.documentTypeName', function () {
                if($scope.filterModel.documentTypeName != $scope.filterModel.documentTypeNameTemp)
                {
                    $scope.filterModel.documentTypeIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
            $scope.$watch('filterModel.processStatusName', function () {
                if($scope.filterModel.processStatusName != $scope.filterModel.processStatusNameTemp)
                {
                    $scope.filterModel.processStatusIndex = "00000000-0000-0000-0000-000000000000";
                    $scope.filterModel.documentStatus = "";
                    
                }
            })
            $scope.$watch('filterModel.routeName', function () {
                if($scope.filterModel.routeName != $scope.filterModel.routeNameTemp)
                {
                    $scope.filterModel.routeIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
            $scope.$watch('filterModel.roundName', function () {
                if($scope.filterModel.roundName != $scope.filterModel.roundNameTemp)
                {
                    $scope.filterModel.roundIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
            $scope.$watch('filterModel.warehouseName', function () {
                if($scope.filterModel.warehouseName != $scope.filterModel.warehouseNameTemp)
                {
                    $scope.filterModel.warehouseIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
            $scope.$watch('filterModel.warehouseNameTo', function () {
                if($scope.filterModel.warehouseNameTo != $scope.filterModel.warehouseNameToTemp)
                {
                    $scope.filterModel.warehouseIndexTo = "00000000-0000-0000-0000-000000000000";
                }
            })
            $scope.$watch('filterModel.zoneName', function () {
                if($scope.filterModel.zoneName != $scope.filterModel.zoneNameTemp)
                {
                    $scope.filterModel.zoneIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
         

            // -----------------ALL POPUP IN PAGE-----------------//


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

            $scope.popupShipTo = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupShipTo.onShow = !$scope.popupShipTo.onShow;
                    $scope.popupShipTo.delegates.shipToPopup(param, index);
                },
                config: {
                    title: "ShipTo"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.shipToIndex = angular.copy(param.shipToIndex);
                        $scope.filterModel.shipToId = angular.copy(param.shipToId);
                        $scope.filterModel.shipToName = angular.copy(param.shipToName);
                        $scope.filterModel.shipToNameTemp = $scope.filterModel.shipToName;

                    }
                }
            };

            $scope.popupProduct = {
                onShow: false,
                delegates: {},
                onClick: function (index) {                                     
                    $scope.popupProduct.onShow = !$scope.popupProduct.onShow;
                    $scope.popupProduct.delegates.productPopup(index);
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

            $scope.popupZone = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupZone.onShow = !$scope.popupZone.onShow;
                    $scope.popupZone.delegates.zonePopup(param, index);
                },
                config: {
                    title: "Zone"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.zoneIndex = angular.copy(param.zoneIndex);
                        $scope.filterModel.zoneId = angular.copy(param.zoneId);
                        $scope.filterModel.zoneName = angular.copy(param.zoneName);
                        $scope.filterModel.zoneNameTemp = $scope.filterModel.zoneName;
                    }
                }
            };

            $scope.popupRound = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {

                    $scope.popupRound.onShow = !$scope.popupRound.onShow;
                    $scope.popupRound.delegates.roundPopup(param, index);
                },
                config: {
                    title: "Round"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.roundIndex = angular.copy(param.roundIndex);
                        $scope.filterModel.roundId = angular.copy(param.roundId);
                        $scope.filterModel.roundName = angular.copy(param.roundName);
                        $scope.filterModel.roundNameTemp = $scope.filterModel.roundName;
                    }
                }
            };

            $scope.popupRoute = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {

                    $scope.popupRoute.onShow = !$scope.popupRoute.onShow;
                    $scope.popupRoute.delegates.routePopup(param, index);
                },
                config: {
                    title: "Route"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.routeIndex = angular.copy(param.routeIndex);
                        $scope.filterModel.routeId = angular.copy(param.routeId);
                        $scope.filterModel.routeName = angular.copy(param.routeName);
                        $scope.filterModel.routeNameTemp = $scope.filterModel.routeName;
                    }
                }
            };

            $scope.popupPlanGi = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    index = 3;
                    $scope.popupPlanGi.onShow = !$scope.popupPlanGi.onShow;
                    $scope.popupPlanGi.delegates.planGiPopup(param, index);
                },
                config: {
                    title: "PlanGI"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.planGoodsIssueIndex = angular.copy(param.planGoodsIssueIndex);
                        $scope.filterModel.planGoodsIssueNo = angular.copy(param.planGoodsIssueNo);
                        $scope.filterModel.planGoodsIssueNoTemp = $scope.filterModel.planGoodsIssueNo;

                        
                    }
                }
            };

            $scope.popupDocumentType = {
                onShow: false,
                delegates: {},
                onClick: function (param, index,chk) {
                    chk = '1';
                    $scope.popupDocumentType.onShow = !$scope.popupDocumentType.onShow;
                    $scope.popupDocumentType.delegates.documentTypePopup(param, index,chk);
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

            $scope.popupPickTicket = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {

                    $scope.popupPickTicket.onShow = !$scope.popupPickTicket.onShow;
                    $scope.popupPickTicket.delegates.pickTicketPopup(param, index);
                },
                config: {
                    title: "Route"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.pickTicketNo = angular.copy(param.tagOutPick_No);
                        $scope.filterModel.pickTicketNoRef = angular.copy(param.ref_Document_No);
                        $scope.filterModel.pickTicketNoTemp = $scope.filterModel.pickTicketNo;

                    }
                }
            };

            $scope.popupStatus = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    
                    index = 4;
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

            this.$onInit = function () {
                $vm.triggerSearch();
                $scope.filterModel = {};
                $scope.filterModel.goodsIssueDate = getToday();
                $scope.filterModel.goodsIssueDateTo = getToday();
            };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });
            
        }
    });

})();