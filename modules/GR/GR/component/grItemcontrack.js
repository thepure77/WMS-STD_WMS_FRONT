
(function () {
    'use strict'
    app.directive('grItemcontrack', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/GR/GR/component/grItemcontrack.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'webServiceAPI', 'goodsReceiveFactory', 'dpMessageBox',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, webServiceAPI, goodsReceiveFactory, dpMessageBox) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = goodsReceiveFactory;
                        $scope.onShow = false;
                        $scope.filterItemModel = {};
                        $scope.onClose = function () {
                            $scope.onShow = false;
                            $scope.filterItemModel = {};

                        };

                        $scope.delegates = function (param) {
                        
                            $scope.filterItemModel = {};

                            if (param.rowItemIndex != undefined || param.rowItemIndex != null) {

                                $scope.filterItemModel = param;

                            }
                            else {
                                $scope.filterItemModel.owner_Index = param.owner_Index;
                                $scope.IsNew = 1;

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
