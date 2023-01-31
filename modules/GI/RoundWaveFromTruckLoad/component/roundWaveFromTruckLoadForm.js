(function () {
    'use strict';
    app.component('roundWaveFromTruckLoadForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/RoundWaveFromTruckLoad/component/roundWaveFromTruckLoadForm.html";
        },
        bindings: {
            scanReceive: '=?',
            onShow: '=?'
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, roundWaveFromTruckLoadFactory, webServiceAPI , kMessageBox) {
            var $vm = this;
            var defer = {};
            var viewModel = roundWaveFromTruckLoadFactory;

            $scope.filterModel = {
                callroll: false,
                buttoncall: false,
            };

            $scope.header = {
                callroll: false,
                buttoncall: false,
            };





            $scope.filterSearch = function () {
                $scope.filterModel;
                // if ($scope.dropdownRound.model != undefined) {
                //     $scope.filterModel.round_Index = $scope.dropdownRound.model.round_Index;
                //     $scope.filterModel.round_Id = $scope.dropdownRound.model.round_Id;
                //     $scope.filterModel.round_Name = $scope.dropdownRound.model.round_Name;
                // } else {
                //     $scope.filterModel.round_Index = undefined;
                //     $scope.filterModel.round_Id = undefined;
                //     $scope.filterModel.round_Name = undefined;

                // }

                if ($scope.dropdownTime.model != undefined) {
                    $scope.filterModel.appointment_Time = $scope.dropdownTime.model.appointment_Time;
                } else {
                    $scope.filterModel.appointment_Time = undefined;
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณาเลือก รอบ ที่จะค้นหา'
                        }
                    )
                }

                if ($scope.filterModel.appointment_Date == undefined) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณาเลือก วันที่ ที่จะค้นหา'
                        }
                    )
                }
                $scope.selectnext = false;
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {

                    $scope.filterModellist = {};
                    if (res.data.resultIsUse) {
                        $scope.filterModellist = res.data
                        $scope.checkdata = true;
                        $scope.Run = false;
                        $scope.task = false;
                        $scope.tag = false;
                    } else {
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: res.data.resultMsg
                            }
                        )
                    }
                });
            };

            $scope.Update = function () {
                $scope.filterModel.log_udf_2 = getToday();
                $scope.filterModel.log_udf_3 = getTime();
                debugger
                if ($scope.dropdownRound.model != undefined) {
                    $scope.filterModel.round_Index = $scope.dropdownRound.model.round_Index;
                    $scope.filterModel.round_Id = $scope.dropdownRound.model.round_Id;
                    $scope.filterModel.round_Name = $scope.dropdownRound.model.round_Name;
                } else {
                    $scope.filterModel.round_Index = undefined;
                    $scope.filterModel.round_Id = undefined;
                    $scope.filterModel.round_Name = undefined;

                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณาเลือก รอบที่จะตั้งค่า'
                        }
                    )
                }
                if ($scope.filterModel.planGoodsIssue_Due_Date == undefined) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณาเลือก วันที่จะตั้งค่า'
                        }
                    )
                }
                let data = $scope.filterModellist.itemsDetail.filter(c => c.selected);

                if (data.length <= 0) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณาเลือก รถที่จะตั้งค่า อย่างน้อย 1 คัน'
                        }
                    )
                } else {
                    $scope.filterModel.itemsUpdate = data;
                }
                dpMessageBox.confirm({
                    ok: 'OK',
                    cancel: 'Close',
                    title: 'MSG_SURE_data',
                    message: 'Do you want to Update Round'
                }).then(function () {
                    pageLoading.show();
                    $scope.filterModel.userName = $scope.userName;
                    $scope.filterModel.log_udf_4 =getToday();
                    $scope.filterModel.log_udf_5 =getTime();
                    $scope.filterModel.operations = "Update Round"+" "+ $scope.filterModel.round_Name;
                    viewModel.Update_Round($scope.filterModel).then(function (res) {


                        if (res.data.resultIsUse) {
                            $scope.round = {}
                            $scope.round.round_Name = $scope.filterModel.round_Name;
                            $scope.filterModel.planGoodsIssue_Due_Date = undefined;
                            $scope.dropdownRound.model = undefined;
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'บันทึกรอบ Wave ' + $scope.round.round_Name + ' สำเร็จ '
                                }
                            )
                        } else {
                            let message = res.data.resultMsg.split(",");
                            debugger
                             dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                messageNewLine: message
                            });
                            
                        }
                    });
                },
                    function error(param) {
                    });
            };

            $scope.Delete_Round = function (param) {
                debugger

                dpMessageBox.confirm({
                    ok: 'OK',
                    cancel: 'Close',
                    title: 'MSG_SURE_data',
                    message: 'Do you want to Rollback Round'
                }).then(function () {
                    pageLoading.show();
                    param.userName = $scope.userName;
                    viewModel.Delete_Round(param).then(function (res) {

                        debugger
                        if (res.data.resultIsUse) {
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'Rollback สำเร็จ'
                                }
                            )
                        } else {
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: res.data.resultMsg
                                }
                            )
                        }
                    });
                },
                    function error(param) {
                    });



            };

            $scope.detectCheckAll = function () {

                if ($scope.checkAll === true) {
                    for (var c = 0; c <= $scope.filterModellist.itemsDetail.length; c++) {
                        $scope.filterModellist.itemsDetail[c].selected = true;
                        $scope.hide(c);
                    }
                } else {
                    for (var c = 0; c <= $scope.filterModellist.itemsDetail.length - 1; c++) {
                        $scope.filterModellist.itemsDetail[c].selected = false;
                        $scope.hide(c);
                    }
                }
            }
            $scope.hide = function (param) {

                var setHideButton = false;
                for (var c = 0; c <= $scope.filterModellist.itemsDetail.length - 1; c++) {
                    if (!setHideButton) {

                        if ($scope.filterModellist.itemsDetail[c].selected == true) {
                            setHideButton = true;
                        }

                    }
                }
                $scope.checkbox.Show = (setHideButton == true) ? false : true;
                $scope.countRow();
            };

            $scope.countRow = function () {
                $scope.countdataRow = 0;
                let data = $scope.filterModellist.itemsDetail.filter(c => c.selected);
                for (let index = 0; index < data.length; index++) {
                    $scope.countdataRow = $scope.countdataRow + data[index].countOrder;

                }
                if ($scope.countdataRow > 0) {
                    $scope.ready = true;
                } else {
                    $scope.ready = false;
                }
            };

            $scope.dropdownRound = function () {
                viewModel.dropdownRound($scope.filterModel).then(function (res) {
                    $scope.dropdownRound = res.data;
                });
            };

            $scope.dropdownTime = function () {
                viewModel.dropdownTime($scope.filterModel).then(function (res) {
                    $scope.dropdownTime = res.data;
                });
            };

            $scope.show = {
                action: true,
                pagination: true,
                checkBox: false
            }
            $scope.model = {
                currentPage: 1,
                numPerPage: 50,
                totalRow: 0
            };
            $scope.checkbox = {
                Show: true
            };

            function getToday() {
                var today = new Date();

                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();


                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }

            function getTime() {
                var Minute = new Date().getMinutes();
                var Hour = new Date().getHours();

                if (Minute < 10) Minute = '0' + Minute;

                return Hour.toString() + ':' + Minute.toString()
            }

            $vm.$onInit = function () {
                $vm = this;
                $scope.filterModel = {};
                $scope.countdataRow = 0;
                $scope.ready = false;
                $scope.dropdownRound();
                $scope.dropdownTime();
                $scope.userName = localStorageService.get('userTokenStorage');
            }







        }
    })
})();