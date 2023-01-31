(function () {
    'use strict'
    app.directive('soldToOwnerPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/masterData/component/soldToOwnerPopup/soldToOwnerPopup/soldToOwnerPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'soldToOwnerPopupFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, soldToOwnerPopupFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = soldToOwnerPopupFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function () {
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
                            if (model.soldTo_Name != null && model.soldTo_Id == undefined) {
                                for (var i = 0; i <= item.length - 1; i++) {
                                    if (item[i].soldTo_Name == model.soldTo_Name) {
                                        model.soldTo_Id = item[i].soldTo_Id;
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
                                $scope.soldTo.soldTo_Id = null;
                            }if($scope.actionPS == "2"){
                                $scope.soldTo.soldTo_Name = null;
                            }
                        }

                        $scope.filterSearch = function () {    
                     
                            $scope.soldTo = $scope.soldTo || {};
                            $scope.searchFilter($scope.soldTo).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data.itemsSoldToPopup;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsSoldToPopup);
                            }, function error(res) { });
                        }
                        $scope.delegates.soldToOwnerPopup = function (param, index , listData) {
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
                            
                            model.listSoldToViewModel = $scope.dataItemList;
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
                            $scope.soldTo = $scope.soldTo || {};                           
                            $scope.soldTo.advanceSearch = true;
                            $scope.soldTo.currentPage = 0;
                            $scope.soldTo.numPerPage = $scope.model.numPerPage;
                            $scope.search($scope.soldTo).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data.itemsSoldToPopup;
                                if ($scope.datalist.delegates.set)
                                $scope.datalist.delegates.set(res.data.itemsSoldToPopup);
                            }, function error(res) { });
                        }
                        $scope.find = function (OwnerIndex) {
                            $scope.soldTo = {};
                            $scope.soldTo.key = $scope.model.key;
                            $scope.soldTo.advanceSearch = false;
                            $scope.soldTo.currentPage = 0;
                            $scope.soldTo.numPerPage = $scope.model.numPerPage;
                            $scope.search($scope.soldTo).then(function success(res) {
                                $scope.datalist.items = res.data.itemsSoldToPopup;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsSoldToPopup,OwnerIndex);
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
                                    $scope.soldTo = $scope.soldTo || {};
                                    $scope.soldTo.currentPage = param.currentPage;
                                    $scope.soldTo.numPerPage = param.numPerPage;
                                    $scope.search($scope.soldTo).then(function success(res) {
                                        $scope.datalist.config.paginations = res.data.pagination;
                                        $scope.datalist = res.data.itemsSoldToPopup;
                                        if ($scope.datalist.delegates.set)
                                            $scope.datalist.delegates.set(res.data.itemsSoldToPopup, res.data.pagination);
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
