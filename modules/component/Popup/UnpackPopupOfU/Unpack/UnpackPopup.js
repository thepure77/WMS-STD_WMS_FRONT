
(function () {
    'use strict'
    app.directive('unpackPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/component/Popup/UnpackPopupOfU/Unpack/UnpackPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval','webServiceAPI','transferFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval,webServiceAPI,transferFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var __viewModel = transferFactory;
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
                       
                        $scope.delegates.planGiPopup = function (param, owner) {
                            $scope.filterModel = {};
                            $scope.filterModel.owner_Id ='3419'
                            $scope.filterModel.owner_Index ='02b31868-9d3d-448e-b023-05c121a424f4'
                            $scope.filterModel.owner_Name ='Amazon'
                            var model = $scope.filterModel;
                            __viewModel.filterBinbalanceAB03(model).then(function (res) {
                                pageLoading.hide()
                                $scope.items = res.data.items;
                                $scope.datalist.delegates.set(res.data.items);

                            },
                                function error(response) {
            
                                }
                            );
                        }
                        
                        $scope.Search = function () {
                            pageLoading.show()
                            
                            $scope.filterModel.owner_Id ='3419'
                            $scope.filterModel.owner_Index ='02b31868-9d3d-448e-b023-05c121a424f4'
                            $scope.filterModel.owner_Name ='Amazon'
                            var model = $scope.filterModel;
                            __viewModel.filterBinbalanceAB03(model).then(function (res) {
                                pageLoading.hide()
                                $scope.items = res.data.items;
                                $scope.datalist.delegates.set(res.data.items);

                            },
                                function error(response) {
            
                                }
                            );
                        }

                        $scope.confirm = function () {
                            
                            if ($scope.datalist.delegates.selected)
                                $scope.datalist.delegates.selected();
                        }

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
                                confirm: function (param) {
                                    let items = param.filter(c => c.selected);
                                    if ($scope.invokes.selected)
                                        $scope.invokes.selected(items);
                                    $scope.onShow = false;
                                }
                            }
                        };
                        
                        $scope.autoComplete = {
                            sku: "PickBinbalance/AutoCompleteProductId"
                        };
            
                        $scope.url = {
                            binBalance: webServiceAPI.BinBalance,
                            Master: webServiceAPI.Master,
                        };

                        var init = function () {
                            $scope.filterModel = {};
                            $scope.items = [];

                        };
                        init();
                    }
                ],
                link: function ($scope, $element, $attributes) { }
            };
        }
    ]);
}());
