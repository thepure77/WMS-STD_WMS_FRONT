
(function () {
    'use strict'
    app.directive('goodReceivePopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/GR/component/goodReceivePopup/goodReceivePopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'goodReceiveFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, goodReceiveFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = goodReceiveFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            var param = {};
                            
                            param.lineNum = "";
                            param.productSecondName = "";
                            param.qty = "";
                            param.close = true;
                            param.productConversionName = "";
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
                        $scope.delegates.goodReceivePopup = function (GoodReceive,index,productIndex) {
                            // $scope.dataset = angular.copy(param);
                            
                            $scope.GoodReceive = angular.copy(GoodReceive);
                            // $scope.productIndex = angular.copy(productIndex);
                            
                            
                            $scope.find();
                        }
                        $scope.delegates.edit = function (index) { }
                        $scope.create = function () {
                            if ($scope.invokes.add != undefined)
                                $scope.invokes.add();
                        }
                        $scope.search = function (model) {
                            var deferred = $q.defer();
                            
                            // if (model.GoodsReceiveIndex != "" && model.GoodsReceiveIndex != null) {
                                
                                viewModel.getId(model).then(
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
                            viewModel.search(model).then(
                                function success(res) {
                                    deferred.resolve(res);
                                },
                                function error(response) {
                                    deferred.reject(response);
                                });
                            return deferred.promise;
                        }

                        $scope.filterSearch = function (){
                            $scope.goodReceive = $scope.goodReceive || {};
                            $scope.searchFilter($scope.goodReceive).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data;
                                if ($scope.datalist.delegates.set)
                                $scope.datalist.delegates.set(res.data);
                            }, function error(res) { });
                        }

                        $scope.filter = function () {
                            $scope.goodReceive = $scope.goodReceive || {};
                            $scope.goodReceive.advanceSearch = true;
                            $scope.goodReceive.currentPage = 0;
                            $scope.goodReceive.numPerPage = $scope.model.numPerPage;
                            $scope.search($scope.goodReceive).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data);
                            }, function error(res) { });
                        }
                        $scope.find = function () {
                            // $scope.goodReceive = $scope.goodReceive || {};
                            // // $scope.goodReceive.key = $scope.model.key;
                            // // $scope.goodReceive.advanceSearch = false;
                            // // $scope.goodReceive.currentPage = 0;
                            // // $scope.goodReceive.GoodsReceiveIndex = $scope.GoodReceive;
                            // // $scope.goodReceive.numPerPage = $scope.model.numPerPage;
                            // $scope.goodReceive = $scope.GoodReceive;
                            // $scope.goodReceive.productIndex = $scope.productIndex;
                            
                            $scope.search($scope.GoodReceive).then(function success(res) {
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
                                    $scope.goodReceive = $scope.goodReceive || {};
                                    $scope.goodReceive.currentPage = param.currentPage;
                                    $scope.goodReceive.numPerPage = param.numPerPage;
                                    $scope.search($scope.goodReceive).then(function success(res) {
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
