
(function () {
    'use strict'
    app.directive('vendorPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/masterData/component/vendorPopup/vendorPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'vendorFactory', 'ownerVendorFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, vendorFactory, ownerVendorFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = vendorFactory;



                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                            $scope.vendor = {};
                        };
                        $scope.onClose = function (param) {
                            var param = {};
                            param.vendorIndex = "";
                            param.vendorId = "";
                            param.vendorName = "";
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
                        $scope.delegates.vendorPopupFilter = function (index,text) {
                            
                            $scope.index = angular.copy(index);
                            $scope.text = angular.copy(text);
                            $scope.findbyOwner();

                        }
                        $scope.delegates.vendorPopup = function (param, index) {
                            $scope.index = angular.copy(index);
                            $scope.dataset = angular.copy(param);
                            $scope.find();
                        }

                        $scope.delegates.edit = function (index) { }
                        $scope.create = function () {
                            if ($scope.invokes.add != undefined)
                                $scope.invokes.add();
                        }
                        $scope.searchByOwner = function (model) {
                            var deferred = $q.defer();
                            if (model.ownerIndex != "" && model.ownerIndex != null) {
                                ownerVendorFactory.vendorPopupSearch(model).then(
                                    function success(res) {
                                        deferred.resolve(res);
                                    },
                                    function error(response) {
                                        deferred.reject(response);
                                    });
                                return deferred.promise;
                            }
                            else {
                                viewModel.filter(model).then(
                                    function success(res) {
                                        deferred.resolve(res);
                                    },
                                    function error(response) {
                                        deferred.reject(response);
                                    });
                                return deferred.promise;
                            }
                        }
                        $scope.search = function (model) {
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

                        $scope.searchFilter = function (model) {
                            var deferred = $q.defer();
                            let item = $scope.datalist.items;
                            if (model.vendorName != null && model.vendorId == undefined) {
                                for (var i = 0; i <= item.length - 1; i++) {
                                    if (item[i].vendorName == model.vendorName) {
                                        model.vendorId = item[i].vendorId;
                                    }
                                };
                            }
                            if (model.ownerIndex == undefined) {
                                viewModel.popupSearch(model).then(
                                    function success(res) {
                                        deferred.resolve(res);
                                    },
                                    function error(response) {
                                        deferred.reject(response);
                                    });
                                return deferred.promise;
                            }
                            else {
                                ownerVendorFactory.vendorPopupSearch(model).then(
                                    function success(res) {
                                        deferred.resolve(res);
                                    },
                                    function error(response) {
                                        deferred.reject(response);
                                    });
                                return deferred.promise;
                            }

                        }

                        $scope.filterSearch = function (data) {
                            $scope.vendor = $scope.vendor || {};
                            $scope.vendor.vendorId = data;
                            $scope.searchFilter($scope.vendor).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data);
                            }, function error(res) { });
                        }
                        $scope.filter = function () {
                            $scope.vendor = $scope.vendor || {};
                            $scope.vendor.advanceSearch = true;
                            $scope.vendor.currentPage = 0;
                            $scope.vendor.numPerPage = $scope.model.numPerPage;
                            $scope.search($scope.vendor).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data);
                            }, function error(res) { });
                        }
                        $scope.findbyOwner = function () {
                            $scope.vendor = $scope.vendor || {};
                            $scope.vendor.key = $scope.model.key;
                            $scope.vendor.advanceSearch = false;
                            $scope.vendor.currentPage = 0;
                            $scope.vendor.ownerIndex = $scope.index;
                            $scope.vendor.numPerPage = $scope.model.numPerPage;
                            $scope.vendor.vendorName = $scope.text;
                            $scope.actionPS = '2';
                            $scope.searchByOwner($scope.vendor).then(function success(res) {
                                $scope.datalist.items = res.data;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data);
                            }, function error(res) { });
                        };
                        $scope.find = function () {
                            if ($scope.vendor != null) {
                                $scope.vendor = {};
                            };
                            $scope.vendor = $scope.vendor || {};
                            $scope.vendor.key = $scope.model.key;
                            $scope.vendor.advanceSearch = false;
                            $scope.vendor.currentPage = 0;
                            $scope.vendor.ownerIndex = $scope.index;
                            $scope.vendor.numPerPage = $scope.model.numPerPage;
                            $scope.search($scope.vendor).then(function success(res) {
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
                                    $scope.vendor = $scope.vendor || {};
                                    $scope.vendor.currentPage = param.currentPage;
                                    $scope.vendor.numPerPage = param.numPerPage;
                                    $scope.search($scope.vendor).then(function success(res) {
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
