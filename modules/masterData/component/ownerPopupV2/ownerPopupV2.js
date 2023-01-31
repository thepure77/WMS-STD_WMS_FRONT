
(function () {
    'use strict'
    app.directive('ownerPopupV2', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/masterData/component/ownerPopupV2/ownerPopupV2.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'ownerFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, ownerFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = ownerFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            var param = {};
                            param.owner_Index = "";
                            param.owner_Id = "";
                            param.owner_Name = "";
                            //$scope.invokes.selected(param);
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
                            if (model.owner_Name != null && model.owner_Id == undefined) {
                                for (var i = 0; i <= item.length - 1; i++) {
                                    if (item[i].owner_Name == model.owner_Name) {
                                        model.owner_Id = item[i].owner_Id;
                                    }
                                };
                            }

                            viewModel.filterOwnerPopupV2(model).then(
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
                                $scope.owner.owner_Name = null;
                            }if($scope.actionPS == "2"){
                                $scope.owner.owner_Id = null;
                            }
                        }

                        $scope.filterSearch = function () {     
                            $scope.owner = $scope.owner || {};
                            $scope.searchFilter($scope.owner).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data.itemsOwner;
                               
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsOwner);
                            }, function error(res) { });
                        }
                        $scope.delegates.OwnerPopupV2 = function (param, index, model) {
                            $scope.listData = angular.copy(param);
                            $scope.product_Index = angular.copy(index);
                            $scope.productModel = angular.copy(model);
                            $scope.dataset = angular.copy(param);
                            $scope.index = angular.copy(index);
                            $scope.find($scope.product_Index, $scope.listData , $scope.productModel );
                        }
                        $scope.delegates.edit = function (index) { }
                        $scope.create = function () {
                            if ($scope.invokes.add != undefined)
                                $scope.invokes.add();
                        }
                        $scope.search = function (model) {
                            var deferred = $q.defer();
                            viewModel.filterOwnerPopupV2(model).then(
                                function success(res) {
                                    deferred.resolve(res);
                                },
                                function error(response) {
                                    deferred.reject(response);
                                });
                            return deferred.promise;
                        }
                        $scope.filter = function () {
                            $scope.owner = $scope.owner || {};
                            $scope.owner.advanceSearch = true;
                            $scope.owner.currentPage = 0;
                            $scope.owner.numPerPage = $scope.model.numPerPage;
                            $scope.search($scope.owner).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data;
                                if ($scope.datalist.delegates.set)
                                $scope.datalist.delegates.set(res.data, );
                            }, function error(res) { });
                        }
                        $scope.find = function (productIndex, listData , productModel) {
                            $scope.owner = {};
                            $scope.owner.listOwnerViewModel = listData;
                            $scope.owner.key = $scope.model.key;
                            $scope.owner.advanceSearch = false;
                            $scope.owner.currentPage = 0;
                            $scope.owner.numPerPage = $scope.model.numPerPage;
                            $scope.search($scope.owner).then(function success(res) {
                                $scope.datalist.items = res.data;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsOwner , productIndex,productModel);
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
                                    $scope.owner = $scope.owner || {};
                                    $scope.owner.currentPage = param.currentPage;
                                    $scope.owner.numPerPage = param.numPerPage;
                                    $scope.search($scope.owner).then(function success(res) {
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
