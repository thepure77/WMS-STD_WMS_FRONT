
(function () {
    'use strict'
    app.directive('blockTimePopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/yardDock/bookingYardDock/blockTimePopup/blockTimePopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'menuFactory', 'bkYardDockFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, menuFactory, bkYardDockFactory) {

                        $scope.delegates = $scope.delegates || {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        $scope.onShow = false;
                        var viewModel = bkYardDockFactory;

                        $scope.onHide = function () {
                        };

                        $scope.onClose = function () {
                            $scope.onShow = false;
                            $scope.userSelected = []
                        };

                        $scope.bkItem = {}
                        $scope.dockUser = [];
                        $scope.arryList = [];
                        $scope.TimeList = [];

                        $scope.delegate = {

                            set: function (param) {
                                $scope.dockUser = param.DockQoutaIntervalBreakTime;
                                debugger
                                viewModel.ListBlockTime(param).then(function success(res) {

                                    if (res.data.length > 0) {

                                        $scope.arryList = res.data[0].items[0].times

                                        if ($scope.arryList.length > 0) {
                                            $scope.arryList = $scope.arryList.filter(c => c.isEnable == true);
                                            $scope.isResetIntervalTime = 1
                                        }
                                    }


                                }, function error(res) {
                                    $scope.response = "M_ERROR";
                                    if (res.Message.data != null) {
                                        $scope.message = res.Message.data.Message;
                                    }
                                    else {
                                        $scope.message = "Data not found";
                                    }
                                });
                            }
                        }
                        $scope.delegates = $scope.delegate;

                        $scope.add = function () {
                            if ($scope.invokes.add)
                                $scope.invokes.add($scope.dtChoose);
                        }

                        $scope.userSelected = [];
                        $scope.Interval = [];
                        $scope.chooseItem = function () {

                            $scope.dtChoose = {}
                            $scope.dtChoose.BreakTime = $scope.userSelected.filter(c => c.checked == "checking");
                            $scope.isResetIntervalTime = 0;
                            $scope.userSelected = [];
                            $scope.add();
                        }

                        $scope.selectItem = function (id, indexData, checked, datarow, tab) {

                            $scope.userSelected[indexData] = {};
                            $scope.userSelected[indexData].index = indexData;
                            $scope.userSelected[indexData].checked = checked;
                            $scope.userSelected[indexData].datarow = datarow;
                            if ($scope.userSelected[indexData].datarow.inserted != 1) {
                                $scope.userSelected[indexData].datarow.inserted = 0
                            }
                        }

                        function initial() {

                        }

                        initial();
                    }
                ],
                link: function ($scope, $element, $attributes) { }
            };
        }]);
}());