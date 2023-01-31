
(function () {
    'use strict'
    app.directive('bookingDockPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/yardDock/bookingDockCheck/bookingDockPopup/bookingDockPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        $scope.onShow = false;

                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            $scope.onShow = false;
                        };

                        $scope.delegates = function (param) {
                            
                            $scope.filterModel = param
                            for (let index = 0; index < $scope.filterModel.length; index++) {
                                $scope.filterModel[index].appointment_Date = $scope.dateformate($scope.filterModel[index].appointment_Date);
                            }
                        }

                        $scope.dateformate = function (param) {
                            var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                            var date = param.slice(0, 10).split('-');
                            var newdate = date[2] + " " + monthNames[date[1] - 1] + " " + date[0];
                            return newdate;
                        }

                        $scope.select = function (param) {
                            $scope.invokes.selected(param);
                            $scope.onShow = false;
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
