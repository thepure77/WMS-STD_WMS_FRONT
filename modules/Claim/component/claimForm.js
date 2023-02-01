(function () {
    'use strict'

    app.component('claimForm', {
        controllerAs: '$vm',
        templateUrl: "modules/claim/component/claimForm.html",
        bindings: {
            isLoading: '=?',
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',

        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, claimFactory, claimItemFactory, ownerPopFactory, webServiceAPI, Upload) {
            var $vm = this;

            var defer = {};
            var viewModel = claimFactory;
            var viewModelitem = claimItemFactory
            var ownerModel = ownerPopFactory
            $scope.filterModel = {};
            $scope.filterItemModel = {};
            $scope.index = {};
            $scope.ownerOld = {};
            $scope.remember = {};
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
                    $scope.colortab1 = "#97bee7";
                    $scope.colortab2 = "#D3D3D3";
                }
                else if (tab == 2) {
                    $scope.colortab1 = "#D3D3D3";
                    $scope.colortab2 = "#97bee7";
                }
                $scope.click = tab;
            }




            $vm.onShow = function (param) {
                defer = $q.defer();

                $scope.onShow = true;
                $scope.filterModel.claim_Date = getToday();
                $scope.filterModel.claim_Due_Date = getToday();
                $scope.filterModel.claim_Time = getTime();
                $scope.filterModel.claim_Due_DateTime = getTime();
                $scope.clickTab(1);

                if (param != undefined) {
                    pageLoading.show()
                    viewModel.getId(param.claim_Index).then(function (res) {
                        pageLoading.hide()
                        // var warehouse = $scope.dropdownwarehouse
                        // const resultsWarehouse = warehouse.filter((warehouse) => {
                        //     return warehouse.warehouse_Name == res.data.warehouse_Name;
                        // })
                        // $scope.dropdownwarehouse.model = resultsWarehouse[0];
                        
                        var documentType = $scope.dropdownDocumentType
                        const resultsDocumentType = documentType.filter((documentType) => {
                            return documentType.documentType_Id == res.data.documentType_Id;
                        })
                        $scope.dropdownDocumentType.model = resultsDocumentType[0];

                        // var CostCenter = $scope.dropdownCostCenter
                        // const resultsCostCenter = CostCenter.filter((CostCenter) => {
                        //     return CostCenter.costCenter_Index == res.data.costCenter_Index;
                        // })
                        // $scope.dropdownCostCenter.model = resultsCostCenter[0];

                        // var ShipmentType = $scope.dropdownShipmentType
                        // const resultsShipmentType = ShipmentType.filter((ShipmentType) => {
                        //     return ShipmentType.shipmentType_Index == res.data.shipmentType_Index;
                        // })
                        // $scope.dropdownShipmentType.model = resultsShipmentType[0];

                        // var ContainerType = $scope.dropdownContainerType
                        // const resultsContainerType = ContainerType.filter((ContainerType) => {
                        //     return ContainerType.containerType_Index == res.data.containerType_Index;
                        // })
                        // $scope.dropdownContainerType.model = resultsContainerType[0];

                        // var DockDoor = $scope.dropdownDockDoor
                        // const resultsDockDoor = DockDoor.filter((DockDoor) => {
                        //     return DockDoor.dock_Index == res.data.dock_Index;
                        // })
                        // $scope.dropdownDockDoor.model = resultsDockDoor[0];

                        // var VehicleType = $scope.dropdownVehicleType
                        // const resultsVehicleType = VehicleType.filter((VehicleType) => {
                        //     return VehicleType.vehicleType_Index == res.data.vehicleType_Index;
                        // })
                        // $scope.dropdownVehicleType.model = resultsVehicleType[0];

                        // var CargoType = $scope.dropdownCargoType
                        // const resultsCargoType = CargoType.filter((CargoType) => {
                        //     return CargoType.cargoType_Index == res.data.cargoType_Index;
                        // })
                        // $scope.dropdownCargoType.model = resultsCargoType[0];

                        // var DocumentPriority = $scope.dropdownDocumentPriority
                        // const resultsDocumentPriority = DocumentPriority.filter((DocumentPriority) => {
                        //     return DocumentPriority.documentPriority_Index == res.data.documentPriority_Index;
                        // })
                        // $scope.dropdownDocumentPriority.model = resultsDocumentPriority[0];

                        // var UnloadingType = $scope.dropdownUnloadingType
                        // const resultsUnloadingType = UnloadingType.filter((UnloadingType) => {
                        //     return UnloadingType.unloadingType_Index == res.data.unloadingType_Index;
                        // })
                        // $scope.dropdownUnloadingType.model = resultsUnloadingType[0];


                        

                        $scope.filterModel = res.data;
                        $scope.buttons.add = false;
                        $scope.buttons.update = true;

                        if ($scope.filterModel.documentStatus == 1 || $scope.filterModel.documentStatus == 2 || $scope.filterModel.documentStatus == -1 || $scope.filterModel.documentStatus == 3)
                            $scope.buttons.update = false;
                        claimItemFactory.getByclaimId(param.claim_Index).then(function (res) {
                            $scope.filterModel.listclaimItemViewModel = res.data;
                        });
                    });
                }
                else {
                    $scope.buttons.add = true;
                    if ($scope.buttons.add) {
                        $scope.filterModel.claim_Date = getToday();
                        $scope.filterModel.claim_Due_Date = getToday();
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
                    $vm.filterModel = res.data.itemsPlanGR;
                    $vm.searchResultModel = res.data.itemsPlanGR;
                });
            };

            $scope.filter = function () {
                $vm.triggerSearch();
            };

            $scope.add = function () {
                
                var model = $scope.filterModel;
                model.operations = "ADD";
                // if ($scope.filterModel.claim_Time != "") {
                //     var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test($scope.filterModel.claim_Time);
                //     if (isValid) {
                //         $scope.filterModel.IsTime = true;
                //     } else {
                //         dpMessageBox.alert(
                //             {
                //                 ok: 'Close',
                //                 title: 'ALERT',
                //                 message: 'MSG_Alert_Time_Format'
                //             }
                //         )
                //         return "";
                //     }
                // }
                // else {
                //     dpMessageBox.alert(
                //         {
                //             ok: 'Close',
                //             title: 'ALERT',
                //             message: 'MSG_Alert_PLEASE_SELECTED_claim_Time'
                //         }
                //     )
                //     return "";
                // }

                if (!$scope.filterModel.claim_Date) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'MSG_Alert_claim_Date'
                        }
                    )
                    return "";
                }
                
                // if (!$scope.filterModel.vendor_Index) {
                //     dpMessageBox.alert(
                //         {
                //             ok: 'Close',
                //             title: 'แจ้งเตือน',
                //             message: 'MSG_Alert_Vender'
                //         }
                //     )
                //     return "";
                // }

                if ($scope.dropdownDocumentType.model != null) {
                    $scope.filterModel.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
                    $scope.filterModel.documentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
                    $scope.filterModel.documentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
                }
                else {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'MSG_Alert_DocumentType'
                        }
                    )
                    return "";
                }

                var listmodel = $scope.filterModel.listclaimItemViewModel;
                if ($scope.filterModel.listclaimItemViewModel == undefined) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'ต้องเพิ่มสินค้าอย่างน้อย 1 รายการ'
                        }
                    )
                    return "";
                }

                if (!$scope.filterModel.ticket_Number) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'Please insert Ticket Number'
                        }
                    )
                    return "";
                }

                if (!$scope.filterModel.wf_Number) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'Please insert Wf Number'
                        }
                    )
                    return "";
                }

                if (!$scope.filterModel.shop_Id) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'Please insert Shop Id'
                        }
                    )
                    return "";
                }

                if (!$scope.filterModel.shop_Name) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'Please insert Shop Name'
                        }
                    )
                    return "";
                }

                if (!$scope.filterModel.plant) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'Please insert Plant'
                        }
                    )
                    return "";
                }
                
                if (!$scope.filterModel.soldTo_Id) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'Please insert SoldTo Id'
                        }
                    )
                    return "";
                }
                if (!$scope.filterModel.shipTo_Id) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'Please insert ShipTo_Id'
                        }
                    )
                    return "";
                }

                dpMessageBox.confirm({
                    ok: 'ใช่',
                    cancel: 'ไม่',
                    title: 'ยืนยันข้อมูล ?',
                    message: 'คุณต้องการบันทึกข้อมูลหรือไม่!'
                }).then(function () {
                    model.create_By = localStorageService.get('userTokenStorage');

                    for (let index = 0; index < model.listclaimItemViewModel.length; index++) {
                        model.listclaimItemViewModel[index].uDF1 = model.planGoodsIssueNo;
                        model.listclaimItemViewModel[index].uDF4 = model.planGoodsIssueIndex;
                        model.listclaimItemViewModel[index].uDF5 = model.listclaimItemViewModel[index].planGoodsIssueItemIndex;
                    }
                    
                    viewModel.add(model).then(
                        function success(res) {
                            
                            if (res.data.message == true) {
                                dpMessageBox.alert(
                                    {
                                        ok: 'ปิด',
                                        title: 'บันทึกสำเร็จ',
                                        message: 'เลขที่ใบจัดส่งสินค้า :' + res.data.document_No
                                    }
                                )
                                $scope.filterModel = {};
                                // $scope.dropdownwarehouse.model = {};
                                $scope.dropdownDocumentType.model = {};
                                // $scope.dropdownRound.model = {};
                                // $scope.dropdownTypeCar.model = {};
                                // $scope.dropdownTransport.model = {};
                                // $scope.dropdownProductconversion.model = {};
                                $scope.filterModel.claim_Date = getToday();
                                $scope.filterModel.claim_Due_Date = getToday();
                                defer.resolve();
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
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: 'ไม่สามารถบันทึกข้อมูลได้'
                                }
                            )
                        }
                    );
                },
                    function error(param) {
                    });
            };

            $scope.edit = function () {
                
                var model = $scope.filterModel;
                model.operations = "EDIT";
                
                var listmodel = $scope.filterModel.listclaimItemViewModel;

                // if ($scope.filterModel.claim_Time != "") {
                //     var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test($scope.filterModel.claim_Time);
                //     if (isValid) {
                //         $scope.filterModel.IsTime = true;
                //     } else {
                //         dpMessageBox.alert(
                //             {
                //                 ok: 'Close',
                //                 title: 'ALERT',
                //                 message: 'MSG_Alert_Time_Format'
                //             }
                //         )
                //         return "";
                //     }
                // }
                // else {
                //     dpMessageBox.alert(
                //         {
                //             ok: 'Close',
                //             title: 'ALERT',
                //             message: 'MSG_Alert_PLEASE_SELECTED_plan_Time'
                //         }
                //     )
                //     return "";
                // }
                
                if (!$scope.filterModel.ticket_Number) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'Please insert Ticket Number'
                        }
                    )
                    return "";
                }

                if (!$scope.filterModel.wf_Number) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'Please insert Wf Number'
                        }
                    )
                    return "";
                }

                if (!$scope.filterModel.shop_Id) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'Please insert Shop Id'
                        }
                    )
                    return "";
                }

                if (!$scope.filterModel.shop_Name) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'Please insert Shop Name'
                        }
                    )
                    return "";
                }
                
                if (!$scope.filterModel.soldTo_Id) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'Please insert SoldTo Id'
                        }
                    )
                    return "";
                }
                if (!$scope.filterModel.shipTo_Id) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'Please insert ShipTo_Id'
                        }
                    )
                    return "";
                }

                if (!$scope.filterModel.plant) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'Please insert Plant'
                        }
                    )
                    return "";
                }

                if (!$scope.filterModel.claim_Date) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'MSG_Alert_claim_Date'
                        }
                    )
                    return "";
                }

                
                // if (!$scope.filterModel.vendor_Index) {
                //     dpMessageBox.alert(
                //         {
                //             ok: 'Close',
                //             title: 'แจ้งเตือน',
                //             message: 'MSG_Alert_Vender'
                //         }
                //     )
                //     return "";
                // }

                // if ($scope.dropdownwarehouse.model != null) {
                //     $scope.filterModel.warehouse_Index = $scope.dropdownwarehouse.model.warehouse_Index;
                //     $scope.filterModel.warehouse_Id = $scope.dropdownwarehouse.model.warehouse_Id;
                //     $scope.filterModel.warehouse_Name = $scope.dropdownwarehouse.model.warehouse_Name;
                // }
                // else {
                //     dpMessageBox.alert(
                //         {
                //             ok: 'Close',
                //             title: 'ALERT',
                //             message: 'MSG_Alert_Warehouse'
                //         }
                //     )
                //     return "";
                // }


                if ($scope.dropdownDocumentType.model != null) {
                    $scope.filterModel.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
                    $scope.filterModel.documentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
                    $scope.filterModel.documentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
                }
                else {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'MSG_Alert_DocumentType'
                        }
                    )
                    return "";
                }
                
                var listmodel = $scope.filterModel.listclaimItemViewModel;
                if ($scope.filterModel.listclaimItemViewModel == undefined) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'ต้องเพิ่มสินค้าอย่างน้อย 1 รายการ'
                        }
                    )
                    return "";
                }


                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยันข้อมูล ?',
                    message: 'คุณต้องการบันทึกข้อมูลหรือไม่!'
                }).then(function () {
                    viewModel.getId(model.claim_Index).then(function (res) {
                        
                        // if (res.data.userAssign != $scope.userName) {
                        //     dpMessageBox.alert({
                        //         ok: 'Close',
                        //         title: 'Information.',
                        //         message: "User ไม่ตรงกับ UserAssign"
                        //     })
                        //     $scope.filterModel = {};
                        //     $scope.dropdownwarehouse.model = {};
                        //     $scope.dropdownDocumentType.model = {};
                        //     $scope.dropdownRound.model = {};
                        //     $scope.dropdownTypeCar.model = {};
                        //     $scope.dropdownTransport.model = {};
                        //     $scope.dropdownProductconversion.model = {};
                        //     $scope.filterModel.claim_Date = getToday();
                        //     $scope.filterModel.claim_Due_Date = getToday();
                        //     defer.resolve();
                        // }
                        // else {
                            model.update_By = localStorageService.get('userTokenStorage');
                            viewModel.add(model).then(
                                function success(res) {
                                    $vm.filterModel = res.config.data;
                                    $vm.searchResultModel = res.config.data;
                                    $scope.filterModel = {};
                                    // $scope.dropdownwarehouse.model = {};
                                    $scope.dropdownDocumentType.model = {};
                                    // $scope.dropdownRound.model = {};
                                    // $scope.dropdownTypeCar.model = {};
                                    // $scope.dropdownTransport.model = {};
                                    // $scope.dropdownProductconversion.model = {};
                                    $scope.filterModel.claim_Date = getToday();
                                    $scope.filterModel.claim_Due_Date = getToday();
                                    defer.resolve('-99');
                                },
                                function error(response) {
                                    dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'ALERT',
                                            message: 'ไม่สามารถบันทึกข้อมูลได้'
                                        }
                                    )
                                }
                            );

                        // }
                    });
                },
                    function error(param) {
                    });
            }

            $scope.back = function () {
                
                $scope.deleteuser = {};
                if ($scope.filterModel.claim_Index != undefined) {
                    // $scope.deleteuser.claim_Index = $scope.filterModel.claim_Index;
                    // viewModel.deleteUserAssign($scope.deleteuser).then(
                        // function success(results) {
                            $scope.filterModel = {};
                            $scope.filterItemModel = {};
                            // $scope.dropdownwarehouse.model = {};
                            $scope.dropdownDocumentType.model = {};
                            defer.resolve();
                        // }
                    // );
                }
                else {
                    $scope.filterModel = {};
                    $scope.filterItemModel = {};
                    // $scope.dropdownwarehouse.model = {};
                    $scope.dropdownDocumentType.model = {};
                    defer.resolve();
                }
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

                return Hour.toString() + ':' + Minute.toString()
            }

            $scope.buttons = {
                add: true,
                update: false,
                back: true
            };

            $scope.addsItem = function (param) {
                
                if ($scope.dropdownProductconversion.model != null) {
                    param.productConversion_Index = $scope.dropdownProductconversion.model.productConversion_Index;
                    param.productConversion_Id = $scope.dropdownProductconversion.model.productConversion_Id;
                    param.productConversion_Name = $scope.dropdownProductconversion.model.productConversion_Name;
                    param.ratio = $scope.dropdownProductconversion.model.productconversion_Ratio;
                }

                if ($scope.filterItemModel.product_Name == undefined || $scope.filterItemModel.product_Index == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'กรุณาเลือกสินค้า !'
                        }
                    )
                    return "";
                }

                if ($scope.dropdownProductconversion.model == null) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'กรุณาเลือกหน่วย !'
                        }
                    )
                    return "";
                }

                

                if ($scope.filterModel.listclaimItemViewModel == undefined) {
                    $scope.filterModel.listclaimItemViewModel = $scope.filterModel.listclaimItemViewModel || []
                    $scope.filterModel.listclaimItemViewModel.push(angular.copy(param));
                    $scope.filterItemModel.product_Id = null;
                    $scope.filterItemModel.product_Index = null;
                    $scope.filterItemModel.product_Name = null;
                    $scope.filterItemModel.qty = null;
                    $scope.dropdownProductconversion.model = null;
                    $scope.filterItemModel.documentItem_Remark = null;
                    $scope.filterItemModel.weight = null;
                    $scope.filterItemModel.start_Date = null;
                    $scope.filterItemModel.end_Date = null;
                    $scope.filterItemModel.delivery_Date = null;

                }
                else if (param.rowItemIndex != undefined) {

                    $scope.filterModel.listclaimItemViewModel[param.rowItemIndex].product_Id = $scope.filterItemModel.product_Id;
                    $scope.filterModel.listclaimItemViewModel[param.rowItemIndex].product_Index = $scope.filterItemModel.product_Index;
                    $scope.filterModel.listclaimItemViewModel[param.rowItemIndex].product_Name = $scope.filterItemModel.product_Name;
                    $scope.filterModel.listclaimItemViewModel[param.rowItemIndex].qty = $scope.filterItemModel.qty;
                    $scope.filterModel.listclaimItemViewModel[param.rowItemIndex].productconversion_Index = param.productconversion_Index;
                    $scope.filterModel.listclaimItemViewModel[param.rowItemIndex].productconversion_Id = param.productconversion_Id;
                    $scope.filterModel.listclaimItemViewModel[param.rowItemIndex].productconversion_Name = param.productconversion_Name;
                    $scope.filterModel.listclaimItemViewModel[param.rowItemIndex].weight = $scope.filterItemModel.weight;
                    $scope.filterModel.listclaimItemViewModel[param.rowItemIndex].ratio = param.ratio;
                    $scope.filterModel.listclaimItemViewModel[param.rowItemIndex].documentItem_Remark = $scope.filterItemModel.documentItem_Remark;
                    $scope.filterModel.listclaimItemViewModel[param.rowItemIndex].start_Date = $scope.filterItemModel.start_Date;
                    $scope.filterModel.listclaimItemViewModel[param.rowItemIndex].end_Date = $scope.filterItemModel.end_Date;
                    $scope.filterModel.listclaimItemViewModel[param.rowItemIndex].delivery_Date = $scope.filterItemModel.delivery_Date;

                    $scope.filterItemModel.product_Id = null;
                    $scope.filterItemModel.product_Index = null;
                    $scope.filterItemModel.product_Name = null;
                    $scope.filterItemModel.qty = null;
                    $scope.filterItemModel.documentItem_Remark = null;
                    $scope.dropdownProductconversion.model = null;
                    $scope.filterItemModel.weight = null;
                    $scope.filterItemModel.rowItemIndex = undefined;
                    $scope.filterItemModel.start_Date = null;
                    $scope.filterItemModel.end_Date = null;
                    $scope.filterItemModel.delivery_Date = null;
                }
                else {
                    $scope.filterModel.listclaimItemViewModel.push(angular.copy(param));
                    $scope.filterItemModel.product_Id = null;
                    $scope.filterItemModel.product_Index = null;
                    $scope.filterItemModel.product_Name = null;
                    $scope.filterItemModel.qty = null;
                    $scope.filterItemModel.documentItem_Remark = null;
                    $scope.dropdownProductconversion.model = null;
                    $scope.filterItemModel.documentItem_Remark = null;
                    $scope.filterItemModel.weight = null;
                    $scope.filterItemModel.start_Date = null;
                    $scope.filterItemModel.end_Date = null;
                    $scope.filterItemModel.delivery_Date = null;
                }
            }

            $scope.deleteItem = function (param, index) {
                param.splice(index, 1);
            }


            $scope.autoComplete = {
                // owner: "AutoPlanGoodsReceive/autoOwnerfilter",
                // planGoodsReceive_No: "AutoPlanGoodsReceive/autoPlanGoodsReceiveNo",
                // warehouse_Name: "AutoPlanGoodsReceive/autoWarehousefilter",
                // vendor: "AutoPlanGoodsReceive/autoVenderfilter",
                documentType: "Claim/autoDocumentTypefilter",
                // processStatus: "AutoPlanGoodsReceive/autoStatusfilter",
                // sku: "AutoPlanGoodsReceive/autoSkufilter",
                // product: "AutoPlanGoodsReceive/autoProductfilter",


                soldToClaim: "Claim/autoSoldTofilter",
                shipToClaim: "Claim/autoShipTofilter",
            };

            $scope.url = {
                Claim: webServiceAPI.OMS,
            };

            $scope.dropdownDocumentType = function () {
                viewModel.dropdownDocumentType($scope.filterModel).then(function (res) {
                    $scope.dropdownDocumentType = res.data;
                });
            };
            

            var i = 0;
            var images = [];
            $scope.mySlide = {
                onClick: function (param){
                    
                    if(param === 'next')
                    {
                        i++;
                        if(i == images.length){ i = 0; }
                    }else{
                        i--;
                        if(i < 0){ i = images.length - 1; }
                    }
                    document.getElementById('slide').src = images[i].src;
                }
            }

            $scope.previewItem = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    if(param.documents == undefined || param.documents.length != 0) {
                        images = param.documents;
                        document.getElementById('slide').src = images[0].src;
                        debugger
                        $scope.previewItem.onShow = !$scope.previewItem.onShow;
                        if (param) {
                            param.rowItemIndex = index;
                        }
                        // $scope.previewItem.delegates(param);
                    }
                    else{
                        $scope.previewItem.onShow = false;
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'ALERT',
                                message: 'No images.'
                            }
                        )
                    }
                    
                },
                config: {
                    title: "Preview"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        if ($scope.filterModel.listclaimItemViewModel == undefined) {
                            $scope.filterModel.listclaimItemViewModel = $scope.filterModel.listclaimItemViewModel || []
                            
                            $scope.filterModel.listclaimItemViewModel.push(angular.copy(param));
                        }
                        else if (param.rowItemIndex != undefined) {
                            
                            $scope.filterModel.listclaimItemViewModel[param.rowItemIndex] = param;
                        }
                        else {
                            
                            $scope.filterModel.listclaimItemViewModel.push(angular.copy(param));

                        }
                    }
                }
            };


            $scope.addDetailItem = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    
                    $scope.addDetailItem.onShow = !$scope.addDetailItem.onShow;
                    if (param) {
                        param.rowItemIndex = index;
                    }
                    $scope.addDetailItem.delegates(param);
                },
                config: {
                    title: "Claim"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        if ($scope.filterModel.listclaimItemViewModel == undefined) {
                            $scope.filterModel.listclaimItemViewModel = $scope.filterModel.listclaimItemViewModel || []
                            
                            $scope.filterModel.listclaimItemViewModel.push(angular.copy(param));
                        }
                        else if (param.rowItemIndex != undefined) {
                            
                            $scope.filterModel.listclaimItemViewModel[param.rowItemIndex] = param;
                        }
                        else {
                            
                            $scope.filterModel.listclaimItemViewModel.push(angular.copy(param));

                        }
                    }
                }
            };

            $scope.forwarderPopup = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {

                    $scope.forwarderPopup.onShow = !$scope.forwarderPopup.onShow;
                    $scope.forwarderPopup.delegates(param);
                },
                config: {
                    title: ""
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.forwarder_Index = angular.copy(param[0].forwarder_Index)
                        $scope.filterModel.forwarder_Id = angular.copy(param[0].forwarder_Id)
                        $scope.filterModel.forwarder_Name = angular.copy(param[0].forwarder_Name)
                    }
                }
            };

            $scope.vendorPopupPlan = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {

                    $scope.vendorPopupPlan.onShow = !$scope.vendorPopupPlan.onShow;
                    $scope.vendorPopupPlan.delegates(param);
                },
                config: {
                    title: ""
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.vendor_Index = angular.copy(param[0].vendor_Index)
                        $scope.filterModel.vendor_Id = angular.copy(param[0].vendor_Id)
                        $scope.filterModel.vendor_Name = angular.copy(param[0].vendor_Name)
                    }
                }
            };


            // $scope.images = $scope.filterModel.docfile;
            //         if ($scope.menu[i].active == "active") {
            //             $scope.menu[i].active = "";
            //             $scope.menu[i].completed = "completed";
            //             i++;
            //             $scope.menu[i].active = "active";
            //             $scope.menu_width = i * 50; //กำหนดความกว้างของเส้นเชื่อม
            //             $scope.menu_name = $scope.menu[i].name;
            //         }


            

            $scope.$watch("filterModel.owner_Name", function () {
                $scope.index = $scope.filterModel.owner_Index;
                if ($scope.filterModel.owner_Name == undefined
                    || $scope.filterModel.owner_Name == null
                    || $scope.filterModel.owner_Name == "") {
                    $scope.index = undefined;
                    $scope.filterModel.owner_Index = null;
                    $scope.filterModel.owner_Id = null;
                    $scope.filterModel.owner_Name = null;
                }
                else {
                    if ($scope.ownerOld.index != undefined) {
                        $scope.remember.index = $scope.ownerOld.index;
                        $scope.remember.id = $scope.ownerOld.id;
                        $scope.remember.name = $scope.ownerOld.name;
                        if ($scope.index != $scope.ownerOld.index
                            && $scope.filterModel.listclaimItemViewModel != undefined
                            && $scope.filterModel.listclaimItemViewModel.length > 0) {
                            dpMessageBox.confirm({
                                ok: 'Yes',
                                cancel: 'No',
                                title: 'Cancel',
                                message: 'Owner not Match do you whant to delete items ?'
                            }).then(function success() {
                                $scope.filterModel.listclaimItemViewModel = [];
                                $scope.filterModel.claim_No = null;
                                $scope.filterModel.claim_Index = null;
                                $scope.ownerOld.index = $scope.filterModel.owner_Index;
                                $scope.ownerOld.id = $scope.filterModel.owner_Id;
                                $scope.ownerOld.name = $scope.filterModel.owner_Name;
                            }, function error(res) {
                                if ($scope.remember.index != undefined) {
                                    $scope.filterModel.owner_Index = $scope.remember.index;
                                    $scope.filterModel.owner_Id = $scope.remember.id;
                                    $scope.filterModel.owner_Name = $scope.remember.name;
                                }
                            });
                        }
                    }

                    else {
                        $scope.ownerOld.index = $scope.filterModel.owner_Index;
                        $scope.ownerOld.id = $scope.filterModel.owner_Id;
                        $scope.ownerOld.name = $scope.filterModel.owner_Name;
                    }
                }
            });

            // $scope.popupPo = {
            //     onShow: false,
            //     delegates: {},
            //     onClick: function (param, owner_Index) {
            //         if ($scope.filterModel.owner_Index != null && ($scope.filterModel.owner_Index != '' && $scope.filterModel.owner_Index != null)) {
            //             owner_Index = $scope.filterModel.owner_Index;
            //         };
            //             $scope.popupPo.onShow = !$scope.popupPo.onShow;
            //             $scope.popupPo.delegates.poPopup($scope.filterModel.claim_No, owner_Index, true);
            //     },
            //     config: {
            //         title: "Po"
            //     },
            //     invokes: {
            //         add: function (param) { },
            //         edit: function (param) { },
            //         selected: function (param) {
            //             var purchaseOrder_Index = "";
            //             if (!param.length) {
            //                 if (param.purchaseOrder_Index == "") {
            //                     $scope.filterModel.purchaseOrder_Index = angular.copy(param.purchaseOrder_Index);
            //                     $scope.filterModel.purchaseOrder_No = angular.copy(param.purchaseOrder_No);
            //                 } else {
            //                     $scope.filterModel.purchaseOrder_Index = angular.copy(param.purchaseOrder_Index);
            //                     $scope.filterModel.purchaseOrder_No = angular.copy(param.purchaseOrder_No);
            //                     $scope.filterModel.warehouse_Index = angular.copy(param.warehouse_Index);
            //                     $scope.filterModel.warehouse_Id = angular.copy(param.warehouse_Id);
            //                     $scope.filterModel.warehouse_Name = angular.copy(param.warehouse_Name);
            //                     $scope.filterModel.warehouse_Index_To = angular.copy(param.warehouse_Index_To);
            //                     $scope.filterModel.warehouse_Id_To = angular.copy(param.warehouse_Id_To);
            //                     $scope.filterModel.warehouse_Name_To = angular.copy(param.warehouse_Name_To);
            //                     $scope.filterModel.planGRowner_Name = angular.copy(param.owner_Name);
            //                     $scope.filterModel.documentType_Index = angular.copy(param.grDocumentType_Index);
            //                     $scope.filterModel.documentType_Name = angular.copy(param.grDocumentType_Name);
            //                     $scope.filterModel.documentType_Id = angular.copy(param.grDocumentType_Id);
            //                     $scope.filterModel.purchaseOrder_NoTemp = $scope.filterModel.purchaseOrder_No;
            //                     $scope.filterModel.purchaseOrder_IndexTemp = $scope.filterModel.purchaseOrder_Index;
            //                 }
            //                 purchaseOrder_Index = "'" + $scope.filterModel.purchaseOrder_Index + "'";
            //             } else {
            //                 if (param[0].purchaseOrder_Index == "") {
            //                     $scope.filterModel.purchaseOrder_Index = angular.copy(param[0].purchaseOrder_Index);
            //                     $scope.filterModel.purchaseOrder_No = angular.copy(param[0].purchaseOrder_No);
            //                 } else {
            //                     $scope.filterModel.purchaseOrder_Index = angular.copy(param[0].purchaseOrder_Index);
            //                     $scope.filterModel.purchaseOrder_No = angular.copy(param[0].purchaseOrder_No);
            //                     $scope.filterModel.warehouse_Index = angular.copy(param[0].warehouse_Index);
            //                     $scope.filterModel.warehouse_Id = angular.copy(param[0].warehouse_Id);
            //                     $scope.filterModel.warehouse_Name = angular.copy(param[0].warehouse_Name);
            //                     $scope.filterModel.warehouse_Index_To = angular.copy(param[0].warehouse_Index_To);
            //                     $scope.filterModel.warehouse_Id_To = angular.copy(param[0].warehouse_Id_To);
            //                     $scope.filterModel.warehouse_Name_To = angular.copy(param[0].warehouse_Name_To);
            //                     $scope.filterModel.planGRowner_Name = angular.copy(param[0].owner_Name);
            //                     $scope.filterModel.documentType_Index = angular.copy(param[0].grDocumentType_Index);
            //                     $scope.filterModel.documentType_Name = angular.copy(param[0].grDocumentType_Name);
            //                     $scope.filterModel.documentType_Id = angular.copy(param[0].grDocumentType_Id);
            //                     $scope.filterModel.purchaseOrder_NoTemp = $scope.filterModel.purchaseOrder_No;
            //                     $scope.filterModel.purchaseOrder_IndexTemp = $scope.filterModel.purchaseOrder_Index;

            //                 }
            //                 purchaseOrder_Index = param.map(c => "'" + c.purchaseOrder_Index + "'");
            //                 $scope.filterModel.id = purchaseOrder_Index;
            //             }

            //             if ($scope.filterModel.listclaimItemViewModel == undefined)
            //                 $scope.filterModel.listclaimItemViewModel = [];
            //                 viewModelitem.getPurchaseOrderPopup($scope.filterModel).then((response) => {
            //                 let CountTotalQty = 0;
            //                 if (response.data) {

            //                     var groups = $scope.filterModel.listclaimItemViewModel.reduce(function (obj, item) {
            //                         obj[item.purchaseOrderItem_Index] = obj[item.purchaseOrderItem_Index] || [];
            //                         obj[item.purchaseOrderItem_Index].push(item.purchaseOrderItem_Index);
            //                         return obj;
            //                     }, {});
            //                     var myArray = Object.keys(groups).map(function (key) {
            //                         return { team: key };
            //                     });
            //                     if (myArray.length > 0) {
            //                         angular.forEach(myArray, function (v, k) {

            //                             var splice = response.data.filter(c => c.purchaseOrderItem_Index == v.team)
            //                             angular.forEach(splice, function (vv, kk) {
            //                                 var indexof = response.data.indexOf(vv)
            //                                 response.data.splice(indexof, 1)
            //                             });
            //                         });
            //                     }
            //                     if (response.data.length > 0) {
            //                         angular.forEach(response.data, function (vv, kk) {
            //                             if (vv.qty != 0) {
            //                                 var Qtyint = vv.qty;
            //                                 var q = vv.qty.toFixed(2);
            //                                 vv.qty = parseFloat(q);

            //                                 if (vv.weight == null) {
            //                                     vv.weight = vv.unitWeight * Qtyint;
            //                                     var w = vv.weight.toFixed(2);
            //                                     var wu = vv.unitWeight.toFixed(2);
            //                                     vv.weight = w
            //                                     vv.weightUnit = wu
            //                                 }
            //                                 else {
            //                                     // var Wint = vv.weight * Qtyint;
            //                                     var w = vv.weight.toFixed(2);
            //                                     var wu = vv.unitWeight.toFixed(2);
            //                                     vv.weight = w
            //                                     vv.weightUnit = wu
            //                                 }

            //                                 if (vv.volume == null) {
            //                                     vv.volume = vv.unitVolume * Qtyint;
            //                                     var vu = vv.unitVolume.toFixed(2);
            //                                     // var v = vv.volume.toFixed(2);
            //                                     // vv.volume = v
            //                                     vv.volumeUnit = vu
            //                                 }
            //                                 else {
            //                                     // var v = vv.volume.toFixed(2);
            //                                     var vu = vv.unitVolume.toFixed(2);
            //                                     // vv.volume = v
            //                                     vv.volumeUnit = vu
            //                                 }

            //                                 if (vv.price == null) {
            //                                     vv.price = 0 * Qtyint;
            //                                     var p = vv.price.toFixed(2);
            //                                     vv.price = p
            //                                     vv.priceUnit = p

            //                                 }
            //                                 else {
            //                                     var p = (vv.price * Qtyint).toFixed(2);
            //                                     var pu = vv.price.toFixed(2);
            //                                     vv.price = p
            //                                     vv.priceUnit = pu
            //                                 }

            //                                 // vv.volumeUnit = (vv.unitVolume / 1000000)
            //                                 vv.volume  =  (vv.volume)
            //                                 vv.volumeUnit = parseFloat(vv.volumeUnit/1000000);

            //                                 var v = vv.volume.toFixed(2);
            //                                 var vu = vv.volumeUnit.toFixed(2);
            //                                 vv.volume = v
            //                                 vv.volumeUnit = vu

            //                                 $scope.filterModel.listclaimItemViewModel.push(angular.copy(vv));
            //                             }
            //                         });
            //                     }
            //                     for (let index = 0; index < $scope.filterModel.listclaimItemViewModel.length; index++) {
            //                         if ($scope.filterModel.listclaimItemViewModel[index].ref_Document_No == undefined)
            //                             $scope.filterModel.listclaimItemViewModel[index].ref_Document_No = $scope.filterModel.listclaimItemViewModel[index].purchaseOrder_No;
            //                         $scope.filterModel.listclaimItemViewModel[index].ref_Document_Index = $scope.filterModel.listclaimItemViewModel[index].purchaseOrder_Index;
            //                         $scope.filterModel.listclaimItemViewModel[index].ref_DocumentItem_Index = $scope.filterModel.listclaimItemViewModel[index].purchaseOrderItem_Index;
            //                         $scope.filterModel.listclaimItemViewModel[index].goodsReceive_Remark = $scope.filterModel.listclaimItemViewModel[index].document_Remark;
            //                     }
            //                 }
            //             }, (error) => {
            //                 console.log(error);
            //             })
            //             // if (!param.length) {
            //             //     goodsReceiveFactory.updateUserAssignKey({ GoodsReceive_Index: param.purchaseOrder_Index, UserAssign: $window.localStorage['userGuidPlanReceive'] }).then((response) => { }, (error) => { console.log(error); })
            //             // } else {
            //             //     goodsReceiveFactory.updateUserAssignKey({ GoodsReceive_Index: param[0].purchaseOrder_Index, UserAssign: $window.localStorage['userGuidPlanReceive'] }).then((response) => { }, (error) => { console.log(error); })
            //             // }
            //         }
            //     }
            // };

            var init = function () {
                $scope.filterModel = {};
                $scope.filterModel.documents = [];
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterItemModel.delivery_Date = getToday();
                $scope.filterItemModel.documents = [];
                // $scope.dropdownwarehouse();
                $scope.dropdownDocumentType();
                // $scope.dropdownCostCenter();
                // $scope.dropdownShipmentType();
                // $scope.dropdownContainerType();
                // $scope.dropdownDockDoor();
                // $scope.dropdownVehicleType();
                // $scope.dropdownCargoType();
                // $scope.dropdownDocumentPriority();
                // $scope.dropdownUnloadingType();

                $scope.colortab1 = "#97bee7";
                $scope.colortab2 = "#D3D3D3";
                $scope.click = 1;

            };
            init();
        }
    })
})();