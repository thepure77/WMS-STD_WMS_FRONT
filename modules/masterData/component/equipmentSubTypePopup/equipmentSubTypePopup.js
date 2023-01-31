
(function () {
    'use strict'
    app.directive('equipmentSubtypePopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/masterData/component/equipmentSubTypePopup/equipmentSubTypePopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'equipmentSubTypeFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, equipmentSubTypeFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = equipmentSubTypeFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            var param = {};
                            param.equipmentSubTypeIndex = "";
                            param.equipmentSubTypeId = "";
                            param.equipmentSubTypeName = "";
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
                        $scope.delegates.equipmentSubTypePopup = function (index) {
                            //$scope.dataset = angular.copy(param);
                            $scope.index = angular.copy(index);
                            $scope.findEquipment();
                        }
                        $scope.delegates.edit = function (index) { }
                        $scope.create = function () {
                            if ($scope.invokes.add != undefined)
                                $scope.invokes.add();
                        }
                        $scope.findEquipment = function (model) {
                            $scope.equipmentSubType = $scope.equipmentSubType || {};
                            $scope.equipmentSubType.advanceSearch = true;
                            $scope.equipmentSubType.currentPage = 1;
                            $scope.equipmentSubType.numPerPage = $scope.model.numPerPage;
                            $scope.equipmentSubType.equipmentSubTypeIndex = $scope.index;                        
                            $scope.search($scope.equipmentSubType).then(function success(res) {
                                if ($scope.datalist.delegates.set){
                                    if(res.data.itemsEquipmentSubType != undefined && res.data.itemsEquipmentSubType.length != 0 ){
                                        $scope.datalist.delegates.set(res.data.itemsEquipmentSubType, res.data.pagination);
                                    } 
                                    else {
                                        $scope.datalist.delegates.set(res.data);
                                    }
                                    
                                }
                                    
                            }, function error(res) { });
                        }
                        $scope.search = function (model) {                            
                            var deferred = $q.defer();                            
                            if (model.equipmentSubTypeIndex != "" && model.equipmentSubTypeIndex != null && model.equipmentSubTypeName == null) {
                                viewModel.getId(model.equipmentSubTypeIndex).then(
                                    function success(res) {
                                        deferred.resolve(res);
                                    },
                                    function error(response) {
                                        deferred.reject(response);
                                    });
                            }
                            else {
                                if (model.equipmentSubTypeName != null) {
                                    $scope.equipmentSubType = {};
                                }
                                viewModel.filter(model).then(
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
                            $scope.equipmentSubType = $scope.equipmentSubType || {};
                            $scope.equipmentSubType.advanceSearch = true;
                            $scope.equipmentSubType.currentPage = 0;
                            $scope.equipmentSubType.numPerPage = $scope.model.numPerPage;
                            $scope.search($scope.equipmentSubType).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data;
                                if ($scope.datalist.delegates.set)
                                $scope.datalist.delegates.set(res.data, );
                            }, function error(res) { });
                        }
                        $scope.find = function () {
                            $scope.equipmentSubType = $scope.equipmentSubType || {};
                            $scope.equipmentSubType.key = $scope.model.key;
                            $scope.equipmentSubType.advanceSearch = false;
                            $scope.equipmentSubType.currentPage = 0;
                            $scope.equipmentSubType.numPerPage = $scope.model.numPerPage;
                            $scope.search($scope.equipmentSubType).then(function success(res) {
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
                                    $scope.equipmentSubType = $scope.equipmentSubType || {};
                                    $scope.equipmentSubType.currentPage = param.currentPage;
                                    $scope.equipmentSubType.numPerPage = param.numPerPage;
                                    $scope.search($scope.equipmentSubType).then(function success(res) {
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
