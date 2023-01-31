(function () {
    'use strict'

    app.component('lpnList', {
        controllerAs: '$vm',
        templateUrl: "modules/Tranfer/StatusGrade/component/lpnList.html",
        bindings: {

            isLoading: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilterTable: '=?',
            isFilter: '=?',
        },
        controller: function ($scope, $q, $filter, $state, pageLoading, $window, localStorageService, $timeout, $translate, dpMessageBox, planGoodsReceiveFactory,) {
            var $vm = this;
            $scope.isLoading = false;
            var defer = {};
            var viewModel = planGoodsReceiveFactory;
            $scope.filterModel = {};
            var _tempData = {};
            var _planGR = {};
            var _index = -99;

            $vm.isLoading = function (param ,sumLPN, items) {
                defer = $q.defer();
                $vm.searchResultModel = param;
                $scope.filterModel = items;         
                $scope.SumModel = sumLPN;      
                $scope.isLoading = true;
                if (param != undefined) {
                    var Activity = [];
                    let count = 0;
                    // for (var i = 0; i <= param.length - 1; i++) {
                    //     if(param[0].productName )
                    // }

                    $scope.buttons.add = false;
                    $scope.buttons.update = true;
                }
                else {
                    $scope.buttons.add = true;
                    $scope.buttons.update = false;
                }
                return defer.promise;
            };

            $scope.add = function (param) {
                if (param.productId == undefined || param.productName == undefined ||
                    param.qty == undefined || param.productConversionName == undefined) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Error.',
                        message: "Plaese Check Data"
                    })
                }
                // if (param.productId == undefined && param != undefined) {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'Error.',
                //         message: "Plaese Check Data"
                //     })
                // }
                else {
                    $scope.filterModel.isActive = true;
                    defer.resolve($scope.filterModel);
                    $scope.filterModel = {};
                }


            }

            $scope.edit = function () {
                _planGR.index = _index;
                _planGR.flagUpdate = true;
                $scope.filterModel = {};
                defer.resolve(_planGR);
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
                        $scope.filterModel.unitWeight = angular.copy(param.productConversionWeight);
                        $scope.filterModel.unitWidth = angular.copy(param.productConversionWidth);
                        $scope.filterModel.unitLength = angular.copy(param.productConversionLength);
                        $scope.filterModel.unitHeight = angular.copy(param.productConversionHeight);
                        $scope.filterModel.unitVolume = angular.copy(param.productConversionVolumeRatio);
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
                        $scope.filterModel.ratio = angular.copy(param.productConversionRatio);
                        $scope.filterModel.unitWeight = angular.copy(param.productConversionWeight);
                        $scope.filterModel.unitWidth = angular.copy(param.productConversionWidth);
                        $scope.filterModel.unitLength = angular.copy(param.productConversionLength);
                        $scope.filterModel.unitHeight = angular.copy(param.productConversionHeight);
                        $scope.filterModel.unitVolume = angular.copy(param.productConversionVolumeRatio);

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