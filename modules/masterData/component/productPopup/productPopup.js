
(function () {
    'use strict'
    app.directive('productPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/masterData/component/productPopup/productPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'productFactory', 'productPopupFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, productFactory, productPopupFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = productFactory;
                        var _viewModels = productPopupFactory;
                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            var param = {};
                            param.productIndex = "";
                            param.productId = "";
                            param.productName = "";
                            $scope.invokes.selected(param);
                            $scope.onShow = false;
                        };
                        $scope.$watchCollection('onShow', function (newVal, oldVal) {
                            if (newVal !== oldVal) {
                            }
                        });
                        $scope.model = {
                            currentPage: 0,
                            numPerPage: 30,
                            totalRow: 1,
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
                        $scope.delegates.productPopup = function (index) {
                            //$scope.dataset = angular.copy(param);
                            $scope.product = {};
                            $scope.index = angular.copy(index);                            
                            // $scope.findProduct();
                            $scope.find();
                        }

                        $scope.$watch('product.productId', function () {                            
                            if($scope.product != undefined)
                            {
                                if($scope.product.productId != "")
                                {
                                    $scope.product.productName = "";
                                }
                            }
                            
                        })
                        $scope.$watch('product.productName', function () {                            
                            if($scope.product != undefined)
                            {
                                if($scope.product.productName != "")
                                {
                                    $scope.product.productId = "";
                                }
                            }
                           
                        })

                        $scope.findProduct = function (model) {
                            $scope.product = $scope.product || {};
                            $scope.product.advanceSearch = true;
                            $scope.product.currentPage = 1;
                            $scope.product.numPerPage = $scope.model.numPerPage;
                            $scope.product.provinceIndex = $scope.index;
                            $scope.search($scope.product).then(function success(res) {
                                if ($scope.datalist.delegates.set) {
                                    if (res.data.itemsProduct != undefined && res.data.itemsProduct.length != 0) {
                                        $scope.datalist.delegates.set(res.data.itemsProduct, res.data.pagination);
                                    }
                                    else {
                                        $scope.datalist.delegates.set(res.data);
                                    }

                                }

                            }, function error(res) { });
                        }

                        $scope.delegates.edit = function (index) { }
                        $scope.create = function () {
                            if ($scope.invokes.add != undefined)
                                $scope.invokes.add();
                        }
                        $scope.search = function (model) {
                            var deferred = $q.defer();
                            if (model.ownerIndex != "" && model.ownerIndex != null) {
                                
                                _viewModels.getProduct(model).then(function success(res) {
                                    if ($scope.datalist.delegates.set)
                                        $scope.datalist.delegates.set(res.data.itemsProduct, res.data.pagination);
                                    deferred.resolve(res);
                                },
                                    function error(response) {
                                        deferred.reject(response);
                                    });
                            }
                            else {
                                
                                _viewModels.getProduct(model).then(
                                    function success(res) {
                                        
                                        if ($scope.datalist.delegates.set)
                                        $scope.datalist.delegates.set(res.data.itemsProduct, res.data.pagination);
                                        deferred.resolve(res);
                                    },
                                    function error(response) {
                                        deferred.reject(response);
                                    });
                            };
                            return deferred.promise;
                        }
                        $scope.searchFilter = function (model) {
                            var deferred = $q.defer();
                            if (model.ownerIndex != "" && model.ownerIndex != null) {
                                _viewModels.getProduct(model).then(
                                    function success(res) {
                                        deferred.resolve(res);
                                    },
                                    function error(response) {
                                        deferred.reject(response);
                                    });
                            }
                            else {
                                viewModel.popupSearch(model).then(
                                    function success(res) {
                                        deferred.resolve(res);
                                    },
                                    function error(response) {
                                        deferred.reject(response);
                                    });
                            };
                            return deferred.promise;
                        }
                                                                             
                        $scope.filterSearch = function () {
                            $scope.product = $scope.product || {};
                            $scope.searchFilter($scope.product).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data);
                            }, function error(res) { });
                        }
                        $scope.filter = function (data) {
                            $scope.product = $scope.product || {};
                            $scope.product.advanceSearch = true;
                            $scope.product.currentPage = 1;
                            $scope.product.numPerPage = $scope.model.numPerPage;
                            $scope.product.productId = data;
                            
                            $scope.search($scope.product).then(function success(res) {
                                
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data);
                            }, function error(res) { });
                        }
                        $scope.find = function () {
                            $scope.product = $scope.product || {};
                            $scope.product.key = $scope.model.key;
                            $scope.product.advanceSearch = false;
                            $scope.product.currentPage = 1;
                            $scope.product.ownerIndex = $scope.index;
                            $scope.product.numPerPage = $scope.model.numPerPage;
                            
                            _viewModels.getProduct($scope.product).then(function success(res) {
                                
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsProduct, res.data.pagination);
                            }, function error(res) { });
                            // viewModel.filter($scope.product).then(function success(res) {
                            // $scope.search($scope.product).then(function success(res) {
                            //     $scope.datalist.items = res.data;
                            //     if ($scope.datalist.delegates.set)
                            //         $scope.datalist.delegates.set(res.data);
                            // }, function error(res) { });
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
                                    $scope.product = $scope.product || {};
                                    $scope.product.currentPage = param.currentPage;
                                    $scope.product.numPerPage = param.numPerPage;
                                    _viewModels.getProduct($scope.product).then(function success(res) {
                                        if ($scope.datalist.delegates.set)
                                            $scope.datalist.delegates.set(res.data.itemsProduct, res.data.pagination);
                                    }, function error(res) { });
                                    // $scope.search($scope.product).then(function success(res) {
                                    //     $scope.datalist.config.paginations = res.data.pagination;
                                    //     $scope.datalist = res.data;
                                    //     if ($scope.datalist.delegates.set)
                                    //         $scope.datalist.delegates.set(res.data, res.data.pagination);
                                    // }, function error(res) { });
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
