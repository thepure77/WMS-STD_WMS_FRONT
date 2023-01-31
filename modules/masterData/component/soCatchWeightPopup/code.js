
(function () {
    'use strict'
    app.directive('soCatchWeightPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/masterData/component/soCatchWeightPopup/view.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$q', 'PickManualFactory',
                    function ($scope, $q, PickManualFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = PickManualFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            // var param = {};
                            // param.ownerIndex = "";
                            // param.ownerId = "";
                            // param.ownerName = "";
                            // $scope.invokes.selected(param);
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
                        $scope.delegates.filter = function (param) {
                            $scope.filter(param);
                        }
                        $scope.filter = function (param) {
                            
                            var m = $scope.item || {};

                            if (param != undefined)
                                m = param;

                            m.advanceSearch = true;
                            m.currentPage = 0;
                            m.numPerPage = $scope.model.numPerPage;

                            
                            viewModel.filterSOCatchWeight(m).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data;
                                $scope.datalist.config.title = $scope.config.title;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data);
                            }, function error(res) { });
                        }






                        $scope.delegates.ownerPopup = function (param, index) {
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
                            viewModel.popupSearch(model).then(
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
                            viewModel.popupSearch(model).then(
                                function success(res) {
                                    deferred.resolve(res);
                                },
                                function error(response) {
                                    deferred.reject(response);
                                });
                            return deferred.promise;
                        }

                        $scope.filterSearch = function () {
                            $scope.owner = $scope.owner || {};
                            $scope.searchFilter($scope.owner).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data);
                            }, function error(res) { });
                        }
                       
                        $scope.find = function () {
                            $scope.owner = $scope.owner || {};
                            $scope.owner.key = $scope.model.key;
                            $scope.owner.advanceSearch = false;
                            $scope.owner.currentPage = 0;
                            $scope.owner.numPerPage = $scope.model.numPerPage;
                            $scope.owner.ownerName = $scope.index;
                            $scope.actionPS = '2';
                            $scope.search($scope.owner).then(function success(res) {
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
                                    $scope.owner = $scope.owner || {};
                                    $scope.owner.currentPage = param.currentPage;
                                    $scope.owner.numPerPage = param.numPerPage;
                                    $scope.search($scope.owner).then(function success(res) {
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
                                selected: function (param, mode) {
                                    if ($scope.invokes.selected != undefined)
                                        $scope.invokes.selected(param, mode);
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
