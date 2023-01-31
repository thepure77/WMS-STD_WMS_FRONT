(function () {
    'use strict'

    app.component('transferForm', {
        controllerAs: '$vm',
        templateUrl: "modules/Tranfer/Transfer/component/transferForm.html",
        bindings: {
            isLoading: '=?',
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',

        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, transferFactory, transferItemFactory, ownerPopFactory, webServiceAPI,goodIssueFactory) {
            var $vm = this;

            var defer = {};
            var viewModel = transferFactory;
            var viewItemModel = transferItemFactory
            var ownerModel = ownerPopFactory
            //$scope.filterModel = {};
            $vm.isFilterTable = true;
            $scope.load = true;
            $scope.onShow = false;
            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });

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
                defer = $q.defer();
                $scope.onShow = true;
                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel.goodsTransfer_Date = getToday();
                $scope.filterModel.goodsTransfer_Doc_Date = getToday();
                $scope.filterModel.goodsTransfer_Time = getTime();
                $scope.filterModel.goodsTransfer_Doc_Time = getTime();
                if (param != undefined) {
                    pageLoading.show()
                    $scope.load = false;
                    viewModel.getId(param.goodsTransfer_Index).then(function (res) {
                        pageLoading.hide()



                        if (res.data.documentRef_No3) {
                            let GetDateModel = {};
                            GetDateModel.storageLoc_Id = res.data.documentRef_No3;
                            getdropdownStorageLoc(GetDateModel, true);
                        }

                        var documentType = $scope.dropdownDocumentTypeList;
                        if (documentType != undefined) {
                            const resultsDocumentType = documentType.filter((documentType) => {
                                return documentType.documentType_Index == res.data.documentType_Index;
                            })
                            $scope.dropdownDocumentType.model = resultsDocumentType[0];
                        }

                        $scope.filterModel = res.data;
                        $scope.log_udf_2 =getToday();
                        $scope.log_udf_3 =getTime();
                        $scope.filterModel.log_udf_2 =getToday();
                        $scope.filterModel.log_udf_3 =getTime();
                        $scope.filterModel.operations = "ADD";

                        if (res.data.documentRef_No2) {
                            let DateModel = {};
                            DateModel.key2 = res.data.documentRef_No2;
                            getsoloto(DateModel);
                        }

                        $scope.buttons.add = false;
                        $scope.buttons.update = true;

                        if ($scope.filterModel.document_Status == -2) {
                            $scope.buttons.add = true;
                            $scope.buttons.update = false;
                        }

                        if ($scope.filterModel.documentStatus == 1 || $scope.filterModel.documentStatus == 2 || $scope.filterModel.documentStatus == -1 || $scope.filterModel.documentStatus == 3)
                            $scope.buttons.update = false;
                        viewItemModel.getGoodsTransferItem($scope.filterModel.goodsTransfer_Index).then(function (res) {
                            $scope.filterModel.listGoodsTransferItemViewModel = res.data;
                        });

                    });
                }
                else {
                    $scope.buttons.add = true;
                    $scope.load = true;
                    $scope.log_udf_2 =getToday();
                    $scope.log_udf_3 =getTime();
                    $scope.filterModel.log_udf_2 =getToday();
                    $scope.filterModel.log_udf_3 =getTime();
                    $scope.filterModel.operations = "UPDATE";
                    if ($scope.buttons.add) {
                        $scope.filterModel.goodsTransfer_Date = getToday();
                        $scope.filterModel.goodsTransfer_Doc_Date = getToday();
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
                $vm.filterModel.goodsTransfer_Date = getToday();
                $vm.filterModel.goodsTransfer_Date_To = getToday();
                $scope.filterModel.advanceSearch = $vm.filterModel.advanceSearch;
                pageLoading.show();
                viewModel.FilterSearch($vm.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.filterModel.goodsTransfer_Date = getToday();

                    if (res.data.lstGoodsTranfer.length != 0) {
                        $scope.filterModel.perPage = $vm.filterModel.perPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }

                        $vm.searchResultModel = res.data.lstGoodsTranfer;
                    }
                    else {
                        $vm.searchResultModel = res.data.lstGoodsTranfer;
                    }

                    let dataList = $vm.searchResultModel;
                    for (var i = 0; i <= dataList.length - 1; i++) {
                        $vm.searchResultModel[i].row = i + 1;
                    }
                    $vm.searchDataRow = dataList.length;
                });
            };

            $scope.filter = function () {
                $vm.triggerSearch();
            };

            $scope.addNewLocation = function (param, index) {
                param.documentTypeModel = $scope.dropdownDocumentType.model //add new
                $scope.transferFormPopup.onClick(param, index);
            }

            $scope.updateDocument = function () {
                var model = $scope.filterModel;
                $scope.filterModel.log_udf_2 =$scope.log_udf_2;
                $scope.filterModel.log_udf_3 =$scope.log_udf_3;
                $scope.filterModel.log_udf_4 =getToday();
                $scope.filterModel.log_udf_5 =getTime();
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยัน',
                    message: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่ ?'
                }).then(function () {

                    model.document_Status = 0;
                    model.create_By = localStorageService.get('userTokenStorage');
                    // model.operations = "UPDATE";
                    viewModel.updateDocumentReturnTransNo(model).then(
                        function success(res) {
                            if(res.data == "")
                            {
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'Error',
                                        message: 'ไม่สามารถโอนย้ายได้'
                                    }
                                )
                            }
                            else
                            {
                                model.operations = model.operations + " " + res.data;
                                viewModel.savelogsRequest(model).then(function () {
                                });
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'บันทึกสำเร็จ',
                                    message: ' บันทึกสำเร็จ : ' + res.data
                                })

                                $scope.filterModel = {};
                                $scope.dropdownDocumentType.model = {};
                                $scope.defaultStep();
                                defer.resolve();
                            }

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
                            title: 'Validate',
                            message: 'Please Choose DocumentType !'
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
                //$scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');
            };

            $scope.back = function () {
                if ($scope.filterModel.goodsTransfer_Index != undefined) {
                    debugger
                    if($scope.filterModel.document_Status == -2)
                    {
                        let dataitem = $scope.filterModel.listGoodsTransferItemViewModel;
                        if (dataitem.length > 0) {
                            let obj = {};
                            obj.items = dataitem;
                            // viewModel.ListdeletePickProduct(obj).then(function (res) {
                            // });
                        }
                    }

                }
                $scope.filterModel = {};
                $scope.dropdownDocumentType.model = {};
                $scope.defaultStep();
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

                return Hour.toString() + ':' + Minute.toString()
            }

            $scope.buttons = {
                add: true,
                update: false,
                back: true
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

            $scope.pickItems = function (param) {
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

                if (!$scope.filterModel.goodsTransfer_Date) {
                    msg += ",กรุณาเลือกวันที่โอนสินค้า";
                }

                if (!isGuid($scope.filterModel.owner_Index)) {
                    msg += ",กรุณาเลือกเจ้าของสินค้า";
                }

                if ($scope.dropdownStorageLoc != null) {
                    if ($scope.dropdownStorageLoc.model != null) {
                        $scope.filterModel.documentRef_No3 = $scope.dropdownStorageLoc.model.storageLoc_Id;
                    }
                    else {
                        $scope.filterModel.documentRef_No3 = null;
                    }
                }

                if (!$scope.filterModel.soldTo_Index) {
                    $scope.filterModel.documentRef_No2 = null;
                }
                else {
                    $scope.filterModel.documentRef_No2 = $scope.filterModel.soldTo_Id;
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
                    $scope.filterModel.create_By = $scope.userName;
                    $scope.filterModel.operations = "ADD";
                    viewModel.createGoodsTransferHeader($scope.filterModel).then(
                        function success(res) {
                            $scope.filterModel.goodsTransfer_Index = res.data.goodsTransfer_Index;
                            $scope.filterModel.goodsTransfer_No = res.data.goodsTransfer_No;

                            $scope.filterModel.formPage = "GT";
                            viewModel.setParam($scope.filterModel)
                            goodIssueFactory.setParam(undefined)
                            $state.go('wms.pick_form', { a: "" });
                            //$state.go('wms.pick_form', {});
                        },
                        function error(response) {
                            $scope.model = {};
                        });
                }
            }

            $scope.deleteItem = function (param, index) {
                param.splice(index, 1);
            }


            $scope.autoComplete = {
                //owner: "AutoPlanGoodsReceive/autoOwnerfilter",
                owner: "Autocomplete/autoOwnerId",
                planGoodsReceive_No: "AutoPlanGoodsReceive/autoPlanGoodsReceiveNo",
                warehouse_Name: "AutoPlanGoodsReceive/autoWarehousefilter",
                vendor: "AutoPlanGoodsReceive/autoVenderfilter",
                documentType: "AutoPlanGoodsReceive/autoDocumentTypefilter",
                processStatus: "AutoPlanGoodsReceive/autoStatusfilter",
                sku: "AutoPlanGoodsReceive/autoSkufilter",
                product: "AutoPlanGoodsReceive/autoProductfilter",
                soldToPlanGI: "AutoPlanGoodIssue/autoSoldTofilter",

            };

            $scope.url = {
                PlanGR: webServiceAPI.PlanGR,
                Master: webServiceAPI.Master,
                PlanGI: webServiceAPI.PlanGI,
            };

            // //DropDown
            // $scope.dropdownDocumentType = function () {
            //     viewModel.dropdownDocumentType($scope.filterModel).then(function (res) {
            //         $scope.dropdownDocumentType = res.data;
            //         // if ($scope.filterModel) {
            //         //     $scope.dropdownDocumentType.model = $scope.dropdownDocumentType.find(c => c.documentType_Index == $scope.filterModel.documentType_Index)
            //         // }
            //     });
            // };

            $scope.dropdownDocumentType = function () {
                viewModel.dropdownDocumentType($scope.filterModels).then(function (res) {
                    $scope.dropdownDocumentTypeList = res.data;
                    if ($scope.filterModel.goodsTransfer_No != "" && $scope.filterModel.goodsTransfer_No != undefined) {
                        var documentType = $scope.dropdownDocumentTypeList;
                        const resultsDocumentType = documentType.filter((documentType) => {
                            return documentType.documentType_Index == $scope.filterModel.documentType_Index;
                        })
                        $scope.dropdownDocumentType.model = resultsDocumentType[0];
                    }
                });
            };

            async function getOwner() {
                await viewModel.getOwner({}).then(function (res) {
                    $scope.filterModel.owner_Index = res.data[0].owner_Index;
                    $scope.filterModel.owner_Id = res.data[0].owner_Id;
                    $scope.filterModel.owner_Name = res.data[0].owner_Name;
                });
            };

            async function getsoloto(param) {
                await viewModel.getsoloto(param).then(function (res) {
                    $scope.filterModel.soldTo_Index = res.data[0].index;
                    $scope.filterModel.soldTo_Id = res.data[0].id;
                    $scope.filterModel.soldTo_Name = res.data[0].name;
                });
            };

            async function getdropdownStorageLoc(param, isuse = false) {
                if (isuse) {
                    await viewModel.dropdownStorageLoc(param).then(function (res) {
                        $scope.dropdownStorageLoc = {};
                        $scope.dropdownStorageLoc.model = res.data[0];
                    });
                }
                else {
                    await viewModel.dropdownStorageLoc(param).then(function (res) {
                        $scope.dropdownStorageLoc = res.data;
                    });
                }
            };

            $scope.$watch("filterModel.soldTo_Name", function () {
                if ($scope.filterModel.soldTo_Index == ""
                    || $scope.filterModel.soldTo_Index == undefined
                    || $scope.filterModel.soldTo_Name == ""
                    || $scope.filterModel.soldTo_Name == undefined
                ) {
                    $scope.dropdownStorageLoc.model = {};

                }
                else if ($scope.load == true) {
                    let GetDateModel = {};
                    GetDateModel.warehouse_Index_To = $scope.filterModel.soldTo_Index;
                    getdropdownStorageLoc(GetDateModel);
                }
            });


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
                for (var i = 0; i < $scope.menu.length; i++) {
                    if (i == 0 && $scope.menu[i].active == 'active') {
                        if ($scope.dropdownDocumentType.model != null) {
                            $scope.filterModel.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
                            $scope.filterModel.documentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
                            $scope.filterModel.documentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
                        }

                        if ($scope.dropdownStorageLoc != null) {
                            if ($scope.dropdownStorageLoc.model != null) {
                                $scope.filterModel.documentRef_No3 = $scope.dropdownStorageLoc.model.storageLoc_Id;
                            }
                            else {
                                $scope.filterModel.documentRef_No3 = null;
                            }
                        }

                        if (!$scope.filterModel.goodsTransfer_Date) {
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'กรุณาเลือกวันที่โอนสินค้า'
                                }
                            )
                        }
                        if ($scope.filterModel.documentType_Name == undefined || $scope.filterModel.documentType_Index == "") {
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'กรุณาเลือกประเภทเอกสาร'
                                }
                            )
                        }

                        if (!$scope.filterModel.soldTo_Index) {
                            $scope.filterModel.documentRef_No2 = null;
                        }
                        else {
                            $scope.filterModel.documentRef_No2 = $scope.filterModel.soldTo_Id;
                        }

                        // $scope.filterModel.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
                        // $scope.filterModel.documentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
                        // $scope.filterModel.documentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
                        $scope.filterModel.create_By = $scope.userName;
                        $scope.filterModel.operations = "ADD";
                        viewModel.createGoodsTransferHeader($scope.filterModel).then(
                            function success(res) {
                                $scope.filterModel.goodsTransfer_Index = res.data.goodsTransfer_Index;
                                $scope.filterModel.goodsTransfer_No = res.data.goodsTransfer_No;
                                // ตัวเช็ค disabled ถ้าหาก documentType_Name ไม่ใช่ "โอนย้ายประเภทสัญญาทั่วไป" จะปิดทั้งหมด
                                // $scope.filterModel.isUseDocumentType = res.data.isUseDocumentType;

                                // set ไม่ให้ disabled เลย
                                // $scope.filterModel.isUseDocumentType = false;
                            },
                            function error(response) {
                                $scope.model = {};
                            });

                    }

                    if (i == 1 && $scope.menu[i].active == 'active') {

                        if (!$scope.filterModel.listGoodsTransferItemViewModel) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'กรุณาเพิ่มสินค้าอย่างน้อย 1 รายการ'
                                }
                            )
                            return "";
                        }

                        if ($scope.filterModel.documentType_Index != "9056ff09-29df-4bba-8fc5-6c524387f993") {
                            let ischk = false;
                            $scope.filterModel.listGoodsTransferItemViewModel.forEach(element => {
                                if (!element.documentRef_No1) {
                                    ischk = true;
                                }
                            });
                            if (ischk) {
                                return dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: 'กรุณากรอกเลขที่คณะกรรมการตรวจรับ'
                                    }
                                )
                            }
                        }
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



                // for (var i = 0; i < $scope.menu.length; i++) {
                //     if ($scope.menu[i].active == "active") {
                //         $scope.menu[i].active = "";
                //         $scope.menu[i].completed = "completed";
                //         i++;
                //         $scope.menu[i].active = "active";
                //         $scope.menu_width = i * 50; //กำหนดความกว้างของเส้นเชื่อม
                //         $scope.menu_name = $scope.menu[i].name;
                //     }
                // }

            }
            function rebindGTI() {
                viewModel.getId($scope.filterModel.goodsTransfer_Index).then(function (res) {
                    pageLoading.hide()

                    // var documentType = $scope.dropdownDocumentType
                    // const resultsDocumentType = documentType.filter((documentType) => {
                    //     return documentType.documentType_Index == res.data.documentType_Index;
                    // })
                    // $scope.dropdownDocumentType.model = resultsDocumentType[0];

                    $scope.filterModel = res.data;
                    $scope.buttons.add = true;
                    $scope.buttons.update = false;

                    if ($scope.filterModel.documentStatus == 1 || $scope.filterModel.documentStatus == 2 || $scope.filterModel.documentStatus == -1 || $scope.filterModel.documentStatus == 3)
                        $scope.buttons.update = false;
                    viewItemModel.getGoodsTransferItem($scope.filterModel.goodsTransfer_Index).then(function (res) {
                        $scope.filterModel.listGoodsTransferItemViewModel = res.data;
                        if (condition) {

                        }
                    });
                });

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
            }

            $scope.deleteItem = function (param, index) {
                pageLoading.show()
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยัน',
                    message: 'คุณต้องการลบรายการใช่หรือไม่ ?'
                }).then(function () {
                    param.create_By = $scope.userName;
                    param.ref_Document_Index = param.goodsTransfer_Index;
                    param.ref_DocumentItem_Index = param.goodsTransferItem_Index;
                    param.operations = "DELETE_PICK";
                    viewModel.deletePickProduct(param).then(function (res) {
                        pageLoading.hide()
                        if (res.data) {
                            $scope.filterModel.listGoodsTransferItemViewModel.splice(index, 1);
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
                                    message: "พบข้อผิดพลาด"
                                }
                            )
                        }
                    },
                        function error(response) {

                        }
                    );
                })
            }

            $scope.deleteItemQI = function (param, index) {
                pageLoading.show()
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยัน',
                    message: 'คุณต้องการลบรายการใช่หรือไม่ ?'
                }).then(function () {
                    param.create_By = $scope.userName;
                    param.operations = "DELETE_PICK";
                    viewModel.deletePickProductQI(param).then(function (res) {
                        pageLoading.hide()
                        if (res.data) {
                            $scope.filterModel.listGoodsTransferItemViewModel.splice(index, 1);
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
                                    message: "พบข้อผิดพลาด"
                                }
                            )
                        }
                    },
                        function error(response) {

                        }
                    );
                })
            }

            $scope.popupLocation = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {

                    $scope.popupLocation.onShow = !$scope.popupLocation.onShow;
                    $scope.popupLocation.delegates.transferLocationPopup(param, index);
                },
                config: {
                    title: "manyToOne"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {

                        if (param.itemStatus_To != undefined) {
                            param.itemStatus_Index_To = param.itemStatus_To.itemStatus_Index;
                            param.itemStatus_Id_To = param.itemStatus_To.itemStatus_Id;
                            param.itemStatus_Name_To = param.itemStatus_To.itemStatus_Name;
                        }

                        viewItemModel.addNewLocation(param).then(function success(res) {
                            if (res.data == 'S') {
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: 'แก้ไขรายการสำเร็จ'
                                    }
                                )
                            }
                            else if (res.data == 'locationNotFound') {
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: 'ไม่พบตำแหน่งที่ต้องการ'
                                    }
                                )
                            }

                            rebindGTI();
                        });
                    }
                }
            };

            $scope.transferFormPopup = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {

                    $scope.transferFormPopup.onShow = !$scope.transferFormPopup.onShow;
                    $scope.transferFormPopup.delegates(param, index);
                },
                config: {
                    title: "manyToOne"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        if (param.itemStatus_To != undefined) {
                            param.itemStatus_Index_To = param.itemStatus_To.itemStatus_Index;
                            param.itemStatus_Id_To = param.itemStatus_To.itemStatus_Id;
                            param.itemStatus_Name_To = param.itemStatus_To.itemStatus_Name;
                        }
                        param.owner_Index = $scope.filterModel.owner_Index;
                        viewItemModel.checkLocation(param).then(function success(res) {
                            if (res.data == 'ไม่สามารถย้ายได้') {
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: 'ไม่สามารถย้ายไปตำแหน่งนี้ได้'
                                    }
                                )
                            }
                            else{
                                viewItemModel.addNewLocation(param).then(function success(res) {
                                    if (res.data == 'S') {
                                        dpMessageBox.alert(
                                            {
                                                ok: 'Close',
                                                title: 'แจ้งเตือน',
                                                message: 'แก้ไขรายการสำเร็จ'
                                            }
                                        )
                                    }
                                    else if (res.data == 'locationNotFound') {
                                        dpMessageBox.alert(
                                            {
                                                ok: 'Close',
                                                title: 'แจ้งเตือน',
                                                message: 'ไม่พบตำแหน่งที่ต้องการ'
                                            }
                                        )
                                    }
        
                                    rebindGTI();
                                });
                            }
                        });

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



            var init = function () {
                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel.goodsTransfer_Date = getToday();
                $scope.filterModel.goodsTransfer_Doc_Date = getToday();

                $scope.filterModels = {};

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
                    //$scope.filterModel = formpage.dataGT;
                    $scope.filterModel = viewModel.getParam().dataGT
                }
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.dropdownDocumentType();
            };
            init();
        }
    })
})();