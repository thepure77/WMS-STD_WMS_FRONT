
(function () {
    'use strict'
    app.directive('documentTypePopupPlan', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/component/Popup/documentTypePopup/PlanGR/documentTypePopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'documentTypePlanFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, documentTypePlanFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = documentTypePlanFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                            $scope.documentType = {};
                        };
                        $scope.onClose = function (param) {
                            var param = {};
                            param.documentTypeIndex = "";
                            param.documentTypeId = "";
                            param.documentTypeName = "";
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
                        $scope.delegates.documentTypePopup = function (param, index,chk) {
                            $scope.dataset = angular.copy(param);
                            $scope.index = angular.copy(index);
                            $scope.chk = angular.copy(chk);
                            $scope.find();
                        }
                        $scope.delegates.edit = function (index) { }
                        $scope.create = function () {
                            if ($scope.invokes.add != undefined)
                                $scope.invokes.add();
                        }
                        $scope.search = function (model) {
                            var deferred = $q.defer();                           
                            model.chk = $scope.chk;
                            viewModel.popupPlanGRSearch(model).then(
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
                            viewModel.popupPlanGRSearch(model).then(
                                function success(res) {
                                    deferred.resolve(res);
                                    
                                },
                                function error(response) {
                                    deferred.reject(response);
                                });
                            return deferred.promise;
                        }

                        $scope.filterSearch = function (){
                            $scope.documentType = $scope.documentType || {};
                            $scope.searchFilter($scope.documentType).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data;
                                if ($scope.datalist.delegates.set)
                                $scope.datalist.delegates.set(res.data);
                            }, function error(res) { });
                        }
                        $scope.filter = function () {
                            $scope.documentType = $scope.documentType || {};
                            $scope.documentType.advanceSearch = true;
                            $scope.documentType.currentPage = 0;
                            $scope.documentType.numPerPage = $scope.model.numPerPage;
                            $scope.search($scope.documentType).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data;
                                if ($scope.datalist.delegates.set)
                                $scope.datalist.delegates.set(res.data, );
                            }, function error(res) { });
                        }
                        $scope.find = function () {
                            $scope.documentType = $scope.documentType || {};
                            $scope.documentType.key = $scope.model.key;
                            $scope.documentType.advanceSearch = false;
                            $scope.documentType.currentPage = 0;
                            $scope.documentType.numPerPage = $scope.model.numPerPage;
                            $scope.documentType.documentTypeName = $scope.index;
                            $scope.actionPS = '2';
                            $scope.search($scope.documentType).then(function success(res) {
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
                                    $scope.documentType = $scope.documentType || {};
                                    $scope.documentType.currentPage = param.currentPage;
                                    $scope.documentType.numPerPage = param.numPerPage;
                                    $scope.search($scope.documentType).then(function success(res) {
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
