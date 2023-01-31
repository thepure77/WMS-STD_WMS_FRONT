(function () {
    'use strict'

    app.component('addPalletForm', {
        controllerAs: '$vm',
        templateUrl: "modules/Pallets/addPallet/component/addPalletForm.html",
        bindings: {
            isLoading: '=?',
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',

        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, addPalletFactory, planGoodsIssueItemFactory, ownerPopFactory, webServiceAPI, Upload) {
            var $vm = this;

            var defer = {};
            var viewModel = addPalletFactory;
            $scope.filterModel = {};
            $scope.filterItemModel = {};
            $vm.isFilterTable = true;
            $scope.onShow = false;
            $scope.disabled_doc = false;
            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });

            $scope.isTime = true;

            $scope.header = {
                show: true
            };

            $scope.ShowHeader = function () {
                $scope.header.show = $scope.header.show === false ? true : false;
            };

            $scope.item = {
                show: true
            };

            $scope.ShowItem = function () {
                $scope.item.show = $scope.item.show === false ? true : false;
            };



            $scope.clickTab = function (tab) {

                if (tab == 1) {
                    $scope.colortab1 = "#FDFEFE";
                    $scope.colortab2 = "#D3D3D3";
                }
                else if (tab == 2) {
                    $scope.colortab1 = "#D3D3D3";
                    $scope.colortab2 = "#FDFEFE";
                }
                $scope.click = tab;
            }




            $vm.onShow = function (param) {
                defer = $q.defer();

                $scope.onShow = true;
                // $scope.filterModel.purchaseOrder_Date = getToday();
                // $scope.filterModel.purchaseOrder_Due_Date = getToday();
                // $scope.filterModel.purchaseOrder_Time = getTime();
                // $scope.filterItemModel.purchaseOrder_Due_Date_Time = getTime();

                if (param != undefined) {
                    $scope.filterModel = param;
                    var VehicleType = $scope.dropdownVehicleType;
                    const resultsVehicleType = VehicleType.filter((VehicleType_) => {
                        return VehicleType_.vehicleType_Name == param.vehicleType_Name;
                    })

                    var DocType = $scope.dropdownDocumentType;
                    const resultsDocType = DocType.filter((DocType_) => {
                        return DocType_.documentType_Name == param.documentType_Name;
                    })
                    //$scope.dropdownwarehouse.model = resultsVehicleType[0];
                    $scope.filterModel.vehicleType_dropdown = resultsVehicleType[0];
                    $scope.filterModel.documentType_dropdown = resultsDocType[0];
                    $scope.change_doc();
                    if($scope.filterModel.ref_No2 != null && $scope.filterModel.ref_No2 != undefined && $scope.filterModel.ref_No2 != "")
                       $scope.filterModel.ref_No2 =  parseInt($scope.filterModel.ref_No2);                  
                    $scope.buttons.add = false;
                    $scope.buttons.update = true;
                }
                else {
                    $scope.buttons.add = true;
                    $scope.disabled_doc = false;
                    if ($scope.buttons.add) {
                        $scope.filterModel.createDate = getToday();
                        $scope.filterModel.createTime_text =  getTime();
                        $scope.filterModel.palletDate = getToday();
                        $scope.filterModel.pallettime_text =  getTime();
                        $scope.filterModel.pallet_QtyPlan = 0;
                        $scope.filterModel.pallet_QtyReceive = 0;
                        $scope.filterModel.pallet_QtyReturnGood = 0;
                        $scope.filterModel.pallet_QtyReturnDmg = 0;
                        $scope.filterModel.pallet_QtyTotal = 0;
                    }
                    $scope.buttons.update = false;
                }
                return defer.promise;
            };
            $scope.show = {
                action: true,
                pagination: true,
                checkBox: false
            }

            $vm.triggerSearch = function () {
                $vm.filterModel = $vm.filterModel || {};
                pageLoading.show();
                viewModel.FilterSearch().then(function (res) {
                    pageLoading.hide();
                    $vm.filterModel = res.data.items;
                    $vm.searchResultModel = res.data.items;
                });
            };

            $scope.filter = function () {
                $vm.triggerSearch();
            };


            $scope.add = function () {
               var model = $scope.filterModel;    
               if ($scope.filterModel.documentType_dropdown == null) {
                dpMessageBox.alert(
                    {
                        ok: 'Close',
                        title: 'ALERT',
                        //message: 'MSG_Alert_DocumentType'
                        message: 'กรุณาระบุประเภทเอกสาร'
                    }
                )
                return "";
            }           
                if ($scope.filterModel.pallettime_text != "") {
                    var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test($scope.filterModel.pallettime_text);
                    if (isValid) {
                        $scope.filterModel.IsTime = true;
                    } else {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'ALERT',
                                 // message: 'MSG_Alert_Time_Format'
                                 message: 'รูปแบบเวลาไม่ถูกต้อง'
                            }
                        )
                        return "";
                    }
                }
                else {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                             //message: 'Please selected LentPallet time'
                             message: 'กรุณาระบุเวลาที่รับพาเลท'
                        }
                    )
                    return "";
                }
                
                if ($scope.filterModel.palletDate == null || $scope.filterModel.palletDate == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            //message: 'Please selected LentPallet date'
                            message: 'กรุณาระบุวันที่รับพาเลท'
                        }
                    )
                    return "";
                }

                if ($scope.filterModel.ref_No2 == null || $scope.filterModel.ref_No2 == "" || $scope.filterModel.ref_No2 == undefined ) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            //message: 'Please selected Pallet Year'
                            message: 'กรุณาระบุปีพาเลท'
                        }
                    )
                    return "";
                }

                if (($scope.filterModel.vender_Index == null || $scope.filterModel.vender_Index == "") ||  ($scope.filterModel.vender_Id == null || $scope.filterModel.vender_Id == "")) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            //message: 'MSG_Alert_Vender'
                            message: 'กรุณาระบุชื่อบริษัท'
                        }
                    )
                    return "";
                }

                if ($scope.filterModel.vehicleType_dropdown == null) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                             //message: 'Please selected VehicleType'
                             message: 'กรุณาระบุประเภทรถ'
                        }
                    )
                    return "";
                }

                

                if ($scope.filterModel.pallet_license == null || $scope.filterModel.pallet_license == "" || $scope.filterModel.pallet_license == undefined ) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            //message: 'Please selected Licens'
                            message: 'กรุณาระบุทะเบียนรถ'
                        }
                    )
                    return "";
                }

               
                
                var msg_text = ""; 

                if($scope.filterModel.documentType_dropdown.documentType_Id != "P002")
                {                
                    if($scope.filterModel.pallet_QtyPlan == "" || $scope.filterModel.pallet_QtyPlan == null)
                    {
                        $scope.filterModel.pallet_QtyPlan = 0;
                        msg_text = "จำนวนแผนรับ  ";
                    }
                }
                else
                {
                    $scope.filterModel.pallet_QtyPlan = 0;
                }

                if($scope.filterModel.pallet_QtyReceive == "" || $scope.filterModel.pallet_QtyReceive == null)
                {
                    $scope.filterModel.pallet_QtyReceive = 0;
                    if(msg_text == "")
                        msg_text = "จำนวนรับ  ";
                    else
                    msg_text =  msg_text + ",  จำนวนรับ  ";
                }

                // if($scope.filterModel.pallet_QtyReturnGood == "" || $scope.filterModel.pallet_QtyReturnGood == null)
                // {
                //     $scope.filterModel.pallet_QtyReturnGood = 0;
                //     if(msg_text == "")
                //         msg_text = "จำนวนคืน  ";
                //     else
                //     msg_text =  msg_text + ",  จำนวนคืน  ";
                // }

                if($scope.filterModel.pallet_QtyReturnDmg == "" || $scope.filterModel.pallet_QtyReturnDmg == null)
                {
                    $scope.filterModel.pallet_QtyReturnDmg = 0;
                    if(msg_text == "")
                        msg_text = "จำนวนเสียหาย  ";
                    else
                    msg_text =  msg_text + ",  จำนวนเสียหาย  ";
                }

                if(msg_text != "")
                {
                    msg_text = msg_text + "  ยังไม่ได้ระบุค่า ";
                }
                
                
                if($scope.filterModel.pallet_QtyTotal == "" || $scope.filterModel.pallet_QtyTotal == null)
                    $scope.filterModel.pallet_QtyTotal = 0;

                    
                if($scope.filterModel.documentType_dropdown.documentType_Id == "P001" && ($scope.filterModel.pallet_QtyPlan < $scope.filterModel.pallet_QtyReceive))
                {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            //message: 'Please selected Licens'
                            message: 'จำนวนแผนรับต้องมากกว่า หรือ เท่ากับ จำนวนรับ '
                        }
                    )
                    return "";
                }



                dpMessageBox.confirm({
                    ok: 'ใช่',
                    cancel: 'ไม่',
                    title: 'ยืนยันข้อมูล ?',
                    message: msg_text + ' คุณต้องการบันทึกข้อมูลหรือไม่!'
                }).then(function () {
                    model.create_By = localStorageService.get('userTokenStorage');  
                    model.update_By = localStorageService.get('userTokenStorage'); 
                    pageLoading.show();                                   
                    viewModel.savepallet(model).then(
                        function success(res) {
                            pageLoading.hide();
                            if (res.data.code == 200) {
                                dpMessageBox.alert(
                                    {
                                        ok: 'ปิด',
                                        title: 'บันทึกสำเร็จ',
                                        message: 'เอกสารเลขที่ :' + res.data.no
                                    }
                                )
                                $scope.filterModel = {};
                                $scope.filterModel.createDate = getToday();
                                $scope.filterModel.createTime_text = getTime();
                                $scope.filterModel.palletDate = getToday();
                                $scope.filterModel.pallettime_text = getTime();
                               
                                $scope.back();
                            }
                            else {
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'ALERT',
                                        message: 'ไม่สามารถบันทึกข้อมูลได้'
                                    }
                                )
                            }
                        },
                        function error(response) {
                            pageLoading.hide();
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: 'ไม่สามารถบันทึกข้อมูลได้ : ' + response.Message
                                }
                            )
                        }
                    );
                },
                    function error(param) {
                    });
            };

            // $scope.edit = function () {
            //     var model = $scope.filterModel;
            //     model.operations = "EDIT";
            //     var listmodel = $scope.filterModel.listPurchaseOrderItemViewModel;

            //     dpMessageBox.confirm({
            //         ok: 'Yes',
            //         cancel: 'No',
            //         title: 'ยืนยันข้อมูล ?',
            //         message: 'คุณต้องการบันทึกข้อมูลหรือไม่!'
            //     }).then(function () {
            //         viewModel.getId(model.purchaseOrder_Index).then(function (res) {
            //             if (res.data.userAssign != $scope.userName) {
            //                 dpMessageBox.alert({
            //                     ok: 'Close',
            //                     title: 'Information.',
            //                     message: "User ไม่ตรงกับ UserAssign"
            //                 })
            //                 $scope.filterModel = {};
            //                 $scope.dropdownwarehouse.model = {};
            //                 $scope.dropdownDocumentType.model = {};
            //                 $scope.dropdownCostCenter.model = {};
            //                 $scope.dropdownRound.model = {};
            //                 $scope.dropdownTypeCar.model = {};
            //                 $scope.dropdownTransport.model = {};
            //                 $scope.dropdownProductconversion.model = {};
            //                 $scope.filterModel.purchaseOrder_Date = getToday();
            //                 $scope.filterModel.purchaseOrder_Due_Date = getToday();
            //                 defer.resolve();
            //             }
            //             else {
            //                 model.update_By = localStorageService.get('userTokenStorage');
            //                 viewModel.add(model).then(
            //                     function success(res) {
            //                         $vm.filterModel = res.config.data;
            //                         $vm.searchResultModel = res.config.data;
            //                         $scope.filterModel = {};
            //                         $scope.dropdownwarehouse.model = {};
            //                         $scope.dropdownDocumentType.model = {};
            //                         $scope.dropdownCostCenter.model = {};
            //                         $scope.dropdownRound.model = {};
            //                         $scope.dropdownTypeCar.model = {};
            //                         $scope.dropdownTransport.model = {};
            //                         $scope.dropdownProductconversion.model = {};
            //                         $scope.filterModel.purchaseOrder_Date = getToday();
            //                         $scope.filterModel.purchaseOrder_Due_Date = getToday();
            //                         defer.resolve('-99');
            //                     },
            //                     function error(response) {
            //                         dpMessageBox.alert(
            //                             {
            //                                 ok: 'Close',
            //                                 title: 'ALERT',
            //                                 message: 'ไม่สามารถบันทึกข้อมูลได้'
            //                             }
            //                         )
            //                     }
            //                 );

            //             }
            //         });
            //     },
            //         function error(param) {
            //         });
            // }

            $scope.back = function () {
                $scope.filterModel = {};
                defer.resolve();
            }

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
                if (Hour < 10) Hour = '0' + Hour;

                return Hour.toString() + ':' + Minute.toString()
            }

            $scope.buttons = {
                add: true,
                update: false,
                back: true
            };
            
            $scope.deleteItem = function (param, index) {
                param.splice(index, 1);
            }
            
            $scope.autoComplete = {
                vendor: "Autocomplete/autoVendor",
            };
            $scope.url = {
                Palletmanage: webServiceAPI.Palletmanage,
            };

            $scope.dropdownVehicleType = function () {
                viewModel.dropdownVehicleType($scope.filterModel).then(function (res) {
                    $scope.dropdownVehicleType = res.data;
                });
            };

            $scope.dropdownDocumentType = function () {
                $scope.filterModel.process_Index = "6DCD4F60-F000-4FAF-B668-9291E10BE890";
                viewModel.dropdownDocumentType($scope.filterModel).then(function (res) {
                    $scope.dropdownDocumentType = res.data;
                });
            };

            $scope.$watch("filterModel.vender_Id + filterModel.vender_Name", function () {
                if ($scope.filterModel.vender_Index == "" || $scope.filterModel.vender_Index == undefined) {
                  $scope.filterModel.vender_Id = '';
                  $scope.filterModel.vender_Name = '';
                }
              });
             
            $scope.caltotal = function(){
                var total = 0;
                if($scope.filterModel.documentType_dropdown.documentType_Id == 'P002' || $scope.filterModel.documentType_dropdown.documentType_Id == 'P004' || $scope.filterModel.documentType_dropdown.documentType_Id == 'P005')
                {
                    if($scope.filterModel.pallet_QtyReceive != undefined && $scope.filterModel.pallet_QtyReceive != null &&  $scope.filterModel.pallet_QtyReceive != 0)
                        total = total + $scope.filterModel.pallet_QtyReceive;
                
                    // if($scope.filterModel.pallet_QtyReturnDmg != undefined && $scope.filterModel.pallet_QtyReturnDmg != null &&  $scope.filterModel.pallet_QtyReturnDmg != 0)
                    //     total = total - $scope.filterModel.pallet_QtyReturnDmg;
                }
                else
                {
                    
                    if($scope.filterModel.pallet_QtyPlan != undefined && $scope.filterModel.pallet_QtyPlan != null &&  $scope.filterModel.pallet_QtyPlan != 0)
                        total = total + $scope.filterModel.pallet_QtyPlan;

                    // if($scope.filterModel.pallet_QtyReturnGood != undefined && $scope.filterModel.pallet_QtyReturnGood != null &&  $scope.filterModel.pallet_QtyReturnGood != 0)
                    //     total = total + $scope.filterModel.pallet_QtyReturnGood;
                    
                    if($scope.filterModel.pallet_QtyReturnDmg != undefined && $scope.filterModel.pallet_QtyReturnDmg != null &&  $scope.filterModel.pallet_QtyReturnDmg != 0)
                        total = total - $scope.filterModel.pallet_QtyReturnDmg;
                    
                }
                $scope.filterModel.pallet_QtyTotal = total;
            };

            // function getTime_2() {
            //     //const [date, time] = formatDate(new Date()).split(' ');
            //     // debugger
            //     // var Hour = new Date().getHours();
            //     // var Minute = new Date().getMinutes();
                
            //     // if (Minute < 10) Minute = '0' + Minute;
            //     // if (Hour < 10) Hour = '0' + Hour;

            //     // return Hour + ':' + Minute


            //     //const str = new Date();
            //     // $scope.date = $filter("date")(Date.now(), 'yyyy-MM-dd');

            //     // const [dateValues, timeValues] = str.split(' ');
            //     // // console.log(dateValues); // "09/24/2022"
            //     // // console.log(timeValues); // "07:30:14"

            //     // const [month, day, year] = dateValues.split('/');
            //     // const [hours, minutes, seconds] = timeValues.split(':');

            //     // const date = new Date(+year, +month - 1, +day, +hours, +minutes);

            //     //debugger
            //     //let aa = new Date(year, month, day, hours, minutes, seconds, milliseconds)
            //     var today = new Date();
            //     var Hour = new Date().getHours();
            //     var Minute = new Date().getMinutes();
            //     if (Minute < 10) Minute = '0' + Minute;
            //     if (Hour < 10) Hour = '0' + Hour;

            //     var myToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), Hour, Minute);

            //     return myToday

            // }

           $scope.change_doc = function(){
                if($scope.filterModel.documentType_dropdown != null)
                {
                    if($scope.filterModel.documentType_dropdown.documentType_Id == 'P002' || $scope.filterModel.documentType_dropdown.documentType_Id == 'P004' || $scope.filterModel.documentType_dropdown.documentType_Id == 'P005')
                    {
                        $scope.disabled_doc = true;
                    }           
                    else
                    {
                        $scope.disabled_doc = false;
                    }

                    // $scope.filterModel.pallet_QtyPlan = 0;
                    // $scope.filterModel.pallet_QtyReceive = 0;
                    // $scope.filterModel.pallet_QtyReturnDmg = 0;
                    // $scope.filterModel.pallet_QtyTotal = 0;
                }
           };

            var init = function () {
                $scope.filterModel = {};
                $scope.filterModel.documents = [];
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel.createDate = getToday();
                $scope.filterModel.createTime_text = getTime();
                $scope.filterModel.palletDate = getToday();
                $scope.filterModel.pallettime_text = getTime();
                $scope.dropdownVehicleType();
                $scope.dropdownDocumentType();
                $scope.colortab1 = "#FDFEFE";
                $scope.colortab2 = "#D3D3D3";
                $scope.click = 1;

            };
            init();
        }
    })
})();