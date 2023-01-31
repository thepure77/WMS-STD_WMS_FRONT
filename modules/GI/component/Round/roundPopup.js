
(function () {
    'use strict'
    app.directive('roundPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/GI/component/Round/roundPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'roundFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, roundFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = roundFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            var param = {};
                            param.roundIndex = "";
                            param.roundId = "";
                            param.roundName = "";
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
                        $scope.delegates.roundPopup = function (index) {
                            //$scope.dataset = angular.copy(param);
                            $scope.index = angular.copy(index);
                            $scope.findRound();
                        }

                        $scope.findRound = function (model) {
                            $scope.round = $scope.round || {};
                            $scope.round.advanceSearch = true;
                            $scope.round.currentPage = 1;
                            $scope.round.numPerPage = $scope.model.numPerPage;
                            $scope.search($scope.round).then(function success(res) {
                                if ($scope.datalist.delegates.set){
                                    if(res.data.itemsround != undefined && res.data.itemsround.length != 0 ){
                                        $scope.datalist.delegates.set(res.data.itemsround, res.data.pagination);
                                    } 
                                    else {
                                        $scope.datalist.delegates.set(res.data);
                                    }
                                    
                                }
                                    
                            }, function error(res) { });
                        }

                        // $scope.searchFilter = function (model) {
                        //     var deferred = $q.defer();
                        //     viewModel.popupSearch(model).then(
                        //         function success(res) {
                        //             deferred.resolve(res);
                        //         },
                        //         function error(response) {
                        //             deferred.reject(response);
                        //         });
                        //     return deferred.promise;
                        // }
                        $scope.searchFilter = function (model) {
                            var deferred = $q.defer();  
                            let item = $scope.datalist.items;
                            
                            if (model.roundName != null && model.roundId == undefined) {
                                for (var i = 0; i <= item.length - 1; i++) {
                                    if (item[i].roundName == model.roundName) {
                                        model.roundId = item[i].roundId;
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
                        
                        $scope.filterSearch = function (){
                            $scope.round = $scope.round || {};
                            $scope.searchFilter($scope.round).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data;
                                $scope.round = {};
                                if ($scope.datalist.delegates.set)
                                $scope.datalist.delegates.set(res.data);
                            }, function error(res) { });
                        }

                        $scope.delegates.edit = function (index) { }
                        $scope.create = function () {
                            if ($scope.invokes.add != undefined)
                                $scope.invokes.add();
                        }
                        $scope.search = function (model) {
                            
                            var deferred = $q.defer();
                            if (model.provinceIndex != "" && model.provinceIndex != null && model.roundName == null) {
                                viewModel.getId(model.provinceIndex).then(
                                    function success(res) {
                                        deferred.resolve(res);
                                    },
                                    function error(response) {
                                        deferred.reject(response);
                                    });
                            }
                            else {
                                if (model.roundName != null) {
                                    $scope.round = {};
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
                            $scope.round = $scope.round || {};
                            $scope.round.advanceSearch = true;
                            $scope.round.currentPage = 1;
                            $scope.round.numPerPage = $scope.model.numPerPage;
                            $scope.round.roundName = $scope.round.roundName;
                            $scope.search($scope.round).then(function success(res) {
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsround, res.data.pagination);
                            }, function error(res) { });
                        }
                        $scope.find = function () {
                            $scope.round = $scope.round || {};
                            $scope.round.key = $scope.model.key;
                            $scope.round.advanceSearch = false;
                            $scope.round.currentPage = 1;
                            $scope.round.numPerPage = $scope.model.numPerPage;
                            viewModel.filter($scope.round).then(function success(res) {
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
                                    $scope.round = $scope.round || {};
                                    $scope.round.currentPage = param.currentPage;
                                    $scope.round.numPerPage = param.numPerPage;
                                    viewModel.getround($scope.round).then(function success(res) {
                                        if ($scope.datalist.delegates.set)
                                            $scope.datalist.delegates.set(res.data.itemsround, res.data.pagination);
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
