
(function () {
    'use strict'
    app.directive('detailPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/GI/CheckStock/component/detailPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'webServiceAPI', 'checkStockFactory', 'dpMessageBox',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, webServiceAPI, checkStockFactory, dpMessageBox) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = checkStockFactory;
                        $scope.onShow = false;
                        $scope.filterItemModel = {};
                        $scope.IsNew = 1;
                        $scope.chk = {};
                        // $scope.filterModel = {};

                        // $scope.onHide = function (param) {
                        // };
                        $scope.onClose = function () {
                            $scope.onShow = false;
                            $scope.filterItemModel = {};
                        };

                        $scope.delegates = function (param) {
                            debugger
                            $scope.filterItemModel.product_Id = param.product_Id;
                            $scope.filterItemModel.product_Name = param.product_Name;
                            $scope.filterItemModel.erp_Location = param.erp_Location;
                            $scope.filterItemModel.binBalance_QtyBegin = param.binBalance_QtyBegin;
                            viewModel.getSctock_filter(param).then(function (res) {
                                $scope.model = res.data
                                debugger
                            });
                        }


                        $scope.chkIsuse = function (param) {
                            if (param.isdiff) {
                                return "#FFCF2D"
                            }else{
                                return "#63FF2D"
                            }
                        }


                        var init = function () {

                        };

                        init();

                    }
                ],
                link: function ($scope, $element, $attributes) { }
            };
        }
    ]);
}());
