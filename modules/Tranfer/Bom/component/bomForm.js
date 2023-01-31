(function () {
    'use strict'

    app.component('bomForm', {
        controllerAs: '$vm',
        templateUrl: "modules/Tranfer/BOM/component/bomForm.html",
        bindings: {
            isLoading: '=?',
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',

        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, webServiceAPI, bomFactory) {
            var $vm = this;

            var defer = {};
            var viewModel = bomFactory;

            $scope.filterModel = {};
            $scope.filterItemModel = {};
            $vm.isFilterTable = true;
            $scope.onShow = false;
            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });



            $vm.onShow = function (param) {
                // console.log("onShow");
                // console.log(param);
                defer = $q.defer();
                $scope.onShow = true;
                $scope.filterModel.BOM_Date = getToday();
                // $scope.filterModel.EXP_Date = getToday();
                // $scope.filterModel.MFG_Date = getToday();

                $scope.filterModel.BOM_Due_Date = getToday();
                $scope.filterModel.BOM_Time = getTime();
                if (param != undefined) {
                    pageLoading.show()
                    viewModel.getId(param.BOM_Index).then(function (res) {
                        pageLoading.hide()

                        var warehouse = $scope.dropdownwarehouse
                        const resultsWarehouse = warehouse.filter((warehouse) => {
                            return warehouse.warehouse_Name == res.data.Warehouse_Name;
                        })
                        $scope.dropdownwarehouse.model = resultsWarehouse[0];


                        var documentType = $scope.dropdownDocumentType
                        const resultsDocumentType = documentType.filter((documentType) => {
                            return documentType.documentType_Index == res.data.DocumentType_Index;
                        })
                        $scope.dropdownDocumentType.model = resultsDocumentType[0];


                        var ItemStatus = $scope.dropdownItemStatus
                        const resultsItemStatus = ItemStatus.filter((ItemStatus) => {
                            return ItemStatus.itemStatus_Index == res.data.ItemStatus_Index;
                        })
                        $scope.dropdownItemStatus.model = resultsItemStatus[0];



                        $scope.filterModel = res.data;
                        $scope.buttons.add = false;
                        $scope.buttons.update = true;

                        // console.log($scope.filterModel);
                        if ($scope.filterModel.Document_Status == 1 || $scope.filterModel.Document_Status == 2 || $scope.filterModel.Document_Status == -1 || $scope.filterModel.Document_Status == 3)
                            $scope.buttons.update = false;
                        viewModel.getItemId(param.BOM_Index).then(function (res) {
                            $scope.filterModel.listBOMItemViewModel = res.data;
                            // console.log("Loading Item");
                            // console.log(res.data);

                        });

                    });
                }
                else {
                    $scope.buttons.add = true;
                    if ($scope.buttons.add) {
                        $scope.filterModel.BOM_Date = getToday();
                        $scope.filterModel.BOM_Due_Date = getToday();
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



            $vm.triggerSearch = function () {
                $vm.filterModel = $vm.filterModel || {};
                pageLoading.show();
                viewModel.FilterSearch().then(function (res) {
                    pageLoading.hide();
                    $vm.filterModel = res.data.itemsBOM;
                    $vm.searchResultModel = res.data.itemsBOM;
                });
            };

            $scope.filter = function () {
                $vm.triggerSearch();
            };

            $scope.add = function () {
                var model = $scope.filterModel;
                // var listmodel = $scope.filterModel.listBOMItemViewModel;
                if ($scope.dropdownwarehouse.model != null) {
                    $scope.filterModel.Warehouse_Index = $scope.dropdownwarehouse.model.warehouse_Index;
                    $scope.filterModel.Warehouse_Id = $scope.dropdownwarehouse.model.warehouse_Id;
                    $scope.filterModel.Warehouse_Name = $scope.dropdownwarehouse.model.warehouse_Name;
                }

                if ($scope.dropdownDocumentType.model != null) {
                    $scope.filterModel.DocumentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
                    $scope.filterModel.DocumentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
                    $scope.filterModel.DocumentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
                }
                if ($scope.dropdownItemStatus.model != null) {
                    $scope.filterModel.ItemStatus_Index = $scope.dropdownItemStatus.model.itemStatus_Index;
                    $scope.filterModel.ItemStatus_Id = $scope.dropdownItemStatus.model.itemStatus_Id;
                    $scope.filterModel.ItemStatus_Name = $scope.dropdownItemStatus.model.itemStatus_Name;
                }

                if ($scope.dropdownProductconversion.model != null) {
                    $scope.filterModel.ProductConversion_Index = $scope.dropdownProductconversion.model.productConversion_Index;
                    $scope.filterModel.ProductConversion_Id = $scope.dropdownProductconversion.model.productConversion_Id;
                    $scope.filterModel.ProductConversion_Name = $scope.dropdownProductconversion.model.productConversion_Name;

                    $scope.filterModel.Ratio = $scope.dropdownProductconversion.model.productconversion_Ratio; //Auto Assige Ratio

                }

                if ($scope.dropdownwarehouse.model != null) {
                    $scope.filterModel.Warehouse_Index = $scope.dropdownwarehouse.model.warehouse_Index;
                    $scope.filterModel.Warehouse_Id = $scope.dropdownwarehouse.model.warehouse_Id;
                    $scope.filterModel.Warehouse_Name = $scope.dropdownwarehouse.model.warehouse_Name;
                }

                if ($scope.dropdownDocumentType.model != null) {
                    $scope.filterModel.DocumentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
                    $scope.filterModel.DocumentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
                    $scope.filterModel.DocumentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
                }

                // console.log($scope.dropdownItemStatus);

                if ($scope.dropdownItemStatus.model != null) {
                    $scope.filterModel.ItemStatus_Index = $scope.dropdownItemStatus.model.itemStatus_Index;
                    $scope.filterModel.ItemStatus_Id = $scope.dropdownItemStatus.model.itemStatus_Id;
                    $scope.filterModel.ItemStatus_Name = $scope.dropdownItemStatus.model.itemStatus_Name;
                }



                if ($scope.dropdownWeight.weightModel != null) {
                    $scope.filterModel.Weight_Index = $scope.dropdownWeight.weightModel.weight_Index;
                    $scope.filterModel.Weight_Id = $scope.dropdownWeight.weightModel.weight_Id;
                    $scope.filterModel.Weight_Name = $scope.dropdownWeight.weightModel.weight_Name;
                    $scope.filterModel.WeightRatio = $scope.dropdownWeight.weightModel.weight_Ratio;
                }

                if ($scope.dropdownWeight.grsWeightModel != null) {
                    $scope.filterModel.GrsWeight_Index = $scope.dropdownWeight.grsWeightModel.weight_Index;
                    $scope.filterModel.GrsWeight_Id = $scope.dropdownWeight.grsWeightModel.weight_Id;
                    $scope.filterModel.GrsWeight_Name = $scope.dropdownWeight.grsWeightModel.weight_Name;
                    $scope.filterModel.GrsWeightRatio = $scope.dropdownWeight.grsWeightModel.weight_Ratio;
                }

                if ($scope.dropdownVolume.model != null) {
                    $scope.filterModel.Width_Index = $scope.dropdownVolume.model.volume_Index;
                    $scope.filterModel.Width_Id = $scope.dropdownVolume.model.volume_Id;
                    $scope.filterModel.Width_Name = $scope.dropdownVolume.model.volume_Name;
                    $scope.filterModel.WidthRatio = $scope.dropdownVolume.model.volume_Ratio;

                    $scope.filterModel.Length_Index = $scope.dropdownVolume.model.volume_Index;
                    $scope.filterModel.Length_Id = $scope.dropdownVolume.model.volume_Id;
                    $scope.filterModel.Length_Name = $scope.dropdownVolume.model.volume_Name;
                    $scope.filterModel.LengthRatio = $scope.dropdownVolume.model.volume_Ratio;

                    $scope.filterModel.Height_Index = $scope.dropdownVolume.model.volume_Index;
                    $scope.filterModel.Height_Id = $scope.dropdownVolume.model.volume_Id;
                    $scope.filterModel.Height_Name = $scope.dropdownVolume.model.volume_Name;
                    $scope.filterModel.HeightRatio = $scope.dropdownVolume.model.volume_Ratio;

                }

                if ($scope.dropdownwarehouse.model == null) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'MSG_Alert_Warehouse'
                        }
                    )
                    return "";
                }

                if ($scope.filterModel.DocumentType_Name == undefined || $scope.filterModel.DocumentType_Index == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'MSG_Alert_DocumentType'
                        }
                    )
                    return "";
                }
                if ($scope.filterModel.ItemStatus_Name == undefined || $scope.filterModel.ItemStatus_Index == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'MSG_Alert_Status'
                        }
                    )
                    return "";
                }


                if ($scope.filterModel.BOM_Date == undefined || $scope.filterModel.BOM_Date == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'MSG_Alert_BOMDATE'
                        }
                    )
                    return "";
                }
                if ($scope.filterModel.Owner_Name == undefined || $scope.filterModel.Owner_Name == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'MSG_Alert_Owner'
                        }
                    )
                    return "";
                }
                if ($scope.filterModel.Owner_Id == undefined || $scope.filterModel.Owner_Id == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'MSG_Alert_Owner'
                        }
                    )
                    return "";
                }

                if ($scope.filterModel.listBOMItemViewModel == undefined) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'MSG_Alert_Add_least_1_item'
                        }
                    )
                    return "";
                }
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'MSG_SURE_data',
                    message: 'MSG_Confirm_Save'
                }).then(function () {
                    model.Create_By = localStorageService.get('userTokenStorage');

                    viewModel.add(model).then(
                        function success(res) {

                            if (res.data.status == true) {
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'Success',
                                        message: res.data.document_No
                                    }
                                )
                                $scope.filterModel = {};
                                $scope.dropdownwarehouse.model = {};
                                $scope.dropdownDocumentType.model = {};
                                $scope.dropdownProductconversion.model = {};
                                $scope.dropdownItemStatus.model = {};
                                $scope.filterModel.BOM_Date = getToday();
                                $scope.filterModel.BOM_Due_Date = getToday();
                                defer.resolve();
                            }
                            else {
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'ALERT',
                                        message: res.data.message
                                    }
                                )
                            }
                        },
                        function error(response) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: 'MSG_Save_error'
                                }
                            )
                        }
                    );
                },
                    function error(param) {
                    });
            };

            $scope.edit = function () {

                // console.log("edit บันทึกส่งค่าเข้า service");

                var model = $scope.filterModel;
                var listmodel = $scope.filterModel.listBOMItemViewModel;
                if ($scope.dropdownwarehouse.model != null) {
                    $scope.filterModel.Warehouse_Index = $scope.dropdownwarehouse.model.warehouse_Index;
                    $scope.filterModel.Warehouse_Id = $scope.dropdownwarehouse.model.warehouse_Id;
                    $scope.filterModel.Warehouse_Name = $scope.dropdownwarehouse.model.warehouse_Name;
                }

                if ($scope.dropdownDocumentType.model != null) {
                    $scope.filterModel.DocumentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
                    $scope.filterModel.DocumentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
                    $scope.filterModel.DocumentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
                }

                // console.log($scope.dropdownItemStatus);

                if ($scope.dropdownItemStatus.model != null) {
                    $scope.filterModel.ItemStatus_Index = $scope.dropdownItemStatus.model.itemStatus_Index;
                    $scope.filterModel.ItemStatus_Id = $scope.dropdownItemStatus.model.itemStatus_Id;
                    $scope.filterModel.ItemStatus_Name = $scope.dropdownItemStatus.model.itemStatus_Name;
                }
                if ($scope.dropdownwarehouse.model == null) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'MSG_Alert_Warehouse'
                        }
                    )
                    return "";
                }

                if ($scope.filterModel.DocumentType_Name == undefined || $scope.filterModel.DocumentType_Index == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'MSG_Alert_DocumentType'
                        }
                    )
                    return "";
                }

                if ($scope.filterModel.ItemStatus_Name == undefined || $scope.filterModel.ItemStatus_Index == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'MSG_Alert_Status'
                        }
                    )
                    return "";
                }


                if ($scope.filterModel.BOM_Date == undefined || $scope.filterModel.BOM_Date == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'MSG_Alert_BOMDATE'
                        }
                    )
                    return "";
                }
                if ($scope.filterModel.Owner_Name == undefined || $scope.filterModel.Owner_Name == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'MSG_Alert_Owner'
                        }
                    )
                    return "";
                }
                if ($scope.filterModel.Owner_Id == undefined || $scope.filterModel.Owner_Id == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'MSG_Alert_Owner'
                        }
                    )
                    return "";
                }

                if ($scope.filterModel.listBOMItemViewModel == undefined) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'MSG_Alert_Add_least_1_item'
                        }
                    )
                    return "";
                }
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm ?',
                    message: 'Do you want to save !'
                }).then(function () {
                    viewModel.getId(model.BOM_Index).then(function (res) {
                        // console.log(res.data.UserAssign);
                        // console.log($scope.userName);
                        if (res.data.UserAssign != $scope.userName) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "User ไม่ตรงกับ UserAssign"
                            })

                            return "";
                        }
                        else {
                            model.Update_By = localStorageService.get('userTokenStorage');

                            // console.log(model);
                            viewModel.add(model).then(
                                function success(res) {
                                    if (res.data.status == true) {
                                        dpMessageBox.alert({
                                            ok: 'Close',
                                            title: 'Success.',
                                            message: "Save Complete"
                                        })

                                        // console.log("res");
                                        // console.log(res);
                                        $vm.filterModel = res.config.data;
                                        $vm.searchResultModel = res.config.data;
                                        $scope.filterModel = {};
                                        $scope.dropdownwarehouse.model = {};
                                        $scope.dropdownDocumentType.model = {};
                                        $scope.dropdownProductconversion.model = {};
                                        $scope.dropdownProductconversion2.model = {};
                                        $scope.dropdownItemStatus.model = {};
                                        $scope.filterModel.BOM_Date = getToday();
                                        $scope.filterModel.BOM_Due_Date = getToday();
                                        defer.resolve('-99');
                                    }
                                    else {
                                        dpMessageBox.alert({
                                            ok: 'Close',
                                            title: 'Error.',
                                            message: res.data.message
                                        })

                                        return "";
                                    }

                                },
                                function error(response) {
                                    // console.log("response");
                                    // console.log(response);
                                    dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'Error',
                                            message: 'Save Error'
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


            this.$onInit = function () {
                $scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');
            };

            $scope.back = function () {
                $scope.deleteuser = {};
                if ($scope.filterModel.BOM_Index != undefined) {
                    $scope.deleteuser.BOM_Index = $scope.filterModel.BOM_Index;
                    viewModel.deleteUserAssign($scope.deleteuser).then(
                        function success(results) {
                            $scope.filterModel = {};
                            $scope.dropdownwarehouse.model = {};
                            $scope.dropdownDocumentType.model = {};
                            $scope.dropdownProductconversion.model = {};
                            // $scope.dropdownProductconversion2.model = {};
                            $scope.dropdownItemStatus.model = {};
                            $scope.dropdownWeight.weightModel = {};
                            $scope.dropdownWeight.netWeightModel = {};
                            $scope.dropdownWeight.grsWeightModel = {};
                            $scope.dropdownVolume.model= {};
                            defer.resolve();
                        }
                    );
                }
                else {
                    $scope.filterModel = {};
                    $scope.dropdownwarehouse.model = {};
                    $scope.dropdownDocumentType.model = {};
                    $scope.dropdownProductconversion.model = {};
                    // $scope.dropdownProductconversion2.model = {};
                    $scope.dropdownItemStatus.model = {};
                    $scope.dropdownWeight.weightModel = {};
                    $scope.dropdownWeight.netWeightModel = {};
                    $scope.dropdownWeight.grsWeightModel = {};
                    $scope.dropdownVolume.model= {};
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




            $scope.deleteItem = function (param, index) {
                // console.log(param);
                param.splice(index, 1);
            }


            $scope.autoComplete = {
                owner: "Bom/AutoOwnerfilter",
                BOM_No: "Bom/AutoDocumentNo",
                autoBOM: "Bom/AutobasicSuggestion",
                user: "Bom/autoUser",
                warehouse_Name: "Bom/AutoWarehousefilter",
                vendor: "Bom/AutoVenderfilter",
                documentType: "Bom/AutoDocumentTypefilter",
                processStatus: "Bom/AutoStatusfilter",
                documentRef: "Bom/autoDocumentRef",
                sku: "Bom/autoSkufilter",
                product: "Bom/autoProductfilter",
                findProductBOM: "Bom/findProductBOM",
                skuBOM: "Bom/autoSkufilterBOM",
            };

            $scope.url = {
                BOM: webServiceAPI.BOM,
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
            $scope.dropdownItemStatus = function () {
                viewModel.dropdownItemStatus($scope.filterModel).then(function (res) {
                    $scope.dropdownItemStatus = res.data;

                    $scope.dropdownItemStatus.model = $scope.dropdownItemStatus.find(f => f.itemStatus_Index.toUpperCase() == "525BCFF1-2AD9-4ACB-819D-0DEA4E84EA12");

                });
            };

            $scope.dropdownProductconversion = function () {
                viewModel.dropdownProductconversion($scope.filterModel).then(function (res) {
                    $scope.dropdownProductconversion = res.data;
                });
            };


            $scope.$watch("filterModel.Product_Name", function () {
                if ($scope.filterModel.Product_Id == "" || $scope.filterModel.Product_Name == ""
                    || $scope.filterModel.Product_Id == undefined || $scope.filterModel.Product_Name == undefined) {
                    $scope.dropdownProductconversion.model = {};
                }
                else {
                    viewModel.dropdownProductconversion($scope.filterModel).then(function (res) {
                        $scope.dropdownProductconversion = res.data;
                        $scope.dropdownProductconversion.model = $scope.dropdownProductconversion[0];
                        
                        //$scope.filterModel.UnitWeight = $scope.dropdownProductconversion.model.productConversion_Weight;

                        $scope.filterModel.UnitWidth = $scope.dropdownProductconversion.model.productConversion_Width;
                        $scope.filterModel.UnitLength = $scope.dropdownProductconversion.model.productConversion_Length;
                        $scope.filterModel.UnitHeight = $scope.dropdownProductconversion.model.productConversion_Height;
                        $scope.filterModel.UnitVolume = $scope.filterItemModel.UnitWidth * $scope.filterItemModel.UnitLength * $scope.filterItemModel.UnitHeight;
                    
                        var volume = $scope.dropdownVolume
                        const resultvolume = volume.filter((volume) => {
                            return volume.volume_Index == $scope.dropdownProductconversion[0].productConversion_Volume_Index;
                        })
                        $scope.dropdownVolume.model = resultvolume[0];

                        var weight = $scope.dropdownWeight
                        const resultweight = weight.filter((weight) => {
                            return weight.weight_Index == $scope.dropdownProductconversion[0].productConversion_Weight_Index;
                        })
                        $scope.dropdownWeight.weightModel = resultweight[0];
                        $scope.dropdownWeight.netWeightModel = resultweight[0];
                        $scope.dropdownWeight.grsWeightModel = resultweight[0];
                    });

                    //Delete item
                    if ($scope.filterModel.listBOMItemViewModel != undefined) {
                        if ($scope.filterModel.listBOMItemViewModel.length > 0) {
                            dpMessageBox.confirm({
                                ok: 'Yes',
                                cancel: 'No',
                                title: 'Cancel',
                                message: 'MSG_Alert_Product_change_delete_Item'
                            }).then(function success() {
                                $scope.filterModel.listBOMItemViewModel = [];
                            }, function error(res) { });
                        }
                    }

                }
            });

            $scope.$watch("filterModel.Qty", function () {
                if ($scope.filterModel.Qty != undefined) {
                    if ($scope.dropdownProductconversion.model == undefined) {
                    }
                    else {
                        if ($scope.dropdownProductconversion.model.productConversion_Weight != undefined) {
                            $scope.filterModel.Weight = $scope.filterModel.Qty * $scope.dropdownWeight.weightModel.weight_Ratio;
                            
                            $scope.filterModel.NetWeight = $scope.filterModel.Qty * $scope.dropdownProductconversion.model.productConversion_Weight;
                            $scope.filterModel.GrsWeight = $scope.filterModel.Qty * $scope.dropdownProductconversion.model.productConversion_GrsWeight;

                            var numQty = parseFloat($scope.filterModel.Qty);
                            $scope.filterModel.Volume = numQty * (($scope.filterModel.UnitWidth * $scope.filterModel.UnitLength * $scope.filterModel.UnitHeight) / $scope.dropdownVolume.model.volume_Ratio)
                        }
                    }

                    //Delete item
                    if ($scope.filterModel.listBOMItemViewModel != undefined) {
                        if ($scope.filterModel.listBOMItemViewModel.length > 0) {
                            dpMessageBox.confirm({
                                ok: 'Yes',
                                cancel: 'No',
                                title: 'Cancel',
                                message: 'Quantity is change do you whant to delete items ?'
                            }).then(function success() {
                                $scope.filterModel.listBOMItemViewModel = [];
                            }, function error(res) { });
                        }
                    }

                }

            });

            //-------------------------------------------------------------------------------

            // $scope.$watch("filterItemModel.Product_Name", function () {
            //     // console.log("Event filterItemModel.Product_Name");
            //     if ($scope.filterItemModel.Product_Id == "" || $scope.filterItemModel.Product_Name == ""
            //         || $scope.filterItemModel.Product_Id == undefined || $scope.filterItemModel.Product_Name == undefined) {
            //         $scope.dropdownProductconversion2.model = {};
            //     }
            //     else {
            //         viewModel.dropdownProductconversion($scope.filterItemModel).then(function (res) {
            //             $scope.dropdownProductconversion2 = res.data;
            //             $scope.dropdownProductconversion2.model = $scope.dropdownProductconversion2[0];
            //         });
                    
            //     }
            // });

            // $scope.$watch("filterItemModel.Qty", function () {
            //     // console.log("Event filterItemModel.Qty");
            //     if ($scope.filterItemModel.Qty != undefined) {
            //         if ($scope.dropdownProductconversion2.model == undefined) {
            //         }
            //         else {
            //             if ($scope.dropdownProductconversion2.model.productconversion_Weight != undefined) {
            //                 $scope.filterItemModel.Weight = $scope.filterItemModel.Qty * $scope.dropdownProductconversion2.model.productconversion_Weight;
            //             }
            //         }
            //     }

            // });

            //-------------------------------------------------------------------------------





            // $scope.next = function (param) {

            //     for (var i = 0; i < $scope.menu.length; i++) {
            //         // console.log("Auto BOM i = " + i);
            //         // console.log($scope.filterModel.listBOMItemViewModel);
            //         if (i == 0) {
            //             if ($scope.dropdownwarehouse.model != null) {
            //                 $scope.filterModel.Warehouse_Index = $scope.dropdownwarehouse.model.warehouse_Index;
            //                 $scope.filterModel.Warehouse_Id = $scope.dropdownwarehouse.model.warehouse_Id;
            //                 $scope.filterModel.Warehouse_Name = $scope.dropdownwarehouse.model.warehouse_Name;
            //             }

            //             if ($scope.dropdownDocumentType.model != null) {
            //                 $scope.filterModel.DocumentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
            //                 $scope.filterModel.DocumentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
            //                 $scope.filterModel.DocumentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
            //             }

            //             // console.log($scope.dropdownItemStatus);

            //             if ($scope.dropdownItemStatus.model != null) {
            //                 $scope.filterModel.ItemStatus_Index = $scope.dropdownItemStatus.model.itemStatus_Index;
            //                 $scope.filterModel.ItemStatus_Id = $scope.dropdownItemStatus.model.itemStatus_Id;
            //                 $scope.filterModel.ItemStatus_Name = $scope.dropdownItemStatus.model.itemStatus_Name;
            //             }
            //             // else {
            //             //     $scope.filterModel.ItemStatus_Index = "00000000-0000-0000-0000-000000000000";
            //             //     $scope.filterModel.ItemStatus_Id = -99;
            //             //     $scope.filterModel.ItemStatus_Name = "";
            //             // }

            //             if ($scope.dropdownwarehouse.model == null) {
            //                 dpMessageBox.alert(
            //                     {
            //                         ok: 'Close',
            //                         title: 'ALERT',
            //                         message: 'Please Choose To Warehouse !'
            //                     }
            //                 )
            //                 return "";
            //             }

            //             if ($scope.filterModel.DocumentType_Name == undefined || $scope.filterModel.DocumentType_Index == "") {
            //                 dpMessageBox.alert(
            //                     {
            //                         ok: 'Close',
            //                         title: 'ALERT',
            //                         message: 'Please Choose DocumentType !'
            //                     }
            //                 )
            //                 return "";
            //             }

            //             if ($scope.filterModel.ItemStatus_Name == undefined || $scope.filterModel.ItemStatus_Index == "") {
            //                 dpMessageBox.alert(
            //                     {
            //                         ok: 'Close',
            //                         title: 'ALERT',
            //                         message: 'Please Choose Status !'
            //                     }
            //                 )
            //                 return "";
            //             }


            //             if ($scope.filterModel.BOM_Date == undefined || $scope.filterModel.BOM_Date == "") {
            //                 dpMessageBox.alert(
            //                     {
            //                         ok: 'Close',
            //                         title: 'ALERT',
            //                         message: 'Please Choose BOM_Date Date !'
            //                     }
            //                 )
            //                 return "";
            //             }
            //             if ($scope.filterModel.Owner_Name == undefined || $scope.filterModel.Owner_Name == "") {
            //                 dpMessageBox.alert(
            //                     {
            //                         ok: 'Close',
            //                         title: 'ALERT',
            //                         message: 'Please Choose Owner !'
            //                     }
            //                 )
            //                 return "";
            //             }
            //             if ($scope.filterModel.Owner_Id == undefined || $scope.filterModel.Owner_Id == "") {
            //                 dpMessageBox.alert(
            //                     {
            //                         ok: 'Close',
            //                         title: 'ALERT',
            //                         message: 'Owner  Not Found!'
            //                     }
            //                 )
            //                 return "";
            //             }




            //             if ($scope.filterModel.listBOMItemViewModel == undefined || $scope.filterModel.listBOMItemViewModel.length == 0) {
            //                 // console.log("Auto BOM i = 0");
            //                 viewModel.AutoProductBOMItem(param).then(function (res) {
            //                     $scope.filterModel.listBOMItemViewModel = res.data;
            //                 });
            //             }

            //         }

            //         if (i == 1) {
            //             if ($scope.filterModel.listBOMItemViewModel == undefined) {
            //                 dpMessageBox.alert(
            //                     {
            //                         ok: 'Close',
            //                         title: 'Error',
            //                         message: 'Error: Add at least 1 Item'
            //                     }
            //                 )
            //                 return "";
            //             }
            //         }

            //         if ($scope.menu[i].active == "active") {
            //             $scope.menu[i].active = "";
            //             $scope.menu[i].completed = "completed";
            //             i++;
            //             $scope.menu[i].active = "active";
            //             $scope.menu_width = i * 50; //กำหนดความกว้างของเส้นเชื่อม
            //             $scope.menu_name = $scope.menu[i].name;
            //         }
            //     }

            //     // console.log($scope.filterModel);

            // }
            

            $scope.dropdownWeight = function () {
                viewModel.dropdownWeight($scope.filterModel).then(function (res) {
                    $scope.dropdownWeight = res.data;
                });
            };
            $scope.dropdownVolume = function () {
                viewModel.dropdownVolume($scope.filterModel).then(function (res) {
                    $scope.dropdownVolume = res.data;
                });
            };



            $scope.Calculator = function(param)
            {
                // if ($scope.filterModel.MFG_Date == undefined || $scope.filterModel.MFG_Date == "") {
                //     dpMessageBox.alert(
                //         {
                //             ok: 'Close',
                //             title: 'ALERT',
                //             message: 'MSG_Alert_MFGDATE'
                //         }
                //     )
                //     return "";
                // }
                // if ($scope.filterModel.EXP_Date == undefined || $scope.filterModel.EXP_Date == "") {
                //     dpMessageBox.alert(
                //         {
                //             ok: 'Close',
                //             title: 'ALERT',
                //             message: 'MSG_Alert_EXPDATE'
                //         }
                //     )
                //     return "";
                // }
                //----------------------------------------------------------------------------------------------------------------------------------

                // var str = $scope.filterModel.EXP_Date;
                // var YStart = str.substring(0, 4);
                // var MStart = str.substring(4, 6);
                // var DStart = str.substring(6, 8);

                // var str2 = $scope.filterModel.MFG_Date;
                // var YStart2 = str2.substring(0, 4);
                // var MStart2 = str2.substring(4, 6);
                // var DStart2 = str2.substring(6, 8);

                // if (parseInt(YStart.toString() + MStart.toString() + DStart.toString()) < parseInt(YStart2.toString() + MStart2.toString() + DStart2.toString())) {
                //     dpMessageBox.alert(
                //         {
                //             ok: 'Close',
                //             title: 'ALERT',
                //             message: 'MSG_Alert_EXPDATE_MORE_THEN_MFGDATE'
                //         }
                //     )
                //     return "";
                // }

                //----------------------------------------------------------------------------------------------------------------------------------

                if (!(!isNaN(parseFloat($scope.filterModel.Qty)) && angular.isNumber(parseFloat($scope.filterModel.Qty)))) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'MSG_Alert_INSERT_NUMBER_QTY'
                        }
                    )
                    return "";
                } else {
                    if (parseFloat($scope.filterModel.Qty) <= 0) {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'ALERT',
                                message: 'MSG_Alert_INSERT_NUMBER_MORE_THEN_0'
                            }
                        )
                        return "";
                    }
                }

                if (!(!isNaN(parseFloat($scope.filterModel.Weight)) && angular.isNumber(parseFloat($scope.filterModel.Weight)))) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'MSG_Alert_INSERT_NUMBER_WEIGHT'
                        }
                    )
                    return "";
                } else {
                    if (parseFloat($scope.filterModel.Weight) < 0) {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'ALERT',
                                message: 'MSG_Alert_INSERT_NUMBER_MORE_THEN_0'
                            }
                        )
                        return "";
                    }
                }

                if ($scope.dropdownProductconversion.model == null) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณาเลือกหน่วย !'
                        }
                    )
                    return "";
                }


                if ($scope.filterModel.listBOMItemViewModel == undefined || $scope.filterModel.listBOMItemViewModel.length == 0) {
                    viewModel.AutoProductBOMItem(param).then(function (res) {
                        $scope.filterModel.listBOMItemViewModel = res.data;
                    });
                }
            }

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
                    title: "Bom"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        if ($scope.filterModel.listBOMItemViewModel == undefined) {
                            $scope.filterModel.listBOMItemViewModel = $scope.filterModel.listBOMItemViewModel || []
                            $scope.filterModel.listBOMItemViewModel.push(angular.copy(param));
                        }
                        else if (param.rowItemIndex != undefined) {
                            $scope.filterModel.listBOMItemViewModel[param.rowItemIndex] = param;
                        }
                        else {
                            $scope.filterModel.listBOMItemViewModel.push(angular.copy(param));

                        }
                    }
                }
            };

            var init = function () {
                $scope.filterModel = {};

                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.dropdownwarehouse();
                $scope.dropdownDocumentType();
                $scope.dropdownProductconversion();
                // $scope.dropdownProductconversion2();
                $scope.dropdownItemStatus();
                $scope.dropdownWeight();
                $scope.dropdownVolume();

            };
            init();
        }
    })
})();