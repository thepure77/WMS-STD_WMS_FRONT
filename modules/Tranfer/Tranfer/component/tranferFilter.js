(function () {
    'use strict';
    app.component('tranferFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Tranfer/Tranfer/component/tranferFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            filterSearch: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService, goodIssueFactory) {
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
                viewModel.filter($vm.filterModel).then(function (res) {
                    $vm.filterModel = res.data.atcom;
                    $vm.searchResultModel = res.data;
                });;
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
                
                $scope.filterModel.RefDocumentNo = $scope.filterModel.planGoodsIssueNo;
                $scope.filterModel.RefDocumentindex = $scope.filterModel.planGoodsIssueIndex;
                viewModel.giSearch(param).then(
                    function success(res) {
                        deferred.resolve(res);
                    },
                    function error(response) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }
            $scope.filterSearch = function (){                
                $scope.filterModel = $scope.filterModel || {};
                var item = $scope.filterModel;
                $scope.searchFilter($scope.filterModel).then(function success(res) { 
                    $vm.searchResultModel = res.data;
               
                }, function error(res) { });
            }  

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
                        $scope.filterModel.ownerName = angular.copy(param.ownerId) + " - " + angular.copy(param.ownerName);

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
                        $scope.filterModel.zoneName = angular.copy(param.zoneId) + " - " + angular.copy(param.zoneName);

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

                    }
                }
            };

            $scope.popupPlanGi = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
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


                        
                    }
                }
            };

            $scope.popupDocumentType = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupDocumentType.onShow = !$scope.popupDocumentType.onShow;
                    $scope.popupDocumentType.delegates.documentTypePopup(param, index);
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