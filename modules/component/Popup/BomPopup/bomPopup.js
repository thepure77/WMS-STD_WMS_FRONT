
(function () {
    'use strict'
    app.directive('bomPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/component/Popup/BomPopup/bomPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'goodsReceiveFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, goodsReceiveFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        $scope.filterModel = $scope.filterModel || {};

                        var viewModel = goodsReceiveFactory;
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

                        $scope.delegates = function (param) {
                            $scope.owner_Index = {};
                            $scope.owner_Index = param.owner_Index;
                            $scope.filter();
                        }

                        $scope.filter = function (param) {
                            pageLoading.show();
                            $scope.filterModel.currentPage = 1;
                            $scope.filterModel.perPage = 8;
                            $scope.filterModel.Owner_Index = $scope.owner_Index; 
                            if(param != undefined)
                            {
                                $scope.filterModel.BOM_No = param.BOM_No; 
                                $scope.filterModel.Owner_Index = $scope.owner_Index; 
                            }
                            viewModel.popupBomIfilter($scope.filterModel).then(function success(res) {
                                pageLoading.hide();
                                debugger
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data.itemsBom;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.itemsBom, res.data.pagination);
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
