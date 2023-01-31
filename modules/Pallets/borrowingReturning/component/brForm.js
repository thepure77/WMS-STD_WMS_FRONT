(function () {
    'use strict'

    app.component('brForm', {
        controllerAs: '$vm',
        templateUrl: "modules/Pallets/borrowingReturning/component/brForm.html",
        bindings: {
            isLoading: '=?',
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',

        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, purchaseOrderFactory, purchaseOrderItemFactory, planGoodsIssueItemFactory, ownerPopFactory, webServiceAPI, Upload) {
            var $vm = this;

            var defer = {};
            var viewModel = purchaseOrderFactory;
            var _viewModel = purchaseOrderItemFactory
            var ownerModel = ownerPopFactory
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
                $scope.filterModel.purchaseOrder_Date = getToday();
                $scope.filterModel.purchaseOrder_Due_Date = getToday();
                $scope.filterModel.purchaseOrder_Time = getTime();
                $scope.filterItemModel.purchaseOrder_Due_Date_Time = getTime();

                if (param != undefined) {
                    pageLoading.show()
                    viewModel.getId(param.purchaseOrder_Index).then(function (res) {
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

                        var costCenter = $scope.dropdownCostCenter
                        const resultsCostCenter = costCenter.filter((costCenter) => {
                            return costCenter.costCenter_Index == res.data.costCenter_Index;
                        })
                        $scope.dropdownCostCenter.model = resultsCostCenter[0];



                        $scope.filterModel = res.data;
                        $scope.buttons.add = false;
                        $scope.buttons.update = true;

                        if ($scope.filterModel.documentStatus == 1 || $scope.filterModel.documentStatus == 2 || $scope.filterModel.documentStatus == -1 || $scope.filterModel.documentStatus == 3)
                            $scope.buttons.update = false;
                        purchaseOrderItemFactory.GetByPurchaseOrderItemId(param.purchaseOrder_Index).then(function (res) {
                            $scope.filterModel.listPurchaseOrderItemViewModel = res.data;
                        });
                    });
                }
                else {
                    $scope.buttons.add = true;
                    if ($scope.buttons.add) {
                        $scope.filterModel.purchaseOrder_Date = getToday();
                        $scope.filterModel.purchaseOrder_Due_Date = getToday();
                        $scope.dropdownwarehouse.model = $scope.dropdownwarehouse[0];
                        $scope.filterModel.owner_Index = '02b31868-9d3d-448e-b023-05c121a424f4';
                        $scope.filterModel.owner_Name = 'Amazon';
                        $scope.filterModel.owner_Id = '3419';
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
                if ($scope.filterModel.purchaseOrder_Time != "") {
                    var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test($scope.filterModel.purchaseOrder_Time);
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
                if (!$scope.filterModel.purchaseOrder_Date) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'MSG_Alert_purchaseOrder_Date'
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
                if ($scope.dropdownCostCenter) {
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
                }


                var listmodel = $scope.filterModel.listPurchaseOrderItemViewModel;
                if ($scope.filterModel.listPurchaseOrderItemViewModel == undefined) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'ต้องเพิ่มวัสดุอย่างน้อย 1 รายการ'
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

                    for (let index = 0; index < model.listPurchaseOrderItemViewModel.length; index++) {
                        model.listPurchaseOrderItemViewModel[index].uDF1 = model.planGoodsIssueNo;
                        model.listPurchaseOrderItemViewModel[index].uDF4 = model.planGoodsIssueIndex;
                        model.listPurchaseOrderItemViewModel[index].uDF5 = model.listPurchaseOrderItemViewModel[index].planGoodsIssueItemIndex;
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
                                $scope.dropdownwarehouse.model = {};
                                $scope.dropdownCostCenter.model = {};
                                $scope.dropdownDocumentType.model = {};
                                $scope.dropdownRound.model = {};
                                $scope.dropdownTypeCar.model = {};
                                $scope.dropdownTransport.model = {};
                                $scope.dropdownProductconversion.model = {};
                                $scope.filterModel.purchaseOrder_Date = getToday();
                                $scope.filterModel.purchaseOrder_Due_Date = getToday();
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
                var listmodel = $scope.filterModel.listPurchaseOrderItemViewModel;

                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยันข้อมูล ?',
                    message: 'คุณต้องการบันทึกข้อมูลหรือไม่!'
                }).then(function () {
                    viewModel.getId(model.purchaseOrder_Index).then(function (res) {
                        if (res.data.userAssign != $scope.userName) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "User ไม่ตรงกับ UserAssign"
                            })
                            $scope.filterModel = {};
                            $scope.dropdownwarehouse.model = {};
                            $scope.dropdownDocumentType.model = {};
                            $scope.dropdownCostCenter.model = {};
                            $scope.dropdownRound.model = {};
                            $scope.dropdownTypeCar.model = {};
                            $scope.dropdownTransport.model = {};
                            $scope.dropdownProductconversion.model = {};
                            $scope.filterModel.purchaseOrder_Date = getToday();
                            $scope.filterModel.purchaseOrder_Due_Date = getToday();
                            defer.resolve();
                        }
                        else {
                            model.update_By = localStorageService.get('userTokenStorage');
                            viewModel.add(model).then(
                                function success(res) {
                                    $vm.filterModel = res.config.data;
                                    $vm.searchResultModel = res.config.data;
                                    $scope.filterModel = {};
                                    $scope.dropdownwarehouse.model = {};
                                    $scope.dropdownDocumentType.model = {};
                                    $scope.dropdownCostCenter.model = {};
                                    $scope.dropdownRound.model = {};
                                    $scope.dropdownTypeCar.model = {};
                                    $scope.dropdownTransport.model = {};
                                    $scope.dropdownProductconversion.model = {};
                                    $scope.filterModel.purchaseOrder_Date = getToday();
                                    $scope.filterModel.purchaseOrder_Due_Date = getToday();
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
                if ($scope.filterModel.purchaseOrder_Index != undefined) {
                    $scope.deleteuser.purchaseOrder_Index = $scope.filterModel.purchaseOrder_Index;
                    viewModel.deleteUserAssign($scope.deleteuser).then(
                        function success(results) {
                            $scope.filterModel = {};
                            $scope.dropdownwarehouse.model = {};
                            $scope.dropdownDocumentType.model = {};
                            $scope.dropdownCostCenter.model = {};

                            defer.resolve();
                        }
                    );
                }
                else {
                    $scope.filterModel = {};
                    $scope.dropdownwarehouse.model = {};
                    $scope.dropdownDocumentType.model = {};
                    $scope.dropdownCostCenter.model = {};
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
                            message: 'กรุณาเลือกวัสดุ !'
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
                            message: 'กรุณาเลือกจำนวนวัสดุ !'
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

                if ($scope.filterModel.listPurchaseOrderItemViewModel == undefined) {
                    $scope.filterModel.listPurchaseOrderItemViewModel = $scope.filterModel.listPurchaseOrderItemViewModel || []
                    $scope.filterModel.listPurchaseOrderItemViewModel.push(angular.copy(param));
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

                    $scope.filterModel.listPurchaseOrderItemViewModel[param.rowItemIndex].product_Id = $scope.filterItemModel.product_Id;
                    $scope.filterModel.listPurchaseOrderItemViewModel[param.rowItemIndex].product_Index = $scope.filterItemModel.product_Index;
                    $scope.filterModel.listPurchaseOrderItemViewModel[param.rowItemIndex].product_Name = $scope.filterItemModel.product_Name;
                    $scope.filterModel.listPurchaseOrderItemViewModel[param.rowItemIndex].qty = $scope.filterItemModel.qty;
                    $scope.filterModel.listPurchaseOrderItemViewModel[param.rowItemIndex].productconversion_Index = param.productconversion_Index;
                    $scope.filterModel.listPurchaseOrderItemViewModel[param.rowItemIndex].productconversion_Id = param.productconversion_Id;
                    $scope.filterModel.listPurchaseOrderItemViewModel[param.rowItemIndex].productconversion_Name = param.productconversion_Name;
                    $scope.filterModel.listPurchaseOrderItemViewModel[param.rowItemIndex].weight = $scope.filterItemModel.weight;
                    $scope.filterModel.listPurchaseOrderItemViewModel[param.rowItemIndex].ratio = param.ratio;
                    $scope.filterModel.listPurchaseOrderItemViewModel[param.rowItemIndex].documentItem_Remark = $scope.filterItemModel.documentItem_Remark;
                    $scope.filterModel.listPurchaseOrderItemViewModel[param.rowItemIndex].start_Date = $scope.filterItemModel.start_Date;
                    $scope.filterModel.listPurchaseOrderItemViewModel[param.rowItemIndex].end_Date = $scope.filterItemModel.end_Date;
                    $scope.filterModel.listPurchaseOrderItemViewModel[param.rowItemIndex].delivery_Date = $scope.filterItemModel.delivery_Date;

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
                    $scope.filterModel.listPurchaseOrderItemViewModel.push(angular.copy(param));
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
                owner: "Autocomplete/autoOwnerfilter",
                purchaseOrder_No: "Autocomplete/autoPlanGoodsReceiveNo",
                warehouse_Name: "Autocomplete/autoWarehousefilter",
                vendor: "Autocomplete/autoVenderfilter",
                documentType: "Autocomplete/autoDocumentTypefilter",
                processStatus: "Autocomplete/autoStatusfilter",
                sku: "Autocomplete/autoSkufilter",
                product: "Autocomplete/autoProductfilter",

            };

            $scope.url = {
                PO: webServiceAPI.PO,
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
                        if ($scope.filterModel.listPurchaseOrderItemViewModel == undefined) {
                            $scope.filterModel.listPurchaseOrderItemViewModel = $scope.filterModel.listPurchaseOrderItemViewModel || []
                            $scope.filterModel.listPurchaseOrderItemViewModel.push(angular.copy(param));
                        }
                        else if (param.rowItemIndex != undefined) {
                            $scope.filterModel.listPurchaseOrderItemViewModel[param.rowItemIndex] = param;
                        }
                        else {
                            $scope.filterModel.listPurchaseOrderItemViewModel.push(angular.copy(param));

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
                url: webServiceAPI.PO + "PlanGoodsReceive/importFileInboundV2",
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

            var init = function () {
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

                $scope.colortab1 = "#FDFEFE";
                $scope.colortab2 = "#D3D3D3";
                $scope.click = 1;

            };
            init();
        }
    })
})();