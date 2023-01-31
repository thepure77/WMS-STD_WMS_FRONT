
(function () {
    'use strict'
    app.directive('provincePopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/masterData/component/provincePopup/provincePopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'provinceFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, provinceFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        $scope.config.paginations = $scope.config.paginations || {};
                        $scope.config.paginations.currentPage = $scope.config.paginations.currentPage || 1;
                        $scope.config.paginations.numPerPage = $scope.config.paginations.numPerPage || 10;
                        var viewModel = provinceFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            var param = {};
                            param.provinceIndex = "";
                            param.provinceId = "";
                            param.provinceName = "";
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
                        $scope.delegates.provincePopup = function (index) {
                            //$scope.dataset = angular.copy(param);
                            $scope.index = angular.copy(index);
                            $scope.find();
                        }
                        $scope.delegates.edit = function (index) { }
                        $scope.create = function () {
                            if ($scope.invokes.add != undefined)
                                $scope.invokes.add();
                        }
                        $scope.search = function (model) {
                            var deferred = $q.defer();
                            if (model.provinceIndex != "" && model.provinceIndex != null) {
                                viewModel.getId(model.provinceIndex).then(
                                    function success(res) {
                                        deferred.resolve(res);
                                    },
                                    function error(response) {
                                        deferred.reject(response);
                                    });
                            }
                            else {
                                if(model.provinceName != null){
                                    $scope.province = {};
                                }
                                viewModel.getProvince(model).then(
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
                            $scope.province = $scope.province || {};                            
                            $scope.province.advanceSearch = true;
                            $scope.province.currentPage = 1;
                            $scope.province.numPerPage = $scope.model.numPerPage;  
                            $scope.province.provinceName = $scope.province.provinceName;                        
                            $scope.search($scope.province).then(function success(res) {                                
                                if ($scope.datalist.delegates.set)
                                $scope.datalist.delegates.set(res.data.itemsProvince, res.data.pagination);                                           
                            }, function error(res) { });
                        }
                        $scope.find = function () {
                            $scope.province = $scope.province || {};
                            $scope.province.key = $scope.model.key;
                            $scope.province.advanceSearch = false;
                            $scope.province.currentPage = 1;
                            $scope.province.numPerPage = $scope.model.numPerPage;
                            viewModel.filter($scope.province).then(function success(res) {                            
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
                                paginations: {
                                    currentPage: $scope.model.currentPage,
                                    numPerPage: $scope.model.numPerPage,
                                },
                            },
                            items: {},
                            invokes: {
                                page: function (param) {
                                    $scope.province = $scope.province || {};
                                    $scope.province.currentPage = param.currentPage;
                                    $scope.province.numPerPage = param.numPerPage;                                    
                                    viewModel.getProvince($scope.province).then(function success(res) {
                                        if ($scope.datalist.delegates.set)
                                            $scope.datalist.delegates.set(res.data.itemsProvince, res.data.pagination);
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
                        $scope.model = {
                            currentPage: 1,
                            numPerPage: 30,
                            totalRow: 0,
                            advanceSearch: false
                        };
                        $scope.pageOption = [{
                            'value': 30
                        }, {
                            'value': 50
                        },
                        {
                            'value': 100
                        },
                        {
                            'value': 500
                        },
                        ];                        
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
