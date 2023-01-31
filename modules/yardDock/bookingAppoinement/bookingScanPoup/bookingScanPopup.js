
(function () {
    'use strict'
    app.directive('bookingScanPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/yardDock/bookingAppoinement/bookingScanPoup/bookingScanPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'menuFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, menuFactory) {

                        $scope.delegates = $scope.delegates || {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        $scope.onShow = false;


                        $scope.onHide = function () {
                        };

                        $scope.onClose = function () {
                            $scope.onShow = false;
                            $window.localStorage.setItem("displayHead", "");
                            $window.localStorage.setItem("marginHead", "");
                            $window.localStorage.setItem("marginmenu", "120px");
                        };

                        $scope.bkItem = {}

                        $scope.delegate = {
                            set: function (param) {
                                $scope.bkItem = param;

                                if ($scope.bkItem.checkIn_Date != undefined) {
                                    // var newdate = convertDate($scope.bkItem.checkIn_Date);
                                    // $scope.bkItem.checkIn_Date = newdate;

                                    var date = dateformate($scope.bkItem.checkIn_Date)
                                    $scope.bkItem.checkIn_Date = date;
                                }
                            }
                        }
                        $scope.delegates = $scope.delegate;

                        $scope.next = function () {
                            var items = $scope.bkItem;
                            $scope.bkItem = {};
                            if ($scope.invokes.add)
                                $scope.invokes.add(items);
                        }

                        function dateformate(param) {
                            var date = param.slice(0, 10).split('-');
                            var newdate = date[2] + "/" + date[1] + "/" + date[0];
                            return newdate;
                        }

                        $scope.filterProductType = function (code) {
                            $scope.criteria = {};
                            viewModel.service.searchProductType($scope.criteria).then(function (res) {
                                $scope.itemsProductType = res.data;
                                $scope.itemsProductType.forEach(c => {
                                    c.name = c.text
                                });
                                $scope.loading.item = false;
                            }, function error(res) {
                                $scope.response = "M_ERROR";
                                if (res.Message.data != null) {
                                    $scope.message = res.Message.data.Message;
                                }
                                else {
                                    $scope.message = "Data not found";
                                }
                            })

                        }
                        $scope.filterUnit = function (code) {
                            $scope.criteria = {};
                            viewModel.service.searchProductConversion($scope.criteria).then(function (res) {
                                $scope.itemsUnit = res.data;
                                $scope.itemsUnit.forEach(c => {
                                    c.name = c.text
                                });
                                $scope.loading.item = false;
                            }, function error(res) {
                                $scope.response = "M_ERROR";
                                if (res.Message.data != null) {
                                    $scope.message = res.Message.data.Message;
                                }
                                else {
                                    $scope.message = "Data not found";
                                }
                            })
                        }

                        function convertDate(param) {
                            var year = param.substring(0, 4);
                            var month = param.substring(4, 6);
                            var day = param.substring(6, 8);
                            month = parseInt(month) - 1;
                            var a = new Date(year, month, day);
                            return a;
                        }

                        function initial() {
                            // dropdownTypeCar();
                            // dropdownGeneration();
                            // dropdownActivity();
                            // $scope.filterProductType();
                            // $scope.filterUnit();
                        }

                        initial();
                    }
                ],
                link: function ($scope, $element, $attributes) { }
            };
        }]);
}());