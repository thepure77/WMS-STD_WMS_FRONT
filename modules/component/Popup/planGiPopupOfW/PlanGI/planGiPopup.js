
(function () {
    'use strict'
    app.directive('planGiPopupOfW', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/component/Popup/planGiPopupOfW/PlanGI/planGiPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'goodIssueFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, goodIssueFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = goodIssueFactory;
                        $scope.planGi = {};
                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            $scope.onShow = false;
                        };
                        $scope.$watchCollection('onShow', function (newVal, oldVal) {
                            if (newVal !== oldVal) {
                            }
                        });
                        $scope.model = {
                            currentPage: 0,
                            numPerPage: 100,
                            totalRow: 1,
                            key: '',
                            advanceSearch: false
                        };
                        $scope.toggleSearch = function () {
                            $scope.model.advanceSearch = $scope.model.advanceSearch === false ? true : false;
                        };
                        $scope.delegates.search = function () {
                            $scope.filter();
                        }
                        $scope.delegates.planGiPopup = function (param, owner) {
                            $scope.documentTypeName = angular.copy(param);

                            $scope.actionPS = "1";
                            $scope.planGi = angular.copy(owner) || {};
                            $scope.planGi.planGoodsIssue_Due_Date = getToday()
                            $scope.filter();
                        }
                        $scope.delegates.edit = function (index) { }
                        $scope.create = function () {
                            if ($scope.invokes.add != undefined)
                                $scope.invokes.add();
                        }

                        $scope.filter = function () {
                            pageLoading.show();
                            $scope.planGi = $scope.planGi || {};
                            $scope.planGi.chk = $scope.index;
                            $scope.planGi.currentPage = 1;
                            $scope.planGi.perPage = 8;
                            if ($scope.documentTypeName.documentType_Index != "d7c596e9-bdff-4759-91db-fcec709e16b8") {
                                viewModel.PopupGIRunWave($scope.planGi).then(function success(res) {
                                    pageLoading.hide();
                                    $scope.datalist.config.paginations = res.data.pagination;
                                    $scope.datalist.items = res.data.items;
                                    if ($scope.datalist.delegates.set)
                                        $scope.datalist.delegates.set(res.data.items, res.data.pagination, $scope.documentTypeName);
                                }, function error(res) { });
                            }
                            else {
                                viewModel.PopupBomRunWave($scope.planGi).then(function success(res) {
                                    pageLoading.hide();
                                    $scope.datalist.config.paginations = res.data.pagination;
                                    $scope.datalist.items = res.data.items;
                                    if ($scope.datalist.delegates.set)
                                        $scope.datalist.delegates.set(res.data.items, res.data.pagination, $scope.documentTypeName);
                                }, function error(res) { });
                            }
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
                                    $scope.planGi = $scope.planGi || {};
                                    $scope.planGi.currentPage = param.currentPage;
                                    $scope.planGi.perPage = param.numPerPage;

                                    viewModel.PopupGIRunWave($scope.planGi).then(function success(res) {

                                        if ($scope.datalist.delegates.set)
                                            $scope.datalist.delegates.set(res.data.items, res.data.pagination);
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
                                },
                                confirm: function (param) {
                                    let items = param.filter(c => c.selected);
                                    if ($scope.invokes.selected)
                                        $scope.invokes.selected(items);
                                    $scope.onShow = false;
                                }
                            }
                        };

                        $scope.confirm = function () {
                            if ($scope.datalist.delegates.selected)
                                $scope.datalist.delegates.selected();
                        }


                        function getToday() {
                            var today = new Date();

                            var mm = today.getMonth() + 1;
                            var yyyy = today.getUTCFullYear();
                            var dd = today.getDate();


                            if (dd < 10) dd = '0' + dd;
                            if (mm < 10) mm = '0' + mm;

                            return yyyy.toString() + mm.toString() + dd.toString();
                        }

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
