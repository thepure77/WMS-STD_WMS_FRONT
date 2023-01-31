(function () {
    'use strict';
    app.component('giWaveForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/GIWave/component/giWaveForm.html";
        },
        bindings: {
            scanReceive: '=?',
            onShow: '=?'
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, giWaveFactory, webServiceAPI) {
            var $vm = this;
            var defer = {};
            var viewModel = giWaveFactory;

            $scope.filterModel = {
                callroll: false,
                buttoncall: false,
            };

            $scope.header = {
                callroll: false,
                buttoncall: false,
            };

            $scope.hide = true;
            $scope.selectnextstep = function (param) {
                $scope.hide = true;
                if ($scope.Run == true) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณารอ wave ทำงานเสร็จก่อนเลือก wave รอบถัดไป'
                        }
                    )
                }
                let data = $scope.filterModellist.checkStatusWavemodel.find(c => c.isUser);
                if (data) {
                    data.isUser = false;
                }
                param.isUser = true;
                $scope.selectnext = true;
                param.planGoodsIssue_Due_Date = $scope.filterModel.planGoodsIssue_Due_Date;
                param.round_id = param.wave_Round;

                pageLoading.show();
                viewModel.CheckbyWave(param).then(function (res) {
                    pageLoading.hide()
                    $scope.mess = 'Done';
                    if (res.data.resultIsUse) {
                        if(res.data.fixwavemode=''){$scope.hide = true;}else{$scope.hide = false;}
                        $scope.filterModellist.checkWaveDipmodel = res.data.checkWaveDipmodel;
                        $scope.filterModellist.checkWaveDipbyWavemodel = res.data.checkWaveDipbyWavemodel;
                        $scope.filterModellist.fixwavemodel = res.data.fixwavemodel;
                        $scope.filterModellist.checktagByGi = res.data.checktagByGimodel;
                        $scope.filterModellist.fixWave_Count = res.data.fixWave_Count;
                        $scope.filterModel.goodsIssue_No = param.goodsIssue_No;
                        $scope.filterModel.goodsIssue_Index = param.goodsIssue_Index;

                        $scope.filterModellist.ready = res.data.ready;
                    } else {
                        $scope.Run = false;
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: res.data.resultMsg
                            }
                        )
                    }
                },
                    function error(param) {
                        pageLoading.hide()
                        $scope.Run = false;
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'กรุณาติดต่อ Admin'
                            }
                        )
                    });

                    $scope.selectchecktag = function (param) {
                        let data = $scope.filterModellist.checkStatusWavemodel.find(c => c.isUser);
                        if (data) {
                            data.isUser = false;
                        }
                        param.isUser = true;
                        $scope.selectnext = true;
                        pageLoading.show();

                        if(param.detail == "Case Update"){
                            viewModel.checktagGi(param).then(function (res) {
                                pageLoading.hide()
                                $scope.mess = 'Done';
                                if (res.data.resultIsUse) {
                                    $scope.hide = true;
                                    $scope.filterModel.binBalance_Index = param.binbalance_index;
                                    $scope.filterModel.binBalance_QtyBal = param.binBalance_QtyBal;
                                    $scope.filterModel.binBalance_QtyReserve = param.binBalance_QtyReserve;
                                    $scope.filterModel.gI_TotalQty = param.gI_TotalQty;

                                    $scope.filterModellist.checktaggimodel = res.data.checktaggimodel;
                                    $scope.filterModellist.checktagtfmodel = res.data.checktagtfmodel;
                                    $scope.filterModellist.ready = res.data.ready;
                                    
                                } else {
                                    $scope.Run = false;
                                    return dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'แจ้งเตือน',
                                            message: res.data.resultMsg
                                        }
                                    )
                                }
                            });
                        }
                        else if(param.detail == "Case Delete"){
                            viewModel.checktagByGi(param).then(function (res) {
                                pageLoading.hide()
                                $scope.mess = 'Done';
                                if (res.data.resultIsUse) {
                                    $scope.hide = true;
                                    $scope.filterModel.goodsIssueItemLocation_Index = param.goodsIssueItemLocation_Index;
                                    $scope.filterModellist.checktagbygimodel = res.data.checktagbygimodel;
                                    $scope.filterModellist.ready = res.data.ready;
                                    
                                } else {
                                    $scope.Run = false;
                                    return dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'แจ้งเตือน',
                                            message: res.data.resultMsg
                                        }
                                    )
                                }
                            });
                        }
                    }
        
                    $scope.selectgoodsIssueItemLocation = function (param) {
                        let data = $scope.filterModellist.checkStatusWavemodel.find(c => c.isUser);
                        if (data) {
                            data.isUser = false;
                        }
                        param.isUser = true;
                        $scope.selectnext = true;
                        pageLoading.show();

                            viewModel.checktagByGi(param).then(function (res) {
                                pageLoading.hide()
                                $scope.mess = 'Done';
                                if (res.data.resultIsUse) {
                                    debugger
                                    $scope.filterModel.goodsIssue_No = param.goodsIssue_No;
                                    $scope.filterModel.goodsIssue_Index = param.goodsIssue_Index;
                                    $scope.filterModel.goodsIssueItemLocation_Index = param.goodsIssueItemLocation_Index;

                                    $scope.filterModellist.checktagbygimodel = res.data.checktagbygimodel;
                                    $scope.filterModellist.ready = res.data.ready;
                                    
                                } else {
                                    $scope.Run = false;
                                    return dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'แจ้งเตือน',
                                            message: res.data.resultMsg
                                        }
                                    )
                                }
                            });
                    }

                    $scope.repaireBinBalance = function () {
                        dpMessageBox.confirm({
                            ok: 'OK',
                            cancel: 'Close',
                            title: 'MSG_SURE_data',
                            message: 'Do you want to repair BinBalance'
                        }).then(function () {
                            $scope.Run = true;
                            pageLoading.show();
                            $scope.mess = 'Processing';
                            $scope.filterModel.create_By = localStorageService.get('userTokenStorage');
                            viewModel.updatebinbalance($scope.filterModel).then(function (res) {
                                pageLoading.hide()
                                $scope.mess = 'Done';
                                $scope.filterSearch();
                                // $scope.filterModellist = {};
                                if (res.data.resultIsUse) {
                                    $scope.filterModellist.fixwavemodel = res.data.fixwavemodel;
                                    $scope.filterModellist.fixWave_Count = res.data.fixWave_Count;
                                    $scope.filterModellist.ready = res.data.ready;
                                    $scope.Run = false;
                                    return dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'แจ้งเตือน',
                                            message: 'Complete'
                                        }
                                    )
                                } else {
                                    $scope.Run = false;
                                    return dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'แจ้งเตือน',
                                            message: res.data.resultMsg
                                        }
                                    )
                                }
                            },
                                function error(param) {
                                    pageLoading.hide()
                                    $scope.Run = false;
                                    return dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'แจ้งเตือน',
                                            message: 'กรุณาติดต่อ Admin'
                                        }
                                    )
                                });
                        },
                            function error(param) {
                                pageLoading.hide()
                                $scope.Run = false;
                                return dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: 'กรุณาติดต่อ Admin'
                                    }
                                )
                            });
        
                    };
                    
                    $scope.repaireGoodsIssueItemLocation = function () {
                        dpMessageBox.confirm({
                            ok: 'OK',
                            cancel: 'Close',
                            title: 'MSG_SURE_data',
                            message: 'Do you want to repair GoodsIssueItemLocation'
                        }).then(function () {
                            $scope.Run = true;
                            pageLoading.show();
                            $scope.mess = 'Processing';
                            $scope.filterModel.create_By = localStorageService.get('userTokenStorage');
                            viewModel.deletegoodsIssueitemlocation($scope.filterModel).then(function (res) {
                                pageLoading.hide()
                                $scope.mess = 'Done';
                                $scope.filterSearch();
                                // $scope.filterModellist = {};
                                if (res.data.resultIsUse) {

                                    
                                    $scope.filterModellist.fixwavemodel = res.data.fixwavemodel;
                                    $scope.filterModellist.fixWave_Count = res.data.fixWave_Count;
                                    $scope.filterModellist.ready = res.data.ready;
                                    $scope.Run = false;
                                    return dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'แจ้งเตือน',
                                            message: 'Complete'
                                        }
                                    )
                                } else {
                                    $scope.Run = false;
                                    return dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'แจ้งเตือน',
                                            message: res.data.resultMsg
                                        }
                                    )
                                }
                            },
                                function error(param) {
                                    pageLoading.hide()
                                    $scope.Run = false;
                                    return dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'แจ้งเตือน',
                                            message: 'กรุณาติดต่อ Admin'
                                        }
                                    )
                                });
                        },
                            function error(param) {
                                pageLoading.hide()
                                $scope.Run = false;
                                return dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: 'กรุณาติดต่อ Admin'
                                    }
                                )
                            });
        
                    };
                
                debugger
                if (param.gI_status == 2 && param.taskGI_status == 0) {
                    $scope.task = true;
                    $scope.tag = false;
                    $scope.wcs = false;
                    $scope.wcs_repair = false;
                    $scope.picking = false;
                } else if (param.taskGI_status == 2 && param.tagOut_status == 0) {
                    $scope.task = false;
                    $scope.tag = true;
                    $scope.wcs = false;
                    $scope.wcs_repair = false;
                    $scope.picking = false;
                } else if (param.gI_status == 2 && param.taskGI_status == 2 && param.tagOut_status == 1 && param.wcS_status == 0) {
                    $scope.task = false;
                    $scope.tag = false;
                    $scope.wcs = false;
                    $scope.wcs_repair = false;
                    $scope.picking = true;
                } else if (param.gI_status == 3 && param.taskGI_status == 2 && param.tagOut_status == 1 && param.wcS_status == 0) {
                    $scope.task = false;
                    $scope.tag = false;
                    $scope.wcs = true;
                    $scope.wcs_repair = false;
                    $scope.picking = false;
                } else if (param.gI_status == 3 && param.taskGI_status == 2 && param.tagOut_status == 1 && param.wcS_status == 15) {
                    $scope.task = false;
                    $scope.tag = false;
                    $scope.wcs = false;
                    $scope.wcs_repair = true;
                    $scope.picking = false;
                } else {
                    $scope.task = false;
                    $scope.tag = false;
                    $scope.wcs = false;
                    $scope.wcs_repair = false;
                    $scope.picking = false;
                }
            }

            $scope.chkIsuse = function (param) {
                if (param.isUser) {
                    return "#99FF66"
                }
            }

            $scope.selectedTabTable = function (t) {
                if (t == 1) {
                    $scope.colortable1 = "#999999";
                    $scope.colortable2 = "#e5e5e5";
                    $scope.colortable3 = "#e5e5e5";
                    $scope.colortable4 = "#e5e5e5";
                    $scope.colortable5 = "#e5e5e5";
                }
                else if (t == 2) {
                    $scope.colortable1 = "#e5e5e5";
                    $scope.colortable2 = "#999999";
                    $scope.colortable3 = "#e5e5e5";
                    $scope.colortable4 = "#e5e5e5";
                    $scope.colortable5 = "#e5e5e5";
                } 
                else if (t == 3) {
                    $scope.colortable1 = "#e5e5e5";
                    $scope.colortable2 = "#e5e5e5";
                    $scope.colortable3 = "#999999";
                    $scope.colortable4 = "#e5e5e5";
                    $scope.colortable5 = "#e5e5e5";
                } 
                else if (t == 4) {
                    $scope.colortable1 = "#e5e5e5";
                    $scope.colortable2 = "#e5e5e5";
                    $scope.colortable3 = "#e5e5e5";
                    $scope.colortable4 = "#999999";
                    $scope.colortable5 = "#e5e5e5";
                } 
                else if (t == 5) {
                    $scope.colortable1 = "#e5e5e5";
                    $scope.colortable2 = "#e5e5e5";
                    $scope.colortable3 = "#e5e5e5";
                    $scope.colortable4 = "#e5e5e5";
                    $scope.colortable5 = "#999999";
                }
                $scope.selectedTable = t;
            }

            $scope.select = function (param) {
                if ($scope.Run == true) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณารอ wave ทำงานเสร็จก่อนเลือก wave รอบถัดไป'
                        }
                    )
                }
                let data = $scope.filterModellist.checkWave_Roundmodel.find(c => c.isUser);
                if (data) {
                    data.isUser = false;
                }
                if (param.ready) {
                    $scope.ready = true;
                }

                param.isUser = true;
                $scope.checkdata = true;
                $scope.Run = false;
            }


            $scope.filterSearch = function () {
                $scope.filterModel;
                if ($scope.dropdownRound.model != undefined) {
                    $scope.filterModel.round_Index = $scope.dropdownRound.model.round_Index;
                    $scope.filterModel.round_Id = $scope.dropdownRound.model.round_Id;
                    $scope.filterModel.round_Name = $scope.dropdownRound.model.round_Name;
                } else {
                    $scope.filterModel.round_Index = undefined;
                    $scope.filterModel.round_Id = undefined;
                    $scope.filterModel.round_Name = undefined;

                }
                if ($scope.filterModel.planGoodsIssue_Due_Date == undefined) {
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
                        $scope.wcs = false;
                        $scope.wcs_repair = false;
                    } else {
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: resultMsg
                            }
                        )
                    }
                });
            };

            $scope.Gentask = function (param) {
                let data = $scope.filterModellist.checkStatusWavemodel.find(c => c.isUser);
                if (data == undefined) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: "กรุณาเลือก ข้อมูลที่จะสร้าง"
                        }
                    )
                }
                data.log_udf_2 = getToday();
                data.log_udf_3 = getTime();
                data.operations = "Gen task";
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยันสถานนะ',
                    message: 'คุณต้องการสร้างข้อมูลใช่หรือไม่'
                }).then(function () {
                    $scope.Run = false;
                    $scope.task = false;
                    $scope.tag = false;
                    pageLoading.show()
                    param.operations = "CLOSE";
                    $scope.Run = true;
                    $scope.mess = 'Processing';
                    viewModel.autoTaskByRound(data).then(function (res) {
                        pageLoading.show();
                        $scope.Run = false;
                        $scope.task = false;
                        $scope.tag = false;
                        $scope.mess = 'Done';
                        data.log_udf_4 =getToday();
                        data.log_udf_5 =getTime();
                        if (res.data.resultIsUse) {
                            data.operations = data.operations+" : Success";
                            viewModel.savelogsRequest(data).then(function () {
                            });
                            $scope.filterSearch();
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'Success',
                                    message: "Success"
                                }
                            )
                        } else {
                            data.operations = data.operations+" : "+res.data.resultMsg;
                            viewModel.savelogsRequest(data).then(function () {
                            });
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: res.data.resultMsg
                                }
                            )
                        }
                    },
                        function error(response) {
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: "Error API"
                                }
                            )
                        });
                });
            };

            $scope.Make_tagout_V3 = function (param) {
                let data = $scope.filterModellist.checkStatusWavemodel.find(c => c.isUser);
                if (data == undefined) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: "กรุณาเลือก ข้อมูลที่จะสร้าง"
                        }
                    )
                }
                data.log_udf_2 = getToday();
                data.log_udf_3 = getTime();
                data.operations = "Gen tagout";
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยันสถานนะ',
                    message: 'คุณต้องการสร้างข้อมูลใช่หรือไม่'
                }).then(function () {
                    $scope.Run = false;
                    $scope.task = false;
                    $scope.tag = false;
                    pageLoading.show()
                    param.operations = "CLOSE";
                    $scope.Run = true;
                    $scope.mess = 'Processing';
                    viewModel.Make_tagout_V3(data).then(function (res) {
                        data.log_udf_4 = getToday();
                        data.log_udf_5 = getTime();
                        if (res.data) {
                            data.operations = data.operations+" : Success";
                            viewModel.savelogsRequest(data).then(function () {
                            });
                            // $scope.temp_WCS = {}
                            // $scope.temp_WCS.docNo = data.goodsIssue_No
                            $scope.Run = false;
                            $scope.task = false;
                            $scope.tag = false;
                            pageLoading.hide()
                            $scope.mess = 'Done';
                            // if (res.data == "create_success") {
                            $scope.filterSearch();
                                return dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'Success',
                                        message: "Success"
                                    }
                                )
                            // } else {
                            //     return dpMessageBox.alert(
                            //         {
                            //             ok: 'Close',
                            //             title: 'ALERT',
                            //             message: 'Call Admin'
                            //         }
                            //     )
                            // }
                            // viewModel.gen_wcs_TEMP($scope.temp_WCS).then(function (res) {


                            // },
                            //     function error(response) {
                            //         return dpMessageBox.alert(
                            //             {
                            //                 ok: 'Close',
                            //                 title: 'ALERT',
                            //                 message: "Error API WCS"
                            //             }
                            //         )
                            //     });
                        } else {
                            data.operations = data.operations+" : "+res.data.resultMsg;
                            viewModel.savelogsRequest(data).then(function () {
                            });
                            $scope.Run = false;
                            $scope.task = false;
                            $scope.tag = false;
                            // pageLoading.hide()
                            $scope.mess = 'Done';
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: res.data.resultMsg
                                }
                            )
                        }

                    },
                        function error(response) {
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: "Error API"
                                }
                            )
                        });
                });
            };

            $scope.picking_plan = function (param) {
                debugger
                let data = $scope.filterModellist.checkStatusWavemodel.find(c => c.isUser);
                if (data == undefined) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: "กรุณาเลือก ข้อมูลที่จะสร้าง"
                        }
                    )
                }
                data.log_udf_2 = getToday();
                data.log_udf_3 = getTime();
                data.operations = "Picking plan";
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยันสถานนะ',
                    message: 'คุณต้องการสร้างข้อมูลใช่หรือไม่'
                }).then(function () {
                    $scope.Run = false;
                    $scope.task = false;
                    $scope.tag = false;
                    $scope.wcs = false;
                    $scope.wcs_repair = false;
                    $scope.picking = false;
                    pageLoading.show()
                    // $scope.Run = true;
                    $scope.mess = 'Processing';

                    viewModel.gen_picking_plan(data).then(function (res) {
                        $scope.Run = false;
                        $scope.task = false;
                        $scope.tag = false;
                        $scope.wcs = false;
                        $scope.wcs_repair = false;
                        $scope.picking = false;
                        pageLoading.hide()
                        $scope.mess = 'Done';
                        data.log_udf_4 = getToday();
                        data.log_udf_5 = getTime();
                        if (res.data.resultIsUse) {
                            data.operations = data.operations+" : Success";
                            viewModel.savelogsRequest(data).then(function () {
                            });
                            $scope.filterSearch();
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'Success',
                                    message: "Success"
                                }
                            )
                        } else {
                            data.operations = data.operations+" : "+res.data.resultMsg;
                            viewModel.savelogsRequest(data).then(function () {
                            });
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: res.data.resultMsg
                                }
                            )
                        }

                    },
                        function error(response) {
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: "Error API"
                                }
                            )
                        });
                });
            };

            $scope.gen_wcs = function (param) {
                debugger
                let data = $scope.filterModellist.checkStatusWavemodel.find(c => c.isUser);
                if (data == undefined) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: "กรุณาเลือก ข้อมูลที่จะสร้าง"
                        }
                    )
                }
                data.log_udf_2 = getToday();
                data.log_udf_3 = getTime();
                data.operations = "Gen robot";
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยันสถานนะ',
                    message: 'คุณต้องการส่งคำสั่ง Robot ใช่หรือไม่'
                }).then(function () {
                    $scope.Run = false;
                    $scope.task = false;
                    $scope.tag = false;
                    $scope.wcs = false;
                    $scope.wcs_repair = false;
                    $scope.picking = false;
                    pageLoading.show()
                    // $scope.Run = true;
                    $scope.mess = 'Processing';
                    $scope.modelwcs = {}
                    $scope.modelwcs.docNo = data.goodsIssue_No;
                    data.log_udf_4 =getToday();
                    data.log_udf_5 =getTime();
                    viewModel.gen_wcs($scope.modelwcs).then(function (res) {
                        $scope.Run = false;
                        $scope.task = false;
                        $scope.tag = false;
                        $scope.wcs = false;
                        $scope.wcs_repair = false;
                        $scope.picking = false;
                        pageLoading.hide()
                        $scope.mess = 'Done';
                        if (res.data.status == "10") {
                            data.operations = data.operations+" : Success";
                            viewModel.savelogsRequest(data).then(function () {
                            });
                            $scope.filterSearch();
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'Success',
                                    message: "Success"
                                }
                            )
                        } else {
                            data.operations = data.operations+" : "+res.data.message.description;
                            viewModel.savelogsRequest(data).then(function () {
                            });
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: res.data.message.description
                                }
                            )
                        }

                    },
                        function error(response) {
                            $scope.mess = 'Error';
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: "Error API"
                                }
                            )
                        });
                });
            };

            $scope.gen_wcs_repair = function (param) {
                debugger
                let data = $scope.filterModellist.checkStatusWavemodel.find(c => c.isUser);
                if (data == undefined) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: "กรุณาเลือก ข้อมูลที่จะสร้าง"
                        }
                    )
                }
                data.log_udf_2 = getToday();
                data.log_udf_3 = getTime();
                data.operations = "Gen repair robot";
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยันสถานนะ',
                    message: 'คุณต้องซ่อมการส่งคำสั่ง Robot ใช่หรือไม่'
                }).then(function () {
                    $scope.Run = false;
                    $scope.task = false;
                    $scope.tag = false;
                    $scope.wcs = false;
                    $scope.wcs_repair = false;
                    $scope.picking = false;
                    pageLoading.show()
                    // $scope.Run = true;
                    $scope.mess = 'Processing';
                    $scope.modelwcs = {}
                    $scope.modelwcs.docNo = data.goodsIssue_No;
                    data.log_udf_4 =getToday();
                    data.log_udf_5 =getTime();
                    viewModel.gen_wcs_repair($scope.modelwcs).then(function (res) {
                        $scope.Run = false;
                        $scope.task = false;
                        $scope.tag = false;
                        $scope.wcs = false;
                        $scope.wcs_repair = false;
                        $scope.picking = false;
                        pageLoading.hide()
                        $scope.mess = 'Done';
                        if (res.data.status == "10") {
                            data.operations = data.operations+" : Success";
                            viewModel.savelogsRequest(data).then(function () {
                            });
                            $scope.filterSearch();
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'Success',
                                    message: "Success"
                                }
                            )
                        } else {
                            data.operations = data.operations+" : "+res.data.message.description;
                            viewModel.savelogsRequest(data).then(function () {
                            });
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: res.data.message.description
                                }
                            )
                        }

                    },
                        function error(response) {
                            $scope.mess = 'Error';
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: "Error API"
                                }
                            )
                        });
                });
            };

            $scope.Runwave = function () {
                $scope.filterModel;
                $scope.filterModel.log_udf_2 = getToday();
                $scope.filterModel.log_udf_3 = getTime();
                $scope.filterModel.operations = "Runwave";

                let data = $scope.filterModellist.checkWave_Roundmodel.find(c => c.isUser);
                if (data == undefined) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณาเลือก รอบที่จะทำการหยิบสินค้า'
                        }
                    )
                } else {
                    $scope.filterModel.round_Id = data.round_Id;
                    $scope.filterModel.round_Name = data.round_Name;
                }

                if ($scope.filterModel.planGoodsIssue_Due_Date == undefined) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณาเลือก วันที่ ที่จะค้นหา'
                        }
                    )
                }


                dpMessageBox.confirm({
                    ok: 'OK',
                    cancel: 'Close',
                    title: 'MSG_SURE_data',
                    message: 'Do you want to wave'
                }).then(function () {
                    $scope.Run = true;
                    pageLoading.show();
                    $scope.mess = 'Processing';
                    $scope.filterModel.create_By = localStorageService.get('userTokenStorage');
                    viewModel.RunWaveByRound($scope.filterModel).then(function (res) {
                        pageLoading.hide()
                        $scope.mess = 'Done';
                        $scope.filterSearch();
                        $scope.filterModel.log_udf_4 =getToday();
                        $scope.filterModel.log_udf_5 =getTime();
                        // $scope.filterModellist = {};
                        if (res.data.resultIsUse) {
                            $scope.filterModel.operations = $scope.filterModel.operations+" : Complete";
                            viewModel.savelogsRequest($scope.filterModel).then(function () {
                            });
                            $scope.filterModellist.checkWaveDipmodel = res.data.checkWaveDipmodel;
                            $scope.filterModellist.checkWaveDipbyWavemodel = res.data.checkWaveDipbyWavemodel;
                            $scope.filterModellist.goodsIssue_No = res.data.goodsIssue_No;
                            $scope.filterModellist.goodsIssue_Index = res.data.goodsIssue_Index;
                            $scope.filterModellist.ready = res.data.ready;

                            $scope.Run = false;
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'Complete'
                                }
                            )
                        } else {
                            $scope.filterModel.operations = $scope.filterModel.operations+" : "+res.data.resultMsg;
                            viewModel.savelogsRequest($scope.filterModel).then(function () {
                            });
                            $scope.Run = false;
                            $scope.mess = 'Error';
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: res.data.resultMsg
                                }
                            )
                        }
                    },
                        function error(param) {
                            $scope.mess = 'Error';
                            pageLoading.hide()
                            $scope.Run = false;
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'กรุณาติดต่อ Admin'
                                }
                            )
                        });
                },
                    function error(param) {
                        pageLoading.hide()
                        $scope.Run = false;
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'กรุณาติดต่อ Admin'
                            }
                        )
                    });

            };

            $scope.repaireWave = function () {
                $scope.filterModel;
                let data = $scope.filterModellist.checkStatusWavemodel.find(c => c.isUser);
                if (data == undefined) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณาเลือก รอบที่จะทำการซ่อม Wave'
                        }
                    )
                } else {
                    $scope.filterModel.round_Id = data.round_id;
                    $scope.filterModel.goodsIssue_Index = data.goodsIssue_Index;
                }

                if ($scope.filterModel.planGoodsIssue_Due_Date == undefined) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณาเลือก วันที่ จะทำการซ่อม Wave'
                        }
                    )
                }


                dpMessageBox.confirm({
                    ok: 'OK',
                    cancel: 'Close',
                    title: 'MSG_SURE_data',
                    message: 'Do you want to repair wave'
                }).then(function () {
                    $scope.Run = true;
                    pageLoading.show();
                    $scope.mess = 'Processing';
                    $scope.filterModel.create_By = localStorageService.get('userTokenStorage');
                    viewModel.autoWaveByRound($scope.filterModel).then(function (res) {
                        pageLoading.hide()
                        $scope.mess = 'Done';
                        $scope.filterSearch();
                        // $scope.filterModellist = {};
                        if (res.data.resultIsUse) {
                            $scope.filterModellist.checkWaveDipmodel = res.data.checkWaveDipmodel;
                            $scope.filterModellist.checkWaveDipbyWavemodel = res.data.checkWaveDipbyWavemodel;
                            $scope.filterModellist.goodsIssue_No = res.data.goodsIssue_No;
                            $scope.filterModellist.goodsIssue_Index = res.data.goodsIssue_Index;
                            $scope.filterModellist.ready = res.data.ready;

                            $scope.Run = false;
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'Complete'
                                }
                            )
                        } else {
                            $scope.Run = false;
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: res.data.resultMsg
                                }
                            )
                        }
                    },
                        function error(param) {
                            pageLoading.hide()
                            $scope.Run = false;
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'กรุณาติดต่อ Admin'
                                }
                            )
                        });
                },
                    function error(param) {
                        pageLoading.hide()
                        $scope.Run = false;
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'กรุณาติดต่อ Admin'
                            }
                        )
                    });

            };

            $scope.exportbywave = function (param) {
                pageLoading.show();
                var createXLSLFormatObj = [];
                $scope.ResultData = {};
                $scope.ResultData = param;
                // $scope.ResultData = res.data.checklocation_PPmodel;
                /* XLS Head Columns */
                var xlsHeader = ["Shipment No", "Appointment No", "Dock", "Booking Date", "Time", "PlanGoodsissue No", "ShipTo ID", "ShipTo Name", "Branch Code", "Product ID", "Product Name", "Order Qty", "Unit", "Order Claim Return"];

                /* XLS Rows Data */
                var xlsRows = [];
                var number = 1;
                $scope.ResultData.forEach(e => {
                    xlsRows.push({
                        // "No": number
                        "Shipment No": e.truckLoad_No
                        , "Appointment No": e.appointment_Id
                        , "Dock": e.dock_Name
                        , "Booking Date": e.appointment_Date
                        , "Time": e.appointment_Time
                        , "PlanGoodsissue No": e.planGoodsIssue_No
                        , "ShipTo ID": e.shipTo_Id
                        , "ShipTo Name": e.shipTo_Name
                        , "Branch Code": e.branchCode
                        , "Product ID": e.product_Id
                        , "Product Name": e.product_Name
                        , "Order Qty": e.order_Qty
                        , "Unit": e.order_Unit
                        , "Order Claim Return": e.flag_ClaimReturn

                    });
                    number++
                });

                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();
                var Minute = today.getMinutes();
                var Hour = today.getHours();

                if (Minute < 10) Minute = '0' + Minute;

                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                var datetime = yyyy.toString() + mm.toString() + dd.toString() + Hour.toString() + Minute.toString();

                createXLSLFormatObj.push(xlsHeader);
                $.each(xlsRows, function (index, value) {
                    var innerRowData = [];
                    $.each(value, function (ind, val) {
                        innerRowData.push(val);
                    });
                    createXLSLFormatObj.push(innerRowData);
                });
                pageLoading.hide();
                JSONToCSVConvertor(createXLSLFormatObj, "exportbywave");



            }

            $scope.exportallwave = function (param) {
                pageLoading.show();
                var createXLSLFormatObj = [];
                $scope.ResultData = {};

                $scope.ResultData = param;
                // $scope.ResultData = res.data.checklocation_PPmodel;
                /* XLS Head Columns */
                var xlsHeader = ["Appointment No", "Booking Date", "Time", "Shipment No", "Order Seq", "PlanGoodsissue No", "LineNum", "Product ID", "Product Name", "BU Order total qty", "BU GI Total qty", "SU order total qty", "SU GI total qty", "SU Unit", "ERP Location", "Product lot", "SU Diff", "GI No", "Remark", "DocumentRef No", "Order Claim Return"];

                /* XLS Rows Data */
                var xlsRows = [];
                var number = 1;
                $scope.ResultData.forEach(e => {
                    xlsRows.push({
                        // "No": number
                        "Appointment No": e.appointment_Id
                        , "Booking Date": e.appointment_Date
                        , "Time": e.appointment_Time
                        , "Shipment No": e.truckLoad_No
                        , "Order Seq": e.order_Seq
                        , "PlanGoodsissue No": e.planGoodsIssue_No
                        , "LineNum": e.lineNum
                        , "Product ID": e.product_Id
                        , "Product Name": e.product_Name
                        , "BU Order total qty": e.bU_Order_TotalQty
                        , "BU GI Total qty": e.bU_GI_TotalQty
                        , "SU order total qty": e.sU_Order_TotalQty
                        , "SU GI total qty": e.sU_GI_TotalQty
                        , "SU Unit": e.sU_Unit
                        , "ERP Location": e.erP_Location
                        , "Product lot": e.product_Lot
                        , "SU Diff": e.sU_Diff
                        , "GI No": e.goodsIssue_No
                        , "Remark": e.document_Remark
                        , "DocumentRef No": e.documentRef_No3
                        , "Order Claim Return": e.flag_ClaimReturn

                    });
                    number++
                });

                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();
                var Minute = today.getMinutes();
                var Hour = today.getHours();

                if (Minute < 10) Minute = '0' + Minute;

                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                var datetime = yyyy.toString() + mm.toString() + dd.toString() + Hour.toString() + Minute.toString();

                createXLSLFormatObj.push(xlsHeader);
                $.each(xlsRows, function (index, value) {
                    var innerRowData = [];
                    $.each(value, function (ind, val) {
                        innerRowData.push(val);
                    });
                    createXLSLFormatObj.push(innerRowData);
                });
                pageLoading.hide();
                JSONToCSVConvertor(createXLSLFormatObj, "exportallwave");

            }

            function JSONToCSVConvertor(JSONData, ShowLabel) {
                //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
                var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

                var CSV = '';

                //1st loop is to extract each row
                for (var i = 0; i < arrData.length; i++) {
                    var row = "";

                    //2nd loop will extract each column and convert it in string comma-seprated
                    for (var index in arrData[i]) {
                        row += '"' + arrData[i][index] + '",';
                    }

                    row.slice(0, row.length - 1);

                    //add a line break after each row
                    CSV += row + '\r\n';
                }

                if (CSV == '') {
                    alert("Invalid data");
                    return;
                }

                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();
                var Minute = today.getMinutes();
                var Hour = today.getHours();

                if (Minute < 10) Minute = '0' + Minute;

                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                var datetime = yyyy.toString() + mm.toString() + dd.toString() + Hour.toString() + Minute.toString();
                //Generate a file name
                var fileName = ShowLabel + "_" + datetime;
                var uri = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(CSV);

                var link = document.createElement("a");
                link.href = uri;

                link.style = "visibility:hidden";
                link.download = fileName + ".csv";

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }


            $scope.clickTab = function (tab) {
                $scope.click = tab;
            }


            $scope.dropdownRound = function () {
                viewModel.dropdownRound($scope.filterModel).then(function (res) {
                    $scope.dropdownRound = res.data;
                });
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
                $scope.checkdata = false;
                $scope.Run = false;
                $scope.ready = false;
                $scope.selectnext = false;
                $scope.task = false;
                $scope.tag = false;
                $scope.wcs = false;
                $scope.wcs_repair = false;
                $scope.picking = false;
                $scope.mess = undefined;
                $scope.selectedTabTable(1);
                $scope.dropdownRound();
            }







        }
    })
})();