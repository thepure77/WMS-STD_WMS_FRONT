(function () {
    'use strict'

    app.component('palletsForm', {
        controllerAs: '$vm',
        templateUrl: "modules/Pallets/pallets/component/palletsForm.html",
        bindings: {
            isLoading: '=?',
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',

        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, palletsFactory, webServiceAPI, Upload) {
            var $vm = this;

            var defer = {};
            var viewModel = palletsFactory;
            $scope.filterModel = {};
            $scope.filterItemModel = {};
            $vm.isFilterTable = true;
            $scope.onShow = false;
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

                if (param != undefined) 
                {                   
                    $scope.filterModel = param;
                    var VehicleType = $scope.dropdownVehicleType;
                    const resultsVehicleType = VehicleType.filter((VehicleType_) => {
                        return VehicleType_.vehicleType_Name == param.vehicleType_Name;
                    })

                    var DocType = $scope.dropdownDocumentType;
                    const resultsDocType = DocType.filter((DocType_) => {
                        return DocType_.documentType_Name == param.documentType_Name;
                    })
                    $scope.filterModel.vehicleType_dropdown = resultsVehicleType[0];
                    $scope.filterModel.documentType_dropdown = resultsDocType[0];
                    if($scope.filterModel.ref_No2 != null && $scope.filterModel.ref_No2 != undefined && $scope.filterModel.ref_No2 != "")
                    $scope.filterModel.ref_No2 =  parseInt($scope.filterModel.ref_No2);          

                    $scope.buttons.add = false;
                    $scope.buttons.update = true;
                }
                else {
                    $scope.buttons.add = true;
                    if ($scope.buttons.add) {
                        $scope.filterModel.createDate = getToday();
                        $scope.filterModel.createTime_text = getTime();
                        $scope.filterModel.lentPallet_Date = getToday();
                        $scope.filterModel.lentpallettime_text = getTime();
                        $scope.filterModel.lentPallet_QtyLent = 0;
                        $scope.filterModel.lentPallet_QtyReturnGood = 0;
                        $scope.filterModel.lentPallet_QtyReturnDmg = 0;
                        $scope.filterModel.documentType_Name = $scope.dropdownDocumentType[0].documentType_Name;
                        $scope.filterModel.documentType_dropdown =  $scope.dropdownDocumentType[0];
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
                model.operations = "ADD";
                if ($scope.filterModel.lentpallettime_text != "") {
                    var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test($scope.filterModel.lentpallettime_text);
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
                            message: 'กรุณาระบุเวลาที่ยืม-คืนพาเลท'
                        }
                    )
                    return "";
                }

                if ($scope.filterModel.lentPallet_Date == null || $scope.filterModel.lentPallet_Date == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            //message: 'Please selected LentPallet date'
                            message: 'กรุณาระบุวันที่ยืม-คืนพาเลท'
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

                if ($scope.filterModel.lentPallet_license == null || $scope.filterModel.lentPallet_license == "" || $scope.filterModel.lentPallet_license == undefined ) {
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

                if($scope.filterModel.lentPallet_QtyLent == "" || $scope.filterModel.lentPallet_QtyLent == null)
                {
                    $scope.filterModel.lentPallet_QtyLent = 0;
                    msg_text = "จำนวนยืม  ";
                }
                

                if($scope.filterModel.lentPallet_QtyReturnGood == "" || $scope.filterModel.lentPallet_QtyReturnGood == null)
                {
                    $scope.filterModel.lentPallet_QtyReturnGood = 0;
                    if(msg_text == "")
                        msg_text = "จำนวนคืนดี  ";
                    else
                    msg_text =  msg_text + ",  จำนวนคืนดี  ";
                }

                if($scope.filterModel.lentPallet_QtyReturnDmg == "" || $scope.filterModel.lentPallet_QtyReturnDmg == null)
                {
                    $scope.filterModel.lentPallet_QtyReturnDmg = 0; 
                    if(msg_text == "")
                        msg_text = "จำนวนคืนเสียหาย  ";
                    else
                    msg_text =  msg_text + ",  จำนวนคืนเสียหาย  ";
                }
                
                if(msg_text != "")
                {
                    msg_text = msg_text + "  ยังไม่ได้ระบุค่า ";
                }
                
                
                dpMessageBox.confirm({
                    ok: 'ใช่',
                    cancel: 'ไม่',
                    title: 'ยืนยันข้อมูล ?',
                    message: msg_text + 'คุณต้องการบันทึกข้อมูลหรือไม่!'
                }).then(function () {
                    model.create_By = localStorageService.get('userTokenStorage');     
                    model.update_By = localStorageService.get('userTokenStorage');
                    pageLoading.show();  
                    viewModel.saveLentpallet(model).then(
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
                                $scope.filterModel.lentPallet_Date = getToday();
                                $scope.filterModel.lentpallettime_text = getTime();
                                $scope.filterModel.documentType_dropdown =  $scope.dropdownDocumentType[0];
                                $scope.filterModel.documentType_Name = $scope.dropdownDocumentType[0].documentType_Name;
                                // if($scope.buttons.update)
                                // {
                                    $scope.back();
                                //}
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
                $scope.filterModel.process_Index = "FAD02042-42E7-4887-8EB9-2857D75CA7E4";
                viewModel.dropdownDocumentType($scope.filterModel).then(function (res) {
                    $scope.dropdownDocumentType = res.data;
                    $scope.filterModel.documentType_dropdown =  $scope.dropdownDocumentType[0];
                });
            };

            $scope.$watch("filterModel.vender_Id + filterModel.vender_Name", function () {
                if ($scope.filterModel.vender_Index == "" || $scope.filterModel.vender_Index == undefined) {
                  $scope.filterModel.vender_Id = '';
                  $scope.filterModel.vender_Name = '';
                }
              });

            var init = function () {
                $scope.filterModel = {};
                $scope.filterModel.documents = [];
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel.createDate = getToday();
                $scope.filterModel.createTime_text = getTime();
                $scope.filterModel.lentPallet_Date = getToday();
                $scope.filterModel.lentpallettime_text = getTime();
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