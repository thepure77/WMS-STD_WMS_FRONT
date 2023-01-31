(function () {
    'use strict'
    app.directive('productConversionBarcodePopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/masterData/component/productConversionBarcodePopup/productConversionBarcodePopup/productConversionBarcodePopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'productConversionBarcodePopupFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, productConversionBarcodePopupFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = productConversionBarcodePopupFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            var param = {};
                            $scope.invokes.selected(param);
                            $scope.onShow = false;
                        };
                        $scope.$watchCollection('onShow', function (newVal, oldVal) {
                            if (newVal !== oldVal) {
                            }
                        });
                        $scope.model = {
                            currentPage: 0,
                            numPerPage: 5,
                            totalRow: 0,
                            key: '',
                            advanceSearch: false
                        };
                        $scope.toggleSearch = function () {
                            $scope.model.advanceSearch = $scope.model.advanceSearch === false ? true : false;
                        };
                        $scope.delegates.search = function () {
                            if ($scope.model.advanceSearch)
                                $scope.filter();
                            else
                                $scope.find();
                        }
                        $scope.searchFilter = function (model) {
                            var deferred = $q.defer();                            
                            let item = $scope.datalist.items;
                            if (model.productConversionBarcode != null && model.productConversionBarcode_Id == undefined) {
                                for (var i = 0; i <= item.length - 1; i++) {
                                    if (item[i].productConversionBarcode == model.productConversionBarcode) {
                                        model.productConversionBarcode_Id = item[i].productConversionBarcode_Id;
                                    }
                                };
                            }

                            viewModel.filter(model).then(
                                function success(res) {
                                    deferred.resolve(res);
                                },
                                function error(response) {
                                    deferred.reject(response);
                                });
                            return deferred.promise;
                        }
                        
                        $scope.actionPS = "";
                        $scope.clearData = function (){
                            if($scope.actionPS == "1"){
                                $scope.productConversionBarcode.productConversionBarcode_Id = null;
                            }if($scope.actionPS == "2"){
                                $scope.productConversionBarcode.productConversionBarcode = null;
                            }
                        }

                        $scope.filterSearch = function () {     
                            $scope.productConversionBarcode = $scope.productConversionBarcode || {};
                            $scope.searchFilter($scope.productConversionBarcode).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data.itemsProductConversionBarcodePopup;
                                $scope.productConversionBarcode={};
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsProductConversionBarcodePopup);
                            }, function error(res) { });
                        }
                        $scope.delegates.productConversionBarcodePopup = function (param, index,listData) {
                            $scope.ProductConversionIndex = angular.copy(param);
                            $scope.dataItemList = listData;
                            $scope.dataset = angular.copy(param);
                            $scope.index = angular.copy(index);
                            $scope.find($scope.ProductConversionIndex);
                        }
                        $scope.delegates.edit = function (index) { }
                        $scope.create = function () {
                            if ($scope.invokes.add != undefined)
                                $scope.invokes.add();
                        }
                        $scope.search = function (model) {
                            model.listProductConversionBarcodeViewModel = $scope.dataItemList;
                            var deferred = $q.defer();
                            viewModel.filter(model).then(
                                function success(res) {
                                    deferred.resolve(res);
                                },
                                function error(response) {
                                    deferred.reject(response);
                                });
                            return deferred.promise;
                        }
                        $scope.filter = function () {
                            $scope.productConversionBarcode = $scope.productConversionBarcode || {};
                            $scope.productConversionBarcode.advanceSearch = true;
                            $scope.productConversionBarcode.currentPage = 0;
                            $scope.productConversionBarcode.numPerPage = $scope.model.numPerPage;
                            $scope.search($scope.productConversionBarcode).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data.itemsProductConversionBarcodePopup;
                                if ($scope.datalist.delegates.set)
                                $scope.datalist.delegates.set(res.data.itemsProductConversionBarcodePopup);
                            }, function error(res) { });
                        }
                        $scope.find = function (ProductConversionIndex) {
                            $scope.productConversionBarcode = {};
                            $scope.productConversionBarcode.key = $scope.model.key;
                            $scope.productConversionBarcode.advanceSearch = false;
                            $scope.productConversionBarcode.currentPage = 0;
                            $scope.productConversionBarcode.numPerPage = $scope.model.numPerPage;
                            $scope.search($scope.productConversionBarcode).then(function success(res) {
                                $scope.datalist.items = res.data.itemsProductConversionBarcodePopup;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsProductConversionBarcodePopup,ProductConversionIndex);
                            }, function error(res) { });
                        };
                        $scope.datalist = {
                            delegates: {},
                            config: {
                                paginations: {},
                                currentPage: $scope.model.currentPage,
                                numPerPage: $scope.model.numPerPage,
                                totalRow: 0,
                            },
                            items: {},
                            invokes: {
                                page: function (param) {
                                    $scope.productConversionBarcode = $scope.productConversionBarcode || {};
                                    $scope.productConversionBarcode.currentPage = param.currentPage;
                                    $scope.productConversionBarcode.numPerPage = param.numPerPage;
                                    $scope.search($scope.productConversionBarcode).then(function success(res) {
                                        $scope.datalist.config.paginations = res.data.pagination;
                                        $scope.datalist = res.data.itemsProductConversionBarcodePopup;
                                        if ($scope.datalist.delegates.set)
                                            $scope.datalist.delegates.set(res.data.itemsProductConversionBarcodePopup, res.data.pagination);
                                    }, function error(res) { });
                                },
                                delete: function (param) {
                                    if ($scope.invokes.delete != undefined)
                                        $scope.invokes.delete(param);
                                },
                                edit: function (param) {
                                    if ($scope.invokes.edit != undefined)
                                        $scope.invokes.edit(param);
                                },
                                selected: function (param) {
                                    if ($scope.invokes.selected != undefined)
                                        $scope.invokes.selected(param);
                                    $scope.onShow = false;
                                }
                            }
                        };
                        var init = function () {

                            $q.all([
                            ]).then(function (values) {
                                var results = values;
                            }, function (reasons) {
                                var results = reasons;
                            });
                        };

                        init();
                        // Local Function
                        // end
                    }
                ],
                link: function ($scope, $element, $attributes) { }
            };
        }
    ]);
}());
