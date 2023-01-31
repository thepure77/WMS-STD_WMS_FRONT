(function () {
    'use strict'
    app.directive('workAreaPopupV2', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/masterData/component/workAreaPopupV2/workAreaPopupV2.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'workAreaPopupV2Factory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, workAreaPopupV2Factory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = workAreaPopupV2Factory;

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
                            if (model.workArea_Id != null && model.workArea_Id == undefined) {
                                for (var i = 0; i <= item.length - 1; i++) {
                                    if (item[i].workArea_Name == model.workArea_Name) {
                                        model.workArea_Id = item[i].workArea_Id;
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
                                $scope.workArea.workArea_Id = null;
                            }if($scope.actionPS == "2"){
                                $scope.workArea.workArea_Name = null;
                            }
                        }

                        $scope.filterSearch = function () {    
                     
                            $scope.workArea = $scope.workArea || {};
                            $scope.searchFilter($scope.workArea).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data.itemsWorkArea;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsWorkArea);
                            }, function error(res) { });
                        }
                        $scope.delegates.locationWorkAreaPopup = function (param, index ) {
                            $scope.LocationIndex = angular.copy(index);
                            $scope.dataItemList = param;
                            $scope.dataset = angular.copy(param);
                            $scope.index = angular.copy(index);
                            $scope.find($scope.LocationIndex ,$scope.dataItemList);
                        }
                        $scope.delegates.edit = function (index) { }
                        $scope.create = function () {
                            if ($scope.invokes.add != undefined)
                                $scope.invokes.add();
                        }
                        $scope.search = function (model) {
                            
                            model.listWorkAreaViewModel = $scope.dataItemList;
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
                            $scope.workArea = $scope.workArea || {};                           
                            $scope.workArea.advanceSearch = true;
                            $scope.workArea.currentPage = 0;
                            $scope.workArea.numPerPage = $scope.model.numPerPage;
                            $scope.search($scope.workArea).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data.itemsWorkArea;
                                if ($scope.datalist.delegates.set)
                                $scope.datalist.delegates.set(res.data.itemsWorkArea);
                            }, function error(res) { });
                        }
                        $scope.find = function (index,param) {
                            $scope.workArea = {};
                            $scope.workArea.key = $scope.model.key;
                            $scope.workArea.advanceSearch = false;
                            $scope.workArea.currentPage = 0;
                            $scope.workArea.listWorkAreaViewModel = param;
                            $scope.workArea.numPerPage = $scope.model.numPerPage;
                            $scope.search($scope.workArea).then(function success(res) {
                                console.log(res.data)
                                $scope.datalist.items = res.data.itemsWorkArea;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsWorkArea,index);
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
                                    $scope.workArea = $scope.workArea || {};
                                    $scope.workArea.currentPage = param.currentPage;
                                    $scope.workArea.numPerPage = param.numPerPage;
                                    $scope.search($scope.workArea).then(function success(res) {
                                        $scope.datalist.config.paginations = res.data.pagination;
                                        $scope.datalist = res.data.itemsWorkArea;
                                        if ($scope.datalist.delegates.set)
                                            $scope.datalist.delegates.set(res.data.itemsWorkArea, res.data.pagination);
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
