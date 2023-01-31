
(function () {
    'use strict'
    app.directive('vendorPopupPlan', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/component/Popup/vendorPopup/PlanGR/vendorPopupPlangr.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'vendorPlanFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, vendorPlanFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = vendorPlanFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            $scope.onShow = false;
                        };

                        $scope.model = {
                            currentPage: 0,
                            numPerPage: 100,
                            totalRow: 1,
                            key: '',
                            advanceSearch: false
                        };


                        $scope.delegates = function (param, index) {
                            $scope.actionPS = "1";
                            $scope.filter();
                        }

                        $scope.filter = function (param) {
                            pageLoading.show();
                            $scope.filterModel = $scope.filterModel || {};
                            $scope.filterModel.chk = $scope.index;
                            $scope.filterModel.currentPage = 1;
                            $scope.filterModel.perPage = 8;
                            viewModel.filter($scope.filterModel).then(function success(res) {
                                pageLoading.hide();
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data.itemsVendor;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsVendor, res.data.pagination);
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
                                    $scope.filterModel = $scope.filterModel || {};
                                    $scope.filterModel.currentPage = param.currentPage;
                                    $scope.filterModel.perPage = param.numPerPage;

                                    // viewModel.PopupGIRunWave($scope.filterModel).then(function success(res) {

                                    //     if ($scope.datalist.delegates.set)
                                    //         $scope.datalist.delegates.set(res.data.items, res.data.pagination);
                                    // }, 
                                    // function error(res) { });
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

                        var init = function () {

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
