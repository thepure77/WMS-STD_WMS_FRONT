
(function () {
    'use strict'
    app.directive('taskGrPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/component/Popup/previewTaskGrPopup/assignJob/taskGrPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'assignJobGrFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, assignJobGrFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = assignJobGrFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            var param = {};
                            param.planGoodsReceiveNo = "";
                            param.planGoodsReceiveIndex = "";
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
                        $scope.delegates.taskGrPopup = function (param) {
                            $scope.dataset = angular.copy(param);
                            $scope.find($scope.dataset);

                        }
                        $scope.delegates.edit = function (index) { }
                        $scope.create = function () {
                            if ($scope.invokes.add != undefined)
                                $scope.invokes.add();
                        }
                        $scope.search = function (model) {
                            var deferred = $q.defer();
                            var id = model.Chk;

                            viewModel.taskPopup(model).then(
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
                            $scope.task = model;

                            viewModel.taskPopup(model).then(
                                function success(res) {
                                    deferred.resolve(res);
                                },
                                function error(response) {
                                    deferred.reject(response);
                                });
                            return deferred.promise;
                        }

                        $scope.filterSearch = function () {
                            $scope.task = $scope.task || {};
                            $scope.searchFilter($scope.task).then(function success(res) {

                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data.itemsgi;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsgi, res.data.pagination);
                            }, function error(res) { });
                            // $scope.task = {};

                        }
                        $scope.filter = function () {
                            $scope.task = $scope.task || {};
                            $scope.task.Chk = $scope.index;
                            $scope.search($scope.task).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsgi, res.data.pagination);
                            }, function error(res) { });
                        }
                        $scope.find = function (data) {
                            $scope.task = $scope.task || {};
                            $scope.task.Chk = $scope.index;
                            $scope.task.goodsReceive_No = data.goodsReceive_No;
                            $scope.task.ref_Document_Index = data.goodsReceive_Index;
                            $scope.task.currentPage = 1;
                            $scope.task.taskGR_No = data.taskGR_No;
                            $scope.task.perPage = $scope.model.numPerPage;
                            $scope.search($scope.task).then(function success(res) {
                                $scope.dataset.create_Date = res.data[0].create_Date;
                                $scope.dataset.assign_By = res.data[0].assign_By;
                                $scope.dataset.userAssign = res.data[0].userAssign;
                                $scope.dataset.create_Time = res.data[0].create_Time;

                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data;
                                let dataList = $scope.datalist.items;

                                for (var i = 0; i <= dataList.length - 1; i++) {
                                    $scope.datalist.items[i].qty = parseFloat($scope.datalist.items[i].qty);
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
                                    $scope.task = $scope.task || {};
                                    $scope.task.currentPage = param.currentPage;
                                    $scope.task.perPage = param.numPerPage;
                                    $scope.searchFilter($scope.task).then(function success(res) {
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
