
(function () {
    'use strict'
    app.directive('shipToPopupV2', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/masterData/component/shipToPopupV2/shipToPopupV2.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'shipToFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, shipToFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = shipToFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            var param = {};
                            param.shipTo_Index = "";
                            param.shipTo_Id = "";
                            param.shipTo_Name = "";
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
                            if (model.shipTo_Name != null && model.shipTo_Id == undefined) {
                                for (var i = 0; i <= item.length - 1; i++) {
                                    if (item[i].shipTo_Name == model.shipTo_Name) {
                                        model.shipTo_Id = item[i].shipTo_Id;
                                    }
                                };
                            }

                            viewModel.filterShiptoPopup(model).then(
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
                                $scope.shipTo.shipTo_Name = null;
                            }if($scope.actionPS == "2"){
                                $scope.shipTo.shipTo_Id = null;
                            }
                        }

                        $scope.filterSearch = function () {     
                            $scope.shipTo = $scope.shipTo || {};
                            $scope.searchFilter($scope.shipTo).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data.itemsShipTo;
                               
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsShipTo);
                            }, function error(res) { });
                        }
                        $scope.delegates.shipToPopupV2 = function (param, index) {
                            $scope.listData = angular.copy(param);
                            console.log($scope.list);
                            $scope.soldTo_Index = angular.copy(index);
                            $scope.dataset = angular.copy(param);
                            $scope.index = angular.copy(index);
                            $scope.find($scope.soldTo_Index, $scope.listData);
                        }
                        $scope.delegates.edit = function (index) { }
                        $scope.create = function () {
                            if ($scope.invokes.add != undefined)
                                $scope.invokes.add();
                        }
                        $scope.search = function (model) {
                            var deferred = $q.defer();
                            viewModel.filterShiptoPopup(model).then(
                                function success(res) {
                                    deferred.resolve(res);
                                },
                                function error(response) {
                                    deferred.reject(response);
                                });
                            return deferred.promise;
                        }
                        $scope.filter = function () {
                            $scope.shipTo = $scope.shipTo || {};
                            $scope.shipTo.advanceSearch = true;
                            $scope.shipTo.currentPage = 0;
                            $scope.shipTo.numPerPage = $scope.model.numPerPage;
                            $scope.search($scope.shipTo).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data;
                                if ($scope.datalist.delegates.set)
                                $scope.datalist.delegates.set(res.data, );
                            }, function error(res) { });
                        }
                        $scope.find = function (soldToIndex, listData) {
                            $scope.shipTo = {};
                            $scope.shipTo.listShipToViewModel = listData;
                            $scope.shipTo.key = $scope.model.key;
                            $scope.shipTo.advanceSearch = false;
                            $scope.shipTo.currentPage = 0;
                            $scope.shipTo.numPerPage = $scope.model.numPerPage;
                            $scope.search($scope.shipTo).then(function success(res) {
                                $scope.datalist.items = res.data;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsShipTo , soldToIndex);
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
                                    $scope.shipTo = $scope.shipTo || {};
                                    $scope.shipTo.currentPage = param.currentPage;
                                    $scope.shipTo.numPerPage = param.numPerPage;
                                    $scope.search($scope.shipTo).then(function success(res) {
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
