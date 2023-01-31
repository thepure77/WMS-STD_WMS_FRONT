(function () {
    'use strict'

    app.component('giForm', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/GI/component/giForm.html",
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',
            isLoading: '=?',
        },
        controller: function ($scope, $q, pageLoading, dpMessageBox, goodIssueFactory, goodsIssueItemFactory, webServiceAPI, localStorageService, $state, transferFactory) {
            var $vm = this;
            var defer = {};
            var viewModel = goodIssueFactory;
            var viewItemModel = goodsIssueItemFactory;
            // $scope.filterModel = {};
            //$scope.filterModel.listGoodsIssueItemViewModel = $scope.filterModel.listGoodsIssueItemViewModel || [];

            $vm.isFilterTable = true;
            $scope.onShow = false;
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

            $scope.selectedTabTable = function (t) {
                if (t == 1) {
                    $scope.colortable1 = "#999999";
                    $scope.colortable2 = "#e5e5e5";
                    $scope.colortable3 = "#e5e5e5";
                }
                else if (t == 2) {
                    $scope.colortable1 = "#e5e5e5";
                    $scope.colortable2 = "#999999";
                    $scope.colortable3 = "#e5e5e5";
                }
                else if (t == 3) {
                    $scope.colortable1 = "#e5e5e5";
                    $scope.colortable2 = "#e5e5e5";
                    $scope.colortable3 = "#999999";
                }
                $scope.selectedTable = t;
            }


            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });

            $scope.popupPlanGi = {
                onShow: false,
                delegates: {},
                onClick: function (param) {
                    let msg = "";
                    if (!$scope.dropdownDocumentType.model) {
                        msg += 'กรุณาเลือกทะเบียนประเภทเอกสาร,'
                    }
                    else if (!$scope.dropdownDocumentType.model.documentType_Index) {
                        msg += 'กรุณาเลือกทะเบียนประเภทเอกสาร,'
                    }

                    if (!isGuid($scope.filterModel.owner_Index)) {
                        msg += ",กรุณาเลือกเจ้าของสินค้า";
                    }

                    $scope.dropdownOwner.model = $scope.dropdownOwner.find(f => f.owner_Index == $scope.filterModel.owner_Index);
                    // if (!$scope.dropdownOwner.model) {
                    //     msg += 'กรุณาเลือกเจ้าของสินค้า,'
                    // }
                    // else if (!$scope.filterModel.owner_Index) {
                    //     msg += 'กรุณาเลือกเจ้าของสินค้า,'
                    // }
                    if (msg != "") {
                        let listmsg = msg.split(',');
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                messageNewLine: listmsg
                            }
                        )
                    }
                    else {
                        $scope.popupPlanGi.onShow = !$scope.popupPlanGi.onShow;
                        $scope.popupPlanGi.delegates.planGiPopup($scope.dropdownDocumentType.model, $scope.dropdownOwner.model);
                    }
                },
                config: {
                    title: "PlanGI"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.ChangeDocumentType = $scope.dropdownDocumentType.model;
                        $scope.ChangeOwner = $scope.dropdownOwner.model;
                        if ($scope.dropdownDocumentType.model.documentType_Index != "d7c596e9-bdff-4759-91db-fcec709e16b8") {
                            if ($scope.filterModel.ischkPopupGi) {
                                var groups = $scope.filterModel.listGoodsIssueItemViewModel.reduce(function (obj, item) {
                                    obj[item.planGoodsIssueItem_Index] = obj[item.planGoodsIssueItem_Index] || [];
                                    obj[item.planGoodsIssueItem_Index].push(item.planGoodsIssueItem_Index);
                                    return obj;
                                }, {});
                                var myArray = Object.keys(groups).map(function (key) {
                                    return { team: key };
                                });
                                if (myArray.length > 0) {
                                    myArray.forEach(function (v) {
                                        angular.forEach(param, function (vvv, kkk) {
                                            var splice = param[kkk].itemDetail.filter(c => c.planGoodsIssueItem_Index == v.team)
                                            angular.forEach(splice, function (vv, kk) {
                                                var indexof = param[kkk].itemDetail.indexOf(vv)
                                                param[kkk].itemDetail.splice(indexof, 1)
                                            });
                                        })
                                    });
                                }
                                param.forEach(function (p) {
                                    p.itemDetail.forEach(function (i) {
                                        i.planGoodsIssue_Index = p.planGoodsIssue_Index;
                                        i.planGoodsIssue_No = p.planGoodsIssue_No;
                                        i.ref_Document_No = p.planGoodsIssue_No;
                                        i.warehouse_Index_To = p.warehouse_Index_To
                                        i.warehouse_Id_To = p.warehouse_Id_To
                                        i.warehouse_Name_To = p.warehouse_Name_To
                                        $scope.filterModel.listGoodsIssueItemViewModel.push(i);
                                    })
                                });
                            }
                            else {
                                $scope.filterModel.listGoodsIssueItemViewModel = $scope.filterModel.listGoodsIssueItemViewModel || [];
                                param.forEach(function (p) {
                                    p.itemDetail.forEach(function (i) {
                                        i.planGoodsIssue_Index = p.planGoodsIssue_Index;
                                        i.planGoodsIssue_No = p.planGoodsIssue_No;
                                        i.ref_Document_No = p.planGoodsIssue_No;
                                        i.warehouse_Index_To = p.warehouse_Index_To
                                        i.warehouse_Id_To = p.warehouse_Id_To
                                        i.warehouse_Name_To = p.warehouse_Name_To
                                        $scope.filterModel.listGoodsIssueItemViewModel.push(i);
                                    })
                                });
                                $scope.filterModel.ischkPopupGi = true;
                            }
                        }
                        else {
                            if ($scope.filterModel.ischkPopupGi) {
                                var groups = $scope.filterModel.listGoodsIssueItemBomViewModel.reduce(function (obj, item) {
                                    obj[item.bomItem_Index] = obj[item.bomItem_Index] || [];
                                    obj[item.bomItem_Index].push(item.bomItem_Index);
                                    return obj;
                                }, {});
                                var myArray = Object.keys(groups).map(function (key) {
                                    return { team: key };
                                });
                                if (myArray.length > 0) {
                                    myArray.forEach(function (v) {
                                        angular.forEach(param, function (vvv, kkk) {
                                            var splice = param[kkk].listBomItemViewModel.filter(c => c.bomItem_Index == v.team)
                                            angular.forEach(splice, function (vv, kk) {
                                                var indexof = param[kkk].listBomItemViewModel.indexOf(vv)
                                                param[kkk].listBomItemViewModel.splice(indexof, 1)
                                            });
                                        })
                                    });
                                }
                                param.forEach(function (p) {
                                    p.listBomItemViewModel.forEach(function (i) {
                                        i.BOM_Index = p.BOM_Index;
                                        i.BOM_No = p.BOM_No;
                                        i.ref_Document_No = p.bom_No;
                                        i.warehouse_Index_To = p.warehouse_Index_To
                                        i.warehouse_Id_To = p.warehouse_Id_To
                                        i.warehouse_Name_To = p.warehouse_Name_To
                                        $scope.filterModel.listGoodsIssueItemBomViewModel.push(i);
                                    })
                                });
                            }
                            else {
                                $scope.filterModel.listGoodsIssueItemBomViewModel = $scope.filterModel.listGoodsIssueItemBomViewModel || [];
                                param.forEach(function (p) {
                                    p.listBomItemViewModel.forEach(function (i) {
                                        i.BOM_Index = p.BOM_Index;
                                        i.BOM_No = p.BOM_No;
                                        i.ref_Document_No = p.bom_No;
                                        i.warehouse_Index_To = p.warehouse_Index_To
                                        i.warehouse_Id_To = p.warehouse_Id_To
                                        i.warehouse_Name_To = p.warehouse_Name_To
                                        $scope.filterModel.listGoodsIssueItemBomViewModel.push(i);
                                    })
                                });
                                $scope.filterModel.ischkPopupGi = true;
                            }
                        }
                    }
                }
            };

            $scope.invoiceNoGIPopup = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.invoiceNoGIPopup.onShow = !$scope.invoiceNoGIPopup.onShow;
                    $scope.invoiceNoGIPopup.delegates(param, index);
                },
                config: {
                    title: "Import Reference Information"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.listGoodsIssueItemViewModel.map(function (e) {
                            if (e.goodsIssueItemLocation_Index == param.goodsIssueItemLocation_Index) {
                                e.invoice_No = param.invoice_No;
                                e.declaration_No = param.declaration_No;
                                e.invoice_No_Out = param.invoice_No_Out;
                                e.declaration_No_Out = param.declaration_No_Out;
                                e.hs_Code = param.hs_Code;
                                e.conutry_of_Origin = param.conutry_of_Origin;

                                e.tax1 = param.tax1;
                                e.tax1_Currency_Index = param.tax1_Currency_Index;
                                e.tax1_Currency_Id = param.tax1_Currency_Id;
                                e.tax1_Currency_Name = param.tax1_Currency_Name;

                                e.tax2 = param.tax2;
                                e.tax2_Currency_Index = param.tax2_Currency_Index;
                                e.tax2_Currency_Id = param.tax2_Currency_Id;
                                e.tax2_Currency_Name = param.tax2_Currency_Name;

                                e.tax3 = param.tax3;
                                e.tax3_Currency_Index = param.tax3_Currency_Index;
                                e.tax3_Currency_Id = param.tax3_Currency_Id;
                                e.tax3_Currency_Name = param.tax3_Currency_Name;

                                e.tax4 = param.tax4;
                                e.tax4_Currency_Index = param.tax4_Currency_Index;
                                e.tax4_Currency_Id = param.tax4_Currency_Id;
                                e.tax4_Currency_Name = param.tax4_Currency_Name;
                                return e;
                            }
                        })
                    }
                }
            };

            // async function getOwner() {
            //     await viewModel.getOwner({}).then(function (res) {
            //         $scope.filterModel.owner_Index = res.data[0].owner_Index;
            //         $scope.filterModel.owner_Id = res.data[0].owner_Id;
            //         $scope.filterModel.owner_Name = res.data[0].owner_Name;
            //     });
            // };

            $vm.onShow = function (param) {
                defer = $q.defer();
                $scope.onShow = true;
                $scope.filterModel.goodsIssue_Date = getToday();
                $scope.filterModel.goodsIssue_Time = getTime();
                $scope.filterModel.document_Date = getToday();
                $scope.colortable1 = "#999999";
                $scope.colortable2 = "#e5e5e5";
                $scope.colortable3 = "#e5e5e5";
                $scope.selectedTable = 1;
                $scope.isDeleteitem = false;
                // $scope.log_udf_2 = getToday();
                // $scope.log_udf_3 = getTime();
                // getOwner();
                if (param != undefined) {
                    pageLoading.show()
                    if (!$scope.chkpick) {
                        viewModel.find(param.goodsIssue_Index).then(function (res) {
                            $scope.chkpick = false;

                            var documentType = $scope.dropdownDocumentType
                            const resultsDocumentType = documentType.filter((documentType) => {
                                return documentType.documentType_Index == res.data.documentType_Index;
                            })
                            $scope.dropdownDocumentType.model = resultsDocumentType[0];

                            var Warehouse = $scope.dropdownWarehouse
                            const resultsWarehouse = Warehouse.filter((Warehouse) => {
                                return Warehouse.warehouse_Index == res.data.warehouse_Index;
                            })
                            $scope.dropdownWarehouse.model = resultsWarehouse[0];

                            var Owner = $scope.dropdownOwner
                            const resultsOwner = Owner.filter((Owner) => {
                                return Owner.owner_Index == res.data.owner_Index;
                            })
                            $scope.dropdownOwner.model = resultsOwner[0];

                            $scope.filterModel = res.data;

                            $scope.buttons.add = false;
                            $scope.buttons.update = true;

                            $scope.filterModel.operations = "EDIT "+ $scope.filterModel.goodsIssue_No;

                            $scope.isDeleteitem = $scope.filterModel.document_Status != 0 ? true : false;

                            if ($scope.filterModel.document_Status == -2) {
                                $scope.buttons.add = true;
                                $scope.buttons.update = false;

                                // $scope.filterModel.operations = "ADD";
                            }
                            viewItemModel.find($scope.filterModel.goodsIssue_Index).then(function (res) {

                                pageLoading.hide()
                                if ($scope.dropdownDocumentType.model.documentType_Index != "d7c596e9-bdff-4759-91db-fcec709e16b8") {
                                    $scope.filterModel.listGoodsIssueItemViewModel = res.data;
                                }
                                else if ($scope.dropdownDocumentType.model.documentType_Index == "d7c596e9-bdff-4759-91db-fcec709e16b8") {
                                    $scope.filterModel.listGoodsIssueItemBomViewModel = res.data;
                                }
                            });
                        });
                    }
                    else {
                        $scope.selectedTabTable(2);
                    }

                }
                else {
                    $scope.buttons.add = true;
                    if ($scope.buttons.add) {
                        $scope.filterModel.goodsIssue_Date = getToday();
                        $scope.filterModel.goodsIssue_Due_Date = getToday();
                        $scope.filterModel.document_Date = getToday();
                        $scope.dropdownWarehouse.model = $scope.dropdownWarehouse[0];
                        $scope.filterModel.owner_Index = '02b31868-9d3d-448e-b023-05c121a424f4';
                        $scope.filterModel.owner_Name = 'Amazon';
                        $scope.filterModel.owner_Id = '3419';
                    }
                    $scope.buttons.update = false;

                    $scope.filterModel.operations = "ADD";
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

            $scope.back = function () {
                $scope.deleteuser = {};
                if ($scope.filterModel.goodsIssue_Index != undefined) {
                    let dataitem = $scope.filterModel.listGoodsIssueItemViewModel != undefined ? $scope.filterModel.listGoodsIssueItemViewModel.filter(f => !f.isDelete && f.document_Status == -2) : [];
                    let dataitem2 = $scope.filterModel.listGoodsIssueItemBomViewModel != undefined ? $scope.filterModel.listGoodsIssueItemBomViewModel.filter(f => !f.isDelete && f.document_Status == -2) : [];
                    if (dataitem.length > 0) {
                        let obj = {};
                        obj.items = dataitem;
                        viewModel.ListdeletePickProduct(obj).then(function (res) {
                        });
                    }
                    else if (dataitem2.length > 0) {
                        let obj = {};
                        obj.items = dataitem2;
                        viewModel.ListdeletePickProduct(obj).then(function (res) {
                        });
                    }
                    $scope.deleteuser.goodsIssue_Index = $scope.filterModel.goodsIssue_Index;
                    // viewModel.deleteUserAssign($scope.deleteuser).then(
                    //     function success(results) {
                    $scope.filterModel = {};
                    $scope.dropdownDocumentType.model = {};
                    $scope.dropdownOwner.model = {};
                    $scope.dropdownDocumentTypeWave.model = {};
                    $scope.dropdownWarehouse.model = {};
                    $scope.chkpick = false;
                    $scope.defaultStep();
                    defer.resolve();
                    //     }
                    // );
                }
                else {
                    $scope.filterModel = {};
                    $scope.dropdownDocumentType.model = {};
                    $scope.dropdownOwner.model = {};
                    $scope.dropdownDocumentTypeWave.model = {};
                    $scope.dropdownWarehouse.model = {};
                    $scope.chkpick = false;
                    $scope.defaultStep();
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

            $scope.getcolor = function (param) {
                let total = $scope.filterModel.listGoodsIssueItemViewModel.filter(c => c.ref_DocumentItem_Index == param.ref_DocumentItem_Index).reduce(function (a, b) {
                    return a + b.totalQty
                }, 0);
                let totalqty = $scope.filterModel.listGoodsIssueItemViewModel.filter(c => c.ref_DocumentItem_Index == param.ref_DocumentItem_Index)
                if (totalqty[0].qtyPlan == total && param.binBalance_Index) {
                    return "#54FF9F";
                }
                else if (totalqty[0].qtyPlan > total && param.binBalance_Index) {
                    return "#FFD700";
                }
            }

            $scope.edit = function () {
                pageLoading.hide()
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยัน',
                    message: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่'
                }).then(function () {
                    $scope.filterModel.create_By = localStorageService.get('userTokenStorage');
                    // $scope.filterModel.operations = "UPDATE";
                    pageLoading.show()
                    viewModel.updateStatusAddData($scope.filterModel).then(
                        function success(res) {
                            pageLoading.hide()
                            $scope.filterModel = {};
                            $scope.dropdownDocumentType.model = {};
                            $scope.dropdownOwner.model = {};
                            $scope.dropdownDocumentTypeWave.model = {};
                            $scope.dropdownWarehouse.model = {};
                            $scope.chkpick = false;
                            $scope.defaultStep();
                            defer.resolve();
                        },
                        function error(response) {
                            pageLoading.hide()
                        });
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

            $scope.add = function () {
                let msg = "";
                // $scope.filterModel.log_udf_2 =$scope.log_udf_2;
                // $scope.filterModel.log_udf_3 =$scope.log_udf_3;
                // $scope.filterModel.log_udf_4 =getToday();
                // $scope.filterModel.log_udf_5 =getTime();

                if (!$scope.dropdownWarehouse.model) {
                    msg += ",กรุณาเลือกคลังสินค้า";
                    $scope.filterModel.warehouse_Index = null;
                    $scope.filterModel.warehouse_Id = null;
                    $scope.filterModel.warehouse_Name = null;
                }
                else {
                    $scope.filterModel.warehouse_Index = $scope.dropdownWarehouse.model.warehouse_Index;
                    $scope.filterModel.warehouse_Id = $scope.dropdownWarehouse.model.warehouse_Id;
                    $scope.filterModel.warehouse_Name = $scope.dropdownWarehouse.model.warehouse_Name;
                }

                if (msg != "") {
                    let listmsg = msg.split(',');
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            messageNewLine: listmsg
                        }
                    )
                }
                else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'ยืนยัน',
                        message: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่'
                    }).then(function () {
                        // viewModel.Check_Budget_Auto($scope.filterModel).then(
                        //     function success(res) {
                        //         if (!res.data) {
                        //             return dpMessageBox.alert(
                        //                 {
                        //                     ok: 'Close',
                        //                     title: 'แจ้งเตือน',
                        //                     message: 'Budget ไม่พอ '
                        //                 }
                        //             )
                        //         } else {
                                    $scope.filterModel.create_By = localStorageService.get('userTokenStorage');
                                    // $scope.filterModel.operations = "UPDATE";
                                    pageLoading.show()
                                    // viewItemModel.find($scope.filterModel.goodsIssue_Index).then(function (res) {
                                    if ($scope.dropdownDocumentType.model.documentType_Index != "d7c596e9-bdff-4759-91db-fcec709e16b8") {
                                        $scope.filterModel.listGoodsIssueItemViewModel = $scope.filterModel.listGoodsIssueItemViewModel.filter(f => f.binBalance_Index);
                                    }
                                    else if ($scope.dropdownDocumentType.model.documentType_Index == "d7c596e9-bdff-4759-91db-fcec709e16b8") {
                                        $scope.filterModel.listGoodsIssueItemViewModel = $scope.filterModel.listGoodsIssueItemBomViewModel.filter(f => f.binBalance_Index);
                                    }
                                    $scope.filterModel.isUpdate = $scope.buttons.update;
                                    debugger
                                    viewModel.updateStatusAddData($scope.filterModel).then(
                                        function success(res) {
                                            debugger;
                                            // viewModel.savelogsRequest($scope.filterModel).then(function () {
                                            // });
                                            pageLoading.hide()
                                            $scope.filterModel = {};
                                            $scope.dropdownDocumentType.model = {};
                                            $scope.dropdownOwner.model = {};
                                            $scope.dropdownDocumentTypeWave.model = {};
                                            $scope.dropdownWarehouse.model = {};
                                            $scope.chkpick = false;
                                            $scope.defaultStep();
                                            defer.resolve();
                                        },
                                        function error(response) {
                                            pageLoading.hide()
                                        });
                            //     }
                            // });

                        // });
                    });
                }
            }

            $scope.buttons = {
                add: true,
                update: false,
                back: true
            };

            $scope.dropdownDocumentType = function () {
                viewModel.dropdownDocumentType($scope.filterModel).then(function (res) {
                    $scope.dropdownDocumentType = res.data;
                    if ($scope.filterModel) {
                        $scope.dropdownDocumentType.model = $scope.dropdownDocumentType.find(c => c.documentType_Index == $scope.filterModel.documentType_Index)
                    }
                });
            };
            $scope.dropdownDocumentTypeWave = function () {
                viewModel.dropdownDocumentTypeWave($scope.filterModel).then(function (res) {
                    $scope.dropdownDocumentTypeWave = res.data;
                });
            };
            $scope.dropdownWarehouse = function () {
                viewModel.dropdownWarehouse($scope.filterModel).then(function (res) {
                    $scope.dropdownWarehouse = res.data;
                    if ($scope.filterModel) {
                        $scope.dropdownWarehouse.model = $scope.dropdownWarehouse.find(c => c.warehouse_Index == $scope.filterModel.warehouse_Index)
                    }

                });
            };
            $scope.dropdownOwner = function () {
                viewModel.dropdownOwner($scope.filterModel).then(function (res) {
                    $scope.dropdownOwner = res.data;
                    if ($scope.filterModel) {
                        $scope.dropdownOwner.model = $scope.dropdownOwner.find(c => c.owner_Index == $scope.filterModel.owner_Index)
                    }
                });
            };

            $scope.pickItems = function (param) {
                viewModel.setParamitem(param)
                $scope.filterModel.formPage = "GI";
                $scope.filterModel.buttons = $scope.buttons.update;
                if (!$scope.filterModel.goodsIssue_Index) {
                    let msg = "";
                    if (!$scope.dropdownDocumentType.model) {
                        msg += ",กรุณาเลือกทะเบียนประเภทเอกสาร";
                        $scope.filterModel.documentType_Index = null;
                        $scope.filterModel.documentType_Id = null;
                        $scope.filterModel.documentType_Name = null;
                    }
                    else {
                        $scope.filterModel.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
                        $scope.filterModel.documentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
                        $scope.filterModel.documentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
                    }

                    if (!$scope.filterModel.goodsIssue_Date) {
                        msg += ",กรุณาเลือกวันที่ใบเบิกสินค้า";
                    }

                    if (!isGuid($scope.filterModel.owner_Index)) {
                        msg += ",กรุณาเลือกเจ้าของสินค้า";
                    }
                    // if (!$scope.dropdownOwner.model) {
                    //     msg += ",กรุณาเลือกเจ้าของสินค้า";
                    //     $scope.filterModel.owner_Index = null;
                    //     $scope.filterModel.owner_Id = null;
                    //     $scope.filterModel.owner_Name = null;
                    // }
                    // else {
                    //     $scope.filterModel.owner_Index = $scope.dropdownOwner.model.owner_Index;
                    //     $scope.filterModel.owner_Id = $scope.dropdownOwner.model.owner_Id;
                    //     $scope.filterModel.owner_Name = $scope.dropdownOwner.model.owner_Name;
                    // }


                    if (!$scope.dropdownWarehouse.model) {
                        msg += ",กรุณาเลือกคลังสินค้า";
                        $scope.filterModel.warehouse_Index = null;
                        $scope.filterModel.warehouse_Id = null;
                        $scope.filterModel.warehouse_Name = null;
                    }
                    else {
                        $scope.filterModel.warehouse_Index = $scope.dropdownWarehouse.model.warehouse_Index;
                        $scope.filterModel.warehouse_Id = $scope.dropdownWarehouse.model.warehouse_Id;
                        $scope.filterModel.warehouse_Name = $scope.dropdownWarehouse.model.warehouse_Name;
                    }


                    if (msg != "") {
                        let listmsg = msg.split(',');
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                messageNewLine: listmsg
                            }
                        )
                    }
                    else {
                        $scope.filterModel.create_by = $scope.username;
                        $scope.dropdownDocumentTypeWave.model = null;
                        // pageLoading.show();
                        viewModel.goodsissueHeader($scope.filterModel).then(
                            function success(res) {
                                if (!res.data.items) {
                                    return dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'แจ้งเตือน',
                                            messageNewLine: "ตรวจสอบข้อมูลด้านบน"
                                        }
                                    )
                                }
                                // pageLoading.show();                           
                                if (res.data.items.goodsIssue_Index) {
                                    $scope.filterModel.goodsIssue_Index = res.data.items.goodsIssue_Index;
                                    $scope.filterModel.goodsIssue_No = res.data.items.goodsIssue_No;
                                    viewModel.setParam($scope.filterModel)
                                    transferFactory.setParam({});
                                    $state.go('wms.pick_form', { a: "" });
                                }
                            })
                    }
                }
                else {
                    viewModel.setParam($scope.filterModel)
                    $state.go('wms.pick_form', { a: "" });
                }
            }

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

            $scope.runwave = function () {
                let msg = "";
                if (!$scope.dropdownDocumentType.model) {
                    msg += ",กรุณาเลือกทะเบียนประเภทเอกสาร";
                    $scope.filterModel.documentType_Index = null;
                    $scope.filterModel.documentType_Id = null;
                    $scope.filterModel.documentType_Name = null;
                }
                else {
                    $scope.filterModel.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
                    $scope.filterModel.documentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
                    $scope.filterModel.documentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
                }

                if (!$scope.filterModel.goodsIssue_Date) {
                    msg += ",กรุณาเลือกวันที่ใบเบิกสินค้า";
                }

                if (!isGuid($scope.filterModel.owner_Index)) {
                    msg += ",กรุณาเลือกเจ้าของสินค้า";
                }

                if (!$scope.dropdownWarehouse.model) {
                    msg += ",กรุณาเลือกคลังสินค้า";
                    $scope.filterModel.warehouse_Index = null;
                    $scope.filterModel.warehouse_Id = null;
                    $scope.filterModel.warehouse_Name = null;
                }
                else {
                    $scope.filterModel.warehouse_Index = $scope.dropdownWarehouse.model.warehouse_Index;
                    $scope.filterModel.warehouse_Id = $scope.dropdownWarehouse.model.warehouse_Id;
                    $scope.filterModel.warehouse_Name = $scope.dropdownWarehouse.model.warehouse_Name;
                }

                if (!$scope.dropdownDocumentTypeWave.model) {
                    msg += ",กรุณาเลือกรูปแบบการหยิบสินค้า";
                    $scope.filterModel.wave_Index = null;
                    $scope.filterModel.wave_Id = null;
                    $scope.filterModel.wave_Name = null;
                }
                else {
                    $scope.filterModel.wave_Index = $scope.dropdownDocumentTypeWave.model.wave_Index;
                    $scope.filterModel.wave_Id = $scope.dropdownDocumentTypeWave.model.wave_Id;
                    $scope.filterModel.wave_Name = $scope.dropdownDocumentTypeWave.model.wave_Name;
                }

                if ($scope.filterModel.listGoodsIssueItemViewModel == undefined || $scope.filterModel.listGoodsIssueItemViewModel.length == 0) {
                    msg += ",Error: Add at least 1 Item";
                }

                if (msg != "") {
                    let listmsg = msg.split(',');
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            messageNewLine: listmsg
                        }
                    )
                }
                else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'CONFIRM',
                        message: 'คุณต้องการหยิบสินค้าตามรูปแบบนี้ใช่หรือไม่ ?'
                    }).then(function () {
                        $scope.filterModel.create_by = $scope.username;
                        $scope.dropdownDocumentTypeWave.model = null;
                        // pageLoading.show();
                        viewModel.goodsissueHeader($scope.filterModel).then(
                            function success(res) {
                                if (!res.data.items) {
                                    return dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'แจ้งเตือน',
                                            messageNewLine: "ตรวจสอบข้อมูลด้านบน"
                                        }
                                    )
                                }
                                // pageLoading.show();                                
                                if (res.data.items.goodsIssue_Index) {
                                    $scope.filterModel.goodsIssue_Index = res.data.items.goodsIssue_Index;
                                    $scope.filterModel.goodsIssue_No = res.data.items.goodsIssue_No;
                                    var param = angular.copy($scope.filterModel);
                                    // param.operations = "RUNWAVE";
                                    viewModel.runwave(param).then(function (res) {

                                        if (res.data.resultIsUse) {
                                            if (res.data.pgii.length > 0) {
                                                var dataold = angular.copy(res.data.pgii);
                                            }
                                            viewItemModel.find($scope.filterModel.goodsIssue_Index).then(function (res) {

                                                $scope.filterModel.listGoodsIssueItemViewModel = res.data;
                                                if (dataold) {
                                                    dataold.forEach(function (f) {
                                                        $scope.filterModel.listGoodsIssueItemViewModel.push(f);
                                                    });
                                                }
                                                // $scope.filterModel.listGoodsIssueItemResultViewModel = $scope.filterModel.listGoodsIssueItemViewModel.filter(f => f.ref_DocumentItem_Index);
                                            });
                                            return dpMessageBox.alert(
                                                {
                                                    ok: 'Close',
                                                    title: 'ALERT',
                                                    message: res.data.resultMsg
                                                }
                                            )
                                        } else {
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
                                            // pageLoading.hide()
                                        });
                                }
                                // pageLoading.hide()
                            },
                            function error(response) {
                                // pageLoading.hide()
                            });
                    });
                }
            }

            $scope.runwaveV2 = function () {
                let msg = "";
                if (!$scope.dropdownDocumentType.model) {
                    msg += ",กรุณาเลือกทะเบียนประเภทเอกสาร";
                    $scope.filterModel.documentType_Index = null;
                    $scope.filterModel.documentType_Id = null;
                    $scope.filterModel.documentType_Name = null;
                }
                else {
                    $scope.filterModel.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
                    $scope.filterModel.documentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
                    $scope.filterModel.documentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
                }

                if (!$scope.filterModel.goodsIssue_Date) {
                    msg += ",กรุณาเลือกวันที่ใบเบิกสินค้า";
                }

                if (!isGuid($scope.filterModel.owner_Index)) {
                    msg += ",กรุณาเลือกเจ้าของสินค้า";
                }
                // if (!$scope.dropdownOwner.model) {
                //     msg += ",กรุณาเลือกเจ้าของสินค้า";
                //     $scope.filterModel.owner_Index = null;
                //     $scope.filterModel.owner_Id = null;
                //     $scope.filterModel.owner_Name = null;
                // }
                // else {
                //     $scope.filterModel.owner_Index = $scope.dropdownOwner.model.owner_Index;
                //     $scope.filterModel.owner_Id = $scope.dropdownOwner.model.owner_Id;
                //     $scope.filterModel.owner_Name = $scope.dropdownOwner.model.owner_Name;
                // }


                if (!$scope.dropdownWarehouse.model) {
                    msg += ",กรุณาเลือกคลังสินค้า";
                    $scope.filterModel.warehouse_Index = null;
                    $scope.filterModel.warehouse_Id = null;
                    $scope.filterModel.warehouse_Name = null;
                }
                else {
                    $scope.filterModel.warehouse_Index = $scope.dropdownWarehouse.model.warehouse_Index;
                    $scope.filterModel.warehouse_Id = $scope.dropdownWarehouse.model.warehouse_Id;
                    $scope.filterModel.warehouse_Name = $scope.dropdownWarehouse.model.warehouse_Name;
                }

                if (!$scope.dropdownDocumentTypeWave.model) {
                    msg += ",กรุณาเลือกรูปแบบการหยิบสินค้า";
                    $scope.filterModel.wave_Index = null;
                    $scope.filterModel.wave_Id = null;
                    $scope.filterModel.wave_Name = null;
                }
                else {
                    $scope.filterModel.wave_Index = $scope.dropdownDocumentTypeWave.model.wave_Index;
                    $scope.filterModel.wave_Id = $scope.dropdownDocumentTypeWave.model.wave_Id;
                    $scope.filterModel.wave_Name = $scope.dropdownDocumentTypeWave.model.wave_Name;
                }

                if ($scope.dropdownDocumentType.model.documentType_Index != "d7c596e9-bdff-4759-91db-fcec709e16b8") {
                    if ($scope.filterModel.listGoodsIssueItemViewModel == undefined || $scope.filterModel.listGoodsIssueItemViewModel.length == 0) {
                        msg += ",Error: Add at least 1 Item";
                    }
                }
                else if ($scope.dropdownDocumentType.model.documentType_Index == "d7c596e9-bdff-4759-91db-fcec709e16b8") {
                    if ($scope.filterModel.listGoodsIssueItemBomViewModel == undefined || $scope.filterModel.listGoodsIssueItemBomViewModel.length == 0) {
                        msg += ",Error: Add at least 1 Item";
                    }
                }

                if (msg != "") {
                    let listmsg = msg.split(',');
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            messageNewLine: listmsg
                        }
                    )
                }
                else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'CONFIRM',
                        message: 'คุณต้องการหยิบสินค้าตามรูปแบบนี้ใช่หรือไม่ ?'
                    }).then(function () {

                        // viewModel.Check_Budget_Auto($scope.filterModel).then(
                        //     function success(res) {
                        //         if (!res.data) {
                        //             return dpMessageBox.alert(
                        //                 {
                        //                     ok: 'Close',
                        //                     title: 'แจ้งเตือน',
                        //                     message: 'Budget ไม่พอ '
                        //                 }
                        //             )
                        //         } else {
                                    $scope.filterModel.create_by = $scope.username;
                                    $scope.dropdownDocumentTypeWave.model = null;
                                    pageLoading.show();
                                    if ($scope.dropdownDocumentType.model.documentType_Index != "d7c596e9-bdff-4759-91db-fcec709e16b8") {
                                        debugger
                                        viewModel.runwaveandHeader($scope.filterModel).then(
                                            function success(res) {
                                                $scope.filterModel.goodsIssue_Index = res.data.goodsIssue_Index;
                                                $scope.filterModel.goodsIssue_No = res.data.goodsIssue_No;

                                                if (res.data.resultIsUse) {
                                                    if (res.data.pgii.length > 0) {
                                                        var dataold = angular.copy(res.data.pgii);
                                                    }
                                                    viewItemModel.find($scope.filterModel.goodsIssue_Index).then(function (res) {

                                                        $scope.filterModel.listGoodsIssueItemViewModel = res.data;
                                                        if (dataold) {
                                                            dataold.forEach(function (f) {
                                                                $scope.filterModel.listGoodsIssueItemViewModel.push(f);
                                                            });
                                                        }
                                                        // $scope.filterModel.listGoodsIssueItemResultViewModel = $scope.filterModel.listGoodsIssueItemViewModel.filter(f => f.ref_DocumentItem_Index);
                                                    });
                                                    return dpMessageBox.alert(
                                                        {
                                                            ok: 'Close',
                                                            title: 'ALERT',
                                                            message: res.data.resultMsg
                                                        }
                                                    )
                                                } else {
                                                    return dpMessageBox.alert(
                                                        {
                                                            ok: 'Close',
                                                            title: 'ALERT',
                                                            message: res.data.resultMsg
                                                        }
                                                    )
                                                }
                                                pageLoading.hide()
                                            },
                                            function error(response) {
                                                pageLoading.hide()
                                            });
                                    }
                                    else if ($scope.dropdownDocumentType.model.documentType_Index == "d7c596e9-bdff-4759-91db-fcec709e16b8") {
                                        viewModel.runwaveandHeaderBom($scope.filterModel).then(
                                            function success(res) {
                                                $scope.filterModel.goodsIssue_Index = res.data.goodsIssue_Index;
                                                $scope.filterModel.goodsIssue_No = res.data.goodsIssue_No;
                                                if (res.data.resultIsUse) {
                                                    if (res.data.bi.length > 0) {
                                                        var dataold = angular.copy(res.data.bi);
                                                    }
                                                    viewItemModel.find($scope.filterModel.goodsIssue_Index).then(function (res) {

                                                        $scope.filterModel.listGoodsIssueItemBomViewModel = res.data;
                                                        if (dataold) {
                                                            dataold.forEach(function (f) {
                                                                $scope.filterModel.listGoodsIssueItemBomViewModel.push(f);
                                                            });
                                                        }
                                                        // $scope.filterModel.listGoodsIssueItemResultViewModel = $scope.filterModel.listGoodsIssueItemViewModel.filter(f => f.ref_DocumentItem_Index);
                                                    });
                                                    return dpMessageBox.alert(
                                                        {
                                                            ok: 'Close',
                                                            title: 'ALERT',
                                                            message: res.data.resultMsg
                                                        }
                                                    )
                                                } else {
                                                    return dpMessageBox.alert(
                                                        {
                                                            ok: 'Close',
                                                            title: 'ALERT',
                                                            message: res.data.resultMsg
                                                        }
                                                    )
                                                }
                                                pageLoading.hide()
                                            },
                                            function error(response) {
                                                pageLoading.hide()
                                            });
                                    }
                            //     }
                            // },
                            // function error(response) {
                            //     pageLoading.hide()
                            // });

                    });
                }
            }

            $scope.deleteItem = function (param) {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'DELETE_CONFIRM',
                    message: 'คุณต้องการลบรายการใช่หรือไม่'
                }).then(function () {
                    pageLoading.show()
                    param.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
                    param.documentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
                    param.documentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
                    if (param.isDelete) {
                        if ($scope.dropdownDocumentType.model.documentType_Index != "d7c596e9-bdff-4759-91db-fcec709e16b8") {
                            $scope.filterModel.listGoodsIssueItemViewModel.splice($scope.filterModel.listGoodsIssueItemViewModel.indexOf(param), 1);
                        }
                        else if ($scope.dropdownDocumentType.model.documentType_Index == "d7c596e9-bdff-4759-91db-fcec709e16b8") {
                            $scope.filterModel.listGoodsIssueItemBomViewModel.splice($scope.filterModel.listGoodsIssueItemBomViewModel.indexOf(param), 1);
                        }
                        pageLoading.hide()
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'ALERT',
                                message: "ลบรายการสำเร็จ"
                            }
                        )
                    }
                    else {
                        // param.operations = "DELETE_PICK";
                        viewModel.deletePickProduct(param).then(function (res) {
                            pageLoading.hide()
                            if (res.data) {
                                if ($scope.dropdownDocumentType.model.documentType_Index != "d7c596e9-bdff-4759-91db-fcec709e16b8") {
                                    $scope.filterModel.listGoodsIssueItemViewModel.splice($scope.filterModel.listGoodsIssueItemViewModel.indexOf(param), 1);
                                    $scope.filterModel.listGoodsIssueItemViewModel.filter(f => f.planGoodsIssue_Index == param.ref_Document_Index && f.planGoodsIssueItem_Index == param.ref_DocumentItem_Index).map((m) => {
                                        return m.totalQty = m.totalQty + param.totalQty;
                                    });
                                }
                                else if ($scope.dropdownDocumentType.model.documentType_Index == "d7c596e9-bdff-4759-91db-fcec709e16b8") {
                                    $scope.filterModel.listGoodsIssueItemBomViewModel.splice($scope.filterModel.listGoodsIssueItemBomViewModel.indexOf(param), 1);
                                }

                                return dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'ALERT',
                                        message: "ลบรายการสำเร็จ"
                                    }
                                )
                            } else {
                                return dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'ALERT',
                                        message: "Error"
                                    }
                                )
                            }
                        },
                            function error(response) {
                                return dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'ALERT',
                                        message: "Error"
                                    }
                                )
                            }
                        );
                    }
                })
            }

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

                transferFactory.setParam({});
            }

            $scope.next = function () {
                let msg = "";
                for (var i = 0; i < $scope.menu.length; i++) {
                    if (i == 0) {
                        // if (!$scope.filterModel.owner_Id) {
                        //     msg += ",Please Choose Owner !";
                        // }

                        if (!$scope.dropdownDocumentType.model) {
                            msg += ",กรุณาเลือกทะเบียนประเภทเอกสาร";
                        }
                        else {
                            $scope.filterModel.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
                            $scope.filterModel.documentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
                            $scope.filterModel.documentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
                        }

                        if (!$scope.filterModel.goodsIssue_Date) {
                            msg += ",กรุณาเลือกวันที่ใบเบิกสินค้า";
                        }


                        if (!$scope.filterModel.document_Date) {
                            msg += ",กรุณาเลือกวันที่รับใบรับสินค้า";
                        }


                        if (msg != "") {
                            let listmsg = msg.split(',');
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    messageNewLine: listmsg
                                }
                            )
                        }
                        else {
                            $scope.filterModel.create_by = $scope.username;
                            $scope.dropdownDocumentTypeWave.model = null;
                            pageLoading.show()
                            viewModel.goodsissueHeader($scope.filterModel).then(
                                function success(res) {
                                    $scope.filterModel.goodsIssue_Index = res.data.items.goodsIssue_Index;
                                    $scope.filterModel.goodsIssue_No = res.data.items.goodsIssue_No;
                                    viewItemModel.find($scope.filterModel.goodsIssue_Index).then(function (res) {

                                        $scope.filterModel.listGoodsIssueItemViewModel = res.data;
                                    });
                                    pageLoading.hide()
                                },
                                function error(response) {
                                    pageLoading.hide()
                                });
                        }
                    }
                    else if (i == 1) {

                        if ($scope.filterModel.listGoodsIssueItemViewModel == undefined || $scope.filterModel.listGoodsIssueItemViewModel.length == 0) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'Error',
                                    message: 'Error: Add at least 1 Item'
                                }
                            )
                            return "";
                        }

                        pageLoading.show()
                        viewItemModel.find($scope.filterModel.goodsIssue_Index).then(function (res) {

                            $scope.filterModel.listGoodsIssueItemViewModel = res.data;
                        });
                        pageLoading.hide()
                    }

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


            $scope.autoComplete = {
                autoKey: "AutoGoodsIssue/AutobasicSuggestion",
                owner: "AutoGoodsIssue/AutoOwnerfilter",
                GoodsIssue_No: "AutoGoodsIssue/autoGoodIssueNo",
                planGoodsIssue_No: "AutoGoodsIssue/autoPlanGoodIssueNo",
                documentType: "AutoGoodsIssue/AutoDocumentTypefilter",
                processStatus: "AutoGoodsIssue/AutoStatusfilter",
                user: "AutoGoodsIssue/autoUser",
                whOwner: "GoodsReceive/autoWHOwnerfilter"
            };

            $scope.url = {
                GI: webServiceAPI.GI,
                GR: webServiceAPI.GR,
            };

            $scope.getTotal = function (selectedTable) {
                $scope.filterModel.listGoodsIssueItemViewModel = $scope.filterModel.listGoodsIssueItemViewModel || [];
                if ($scope.dropdownDocumentType.model) {
                    if ($scope.dropdownDocumentType.model.documentType_Index != "d7c596e9-bdff-4759-91db-fcec709e16b8") {
                        if (selectedTable == 1)
                            return $scope.filterModel.listGoodsIssueItemViewModel.length;
                        else if (selectedTable == 2)
                            return $scope.filterModel.listGoodsIssueItemViewModel.filter(f => f.goodsIssueItemLocation_Index).length;
                        else if (selectedTable == 3) {
                            $scope.itemsNotWave = $scope.filterModel.listGoodsIssueItemViewModel.filter(f => !f.goodsIssueItemLocation_Index);
                            return $scope.filterModel.listGoodsIssueItemViewModel.filter(f => !f.goodsIssueItemLocation_Index).length;
                        }
                    }
                    else if ($scope.dropdownDocumentType.model.documentType_Index == "d7c596e9-bdff-4759-91db-fcec709e16b8") {
                        if (selectedTable == 1)
                            return $scope.filterModel.listGoodsIssueItemBomViewModel.length;
                        else if (selectedTable == 2)
                            return $scope.filterModel.listGoodsIssueItemBomViewModel.filter(f => f.goodsIssueItemLocation_Index).length;
                        else if (selectedTable == 3) {
                            $scope.itemsNotWave = $scope.filterModel.listGoodsIssueItemBomViewModel.filter(f => !f.goodsIssueItemLocation_Index);
                            return $scope.filterModel.listGoodsIssueItemBomViewModel.filter(f => !f.goodsIssueItemLocation_Index).length;
                        }
                    }
                }
            }

            $scope.ChangeType = function (param) {
                let msg = 'ในกรณีที่เลือกข้อมูลแล้วเปลี่ยนประเภทเอกสารข้อมูลที่เลือกจะถูกลบ,คุณต้องการเปลี่ยนประเภทเอกสารใช่หรือไม่';
                let msgs = msg.split(',');
                if (param.documentType_Index != "d7c596e9-bdff-4759-91db-fcec709e16b8") {
                    if ($scope.filterModel.listGoodsIssueItemBomViewModel.length != 0) {
                        dpMessageBox.confirm({
                            ok: 'Yes',
                            cancel: 'No',
                            title: 'CONFIRM',
                            messageNewLine: msgs
                        }).then(function () {
                            $scope.filterModel.listGoodsIssueItemBomViewModel = [];
                            $scope.ChangeDocumentType = param;

                        },
                            function error(response) {
                                $scope.dropdownDocumentType.model = $scope.ChangeDocumentType;
                            });
                    }
                }
                else if (param.documentType_Index == "d7c596e9-bdff-4759-91db-fcec709e16b8") {
                    if ($scope.filterModel.listGoodsIssueItemViewModel.length != 0) {
                        dpMessageBox.confirm({
                            ok: 'Yes',
                            cancel: 'No',
                            title: 'CONFIRM',
                            messageNewLine: msgs
                        }).then(function () {
                            $scope.filterModel.listGoodsIssueItemViewModel = [];
                            $scope.ChangeDocumentType = param;

                        },
                            function error(response) {
                                $scope.dropdownDocumentType.model = $scope.ChangeDocumentType;
                            });
                    }
                }
            }

            $scope.ChangeOwnerType = function (param) {
                let msg = 'ในกรณีที่เลือกข้อมูลแล้วเปลี่ยนเจ้าของสินค้าข้อมูลที่เลือกจะถูกลบ,คุณต้องการเปลี่ยนเจ้าของสินค้าใช่หรือไม่';
                let msgs = msg.split(',');
                if (param.owner_Index != $scope.ChangeOwner.owner_Index) {
                    if ($scope.filterModel.listGoodsIssueItemBomViewModel.length != 0 || $scope.filterModel.listGoodsIssueItemViewModel.length != 0) {
                        dpMessageBox.confirm({
                            ok: 'Yes',
                            cancel: 'No',
                            title: 'CONFIRM',
                            messageNewLine: msgs
                        }).then(function () {
                            $scope.filterModel.listGoodsIssueItemViewModel = [];
                            $scope.filterModel.listGoodsIssueItemBomViewModel = [];
                            $scope.ChangeOwner = param;

                        },
                            function error(response) {
                                $scope.dropdownOwner.model = $scope.ChangeOwner;
                            });
                    }
                }
            }

            var init = function () {
                $scope.chkpick = false;
                $scope.filterModel = {};
                $scope.filterModel.listGoodsIssueItemBomViewModel = [];
                var formpage = transferFactory.getParam() || {};
                if (formpage.formPgae) {
                    $scope.menu[0].active = "";
                    $scope.menu[0].completed = "completed";

                    $scope.menu_width = 1 * 50;
                    $scope.menu_name = $scope.menu[0].name;

                    $scope.menu[1].active = "active";
                    $scope.menu[1].completed = "completed";
                    $scope.menu_name = $scope.menu[1].name;

                    $scope.menu[2].active = "";
                    $scope.menu[2].completed = "";
                    $scope.menu_name = $scope.menu[2].name;

                    $scope.filterModel = viewModel.getParam()
                    if ($scope.filterModel.buttons) {
                        $scope.buttons.add = false;
                        $scope.buttons.update = true;
                    }
                    else {
                        $scope.buttons.add = true;
                        $scope.buttons.update = false;
                    }

                    var dataold = angular.copy($scope.filterModel.listGoodsIssueItemViewModel);
                    viewItemModel.find($scope.filterModel.goodsIssue_Index).then(function (res) {

                        $scope.filterModel.listGoodsIssueItemViewModel = res.data;

                        if (dataold.length > 0) {
                            res.data.forEach(function (v) {
                                var splice = dataold.filter(c => c.ref_DocumentItem_Index == v.ref_DocumentItem_Index)
                                splice.forEach(function (vv) {
                                    var indexof = dataold.indexOf(vv)
                                    dataold.splice(indexof, 1)
                                });
                            });

                            let deldetail = [];
                            dataold.forEach(function (p) {
                                let totalRemain = res.data.filter(c => c.ref_DocumentItem_Index == p.planGoodsIssueItem_Index).reduce(function (a, b) {
                                    return a + b.totalQty
                                }, 0);
                                if (totalRemain > 0) {
                                    let totalqty = res.data.filter(c => c.ref_DocumentItem_Index == p.planGoodsIssueItem_Index)
                                    let remain = totalqty[0].qtyPlan - totalRemain;
                                    p.qtyPlan = remain;
                                    p.totalQty = remain;
                                    if (remain == 0) {
                                        // var indexof = dataold.indexOf(p)
                                        // dataold.splice(indexof, 1);
                                        deldetail.push(p);
                                    }
                                    else {
                                        $scope.filterModel.listGoodsIssueItemViewModel.push(p);
                                    }
                                }
                                else {
                                    $scope.filterModel.listGoodsIssueItemViewModel.push(p);
                                }
                            });
                            if (deldetail.length > 0) {
                                deldetail.forEach(d => {
                                    var indexof = dataold.indexOf(d);
                                    dataold.splice(indexof, 1);
                                });

                            }
                        }
                    });
                    $scope.chkpick = true;
                    // viewItemModel.find($scope.filterModel.goodsIssue_Index).then(function (res) {
                    //     $scope.filterModel.listGoodsIssueItemViewModel = res.data;
                    // });
                    // $scope.filterModel.listGoodsIssueItemViewModel = $scope.filterModel.listGoodsIssueItemViewModel || [];
                    // if (formpage.item) {
                    //     formpage.item.forEach(c => $scope.filterModel.listGoodsIssueItemViewModel.push(angular.copy(c)))
                    // }
                }

                $scope.username = localStorageService.get('userTokenStorage');
                $scope.dropdownDocumentType();
                $scope.dropdownDocumentTypeWave();
                $scope.dropdownWarehouse();
                $scope.dropdownOwner();
            };
            init();
        }
    })
})();