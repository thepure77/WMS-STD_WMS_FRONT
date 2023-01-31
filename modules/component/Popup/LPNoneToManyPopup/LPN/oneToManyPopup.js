
(function () {
    'use strict'
    app.directive('oneToManyPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/component/Popup/LPNoneToManyPopup/LPN/oneToManyPopup.html",
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
                        //var viewModel = reasonCodeGiFactory;
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
                        $scope.delegates.oneToManyPopup = function (param, index) {
                            
                            $scope.model = {};
                            $scope.dataset = angular.copy(param);
                            $scope.index = angular.copy(index);

                            for (let index = 0; index <  param.items.length; index++) {
                                if(param.items[index].isCheck == true)
                                {
                                    $scope.model.Qty = $scope.dataset.items[index].qty;
                                    $scope.model.Weight = $scope.dataset.items[index].weight;
                                    $scope.model.Volume = $scope.dataset.items[index].volume;
                                    $scope.datalist.items = $scope.model;
                                    if ($scope.datalist.delegates.set)
                                        $scope.datalist.delegates.set($scope.model);
                                }
                            }
                            
                                

                            //$scope.findCallCenter();
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

                        $scope.datalist = {
                            delegates: {},
                            // config: {
                            //     paginations: {},
                            //     currentPage: $scope.model.currentPage,
                            //     numPerPage: $scope.model.numPerPage,
                            //     totalRow: 0,
                            // },
                            items: {},
                            invokes: {
                                page: function (param) {
                                    if ($scope.datalist.delegates.set)
                                        $scope.datalist.delegates.set($scope.model);
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
