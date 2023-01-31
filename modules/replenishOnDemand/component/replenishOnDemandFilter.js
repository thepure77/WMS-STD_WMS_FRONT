(function () {
    'use strict';
    app.component('replenishOnDemandFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/replenishOnDemand/component/replenishOnDemandFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isDisabledReplenish: '=?',
            checkAllItems:'=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, dpMessageBox, commonService, replenishOndemandFactory,transferFactory,webServiceAPI,localStorageService) {
            var $vm = this;
            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = replenishOndemandFactory;
            var viewModelTransfer = transferFactory;
            var model = $scope.filterModel;

            $scope.waveround = [];
            $scope.wave_date_temp = "";
            $scope.disable_bypass = true;
            $vm.isDisabledReplenish = true;
            //$scope.getTranferOnDemand();
            ///mock up data
            // $scope.data_list = [
            //     {
            //                     rowIndex: "51",
            //             product_Id: "1002701",
            //             product_Name: "แมคคาเดเมียอบเกลือ ตราคาเฟ่ อเมซอน(6",
            //             su_Ratio: 1.000000,
            //             bu_Order_Qty: 1000.000000,
            //             order_Qty: 1000.000000,
            //             order_Unit: "PAC",
            //             su_Order_Qty: 12.00,
            //             su_Order_Unit: "PAC",
            //             su_Weight: 0.290000,
            //             su_GrsWeight: 0.295000,
            //             su_W: 17.000000,
            //             su_L: 25.000000,
            //             su_H: 8.000000,
            //             maxPiecePick: 96,
            //             minPiecePick: 48,
            //             isPiecePick: "X",
            //             qtyInPiecePick: 3.00,
            //             qtyInBAL: 744.00,
            //             su_QtyInASRS: 246.000000,
            //             su_QtyInPiecePick: 3.000000,
            //             su_QtyInRepleLocation: 498.000000,
            //             su_QtyInBal: 744.000000,
            //             diff_QtyPiecePickWithOrder: 997,
            //             diff_SU_QtyPiecePickWithOrder: 0,
            //             diff_RepleLocation: 93.000000,
            //             configMaxReple: 96,
            //             configMinReple: 48
            //     },
            //     {
            //             rowIndex: "3",
            //             product_Id: "1000149",
            //             product_Name: "กล่องอคริลิคใส่ทิชชู่ อเมซอน",
            //             su_Ratio: 1.000000,
            //             bu_Order_Qty: 120.000000,
            //             order_Qty: 120.000000,
            //             order_Unit: "PC",
            //             su_Order_Qty: 120.000000,
            //             su_Order_Unit: "PC",
            //             su_Weight: 0.370000,
            //             su_GrsWeight: 0.370000,
            //             su_W: 1.000000,
            //             su_L: 1.000000,
            //             su_H: 11.000000,
            //             maxPiecePick: 18,
            //             minPiecePick: 5,
            //             isPiecePick: "X",
            //             qtyInPiecePick: 7.000000,
            //             qtyInBAL: 453.000000,
            //             su_QtyInASRS: 360.000000,
            //             su_QtyInPiecePick: 7.000000,
            //             su_QtyInRepleLocation: 93.000000,
            //             su_QtyInBal: 453.000000,
            //             diff_QtyPiecePickWithOrder: 113.000000,
            //             diff_SU_QtyPiecePickWithOrder: 0.000000,
            //             diff_RepleLocation: 20.000000,
            //             configMaxReple: 18,
            //             configMinReple: 5
            //     },
            //     {
            //         rowIndex: "3",
            //         product_Id: "1000149",
            //         product_Name: "กล่องอคริลิคใส่ทิชชู่ อเมซอน 2",
            //         su_Ratio: 1.000000,
            //         bu_Order_Qty: 120.000000,
            //         order_Qty: 120.000000,
            //         order_Unit: "PC",
            //         su_Order_Qty: 120.000000,
            //         su_Order_Unit: "PC",
            //         su_Weight: 0.370000,
            //         su_GrsWeight: 0.370000,
            //         su_W: 1.000000,
            //         su_L: 1.000000,
            //         su_H: 11.000000,
            //         maxPiecePick: 18,
            //         minPiecePick: 5,
            //         isPiecePick: "X",
            //         qtyInPiecePick: 7.000000,
            //         qtyInBAL: 453.000000,
            //         su_QtyInASRS: 360.000000,
            //         su_QtyInPiecePick: 7.000000,
            //         su_QtyInRepleLocation: 93.000000,
            //         su_QtyInBal: 453.000000,
            //         diff_QtyPiecePickWithOrder: 113.000000,
            //         diff_SU_QtyPiecePickWithOrder: 0.000000,
            //         diff_RepleLocation: 20.000000,
            //         configMaxReple: 18,
            //         configMinReple: 5
            //     },
               
               
            // ];

            // $scope.filter_moc = {
            //     goodsIssue_Date: "20210719",
            //     round_Wave: [
            //       {
            //         value: "01",
            //         display: "Round 1"
            //       },
            //       {
            //         value: "02",
            //         display: "Round 2"
            //       }
            //     ]
            //   };
            
            // $scope.lstReplenishOnDemand = {
            //     lstReplenishOnDemand : [
            //         {
            //             rowIndex: "51",
            //             product_Id: "1002701",
            //             product_Name: "แมคคาเดเมียอบเกลือ ตราคาเฟ่ อเมซอน(6",
            //             su_Ratio: 1.000000,
            //             bu_Order_Qty: 1000.000000,
            //             order_Qty: 1000.000000,
            //             order_Unit: "PAC",
            //             su_Order_Qty: 12.00,
            //             su_Order_Unit: "PAC",
            //             su_Weight: 0.290000,
            //             su_GrsWeight: 0.295000,
            //             su_W: 17.000000,
            //             su_L: 25.000000,
            //             su_H: 8.000000,
            //             maxPiecePick: 96,
            //             minPiecePick: 48,
            //             isPiecePick: "X",
            //             qtyInPiecePick: 3.00,
            //             qtyInBAL: 744.00,
            //             su_QtyInASRS: 246.000000,
            //             su_QtyInPiecePick: 3.000000,
            //             su_QtyInRepleLocation: 498.000000,
            //             su_QtyInBal: 744.000000,
            //             diff_QtyPiecePickWithOrder: 997,
            //             diff_SU_QtyPiecePickWithOrder: 997,
            //             diff_RepleLocation: 93.000000,
            //             configMaxReple: 96,
            //             configMinReple: 48
            //         },
            //         {
            //             rowIndex: "3",
            //             product_Id: "1000149",
            //             product_Name: "กล่องอคริลิคใส่ทิชชู่ อเมซอน",
            //             su_Ratio: 1.000000,
            //             bu_Order_Qty: 120.000000,
            //             order_Qty: 120.000000,
            //             order_Unit: "PC",
            //             su_Order_Qty: 120.000000,
            //             su_Order_Unit: "PC",
            //             su_Weight: 0.370000,
            //             su_GrsWeight: 0.370000,
            //             su_W: 1.000000,
            //             su_L: 1.000000,
            //             su_H: 11.000000,
            //             maxPiecePick: 18,
            //             minPiecePick: 5,
            //             isPiecePick: "X",
            //             qtyInPiecePick: 7.000000,
            //             qtyInBAL: 453.000000,
            //             su_QtyInASRS: 360.000000,
            //             su_QtyInPiecePick: 7.000000,
            //             su_QtyInRepleLocation: 93.000000,
            //             su_QtyInBal: 453.000000,
            //             diff_QtyPiecePickWithOrder: 113.000000,
            //             diff_SU_QtyPiecePickWithOrder: 113.000000,
            //             diff_RepleLocation: 20.000000,
            //             configMaxReple: 18,
            //             configMinReple: 5
            //         }
            //     ]
            // }
            $scope.clearSearch = function () {
                $scope.filterModel = {};
                $scope.waveround = [];
                $vm.searchResultModel = {};
                $scope.disable_bypass = true;
                $vm.isDisabledReplenish = true;
                $vm.checkAllItems = false;
                $window.scrollTo(0, 0);
            }

            $scope.getTranferOnDemand = function () {
                viewModel.getTranferOnDemand().then(function (res) {
                    $scope.goodsTransferModel = res.data;
                    $scope.filterModel.goodsTransfer_No = $scope.goodsTransferModel.goodsTransfer_No;
                    if($scope.filterModel.goodsTransfer_No != null)
                    {
                        $scope.disable_bypass = true;
                        $vm.isDisabledReplenish = true;
                        angular.forEach($vm.searchResultModel, function (value,key) {
                            value.is_disable = true;
                        })
                    }
                });
            };

            $scope.filter_wavedate = function () {
                if($scope.wave_date_temp != $scope.filterModel.goodsIssue_Date)
                {
                    $scope.wave_date_temp = $scope.filterModel.goodsIssue_Date;
                    viewModel.dropdownRoundWave($scope.filterModel).then(function (res) {
                        $scope.waveround = res.data;
                    });
                }
            };

            
            // $scope.getSearchParams = function () {
            //     return angular.copy($vm.filterModel);
            // };

            $scope.filterSearch = function (param) {
                //mockupdata
                // var aa = $scope.data_list.filter( a => (a.diff *(-1)) > a.su_QTY_On_Reple);
                // $vm.searchResultModel = $scope.data_list;
                // if(aa.length > 0)
                // {
                //     $scope.disable_bypass = false;
                //     $vm.isDisabledReplenish = true;
                // }
                // else
                // {
                //     $scope.disable_bypass = true;
                //     $vm.isDisabledReplenish = false;
                // }
                $vm.checkAllItems = false;
                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel = param;
                $scope.filterModel.totalRow = $vm.filterModel.totalRow
                $scope.filterModel.currentPage = $vm.filterModel.currentPage
                $scope.filterModel.perPage = $vm.filterModel.perPage
                $scope.filterModel.numPerPage = $vm.filterModel.numPerPage

                if($scope.filterModel.round_Wave == undefined)
                {
                //   $scope.filterModel.round_Wave = [];
                //   $scope.filterModel.round_Wave[0].value = -99;
                //   $scope.filterModel.round_Wave[0].display = "";
                }

                // if ($scope.filterModel.date != null) {
                //     $scope.convertDate();
                // }

                //$scope.filterModel = $scope.filter_moc;


                // var row_diff = $vm.searchResultModel.filter( a =>  Math.abs(a.diff_SU_QtyPiecePickWithOrder)  > a.su_QtyInRepleLocation);
                // if(row_diff.length > 0)
                // {
                //     $scope.disable_bypass = false;
                //     $vm.isDisabledReplenish = true;
                // }
                // else
                // {
                //     $scope.disable_bypass = true;
                //     $vm.isDisabledReplenish = false;
                // }
                
                // angular.forEach($vm.searchResultModel, function (value,key) {
                //     if((Math.abs(value.diff_SU_QtyPiecePickWithOrder - Math.round(value.diff_SU_QtyPiecePickWithOrder)) > 0 ))
                //     {
                //         value.is_diff = 'diff_decimal';
                //     }
                //     else if (Math.abs(value.diff_SU_QtyPiecePickWithOrder)  > value.su_QtyInRepleLocation)
                //     {
                //         value.is_diff = 'diff';
                //     }

                //     if(row_diff.length > 0)
                //     {
                //         value.is_disable = true;
                //     }
                // });
                // $scope.getTranferOnDemand();

                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    //pageLoading.hide();
                    // $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    // $vm.filterModel.currentPage = res.data.pagination.currentPage;
                    // $vm.filterModel.perPage = res.data.pagination.perPage;
                    // $vm.filterModel.numPerPage = res.data.pagination.perPage;
                    //$vm.searchResultModel = res.data.items;
                    $vm.searchResultModel = res.data;
                   if(res.data.length > 0)
                   {
                  
                        var row_diff = res.data.filter( a =>  Math.abs(a.diff_SU_QtyPiecePickWithOrder)  > a.su_QtyInRepleLocation && a.su_QtyInASRS > 0);
                        if(row_diff.length > 0)
                        {
                            $scope.disable_bypass = false;
                            $vm.isDisabledReplenish = true;
                        }
                        else
                        {
                            $scope.disable_bypass = true;
                            $vm.isDisabledReplenish = false;
                        }
                       
                        var pallettotal = 0;
                        var bypasstotal = 0;
                        angular.forEach($vm.searchResultModel, function (value,key) {

                            if((Math.abs(value.diff_SU_QtyPiecePickWithOrder - Math.round(value.diff_SU_QtyPiecePickWithOrder)) > 0 ))
                            {
                                value.is_diff = 'diff_decimal';
                                value.is_disable = true;
                            }
                            else if (Math.abs(value.diff_SU_QtyPiecePickWithOrder)  > value.su_QtyInRepleLocation)
                            {
                                if(value.su_QtyInASRS == 0)
                                {
                                    value.is_diff = 'asrs';
                                    value.is_disable = true;
                                }
                                else
                                {
                                    value.is_diff = 'diff';
                                    bypasstotal = bypasstotal + 1;
                                    if(value.pallet_Qty != "")
                                       pallettotal = pallettotal + parseInt(value.pallet_Qty);
                                }
                            }

                            if(row_diff.length > 0)
                            {
                                value.is_disable = true;
                            }
                        });

                        if(bypasstotal == 0)
                        {
                            $scope.filterModel.bypassTotal = "";
                        }
                        else
                        {
                            $scope.filterModel.bypassTotal = bypasstotal;
                        }

                        if(pallettotal == 0)
                        {
                            $scope.filterModel.palletTotal = "";
                        }
                        else
                        { 
                            $scope.filterModel.palletTotal = pallettotal;
                        }
                    }
                    $scope.getTranferOnDemand();
                    pageLoading.hide();
                });
            };
            
            $scope.createbypass = function () {
              var result_qty =  $vm.searchResultModel.filter( a => (Math.abs(a.diff_SU_QtyPiecePickWithOrder)  > a.su_QtyInRepleLocation ) && (Math.abs(a.diff_SU_QtyPiecePickWithOrder - Math.round(a.diff_SU_QtyPiecePickWithOrder)) == 0 ) && a.su_QtyInASRS > 0 );
              var resultmodel = {};
              resultmodel.lstReplenishOnDemand = result_qty;
              $scope.disable_bypass = true;
             // var  resultmodel = $scope.lstReplenishOnDemand;
                pageLoading.show();
                viewModel.create_bypassno(resultmodel).then(function (res) {
                    $scope.filterModel.goodsTransfer_No = res.data;
                    $scope.disable_bypass = true;
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Success',
                        message: 'Generate Task Success'
                    })
                    $scope.getTranferOnDemand();
                    pageLoading.hide();
                }, function error(res) {
                    pageLoading.hide();
                    $scope.disable_bypass = false;
                    var msg = res.Message;
                    if(res.Message == "")
                    {
                        msg = "Error API";
                    }
                    return dpMessageBox.alert({
                        ok: 'OK',
                        title: 'InformaTion',
                        message: msg,
                    })
                });
            };

            $scope.comfirmDocument = function (param) {
                if (param.document_Status == 0)
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'ยืนยัน',
                        message: 'คุณต้องการส่งคำสั่งไปยัง Crane ใช่หรือไม่ ?'
                    }).then(function success() {
                        param.update_By = localStorageService.get('userTokenStorage');
                        pageLoading.show()
                        viewModel.confirmTransferAndSendWCSBypass(param).then(function success(res) 
                        {
                            if (res.data) {
                                 dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'Success',
                                        message: (res.data.status == '11' || res.data.status == '12') ? 'ส่งคำสั่งเข้า WCS สำเร็จ : ' + $scope.filterModel.goodsTransfer_No : res.data.message.description
                                    }
                                )  
                            } else {
                                 dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'ALERT',
                                        message: res.data.message.description
                                    }
                                )
                            }
                            $scope.getTranferOnDemand();
                            pageLoading.hide();
                        },
                        function error(response) {
                            pageLoading.hide();
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: "Error API"
                                }
                            )
                        });
                    });
                else
                if($scope.goodsTransferModel.document_Status == 2 && $scope.goodsTransferModel.wcS_status == 20)
                {
                    dpMessageBox.alert({
                        ok: 'Yes',
                        title: 'Confirm Status',
                        message: 'Status has been Confirmed !!!'
                    })
                }
                else  if($scope.goodsTransferModel.document_Status == 2 && $scope.goodsTransferModel.wcS_status == 10)
                {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'ยืนยัน',
                        message: 'คุณต้องการส่งคำสั่งไปยัง Crane ใช่หรือไม่ ?'
                    }).then(function success() {
                        var model = {};
                        model.docNo = $scope.filterModel.goodsTransfer_No;
                        model.updateBy = $scope.userName;
                        pageLoading.show()
                        viewModel.WCSBypass(model).then(function (res) {
                            if (res.data) {
                                 dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'Success',
                                        message: (res.data.status == '11' || res.data.status == '12') ? 'ส่งคำสั่งเข้า WCS สำเร็จ : ' + $scope.filterModel.goodsTransfer_No : res.data.message.description
                                    }
                                )  
                            } else {
                                 dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'ALERT',
                                        message: res.data.message.description
                                    }
                                )
                            }
                            $scope.getTranferOnDemand();
                            pageLoading.hide();
                        },
                        function error(response) {
                            pageLoading.hide();
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: "Error API"
                                }
                            )
                        });
                    });
                }
            };

            $scope.SendWCSBypass = function (param) {
                if (param != "")
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'ยืนยัน',
                        message: 'คุณต้องการส่งคำสั่งไปยัง Crane ใช่หรือไม่ ?'
                    }).then(function success() {
                        var model = {};
                        model.docNo = param;
                        model.updateBy = $scope.userName;
    
                        pageLoading.show()
                        viewModel.WCSBypass(model).then(function (res) {
                            if (res.data) {
                                pageLoading.hide();
                                return dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'Success',
                                        message: (res.data.status == '11' || res.data.status == '12') ? 'ส่งคำสั่งเข้า WCS สำเร็จ : ' + model.docNo : res.data.message.description
                                    }
                                )  
                            } else {
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
                            pageLoading.hide();
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: "Error API"
                                }
                            )
                        });
    
                    });
                else
                    dpMessageBox.alert({
                        ok: 'Yes',
                        title: 'Confirm Status',
                        message: 'Status has been Confirmed !!!'
                    })
            };


            // $scope.bypassno = function () {
            //     ///mockup data passno
            //     //$scope.filterModel.docNo = "0123456789";
            //     pageLoading.show();
            //     viewModel.find_bypassno($scope.filterModel).then(function (res) {
            //         pageLoading.hide();
            //         //$scope.filterModel.docNo = "";
            //     }, function error(res) {
            //         dpMessageBox.alert({
            //             ok: 'OK',
            //             title: 'InformaTion',
            //             message: res.Message.Message,
            //         })
            //     });
            // };

            $scope.createreplenish = function () {
                var result_qty =  $vm.searchResultModel.filter( a =>  a.selected == true && (a.is_disable == false || a.is_disable == null) && Math.abs(a.diff_SU_QtyPiecePickWithOrder - Math.round(a.diff_SU_QtyPiecePickWithOrder)) == 0 );
                if(result_qty.length == 0)
                {
                    return dpMessageBox.alert({
                        ok: 'OK',
                        title: 'InformaTion',
                        message: 'No data',
                    })
                }

                var resultmodel = {};
                resultmodel.lstReplenishOnDemand = result_qty;
               // var  resultmodel = $scope.lstReplenishOnDemand;
               //test
                // dpMessageBox.alert({
                //     ok: 'Close',
                //     title: 'Success',
                //     message: 'Generate Task Success'
                // }).then(function ok() { 
                //     var count_select = $vm.searchResultModel.filter( a =>  a.selected == true);
                //     var count_total = $vm.searchResultModel;
                //     if(count_select.length == count_total.length)
                //     {
                //          $scope.clearSearch();
                //          return;
                //     }
     
                //     angular.forEach($vm.searchResultModel.filter( a => a.selected == true), function (value,key) {
                //          value.is_disable = true;
                //     });
                // });
              

               //endtest
                  pageLoading.show();
                  viewModel.create_replenish(resultmodel).then(function (res) {
                      dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Success',
                        message: 'Generate Task Success'
                    }).then(function ok() { 
                        var count_select = $vm.searchResultModel.filter( a =>  a.selected == true);
                        var count_total = $vm.searchResultModel;
                        if(count_select.length == count_total.length)
                        {
                             $scope.clearSearch();
                             return;
                        }
                        angular.forEach($vm.searchResultModel.filter( a => a.selected == true), function (value,key) {
                             value.is_disable = true;
                        });
                        pageLoading.hide();
                    });
                  }, function error(res) {
                      pageLoading.hide();
                      return dpMessageBox.alert({
                          ok: 'OK',
                          title: 'InformaTion',
                          message: res.Message,
                      })
                  });
            };

           
            // ----------------------------------------------------
            // This local function
            function formatDate() {
                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();
                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return dd.toString() + "/" + mm.toString() + "/" + yyyy.toString() + " - " + dd.toString() + "/" + mm.toString() + "/" + yyyy.toString();;
            }
            
            $scope.convertDate = function () {
                if ($scope.filterModel.date != null) {
                    var str = $scope.filterModel.date;

                    var DStart = str.substring(0, 2);
                    var MStart = str.substring(5, 3);
                    var YStart = str.substring(10, 6);

                    $scope.filterModel.wave_Date = YStart.toString() + MStart.toString() + DStart.toString();

                    var DEnd = str.substring(15, 13);
                    var MEnd = str.substring(18, 16);
                    var YEnd = str.substring(25, 19);

                    $scope.filterModel.wave_Date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
                }
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

            // $scope.autoComplete = {
            //     cycleCount_No: "AutoCyclecount/autoCycleCountNo"
            // };

            $scope.url = {
                ReplenishmentOnDemand: webServiceAPI.ReplenishmentOnDemand,
            };

            function initialize() {
            };

            this.$onInit = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
                $scope.filterModel.goodsIssue_Date ="";
                $scope.goodsTransferModel = {};
                $scope.waveround = [];
                $scope.getTranferOnDemand();
            };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });
        }
    });

})();