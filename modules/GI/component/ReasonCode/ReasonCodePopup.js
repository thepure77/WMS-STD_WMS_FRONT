
(function () {
    'use strict'
    app.directive('reasonCodePopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/GI/component/ReasonCode/ReasonCodePopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'reasonCodeGiFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, reasonCodeGiFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = reasonCodeGiFactory;

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
                        $scope.delegates.reasonCodePopup = function (param, index) {

                            $scope.dataset = angular.copy(param);
                            $scope.index = angular.copy(index);
                            $scope.findCallCenter();
                        }
                        $scope.delegates.reasonCodeMaPopup = function (param, index) {

                            $scope.dataset = angular.copy(param);
                            $scope.index = angular.copy(index);
                            $scope.findMarShall();
                        }

                        $scope.searchCallCenter = function (model) {

                            var deferred = $q.defer();
                            viewModel.filterCallcenter(model).then(
                                function success(res) {

                                    deferred.resolve(res);
                                },
                                function error(response) {
                                    deferred.reject(response);
                                });
                            return deferred.promise;
                        }

                        $scope.searchMarShall = function (model) {

                            var deferred = $q.defer();
                            viewModel.filterMarshall(model).then(
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




                        $scope.findCallCenter = function () {
                            $scope.reasonCode = $scope.reasonCode || {};
                            $scope.reasonCode.Chk = $scope.index;
                            $scope.searchCallCenter($scope.reasonCode.Chk).then(function success(res) {
                                $scope.datalist.items = res.data;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data);
                            }, function error(res) { });
                        };
                        $scope.findMarShall = function () {
                            $scope.reasonCode = $scope.reasonCode || {};
                            $scope.reasonCode.Chk = $scope.index;
                            $scope.searchMarShall($scope.reasonCode.Chk).then(function success(res) {
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
                                    $scope.reasonCode = $scope.reasonCode || {};
                                    $scope.reasonCode.currentPage = param.currentPage;
                                    $scope.reasonCode.numPerPage = param.numPerPage;
                                    $scope.search($scope.reasonCode).then(function success(res) {
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
                                selected: function (param, model) {
                                    if ($scope.invokes.selected != undefined)
                                        $scope.invokes.selected(param, model);
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
