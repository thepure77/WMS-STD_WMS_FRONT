
(function () {
    'use strict'
    app.directive('postcodePopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/masterData/component/postcodePopup/postcodePopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'postcodeFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, postcodeFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = postcodeFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            var param = {};
                            param.postcodeIndex = "";
                            param.postcodeId = "";
                            param.postcodeName = "";
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
                        $scope.delegates.postcodePopup = function (index) {
                            //$scope.dataset = angular.copy(param);
                            $scope.index = angular.copy(index);
                            $scope.findsubDistruct();
                        }

                        $scope.findsubDistruct = function (model) {
                            $scope.postcode = $scope.district || {};
                            $scope.postcode.advanceSearch = true;
                            $scope.postcode.currentPage = 1;
                            $scope.postcode.numPerPage = $scope.model.numPerPage;
                            $scope.postcode.subDistrictIndex = $scope.index;
                            $scope.search($scope.postcode).then(function success(res) {
                                if ($scope.datalist.delegates.set){
                                    if(res.data.itemsPostcode != undefined && res.data.itemsPostcode.length != 0){
                                        $scope.datalist.delegates.set(res.data.itemsPostcode, res.data.pagination);
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
                        $scope.search = function (model) {
                            var deferred = $q.defer();
                            if (model.subDistrictIndex != "" && model.subDistrictIndex != null && model.postcodeName) {
                                viewModel.getId(model.subDistrictIndex).then(
                                    function success(res) {
                                        deferred.resolve(res);
                                    },
                                    function error(response) {
                                        deferred.reject(response);
                                    });
                            }
                            else {
                                if (model.postcodeName != null) {
                                    $scope.postcode = {};
                                }
                                viewModel.getPostcode(model).then(
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
                            $scope.postcode = $scope.postcode || {};
                            $scope.postcode.advanceSearch = true;
                            $scope.postcode.currentPage = 1;
                            $scope.postcode.numPerPage = $scope.model.numPerPage;
                            $scope.postcode.postcodeName = $scope.postcode.postcodeName;
                            $scope.search($scope.postcode).then(function success(res) {
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsPostcode, res.data.pagination);
                            }, function error(res) { });
                        }
                        $scope.find = function () {
                            $scope.postcode = $scope.postcode || {};
                            $scope.postcode.key = $scope.model.key;
                            $scope.postcode.advanceSearch = false;
                            $scope.postcode.currentPage = 1;
                            $scope.postcode.numPerPage = $scope.model.numPerPage;
                            viewModel.filter($scope.postcode).then(function success(res) {
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
                                    $scope.postcode = $scope.postcode || {};
                                    $scope.postcode.currentPage = param.currentPage;
                                    $scope.postcode.numPerPage = param.numPerPage;
                                    viewModel.getPostcode($scope.postcode).then(function success(res) {
                                        if ($scope.datalist.delegates.set)
                                            $scope.datalist.delegates.set(res.data.itemsPostcode, res.data.pagination);
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
