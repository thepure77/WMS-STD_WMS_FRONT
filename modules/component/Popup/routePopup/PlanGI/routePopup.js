
(function () {
    'use strict'
    app.directive('routePopupPlanGi', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/component/Popup/routePopup/PlanGI/routePopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'routeFactoryPlanGi',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, routeFactoryPlanGi) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = routeFactoryPlanGi;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            var param = {};
                            param.routeIndex = "";
                            param.routeId = "";
                            param.routeName = "";
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
                        $scope.delegates.routePopup = function (index) {
                            //$scope.dataset = angular.copy(param);
                            $scope.index = angular.copy(index);
                            $scope.findroute();
                        }

                        $scope.findroute = function (model) {
                            $scope.route = $scope.route || {};
                            $scope.route.advanceSearch = true;
                            $scope.route.currentPage = 1;
                            $scope.route.numPerPage = $scope.model.numPerPage;
                            $scope.route.routeName = $scope.route.routeName;
                            $scope.search($scope.route).then(function success(res) {
                                if ($scope.datalist.delegates.set){
                                    if(res.data.itemsroute != undefined && res.data.itemsroute.length != 0 ){
                                        $scope.datalist.delegates.set(res.data.itemsroute, res.data.pagination);
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

                        $scope.searchFilter = function (model) {
                            var deferred = $q.defer();  
                            let item = $scope.datalist.items;
                            if (model.routeName != null && model.routeId == undefined) {
                                for (var i = 0; i <= item.length - 1; i++) {
                                    if (item[i].routeName == model.routeName) {
                                        model.routeId = item[i].routeId;
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
                            $scope.route = $scope.route || {};
                            $scope.searchFilter($scope.route).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data;
                                $scope.route = {};
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data);
                            }, function error(res) { });
                        }

                        $scope.search = function (model) {                            
                            var deferred = $q.defer();
                            if (model.provinceIndex != "" && model.provinceIndex != null && model.routeName == null) {
                                viewModel.getId(model.provinceIndex).then(
                                    function success(res) {
                                        deferred.resolve(res);
                                    },
                                    function error(response) {
                                        deferred.reject(response);
                                    });
                            }
                            else {
                                
                                if (model.routeName != null) {
                                    $scope.route = {};
                                }
                                viewModel.filter(model).then(
                                    function success(res) {
                                        deferred.resolve(res);
                                    },
                                    function error(response) {
                                        deferred.reject(response);
                                    });
                            };
                            return deferred.promise;
                        }
                        $scope.filter = function () {
                            $scope.route = $scope.route || {};
                            $scope.route.advanceSearch = true;
                            $scope.route.currentPage = 1;
                            $scope.route.numPerPage = $scope.model.numPerPage;
                            $scope.route.routeName = $scope.route.routeName;
                            $scope.search($scope.route).then(function success(res) {
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsroute, res.data.pagination);
                            }, function error(res) { });
                        }
                        $scope.find = function () {
                            $scope.route = $scope.route || {};
                            $scope.route.key = $scope.model.key;
                            $scope.route.advanceSearch = false;
                            $scope.route.currentPage = 1;
                            $scope.route.numPerPage = $scope.model.numPerPage;
                            viewModel.filter($scope.route).then(function success(res) {
                                if (res.data.length != 0) {
                                    $scope.datalist.items = res.data;
                                    if ($scope.datalist.delegates.set)
                                        $scope.datalist.delegates.set(res.data);
                                }
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
                                    $scope.route = $scope.route || {};
                                    $scope.route.currentPage = param.currentPage;
                                    $scope.route.numPerPage = param.numPerPage;
                                    viewModel.getroute($scope.route).then(function success(res) {
                                        if ($scope.datalist.delegates.set)
                                            $scope.datalist.delegates.set(res.data.itemsroute, res.data.pagination);
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
