
(function () {
    'use strict'
    app.directive('popupPostdate', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/GI/planGI/component/popUpConfirmDate.html",
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
                            $scope.filterModel.confirmpsotdate = getToday();

                        }

                        $scope.addsItem = function () {
                            debugger
                            $scope.invokes.selected($scope.filterModel);
                            $scope.onShow = false;
                            $scope.filterItemModel = {};
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
                            
                        };

                        init();

                    }
                ],
                link: function ($scope, $element, $attributes) { }
            };
        }
    ]);
}());
