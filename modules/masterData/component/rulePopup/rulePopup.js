
(function () {
    'use strict'
    app.directive('rulePopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/masterData/component/rulePopup/rulePopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'rulePopupFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, rulePopupFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = rulePopupFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            var param = {};
                            param.rule_Index = "",
                            param.rule_Id = "",
                            param.rule_Name = "";
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
                            if (model.rule_Name != null && model.rule_Id == undefined  ) {
                                for (var i = 0; i <= item.length - 1; i++) {
                                    if (item[i].rule_Name == model.rule_Name) {
                                        model.rule_Id = item[i].rule_Id;
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
                                $scope.rule.rule_Name = null;
                            }if($scope.actionPS == "2"){
                                $scope.rule.rule_Id = null;
                            }
                        }
                        $scope.filterSearch = function () {                            
                            $scope.rule = $scope.rule || {};
                            $scope.searchFilter($scope.rule).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data;
                                $scope.rule={};
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data);
                            }, function error(res) { });
                        }
                        $scope.delegates.rulePopup = function (param, index) {
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
                            $scope.rule = $scope.rule || {};
                            $scope.rule.advanceSearch = true;
                            $scope.rule.currentPage = 0;
                            $scope.rule.numPerPage = $scope.model.numPerPage;
                            $scope.search($scope.rule).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data;
                                if ($scope.datalist.delegates.set)
                                $scope.datalist.delegates.set(res.data, );
                            }, function error(res) { });
                        }
                        $scope.find = function () {
                            $scope.rule = {};
                            $scope.rule.key = $scope.model.key;
                            $scope.rule.advanceSearch = false;
                            $scope.rule.currentPage = 0;
                            $scope.rule.numPerPage = $scope.model.numPerPage;
                            $scope.search($scope.rule).then(function success(res) {
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
                                    $scope.rule = $scope.rule || {};
                                    $scope.rule.currentPage = param.currentPage;
                                    $scope.rule.numPerPage = param.numPerPage;
                                    $scope.search($scope.rule).then(function success(res) {
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
