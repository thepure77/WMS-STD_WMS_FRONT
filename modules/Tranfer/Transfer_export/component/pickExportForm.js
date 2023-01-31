(function () {
    'use strict'

    app.component('pickExportForm', {
        controllerAs: '$vm',
        templateUrl: "modules/Tranfer/Transfer_export/component/pickExportForm.html",
        bindings: {
            isLoading: '=?',
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',

        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, planGoodsReceiveFactory, planGoodsReceiveItemFactory, planGoodsIssueItemFactory, ownerPopFactory, webServiceAPI, transferExportFactory, goodIssueFactory) {
            var $vm = this;

            var defer = {};
            var viewModel = planGoodsReceiveFactory;
            var _viewModel = planGoodsReceiveItemFactory
            var ownerModel = ownerPopFactory
            var __viewModel = transferExportFactory;
            $vm.isFilterTable = true;
            $scope.onShow = false;
            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });


            $scope.selectedTab = function (tab) {
                if (tab == 1) {
                    $scope.colortab1 = "#0d449d";
                    $scope.colortab2 = "#D3D3D3";
                    $scope.colortab3 = "#D3D3D3";
                }
                else if (tab == 2) {
                    $scope.colortab1 = "#D3D3D3";
                    $scope.colortab2 = "#0d449d";
                    $scope.colortab3 = "#D3D3D3";
                }
                else if (tab == 3) {
                    $scope.colortab1 = "#D3D3D3";
                    $scope.colortab2 = "#D3D3D3";
                    $scope.colortab3 = "#0d449d";
                }
                $scope.selected = tab;
            }

            $scope.selectedSubTab = function (subTab) {
                if (subTab == 1) {
                    $scope.colorsubtab1 = "#0d449d";
                    $scope.colorsubtab2 = "#D3D3D3";
                }
                else if (subTab == 2) {
                    $scope.colorsubtab1 = "#D3D3D3";
                    $scope.colorsubtab2 = "#0d449d";
                }
                $scope.subSelected = subTab;
                if ($scope.subSelected == 1) {
                    // $scope.Search();
                }
            }

            $vm.onShow = function (param) {
                defer = $q.defer();

                $scope.onShow = true;
                $scope.filterModel.planGoodsReceive_Date = getToday();
                $scope.filterModel.planGoodsReceive_Due_Date = getToday();
                $scope.filterModel.planGoodsReceive_Time = getTime();
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

                        var Round = $scope.dropdownRound
                        const resultsRound = Round.filter((Round) => {
                            return Round.round_Name == res.data.round_Name;
                        })
                        $scope.dropdownRound.model = resultsRound[0];

                        var TypeCar = $scope.dropdownTypeCar
                        const resultsTypeCar = TypeCar.filter((TypeCar) => {
                            return TypeCar.typeCar_Index == res.data.typeCar_Index;
                        })
                        $scope.dropdownTypeCar.model = resultsTypeCar[0];

                        var Transport = $scope.dropdownTransport
                        const resultsTransport = Transport.filter((Transport) => {
                            return Transport.transport_Index == res.data.transport_Index;
                        })
                        $scope.dropdownTransport.model = resultsTransport[0];

                        $scope.filterModel = res.data;
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
                    if ($scope.buttons.add) {
                        $scope.filterModel.planGoodsReceive_Date = getToday();
                        $scope.filterModel.planGoodsReceive_Due_Date = getToday();
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

            $scope.menu = [
                {
                    "step": "1",
                    "active": "active",
                    "completed": "",
                    "name": "Create Header"
                },
                {
                    "step": "2",
                    "active": "",
                    "completed": "",
                    "name": "Create Detail"
                },
                {
                    "step": "3",
                    "active": "",
                    "completed": "",
                    "name": "Preview"
                }
            ];


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
                var listmodel = $scope.filterModel.listPlanGoodsReceiveItemViewModel;
                if ($scope.dropdownwarehouse.model != null) {
                    $scope.filterModel.warehouse_Index = $scope.dropdownwarehouse.model.warehouse_Index;
                    $scope.filterModel.warehouse_Id = $scope.dropdownwarehouse.model.warehouse_Id;
                    $scope.filterModel.warehouse_Name = $scope.dropdownwarehouse.model.warehouse_Name;
                }

                if ($scope.dropdownRound.model != null) {
                    $scope.filterModel.round_Index = $scope.dropdownRound.model.round_Index;
                    $scope.filterModel.round_Id = $scope.dropdownRound.model.round_Id;
                    $scope.filterModel.round_Name = $scope.dropdownRound.model.round_Name;
                }

                if ($scope.dropdownDocumentType.model != null) {
                    $scope.filterModel.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
                    $scope.filterModel.documentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
                    $scope.filterModel.documentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
                }


                if ($scope.dropdownTransport.model != null) {
                    $scope.filterModel.transport_Index = $scope.dropdownTransport.model.transport_Index;
                    $scope.filterModel.transport_Id = $scope.dropdownTransport.model.transport_Id;
                    $scope.filterModel.transport_Name = $scope.dropdownTransport.model.transport_Name;
                }

                if ($scope.dropdownTypeCar.model != null) {
                    $scope.filterModel.typeCar_Index = $scope.dropdownTypeCar.model.typeCar_Index;
                    $scope.filterModel.typeCar_Id = $scope.dropdownTypeCar.model.typeCar_Id;
                    $scope.filterModel.typeCar_Name = $scope.dropdownTypeCar.model.typeCar_Name;
                }


                if ($scope.filterModel.owner_Name == undefined || $scope.filterModel.owner_Name == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'Please Choose Owner !'
                        }
                    )
                    return "";
                }

                if ($scope.dropdownwarehouse.model == null) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'Please Choose To Warehouse !'
                        }
                    )
                    return "";
                }

                if ($scope.filterModel.documentType_Name == undefined || $scope.filterModel.documentType_Index == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'Please Choose DocumentType !'
                        }
                    )
                    return "";
                }

                if ($scope.dropdownRound.model == null) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'Please Choose Round !'
                        }
                    )
                    return "";
                }

                if ($scope.dropdownTransport.model == null) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'Please Choose Transport !'
                        }
                    )
                    return "";
                }



                if ($scope.filterModel.listPlanGoodsReceiveItemViewModel == undefined) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Error',
                            message: 'Error: Add at least 1 Item'
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
                    model.create_By = localStorageService.get('userTokenStorage');

                    for (let index = 0; index < model.listPlanGoodsReceiveItemViewModel.length; index++) {
                        model.listPlanGoodsReceiveItemViewModel[index].uDF1 = model.planGoodsIssueNo;
                        model.listPlanGoodsReceiveItemViewModel[index].uDF4 = model.planGoodsIssueIndex;
                        model.listPlanGoodsReceiveItemViewModel[index].uDF5 = model.listPlanGoodsReceiveItemViewModel[index].planGoodsIssueItemIndex;
                    }
                    viewModel.add(model).then(
                        function success(res) {
                            $vm.filterModel = res.config.data;
                            $vm.searchResultModel = res.config.data;
                            $scope.filterModel = {};
                            $scope.dropdownwarehouse.model = {};
                            $scope.dropdownDocumentType.model = {};
                            $scope.dropdownRound.model = {};
                            $scope.dropdownItemStatus.model = {};
                            $scope.dropdownTypeCar.model = {};
                            $scope.dropdownTransport.model = {};
                            $scope.dropdownProductconversion.model = {};
                            $scope.filterModel.planGoodsReceive_Date = getToday();
                            $scope.filterModel.planGoodsReceive_Due_Date = getToday();
                            $scope.defaultStep();
                            defer.resolve();
                        },
                        function error(response) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'Error',
                                    message: 'Save Error'
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
                var listmodel = $scope.filterModel.listPlanGoodsReceiveItemViewModel;
                if (model.documentType_Name == undefined || model.documentType_Name == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'Please Choose DocumentType !'
                        }
                    )
                    return "";
                }
                if (model.planGoodsReceive_Date == undefined || model.planGoodsReceive_Date == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'Please Choose planGoodsReceiveDate !'
                        }
                    )
                    return "";
                }
                if (model.planGoodsReceive_Due_Date == undefined || model.planGoodsReceive_Due_Date == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'Please Choose planGoodsReceiveDueDate !'
                        }
                    )
                    return "";
                }

                for (let index = 0; index < model.listPlanGoodsReceiveItemViewModel.length; index++) {
                    model.listPlanGoodsReceiveItemViewModel[index].uDF1 = model.planGoodsIssueNo;
                }
                if (listmodel == undefined || listmodel.length == 0) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Error',
                            message: 'Error: Add at least 1 Item'
                        }
                    )
                    return "";
                }
                if (model.planGoodsReceive_Date == undefined || model.planGoodsReceive_Date == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'Please Choose Pre Receiving Date !'
                        }
                    )
                    return "";
                }
                if (model.planGoodsReceive_Due_Date == undefined || model.planGoodsReceive_Due_Date == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'Please Choose Due Date !'
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
                            $scope.dropdownItemStatus.model = {};
                            $scope.dropdownTypeCar.model = {};
                            $scope.dropdownTransport.model = {};
                            $scope.dropdownProductconversion.model = {};
                            $scope.filterModel.planGoodsReceive_Date = getToday();
                            $scope.filterModel.planGoodsReceive_Due_Date = getToday();
                            $scope.defaultStep();
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
                                    $scope.dropdownRound.model = {};
                                    $scope.dropdownItemStatus.model = {};
                                    $scope.dropdownTypeCar.model = {};
                                    $scope.dropdownTransport.model = {};
                                    $scope.dropdownProductconversion.model = {};
                                    $scope.filterModel.planGoodsReceive_Date = getToday();
                                    $scope.filterModel.planGoodsReceive_Due_Date = getToday();
                                    $scope.defaultStep();
                                    defer.resolve('-99');
                                },
                                function error(response) {
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
                $scope.userName = localStorageService.get('userTokenStorage');
            };

            $scope.back = function () {
                $scope.itemsReserve.formPgae = true;
                if ($scope.formPgae == "GI") {
                    __viewModel.setParam($scope.itemsReserve)
                    $state.go('wms.gi_summary', { a: "" });
                }

                if ($scope.formPage == "GT") {
                    $scope.itemsReserve.dataGT = $scope.dataGT;
                    __viewModel.setParam($scope.itemsReserve)
                    $state.go('wms.transfer_export_summary', { a: "" });
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

                if ($scope.dropdownItemStatus.model != null) {
                    param.itemStatus_Index = $scope.dropdownItemStatus.model.itemStatus_Index;
                    param.itemStatus_Id = $scope.dropdownItemStatus.model.itemStatus_Id;
                    param.itemStatus_Name = $scope.dropdownItemStatus.model.itemStatus_Name;
                }

                if ($scope.filterModel.product_Name == undefined || $scope.filterModel.product_Index == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'Please Choose Product !'
                        }
                    )
                    return "";
                }

                if ($scope.dropdownProductconversion.model == null) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'Please Choose Productconversion !'
                        }
                    )
                    return "";
                }

                if ($scope.filterModel.qty == undefined || $scope.filterModel.qty == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'Please Choose QTY !'
                        }
                    )
                    return "";
                }

                if ($scope.dropdownItemStatus.model == null) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'Please Choose Status !'
                        }
                    )
                    return "";
                }

                if ($scope.filterModel.listPlanGoodsReceiveItemViewModel == undefined) {
                    $scope.filterModel.listPlanGoodsReceiveItemViewModel = $scope.filterModel.listPlanGoodsReceiveItemViewModel || []
                    $scope.filterModel.listPlanGoodsReceiveItemViewModel.push(angular.copy(param));
                    $scope.filterModel.product_Id = null;
                    $scope.filterModel.product_Index = null;
                    $scope.filterModel.product_Name = null;
                    $scope.filterModel.qty = null;
                    $scope.dropdownProductconversion.model = null;
                    $scope.dropdownItemStatus.model = null;
                    $scope.filterModel.documentItem_Remark = null;
                    $scope.filterModel.weight = null;
                }
                else if ($scope.filterModel.rowItemIndex != undefined) {
                    $scope.filterModel.listPlanGoodsReceiveItemViewModel[param.rowItemIndex].product_Id = $scope.filterModel.product_Id;
                    $scope.filterModel.listPlanGoodsReceiveItemViewModel[param.rowItemIndex].product_Index = $scope.filterModel.product_Index;
                    $scope.filterModel.listPlanGoodsReceiveItemViewModel[param.rowItemIndex].product_Name = $scope.filterModel.product_Name;
                    $scope.filterModel.listPlanGoodsReceiveItemViewModel[param.rowItemIndex].qty = $scope.filterModel.qty;
                    $scope.filterModel.listPlanGoodsReceiveItemViewModel[param.rowItemIndex].productconversion_Index = param.productconversion_Index;
                    $scope.filterModel.listPlanGoodsReceiveItemViewModel[param.rowItemIndex].productconversion_Id = param.productconversion_Id;
                    $scope.filterModel.listPlanGoodsReceiveItemViewModel[param.rowItemIndex].productconversion_Name = param.productconversion_Name;
                    $scope.filterModel.listPlanGoodsReceiveItemViewModel[param.rowItemIndex].weight = $scope.filterModel.weight;
                    $scope.filterModel.listPlanGoodsReceiveItemViewModel[param.rowItemIndex].ratio = param.ratio;

                    $scope.filterModel.product_Id = null;
                    $scope.filterModel.product_Index = null;
                    $scope.filterModel.product_Name = null;
                    $scope.filterModel.qty = null;
                    $scope.filterModel.documentItem_Remark = null;
                    $scope.dropdownProductconversion.model = null;
                    $scope.dropdownItemStatus.model = null;
                    $scope.filterModel.weight = null;

                }
                else {
                    $scope.filterModel.listPlanGoodsReceiveItemViewModel.push(angular.copy(param));
                    $scope.filterModel.product_Id = null;
                    $scope.filterModel.product_Index = null;
                    $scope.filterModel.product_Name = null;
                    $scope.filterModel.qty = null;
                    $scope.filterModel.documentItem_Remark = null;
                    $scope.dropdownProductconversion.model = null;
                    $scope.dropdownItemStatus.model = null;
                    $scope.filterModel.documentItem_Remark = null;
                    $scope.filterModel.weight = null;
                }
                console.log($scope.filterModel.listPlanGoodsReceiveItemViewModel)
            }

            $scope.editItem = function (index) {

                $scope.index = index;

                var ItemStatus = $scope.dropdownItemStatus
                const resultsItemStatus = ItemStatus.filter((ItemStatus) => {
                    return ItemStatus.itemStatus_Index == $scope.filterModel.listPlanGoodsReceiveItemViewModel[index].itemStatus_Index;
                })
                $scope.dropdownItemStatus.model = resultsItemStatus[0];

                $scope.filterModel.product_Index = $scope.filterModel.listPlanGoodsReceiveItemViewModel[index].product_Index;
                $scope.filterModel.product_Id = $scope.filterModel.listPlanGoodsReceiveItemViewModel[index].product_Id;
                $scope.filterModel.product_Name = $scope.filterModel.listPlanGoodsReceiveItemViewModel[index].product_Name;
                $scope.filterModel.qty = $scope.filterModel.listPlanGoodsReceiveItemViewModel[index].qty;
                $scope.filterModel.weight = $scope.filterModel.listPlanGoodsReceiveItemViewModel[index].weight;
                $scope.filterModel.ratio = $scope.filterModel.listPlanGoodsReceiveItemViewModel[index].ratio;

                $scope.filterModel.documentItem_Remark = $scope.filterModel.listPlanGoodsReceiveItemViewModel[index].documentItem_Remark;
                $scope.filterModel.rowItemIndex = index;
            }


            $scope.deleteItem = function (param, index) {
                if ($scope.formPgae == "GI") {
                    pageLoading.show()
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'CONFIRM',
                        message: 'คุณต้องการลบรายการใช่หรือไม่'
                    }).then(function () {
                        goodIssueFactory.deletePickProduct(param).then(function (res) {
                            pageLoading.hide()
                            if (res.data) {
                                $scope.itemsReserve.item.splice(index, 1);
                                return dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: "ลบรายการสำเร็จ"
                                    }
                                )
                            } else {
                                return dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: "Error"
                                    }
                                )
                            }
                        },
                            function error(response) {

                            }
                        );
                    })
                }
                else if ($scope.formPage == "GT") {
                    pageLoading.show()
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'CONFIRM',
                        message: 'คุณต้องการลบรายการใช่หรือไม่'
                    }).then(function () {
                        param.create_By = $scope.userName;
                        param.ref_Document_Index = param.goodsTransfer_Index;
                        param.ref_DocumentItem_Index = param.goodsTransferItem_Index;
                        __viewModel.deletePickProduct(param).then(function (res) {
                            pageLoading.hide()
                            if (res.data) {
                                $scope.itemsReserve.item.splice(index, 1);
                                return dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: "ลบรายการสำเร็จ"
                                    }
                                )
                            } else {
                                return dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: "Error"
                                    }
                                )
                            }
                        },
                            function error(response) {

                            }
                        );
                    })
                }
            }


            $scope.autoComplete = {
                sku: "PickBinbalance/AutoCompleteProductId",
                product: "PickBinbalance/AutoCompleteProductName",
                productLot: "PickBinbalance/AutoCompleterProdctLot",
                goodsReceive: "PickBinbalance/AutoCompleteGoodsReceive",
                tag: "PickBinbalance/AutoCompleteTag",
                location: "Autocomplete/autoLocation",
            };

            $scope.url = {
                binBalance: webServiceAPI.BinBalance,
                Master: webServiceAPI.Master,
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
            $scope.dropdownItemStatus = function () {
                viewModel.dropdownItemStatus($scope.filterModel).then(function (res) {
                    $scope.dropdownItemStatus = res.data;
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

            // $scope.$watch("filterModel.product_Name", function () {


            //     if ($scope.filterModel.product_Id == "" || $scope.filterModel.product_Name == "") {
            //         $scope.dropdownProductconversion.model = {};
            //     }
            //     else {
            //         viewModel.dropdownProductconversion($scope.filterModel).then(function (res) {
            //             $scope.dropdownProductconversion = res.data;

            //             var Productconversion = $scope.dropdownProductconversion
            //             const resultsProductconversion = Productconversion.filter((Productconversion) => {
            //                 return Productconversion.productConversion_Index == $scope.filterModel.listPlanGoodsReceiveItemViewModel[$scope.index].productConversion_Index;
            //             })
            //             $scope.dropdownProductconversion.model = resultsProductconversion[0];
            //             $scope.filterModel.weight = $scope.filterModel.listPlanGoodsReceiveItemViewModel[$scope.index].weight;

            //         });
            //     }
            // });

            // $scope.$watch("filterModel.qty", function () {
            //     if ($scope.filterModel.qty != undefined) {
            //         $scope.filterModel.weight = $scope.filterModel.qty * $scope.dropdownProductconversion.model.productconversion_Weight;
            //     }

            // });

            $scope.defaultStep = function () {

                $scope.menu[0].active = "active";
                $scope.menu[0].completed = "";

                $scope.menu[0].active = "active";
                $scope.menu[0].completed = "";
                $scope.menu_width = 0 * 50;
                $scope.menu_name = $scope.menu[0].name;

                $scope.menu[1].active = "";
                $scope.menu[1].completed = "";
                $scope.menu_name = $scope.menu[1].name;

                $scope.menu[2].active = "";
                $scope.menu[2].completed = "";
                $scope.menu_name = $scope.menu[2].name;
            }

            $scope.next = function () {
                for (var i = 0; i < $scope.menu.length; i++) {
                    if ($scope.menu[i].active == "active") {
                        $scope.menu[i].active = "";
                        $scope.menu[i].completed = "completed";
                        i++;
                        $scope.menu[i].active = "active";
                        $scope.menu_width = i * 50; //กำหนดความกว้างของเส้นเชื่อม
                        $scope.menu_name = $scope.menu[i].name;
                    }
                }
            }

            $scope.test = function () {
                $scope.popupPick.onClick();
            }

            $scope.popupPick = {
                onShow: false,
                delegates: {},
                onClick: function (param) {debugger;
                    $scope.popupPick.onShow = !$scope.popupPick.onShow;
                    $scope.popupPick.delegates.set(param);
                },
                config: {
                    title: "manyToOne"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        if (!(!isNaN(parseFloat(param.Pick)) && angular.isNumber(parseFloat(param.Pick)))) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'กรุณาระบุจำนวนสินค้า'
                                }
                            )
                            return "";
                        } else {
                            if (parseFloat(param.Pick) <= 0) {
                                return dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'ALERT',
                                        message: "กรุณาระบุจำนวนสินค้า"
                                    }
                                )
                            }
                        }

                        pageLoading.show()
                        param.create_By = $scope.userName;
                        if ($scope.formPgae == "GI") {
                            // param.qty = null;
                            if ($scope.dataGiitem) {
                                debugger
                                if (((param.Pick * param.unit.productconversion_Ratio).toFixed(0)) > $scope.dataGiitem.qty && param.product_Id == $scope.dataGiitem.product_Id) {
                                    return dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'ALERT',
                                            message: "จำนวนที่หยิบ มากกว่า จำนวนที่สั่ง !!"
                                        }
                                    )
                                } else if (param.product_Id == $scope.dataGiitem.product_Id) {
                                    param.qty = $scope.dataGiitem.qty;
                                    param.ref_Document_Index = $scope.dataGiitem.planGoodsIssue_Index;
                                    param.ref_DocumentItem_Index = $scope.dataGiitem.planGoodsIssueItem_Index;
                                    param.ref_Document_LineNum = $scope.dataGiitem.planGoodsIssue_LineNum;
                                    param.ref_Document_No = $scope.dataGiitem.planGoodsIssue_No;
                                }
                            }
                            param.goodsIssue_Index = $scope.dataGi.goodsIssue_Index;
                            param.goodsIssue_No = $scope.dataGi.goodsIssue_No;
                            param.goodsIssue_Date = $scope.dataGi.goodsIssue_Date;
                            param.goodsIssue_Due_Date = $scope.dataGi.goodsIssue_Due_Date;
                            param.goodsIssue_Time = $scope.dataGi.goodsIssue_Time;
                            param.owner_Index = $scope.dataGi.owner_Index;
                            param.owner_Id = $scope.dataGi.owner_Id;
                            param.owner_Name = $scope.dataGi.owner_Name;
                            param.documentType_Index = $scope.dataGi.documentType_Index;
                            param.documentType_Id = $scope.dataGi.documentType_Id;
                            param.documentType_Name = $scope.dataGi.documentType_Name;
                            param.document_Remark = $scope.dataGi.document_Remark;
                            param.documentRef_No1 = $scope.dataGi.documentRef_No1;
                            goodIssueFactory.pickProduct(param).then(function (res) {
                                pageLoading.hide()
                                if (res.data.resultIsUse) {
                                    $scope.itemsReserve.item = $scope.itemsReserve.item || [];
                                    $scope.itemsReserve.item.push(angular.copy(res.data.items));
                                    $scope.Search();
                                } else {
                                    $scope.Search();
                                    return dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'แจ้งเตือน',
                                            message: res.data.resultMsg
                                        }
                                    )
                                }
                            },
                                function error(response) {

                                }
                            );
                        }
                        else if ($scope.formPage == "GT") {
                            if ($scope.dataGT) {
                                debugger
                                if ((param.Pick * param.unit.productconversion_Ratio).toFixed(6) > (param.qty)) {
                                    return dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'ALERT',
                                            message: "จำนวนที่หยิบ มากกว่า จำนวนที่สั่ง !!"
                                        }
                                    )
                                }
                            }

                            param.goodsTransfer_Index = $scope.dataGT.goodsTransfer_Index;
                            param.goodsTransfer_No = $scope.dataGT.goodsTransfer_No;
                            param.goodsTransfer_Date = $scope.dataGT.goodsTransfer_Date;
                            param.goodsTransfer_Time = $scope.dataGT.goodsTransfer_Time;
                            param.owner_Index = $scope.dataGT.owner_Index;
                            param.owner_Id = $scope.dataGT.owner_Id;
                            param.owner_Name = $scope.dataGT.owner_Name;
                            param.documentType_Index = $scope.dataGT.documentType_Index;
                            param.documentType_Id = $scope.dataGT.documentType_Id;
                            param.documentType_Name = $scope.dataGT.documentType_Name;
                            // param.document_Remark = $scope.dataGt.document_Remark;
                            // param.documentRef_No1 = $scope.dataGt.documentRef_No1;
                            param.operations = "PICK";
                            transferExportFactory.pickProduct(param).then(function (res) {
                                pageLoading.hide()
                                if (res.data.resultIsUse) {
                                    $scope.itemsReserve.item = $scope.itemsReserve.item || [];
                                    $scope.itemsReserve.item.push(angular.copy(res.data.items));
                                    $scope.Search();
                                } else {
                                    $scope.Search();
                                    return dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'แจ้งเตือน',
                                            message: res.data.resultMsg
                                        }
                                    )
                                }
                            },
                                function error(response) {

                                }
                            );
                        }
                    }
                }
            };

            $scope.previous = function () {
                for (var i = 0; i < $scope.menu.length; i++) {
                    if ($scope.menu[i].active == "active") {
                        $scope.menu[i].active = "";
                        $scope.menu[i].completed = "";

                        i--;
                        $scope.menu[i].active = "active";
                        $scope.menu[i].completed = "";
                        $scope.menu_width = i * 50; //กำหนดความกว้างของเส้นเชื่อม
                        $scope.menu_name = $scope.menu[i].name;
                    }
                }
            }

            $scope.dropdownWarehouse = function () {
                __viewModel.dropdownWarehouse({}).then(function (res) {
                    $scope.dropdownWarehouse = res.data;
                });
            };

            $scope.dropdownZone = function () {
                __viewModel.dropdownZone({}).then(function (res) {
                    $scope.dropdownZone = res.data;
                });
            };

            // $scope.dropdownLocation = function () {
            //     __viewModel.dropdownLocation({}).then(function (res) {
            //         $scope.dropdownLocation = res.data;
            //     });
            // };

            $scope.dropdownItemStatus = function () {
                __viewModel.dropdownItemStatus({}).then(function (res) {
                    $scope.dropdownItemStatus = res.data;
                });
            };

            $scope.dropdownProductType = function () {
                __viewModel.dropdownProductType({}).then(function (res) {
                    $scope.dropdownProductType = res.data;
                });
            };

            $scope.Search = function () {
                pageLoading.show()
                var model = $scope.selected == 1 ? $scope.filterModel : $scope.selected == 2 ? $scope.filterModel2 : $scope.filterModel3;
                __viewModel.filterBinbalance(model).then(function (res) {
                    pageLoading.hide()
                    $scope.items = res.data.items;
                    $scope.filterModel.checkAll_ = false;
                },
                    function error(response) {

                    }
                );
            }

            $scope.Confirm = function () {
                $scope.itemsReserve.formPgae = true;
                $scope.itemsReserve.dataGT = $scope.dataGT;
                angular.forEach($scope.itemsReserve.item, function (v, k) {
                    //$vm.searchResultModel[k].selected = true;
                    $scope.itemsReserve.item[k].location_Index_To = $scope.itemsReserve.item[k].location_Index;
                    $scope.itemsReserve.item[k].location_Id_To = $scope.itemsReserve.item[k].location_Id;
                    $scope.itemsReserve.item[k].location_Name_To = $scope.itemsReserve.item[k].location_Name;
                    $scope.itemsReserve.item[k].itemStatus_Index = $scope.itemsReserve.item[k].status_Index;
                    $scope.itemsReserve.item[k].itemStatus_Id = $scope.itemsReserve.item[k].status_Id;
                    $scope.itemsReserve.item[k].itemStatus_Name = $scope.itemsReserve.item[k].status_Name;
                    $scope.itemsReserve.item[k].itemStatus_Index_To = $scope.itemsReserve.item[k].status_Index;
                    $scope.itemsReserve.item[k].itemStatus_Id_To = $scope.itemsReserve.item[k].status_Id;
                    $scope.itemsReserve.item[k].itemStatus_Name_To = $scope.itemsReserve.item[k].status_Name;
                    $scope.itemsReserve.item[k].erp_Location_To = $scope.itemsReserve.item[k].erp_Location;
                });


                __viewModel.setParam($scope.itemsReserve)
                if ($scope.formPgae == "GI") {
                    $state.go('wms.gi_summary', { a: "" });
                }
                else if ($scope.formPage == "GT") {
                    if ($scope.dataGT.listGoodsTransferItemViewModel == undefined) {
                        $scope.dataGT.listGoodsTransferItemViewModel = {};
                        $scope.dataGT.listGoodsTransferItemViewModel = $scope.itemsReserve.item;
                    } else {
                        if ($scope.itemsReserve.item != undefined) {
                            $scope.itemsReserve.item.forEach(c => $scope.dataGT.listGoodsTransferItemViewModel.push(angular.copy(c)));

                        }
                    }
                    $state.go('wms.transfer_export_summary', {});
                }

            }

            $scope.ok = function () {
                if ($scope.items.length == 0) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: "กรุณาเลือกสินค้า"
                        }
                    )
                }
                pageLoading.show()
                let obj = { items: $scope.items.filter(f => f.selected), create_By: $scope.userName };
                obj.items.map((param) => {
                    param.goodsTransfer_Index = $scope.dataGT.goodsTransfer_Index;
                    param.goodsTransfer_No = $scope.dataGT.goodsTransfer_No;
                    param.goodsTransfer_Date = $scope.dataGT.goodsTransfer_Date;
                    param.goodsTransfer_Time = $scope.dataGT.goodsTransfer_Time;
                    param.owner_Index = $scope.dataGT.owner_Index;
                    param.owner_Id = $scope.dataGT.owner_Id;
                    param.owner_Name = $scope.dataGT.owner_Name;
                    param.documentType_Index = $scope.dataGT.documentType_Index;
                    param.documentType_Id = $scope.dataGT.documentType_Id;
                    param.documentType_Name = $scope.dataGT.documentType_Name;
                    return param
                })
                transferExportFactory.ListPickProduct(obj).then(function (res) {
                    pageLoading.hide()

                    if (res.data.resultIsUse) {
                        $scope.itemsReserve.item = $scope.itemsReserve.item || [];
                        res.data.listitems.forEach(element => {
                            $scope.itemsReserve.item.push(angular.copy(element));
                        });
                        $scope.itemsReserve.item.map((number) => {
                            number.pick = number.qty;
                            return number
                        })
                        $scope.Search();
                    } else {
                        $scope.Search();
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: res.data.resultMsg
                            }
                        )
                    }
                },
                    function error(response) {

                    }
                );
            }

            $scope.detectCheckAll = function (parm) {
                if (parm === true) {
                    angular.forEach($scope.items, function (v, k) {
                        $scope.items[k].selected = true;
                    });
                } else {
                    angular.forEach($scope.items, function (v, k) {
                        $scope.items[k].selected = false;
                    });
                }
            }

            var init = function () {
                $scope.filterModel = {};
                $scope.filterModel2 = {};
                $scope.filterModel3 = {};
                $scope.itemsReserve = {};
                // $scope.selected = 1;
                // $scope.subSelected = 1;
                $scope.selectedTab(1);
                $scope.selectedSubTab(1);
                $scope.userName = localStorageService.get('userTokenStorage');
                // $scope.dropdownwarehouse();
                // $scope.dropdownDocumentType();
                // $scope.dropdownRound();
                // $scope.dropdownItemStatus();
                // $scope.dropdownTypeCar();
                // $scope.dropdownTransport();
                // $scope.dropdownProductconversion();
                $scope.dropdownWarehouse();
                $scope.dropdownZone();
                // $scope.dropdownLocation();
                $scope.dropdownItemStatus();
                $scope.dropdownProductType();
                $scope.dataGi = goodIssueFactory.getParam();
                $scope.dataGT = transferExportFactory.getParam();
                if ($scope.dataGi) {
                    $scope.formPgae = $scope.dataGi.formPage;
                    $scope.dataGiitem = goodIssueFactory.getParamitem();
                    if ($scope.dataGiitem) {
                        $scope.filterModel.product_Index = $scope.dataGiitem.product_Index;
                        $scope.filterModel.product_Id = $scope.dataGiitem.product_Id;
                        $scope.filterModel.product_Name = $scope.dataGiitem.product_Name;
                        $scope.filterModel.product_Lot = $scope.dataGiitem.product_Lot;
                        $scope.filterModel.erp_Location = $scope.dataGiitem.erp_Location;
                    }
                    $scope.filterModel.owner_Index = $scope.dataGi.owner_Index;
                    $scope.filterModel.owner_Id = $scope.dataGi.owner_Id;
                    $scope.filterModel.owner_Name = $scope.dataGi.owner_Name;
                    $scope.filterModel2.owner_Index = $scope.dataGi.owner_Index;
                    $scope.filterModel2.owner_Id = $scope.dataGi.owner_Id;
                    $scope.filterModel2.owner_Name = $scope.dataGi.owner_Name;
                    $scope.filterModel3.owner_Index = $scope.dataGi.owner_Index;
                    $scope.filterModel3.owner_Id = $scope.dataGi.owner_Id;
                    $scope.filterModel3.owner_Name = $scope.dataGi.owner_Name;
                }
                else if ($scope.dataGT) {
                    $scope.formPage = $scope.dataGT.formPage;
                    $scope.filterModel.owner_Index = $scope.dataGT.owner_Index;
                    $scope.filterModel.owner_Id = $scope.dataGT.owner_Id;
                    $scope.filterModel.owner_Name = $scope.dataGT.owner_Name;
                    $scope.filterModel2.owner_Index = $scope.dataGT.owner_Index;
                    $scope.filterModel2.owner_Id = $scope.dataGT.owner_Id;
                    $scope.filterModel2.owner_Name = $scope.dataGT.owner_Name;
                    $scope.filterModel3.owner_Index = $scope.dataGT.owner_Index;
                    $scope.filterModel3.owner_Id = $scope.dataGT.owner_Id;
                    $scope.filterModel3.owner_Name = $scope.dataGT.owner_Name;
                    // $scope.filterModel.isUseDocumentType = $scope.dataGT.isUseDocumentType;
                }

            };
            init();

        }
    })
})();