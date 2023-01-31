
(function () {
    'use strict'
    app.directive('productTypePopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/masterData/component/productTypePopup/productTypePopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'productTypeFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, productTypeFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = productTypeFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            var param = {};
                            param.productTypeIndex = "";
                            param.productTypeId = "";
                            param.productTypeName = "";
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
                        $scope.delegates.productTypePopup = function (index, name) {
                            $scope.name = angular.copy(name);
                            $scope.index = angular.copy(index);
                            $scope.find();
                        }
                        $scope.delegates.edit = function (index) { }
                        $scope.create = function () {
                            if ($scope.invokes.add != undefined)
                                $scope.invokes.add();
                        }
                        $scope.search = function (model) {                            
                            var deferred = $q.defer();
                            if (model.productCategoryIndex != "" && model.productCategoryIndex != null) {
                                viewModel.getId(model.productCategoryIndex).then(
                                    function success(res) {
                                        deferred.resolve(res);
                                    },
                                    function error(response) {
                                        deferred.reject(response);
                                    });
                            }
                            else {
                                if (model.ProductTypeId == '0' ) {
                                    viewModel.search(model).then(
                                        function success(res) {
                                            deferred.resolve(res);
                                        },
                                        function error(response) {
                                            deferred.reject(response);
                                        });
                                } 
                                else {
                                    viewModel.filter(model).then(
                                        function success(res) {
                                            deferred.resolve(res);
                                        },
                                        function error(response) {
                                            deferred.reject(response);
                                        });
                                }

                            };
                            return deferred.promise;
                        }
                        $scope.searchFilter = function (model) {
                            var deferred = $q.defer();
                            let item = $scope.datalist.items;
                            if (model.productTypeName != null && model.productTypeId == undefined) {
                                for (var i = 0; i <= item.length - 1; i++) {
                                    if (item[i].productTypeName == model.productTypeName) {
                                        model.productTypeId = item[i].productTypeId;
                                    }
                                };
                            }
                            viewModel.search(model).then(
                                function success(res) {
                                    deferred.resolve(res);
                                },
                                function error(response) {
                                    deferred.reject(response);
                                });
                            return deferred.promise;
                        }
                        $scope.filterSearch = function () {
                            $scope.productType = $scope.productType || {};
                            $scope.searchFilter($scope.productType).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data;
                                $scope.productType = {};
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data);
                            }, function error(res) { });
                        }
                        $scope.filter = function () {
                            $scope.productType = $scope.productType || {};
                            $scope.productType.advanceSearch = true;
                            $scope.productType.currentPage = 0;
                            $scope.productType.numPerPage = $scope.model.numPerPage;
                            $scope.search($scope.productType).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data);
                            }, function error(res) { });
                        }
                        $scope.find = function () {
                            $scope.productType = $scope.productType || {};
                            $scope.productType.key = $scope.model.key;
                            $scope.productType.advanceSearch = false;
                            $scope.productType.currentPage = 0;
                            $scope.productType.productCategoryIndex = $scope.index;
                            $scope.productType.ProductTypeId = $scope.name;
                            $scope.productType.numPerPage = $scope.model.numPerPage;
                            $scope.search($scope.productType).then(function success(res) {
                                $scope.datalist.items = res.data;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data);
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
                                    $scope.productType = $scope.productType || {};
                                    $scope.productType.currentPage = param.currentPage;
                                    $scope.productType.numPerPage = param.numPerPage;
                                    $scope.search($scope.productType).then(function success(res) {
                                        $scope.datalist.config.paginations = res.data.pagination;
                                        $scope.datalist = res.data;
                                        if ($scope.datalist.delegates.set)
                                            $scope.datalist.delegates.set(res.data, res.data.pagination);
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
