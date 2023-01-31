(function () {
    'use strict'

    app.component('giLoadingForm', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/GI/component/giLoadingForm.html",
        bindings: {
            isLoading: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilterTable: '=?',
            isFilter: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, goodIssueFactory, planGoodsIssueItemFactory) {
            var $vm = this;

            $scope.isLoading = false;

            var defer = {};
            var viewModel = goodIssueFactory;

            var _tempData = {};
            var _planGI = {};
            var _index = -99;

            $vm.isLoading = function (param, index) {                
                defer = $q.defer();
                $scope.isLoading = true;
                if (param != undefined) {
                    if (!param.flagUpdate) {
                        planGoodsIssueItemFactory.getByPlanGoodIssueId(param.planGoodsIssueIndex).then(function (res) {                            
                            _tempData = res.data[index];
                            _planGI = res.data[index];
                            _index = index;
                            $scope.filterModel = res.data[index];
                            $scope.buttons.add = false;
                            $scope.buttons.update = true;
                        });
                    }
                    else {
                        _tempData = param;
                        _planGI = param;
                        _index = index;
                        $scope.filterModel = param;
                        $scope.buttons.add = false;
                        $scope.buttons.update = true;
                    }
                }
                else {
                    $scope.buttons.add = true;
                    $scope.buttons.update = false;
                }
                return defer.promise;
            };

            $scope.add = function () {
                $scope.filterModel.isActive = true;
                defer.resolve($scope.filterModel);
                
                $scope.filterModel = {};
            }

            $scope.edit = function () {
                _planGI.index = _index;
                _planGI.flagUpdate = true;
                $scope.filterModel = {};
                defer.resolve(_planGI);
            }

            $scope.back = function () {
                $scope.filterModel = {};
                defer.resolve('-99');
            }


            $scope.show = {
                main: true,
                transport: false,
                warehouse: false
            };

            $scope.buttons = {
                add: true,
                update: false,
                back: true
            };

            $scope.filterModels = function () {
                $scope.filterModel.isActive = 1;
                $scope.filterModel.isDelete = 0;
                $scope.filterModel.isSystem = 0;
                $scope.filterModel.StatusId = 0;
            };


            function Add(param) {
                let deferred = $q.defer();

                viewModel.add(param).then((results) => {
                    
                    deferred.resolve(results);
                }, (error) => {
                    
                    deferred.reject(error);
                });
                
                return deferred.promise;
            }

            function Edit(param) {
                var deferred = $q.defer();
                viewModel.edit(param).then(
                    function success(results) {
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            $scope.popupProduct = {
                onShow: false,
                delegates: {},
                onClick: function (index) {
                    if ($scope.filterModel.ownerIndex != null) {
                        index = $scope.filterModel.ownerIndex;
                    };
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
                        $scope.filterModel.productSecondName = angular.copy(param.productSecondName);
                        $scope.filterModel.productThirdName = angular.copy(param.productThirdName);
                        $scope.filterModel.productConversionIndex = angular.copy(param.productConversionIndex);
                        $scope.filterModel.productConversionId = angular.copy(param.productConversionId);
                        $scope.filterModel.productConversionName = angular.copy(param.productConversionName);
                        $scope.filterModel.ratio = angular.copy(param.productConversionRatio);
                        $scope.filterModel.productCategoryIndex = angular.copy(param.productCategoryIndex);
                        $scope.filterModel.productTypeName = angular.copy(param.productTypeName);
                    }
                }
            };

            $scope.popupOwner= {
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

                    }
                }
            };


            $scope.popupProductConversion = {
                onShow: false,
                delegates: {},
                onClick: function (index) {
                    if ($scope.filterModel.productIndex != null) {
                        
                        index = $scope.filterModel.productIndex;
                    };
                    $scope.popupProductConversion.onShow = !$scope.popupProductConversion.onShow;
                    $scope.popupProductConversion.delegates.productConversionPopup(index);
                },
                config: {
                    title: "ProductConversion"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.productConversionIndex = angular.copy(param.productConversionIndex);
                        $scope.filterModel.productConversionId = angular.copy(param.productConversionId);
                        $scope.filterModel.productConversionName = angular.copy(param.productConversionName);
                        $scope.ratio = angular.copy(param.productConversionRatio);
                    }
                }
            };            

            $scope.popupProductType = {
                onShow: false,
                delegates: {},
                onClick: function (index) {                                        
                    if ($scope.filterModel.productCategoryIndex != null) {
                        index = $scope.filterModel.productCategoryIndex;
                    };
                    $scope.popupProductType.onShow = !$scope.popupProductType.onShow;
                    $scope.popupProductType.delegates.productTypePopup(index);
                },
                config: {
                    title: "Product Type"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.productTypeIndex = angular.copy(param.productTypeIndex);
                        $scope.filterModel.productTypeId = angular.copy(param.productTypeId);
                        $scope.filterModel.productTypeName = angular.copy(param.productTypeName);
                    }
                }
            };

            $scope.popupItemStatus = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupItemStatus.onShow = !$scope.popupItemStatus.onShow;
                    $scope.popupItemStatus.delegates.itemStatusPopup(param, index);
                },
                config: {
                    title: "Item Status"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {

                        $scope.filterModel.ItemStatusIndex = angular.copy(param.itemStatusIndex);
                        $scope.filterModel.ItemStatusId = angular.copy(param.itemStatusId);
                        $scope.filterModel.ItemStatusName = angular.copy(param.itemStatusName);
                        
                    }
                }
            };

            var init = function () {

                $scope.filterModel = {};
            };
            init();
        }
    })
})();