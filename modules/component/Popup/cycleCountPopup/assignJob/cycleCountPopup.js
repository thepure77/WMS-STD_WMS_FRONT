
(function () {
    'use strict'
app.directive('cycleCountPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
    return {
        restrict: 'E',
        controllerAs: '$ctrl',
        templateUrl: "modules/component/Popup/cycleCountPopup/assignJob/cycleCountPopup.html",
        scope: {
            onShow: '=',
            delegates: '=?',
            invokes: '=?',
            config: '=?'
        },
        controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'cycleCountPopupFactory','webServiceAPI',
            function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, cycleCountPopupFactory,webServiceAPI) {
                $scope.delegates = {};
                $scope.invokes = $scope.invokes || {};
                $scope.config = $scope.config || {};
                var viewModel = cycleCountPopupFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            var param = {};
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
                        $scope.delegates.cyclecountPopup = function (param, showchkbox) {
                            $scope.dataset = angular.copy(param);
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
                            $scope.cy = model;

                            viewModel.search(model).then(
                                function success(res) {
                                    deferred.resolve(res);
                                },
                                function error(response) {
                                    deferred.reject(response);
                                });
                            return deferred.promise;
                        }

                        $scope.filterSearch = function () {
                            $scope.cy = $scope.cy || {};
                            $scope.searchFilter($scope.cy).then(function success(res) {

                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data.itemsgi;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsgi, res.data.pagination);
                            }, function error(res) { });
                            // $scope.cy = {};

                        }
                        $scope.filter = function () {
                            $scope.cy = $scope.cy || {};
                            $scope.cy.Chk = $scope.index;
                            $scope.search($scope.cy).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data;                      
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsgi, res.data.pagination);
                            }, function error(res) { });
                        }
                        $scope.find = function (data) {
                            
                            $scope.cy = $scope.cy || {};
                            $scope.cy.Chk = $scope.index;
                            $scope.cy.cycleCount_No = data;
                            $scope.cy.currentPage = 1;
                            $scope.cy.perPage = $scope.model.numPerPage;

                            $scope.search($scope.cy).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
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
                                    $scope.cy = $scope.cy || {};
                                    $scope.cy.currentPage = param.currentPage;
                                    $scope.cy.perPage = param.numPerPage;
                                    $scope.searchFilter($scope.cy).then(function success(res) {
                                        if ($scope.datalist.delegates.set)
                                        $scope.datalist.delegates.set(res.data);
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

                        $scope.autoComplete = {
                            CycleCount_No: "AssignJob/autoCyclecountNo",
                        };
            
                        $scope.url = {
                            CY: webServiceAPI.Cyclecount,
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
