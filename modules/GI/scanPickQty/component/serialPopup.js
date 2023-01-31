
(function () {
    'use strict'
    app.directive('serialPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/GI/scanPickQty/component/serialPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'webServiceAPI', 'dpMessageBox','scanPickQtyFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, webServiceAPI, dpMessageBox,scanPickQtyFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        $scope.onShow = false;
                        $scope.ResultData = {};
                        $scope.model = {};
                        var viewModel = scanPickQtyFactory;

                        $scope.onClose = function () {
                            $scope.onShow = false;

                        };

                        $scope.delegates = function (param) {
                            debugger
                            $scope.fullserial = false;
                            $scope.detail = {};
                            $scope.filterModelpopup = {};
                            $scope.list = [];
                            $scope.filterModelpopup = param;
                        }

                        $scope.addsItem = function () {
                            if ($scope.detail.insertSerial != undefined && $scope.detail.insertSerial != '' && $scope.detail.tagOut_No != undefined && $scope.detail.tagOut_No != '') {
                                $scope.list.push($scope.detail);
                                $scope.detail = {};
                                if ($scope.list.length == parseInt($scope.filterModelpopup.pick_Qty)) {
                                    $scope.fullserial = true;
                                }
                            }else{
                                return dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: 'กรุณากรอก ข้อมูล Serial'
                                    }
                                )
                            }

                        }

                        

                        $scope.next = function () {
                            $scope.checktag = {};
                            $scope.checktag.tagOut_No = $scope.detail.tagOut_No;
                            $scope.checktag.task_Index = $scope.filterModelpopup.task_Index;
                            debugger
                            viewModel.ScanCheckTagout($scope.checktag).then(function (res) {
                                if (res.data.resultIsUse) {
                                    setTimeout(() => {
                                        var focusElem = jQuery('input[ng-model="detail.insertSerial"]');
                                        focusElem[0].focus();
                                    }, 200);
                                }else{
                                    dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'แจ้งเตือน',
                                            message: res.data.resultMsg
                                        }
                                    )
                                    $scope.detail.tagOut_No = undefined
                                    setTimeout(() => {
                                        var focusElem = jQuery('input[ng-model="detail.insertSerial"]');
                                        focusElem[0].focus();
                                    }, 200);
                                }
                                
                            },
                                function error(response) {
                                   
                                    dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'แจ้งเตือน',
                                            message: 'Error'
                                        }
                                    )

                                    setTimeout(() => {
                                        var focusElem = jQuery('input[ng-model="detail.insertSerial"]');
                                        focusElem[0].focus();
                                    }, 200);
                            })
                            
                        }

                        $scope.saveserial = function () {
                            $scope.invokes.selected($scope.list);
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
