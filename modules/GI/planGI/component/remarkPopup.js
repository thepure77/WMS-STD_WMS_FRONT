
(function () {
    'use strict'
    app.directive('remarkPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/GI/planGI/component/remarkPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'webServiceAPI', 'dpMessageBox',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, webServiceAPI, dpMessageBox) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        $scope.onShow = false;
                        $scope.ResultData = {};
                        $scope.model = {};
                        $scope.onClose = function () {
                            $scope.onShow = false;

                        };

                        $scope.delegates = function (param) {
                            $scope.filterModel =param ;
                        }

                        $scope.addsItem = function () {
                            $scope.invokes.selected($scope.filterModel);
                            $scope.onShow = false;
                            $scope.filterItemModel = {};
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
