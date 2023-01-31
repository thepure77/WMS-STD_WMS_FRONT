(function () {
    'use strict'
    app.directive('vendorOwnerPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/masterData/component/vendorOwnerPopup/vendorOwnerPopup/vendorOwnerPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'vendorOwnerPopupFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, vendorOwnerPopupFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = vendorOwnerPopupFactory;

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
                            if (model.vendor_Name != null && model.vendor_Id == undefined) {
                                for (var i = 0; i <= item.length - 1; i++) {
                                    if (item[i].vendor_Name == model.vendor_Name) {
                                        model.vendor_Id = item[i].vendor_Id;
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
                                $scope.vendor.vendor_Id = null;
                            }if($scope.actionPS == "2"){
                                $scope.vendor.vendor_Name = null;
                            }
                        }

                        $scope.filterSearch = function () {     
                            $scope.vendor = $scope.vendor || {};
                            $scope.searchFilter($scope.vendor).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data.itemsVendorPopup;
                                $scope.vendor={};
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsVendorPopup);
                            }, function error(res) { });
                        }
                        $scope.delegates.vendorOwnerPopup = function (param, index,listData) {
                            $scope.OwnerIndex = angular.copy(param);
                            $scope.dataItemList = listData;
                            $scope.dataset = angular.copy(param);
                            $scope.index = angular.copy(index);
                            $scope.find($scope.OwnerIndex);
                        }
                        $scope.delegates.edit = function (index) { }
                        $scope.create = function () {
                            if ($scope.invokes.add != undefined)
                                $scope.invokes.add();
                        }
                        $scope.search = function (model) {
                            model.listVendorViewModel = $scope.dataItemList;
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
                            $scope.vendor = $scope.vendor || {};
                            $scope.vendor.advanceSearch = true;
                            $scope.vendor.currentPage = 0;
                            $scope.vendor.numPerPage = $scope.model.numPerPage;
                            $scope.search($scope.vendor).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data.itemsVendorPopup;
                                if ($scope.datalist.delegates.set)
                                $scope.datalist.delegates.set(res.data.itemsVendorPopup);
                            }, function error(res) { });
                        }
                        $scope.find = function (OwnerIndex) {
                            $scope.vendor = {};
                            $scope.vendor.key = $scope.model.key;
                            $scope.vendor.advanceSearch = false;
                            $scope.vendor.currentPage = 0;
                            $scope.vendor.numPerPage = $scope.model.numPerPage;
                            $scope.search($scope.vendor).then(function success(res) {
                                $scope.datalist.items = res.data.itemsVendorPopup;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsVendorPopup,OwnerIndex);
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
                                        $scope.datalist = res.data.itemsVendorPopup;
                                        if ($scope.datalist.delegates.set)
                                            $scope.datalist.delegates.set(res.data.itemsVendorPopup, res.data.pagination);
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
