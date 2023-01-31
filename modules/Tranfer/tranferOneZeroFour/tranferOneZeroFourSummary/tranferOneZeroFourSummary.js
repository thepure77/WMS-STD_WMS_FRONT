(function () {
    'use strict';
    app.component('tranferOneZeroFourSummary', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Tranfer/tranferOneZeroFour/tranferOneZeroFourSummary/tranferOneZeroFourSummary.html";
        },
        bindings: {
            scanReceive: '=?',
            onShow: '=?'
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, tranferOneZeroFourFactory, webServiceAPI) {
            var $vm = this;
            var defer = {};
            var viewModel = tranferOneZeroFourFactory;

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

            $scope.select = function (param) {
                $scope.filterModelget = {};
                let data = $scope.listfilterModel.find(c => c.isUser);
                if (data) {
                    data.isUser = false;

                    if (data.binBalance_Index != param.binBalance_Index) {
                        $scope.sendback = false;
                        $scope.selectlist = true;
                        $scope.call = false;
                    }
                }

                param.isUser = true;
                $scope.filterModelget = param;
                $scope.selectlist = true;
                $scope.filterModel.location_to = undefined;

            }

            $scope.chkIsuse = function (param) {
                if (param.isUser) {
                    return "#99FF66"
                }
            }

            $scope.checktemp = function () {

                if ($scope.filterModelget == undefined) {
                    return dpMessageBox.alert({
                        ok: 'Yes',
                        title: 'Information.',
                        message: "ไม่พบ tag ที่ทำการค้นหา"
                    })
                }

                viewModel.entercall104($scope.filterModelget).then(function success(res) {
                    if (res.data.resultIsUse) {
                        $scope.sendback = true;
                        $scope.filterModelget = res.data;
                        $scope.filterModelget.binBalance_QtyBegin = 0.00;
                        $scope.filterModelget.binBalance_QtyBal = 0.00;
                        $scope.filterModelget.binBalance_QtyReserve = 0.00;
                        $scope.filterModel.location_to = res.data.location_Name
                    }
                },
                    function error(res) {
                    });

            }

            $scope.callsendback = function () {

                if ($scope.filterModelget == undefined) {
                    return dpMessageBox.alert({
                        ok: 'Yes',
                        title: 'Information.',
                        message: "กรุณาทำการเลือก พาเลทที่จะส่งกลับ"
                    })
                }

                $scope.filterModelget.binBalance_QtyBegin = 0.00;
                $scope.filterModelget.binBalance_QtyBal = 0.00;
                $scope.filterModelget.binBalance_QtyReserve = 0.00;

                viewModel.callback($scope.filterModelget).then(function success(res) {
                    debugger
                    if (res.data.status == "10") {
                        $scope.selectlist = false;
                        $scope.call = false;
                        $scope.sendback = false;
                        $scope.filterModelget = {};
                        $scope.listfilterModel = [];
                        dpMessageBox.alert({
                            ok: 'Yes',
                            title: 'Information.',
                            message: "ระบบกำลังนำพาเลทกลับไปที่ " + $scope.filterModel.location_to
                        })
                        $scope.filterModel = {};
                    } else {
                        return dpMessageBox.alert({
                            ok: 'Yes',
                            title: 'Information.',
                            message: res.data.message.description
                        })
                    }
                },
                    function error(res) {
                    });

            }

            $scope.search = function () {
                $scope.selectlist = false;
                $scope.call = false;
                $scope.sendback = false;
                $scope.filterModelget = {};
                $scope.filterModel.location_to = undefined;
                viewModel.checkpallet104($scope.filterModel).then(function success(res) {

                    if (res.data.listTransferItemViewModel.length != 0) {
                        $scope.listfilterModel = res.data.listTransferItemViewModel;
                    } else {
                        $scope.listfilterModel = [];
                    }
                },
                    function error(res) {
                    });
            }

            $scope.call104 = function () {
                $scope.call = true;
                if ($scope.filterModelget == undefined) {
                    $scope.call = false;
                    return dpMessageBox.alert({
                        ok: 'Yes',
                        title: 'Information.',
                        message: "กรุณาเลือกพาเลท ก่อนทำการเรียก "
                    })
                }
                viewModel.call104($scope.filterModelget).then(function success(res) {
                    if (res.data.status = "10") {
                        $scope.filterModel.location_to = res.data.message.description;
                        $scope.sendback = true;

                        viewModel.checkpallet104($scope.filterModel).then(function success(res) {

                            if (res.data.listTransferItemViewModel.length != 0) {
                                $scope.listfilterModel = res.data.listTransferItemViewModel;
                            } else {
                                $scope.listfilterModel = [];
                            }
                        },
                            function error(res) {
                            });

                        return dpMessageBox.alert({ 
                            ok: 'Yes',
                            title: 'Information.',
                            message: "ระบบกำลังนำพาเลทมาที่ 104"
                        })
                    } else {
                        $scope.call = false;
                        return dpMessageBox.alert({
                            ok: 'Yes',
                            title: 'Information.',
                            message: res.data.message.description
                        })
                    }
                },
                    function error(res) {
                    });
            }


            $vm.$onInit = function () {
                $vm = this;
                $scope.selectlist = false;
                $scope.call = false;
                $scope.sendback = false;
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.click = 1;
                setTimeout(() => {
                    var focusElem = jQuery('input[ng-model="filterModel.location"]');
                    focusElem[0].focus();

                }, 200);
            }







        }
    })
})();