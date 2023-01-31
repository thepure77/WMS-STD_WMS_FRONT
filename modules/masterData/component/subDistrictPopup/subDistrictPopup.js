
(function () {
    'use strict'
    app.directive('subDistrictPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/masterData/component/subDistrictPopup/subDistrictPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'subDistrictFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, subDistrictFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = subDistrictFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            var param = {};
                            param.subDistrictIndex = "";
                            param.subDistrictId = "";
                            param.subDistrictName = "";
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
                        $scope.delegates.subDistrictPopup = function (index) {
                            //$scope.dataset = angular.copy(param);
                            $scope.index = angular.copy(index);
                            $scope.findDistruct();
                        }

                        $scope.findDistruct = function (model) {
                            $scope.subDistrict = $scope.district || {};
                            $scope.subDistrict.advanceSearch = true;
                            $scope.subDistrict.currentPage = 1;
                            $scope.subDistrict.numPerPage = $scope.model.numPerPage;
                            $scope.subDistrict.districtIndex = $scope.index;
                            $scope.search($scope.subDistrict).then(function success(res) {                                                             
                                if ($scope.datalist.delegates.set){
                                    if(res.data.itemsSubDistrict != undefined && res.data.itemsSubDistrict != 0  ){
                                        $scope.datalist.delegates.set(res.data.itemsSubDistrict, res.data.pagination);
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
                            if (model.districtIndex != "" && model.districtIndex != null && model.subDistrictName == null) {
                                viewModel.getId(model.districtIndex).then(
                                    function success(res) {
                                        deferred.resolve(res);
                                    },
                                    function error(response) {
                                        deferred.reject(response);
                                    });
                            }
                            else {
                                if (model.subDistrictName != null) {
                                    $scope.subDistrict = {};
                                }
                                viewModel.getSubDistrict(model).then(
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
                            $scope.subDistrict = $scope.subDistrict || {};
                            $scope.subDistrict.advanceSearch = true;
                            $scope.subDistrict.currentPage = 1;
                            $scope.subDistrict.numPerPage = $scope.model.numPerPage;
                            $scope.subDistrict.subDistrictName = $scope.subDistrict.subDistrictName;
                            $scope.search($scope.subDistrict).then(function success(res) {
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsSubDistrict, res.data.pagination);
                            }, function error(res) { });
                        }
                        $scope.find = function () {
                            $scope.subDistrict = $scope.subDistrict || {};
                            $scope.subDistrict.key = $scope.model.key;
                            $scope.subDistrict.advanceSearch = false;
                            $scope.subDistrict.currentPage = 1;
                            $scope.subDistrict.numPerPage = $scope.model.numPerPage;
                            viewModel.filter($scope.subDistrict).then(function success(res) {                                
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
                                    $scope.subDistrict = $scope.subDistrict || {};
                                    $scope.subDistrict.currentPage = param.currentPage;
                                    $scope.subDistrict.numPerPage = param.numPerPage;
                                    viewModel.getSubDistrict($scope.subDistrict).then(function success(res) {
                                        if ($scope.datalist.delegates.set)
                                            $scope.datalist.delegates.set(res.data.itemsSubDistrict, res.data.pagination);
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
