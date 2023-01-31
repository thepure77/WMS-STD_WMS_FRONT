(function () {
    'use strict';
    app.component('packOfSummary', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Tranfer/Pack/PackSummary/PackSummary.html";
        },
        bindings: {
            scanReceive: '=?',
            onShow: '=?'
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, webServiceAPI, transferFactory, putAwayFactory, goodIssueFactory, assignJobGrFactory, goodsReceiveFactory, lpnFactory, lpnItemFactory) {
            var $vm = this;
            var defer = {};
            var viewModel = transferFactory;
            var viewModelGI = goodIssueFactory;
            var viewModelGR = goodsReceiveFactory;
            var viewModelLPN = lpnFactory;
            var viewModelLPNitem = lpnItemFactory;
            var viewModelAssign = assignJobGrFactory;
            var viewModelPutaway = putAwayFactory;
            $scope.header = 0;




            $scope.click = 1;
            $scope.clickH = 1;
            $scope.disabled = false;
            $scope.filterModel = {};
            $scope.filterGRModel = {};
            $scope.filterItemModel = {};



            $scope.popupPlanGi = {
                onShow: false,
                delegates: {},
                onClick: function () {
                    $scope.popupPlanGi.onShow = !$scope.popupPlanGi.onShow;
                    $scope.popupPlanGi.delegates.planGiPopup('', '');
                },
                config: {
                    title: "PlanGI"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel = param[0];
                        $scope.filterModel.product_conname = param[0].productConversion_Name;

                        let product = { product_Index: param[0].product_Index };
                        viewModel.dropdownProductconversion(product).then(function (res) {

                            $scope.dropdownProductconversion = res.data;
                        });
                    }
                }
            };

            $scope.selected = function (model) {

                if (!model.unit) {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณาเลือกหน่วย'
                        }
                    )
                }
                else {
                    if (!(!isNaN(parseFloat(model.Pick)) && angular.isNumber(parseFloat(model.Pick)))) {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'กรุณาระบุจำนวนสินค้า'
                            }
                        )
                        return "";
                    } else {
                        if (parseFloat(model.Pick) <= 0) {
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: "กรุณาระบุจำนวนสินค้า"
                                }
                            )
                        }
                    }
                    if ($scope.header == 0) {
                        model.create_By = $scope.userName;
                        //model
                        $scope.filterModel.documentType_Index = '34B5DAE4-F916-487A-8947-3196C25166E9';
                        $scope.filterModel.documentType_Id = 'P01';
                        $scope.filterModel.documentType_Name = 'Pack (GI)';
                        $scope.filterModel.goodsIssue_Date = getToday();
                        $scope.filterModel.goodsIssue_Time = getTime();
                        $scope.filterModel.document_Date = getToday();
                        $scope.filterModel.owner_Id = '3419'
                        $scope.filterModel.owner_Index = '02b31868-9d3d-448e-b023-05c121a424f4'
                        $scope.filterModel.owner_Name = 'Amazon'
                        $scope.filterModel.warehouse_Index = '8A7B5FBB-CF80-401E-AAEA-25E2C2E9297A';
                        $scope.filterModel.warehouse_Id = '1';
                        $scope.filterModel.warehouse_Name = 'ไม่ระบุ';
                        $scope.filterModel.create_by = $scope.username;
                        viewModelGI.goodsissueHeader($scope.filterModel).then(
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
                                    $scope.header = 1;
                                    model.goodsIssue_Index = res.data.items.goodsIssue_Index;
                                    model.goodsIssue_No = res.data.items.goodsIssue_No;
                                    model.goodsIssue_Date = res.data.items.goodsIssue_Date;
                                    model.goodsIssue_Due_Date = res.data.items.goodsIssue_Due_Date;
                                    model.goodsIssue_Time = res.data.items.goodsIssue_Time;
                                    model.owner_Index = res.data.items.owner_Index;
                                    model.owner_Id = res.data.items.owner_Id;
                                    model.owner_Name = res.data.items.owner_Name;
                                    model.documentType_Index = res.data.items.documentType_Index;
                                    model.documentType_Id = res.data.items.documentType_Id;
                                    model.documentType_Name = res.data.items.documentType_Name;
                                    model.document_Remark = res.data.items.document_Remark;
                                    model.documentRef_No1 = res.data.items.documentRef_No1;
                                    $scope.donotheader = model;
                                    goodIssueFactory.pickProduct(model).then(function (res) {
                                        pageLoading.hide()
                                        if (res.data.resultIsUse) {

                                            $scope.itemsReserve.item = $scope.itemsReserve.item || [];
                                            $scope.itemsReserve.item.push(angular.copy(res.data.items));
                                            $scope.disabled = true;
                                            $scope.filterModel = {};
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
                            })
                    } else if ($scope.header == 1) {
                        model.create_By = $scope.userName;
                        model.goodsIssue_Index = $scope.donotheader.goodsIssue_Index;
                        model.goodsIssue_No = $scope.donotheader.goodsIssue_No;
                        model.goodsIssue_Date = $scope.donotheader.goodsIssue_Date;
                        model.goodsIssue_Due_Date = $scope.donotheader.goodsIssue_Due_Date;
                        model.goodsIssue_Time = $scope.donotheader.goodsIssue_Time;
                        model.owner_Index = $scope.donotheader.owner_Index;
                        model.owner_Id = $scope.donotheader.owner_Id;
                        model.owner_Name = $scope.donotheader.owner_Name;
                        model.documentType_Index = $scope.donotheader.documentType_Index;
                        model.documentType_Id = $scope.donotheader.documentType_Id;
                        model.documentType_Name = $scope.donotheader.documentType_Name;
                        model.document_Remark = $scope.donotheader.document_Remark;
                        model.documentRef_No1 = $scope.donotheader.documentRef_No1;
                        goodIssueFactory.pickProduct(model).then(function (res) {
                            pageLoading.hide()
                            if (res.data.resultIsUse) {

                                $scope.itemsReserve.item = $scope.itemsReserve.item || [];
                                $scope.itemsReserve.item.push(angular.copy(res.data.items));
                                $scope.disabled = true;
                                $scope.filterModel = {};

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

            $scope.deleteItem = function (param, index) {
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
                            $scope.clickH = 1;
                            $scope.disabled = false;
                            $scope.filterModel = {};
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


            $scope.clickTab = function (tab) {
                $scope.click = tab;
            }
            $scope.clickTabH = function (tab) {
                $scope.clickH = tab;
            }

            $scope.$watch('filterModel.qty', function () {
                if ($scope.filterModel.qty != null && $scope.filterModel.qty != "" && $scope.filterModel.qty != undefined) {
                    var myInput = document.querySelector('#q2');
                    myInput.value = myInput.value.replace(/(\.\d{2})\d+/g, '$1');
                }
            });

            $scope.delete = function (param, index, list) {
                $scope.filterModel.goodsReceiveItem_Index = param.goodsReceiveItem_Index;
                var deferred = $q.defer();
                pageLoading.show();
                $scope.filterModel.cancel_By = $scope.userName;
                viewModel.deleteItem($scope.filterModel).then(
                    function success(res) {
                        list.splice(index, 1);
                        pageLoading.hide();
                    },
                    function error(response) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: "ERROR"
                        })
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            $scope.save = function () {

                let msg = "";
                $scope.filterModel.warehouse_Index = '8A7B5FBB-CF80-401E-AAEA-25E2C2E9297A';
                $scope.filterModel.warehouse_Id = '1';
                $scope.filterModel.warehouse_Name = 'ไม่ระบุ';
                $scope.filterModel.goodsIssue_Index = $scope.itemsReserve.item[0].goodsIssue_Index;
                $scope.filterModel.listGoodsIssueItemViewModel = $scope.itemsReserve.item;

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

                        $scope.filterModel.create_By = localStorageService.get('userTokenStorage');
                        $scope.filterModel.operations = "UPDATE";
                        pageLoading.show()
                        $scope.filterModel.isUpdate = true;
                        viewModelGI.updateStatusAddData($scope.filterModel).then(
                            function success(res) {
                                pageLoading.hide()
                                $scope.click = 1;
                                $scope.clickH = 1;
                                $scope.disabled = false;
                                $scope.filterModel = {};
                                $scope.filterGRModel = {};
                            },
                            function error(response) {
                                pageLoading.hide()
                            });
                        // });
                    });
                }

                //SAVE GR
                $scope.filterItemModel.documentRef_No1 = $scope.itemsReserve.item[0].goodsIssue_No;
                $scope.filterItemModel.goodsReceive_Date = getToday();
                $scope.filterItemModel.owner_Id = '3419'
                $scope.filterItemModel.owner_Index = '02b31868-9d3d-448e-b023-05c121a424f4'
                $scope.filterItemModel.owner_Name = 'Amazon'
                $scope.filterItemModel.warehouse_Index = '8A7B5FBB-CF80-401E-AAEA-25E2C2E9297A';
                $scope.filterItemModel.warehouse_Id = '1';
                $scope.filterItemModel.warehouse_Name = 'ไม่ระบุ';
                $scope.filterItemModel.documentType_Index = '7E28DAC1-B711-4A45-87AD-7A3801B48BE3';
                $scope.filterItemModel.documentType_Id = 'UN01';
                $scope.filterItemModel.documentType_Name = 'UnPack (GR)';

                if ($scope.filterModel.listGoodsReceiveItemViewModels == undefined || $scope.filterModel.listGoodsReceiveItemViewModels.length == 0) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'Error: Add at least 1 Item !'
                        }
                    )
                    return "";
                } else {
                    $scope.filterItemModel.listGoodsReceiveItemViewModels = $scope.filterModel.listGoodsReceiveItemViewModels;
                }

                var model = $scope.filterItemModel;

                //POpOz
                model.userAssignKey = $window.localStorage['userGuidPlanReceive'];
                model.create_by = localStorageService.get('userTokenStorage');
                model.operations = "ADD";
                dpMessageBox.confirm({
                    ok: 'ใช่',
                    cancel: 'ไม่',
                    title: 'ยืนยันข้อมูล ?',
                    message: 'คุณต้องการบันทึกข้อมูลหรือไม่!'
                }).then(function () {
                    viewModelGR.add(model).then(
                        function success(res) {
                            if (res.data.message == true) {
                                pageLoading.show();
                                $scope.model = {};
                                $scope.model.goodsReceive_No = res.data.goodsReceive_No;
                                $scope.model.update_By = localStorageService.get('userTokenStorage');
                                viewModelGR.makeAllGr($scope.model).then(function success(res) {

                                    viewModelLPN.getByGoodReceiveId(res.data).then(function (res) {

                                        $scope.filterModel.listGoodsReceiveItemViewModels = res.data;
                                        angular.forEach($scope.filterModel.listGoodsReceiveItemViewModels, function (v, k) {
                                            $scope.filterModel.listGoodsReceiveItemViewModels[k].genTagType = 1;
                                            $scope.filterModel.listGoodsReceiveItemViewModels[k].ref_Process_Index = "58400298-4347-488C-AF71-76B78A44232D";
                                        });

                                        $scope.filterItemsTagModel = $scope.filterItemsTagModel || {};
                                        $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel = {};
                                        $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel = $scope.filterModel.listGoodsReceiveItemViewModels;
                                        viewModelLPN.createTagItems($scope.filterItemsTagModel).then(function success(res) {
                                            viewModelLPNitem.filterTagItem($scope.model).then(function (res) {

                                                $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel = res.data;

                                                let dataList = $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel;

                                                for (var i = 0; i <= dataList.length - 1; i++) {
                                                    var qty = parseFloat($scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel[i].qty);

                                                    $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel[i].qty = qty.toFixed(2);
                                                    $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel[i].qty = parseFloat($scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel[i].qty);
                                                }

                                                let dataListlocation = $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel;
                                                for (var i = 0; i <= dataListlocation.length - 1; i++) {
                                                    dataListlocation[i].suggest_Location_Name = 'AB03';
                                                }

                                                $scope.tagModel = $scope.tagModel || {};
                                                $scope.tagModel.listLPNItemViewModel = dataListlocation;
                                                $scope.tagModel.update_By = $scope.userName;
                                                $scope.tagModel.operations = "CONFIRM_TAG_LOCATION";
                                                viewModelLPNitem.confirmTagItemLocation($scope.tagModel).then(function (res) {
                                                    if (res.data == 'S') {
                                                        viewModelLPNitem.filterTagItem($scope.model).then(function (res) {
                                                            $scope.model.goodsReceive_Index = res.data[0].goodsReceive_Index
                                                            viewModelGR.GoodsReceiveConfirm($scope.model).then(function success(res) {
                                                                pageLoading.hide();
                                                                if (res.data == false) {
                                                                    dpMessageBox.alert({
                                                                        ok: 'Yes',
                                                                        title: 'แจ้งเตือน',
                                                                        message: 'การรับสินค้าไม่สำเร็จ!!'
                                                                    });
                                                                } else {
                                                                    $scope.modelassign = {};
                                                                    $scope.modelassign.listGoodsReceiveViewModel = [];
                                                                    $scope.modelassign.listGoodsReceiveViewModel.push($scope.model);
                                                                    $scope.modelassign.Template = '1';
                                                                    $scope.modelassign.create_By = localStorageService.get('userTokenStorage');
                                                                    viewModelAssign.assign($scope.modelassign).then(
                                                                        function success(res) {
                                                                            if (res.data == "true") {
                                                                                $scope.model.key = $scope.model.goodsReceive_No
                                                                                viewModelPutaway.filterTask($scope.model).then(function (res) {
                                                                                    $scope.tagGR = {};
                                                                                    $scope.tagGR.taskGR_No = res.data.itemsTaskPutaway[0].taskGR_No;
                                                                                    viewModelLPNitem.filterTagItem($scope.model).then(function (res) {
                                                                                        $scope.saveallputaway = {};
                                                                                        $scope.saveallputaway.listLPNItemViewModel = [];
                                                                                        // $scope.saveallputaway.listLPNItemViewModel.push(res.data);
                                                                                        for (let index = 0; index < res.data.length; index++) {
                                                                                            $scope.putaway = {};
                                                                                            $scope.putaway.tag_no = res.data[index].tag_No;
                                                                                            $scope.putaway.taskGR_No = $scope.tagGR.taskGR_No;
                                                                                            $scope.saveallputaway.listLPNItemViewModel.push($scope.putaway);
                                                                                        }
                                                                                        debugger
                                                                                        viewModelPutaway.scanPutaway($scope.saveallputaway).then(
                                                                                            function success(res) {
                                                                                                pageLoading.hide();
                                                                                                if (res.data == "TaskSuccess") {
                                                                                                    dpMessageBox.alert({
                                                                                                        ok: 'Close',
                                                                                                        title: 'แจ้งเตือน',
                                                                                                        message: "เลขที่งาน " + $scope.tagGR.taskGR_No + " จัดเก็บเสร็จสิ้น"
                                                                                                    }).then(function () { $scope.back(); });

                                                                                                    if ($scope.filterModel.isSku == false) {
                                                                                                        $scope.filterModel = {};
                                                                                                        $scope.filterModel.isSku = false;
                                                                                                    }
                                                                                                    else if ($scope.filterModel.isSku == true) {
                                                                                                        $scope.filterModel = {};
                                                                                                        $scope.filterModel.isSku = true;
                                                                                                    }
                                                                                                    $scope.disabled = 0;
                                                                                                }
                                                                                                else if (res.data == "blockPut") {
                                                                                                    dpMessageBox.alert({
                                                                                                        ok: 'Close',
                                                                                                        title: 'แจ้งเตือน',
                                                                                                        message: "location Block กรุณาติดต่อ Inventory"
                                                                                                    })
                                                                                                    $scope.disabled = 0;
                                                                                                    //SAต๋อง คิด msg นี้ 17/09/2020
                                                                                                }
                                                                                            },
                                                                                            function error(response) {
                                                                                                dpMessageBox.alert({
                                                                                                    ok: 'Close',
                                                                                                    title: 'Information.',
                                                                                                    message: "error"
                                                                                                })
                                                                                                deferred.reject(response);
                                                                                            });
                                                                                    });
                                                                                });


                                                                                $scope.filterModel = {};
                                                                            }
                                                                            else {
                                                                                pageLoading.hide();
                                                                                dpMessageBox.alert(
                                                                                    {
                                                                                        ok: 'Close',
                                                                                        title: 'แจ้งเตือน',
                                                                                        message: res.data
                                                                                    }
                                                                                )
                                                                                $scope.findTask = {};
                                                                                $scope.filterModel = {};
                                                                            }
                                                                        },
                                                                        function error(response) {
                                                                            pageLoading.hide();
                                                                            dpMessageBox.alert(
                                                                                {
                                                                                    ok: 'Close',
                                                                                    title: 'แจ้งเตือน',
                                                                                    message: 'ไม่สามารถมอบหมายงานได้'
                                                                                }
                                                                            )
                                                                            $scope.findTask = {};
                                                                            $scope.filterModel = {};
                                                                        }
                                                                    );
                                                                }

                                                            }, function error(res) { });
                                                        });

                                                    } else {
                                                        dpMessageBox.alert({
                                                            ok: 'Close',
                                                            title: 'แจ้งเตือน',
                                                            message: res.data
                                                        });
                                                    }
                                                });
                                            });

                                            // pageLoading.hide();
                                            // dpMessageBox.alert({
                                            //     ok: 'Close',
                                            //     title: 'บันทึกสำเร็จ',
                                            //     message: ' บันทึกสำเร็จ  '
                                            // })
                                        });
                                    });
                                });

                                $scope.filterModel = {};
                                $scope.filterItemModel = {};
                                $scope.itemsReserve = {};
                                $scope.dropdownDocumentType.model = {};

                            } else {
                                dpMessageBox.alert({
                                    title: 'แจ้งเตือน',
                                    message: 'ไม่สามารถบันทึกข้อมูลได้'
                                })
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
            }

            $scope.dropdownWeight = function () {
                viewModelGR.dropdownWeight($scope.filterItemModel).then(function (res) {
                    $scope.dropdownWeight = res.data;
                });
            };

            $scope.dropdownDocumentType = function () {
                viewModel.dropdownDocumentType($scope.filterModel).then(function (res) {
                    $scope.dropdownDocumentType = res.data;
                });
            };

            $scope.dropdownItemStatus = function () {
                viewModelGR.dropdownItemStatus($scope.filterModel).then(function (res) {
                    $scope.dropdownItemStatus = res.data;
                });
            };

            $scope.dropdownVolume = function () {
                viewModelGR.dropdownVolume($scope.filterModel).then(function (res) {
                    $scope.dropdownVolume = res.data;
                });
            };

            $scope.$watch("filterModel.product_Name", function () {

                if ($scope.filterModel.product_Id == "" || $scope.filterModel.product_Name == ""
                    || $scope.filterModel.product_Id == undefined || $scope.filterModel.product_Name == undefined) {
                    $scope.filterModel.volume_Index = "";
                    $scope.filterModel.volume_Id = "";
                    $scope.filterModel.volume_Name = "";
                    $scope.filterModel.volume_Ratio = "";
                    $scope.filterModel.productConversionWLH = "";
                }
            });

            $scope.$watch("filterItemModel.product_Name", function () {

                if ($scope.filterItemModel.product_Id == "" || $scope.filterItemModel.product_Name == ""
                    || $scope.filterItemModel.product_Id == undefined || $scope.filterItemModel.product_Name == undefined) {
                    $scope.dropdownProductconversion.model = {};
                }
                else {
                    viewModelGR.dropdownProductconversion($scope.filterItemModel).then(function (res) {
                        $scope.dropdownProductconversion = res.data;
                        $scope.dropdownProductconversion.model = $scope.dropdownProductconversion[0];
                        $scope.filterItemModel.weightUnit = $scope.dropdownProductconversion.model.productConversion_Weight;

                        $scope.filterItemModel.productConversion_Name = $scope.dropdownProductconversion.model.productConversion_Name;


                        $scope.filterItemModel.unitWidth = $scope.dropdownProductconversion.model.productConversion_Width;
                        $scope.filterItemModel.unitLength = $scope.dropdownProductconversion.model.productConversion_Length;
                        $scope.filterItemModel.unitHeight = $scope.dropdownProductconversion.model.productConversion_Height;
                        $scope.filterItemModel.volumeUnit = $scope.filterItemModel.unitWidth * $scope.filterItemModel.unitLength * $scope.filterItemModel.unitHeight;

                        var volume = $scope.dropdownVolume
                        const resultvolume = volume.filter((volume) => {
                            return volume.volume_Index == $scope.dropdownProductconversion[0].productConversion_Volume_Index;
                        })
                        $scope.dropdownVolume.model = resultvolume[0];
                        $scope.filterItemModel.volume_Ratio = $scope.dropdownVolume.model.volume_Ratio;



                        var weight = $scope.dropdownWeight
                        const resultweight = weight.filter((weight) => {
                            return weight.weight_Index == $scope.dropdownProductconversion[0].productConversion_Weight_Index;
                        })
                        $scope.dropdownWeight.weightModel = resultweight[0];
                        $scope.dropdownWeight.netWeightModel = resultweight[0];
                        $scope.dropdownWeight.grsWeightModel = resultweight[0];

                    });
                }
            });

            $scope.deleteItemGR = function (param, index) {
                param.splice(index, 1);
            }


            $scope.addsItem = function (param) {

                param.netWeight = 0.00;
                // $scope.filterItemModel.weight = param.netWeight;
                $scope.filterItemModel.weight = param.netWeight.toFixed(2);

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
                            title: 'แจ้งเตือน',
                            message: 'กรุณาเลือกสินค้า !'
                        }
                    )
                    return "";
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

                if ($scope.filterItemModel.qty == undefined || $scope.filterItemModel.qty == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณาเลือกจำนวนสินค้า !'
                        }
                    )
                    return "";
                }
                else {

                    $scope.filterItemModel.qty = parseFloat($scope.filterItemModel.qty);
                    // var n = num.toFixed(3);
                    // $scope.filterItemModel.qty = n;
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

                if ($scope.dropdownWeight.weightModel != null) {
                    $scope.filterItemModel.weight_Index = $scope.dropdownWeight.weightModel.weight_Index;
                    $scope.filterItemModel.weight_Id = $scope.dropdownWeight.weightModel.weight_Id;
                    $scope.filterItemModel.weight_Name = $scope.dropdownWeight.weightModel.weight_Name;
                    $scope.filterItemModel.weightRatio = $scope.dropdownWeight.weightModel.weight_Ratio;


                }

                if ($scope.dropdownItemStatus.model == null) {
                    $scope.filterItemModel.itemStatus_Index = '525BCFF1-2AD9-4ACB-819D-0DEA4E84EA12';
                    $scope.filterItemModel.itemStatus_Id = '10';
                    $scope.filterItemModel.itemStatus_Name = 'Goods-UR';
                }


                if ($scope.dropdownWeight.grsWeightModel != null) {
                    $scope.filterItemModel.grsWeight_Index = $scope.dropdownWeight.grsWeightModel.weight_Index;
                    $scope.filterItemModel.grsWeight_Id = $scope.dropdownWeight.grsWeightModel.weight_Id;
                    $scope.filterItemModel.grsWeight_Name = $scope.dropdownWeight.grsWeightModel.weight_Name;
                    $scope.filterItemModel.grsWeightRatio = $scope.dropdownWeight.grsWeightModel.weight_Ratio;
                }

                if ($scope.dropdownVolume.model != null) {
                    $scope.filterItemModel.width_Index = $scope.dropdownVolume.model.volume_Index;
                    $scope.filterItemModel.width_Id = $scope.dropdownVolume.model.volume_Id;
                    $scope.filterItemModel.width_Name = $scope.dropdownVolume.model.volume_Name;
                    $scope.filterItemModel.widthRatio = $scope.dropdownVolume.model.volume_Ratio;

                    $scope.filterItemModel.length_Index = $scope.dropdownVolume.model.volume_Index;
                    $scope.filterItemModel.length_Id = $scope.dropdownVolume.model.volume_Id;
                    $scope.filterItemModel.length_Name = $scope.dropdownVolume.model.volume_Name;
                    $scope.filterItemModel.lengthRatio = $scope.dropdownVolume.model.volume_Ratio;

                    $scope.filterItemModel.height_Index = $scope.dropdownVolume.model.volume_Index;
                    $scope.filterItemModel.height_Id = $scope.dropdownVolume.model.volume_Id;
                    $scope.filterItemModel.height_Name = $scope.dropdownVolume.model.volume_Name;
                    $scope.filterItemModel.heightRatio = $scope.dropdownVolume.model.volume_Ratio;

                }
                $scope.filterItemModel.documentRef_No1 = 'L901';
                $scope.filterItemModel.documentRef_No2 = 'AB03';

                if($scope.filterModel.listGoodsReceiveItemViewModels != undefined){
                    if($scope.filterModel.listGoodsReceiveItemViewModels.length > 0 ){
                        $scope.filterItemModel = {};
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'สามารถทำการ Pack ได้แค่ที่ละ 1 รายการ'
                            }
                        )
                        return "";
                    }
                   
                }

                if ($scope.filterModel.listGoodsReceiveItemViewModels == undefined) {
                    $scope.filterModel.listGoodsReceiveItemViewModels = $scope.filterModel.listGoodsReceiveItemViewModels || []
                    $scope.filterModel.listGoodsReceiveItemViewModels.push(angular.copy($scope.filterItemModel));
                }
                
                else if ($scope.filterItemModel.rowItemIndex != undefined) {
                    $scope.filterModel.listGoodsReceiveItemViewModels[param.rowItemIndex] = $scope.filterItemModel;
                   
                }
                else {
                    $scope.filterModel.listGoodsReceiveItemViewModels.push(angular.copy($scope.filterItemModel));

                }
                let dataList = $scope.filterModel.listGoodsReceiveItemViewModels;

                for (var i = 0; i <= dataList.length - 1; i++) {
                    $scope.filterModel.listGoodsReceiveItemViewModels[i].qty = $scope.filterModel.listGoodsReceiveItemViewModels[i].qty.toFixed(2);
                    $scope.filterModel.listGoodsReceiveItemViewModels[i].qty = parseFloat($scope.filterModel.listGoodsReceiveItemViewModels[i].qty);
                }
                $scope.onShow = false;
                $scope.filterItemModel = {};
            }

            $scope.autoComplete = {
                productName: "GoodsReceive/autoProduct",
                productId: "GoodsReceive/autoSKU",
            };


            $scope.url = {
                GR: webServiceAPI.GR,
            };

            $vm.$onInit = function () {
                $vm = this;
                $scope.dropdownDocumentType();
                $scope.dropdownItemStatus();
                $scope.dropdownVolume();
                $scope.dropdownWeight();
                $scope.itemsReserve = {};
                $scope.donotheader = {};
                $scope.filterItemModel = {};
                $scope.disabled = false;
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterItemModel.owner_Index = '02b31868-9d3d-448e-b023-05c121a424f4';

            }







        }
    })
})();