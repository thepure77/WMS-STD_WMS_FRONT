(function () {
    'use strict';
    app.component('sendRollcageToStagingSummary', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/RollCage/sendRollcageToStaging/sendRollcageToStagingSummary/sendRollcageToStagingSummary.html";
        },
        bindings: {
            scanReceive: '=?',
            onShow: '=?'
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, sendRollcageToStagingFactory, webServiceAPI) {
            var $vm = this;
            var defer = {};
            var viewModel = sendRollcageToStagingFactory;

            $scope.url = {
                GR: webServiceAPI.GR,
            };

            $scope.filterModel = {
                callroll: false,
                buttoncall: false,
            };

            $scope.header = {
                callroll: false,
                buttoncall: false,
            };


            $scope.scanrollcageback = function () {

                viewModel.checkRollcage($scope.filterModel).then(function success(res) {
                    if (res.data.resultIsUse) {
                        $scope.blockback = true;
                        setTimeout(() => {
                            var focusElem = jQuery('input[ng-model="filterModel.location"]');
                            focusElem[0].focus();
    
                        }, 200);
                    }else{
                        dpMessageBox.alert({
                            ok: 'Yes',
                            title: 'Information.',
                            message: res.data.resultMsg
                        })
                    }
                    
                },
                    function error(res) {
                    });

            }



            $scope.ScanLocation = function (param) {
                if ($scope.filterModel.location == undefined) {
                    dpMessageBox.alert({
                        ok: 'Yes',
                        title: 'Information.',
                        message: "ไม่พบ location ที่ค้นหา"
                    })
                    setTimeout(() => {
                        var focusElem = jQuery('input[ng-model="filterModel.location"]');
                        focusElem[0].focus();

                    }, 200);
                }
                let models = $scope.filterModel;
                if ($scope.filterModel.location != undefined) {
                    viewModel.scanLocation(models).then(function success(res) {

                        if (res.data.mess != null) {
                            if (res.data.mess == 'E') {
                                dpMessageBox.confirm({
                                    ok: 'Yes',
                                    cancel: 'No',
                                    title: 'ยืนยันข้อมูล ?',
                                    message: 'Location ที่ค้นหาไม่ว่าง ต้องการดำเนินการต่อหรือไม่'
                                }).then(function success() {
                                    $scope.filterModel.again = true;
                                    $scope.confirmlocation = true;
                                    setTimeout(() => {
                                        var focusElem = jQuery('input[ng-model="filterModel.shipment_no"]');
                                        focusElem[0].focus();

                                    }, 200);
                                }, function error(param) {
                                    // $scope.filterModel.location = undefined;
                                    $scope.filterModel.again = false;
                                    $scope.confirmlocation = true;
                                    setTimeout(() => {
                                        var focusElem = jQuery('input[ng-model="filterModel.shipment_no"]');
                                        focusElem[0].focus();

                                    }, 200);
                                });
                            } else {
                                dpMessageBox.alert({
                                    ok: 'Yes',
                                    title: 'Information.',
                                    message: res.data.mess
                                })
                                $scope.filterModel.location = undefined;
                                $scope.confirmlocation = false;
                                setTimeout(() => {
                                    var focusElem = jQuery('input[ng-model="filterModel.location"]');
                                    focusElem[0].focus();

                                }, 200);
                            }
                        } else {
                            $scope.filterModel.again = false;
                            $scope.confirmlocation = true;
                            setTimeout(() => {
                                var focusElem = jQuery('input[ng-model="filterModel.shipment_no"]');
                                focusElem[0].focus();
                            }, 200);
                        }
                    },
                        function error(res) {
                        });
                }
            }

            $scope.scanEmptyLocation = function (param) {
                if ($scope.filterModel.location == undefined) {
                    dpMessageBox.alert({
                        ok: 'Yes',
                        title: 'Information.',
                        message: "ไม่พบ location ที่ค้นหา"
                    })
                    setTimeout(() => {
                        var focusElem = jQuery('input[ng-model="filterModel.location"]');
                        focusElem[0].focus();

                    }, 200);
                }
                let models = $scope.filterModel;
                if ($scope.filterModel.location != undefined) {
                    viewModel.scanEmptyLocation(models).then(function success(res) {

                        if (res.data.mess != null) {
                            if (res.data.mess != null) {
                                dpMessageBox.alert({
                                    ok: 'Yes',
                                    title: 'Information.',
                                    message: res.data.mess
                                })
                                setTimeout(() => {
                                    var focusElem = jQuery('input[ng-model="filterModel.location"]');
                                    focusElem[0].focus();

                                }, 200);
                            }
                        } else {
                            $scope.confirmEmptyDock = true;
                        }
                    },
                        function error(res) {
                        });
                }
            }

            $scope.movePallet = function (param) {
                debugger
                let models = $scope.filterModel;
                models.user = $scope.userName;
                viewModel.movePallet(models).then(function success(res) {

                    if (res.data.status != null) {
                        $scope.confirmEmptyDock = false;
                        $scope.blockback = false;
                        $scope.filterModel = {};
                        $scope.listfilterModel = {};
                        $scope.filterModeldata = {};
                        $scope.filterModelscan = {};
                    } else {

                    }
                },
                    function error(res) {
                    });
            }

            $vm.$onInit = function () {
                $vm = this;
                $scope.block = false;
                $scope.nextfrist = true;
                $scope.confirmalltag = false;
                $scope.checkall = false;
                $scope.Ismatch = false;
                $scope.confirmEmptyDock = false;
                $scope.confirmlocation = false;
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.click = 1;
                setTimeout(() => {
                    var focusElem = jQuery('input[ng-model="filterModel.rollcage_id"]');
                    focusElem[0].focus();

                }, 200);
            }







        }
    })
})();