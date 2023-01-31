
(function () {
    'use strict'
    app.directive('ruleConditionFieldPopup2', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/masterData/component/ruleConditionFieldPopup2/ruleConditionFieldPopup2.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'ruleConditionFieldPopupFactory2',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, ruleConditionFieldPopupFactory2) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = ruleConditionFieldPopupFactory2;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            var param = {};
                            param.ruleConditionField_Index = "",
                            param.ruleConditionField_Name = "";
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
                        $scope.searchFilter = function (model) {
                            var deferred = $q.defer();                            
                            let item = $scope.datalist.items;
                            if (model.ruleConditionField_Name != null && model.ruleConditionField_Name == undefined  ) {
                                for (var i = 0; i <= item.length - 1; i++) {
                                    if (item[i].ruleConditionField_Name == model.ruleConditionField_Name) {
                                        model.ruleConditionField_Name = item[i].ruleConditionField_Name;
                                    }
                                };
                            } 
                            // else if (model.process_Name != null && model.process_Id == undefined  ) {
                            //     for (var i = 0; i <= item.length - 1; i++) {
                            //         if (item[i].process_Name == model.process_Name) {
                            //             model.process_Id = item[i].process_Id;
                            //         }
                            //     };
                            // }
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
                                $scope.ruleConditionField.ruleConditionField_Name = null;
                            }if($scope.actionPS == "2"){
                                $scope.ruleConditionField.process_Name = null;
                            }
                        }
                        $scope.filterSearch = function () {                 
                            $scope.ruleConditionField = $scope.ruleConditionField || {};
                            $scope.searchFilter($scope.ruleConditionField).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data;
                                for(let el of res.data){
                                    if(el.isSort == 0){
                                        el.isSort = "NO"
                                    } else {
                                        el.isSort = "YES"
                                    }
                                }
                                for (let r of res.data){
                                    if(r.isSearch == 0){
                                        r.isSearch = "NO"
                                    } else {
                                        r.isSearch = "YES"
                                    }
                                }
                                $scope.ruleConditionField={};
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data);
                            }, function error(res) { });
                        }
                        $scope.delegates.ruleConditionFieldPopup2 = function (param, index) {
                            $scope.dataset = angular.copy(param);
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
                            $scope.ruleConditionField = $scope.ruleConditionField || {};
                            $scope.ruleConditionField.advanceSearch = true;
                            $scope.ruleConditionField.currentPage = 0;
                            $scope.ruleConditionField.numPerPage = $scope.model.numPerPage;
                            $scope.search($scope.ruleConditionField).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data;
                                if ($scope.datalist.delegates.set)
                                $scope.datalist.delegates.set(res.data, );
                            }, function error(res) { });
                        }
                        $scope.find = function () {
                            $scope.ruleConditionField = {};
                            $scope.ruleConditionField.key = $scope.model.key;
                            $scope.ruleConditionField.advanceSearch = false;
                            $scope.ruleConditionField.currentPage = 0;
                            $scope.ruleConditionField.numPerPage = $scope.model.numPerPage;
                            $scope.search($scope.ruleConditionField).then(function success(res) {
                                $scope.datalist.items = res.data;
                                for(let el of res.data){
                                    if(el.isSort == 0){
                                        el.isSort = "NO"
                                    } else {
                                        el.isSort = "YES"
                                    }
                                }
                                for (let r of res.data){
                                    if(r.isSearch == 0){
                                        r.isSearch = "NO"
                                    } else {
                                        r.isSearch = "YES"
                                    }
                                }
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
                                    $scope.ruleConditionField = $scope.ruleConditionField || {};
                                    $scope.ruleConditionField.currentPage = param.currentPage;
                                    $scope.ruleConditionField.numPerPage = param.numPerPage;
                                    $scope.search($scope.ruleConditionField).then(function success(res) {
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
