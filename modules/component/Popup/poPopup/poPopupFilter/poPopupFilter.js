
(function () {
    'use strict'
    app.directive('poPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/component/Popup/poPopup/poPopupFilter/poPopupFilter.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'poPopupFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, poPopupFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = poPopupFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            var param = {};
                            param.purchaseOrder_No = "";
                            param.purchaseOrder_Index = "";
                            // param.vendorName = "";
                            $scope.invokes.selected(param);
                            $scope.onShow = false;
                        };
                        $scope.$watchCollection('onShow', function (newVal, oldVal) {
                            if (newVal !== oldVal) {
                            }
                        });
                        $scope.model = {
                            currentPage: 0,
                            numPerPage: 10,
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
                        $scope.delegates.poPopup = function (param, ownerIndex, showchkbox) {
                            $scope.dataset = angular.copy(param);
                            $scope.ownerIndex = angular.copy(ownerIndex);
                            $scope.showchkbox = showchkbox;
                            $scope.find();

                        }
                        $scope.delegates.edit = function (index) { }
                        $scope.create = function () {
                            if ($scope.invokes.add != undefined)
                                $scope.invokes.add();
                        }
                        $scope.search = function (model) {
                            var deferred = $q.defer();
                            var id = model.Chk;
                            pageLoading.show();
                            viewModel.search(model).then(
                                function success(res) {
                                    pageLoading.hide();
                                    deferred.resolve(res);
                                },
                                function error(response) {
                                    pageLoading.hide();
                                    deferred.reject(response);
                                });
                            return deferred.promise;
                        }
                        $scope.searchFilter = function (model) {
                            var deferred = $q.defer();
                            model.Chk = $scope.index;
                            $scope.popupPo = model;
                            pageLoading.show();
                            viewModel.search(model).then(
                                function success(res) {
                                    pageLoading.hide();
                                    deferred.resolve(res);
                                },
                                function error(response) {
                                    pageLoading.hide();
                                    deferred.reject(response);
                                });
                            return deferred.promise;
                        }

                        $scope.filterSearch = function () {
                            $scope.popupPo = $scope.popupPo || {};
                            $scope.searchFilter($scope.popupPo).then(function success(res) {

                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data.itemsPlanPO;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsPlanPO, res.data.pagination);
                            }, function error(res) { });
                            // $scope.planGr = {};

                        }
                        $scope.filter = function () {
                            $scope.popupPo = $scope.planPo || {};
                            $scope.popupPo.Chk = $scope.index;
                            $scope.search($scope.popupPo).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data.itemsPlanPO;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsPlanPO, res.data.pagination);
                            }, function error(res) { });
                        }
                        $scope.find = function (data) {
                            
                            $scope.popupPo = $scope.popupPo || {};
                            $scope.popupPo.Chk = $scope.index;
                            $scope.popupPo.purchaseOrder_No = data;
                            $scope.popupPo.DocumentType_Index = $scope.documentTypeIndex;
                            $scope.popupPo.currentPage = 1;
                            $scope.popupPo.perPage = $scope.model.numPerPage;
                            $scope.popupPo.owner_Index = $scope.ownerIndex;

                            $scope.search($scope.popupPo).then(function success(res) {
                                
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data.itemsPlanPO;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsPlanPO, res.data.pagination, $scope.showchkbox);
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
                                    $scope.popupPo = $scope.popupPo || {};
                                    $scope.popupPo.currentPage = param.currentPage;
                                    $scope.popupPo.perPage = param.numPerPage;
                                    
                                    $scope.searchFilter($scope.popupPo).then(function success(res) {
                                        
                                        if ($scope.datalist.delegates.set)
                                            $scope.datalist.delegates.set(res.data.itemsPlanPO, res.data.pagination, $scope.showchkbox);
                                    }, function error(res) {});
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
