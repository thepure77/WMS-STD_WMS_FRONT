
(function () {
    'use strict'
    app.directive('districtPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/masterData/component/districtPopup/districtPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'districtFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, districtFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = districtFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            var param = {};
                            param.districtIndex = "";
                            param.districtId = "";
                            param.districtName = "";
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
                        $scope.delegates.districtPopup = function (index) {
                            //$scope.dataset = angular.copy(param);
                            $scope.index = angular.copy(index);
                            $scope.findDistruct();
                        }

                        $scope.findDistruct = function (model) {
                            $scope.district = $scope.district || {};
                            $scope.district.advanceSearch = true;
                            $scope.district.currentPage = 1;
                            $scope.district.numPerPage = $scope.model.numPerPage;
                            $scope.district.provinceIndex = $scope.index;                        
                            $scope.search($scope.district).then(function success(res) {
                                if ($scope.datalist.delegates.set){
                                    if(res.data.itemsDistrict != undefined && res.data.itemsDistrict.length != 0 ){
                                        $scope.datalist.delegates.set(res.data.itemsDistrict, res.data.pagination);
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
                            if (model.provinceIndex != "" && model.provinceIndex != null && model.districtName == null) {
                                viewModel.getId(model.provinceIndex).then(
                                    function success(res) {
                                        deferred.resolve(res);
                                    },
                                    function error(response) {
                                        deferred.reject(response);
                                    });
                            }
                            else {
                                if (model.districtName != null) {
                                    $scope.district = {};
                                }
                                viewModel.getDistrict(model).then(
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
                            $scope.district = $scope.district || {};
                            $scope.district.advanceSearch = true;
                            $scope.district.currentPage = 1;
                            $scope.district.numPerPage = $scope.model.numPerPage;
                            $scope.district.districtName = $scope.district.districtName;
                            $scope.search($scope.district).then(function success(res) {
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsDistrict, res.data.pagination);
                            }, function error(res) { });
                        }
                        $scope.find = function () {
                            $scope.district = $scope.district || {};
                            $scope.district.key = $scope.model.key;
                            $scope.district.advanceSearch = false;
                            $scope.district.currentPage = 1;
                            $scope.district.numPerPage = $scope.model.numPerPage;
                            viewModel.filter($scope.district).then(function success(res) {
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
                                    $scope.district = $scope.district || {};
                                    $scope.district.currentPage = param.currentPage;
                                    $scope.district.numPerPage = param.numPerPage;
                                    viewModel.getDistrict($scope.district).then(function success(res) {
                                        if ($scope.datalist.delegates.set)
                                            $scope.datalist.delegates.set(res.data.itemsDistrict, res.data.pagination);
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
