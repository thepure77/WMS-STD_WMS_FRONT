
(function () {
    'use strict'
    app.directive('restTimePopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/yardDock/bookingConfigDock/restTimePopup/restTimePopup.html",
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
                            $scope.userSelected = []
                        };

                        $scope.bkItem = {}
                        $scope.arryList = [];
                        $scope.TimeList = [];

                        $scope.delegate = {

                            set: function (param) {
                                if (param.status != "Pick") {
                                    if (param.deleteFromGet.length > 0) {
                                        $scope.TimeList = [];
                                        $scope.arryList = [];
                                        if (param.isResetIntervalTime == 1) {
                                            $scope.isResetIntervalTime = param.isResetIntervalTime;
                                        }
                                        else {
                                            $scope.isResetIntervalTime = 0
                                        }
                                        $scope.arryList = param.DockQoutaIntervalBreakTime;
                                        if (param.deleteFromGet.length > 0) {

                                            $scope.TimeList = param.deleteFromGet;
                                            $scope.TimeList.sort(function (a, b) { return a.time_Id - b.time_Id });

                                            for (let index = 0; index < $scope.TimeList.length; index++) {
                                                var item = $scope.arryList.filter(elem => elem.time_Id == $scope.TimeList[index].time_Id);

                                                if (item.length > 0) {
                                                    for (let index = 0; index < $scope.arryList.length; index++) {
                                                        if ($scope.arryList[index].time_Id == item[0].time_Id) {
                                                            $scope.arryList.splice([index], 1);
                                                        }
                                                    }
                                                }

                                            }
                                        }
                                    }
                                    let addOldTime = {};
                                    addOldTime.time = param.time;
                                    addOldTime.time_Id = param.time_Id;
                                    // addOldTime.time_End = param.time_End;
                                    // addOldTime.time_Start = param.time_Start;

                                    $scope.arryList.push(addOldTime)
                                    $scope.arryList.sort(function (a, b) { return a.time_Start - b.time_End });
                                }
                                else {

                                    $scope.arryList = param.intervalTime;

                                    if (param.isResetIntervalTime == 1) {
                                        $scope.isResetIntervalTime = param.isResetIntervalTime;
                                        $scope.userSelected = []
                                    }
                                    else {
                                        $scope.isResetIntervalTime = 0
                                    }
                                    if (param.action == 'EDIT') {
                                        $scope.TimeList = [];
                                        $scope.BreakTime = [];
                                        $scope.Interval = [];
                                    }
                                    $scope.arryList.sort(function (a, b) { return a.time_Id - b.time_Id });

                                    if (param.DockQoutaIntervalBreakTime != undefined) {
                                        if (param.DockQoutaIntervalBreakTime.length > 0) {
                                            $scope.TimeList = param.DockQoutaIntervalBreakTime;
                                            $scope.TimeList.sort(function (a, b) { return a.time_Id - b.time_Id });


                                            for (let index = 0; index < $scope.TimeList.length; index++) {
                                                var item = $scope.arryList.filter(elem => elem.time_Id == $scope.TimeList[index].time_Id);

                                                if (item.length > 0) {
                                                    for (let index = 0; index < $scope.arryList.length; index++) {
                                                        if ($scope.arryList[index].time_Id == item[0].time_Id) {
                                                            $scope.arryList.splice([index], 1);
                                                        }
                                                    }
                                                }

                                            }
                                        }
                                    }

                                }
                            }
                        }
                        $scope.delegates = $scope.delegate;

                        $scope.add = function () {
                            if ($scope.invokes.add)
                                $scope.invokes.add($scope.dtChoose);
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

                        $scope.userSelected = [];
                        $scope.Interval = [];
                        $scope.chooseItem = function () {
                            $scope.dtChoose = {}
                            angular.forEach($scope.userSelected, function (value, key) {
                                if (value.checked == "checking") {
                                    // สร้างใหม่ สเตตัส = 1
                                    if ($scope.isResetIntervalTime == 1) {
                                        $scope.TimeList = [];
                                        $scope.BreakTime = [];
                                        $scope.Interval = [];
                                    }
                                    var newinterval = {};
                                    var newBreakTime = {};
                                    if ($scope.arryList.length > 0) {
                                        if (value.datarow.time != null) {
                                            newBreakTime.time = value.datarow.time;
                                            newBreakTime.time_Id = value.datarow.time_Id;
                                            newinterval.time_End = value.datarow.time_End;
                                            newinterval.time_Id = value.datarow.time_Id;
                                            newinterval.time_Start = value.datarow.time_Start;
                                        }
                                        newBreakTime.inserted = 1;
                                        newBreakTime.tab = 1;

                                        $scope.Interval.push(newinterval);

                                        if ($scope.TimeList.length > 0) {
                                            $scope.TimeList.push(newBreakTime);

                                            $scope.dtChoose.addTime = "Yes"
                                            $scope.BreakTime = $scope.TimeList;
                                        }
                                        else {
                                            // $scope.BreakTime = [];
                                            $scope.BreakTime.push(newBreakTime);
                                            $scope.isResetIntervalTime = 0;
                                        }
                                        $scope.Interval.sort(function (a, b) { return a.time_Start - b.time_End });
                                    }
                                }
                            });


                            angular.forEach($scope.arryList, function (value, key) {
                                if ($scope.Interval.filter(elem => elem.time_Start == value.time_Start).length == 1) {
                                    $scope.arryList.splice(key, 1);
                                }
                            })

                            // $scope.dtChoose.Interval = $scope.IntervelTimeBank;
                            $scope.dtChoose.BreakTime = $scope.BreakTime;
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
                            // if ($scope.userSelected.length == 0) {
                            //     $scope.userSelected[indexData] = {};
                            //     $scope.userSelected[indexData].index = indexData;
                            //     $scope.userSelected[indexData].checked = checked;
                            //     $scope.userSelected[indexData].datarow = datarow;
                            //     if ($scope.userSelected[indexData].datarow.inserted != 1) {
                            //         $scope.userSelected[indexData].datarow.inserted = 0
                            //     }
                            // }
                            // else {
                            //     if ($scope.userSelected[indexData] != undefined) {
                            //         if ($scope.userSelected[indexData].index == indexData) {
                            //             $scope.userSelected = [];

                            //         }
                            //     }

                            // }

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