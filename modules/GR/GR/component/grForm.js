(function () {
    'use strict'

    app.component('grForm', {
        controllerAs: '$vm',
        templateUrl: "modules/GR/GR/component/grForm.html",
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',
        },
        controller: function ($scope, $state, $q, pageLoading, dpMessageBox, goodsReceiveFactory, localStorageService, goodsReceiveItemFactory, planGoodsReceiveItemFactory, ownerFactory, $window, webServiceAPI, Upload, bomFactory) {
            var $vm = this;

            var defer = {};
            var viewModel = goodsReceiveFactory;
            var ownerModel = ownerFactory;
            $scope.filterModel = {};
            $scope.filterModel.listGoodsReceiveItemViewModels = [];
            $scope.listGoodsReceiveItem = {};
            $scope.dropdownProductconversion = {};
            $vm.isFilterTable = true;
            $scope.onShow = false;
            $scope.buttons = {};
            $scope.index = {};
            $scope.ownerOld = {};
            $scope.remember = {};

            $scope.clickTab = function (tab) {

                if (tab == 1) {
                    $scope.colortab1 = "#97bee7";
                    $scope.colortab2 = "#D3D3D3";
                } else if (tab == 2) {
                    $scope.colortab1 = "#D3D3D3";
                    $scope.colortab2 = "#97bee7";
                }
                $scope.click = tab;
            }

            $scope.clickTabTable = function (tabtable) {

                if (tabtable == 1) {
                    $scope.colortabtable1 = "#97bee7";
                    $scope.colortabtable2 = "#D3D3D3";
                } else if (tabtable == 2) {
                    $scope.colortabtable1 = "#D3D3D3";
                    $scope.colortabtable2 = "#97bee7";
                }
                $scope.clicktable = tabtable;
            }

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

            $vm.onShow = function (param) {
                $scope.onShow = true;
                defer = $q.defer();
                $scope.filterModel.goodsReceive_Date = getToday();
                $scope.filterModel.goodsReceive_Due_Date = getToday()
                $scope.filterModel.goodsReceive_Time = getTime();
                $scope.filterModel.goodsReceive_Due_Date_Time = getTime();

                if (param != undefined) {
                    viewModel.getId(param.goodsReceive_Index).then(function (res) {
                        $scope.filterModel = res.data;
                        $scope.filterModel.log_udf_2 = getToday();
                        $scope.filterModel.log_udf_3 = getTime();

                        var time = angular.copy($scope.filterModel.goodsReceive_Date.substring(8, 10)) + ":" + angular.copy($scope.filterModel.goodsReceive_Date.substring(10, 12));
                        $scope.filterModel.goodsReceive_Time = time;
                        $scope.buttons.add = false;
                        $scope.buttons.update = true;

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



                        if ($scope.filterModel.documentStatus == 1 || $scope.filterModel.documentStatus == -1 || $scope.filterModel.documentStatus == 2 || $scope.filterModel.documentStatus == 3)
                            $scope.buttons.update = false;

                        goodsReceiveItemFactory.getByGoodReceiveId(param.goodsReceive_Index).then(function (res) {
                            if (res.data[0].udf_1 != '' && res.data[0].udf_1 != null) {
                                $scope.filterModel.selected = true;
                            }
                            $scope.filterModel.listGoodsReceiveItemViewModels = res.data;
                            for (let index = 0; index < $scope.filterModel.listGoodsReceiveItemViewModels.length; index++) {
                                $scope.filterModel.listGoodsReceiveItemViewModels[index].weightUnit = $scope.filterModel.listGoodsReceiveItemViewModels[index].unitWeight;
                                $scope.filterModel.listGoodsReceiveItemViewModels[index].volumeUnit = $scope.filterModel.listGoodsReceiveItemViewModels[index].unitVolume;
                            }
                        });

                        goodsReceiveItemFactory.getPoContrackByGoodReceiveId(param.goodsReceive_Index).then(function (res) {
                            $scope.filterModel.result_goodissue = res.data;
                        });
                    });
                } else {

                    $scope.buttons.add = true;
                    $scope.buttons.update = false;
                    $scope.dropdownwarehouse.model = $scope.dropdownwarehouse[0];
                    $scope.filterModel.owner_Index = '02b31868-9d3d-448e-b023-05c121a424f4';
                    $scope.filterModel.owner_Name = 'Amazon';
                    $scope.filterModel.owner_Id = '3419';
                    $scope.filterModel.log_udf_2 = getToday();
                    $scope.filterModel.log_udf_3 = getTime();
                }
                return defer.promise;
            };
            $scope.add = function () {

                if (!$scope.filterModel.goodsReceive_Date) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'ALERT',
                        message: 'กรุณาเลือกวันที่สร้างเอกสาร!'
                    })
                    return "";
                }


                if (!isGuid($scope.filterModel.owner_Index)) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'ALERT',
                        message: 'กรุณาเลือกเจ้าของสินค้า !'
                    })
                    return "";
                }




                if ($scope.dropdownwarehouse.model != null) {
                    $scope.filterModel.warehouse_Index = $scope.dropdownwarehouse.model.warehouse_Index;
                    $scope.filterModel.warehouse_Id = $scope.dropdownwarehouse.model.warehouse_Id;
                    $scope.filterModel.warehouse_Name = $scope.dropdownwarehouse.model.warehouse_Name;
                } else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'ALERT',
                        message: 'กรุณาเลือกคลังสินค้า !'
                    })
                    return "";
                }

                if ($scope.dropdownDocumentType.model != null) {
                    $scope.filterModel.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
                    $scope.filterModel.documentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
                    $scope.filterModel.documentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
                } else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'ALERT',
                        message: 'MSG_Alert_DocumentType'
                    })
                    return "";
                }

                // else {
                //     $scope.filterModel.documentType_Index = "00000000-0000-0000-0000-000000000000";
                //     $scope.filterModel.documentType_Id = -99;
                //     $scope.filterModel.documentType_Name = "";
                //     dpMessageBox.alert(
                //         {
                //             ok: 'Close',
                //             title: 'ALERT',
                //             message: 'ประเภทเอกสาร !'
                //         }
                //     )
                //     return "";
                // }

                if ($scope.filterModel.listGoodsReceiveItemViewModels == undefined || $scope.filterModel.listGoodsReceiveItemViewModels.length == 0) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'ALERT',
                        message: 'Error: Add at least 1 Item !'
                    })
                    return "";
                }

                for (let index = 0; index < $scope.filterModel.listGoodsReceiveItemViewModels.length; index++) {
                    if ($scope.filterModel.listGoodsReceiveItemViewModels[index].isLot == 1) {
                        if ($scope.filterModel.listGoodsReceiveItemViewModels[index].product_Lot == null ||
                            $scope.filterModel.listGoodsReceiveItemViewModels[index].product_Lot == undefined ||
                            $scope.filterModel.listGoodsReceiveItemViewModels[index].product_Lot == "") {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'ALERT',
                                message: 'MSG_Alert_ProductLot ' + 'SKU-' + $scope.filterModel.listGoodsReceiveItemViewModels[index].product_Id
                            })
                            return "";
                        }
                    }

                    if ($scope.filterModel.listGoodsReceiveItemViewModels[index].isMfgDate == 1) {
                        if ($scope.filterModel.listGoodsReceiveItemViewModels[index].mfg_Date == null ||
                            $scope.filterModel.listGoodsReceiveItemViewModels[index].mfg_Date == undefined ||
                            $scope.filterModel.listGoodsReceiveItemViewModels[index].mfg_Date == "") {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'ALERT',
                                message: 'MSG_Alert_MFGDATE ' + 'SKU-' + $scope.filterModel.listGoodsReceiveItemViewModels[index].product_Id
                            })
                            return "";
                        }
                    }

                    if ($scope.filterModel.listGoodsReceiveItemViewModels[index].isExpDate == 1) {
                        if ($scope.filterModel.listGoodsReceiveItemViewModels[index].exp_Date == null ||
                            $scope.filterModel.listGoodsReceiveItemViewModels[index].exp_Date == undefined ||
                            $scope.filterModel.listGoodsReceiveItemViewModels[index].exp_Date == "") {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'ALERT',
                                message: 'MSG_Alert_EXPDATE ' + 'SKU-' + $scope.filterModel.listGoodsReceiveItemViewModels[index].product_Id
                            })
                            return "";
                        }
                    }

                }


                if ($scope.dropdownShipmentType.model != null) {
                    $scope.filterModel.shipmentType_Index = $scope.dropdownShipmentType.model.shipmentType_Index;
                    $scope.filterModel.shipmentType_Id = $scope.dropdownShipmentType.model.shipmentType_Id;
                    $scope.filterModel.shipmentType_Name = $scope.dropdownShipmentType.model.shipmentType_Name;
                } else {
                    $scope.filterModel.shipmentType_Index = null;
                    $scope.filterModel.shipmentType_Id = null;
                    $scope.filterModel.shipmentType_Name = null;
                }

                if ($scope.dropdownContainerType.model != null) {
                    $scope.filterModel.containerType_Index = $scope.dropdownContainerType.model.containerType_Index;
                    $scope.filterModel.containerType_Id = $scope.dropdownContainerType.model.containerType_Id;
                    $scope.filterModel.containerType_Name = $scope.dropdownContainerType.model.containerType_Name;
                } else {
                    $scope.filterModel.containerType_Index = null;
                    $scope.filterModel.containerType_Id = null;
                    $scope.filterModel.containerType_Name = null;
                }

                if ($scope.dropdownDockDoor.model != null) {
                    $scope.filterModel.dock_Index = $scope.dropdownDockDoor.model.dock_Index;
                    $scope.filterModel.dock_Id = $scope.dropdownDockDoor.model.dock_Id;
                    $scope.filterModel.dock_Name = $scope.dropdownDockDoor.model.dock_Name;
                } else {
                    $scope.filterModel.dock_Index = null;
                    $scope.filterModel.dock_Id = null;
                    $scope.filterModel.dock_Name = null;
                }

                if ($scope.dropdownVehicleType.model != null) {
                    $scope.filterModel.vehicleType_Index = $scope.dropdownVehicleType.model.vehicleType_Index;
                    $scope.filterModel.vehicleType_Id = $scope.dropdownVehicleType.model.vehicleType_Id;
                    $scope.filterModel.vehicleType_Name = $scope.dropdownVehicleType.model.vehicleType_Name;
                } else {
                    $scope.filterModel.vehicleType_Index = null;
                    $scope.filterModel.vehicleType_Id = null;
                    $scope.filterModel.vehicleType_Name = null;
                }

                if ($scope.dropdownCargoType.model != null) {
                    $scope.filterModel.cargoType_Index = $scope.dropdownCargoType.model.cargoType_Index;
                    $scope.filterModel.cargoType_Id = $scope.dropdownCargoType.model.cargoType_Id;
                    $scope.filterModel.cargoType_Name = $scope.dropdownCargoType.model.cargoType_Name;
                } else {
                    $scope.filterModel.cargoType_Index = null;
                    $scope.filterModel.cargoType_Id = null;
                    $scope.filterModel.cargoType_Name = null;
                }

                if ($scope.dropdownDocumentPriority.model != null) {
                    $scope.filterModel.documentPriority_Index = $scope.dropdownDocumentPriority.model.documentPriority_Index;
                    $scope.filterModel.documentPriority_Id = $scope.dropdownDocumentPriority.model.documentPriority_Id;
                    $scope.filterModel.documentPriority_Name = $scope.dropdownDocumentPriority.model.documentPriority_Name;
                } else {
                    $scope.filterModel.documentPriority_Index = null;
                    $scope.filterModel.documentPriority_Id = null;
                    $scope.filterModel.documentPriority_Name = null;
                }
                if ($scope.dropdownUnloadingType.model != null) {
                    $scope.filterModel.unloadingType_Index = $scope.dropdownUnloadingType.model.unloadingType_Index;
                    $scope.filterModel.unloadingType_Id = $scope.dropdownUnloadingType.model.unloadingType_Id;
                    $scope.filterModel.unloadingType_Name = $scope.dropdownUnloadingType.model.unloadingType_Name;
                } else {
                    $scope.filterModel.unloadingType_Index = null;
                    $scope.filterModel.unloadingType_Id = null;
                    $scope.filterModel.documentPriority_Name = null;
                }

                if ($scope.dropdownCostCenter.model != null) {
                    $scope.filterModel.costCenter_Index = $scope.dropdownCostCenter.model.costCenter_Index;
                    $scope.filterModel.costCenter_Id = $scope.dropdownCostCenter.model.costCenter_Id;
                    $scope.filterModel.costCenter_Name = $scope.dropdownCostCenter.model.costCenter_Name;
                } else {
                    $scope.filterModel.costCenter_Index = null;
                    $scope.filterModel.costCenter_Id = null;
                    $scope.filterModel.costCenter_Name = null;
                }


                var model = $scope.filterModel;
                var listmodel = $scope.filterModel.listGoodsReceiveItemViewModels;

                //POpOz
                model.userAssignKey = $window.localStorage['userGuidPlanReceive'];
                model.create_by = localStorageService.get('userTokenStorage');
                model.operations = "ADD";
                model.log_udf_4 =getToday();
                model.log_udf_5 =getTime();
                dpMessageBox.confirm({
                    ok: 'ใช่',
                    cancel: 'ไม่',
                    title: 'ยืนยันข้อมูล ?',
                    message: 'คุณต้องการบันทึกข้อมูลหรือไม่!'
                }).then(function () {
                        viewModel.add(model).then(
                            function success(res) {

                                if (res.data.message == true) {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'บันทึกสำเร็จ',
                                        message: ($scope.buttons.add == true) ? ' บันทึกสำเร็จ : ' + res.data.goodsReceive_No : ' แก้ไขสำเร็จ : ' + res.data.goodsReceive_No
                                    })
                                    model.operations = model.operations+" "+res.data.goodsReceive_No;
                                        // $scope.logmodel = model;
                                    viewModel.savelogsRequest(model).then(function () {
                                    });
                                    if ($scope.dropdownDocumentType.model.documentType_Index == "a256b73d-2354-4187-b19b-d6301475e0ea") {
                                        viewModel.updateStatusBom($scope.filterModel).then(
                                            function success(results) {
                                                $scope.filterModel = {};
                                                $scope.filterModel.listGoodsReceiveItem = {};
                                                $scope.dropdownDocumentType.model = {};
                                                $scope.dropdownCostCenter.model = {};
                                                $scope.dropdownwarehouse.model = {};
                                                $scope.dropdownDocumentPriority.model = {};
                                                $scope.dropdownShipmentType.model = {};
                                                $scope.dropdownCargoType.model = {};
                                                $scope.dropdownUnloadingType.model = {};
                                                $scope.dropdownDockDoor.model = {};
                                                $scope.dropdownVehicleType.model = {};
                                                $scope.dropdownContainerType.model = {};
                                                defer.resolve('-99');
                                            },
                                            function error(response) {
                                                defer.resolve('-99');
                                            }
                                        );
                                    } else {
                                        $scope.filterModel = {};
                                        $scope.filterModel.listGoodsReceiveItem = {};
                                        $scope.dropdownDocumentType.model = {};
                                        $scope.dropdownCostCenter.model = {};
                                        $scope.dropdownwarehouse.model = {};
                                        $scope.dropdownDocumentPriority.model = {};
                                        $scope.dropdownShipmentType.model = {};
                                        $scope.dropdownCargoType.model = {};
                                        $scope.dropdownUnloadingType.model = {};
                                        $scope.dropdownDockDoor.model = {};
                                        $scope.dropdownVehicleType.model = {};
                                        $scope.dropdownContainerType.model = {};
                                        defer.resolve('-99');
                                    }

                                } else {
                                    dpMessageBox.alert({
                                        title: 'แจ้งเตือน',
                                        message: 'ไม่สามารถบันทึกข้อมูลได้'
                                    })
                                }
                            },
                            function error(response) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: 'ไม่สามารถบันทึกข้อมูลได้'
                                })
                            }
                        );
                    },
                    function error(param) {});
            };


            $scope.edit = function () {
                var model = $scope.filterModel;
                model.operations = "EDIT";
                model.log_udf_4 =getToday();
                model.log_udf_5 =getTime();
                var listmodel = $scope.filterModel.listPlanGoodsReceiveItemViewModel;
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยันข้อมูล ?',
                    message: 'คุณต้องการบันทึกข้อมูลหรือไม่!'
                }).then(function () {
                        viewModel.getId(model.goodsReceive_Index).then(function (res) {
                            if (res.data.userAssign != $scope.userName) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: "User ไม่ตรงกับ UserAssign"
                                })
                                $scope.filterModel = {};
                                $scope.dropdownDocumentType.model = {};
                                $scope.dropdownCostCenter.model = {};
                                $scope.dropdownwarehouse.model = {};
                                $scope.dropdownDocumentPriority.model = {};
                                $scope.dropdownShipmentType.model = {};
                                $scope.dropdownCargoType.model = {};
                                $scope.dropdownUnloadingType.model = {};
                                $scope.dropdownDockDoor.model = {};
                                $scope.dropdownVehicleType.model = {};
                                $scope.dropdownContainerType.model = {};
                                defer.resolve();
                            } else {
                                model.update_By = localStorageService.get('userTokenStorage');
                                viewModel.add(model).then(
                                    function success(res) {
                                        model.operations = model.operations+" "+res.data.goodsReceive_No;
                                        // $scope.logmodel = model;
                                        viewModel.savelogsRequest(model).then(function () {
                                        });
                                        $vm.filterModel = res.config.data;
                                        $vm.searchResultModel = res.config.data;
                                        $scope.filterModel = {};

                                        $scope.dropdownDocumentType.model = {};
                                        $scope.dropdownCostCenter.model = {};
                                        $scope.dropdownwarehouse.model = {};
                                        $scope.dropdownDocumentPriority.model = {};
                                        $scope.dropdownShipmentType.model = {};
                                        $scope.dropdownCargoType.model = {};
                                        $scope.dropdownUnloadingType.model = {};
                                        $scope.dropdownDockDoor.model = {};
                                        $scope.dropdownVehicleType.model = {};
                                        $scope.dropdownContainerType.model = {};
                                        defer.resolve('-99');
                                    },
                                    function error(response) {
                                        dpMessageBox.alert({
                                            ok: 'Close',
                                            title: 'ALERT',
                                            message: 'ไม่สามารถบันทึกข้อมูลได้'
                                        })
                                    }
                                );

                            }
                        });
                    },
                    function error(param) {});
            }

            $scope.deleteItem = function (param, index) {
                param.splice(index, 1);
            }
            $scope.back = function () {
                $scope.filterModel.userAssignkey = $window.localStorage['userGuidPlanReceive'];
                $scope.filterModel.userAssign = $scope.userName
                viewModel.deleteUserAssign($scope.filterModel).then(
                    function success(results) {
                        $scope.filterModel = {};
                        $scope.filterModel.listGoodsReceiveItem = {};
                        $scope.dropdownDocumentType.model = {};
                        $scope.dropdownCostCenter.model = {};
                        $scope.dropdownwarehouse.model = {};
                        $scope.dropdownDocumentPriority.model = {};
                        $scope.dropdownShipmentType.model = {};
                        $scope.dropdownCargoType.model = {};
                        $scope.dropdownUnloadingType.model = {};
                        $scope.dropdownDockDoor.model = {};
                        $scope.dropdownVehicleType.model = {};
                        $scope.dropdownContainerType.model = {};
                        $scope.userName = localStorageService.get('userTokenStorage');
                        $scope.filterModel.goodsReceive_Date = getToday()
                        $scope.filterModel.goodsReceive_Due_Date = getToday()
                        $scope.onShow = false;
                        defer.resolve('-99');
                    },
                    function error(response) {
                        defer.resolve('-99');
                    }
                );
            }

            $scope.autoComplete = {
                GoodsReceive: "GoodsReceive/AutoFilterGoodsReceive",
                owner: "GoodsReceive/Ownerfilter",
                warehouse: "GoodsReceive/Warehousefilter",
                status: "GoodsReceive/Statusfilter",
                documentType: "GoodsReceive/DocumentTypefilter",
                productName: "GoodsReceive/autoProduct",
                productId: "GoodsReceive/autoSKU",
                PO: "GoodsReceive/PlanGRfilter",
                dockdoor: "GoodsReceive/DockDoorfilter",
                vehicletype: "GoodsReceive/VahicleTypefilter",
                containerType: "GoodsReceive/ContainerTypefilter",
                basicSearch: "GoodsReceive/autobasicSuggestion",
                vendor: "GoodsReceive/autoVenderfilter",
                whOwner: "GoodsReceive/autoWHOwnerfilter",
                autoGI_SUB: "GoodsReceive/autoGI_SUB",
                autoPlanGI_SUB: "GoodsReceive/autoPlanGI_SUB",

            };


            $scope.url = {
                GR: webServiceAPI.GR,
                upload: webServiceAPI.GR + "Upload/UploadImg",
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

            // Popup
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
                    add: function (param) {},
                    edit: function (param) {},
                    selected: function (param) {
                        $scope.filterModel.vendor_Index = angular.copy(param[0].vendor_Index)
                        $scope.filterModel.vendor_Id = angular.copy(param[0].vendor_Id)
                        $scope.filterModel.vendor_Name = angular.copy(param[0].vendor_Name)
                    }
                }
            };

            $scope.popupPlanGr = {
                onShow: false,
                delegates: {},
                onClick: function (param, index, documentType_Index, owner_Index) {
                    if ($scope.filterModel.documentType_Index != null && ($scope.filterModel.documentType_Name != '' && $scope.filterModel.documentType_Name != null)) {
                        documentType_Index = $scope.filterModel.documentType_Index;
                    };
                    if ($scope.filterModel.owner_Index != null && ($scope.filterModel.owner_Index != '' && $scope.filterModel.owner_Index != null)) {
                        owner_Index = $scope.filterModel.owner_Index;
                    };

                    if ($scope.dropdownDocumentType.model.documentType_Index == "713a4e87-30fb-4750-bf9d-6995e28e71eb") {
                        documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
                    }
                    if ($scope.dropdownDocumentType.model.documentType_Index == "a256b73d-2354-4187-b19b-d6301475e0ea") {
                        $scope.popupBom.onClick($scope.filterModel);
                    } else {
                        index = "2";
                        $scope.popupPlanGr.onShow = !$scope.popupPlanGr.onShow;
                        $scope.popupPlanGr.delegates.planGrPopup($scope.filterModel.planGoodsReceive_No, index, documentType_Index, owner_Index, true);
                    }

                },
                config: {
                    title: "PlanGr"
                },
                invokes: {
                    add: function (param) {},
                    edit: function (param) {},
                    selected: function (param) {
                        var planGoodsReceive_Index = "";
                        if (!param.length) {
                            if (param.planGoodsReceive_Index == "") {
                                $scope.filterModel.planGoodsReceive_Index = angular.copy(param.planGoodsReceive_Index);
                                $scope.filterModel.planGoodsReceive_No = angular.copy(param.planGoodsReceive_No);
                            } else {
                                $scope.filterModel.planGoodsReceive_Index = angular.copy(param.planGoodsReceive_Index);
                                $scope.filterModel.planGoodsReceive_No = angular.copy(param.planGoodsReceive_No);
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
                                $scope.filterModel.planGoodsReceive_NoTemp = $scope.filterModel.planGoodsReceive_No;
                                $scope.filterModel.planGoodsReceive_IndexTemp = $scope.filterModel.planGoodsReceive_Index;
                            }
                            planGoodsReceive_Index = "'" + $scope.filterModel.planGoodsReceive_Index + "'";
                        } else {
                            if (param[0].planGoodsReceive_Index == "") {
                                $scope.filterModel.planGoodsReceive_Index = angular.copy(param[0].planGoodsReceive_Index);
                                $scope.filterModel.planGoodsReceive_No = angular.copy(param[0].planGoodsReceive_No);
                            } else {
                                $scope.filterModel.planGoodsReceive_Index = angular.copy(param[0].planGoodsReceive_Index);
                                $scope.filterModel.planGoodsReceive_No = angular.copy(param[0].planGoodsReceive_No);
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
                                $scope.filterModel.planGoodsReceive_NoTemp = $scope.filterModel.planGoodsReceive_No;
                                $scope.filterModel.planGoodsReceive_IndexTemp = $scope.filterModel.planGoodsReceive_Index;

                            }
                            planGoodsReceive_Index = param.map(c => "'" + c.planGoodsReceive_Index + "'");
                            $scope.filterModel.id = planGoodsReceive_Index;
                        }

                        if ($scope.filterModel.listGoodsReceiveItemViewModels == undefined)
                            $scope.filterModel.listGoodsReceiveItemViewModels = [];
                        goodsReceiveItemFactory.getPlanGoodReceivePopup($scope.filterModel).then((response) => {
                            let CountTotalQty = 0;
                            if (response.data) {

                                var groups = $scope.filterModel.listGoodsReceiveItemViewModels.reduce(function (obj, item) {
                                    obj[item.planGoodsReceiveItem_Index] = obj[item.planGoodsReceiveItem_Index] || [];
                                    obj[item.planGoodsReceiveItem_Index].push(item.planGoodsReceiveItem_Index);
                                    return obj;
                                }, {});
                                var myArray = Object.keys(groups).map(function (key) {
                                    return {
                                        team: key
                                    };
                                });
                                if (myArray.length > 0) {
                                    angular.forEach(myArray, function (v, k) {

                                        var splice = response.data.filter(c => c.planGoodsReceiveItem_Index == v.team)
                                        angular.forEach(splice, function (vv, kk) {
                                            var indexof = response.data.indexOf(vv)
                                            response.data.splice(indexof, 1)
                                        });
                                    });
                                }
                                if (response.data.length > 0) {
                                    angular.forEach(response.data, function (vv, kk) {
                                        if (vv.qty != 0) {
                                            vv.itemStatus_Index = "525BCFF1-2AD9-4ACB-819D-0DEA4E84EA12";
                                            vv.itemStatus_Id = "10";
                                            vv.itemStatus_Name = "Goods-UR";
                                            var Qtyint = vv.qty;
                                            var q = vv.qty.toFixed(2);
                                            vv.qty = parseFloat(q);

                                            if (vv.weight == null) {
                                                vv.weight = vv.unitWeight * Qtyint;
                                                var w = vv.weight.toFixed(2);
                                                var wu = vv.unitWeight.toFixed(2);
                                                vv.weight = w
                                                vv.weightUnit = wu
                                            } else {
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
                                            } else {
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

                                            } else {
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

                                            if ($scope.dropdownDocumentType.model.documentType_Index == "713a4e87-30fb-4750-bf9d-6995e28e71eb") {
                                                if (vv.isMfgDate == 1) {
                                                    if (vv.mfg_Date == "" || vv.mfg_Date == null || vv.mfg_Date == undefined) {
                                                        vv.mfg_Date = vv.mfgDate_Default
                                                    }
                                                }
                                                
                                            }

                                            if ($scope.dropdownDocumentType.model.documentType_Index == "713a4e87-30fb-4750-bf9d-6995e28e71eb") {
                                                if (vv.isExpDate == 1) {
                                                    if (vv.exp_Date == "" || vv.exp_Date == null || vv.exp_Date == undefined) {
                                                        vv.exp_Date = vv.expDate_Default
                                                    }
                                                }
                                            }

                                            $scope.filterModel.listGoodsReceiveItemViewModels.push(angular.copy(vv));
                                        }
                                    });
                                }
                                for (let index = 0; index < $scope.filterModel.listGoodsReceiveItemViewModels.length; index++) {
                                    if ($scope.filterModel.listGoodsReceiveItemViewModels[index].ref_Document_No == undefined)
                                        $scope.filterModel.listGoodsReceiveItemViewModels[index].ref_Document_No = $scope.filterModel.listGoodsReceiveItemViewModels[index].planGoodsReceive_No;
                                    $scope.filterModel.listGoodsReceiveItemViewModels[index].ref_Document_Index = $scope.filterModel.listGoodsReceiveItemViewModels[index].planGoodsReceive_Index;
                                    $scope.filterModel.listGoodsReceiveItemViewModels[index].ref_DocumentItem_Index = $scope.filterModel.listGoodsReceiveItemViewModels[index].planGoodsReceiveItem_Index;
                                    $scope.filterModel.listGoodsReceiveItemViewModels[index].goodsReceive_Remark = $scope.filterModel.listGoodsReceiveItemViewModels[index].document_Remark;


                                }
                            }
                        }, (error) => {
                            console.log(error);
                        })
                        if (!param.length) {
                            goodsReceiveFactory.updateUserAssignKey({
                                GoodsReceive_Index: param.planGoodsReceive_Index,
                                UserAssign: $window.localStorage['userGuidPlanReceive']
                            }).then((response) => {}, (error) => {
                                console.log(error);
                            })
                        } else {
                            goodsReceiveFactory.updateUserAssignKey({
                                GoodsReceive_Index: param[0].planGoodsReceive_Index,
                                UserAssign: $window.localStorage['userGuidPlanReceive']
                            }).then((response) => {}, (error) => {
                                console.log(error);
                            })
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
                    add: function (param) {},
                    edit: function (param) {},
                    selected: function (param) {
                        $scope.filterModel.forwarder_Index = angular.copy(param[0].forwarder_Index)
                        $scope.filterModel.forwarder_Id = angular.copy(param[0].forwarder_Id)
                        $scope.filterModel.forwarder_Name = angular.copy(param[0].forwarder_Name)
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
                    if ($scope.dropdownDocumentType.model != undefined) {
                        param.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;

                    }
                    $scope.addDetailItem.delegates(param);

                },
                config: {
                    title: ""
                },
                invokes: {
                    add: function (param) {},
                    edit: function (param) {},
                    selected: function (param) {
                        if ($scope.filterModel.listGoodsReceiveItemViewModels == undefined) {
                            $scope.filterModel.listGoodsReceiveItemViewModels = $scope.filterModel.listGoodsReceiveItemViewModels || []
                            $scope.filterModel.listGoodsReceiveItemViewModels.push(angular.copy(param));
                        } else if (param.rowItemIndex != undefined) {
                            $scope.filterModel.listGoodsReceiveItemViewModels[param.rowItemIndex] = param;
                        } else {
                            $scope.filterModel.listGoodsReceiveItemViewModels.push(angular.copy(param));

                        }
                        let dataList = $scope.filterModel.listGoodsReceiveItemViewModels;

                        for (var i = 0; i <= dataList.length - 1; i++) {
                            $scope.filterModel.listGoodsReceiveItemViewModels[i].qty = $scope.filterModel.listGoodsReceiveItemViewModels[i].qty.toFixed(2);
                            $scope.filterModel.listGoodsReceiveItemViewModels[i].qty = parseFloat($scope.filterModel.listGoodsReceiveItemViewModels[i].qty);
                        }
                    }
                }
            };

            $scope.addDetailItemcontrack = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {

                    $scope.addDetailItemcontrack.onShow = !$scope.addDetailItemcontrack.onShow;

                    if (param) {
                        param.rowItemIndex = index;
                    }
                    if ($scope.dropdownDocumentType.model != undefined) {
                        param.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;

                    }
                    $scope.addDetailItemcontrack.delegates(param);

                },
                config: {
                    title: ""
                },
                invokes: {
                    add: function (param) {},
                    edit: function (param) {},
                    selected: function (param) {
                        if ($scope.filterModel.result_goodissue == undefined) {
                            $scope.filterModel.result_goodissue = $scope.filterModel.result_goodissue || []
                            $scope.filterModel.result_goodissue.push(angular.copy(param));
                        } else if (param.rowItemIndex != undefined) {
                            $scope.filterModel.result_goodissue[param.rowItemIndex] = param;
                        } else {
                            $scope.filterModel.result_goodissue.push(angular.copy(param));

                        }
                        let dataList = $scope.filterModel.result_goodissue;

                        for (var i = 0; i <= dataList.length - 1; i++) {
                            $scope.filterModel.result_goodissue[i].qty = $scope.filterModel.result_goodissue[i].qty.toFixed(2);
                            $scope.filterModel.result_goodissue[i].qty = parseFloat($scope.filterModel.result_goodissue[i].qty);
                        }
                    }
                }
            };

            $scope.popupBom = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupBom.onShow = !$scope.popupBom.onShow;
                    $scope.popupBom.delegates(param);
                },
                config: {
                    title: ""
                },
                invokes: {
                    add: function (param) {},
                    edit: function (param) {},
                    selected: function (param) {

                        // var Bom_Index = "";
                        // if (!param.length) {
                        //     if (param.planGoodsReceive_Index == "") {
                        //         $scope.filterModel.bom_Index = angular.copy(param.boM_Index);
                        //         $scope.filterModel.bom_No = angular.copy(param.boM_No);
                        //     } else {
                        //         $scope.filterModel.bom_Index = angular.copy(param.boM_Index);
                        //         $scope.filterModel.bom_No = angular.copy(param.boM_No);
                        //     }
                        //     Bom_Index = "'" + $scope.filterModel.bom_Index + "'";
                        // }

                        $scope.filterModel.listBomItem = $scope.filterModel.listBomItem || []
                        $scope.filterModel.listBomItem = param;

                        bomFactory.popupBomItemfilter($scope.filterModel).then(
                            function success(results) {
                                $scope.filterModel.listGoodsReceiveItemViewModels = $scope.filterModel.listGoodsReceiveItemViewModels || []
                                for (let index = 0; index < results.data.length; index++) {
                                    $scope.filterModel.listGoodsReceiveItemViewModels.push(results.data[index]);
                                }
                                for (let index = 0; index < $scope.filterModel.listGoodsReceiveItemViewModels.length; index++) {
                                    if ($scope.filterModel.listGoodsReceiveItemViewModels[index].ref_Document_No == undefined)
                                        $scope.filterModel.listGoodsReceiveItemViewModels[index].ref_Document_No = $scope.filterModel.listGoodsReceiveItemViewModels[index].bOM_No;
                                    $scope.filterModel.listGoodsReceiveItemViewModels[index].ref_Document_Index = $scope.filterModel.listGoodsReceiveItemViewModels[index].bOM_Index;
                                    //$scope.filterModel.listGoodsReceiveItemViewModels[index].ref_DocumentItem_Index = $scope.filterModel.listGoodsReceiveItemViewModels[index].bOMItem_Index;
                                    $scope.filterModel.listGoodsReceiveItemViewModels[index].goodsReceive_Remark = $scope.filterModel.listGoodsReceiveItemViewModels[index].documentItem_Remark;
                                    $scope.filterModel.listGoodsReceiveItemViewModels[index].itemStatus_Index = "525BCFF1-2AD9-4ACB-819D-0DEA4E84EA12";
                                    $scope.filterModel.listGoodsReceiveItemViewModels[index].itemStatus_Id = "10";
                                    $scope.filterModel.listGoodsReceiveItemViewModels[index].itemStatus_Name = "Goods";

                                    $scope.filterModel.listGoodsReceiveItemViewModels[index].weightUnit = $scope.filterModel.listGoodsReceiveItemViewModels[index].unitWeight
                                    $scope.filterModel.listGoodsReceiveItemViewModels[index].volumeUnit = $scope.filterModel.listGoodsReceiveItemViewModels[index].unitVolume

                                }

                                //$scope.filterModel.listGoodsReceiveItemViewModels.push(results.data);


                                //$scope.filterModel.listGoodsReceiveItemViewModels.push(angular.copy(results.data));

                            },
                            function error(response) {}
                        );
                    }
                }
            };

            $scope.$watch("filterModel.owner_Name", function () {
                $scope.index = $scope.filterModel.owner_Index;
                if ($scope.filterModel.owner_Name == undefined ||
                    $scope.filterModel.owner_Name == null ||
                    $scope.filterModel.owner_Name == "") {
                    $scope.index = undefined;
                    $scope.filterModel.owner_Index = null;
                    $scope.filterModel.owner_Id = null;
                    $scope.filterModel.owner_Name = null;
                } else {
                    if ($scope.ownerOld.index != undefined) {
                        $scope.remember.index = $scope.ownerOld.index;
                        $scope.remember.id = $scope.ownerOld.id;
                        $scope.remember.name = $scope.ownerOld.name;
                        if ($scope.index != $scope.ownerOld.index &&
                            $scope.filterModel.listGoodsReceiveItemViewModels != undefined &&
                            $scope.filterModel.listGoodsReceiveItemViewModels.length > 0) {
                            dpMessageBox.confirm({
                                ok: 'Yes',
                                cancel: 'No',
                                title: 'Cancel',
                                message: 'Owner not Match do you whant to delete items ?'
                            }).then(function success() {
                                $scope.filterModel.listGoodsReceiveItemViewModels = [];
                                $scope.filterModel.planGoodsReceive_No = null;
                                $scope.filterModel.planGoodsReceive_Index = null;
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
                    } else {
                        $scope.ownerOld.index = $scope.filterModel.owner_Index;
                        $scope.ownerOld.id = $scope.filterModel.owner_Id;
                        $scope.ownerOld.name = $scope.filterModel.owner_Name;
                    }
                }
            });

            $scope.$watch("filterModel.planGoodsIssue_Index", function () {
                $scope.index = $scope.filterModel.planGoodsIssue_Index;
                if ($scope.filterModel.planGoodsIssue_Index != null && $scope.filterModel.planGoodsIssue_Index != '-') {
                    viewModel.po_sub($scope.filterModel).then(function (res) {
                        debugger
                        $scope.filterModel.result_goodissue = res.data;
                    });
                }

            });




            //DropDown
            $scope.dropdownDocumentType = function () {
                viewModel.dropdownDocumentType($scope.filterModels).then(function (res) {
                    $scope.dropdownDocumentType = res.data;
                });
            };

            $scope.dropdownCostCenter = function () {
                viewModel.dropdownCostCenter($scope.filterModels).then(function (res) {
                    $scope.dropdownCostCenter = res.data;
                });
            };
            $scope.dropdownwarehouse = function () {
                viewModel.dropdownwarehouse($scope.filterModel).then(function (res) {
                    $scope.dropdownwarehouse = res.data;
                });
            };

            $scope.dropdownDocumentPriority = function () {
                viewModel.dropdownDocumentPriority($scope.filterModel).then(function (res) {
                    $scope.dropdownDocumentPriority = res.data;
                });
            };

            $scope.dropdownShipmentType = function () {
                viewModel.dropdownShipmentType($scope.filterModel).then(function (res) {
                    $scope.dropdownShipmentType = res.data;
                });
            };
            $scope.dropdownCargoType = function () {
                viewModel.dropdownCargoType($scope.filterModel).then(function (res) {
                    $scope.dropdownCargoType = res.data;
                });
            };
            $scope.dropdownUnloadingType = function () {
                viewModel.dropdownUnloadingType($scope.filterModel).then(function (res) {
                    $scope.dropdownUnloadingType = res.data;
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
            $scope.dropdownContainerType = function () {
                viewModel.dropdownContainerType($scope.filterModel).then(function (res) {
                    $scope.dropdownContainerType = res.data;
                });
            };

            function isGuid(stringToTest) {
                if (!stringToTest) {
                    return false;
                }
                if (stringToTest[0] === "{") {
                    stringToTest = stringToTest.substring(1, stringToTest.length - 1);
                }
                var regexGuid = /^(\{){0,1}[0-9a-fA-F]{8}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{4}\-[0-9a-fA-F]{12}(\}){0,1}$/gi;
                return regexGuid.test(stringToTest);
            }

            function getTime() {
                var Minute = new Date().getMinutes();
                var Hour = new Date().getHours();
                if (Minute < 10) Minute = '0' + Minute;

                return Hour.toString() + ':' + Minute.toString()
            }

            var init = function () {
                $scope.filterModel = {};
                $scope.filterModels = {};
                $scope.filterModel.documents = [];
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel.goodsReceive_Date = getToday();
                $scope.filterModel.goodsReceive_Due_Date = getToday()
                $scope.colortab1 = "#97bee7";
                $scope.colortab2 = "#D3D3D3";
                $scope.click = 1;
                $scope.clicktable = 1;
                $scope.dropdownDocumentType();
                $scope.dropdownCostCenter();
                $scope.dropdownwarehouse();
                $scope.dropdownDocumentPriority();
                $scope.dropdownShipmentType();
                $scope.dropdownCargoType();
                $scope.dropdownUnloadingType();
                $scope.dropdownDockDoor();
                $scope.dropdownVehicleType();
                $scope.dropdownContainerType();

            }
            init();

        }
    })
})();