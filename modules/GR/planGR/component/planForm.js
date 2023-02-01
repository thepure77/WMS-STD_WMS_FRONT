(function () {
    'use strict'

    app.component('planForm', {
        controllerAs: '$vm',
        templateUrl: "modules/GR/planGR/component/planForm.html",
        bindings: {
            isLoading: '=?',
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',

        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, bkYardDockFactory, dpMessageBox, planGoodsReceiveFactory, planGoodsReceiveItemFactory, planGoodsIssueItemFactory, ownerPopFactory, webServiceAPI, Upload) {
            var $vm = this;

            var defer = {};
            var viewModel = planGoodsReceiveFactory;
            var viewModelitem = planGoodsReceiveItemFactory
            var ownerModel = ownerPopFactory
            $scope.filterModel = {};
            $scope.filterItemModel = {};
            $scope.index = {};
            $scope.ownerOld = {};
            $scope.remember = {};
            $vm.isFilterTable = true;
            $scope.onShow = false;
            $scope.Yard = false;
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


            $scope.$watch("dropdownDocumentType.model", function () {

                $scope.index = $scope.dropdownDocumentType.model.documentType_Index
                if ($scope.index == '738bad05-7c3f-42bd-abc1-1316c44b8ea1') {
                    $scope.blockSales = 1;
                } else {
                    $scope.blockSales = 0;
                }
            });

            $vm.onShow = function (param) {
                
                defer = $q.defer();

                $scope.onShow = true;
                $scope.filterModel.planGoodsReceive_Date = getToday();
                $scope.filterModel.planGoodsReceive_Due_Date = getToday();
                $scope.filterModel.planGoodsReceive_Time = getTime();
                $scope.filterModel.planGoodsReceive_Due_DateTime = getTime();
                $scope.clickTab(1);

                if (param != undefined) {
                    pageLoading.show()
                    viewModel.getId(param.planGoodsReceive_Index).then(function (res) {
                        pageLoading.hide()
                        var warehouse = $scope.dropdownwarehouse
                        const resultsWarehouse = warehouse.filter((warehouse) => {
                            return warehouse.warehouse_Name == res.data.warehouse_Name;
                        })
                        $scope.dropdownwarehouse.model = resultsWarehouse[0];

                        var documentType = $scope.dropdownDocumentType
                        const resultsDocumentType = documentType.filter((documentType) => {
                            return documentType.documentType_Index == res.data.documentType_Index;
                        })
                        $scope.dropdownDocumentType.model = resultsDocumentType[0];

                        var CostCenter = $scope.dropdownCostCenter
                        const resultsCostCenter = CostCenter.filter((CostCenter) => {
                            return CostCenter.costCenter_Index == res.data.costCenter_Index;
                        })
                        $scope.dropdownCostCenter.model = resultsCostCenter[0];

                        var ShipmentType = $scope.dropdownShipmentType
                        const resultsShipmentType = ShipmentType.filter((ShipmentType) => {
                            return ShipmentType.shipmentType_Index == res.data.shipmentType_Index;
                        })
                        $scope.dropdownShipmentType.model = resultsShipmentType[0];

                        var ContainerType = $scope.dropdownContainerType
                        const resultsContainerType = ContainerType.filter((ContainerType) => {
                            return ContainerType.containerType_Index == res.data.containerType_Index;
                        })
                        $scope.dropdownContainerType.model = resultsContainerType[0];

                        var DockDoor = $scope.dropdownDockDoor
                        const resultsDockDoor = DockDoor.filter((DockDoor) => {
                            return DockDoor.dock_Index == res.data.dock_Index;
                        })
                        $scope.dropdownDockDoor.model = resultsDockDoor[0];

                        var VehicleType = $scope.dropdownVehicleType
                        const resultsVehicleType = VehicleType.filter((VehicleType) => {
                            return VehicleType.vehicleType_Index == res.data.vehicleType_Index;
                        })
                        $scope.dropdownVehicleType.model = resultsVehicleType[0];

                        var CargoType = $scope.dropdownCargoType
                        const resultsCargoType = CargoType.filter((CargoType) => {
                            return CargoType.cargoType_Index == res.data.cargoType_Index;
                        })
                        $scope.dropdownCargoType.model = resultsCargoType[0];

                        var DocumentPriority = $scope.dropdownDocumentPriority
                        const resultsDocumentPriority = DocumentPriority.filter((DocumentPriority) => {
                            return DocumentPriority.documentPriority_Index == res.data.documentPriority_Index;
                        })
                        $scope.dropdownDocumentPriority.model = resultsDocumentPriority[0];

                        var UnloadingType = $scope.dropdownUnloadingType
                        const resultsUnloadingType = UnloadingType.filter((UnloadingType) => {
                            return UnloadingType.unloadingType_Index == res.data.unloadingType_Index;
                        })
                        $scope.dropdownUnloadingType.model = resultsUnloadingType[0];




                        $scope.filterModel = res.data;
                        $scope.filterModel.log_udf_2 = getToday();
                        $scope.filterModel.log_udf_3 = getTime();
                        $scope.buttons.add = false;
                        $scope.buttons.update = true;

                        if ($scope.filterModel.documentStatus == 1 || $scope.filterModel.documentStatus == 2 || $scope.filterModel.documentStatus == -1 || $scope.filterModel.documentStatus == 3)
                            $scope.buttons.update = false;
                        planGoodsReceiveItemFactory.getByPlanGoodReceiveId(param.planGoodsReceive_Index).then(function (res) {
                            $scope.filterModel.listPlanGoodsReceiveItemViewModel = res.data;
                        });
                    });
                }
                else {
                    
                    $scope.buttons.add = true;
                    $scope.filterModel = bkYardDockFactory.getParam();
                    bkYardDockFactory.setParam(undefined)

                    if ($scope.buttons.add) {
                        if ($scope.filterModel == undefined) {
                            $scope.filterModel = {};
                            $scope.filterModel.log_udf_2 = getToday();
                            $scope.filterModel.log_udf_3 = getTime();
                            $scope.filterModel.planGoodsReceive_Date = getToday();
                            $scope.filterModel.planGoodsReceive_Due_Date = getToday();
                            $scope.filterModel.planGoodsReceive_Time = getTime();
                            $scope.filterModel.planGoodsReceive_Due_DateTime = getTime();
                            $scope.filterModel.planGoodsReceive_Date = getToday();
                            $scope.filterModel.planGoodsReceive_Due_Date = getToday();
                            $scope.dropdownwarehouse.model = $scope.dropdownwarehouse[0];
                            $scope.filterModel.owner_Index = '02b31868-9d3d-448e-b023-05c121a424f4';
                            $scope.filterModel.owner_Name = 'Amazon';
                            $scope.filterModel.owner_Id = '3419';

                        } else {
                            $scope.criteria = {}
                            $scope.criteria.appointment_Index = $scope.filterModel.appointment_Index;
                            $scope.Yard = true;
                            $scope.filterModel.planGoodsReceive_Date = $scope.filterModel.appointment_Date;
                            $scope.filterModel.planGoodsReceive_Due_Date = $scope.filterModel.appointment_Date;
                            $scope.filterModel.planGoodsReceive_Time = getTime();
                            $scope.filterModel.planGoodsReceive_Due_DateTime = getTime();
                            $scope.filterModel.planGoodsReceive_Date = $scope.filterModel.appointment_Date;
                            $scope.filterModel.planGoodsReceive_Due_Date = $scope.filterModel.appointment_Date;
                            $scope.filterModel.log_udf_2 = getToday();
                            $scope.filterModel.log_udf_3 = getTime();
                        }

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
                model.listPlanGoodsReceiveItemViewModel = $scope.filterModel.listPlanGoodsReceiveItemViewModel.filter(c => c.qty != 0);
                if ($scope.Yard) {
                    model.Yard = '1';
                }
                model.operations = "ADD";
                if ($scope.filterModel.planGoodsReceive_Time != "") {
                    var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test($scope.filterModel.planGoodsReceive_Time);
                    if (isValid) {
                        $scope.filterModel.IsTime = true;
                    } else {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'ALERT',
                                message: 'MSG_Alert_Time_Format'
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
                            message: 'MSG_Alert_PLEASE_SELECTED_plan_Time'
                        }
                    )
                    return "";
                }
                if (!$scope.filterModel.owner_Index) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'MSG_Alert_Owner'
                        }
                    )
                    return "";
                }
                if (!$scope.filterModel.planGoodsReceive_Date) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'MSG_Alert_planGoodsReceive_Date'
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

                if ($scope.dropdownwarehouse.model != null) {
                    $scope.filterModel.warehouse_Index = $scope.dropdownwarehouse.model.warehouse_Index;
                    $scope.filterModel.warehouse_Id = $scope.dropdownwarehouse.model.warehouse_Id;
                    $scope.filterModel.warehouse_Name = $scope.dropdownwarehouse.model.warehouse_Name;
                }
                else {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'MSG_Alert_Warehouse'
                        }
                    )
                    return "";
                }


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


                if ($scope.dropdownShipmentType.model != null) {
                    $scope.filterModel.shipmentType_Index = $scope.dropdownShipmentType.model.shipmentType_Index;
                    $scope.filterModel.shipmentType_Id = $scope.dropdownShipmentType.model.shipmentType_Id;
                    $scope.filterModel.shipmentType_Name = $scope.dropdownShipmentType.model.shipmentType_Name;
                }
                else {
                    $scope.filterModel.shipmentType_Index = null;
                    $scope.filterModel.shipmentType_Id = null;
                    $scope.filterModel.shipmentType_Name = null;
                }

                if ($scope.dropdownContainerType.model != null) {
                    $scope.filterModel.containerType_Index = $scope.dropdownContainerType.model.containerType_Index;
                    $scope.filterModel.containerType_Id = $scope.dropdownContainerType.model.containerType_Id;
                    $scope.filterModel.containerType_Name = $scope.dropdownContainerType.model.containerType_Name;
                }
                else {
                    $scope.filterModel.containerType_Index = null;
                    $scope.filterModel.containerType_Id = null;
                    $scope.filterModel.containerType_Name = null;
                }

                if ($scope.dropdownDockDoor.model != null) {
                    $scope.filterModel.dock_Index = $scope.dropdownDockDoor.model.dock_Index;
                    $scope.filterModel.dock_Id = $scope.dropdownDockDoor.model.dock_Id;
                    $scope.filterModel.dock_Name = $scope.dropdownDockDoor.model.dock_Name;
                }
                else {
                    $scope.filterModel.dock_Index = null;
                    $scope.filterModel.dock_Id = null;
                    $scope.filterModel.dock_Name = null;
                }

                if ($scope.dropdownVehicleType.model != null) {
                    $scope.filterModel.vehicleType_Index = $scope.dropdownVehicleType.model.vehicleType_Index;
                    $scope.filterModel.vehicleType_Id = $scope.dropdownVehicleType.model.vehicleType_Id;
                    $scope.filterModel.vehicleType_Name = $scope.dropdownVehicleType.model.vehicleType_Name;
                }
                else {
                    $scope.filterModel.vehicleType_Index = null;
                    $scope.filterModel.vehicleType_Id = null;
                    $scope.filterModel.vehicleType_Name = null;
                }

                if ($scope.dropdownCargoType.model != null) {
                    $scope.filterModel.cargoType_Index = $scope.dropdownCargoType.model.cargoType_Index;
                    $scope.filterModel.cargoType_Id = $scope.dropdownCargoType.model.cargoType_Id;
                    $scope.filterModel.cargoType_Name = $scope.dropdownCargoType.model.cargoType_Name;
                }
                else {
                    $scope.filterModel.cargoType_Index = null;
                    $scope.filterModel.cargoType_Id = null;
                    $scope.filterModel.cargoType_Name = null;
                }

                if ($scope.dropdownDocumentPriority.model != null) {
                    $scope.filterModel.documentPriority_Index = $scope.dropdownDocumentPriority.model.documentPriority_Index;
                    $scope.filterModel.documentPriority_Id = $scope.dropdownDocumentPriority.model.documentPriority_Id;
                    $scope.filterModel.documentPriority_Name = $scope.dropdownDocumentPriority.model.documentPriority_Name;
                }
                else {
                    $scope.filterModel.documentPriority_Index = null;
                    $scope.filterModel.documentPriority_Id = null;
                    $scope.filterModel.documentPriority_Name = null;
                }
                if ($scope.dropdownUnloadingType.model != null) {
                    $scope.filterModel.unloadingType_Index = $scope.dropdownUnloadingType.model.unloadingType_Index;
                    $scope.filterModel.unloadingType_Id = $scope.dropdownUnloadingType.model.unloadingType_Id;
                    $scope.filterModel.unloadingType_Name = $scope.dropdownUnloadingType.model.unloadingType_Name;
                }
                else {
                    $scope.filterModel.unloadingType_Index = null;
                    $scope.filterModel.unloadingType_Id = null;
                    $scope.filterModel.documentPriority_Name = null;
                }

                if ($scope.dropdownCostCenter.model != null) {
                    $scope.filterModel.costCenter_Index = $scope.dropdownCostCenter.model.costCenter_Index;
                    $scope.filterModel.costCenter_Id = $scope.dropdownCostCenter.model.costCenter_Id;
                    $scope.filterModel.costCenter_Name = $scope.dropdownCostCenter.model.costCenter_Name;
                }
                else {
                    $scope.filterModel.costCenter_Index = null;
                    $scope.filterModel.costCenter_Id = null;
                    $scope.filterModel.costCenter_Name = null;
                }



                var listmodel = $scope.filterModel.listPlanGoodsReceiveItemViewModel;
                if (model.listPlanGoodsReceiveItemViewModel == undefined) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'ต้องเพิ่มสินค้าอย่างน้อย 1 รายการ'
                        }
                    )
                    return "";
                }

                if (model.listPlanGoodsReceiveItemViewModel.length <= 0) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'กรุณากรอก Qty อย่างน้อย 1 รายการ'
                        }
                    )
                    return "";
                }

                for (let index = 0; index < model.listPlanGoodsReceiveItemViewModel.length; index++) {
                    if ((model.listPlanGoodsReceiveItemViewModel[index].qty * model.listPlanGoodsReceiveItemViewModel[index].ratio).toFixed(6) > model.listPlanGoodsReceiveItemViewModel[index].remainingPO_Qty) {
                        debugger
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'ALERT',
                                message: model.listPlanGoodsReceiveItemViewModel[index].product_Id + ': ไม่สามารถกรอกจำนวนเกิน PO ที่คงเหลือได้'
                            }
                        )
                        return "";
                    }
                }

                dpMessageBox.confirm({
                    ok: 'ใช่',
                    cancel: 'ไม่',
                    title: 'ยืนยันข้อมูล ?',
                    message: 'คุณต้องการบันทึกข้อมูลหรือไม่!'
                }).then(function () {
                    model.create_By = localStorageService.get('userTokenStorage');
                    for (let index = 0; index < model.listPlanGoodsReceiveItemViewModel.length; index++) {
                        model.listPlanGoodsReceiveItemViewModel[index].uDF1 = model.planGoodsIssueNo;
                        model.listPlanGoodsReceiveItemViewModel[index].uDF4 = model.planGoodsIssueIndex;
                        model.listPlanGoodsReceiveItemViewModel[index].uDF5 = model.listPlanGoodsReceiveItemViewModel[index].planGoodsIssueItemIndex;
                    }
                    model.log_udf_4 =getToday();
                    model.log_udf_5 =getTime();
                    viewModel.add(model).then(
                        function success(res) {

                            if (res.data.message == true) {
                                debugger;
                                $scope.document_No = {};
                                $scope.document_No = res.data.document_No;
                                model.operations = model.operations+" "+res.data.document_No;
                                // $scope.logmodel = model;
                                viewModel.savelogsRequest(model).then(function () {
                                });

                                if ($scope.Yard) {
                                    $scope.criteria.Create_By = localStorageService.get('userTokenStorage');
                                    $scope.criteria.document_No = res.data.document_No;
                                    $scope.criteria.planGoodsReceive_Index = res.data.planGoodsReceive_Index;

                                    bkYardDockFactory.getApprove($scope.criteria).then(function success(res) {
                                        if (res.data == true) {
                                            dpMessageBox.alert(
                                                {
                                                    ok: 'Close',
                                                    title: 'บันทึกสำเร็จ',
                                                    message: 'เลขที่ใบจัดส่งสินค้า :' + $scope.document_No
                                                }
                                            )
                                            $state.go('wms.bk_yard_dock_summary');

                                        }
                                        $vm.triggerSearch();
                                    }, function error(res) {

                                    });

                                } else {
                                    dpMessageBox.alert(
                                        {
                                            ok: 'ปิด',
                                            title: 'บันทึกสำเร็จ',
                                            message: 'เลขที่ใบจัดส่งสินค้า :' + res.data.document_No
                                        }
                                    )
                                    $scope.filterModel = {};
                                    $scope.dropdownwarehouse.model = {};
                                    $scope.dropdownDocumentType.model = {};
                                    $scope.dropdownRound.model = {};
                                    $scope.dropdownTypeCar.model = {};
                                    $scope.dropdownTransport.model = {};
                                    $scope.dropdownProductconversion.model = {};
                                    $scope.filterModel.planGoodsReceive_Date = getToday();
                                    $scope.filterModel.planGoodsReceive_Due_Date = getToday();
                                    defer.resolve();
                                }

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
                // var listmodel = $scope.filterModel.listPlanGoodsReceiveItemViewModel;

                if ($scope.filterModel.planGoodsReceive_Time != "") {
                    var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test($scope.filterModel.planGoodsReceive_Time);
                    if (isValid) {
                        $scope.filterModel.IsTime = true;
                    } else {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'ALERT',
                                message: 'MSG_Alert_Time_Format'
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
                            message: 'MSG_Alert_PLEASE_SELECTED_plan_Time'
                        }
                    )
                    return "";
                }
                if (!$scope.filterModel.owner_Index) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'MSG_Alert_Owner'
                        }
                    )
                    return "";
                }
                if (!$scope.filterModel.planGoodsReceive_Date) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'MSG_Alert_planGoodsReceive_Date'
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

                if ($scope.dropdownwarehouse.model != null) {
                    $scope.filterModel.warehouse_Index = $scope.dropdownwarehouse.model.warehouse_Index;
                    $scope.filterModel.warehouse_Id = $scope.dropdownwarehouse.model.warehouse_Id;
                    $scope.filterModel.warehouse_Name = $scope.dropdownwarehouse.model.warehouse_Name;
                }
                else {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'MSG_Alert_Warehouse'
                        }
                    )
                    return "";
                }


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


                if ($scope.dropdownShipmentType.model != null) {
                    $scope.filterModel.shipmentType_Index = $scope.dropdownShipmentType.model.shipmentType_Index;
                    $scope.filterModel.shipmentType_Id = $scope.dropdownShipmentType.model.shipmentType_Id;
                    $scope.filterModel.shipmentType_Name = $scope.dropdownShipmentType.model.shipmentType_Name;
                }
                else {
                    $scope.filterModel.shipmentType_Index = null;
                    $scope.filterModel.shipmentType_Id = null;
                    $scope.filterModel.shipmentType_Name = null;
                }

                if ($scope.dropdownContainerType.model != null) {
                    $scope.filterModel.containerType_Index = $scope.dropdownContainerType.model.containerType_Index;
                    $scope.filterModel.containerType_Id = $scope.dropdownContainerType.model.containerType_Id;
                    $scope.filterModel.containerType_Name = $scope.dropdownContainerType.model.containerType_Name;
                }
                else {
                    $scope.filterModel.containerType_Index = null;
                    $scope.filterModel.containerType_Id = null;
                    $scope.filterModel.containerType_Name = null;
                }

                if ($scope.dropdownDockDoor.model != null) {
                    $scope.filterModel.dock_Index = $scope.dropdownDockDoor.model.dock_Index;
                    $scope.filterModel.dock_Id = $scope.dropdownDockDoor.model.dock_Id;
                    $scope.filterModel.dock_Name = $scope.dropdownDockDoor.model.dock_Name;
                }
                else {
                    $scope.filterModel.dock_Index = null;
                    $scope.filterModel.dock_Id = null;
                    $scope.filterModel.dock_Name = null;
                }

                if ($scope.dropdownVehicleType.model != null) {
                    $scope.filterModel.vehicleType_Index = $scope.dropdownVehicleType.model.vehicleType_Index;
                    $scope.filterModel.vehicleType_Id = $scope.dropdownVehicleType.model.vehicleType_Id;
                    $scope.filterModel.vehicleType_Name = $scope.dropdownVehicleType.model.vehicleType_Name;
                }
                else {
                    $scope.filterModel.vehicleType_Index = null;
                    $scope.filterModel.vehicleType_Id = null;
                    $scope.filterModel.vehicleType_Name = null;
                }

                if ($scope.dropdownCargoType.model != null) {
                    $scope.filterModel.cargoType_Index = $scope.dropdownCargoType.model.cargoType_Index;
                    $scope.filterModel.cargoType_Id = $scope.dropdownCargoType.model.cargoType_Id;
                    $scope.filterModel.cargoType_Name = $scope.dropdownCargoType.model.cargoType_Name;
                }
                else {
                    $scope.filterModel.cargoType_Index = null;
                    $scope.filterModel.cargoType_Id = null;
                    $scope.filterModel.cargoType_Name = null;
                }

                if ($scope.dropdownDocumentPriority.model != null) {
                    $scope.filterModel.documentPriority_Index = $scope.dropdownDocumentPriority.model.documentPriority_Index;
                    $scope.filterModel.documentPriority_Id = $scope.dropdownDocumentPriority.model.documentPriority_Id;
                    $scope.filterModel.documentPriority_Name = $scope.dropdownDocumentPriority.model.documentPriority_Name;
                }
                else {
                    $scope.filterModel.documentPriority_Index = null;
                    $scope.filterModel.documentPriority_Id = null;
                    $scope.filterModel.documentPriority_Name = null;
                }
                if ($scope.dropdownUnloadingType.model != null) {
                    $scope.filterModel.unloadingType_Index = $scope.dropdownUnloadingType.model.unloadingType_Index;
                    $scope.filterModel.unloadingType_Id = $scope.dropdownUnloadingType.model.unloadingType_Id;
                    $scope.filterModel.unloadingType_Name = $scope.dropdownUnloadingType.model.unloadingType_Name;
                }
                else {
                    $scope.filterModel.unloadingType_Index = null;
                    $scope.filterModel.unloadingType_Id = null;
                    $scope.filterModel.documentPriority_Name = null;
                }

                if ($scope.dropdownCostCenter.model != null) {
                    $scope.filterModel.costCenter_Index = $scope.dropdownCostCenter.model.costCenter_Index;
                    $scope.filterModel.costCenter_Id = $scope.dropdownCostCenter.model.costCenter_Id;
                    $scope.filterModel.costCenter_Name = $scope.dropdownCostCenter.model.costCenter_Name;
                }
                else {
                    $scope.filterModel.costCenter_Index = null;
                    $scope.filterModel.costCenter_Id = null;
                    $scope.filterModel.costCenter_Name = null;
                }



                var listmodel = $scope.filterModel.listPlanGoodsReceiveItemViewModel;
                if ($scope.filterModel.listPlanGoodsReceiveItemViewModel == undefined) {
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
                    viewModel.getId(model.planGoodsReceive_Index).then(function (res) {
                        if (res.data.userAssign != $scope.userName) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "User ไม่ตรงกับ UserAssign"
                            })
                            $scope.filterModel = {};
                            $scope.dropdownwarehouse.model = {};
                            $scope.dropdownDocumentType.model = {};
                            $scope.dropdownRound.model = {};
                            $scope.dropdownTypeCar.model = {};
                            $scope.dropdownTransport.model = {};
                            $scope.dropdownProductconversion.model = {};
                            $scope.filterModel.planGoodsReceive_Date = getToday();
                            $scope.filterModel.planGoodsReceive_Due_Date = getToday();
                            defer.resolve();
                        }
                        else {
                            model.update_By = localStorageService.get('userTokenStorage');
                            model.log_udf_4 =getToday();
                            model.log_udf_5 =getTime();
                            viewModel.add(model).then(
                                function success(res) {
                                    model.operations = model.operations+" "+res.data.document_No;
                                    // $scope.logmodel = model;
                                    viewModel.savelogsRequest(model).then(function () {
                                    });

                                    $vm.filterModel = res.config.data;
                                    $vm.searchResultModel = res.config.data;
                                    $scope.filterModel = {};
                                    $scope.dropdownwarehouse.model = {};
                                    $scope.dropdownDocumentType.model = {};
                                    $scope.dropdownRound.model = {};
                                    $scope.dropdownTypeCar.model = {};
                                    $scope.dropdownTransport.model = {};
                                    $scope.dropdownProductconversion.model = {};
                                    $scope.filterModel.planGoodsReceive_Date = getToday();
                                    $scope.filterModel.planGoodsReceive_Due_Date = getToday();
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

                        }
                    });
                },
                    function error(param) {
                    });
            }

            $scope.back = function () {
                $scope.deleteuser = {};
                if ($scope.Yard) {
                    $state.go('wms.bk_yard_dock_summary');

                } else {
                    if ($scope.filterModel.planGoodsReceive_Index != undefined) {
                        $scope.deleteuser.planGoodsReceive_Index = $scope.filterModel.planGoodsReceive_Index;
                        viewModel.deleteUserAssign($scope.deleteuser).then(
                            function success(results) {
                                $scope.filterModel = {};
                                $scope.dropdownwarehouse.model = {};
                                $scope.dropdownDocumentType.model = {};
                                defer.resolve();
                            }
                        );
                    }
                    else {
                        $scope.filterModel = {};
                        $scope.dropdownwarehouse.model = {};
                        $scope.dropdownDocumentType.model = {};
                        defer.resolve();
                    }
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

                if ($scope.filterItemModel.qty == undefined || $scope.filterItemModel.qty == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'กรุณาเลือกจำนวนสินค้า !'
                        }
                    )
                    return "";
                }
                else {

                    var num = parseFloat($scope.filterItemModel.qty);
                    var n = num.toFixed(3);
                    $scope.filterItemModel.qty = n;
                }
                if ($scope.filterItemModel.start_Date == undefined || $scope.filterItemModel.start_Date == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'กรุณาเลือกวันที่เริ่มสัญญา!'
                        }
                    )
                    return "";
                }
                if ($scope.filterItemModel.end_Date == undefined || $scope.filterItemModel.end_Date == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'กรุณาเลือกวันที่สิ้นสุดสัญญา!'
                        }
                    )
                    return "";
                }
                if ($scope.filterItemModel.start_Date != "" && $scope.filterItemModel.end_Date != "") {
                    var pattern = /(\d{4})(\d{2})(\d{2})/;
                    var ds = Date.parse($scope.filterItemModel.start_Date.replace(pattern, '$1-$2-$3'));
                    var de = Date.parse($scope.filterItemModel.end_Date.replace(pattern, '$1-$2-$3'));

                    if (ds > de) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Validate',
                            message: 'ระบุวันที่ Validity ไม่ถูกต้อง !'
                        })
                        return "";
                    }
                }
                if ($scope.filterItemModel.delivery_Date == undefined || $scope.filterItemModel.delivery_Date == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'กรุณาเลือกวันที่ส่งมอบ !'
                        }
                    )
                    return "";
                }

                if (!(!isNaN(parseFloat($scope.filterItemModel.qty)) && angular.isNumber(parseFloat($scope.filterItemModel.qty)))) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please insert number qty !'
                        }
                    )
                    return "";
                } else {
                    if (parseFloat($scope.filterItemModel.qty) <= 0) {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Validate',
                                message: 'Please insert number more than 0 !'
                            }
                        )
                        return "";
                    }
                }

                if ($scope.filterModel.listPlanGoodsReceiveItemViewModel == undefined) {
                    $scope.filterModel.listPlanGoodsReceiveItemViewModel = $scope.filterModel.listPlanGoodsReceiveItemViewModel || []
                    $scope.filterModel.listPlanGoodsReceiveItemViewModel.push(angular.copy(param));
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

                    $scope.filterModel.listPlanGoodsReceiveItemViewModel[param.rowItemIndex].product_Id = $scope.filterItemModel.product_Id;
                    $scope.filterModel.listPlanGoodsReceiveItemViewModel[param.rowItemIndex].product_Index = $scope.filterItemModel.product_Index;
                    $scope.filterModel.listPlanGoodsReceiveItemViewModel[param.rowItemIndex].product_Name = $scope.filterItemModel.product_Name;
                    $scope.filterModel.listPlanGoodsReceiveItemViewModel[param.rowItemIndex].qty = $scope.filterItemModel.qty;
                    $scope.filterModel.listPlanGoodsReceiveItemViewModel[param.rowItemIndex].productconversion_Index = param.productconversion_Index;
                    $scope.filterModel.listPlanGoodsReceiveItemViewModel[param.rowItemIndex].productconversion_Id = param.productconversion_Id;
                    $scope.filterModel.listPlanGoodsReceiveItemViewModel[param.rowItemIndex].productconversion_Name = param.productconversion_Name;
                    $scope.filterModel.listPlanGoodsReceiveItemViewModel[param.rowItemIndex].weight = $scope.filterItemModel.weight;
                    $scope.filterModel.listPlanGoodsReceiveItemViewModel[param.rowItemIndex].ratio = param.ratio;
                    $scope.filterModel.listPlanGoodsReceiveItemViewModel[param.rowItemIndex].documentItem_Remark = $scope.filterItemModel.documentItem_Remark;
                    $scope.filterModel.listPlanGoodsReceiveItemViewModel[param.rowItemIndex].start_Date = $scope.filterItemModel.start_Date;
                    $scope.filterModel.listPlanGoodsReceiveItemViewModel[param.rowItemIndex].end_Date = $scope.filterItemModel.end_Date;
                    $scope.filterModel.listPlanGoodsReceiveItemViewModel[param.rowItemIndex].delivery_Date = $scope.filterItemModel.delivery_Date;

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
                    $scope.filterModel.listPlanGoodsReceiveItemViewModel.push(angular.copy(param));
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
                owner: "AutoPlanGoodsReceive/autoOwnerfilter",
                planGoodsReceive_No: "AutoPlanGoodsReceive/autoPlanGoodsReceiveNo",
                warehouse_Name: "AutoPlanGoodsReceive/autoWarehousefilter",
                vendor: "AutoPlanGoodsReceive/autoVenderfilter",
                documentType: "AutoPlanGoodsReceive/autoDocumentTypefilter",
                processStatus: "AutoPlanGoodsReceive/autoStatusfilter",
                sku: "AutoPlanGoodsReceive/autoSkufilter",
                product: "AutoPlanGoodsReceive/autoProductfilter",

            };

            $scope.url = {
                PlanGR: webServiceAPI.PlanGR,
            };
            $scope.dropdownwarehouse = function () {
                viewModel.dropdownwarehouse($scope.filterModel).then(function (res) {
                    $scope.dropdownwarehouse = res.data;
                });
            };
            $scope.dropdownDocumentType = function () {
                viewModel.dropdownDocumentType($scope.filterModel).then(function (res) {
                    $scope.dropdownDocumentType = res.data;
                });
            };
            $scope.dropdownRound = function () {
                viewModel.dropdownRound($scope.filterModel).then(function (res) {
                    $scope.dropdownRound = res.data;
                });
            };
            $scope.dropdownProductconversion = function () {
                viewModel.dropdownProductconversion($scope.filterModel).then(function (res) {
                    $scope.dropdownProductconversion = res.data;
                });
            };

            $scope.dropdownTypeCar = function () {
                viewModel.dropdownTypeCar($scope.filterModel).then(function (res) {
                    $scope.dropdownTypeCar = res.data;
                });
            };
            $scope.dropdownTransport = function () {
                viewModel.dropdownTransport($scope.filterModel).then(function (res) {
                    $scope.dropdownTransport = res.data;
                });
            };

            $scope.dropdownCostCenter = function () {
                viewModel.dropdownCostCenter($scope.filterModel).then(function (res) {
                    $scope.dropdownCostCenter = res.data;
                });
            };
            $scope.dropdownShipmentType = function () {
                viewModel.dropdownShipmentType($scope.filterModel).then(function (res) {
                    $scope.dropdownShipmentType = res.data;
                });
            };
            $scope.dropdownContainerType = function () {
                viewModel.dropdownContainerType($scope.filterModel).then(function (res) {
                    $scope.dropdownContainerType = res.data;
                });
            };
            $scope.dropdownDockDoor = function () {
                viewModel.dropdownDockDoor($scope.filterModel).then(function (res) {
                    $scope.dropdownDockDoor = res.data;
                });
            };

            $scope.dropdownVehicleType = function () {
                viewModel.dropdownVehicleType($scope.filterModel).then(function (res) {
                    $scope.dropdownVehicleType = res.data;
                });
            };

            $scope.dropdownCargoType = function () {
                viewModel.dropdownCargoType($scope.filterModel).then(function (res) {
                    $scope.dropdownCargoType = res.data;
                });
            };
            $scope.dropdownDocumentPriority = function () {
                viewModel.dropdownDocumentPriority($scope.filterModel).then(function (res) {
                    $scope.dropdownDocumentPriority = res.data;
                });
            };

            $scope.dropdownUnloadingType = function () {
                viewModel.dropdownUnloadingType($scope.filterModel).then(function (res) {
                    $scope.dropdownUnloadingType = res.data;
                });
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
                    title: "PlanGr"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        if ($scope.filterModel.listPlanGoodsReceiveItemViewModel == undefined) {
                            $scope.filterModel.listPlanGoodsReceiveItemViewModel = $scope.filterModel.listPlanGoodsReceiveItemViewModel || []
                            $scope.filterModel.listPlanGoodsReceiveItemViewModel.push(angular.copy(param));
                        }
                        else if (param.rowItemIndex != undefined) {
                            $scope.filterModel.listPlanGoodsReceiveItemViewModel[param.rowItemIndex] = param;
                        }
                        else {
                            $scope.filterModel.listPlanGoodsReceiveItemViewModel.push(angular.copy(param));

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

            $scope.uploadFile = {
                url: webServiceAPI.PlanGR + "PlanGoodsReceive/importFileInboundV2",
                delegates: {},
                config: {
                    showModal: false
                },
                invokes: {},
                onClick: function (file, param) {
                    pageLoading.show();
                    Upload.upload({
                        url: $scope.uploadFile.url,
                        data: {
                            File: file,
                            'username': ""
                        }
                    }).then(function (resp) {
                        param.documents.push({ path: resp.data.value, urlAttachFile: resp.data.url, type: "PlanGoodsReceive", filename: resp.data.url.replace(/^.*[\\\/]/, ''), isDelete: false });
                        pageLoading.hide();
                    }, function (resp) {
                        console.log('Error status: ' + resp.status);
                        pageLoading.hide();
                    }, function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                    });
                }
            };

            $scope.delDocument = function (attachFileRow) {
                dpMessageBox.confirm({
                    title: 'Confirm ?',
                    message: 'Do you want to delete!'
                }).then(function () {
                    attachFileRow.isDelete = true;
                });
            }

            // $scope.$watch("filterModel.owner_Name", function () {
            //     $scope.index = $scope.filterModel.owner_Index;
            //     if ($scope.filterModel.owner_Name == undefined
            //         || $scope.filterModel.owner_Name == null
            //         || $scope.filterModel.owner_Name == "") {
            //         $scope.index = undefined;
            //         $scope.filterModel.owner_Index = null;
            //         $scope.filterModel.owner_Id = null;
            //         $scope.filterModel.owner_Name = null;
            //     }
            //     else {
            //         if ($scope.ownerOld.index != undefined) {
            //             $scope.remember.index = $scope.ownerOld.index;
            //             $scope.remember.id = $scope.ownerOld.id;
            //             $scope.remember.name = $scope.ownerOld.name;
            //             if ($scope.index != $scope.ownerOld.index
            //                 && $scope.filterModel.listPlanGoodsReceiveItemViewModel != undefined
            //                 && $scope.filterModel.listPlanGoodsReceiveItemViewModel.length > 0) {
            //                 dpMessageBox.confirm({
            //                     ok: 'Yes',
            //                     cancel: 'No',
            //                     title: 'Cancel',
            //                     message: 'Owner not Match do you whant to delete items ?'
            //                 }).then(function success() {
            //                     $scope.filterModel.listPlanGoodsReceiveItemViewModel = [];
            //                     $scope.filterModel.planGoodsReceive_No = null;
            //                     $scope.filterModel.planGoodsReceive_Index = null;
            //                     $scope.ownerOld.index = $scope.filterModel.owner_Index;
            //                     $scope.ownerOld.id = $scope.filterModel.owner_Id;
            //                     $scope.ownerOld.name = $scope.filterModel.owner_Name;
            //                 }, function error(res) {
            //                     if ($scope.remember.index != undefined) {
            //                         $scope.filterModel.owner_Index = $scope.remember.index;
            //                         $scope.filterModel.owner_Id = $scope.remember.id;
            //                         $scope.filterModel.owner_Name = $scope.remember.name;
            //                     }
            //                 });
            //             }
            //         }

            //         else {
            //             $scope.ownerOld.index = $scope.filterModel.owner_Index;
            //             $scope.ownerOld.id = $scope.filterModel.owner_Id;
            //             $scope.ownerOld.name = $scope.filterModel.owner_Name;
            //         }
            //     }
            // });

            $scope.popupPo = {
                onShow: false,
                delegates: {},
                onClick: function (param, owner_Index) {
                    if ($scope.filterModel.owner_Index != null && ($scope.filterModel.owner_Index != '' && $scope.filterModel.owner_Index != null)) {
                        owner_Index = $scope.filterModel.owner_Index;
                    };
                    $scope.popupPo.onShow = !$scope.popupPo.onShow;
                    $scope.popupPo.delegates.poPopup($scope.filterModel.planGoodsReceive_No, owner_Index, true);
                },
                config: {
                    title: "Po"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        var purchaseOrder_Index = "";
                        if (!param.length) {
                            if (param.purchaseOrder_Index == "") {
                                $scope.filterModel.purchaseOrder_Index = angular.copy(param.purchaseOrder_Index);
                                $scope.filterModel.purchaseOrder_No = angular.copy(param.purchaseOrder_No);
                            } else {
                                $scope.filterModel.purchaseOrder_Index = angular.copy(param.purchaseOrder_Index);
                                $scope.filterModel.purchaseOrder_No = angular.copy(param.purchaseOrder_No);
                                $scope.filterModel.warehouse_Index = angular.copy(param.warehouse_Index);
                                $scope.filterModel.warehouse_Id = angular.copy(param.warehouse_Id);
                                $scope.filterModel.warehouse_Name = angular.copy(param.warehouse_Name);
                                $scope.filterModel.warehouse_Index_To = angular.copy(param.warehouse_Index_To);
                                $scope.filterModel.warehouse_Id_To = angular.copy(param.warehouse_Id_To);
                                $scope.filterModel.warehouse_Name_To = angular.copy(param.warehouse_Name_To);
                                $scope.filterModel.planGRowner_Name = angular.copy(param.owner_Name);
                                $scope.filterModel.documentType_Index = angular.copy(param.grDocumentType_Index);
                                $scope.filterModel.documentType_Name = angular.copy(param.grDocumentType_Name);
                                $scope.filterModel.documentType_Id = angular.copy(param.grDocumentType_Id);
                                $scope.filterModel.purchaseOrder_NoTemp = $scope.filterModel.purchaseOrder_No;
                                $scope.filterModel.purchaseOrder_IndexTemp = $scope.filterModel.purchaseOrder_Index;
                            }
                            purchaseOrder_Index = "'" + $scope.filterModel.purchaseOrder_Index + "'";
                        } else {
                            if (param[0].purchaseOrder_Index == "") {
                                $scope.filterModel.purchaseOrder_Index = angular.copy(param[0].purchaseOrder_Index);
                                $scope.filterModel.purchaseOrder_No = angular.copy(param[0].purchaseOrder_No);
                            } else {
                                $scope.filterModel.purchaseOrder_Index = angular.copy(param[0].purchaseOrder_Index);
                                $scope.filterModel.purchaseOrder_No = angular.copy(param[0].purchaseOrder_No);
                                $scope.filterModel.warehouse_Index = angular.copy(param[0].warehouse_Index);
                                $scope.filterModel.warehouse_Id = angular.copy(param[0].warehouse_Id);
                                $scope.filterModel.warehouse_Name = angular.copy(param[0].warehouse_Name);
                                $scope.filterModel.warehouse_Index_To = angular.copy(param[0].warehouse_Index_To);
                                $scope.filterModel.warehouse_Id_To = angular.copy(param[0].warehouse_Id_To);
                                $scope.filterModel.warehouse_Name_To = angular.copy(param[0].warehouse_Name_To);
                                $scope.filterModel.planGRowner_Name = angular.copy(param[0].owner_Name);
                                $scope.filterModel.documentType_Index = angular.copy(param[0].grDocumentType_Index);
                                $scope.filterModel.documentType_Name = angular.copy(param[0].grDocumentType_Name);
                                $scope.filterModel.documentType_Id = angular.copy(param[0].grDocumentType_Id);
                                $scope.filterModel.purchaseOrder_NoTemp = $scope.filterModel.purchaseOrder_No;
                                $scope.filterModel.purchaseOrder_IndexTemp = $scope.filterModel.purchaseOrder_Index;

                            }
                            purchaseOrder_Index = param.map(c => "'" + c.purchaseOrder_Index + "'");
                            $scope.filterModel.id = purchaseOrder_Index;
                        }

                        if ($scope.filterModel.listPlanGoodsReceiveItemViewModel == undefined)
                            $scope.filterModel.listPlanGoodsReceiveItemViewModel = [];
                        viewModelitem.getPurchaseOrderPopup($scope.filterModel).then((response) => {
                            let CountTotalQty = 0;
                            if (response.data) {

                                var groups = $scope.filterModel.listPlanGoodsReceiveItemViewModel.reduce(function (obj, item) {
                                    obj[item.purchaseOrderItem_Index] = obj[item.purchaseOrderItem_Index] || [];
                                    obj[item.purchaseOrderItem_Index].push(item.purchaseOrderItem_Index);
                                    return obj;
                                }, {});
                                var myArray = Object.keys(groups).map(function (key) {
                                    return { team: key };
                                });
                                if (myArray.length > 0) {
                                    angular.forEach(myArray, function (v, k) {

                                        var splice = response.data.filter(c => c.purchaseOrderItem_Index == v.team)
                                        angular.forEach(splice, function (vv, kk) {
                                            var indexof = response.data.indexOf(vv)
                                            response.data.splice(indexof, 1)
                                        });
                                    });
                                }
                                if (response.data.length > 0) {
                                    angular.forEach(response.data, function (vv, kk) {
                                        if (vv.qty != 0) {
                                            var Qtyint = vv.qty;
                                            var q = vv.qty.toFixed(2);
                                            vv.qty = parseFloat(q);
                                            vv.defult_qty = vv.defult_qty;
                                            if (vv.weight == null) {
                                                vv.weight = vv.unitWeight * Qtyint;
                                                var w = vv.weight.toFixed(2);
                                                var wu = vv.unitWeight.toFixed(2);
                                                vv.weight = w
                                                vv.weightUnit = wu
                                            }
                                            else {
                                                // var Wint = vv.weight * Qtyint;
                                                var w = vv.weight.toFixed(2);
                                                var wu = vv.unitWeight.toFixed(2);
                                                vv.weight = w
                                                vv.weightUnit = wu
                                            }

                                            if (vv.volume == null) {
                                                vv.volume = vv.unitVolume * Qtyint;
                                                var vu = vv.unitVolume.toFixed(2);
                                                // var v = vv.volume.toFixed(2);
                                                // vv.volume = v
                                                vv.volumeUnit = vu
                                            }
                                            else {
                                                // var v = vv.volume.toFixed(2);
                                                var vu = vv.unitVolume.toFixed(2);
                                                // vv.volume = v
                                                vv.volumeUnit = vu
                                            }

                                            if (vv.price == null) {
                                                vv.price = 0 * Qtyint;
                                                var p = vv.price.toFixed(2);
                                                vv.price = p
                                                vv.priceUnit = p

                                            }
                                            else {
                                                var p = (vv.price * Qtyint).toFixed(2);
                                                var pu = vv.price.toFixed(2);
                                                vv.price = p
                                                vv.priceUnit = pu
                                            }

                                            // vv.volumeUnit = (vv.unitVolume / 1000000)
                                            vv.volume = (vv.volume)
                                            vv.volumeUnit = parseFloat(vv.volumeUnit / 1000000);

                                            var v = vv.volume.toFixed(2);
                                            var vu = vv.volumeUnit.toFixed(2);
                                            vv.volume = v
                                            vv.volumeUnit = vu

                                            $scope.filterModel.listPlanGoodsReceiveItemViewModel.push(angular.copy(vv));
                                        }
                                    });
                                }
                                for (let index = 0; index < $scope.filterModel.listPlanGoodsReceiveItemViewModel.length; index++) {
                                    if ($scope.filterModel.listPlanGoodsReceiveItemViewModel[index].ref_Document_No == undefined)
                                        $scope.filterModel.listPlanGoodsReceiveItemViewModel[index].ref_Document_No = $scope.filterModel.listPlanGoodsReceiveItemViewModel[index].purchaseOrder_No;
                                    $scope.filterModel.listPlanGoodsReceiveItemViewModel[index].ref_Document_Index = $scope.filterModel.listPlanGoodsReceiveItemViewModel[index].purchaseOrder_Index;
                                    $scope.filterModel.listPlanGoodsReceiveItemViewModel[index].ref_DocumentItem_Index = $scope.filterModel.listPlanGoodsReceiveItemViewModel[index].purchaseOrderItem_Index;
                                    $scope.filterModel.listPlanGoodsReceiveItemViewModel[index].goodsReceive_Remark = $scope.filterModel.listPlanGoodsReceiveItemViewModel[index].document_Remark;
                                }
                            }
                        }, (error) => {
                            console.log(error);
                        })
                        // if (!param.length) {
                        //     goodsReceiveFactory.updateUserAssignKey({ GoodsReceive_Index: param.purchaseOrder_Index, UserAssign: $window.localStorage['userGuidPlanReceive'] }).then((response) => { }, (error) => { console.log(error); })
                        // } else {
                        //     goodsReceiveFactory.updateUserAssignKey({ GoodsReceive_Index: param[0].purchaseOrder_Index, UserAssign: $window.localStorage['userGuidPlanReceive'] }).then((response) => { }, (error) => { console.log(error); })
                        // }
                    }
                }
            };


            $scope.scanBilling = function (param) {
                
                if($scope.dropdownDocumentType.model != undefined){
                    if($scope.dropdownDocumentType.model.documentType_Index == '78b3f38d-e4b5-45fe-9473-3ae9717f0589' ||
                    $scope.dropdownDocumentType.model.documentType_Index == '871bb721-e1a8-4f76-a0db-209c2bde8889' ||
                    $scope.dropdownDocumentType.model.documentType_Index == '09827671-b31b-4cad-9b32-e9dc7cb76207' ||
                    $scope.dropdownDocumentType.model.documentType_Index == 'cb10bf3f-cd4b-4c13-985a-2bbe19dcaf72' ||
                    $scope.dropdownDocumentType.model.documentType_Index == 'd4d2950a-421a-4729-9b3b-4ccc795c4f58' ||
                    $scope.dropdownDocumentType.model.documentType_Index == '4a3cf495-9b4e-486c-8c16-c096f2f97a06' ){
                        if (param.Billing_No == undefined || param.Billing_No == null || param.Billing_No == '') {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: 'Plase insert MATDOC'
                                }
                            )
                            return "";
                        }else{
                            planGoodsReceiveItemFactory.returnmatdoc(param.Billing_No).then(function (res) {
                                $scope.filterModel.listPlanGoodsReceiveItemViewModel = res.data;
                            });
                        }
                    }else{
                        
                        if (param.Billing_No.length < 10) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: 'Billing must be 10 digit'
                                }
                            )
                            return "";
                        }
                        $scope.filterModel.cancel_By = $scope.userName;
                        viewModel.getBilling(param.Billing_No).then(
                            function success(res) {
                                $scope.filterModel.listPlanGoodsReceiveItemViewModel = [];
        
                                if (res.data.STATUS == undefined) {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: res.data
                                    })
                                    return "";
                                }
                                if (res.data.STATUS == 'E') {
                                    $scope.filterModel.listPlanGoodsReceiveItemViewModel = {};
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: res.data.MESSAGE
                                    })
                                } else {
                                    
                                    let dataList = res.data.ZTB_EX_BILL.item;
                                    var count = 0;
                                    for (var i = 0; i <= dataList.length - 1; i++) {
        
                                        if (dataList[i].Qty == 0) { continue; }
                                        $scope.billingModel = {};
                                        $scope.billingModel.planGoodsReceive_Index = dataList[i].PlanGoodsReceive_Index;
                                        $scope.billingModel.product_Index = dataList[i].Product_Index;
                                        $scope.billingModel.product_Id = dataList[i].Product_Id;
                                        $scope.billingModel.product_Name = dataList[i].Product_Name;
                                        $scope.billingModel.product_SecondName = dataList[i].Product_SecondName;
                                        $scope.billingModel.product_ThirdName = dataList[i].Product_ThirdName;
                                        $scope.billingModel.product_Lot = dataList[i].Product_Lot;
                                        $scope.billingModel.lineNum = dataList[i].LineNum;
                                        if (dataList[i].PSTYV == 'YTAP') {
                                            $scope.billingModel.qty = dataList[i].Qty;
                                            $scope.billingModel.defult_qty = dataList[i].Qty;
                                        }else{
                                            $scope.billingModel.qty = 0;
                                            $scope.billingModel.defult_qty = dataList[i].Qty;
                                        }
                                        $scope.billingModel.ratio = dataList[i].Ratio;
                                        $scope.billingModel.totalQty = dataList[i].TotalQty;
                                        $scope.billingModel.productConversion_Index = dataList[i].ProductConversion_Index;
                                        $scope.billingModel.productConversion_Id = dataList[i].ProductConversion_Id;
                                        $scope.billingModel.productConversion_Name = dataList[i].ProductConversion_Name;
                                        $scope.billingModel.mFG_Date = dataList[i].MFG_Date;
                                        $scope.billingModel.eXP_Date = dataList[i].EXP_Date;
                                        $scope.billingModel.documentRef_No1 = dataList[i].DocumentRef_No1;
                                        $scope.billingModel.documentRef_No2 = dataList[i].DocumentRef_No2;
                                        $scope.billingModel.documentRef_No3 = dataList[i].DocumentRef_No3;
                                        $scope.billingModel.documentRef_No4 = dataList[i].DocumentRef_No4;
                                        $scope.billingModel.documentRef_No5 = dataList[i].DocumentRef_No5;
                                        $scope.billingModel.document_Status = dataList[i].Document_Status;
                                        $scope.billingModel.documentItem_Remark = dataList[i].DocumentItem_Remark;
                                        $scope.billingModel.uDF_1 = dataList[i].UDF_1;
                                        $scope.billingModel.uDF_2 = dataList[i].UDF_2;
                                        $scope.billingModel.uDF_3 = dataList[i].PSTYV;
                                        $scope.billingModel.uDF_4 = dataList[i].UEPOS;
                                        $scope.billingModel.uDF_5 = dataList[i].Qty;
                                        $scope.billingModel.unitWeight = dataList[i].UnitWeight;
                                        $scope.billingModel.weight = dataList[i].Weight;
                                        $scope.billingModel.netWeight = dataList[i].NetWeight;
                                        $scope.billingModel.unitGrsWeight = dataList[i].UnitGrsWeight;
                                        $scope.billingModel.unitWidth = dataList[i].UnitWidth;
                                        $scope.billingModel.width = dataList[i].Width;
                                        $scope.billingModel.unitLength = dataList[i].UnitLength;
                                        $scope.billingModel.length = dataList[i].Length;
                                        $scope.billingModel.unitHeight = dataList[i].UnitHeight;
                                        $scope.billingModel.height = dataList[i].Height;
                                        $scope.billingModel.volume = dataList[i].Volume;
                                        $scope.billingModel.unitVolume = dataList[i].UnitVolume;
                                        $scope.billingModel.itemStatus_Index = dataList[i].ItemStatus_Index;
                                        $scope.billingModel.itemStatus_Id = dataList[i].ItemStatus_Id;
                                        $scope.billingModel.itemStatus_Name = dataList[i].ItemStatus_Name;
                                        $scope.billingModel.weight_Index = dataList[i].Weight_Index;
                                        $scope.billingModel.weight_Id = dataList[i].Weight_Id;
                                        $scope.billingModel.weight_Name = dataList[i].Weight_Name;
                                        $scope.billingModel.weightRatio = dataList[i].WeightRatio;
                                        $scope.billingModel.grsWeight_Index = dataList[i].GrsWeight_Index;
                                        $scope.billingModel.grsWeight_Id = dataList[i].GrsWeight_Id;
                                        $scope.billingModel.grsWeight_Name = dataList[i].GrsWeight_Name;
                                        $scope.billingModel.grsWeightRatio = dataList[i].GrsWeightRatio;
                                        $scope.billingModel.grsWeight = dataList[i].GrsWeight;
                                        $scope.billingModel.width_Index = dataList[i].Width_Index;
                                        $scope.billingModel.width_Id = dataList[i].Width_Id;
                                        $scope.billingModel.width_Name = dataList[i].Width_Name;
                                        $scope.billingModel.widthRatio = dataList[i].WidthRatio;
                                        $scope.billingModel.height_Index = dataList[i].Height_Index;
                                        $scope.billingModel.height_Id = dataList[i].Height_Id;
                                        $scope.billingModel.height_Name = dataList[i].Height_Name;
                                        $scope.billingModel.heightRatio = dataList[i].HeightRatio;
                                        $scope.billingModel.length_Index = dataList[i].Length_Index;
                                        $scope.billingModel.length_Id = dataList[i].Length_Id;
                                        $scope.billingModel.length_Name = dataList[i].Length_Name;
                                        $scope.billingModel.lengthRatio = dataList[i].LengthRatio;
                                        $scope.billingModel.unitPrice = dataList[i].UnitPrice;
                                        $scope.billingModel.price = dataList[i].Price;
                                        $scope.billingModel.totalPrice = dataList[i].TotalPrice;
                                        $scope.billingModel.currency_Index = dataList[i].Currency_Index;
                                        $scope.billingModel.currency_Id = dataList[i].Currency_Id;
                                        $scope.billingModel.currency_Name = dataList[i].Currency_Name;
                                        $scope.billingModel.ref_Code1 = dataList[i].Ref_Code1;
                                        $scope.billingModel.ref_Code2 = dataList[i].Ref_Code2;
                                        $scope.billingModel.ref_Code3 = dataList[i].Ref_Code3;
                                        $scope.billingModel.ref_Code4 = dataList[i].Ref_Code4;
                                        $scope.billingModel.ref_Code5 = dataList[i].Ref_Code5;
                                        $scope.filterModel.listPlanGoodsReceiveItemViewModel = $scope.filterModel.listPlanGoodsReceiveItemViewModel || []
                                        $scope.filterModel.listPlanGoodsReceiveItemViewModel.push(angular.copy($scope.billingModel));
                                        count++;
                                    }
                                    if (count == 0) {
                                        $scope.filterModel.listPlanGoodsReceiveItemViewModel = {};
                                        dpMessageBox.alert({
                                            ok: 'Close',
                                            title: 'แจ้งเตือน',
                                            message: "ทำการคืนของครบแล้ว"
                                        })
                                    }
                                }
        
                            },
                            function error(response) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: "ไม่สามารถ ทำการค้นหาเลข Billing ได้"
                                })
                        });
                    }
                }
                
            }

            $scope.scanClaim = function (param) {
                $scope.filterModel.cancel_By = $scope.userName;
                viewModel.getscanClaim(param.Claim_No).then(
                    function success(res) {
                        // $scope.filterModel.listPlanGoodsReceiveItemViewModel = res.data.ZTB_EX_BILL.item;

                        let dataList = res.data.item;
                        var count = 0;
                        for (var i = 0; i <= dataList.length - 1; i++) {
                            if (dataList[i].qty == 0) { continue; }
                            $scope.billingModel = {};
                            $scope.billingModel.planGoodsReceive_Index = dataList[i].planGoodsIssue_Index;
                            $scope.billingModel.product_Index = dataList[i].product_Index;
                            $scope.billingModel.product_Id = dataList[i].product_Id;
                            $scope.billingModel.product_Name = dataList[i].product_Name;
                            $scope.billingModel.product_SecondName = dataList[i].product_SecondName;
                            $scope.billingModel.product_ThirdName = dataList[i].product_ThirdName;
                            $scope.billingModel.product_Lot = dataList[i].product_Lot;
                            $scope.billingModel.qty = dataList[i].qty;
                            $scope.billingModel.ratio = dataList[i].ratio;
                            $scope.billingModel.totalQty = dataList[i].totalQty;
                            $scope.billingModel.productConversion_Index = dataList[i].productConversion_Index;
                            $scope.billingModel.productConversion_Id = dataList[i].productConversion_Id;
                            $scope.billingModel.productConversion_Name = dataList[i].productConversion_Name;
                            $scope.billingModel.mFG_Date = dataList[i].mFG_Date;
                            $scope.billingModel.eXP_Date = dataList[i].eXP_Date;
                            $scope.billingModel.documentRef_No1 = dataList[i].documentRef_No1;
                            $scope.billingModel.documentRef_No2 = dataList[i].documentRef_No2;
                            $scope.billingModel.documentRef_No3 = dataList[i].documentRef_No3;
                            $scope.billingModel.documentRef_No4 = dataList[i].documentRef_No4;
                            $scope.billingModel.documentRef_No5 = dataList[i].documentRef_No5;
                            $scope.billingModel.document_Status = dataList[i].document_Status;
                            $scope.billingModel.documentItem_Remark = dataList[i].documentItem_Remark;
                            $scope.billingModel.uDF_1 = dataList[i].uDF_1;
                            $scope.billingModel.uDF_2 = dataList[i].uDF_2;
                            $scope.billingModel.uDF_3 = dataList[i].uDF_3;
                            $scope.billingModel.uDF_4 = dataList[i].uDF_4;
                            $scope.billingModel.uDF_5 = dataList[i].uDF_5;
                            $scope.billingModel.unitWeight = dataList[i].unitWeight;
                            $scope.billingModel.weight = dataList[i].weight;
                            $scope.billingModel.netWeight = dataList[i].netWeight;
                            $scope.billingModel.unitGrsWeight = dataList[i].unitGrsWeight;
                            $scope.billingModel.unitWidth = dataList[i].unitWidth;
                            $scope.billingModel.width = dataList[i].width;
                            $scope.billingModel.unitLength = dataList[i].unitLength;
                            $scope.billingModel.length = dataList[i].length;
                            $scope.billingModel.unitHeight = dataList[i].unitHeight;
                            $scope.billingModel.height = dataList[i].height;
                            $scope.billingModel.volume = dataList[i].volume;
                            $scope.billingModel.unitVolume = dataList[i].unitVolume;
                            $scope.billingModel.itemStatus_Index = dataList[i].itemStatus_Index;
                            $scope.billingModel.itemStatus_Id = dataList[i].itemStatus_Id;
                            $scope.billingModel.itemStatus_Name = dataList[i].itemStatus_Name;
                            $scope.billingModel.weight_Index = dataList[i].weight_Index;
                            $scope.billingModel.weight_Id = dataList[i].weight_Id;
                            $scope.billingModel.weight_Name = dataList[i].weight_Name;
                            $scope.billingModel.weightRatio = dataList[i].weightRatio;
                            $scope.billingModel.grsWeight_Index = dataList[i].grsWeight_Index;
                            $scope.billingModel.grsWeight_Id = dataList[i].grsWeight_Id;
                            $scope.billingModel.grsWeight_Name = dataList[i].grsWeight_Name;
                            $scope.billingModel.grsWeightRatio = dataList[i].grsWeightRatio;
                            $scope.billingModel.grsWeight = dataList[i].grsWeight;
                            $scope.billingModel.width_Index = dataList[i].width_Index;
                            $scope.billingModel.width_Id = dataList[i].width_Id;
                            $scope.billingModel.width_Name = dataList[i].width_Name;
                            $scope.billingModel.widthRatio = dataList[i].widthRatio;
                            $scope.billingModel.height_Index = dataList[i].height_Index;
                            $scope.billingModel.height_Id = dataList[i].height_Id;
                            $scope.billingModel.height_Name = dataList[i].height_Name;
                            $scope.billingModel.heightRatio = dataList[i].heightRatio;
                            $scope.billingModel.length_Index = dataList[i].length_Index;
                            $scope.billingModel.length_Id = dataList[i].length_Id;
                            $scope.billingModel.length_Name = dataList[i].length_Name;
                            $scope.billingModel.lengthRatio = dataList[i].lengthRatio;
                            $scope.billingModel.unitPrice = dataList[i].unitPrice;
                            $scope.billingModel.price = dataList[i].price;
                            $scope.billingModel.totalPrice = dataList[i].totalPrice;
                            $scope.billingModel.currency_Index = dataList[i].currency_Index;
                            $scope.billingModel.currency_Id = dataList[i].currency_Id;
                            $scope.billingModel.currency_Name = dataList[i].currency_Name;
                            $scope.billingModel.ref_Code1 = dataList[i].ref_Code1;
                            $scope.billingModel.ref_Code2 = dataList[i].ref_Code2;
                            $scope.billingModel.ref_Code3 = dataList[i].ref_Code3;
                            $scope.billingModel.ref_Code4 = dataList[i].ref_Code4;
                            $scope.billingModel.ref_Code5 = dataList[i].ref_Code5;
                            $scope.filterModel.listPlanGoodsReceiveItemViewModel = $scope.filterModel.listPlanGoodsReceiveItemViewModel || []
                            $scope.filterModel.listPlanGoodsReceiveItemViewModel.push(angular.copy($scope.billingModel));
                            count + 1;
                        }
                        if (count >= 0) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: "ทำการคืนของครบแล้ว"
                            })
                        }


                    },
                    function error(response) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: "ERROR"
                        })
                    });
            }

            $scope.formYard = function () {
                
                $scope.filterModel = bkYardDockFactory.getParam();
                if ($scope.filterModel == undefined) {
                    $scope.filterModel = {};
                }

            }

            var init = function () {
                
                $scope.blockSales = 0;
                $scope.filterModel = {};
                $scope.filterModel.documents = [];
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterItemModel.delivery_Date = getToday();
                $scope.dropdownwarehouse();
                $scope.dropdownDocumentType();
                $scope.dropdownCostCenter();
                $scope.dropdownShipmentType();
                $scope.dropdownContainerType();
                $scope.dropdownDockDoor();
                $scope.dropdownVehicleType();
                $scope.dropdownCargoType();
                $scope.dropdownDocumentPriority();
                $scope.dropdownUnloadingType();

                $scope.colortab1 = "#97bee7";
                $scope.colortab2 = "#D3D3D3";
                $scope.click = 1;
                // $scope.formYard();
                $vm.onShow();

            };
            init();
        }
    })
})();