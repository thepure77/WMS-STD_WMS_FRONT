
(function () {
    'use strict'
    app.directive('planGrPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/GR/component/planGrPopup/planGrPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'planGoodsReceiveFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, planGoodsReceiveFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = planGoodsReceiveFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            var param = {};
                            param.planGoodsReceiveNo = "";
                            param.planGoodsReceiveIndex= "";
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
                            numPerPage: 30,
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
                        $scope.delegates.planGrPopup = function (param, index,documentTypeIndex,ownerIndex,showchkbox) {
                            $scope.dataset = angular.copy(param);
                            $scope.index = angular.copy(index);
                            $scope.documentTypeIndex = angular.copy(documentTypeIndex);
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
                                                
                            viewModel.search(model).then(
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
                            model.Chk = $scope.index;
                            $scope.planGr = model;
                            
                            viewModel.search(model).then(
                                function success(res) {                                                                       
                                    deferred.resolve(res);
                                },
                                function error(response) {
                                    deferred.reject(response);
                                });
                            return deferred.promise;
                        }

                        $scope.filterSearch = function (){                            
                            $scope.planGr = $scope.planGr || {};                            
                            $scope.searchFilter($scope.planGr).then(function success(res) {  
                                 
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data.itemsPlanGR;
                                if ($scope.datalist.delegates.set)
                                $scope.datalist.delegates.set(res.data.itemsPlanGR,res.data.pagination);
                            }, function error(res) { });
                            // $scope.planGr = {};
                             
                        }
                        $scope.filter = function () {
                            $scope.planGr = $scope.planGr || {};
                            $scope.planGr.Chk =  $scope.index;  
                            $scope.search($scope.planGr).then(function success(res) {                                   
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data.itemsPlanGR;
                                if ($scope.datalist.delegates.set)
                                $scope.datalist.delegates.set(res.data.itemsPlanGR,res.data.pagination);
                            }, function error(res) { });
                        }
                        $scope.find = function (data) {
                            $scope.planGr = $scope.planGr || {};
                            $scope.planGr.Chk =  $scope.index;  
                            $scope.planGr.planGoodsReceiveNo =  data;  
                            $scope.planGr.DocumentTypeIndex = $scope.documentTypeIndex;
                            $scope.planGr.currentPage = 1;                           
                            $scope.planGr.perPage = $scope.model.numPerPage;
                            $scope.planGr.ownerIndex = $scope.ownerIndex;
                            
                            $scope.search($scope.planGr).then(function success(res) {    
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data.itemsPlanGR;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsPlanGR,res.data.pagination,$scope.showchkbox);
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
                                    $scope.planGr = $scope.planGr || {};
                                    $scope.planGr.currentPage = param.currentPage;
                                    $scope.planGr.perPage = param.numPerPage;
                                    $scope.searchFilter($scope.planGr).then(function success(res) {                                                                         
                                        if ($scope.datalist.delegates.set)
                                            $scope.datalist.delegates.set(res.data.itemsPlanGR, res.data.pagination,$scope.showchkbox);
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
