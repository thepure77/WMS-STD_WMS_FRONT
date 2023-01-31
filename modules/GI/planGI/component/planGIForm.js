(function () {
    'use strict'

    app.component('planGiForm', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/planGI/component/planGIForm.html",
        bindings: {
            isLoading: '=?',
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, planGoodsIssueFactory, planGoodsIssueItemFactory, webServiceAPI, Upload) {
            var $vm = this;

            var defer = {};
            var viewModel = planGoodsIssueFactory;
            var _viewModel = planGoodsIssueItemFactory
            $scope.filterModel = {};
            $vm.isFilterTable = true;
            $scope.onShow = false;
            $scope.load = true;

            $scope.language = $window.localStorage['LANGUAGE']

            $scope.CheckLanguage = function () {
                $scope.language = $window.localStorage['LANGUAGE']
                if ($scope.language == "th")
                    return "0"
                else
                    return "-210"
            }
            $scope.CheckLanguageV2 = function () {
                $scope.language = $window.localStorage['LANGUAGE']
                if ($scope.language == "th")
                    return "-10"
                else
                    return "200"
            }

            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });
            $scope.filterItemModel = {};
            $scope.addressTemp = {};

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

                $scope.filterModel.wave_status = t;
                if (t == 1) {
                    $scope.colortable1 = "#999999";
                    $scope.colortable2 = "#e5e5e5";
                    $scope.colortable3 = "#e5e5e5";
                    planGoodsIssueItemFactory.find($scope.filterModel.planGoodsIssue_Index).then(function (res) {
                        $scope.filterModel.listplanGoodsIssueItemViewModel = res.data;

                    });
                }
                else if (t == 2) {
                    $scope.colortable1 = "#e5e5e5";
                    $scope.colortable2 = "#999999";
                    $scope.colortable3 = "#e5e5e5";
                    planGoodsIssueItemFactory.find_with_wave($scope.filterModel).then(function (res) {
                        $scope.filterModel.listplanGoodsIssueItemViewModel = res.data;

                    });
                }
                else if (t == 3) {
                    $scope.colortable1 = "#e5e5e5";
                    $scope.colortable2 = "#e5e5e5";
                    $scope.colortable3 = "#999999";
                    planGoodsIssueItemFactory.find_with_wave($scope.filterModel).then(function (res) {
                        $scope.filterModel.listplanGoodsIssueItemViewModel = res.data;

                    });
                }
                $scope.selectedTable = t;
            }

            $scope.addDetailItem = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    let data = {};
                    $scope.addDetailItem.onShow = !$scope.addDetailItem.onShow;
                    if (param) {
                        param.rowItemIndex = index;
                    }
                    data = param || {};
                    data.owner_Index = $scope.filterModel.owner_Index;
                    $scope.addDetailItem.delegates(data);
                },
                config: {
                    title: "PlanGr"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        if ($scope.filterModel.listplanGoodsIssueItemViewModel == undefined) {
                            $scope.filterModel.listplanGoodsIssueItemViewModel = $scope.filterModel.listplanGoodsIssueItemViewModel || []
                            $scope.filterModel.listplanGoodsIssueItemViewModel.push(angular.copy(param));
                        }
                        else if (param.rowItemIndex != undefined) {
                            $scope.filterModel.listplanGoodsIssueItemViewModel[param.rowItemIndex] = param;
                        }
                        else {
                            $scope.filterModel.listplanGoodsIssueItemViewModel.push(angular.copy(param));

                        }
                    }
                }
            };

            $scope.forwarderPopup = {
                onShow: false,
                delegates: {},
                onClick: function (param) {
                    $scope.forwarderPopup.onShow = !$scope.forwarderPopup.onShow;
                    $scope.forwarderPopup.delegates(param);
                },
                config: {
                    title: "Forwarder"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        if (param.length > 0) {
                            $scope.filterModel.forwarder_Index = param[0].forwarder_Index;
                            $scope.filterModel.forwarder_Id = param[0].forwarder_Id;
                            $scope.filterModel.forwarder_Name = param[0].forwarder_Name;
                        } else {
                            $scope.filterModel.forwarder_Index = null;
                            $scope.filterModel.forwarder_Id = null;
                            $scope.filterModel.forwarder_Name = null;
                        }
                    }
                }
            };

            $vm.onShow = function (param) {
                defer = $q.defer();
                $scope.logmodel = {};
                $scope.onShow = true;
                $scope.filterModel.planGoodsIssue_Date = getToday();
                $scope.filterModel.planGoodsIssue_Due_Date = getToday();
                $scope.filterModel.planGoodsIssue_Time = getTime();
                $scope.colortable1 = "#999999";
                $scope.colortable2 = "#e5e5e5";
                $scope.colortable3 = "#e5e5e5";
                $scope.dropdownDocumentType.model = {};
                $scope.dropdownWarehouse.model = {};
                $scope.dropdownshipcon.model = {};
                $scope.dropdownItemStatus.model = {};
                $scope.dropdownProductconversion.model = {};
                $scope.dropdownCostCenter.model = {};
                $scope.dropdownRoute.model = {};
                $scope.dropdownSubRoute.model = {};
                $scope.dropdownRound.model = {};
                $scope.dropdownShippingMethod.model = {};
                $scope.dropdownShippingTerms.model = {};
                $scope.dropdownPaymentType.model = {};
                $scope.selectedTable = 1;
                $scope.filterModel.warehouse_Index = 'B0AD4E8F-A7B1-4952-BAC7-1A9482BABA79';
                if (param != undefined) {
                    // pageLoading.show()
                    $scope.load = false;
                    viewModel.find(param.planGoodsIssue_Index).then(function (res) {
                        pageLoading.hide()
                        $scope.filterModel = res.data;
                        $scope.filterModel.log_udf_2 = getToday();
                        $scope.filterModel.log_udf_3 = getTime();

                        // $scope.filterModel.documentPriority_Status = $scope.filterModel.documentPriority_Status.toString();
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

                        var shipcon = $scope.dropdownWarehouse
                        const resultsshipcon = shipcon.filter((shipcon) => {
                            return shipcon.warehouse_Index == res.data.warehouse_Index;
                        })
                        $scope.dropdownshipcon.model = resultsshipcon[0];

                        // var costCenter = $scope.dropdownCostCenter
                        // const resultsCostCenter = costCenter.filter((costCenter) => {
                        //     return costCenter.costCenter_Index == res.data.costCenter_Index;
                        // })
                        // $scope.dropdownCostCenter.model = resultsCostCenter[0];

                        var Round = $scope.dropdownRound
                        const resultsRound = Round.filter((Round) => {
                            return Round.round_Index == res.data.round_Index;
                        })
                        $scope.dropdownRound.model = resultsRound[0];
                        var Route = $scope.dropdownRoute
                        const resultsRoute = Route.filter((Route) => {
                            return Route.route_Index == res.data.route_Index;
                        })
                        $scope.dropdownRoute.model = resultsRoute[0];

                        var SubRoute = $scope.dropdownSubRoute
                        const resultsSubRoute = SubRoute.filter((SubRoute) => {
                            return SubRoute.subRoute_Index == res.data.subRoute_Index;
                        })
                        $scope.dropdownSubRoute.model = resultsSubRoute[0];

                        var ShippingMethod = $scope.dropdownShippingMethod
                        const resultsShippingMethod = ShippingMethod.filter((ShippingMethod) => {
                            return ShippingMethod.shippingMethod_Index == res.data.shippingMethod_Index;
                        })
                        $scope.dropdownShippingMethod.model = resultsShippingMethod[0];

                        var ShippingTerms = $scope.dropdownShippingTerms
                        const resultsShippingTerms = ShippingTerms.filter((ShippingTerms) => {
                            return ShippingTerms.shippingTerms_Index == res.data.shippingTerms_Index;
                        })
                        $scope.dropdownShippingTerms.model = resultsShippingTerms[0];

                        // var PaymentType = $scope.dropdownPaymentType
                        // const resultsPaymentType = PaymentType.filter((PaymentType) => {
                        //     return PaymentType.paymentType_Index == res.data.paymentType_Index;
                        // })
                        // $scope.dropdownPaymentType.model = resultsPaymentType[0];

                        $scope.buttons.add = false;
                        $scope.buttons.update = true;

                        if ($scope.filterModel.documentStatus == 1 || $scope.filterModel.documentStatus == 2 || $scope.filterModel.documentStatus == -1 || $scope.filterModel.documentStatus == 3)
                            $scope.buttons.update = false;

                        planGoodsIssueItemFactory.find(param.planGoodsIssue_Index).then(function (res) {
                            $scope.filterModel.listplanGoodsIssueItemViewModel = res.data;

                        });
                    });
                }
                else {
                    $scope.load == true;
                    $scope.buttons.add = true;
                    $scope.filterModel.log_udf_2 = getToday();
                    $scope.filterModel.log_udf_3 = getTime();
                    if ($scope.buttons.add) {
                        $scope.filterModel.planGoodsIssue_Date = getToday();
                        $scope.filterModel.planGoodsIssue_Due_Date = getToday();
                        $scope.dropdownWarehouse.model = $scope.dropdownWarehouse[0];
                        $scope.dropdownShippingTerms.model = $scope.dropdownShippingTerms[0];
                        $scope.filterModel.owner_Index = '02b31868-9d3d-448e-b023-05c121a424f4';
                        $scope.filterModel.owner_Name = 'Amazon';
                        $scope.filterModel.owner_Id = '3419';
                    }
                    $scope.buttons.update = false;

                    pageLoading.hide()


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

            $scope.shipcon = [
                {
                    "value": "Y1",
                    "name": "จัดส่งให้"
                },
                {
                    "value": "Y2",
                    "name": "ลูกค้ารับเอง"
                },
                {
                    "value": "Y2",
                    "name": "เบิกสินค้าภายในคลัง"
                }
            ];

            $scope.clickTab = function (tab) {
                $scope.click = tab;
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

            $scope.add = function () {
                let msg = "";

                var model = $scope.filterModel;
                model.log_udf_4 =getToday();
                model.log_udf_5 =getTime();
                var listmodel = $scope.filterModel.listplanGoodsIssueItemViewModel;
                //#region by dropdown tab1
                if ($scope.dropdownDocumentType) {
                    if ($scope.dropdownDocumentType.model != null) {
                        $scope.filterModel.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
                        $scope.filterModel.documentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
                        $scope.filterModel.documentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
                    }
                    else {
                        msg += ",กรุณาเลือกทะเบียนประเภทเอกสาร";
                        $scope.filterModel.documentType_Index = null;
                        $scope.filterModel.documentType_Id = null;
                        $scope.filterModel.documentType_Name = null;
                    }
                }

                if (!isGuid($scope.filterModel.owner_Index)) {
                    msg += ",กรุณาเลือกเจ้าของสินค้า";
                }

                // if (!$scope.filterModel.documentPriority_Status) {
                //     msg += ",กรุณาเลือกลำดับความสำคัญของเอกสาร";
                // }


                if (!isGuid($scope.filterModel.shipTo_Index)) {
                    msg += ",กรุณาเลือกสถานที่จัดส่ง";
                }

                if ($scope.filterModel.listplanGoodsIssueItemViewModel == undefined) {
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

                    if ($scope.dropdownRound) {
                        if ($scope.dropdownRound.model != null) {
                            $scope.filterModel.round_Index = $scope.dropdownRound.model.round_Index;
                            $scope.filterModel.round_Id = $scope.dropdownRound.model.round_Id;
                            $scope.filterModel.round_Name = $scope.dropdownRound.model.round_Name;
                        }
                        else {
                            $scope.filterModel.round_Index = null;
                            $scope.filterModel.round_Id = null;
                            $scope.filterModel.round_Name = null;
                        }
                    }
                    if ($scope.dropdownSubRoute) {
                        if ($scope.dropdownSubRoute.model != null) {
                            $scope.filterModel.subRoute_Index = $scope.dropdownSubRoute.model.subRoute_Index;
                            $scope.filterModel.subRoute_Id = $scope.dropdownSubRoute.model.subRoute_Id;
                            $scope.filterModel.subRoute_Name = $scope.dropdownSubRoute.model.subRoute_Name;
                        }
                        else {
                            $scope.filterModel.subRoute_Index = null;
                            $scope.filterModel.subRoute_Id = null;
                            $scope.filterModel.subRoute_Name = null;
                        }
                    }
                    if ($scope.dropdownRoute) {
                        if ($scope.dropdownRoute.model != null) {
                            $scope.filterModel.route_Index = $scope.dropdownRoute.model.route_Index;
                            $scope.filterModel.route_Id = $scope.dropdownRoute.model.route_Id;
                            $scope.filterModel.route_Name = $scope.dropdownRoute.model.route_Name;
                        }
                        else {
                            $scope.filterModel.route_Index = null;
                            $scope.filterModel.route_Id = null;
                            $scope.filterModel.route_Name = null;
                        }
                    }
                    if ($scope.dropdownShippingTerms) {
                        if ($scope.dropdownShippingTerms.model != null) {
                            $scope.filterModel.shippingTerms_Index = $scope.dropdownShippingTerms.model.shippingTerms_Index;
                            $scope.filterModel.shippingTerms_Id = $scope.dropdownShippingTerms.model.shippingTerms_Id;
                            $scope.filterModel.shippingTerms_Name = $scope.dropdownShippingTerms.model.shippingTerms_Name;
                        }
                        else {
                            $scope.filterModel.shippingTerms_Index = null;
                            $scope.filterModel.shippingTerms_Id = null;
                            $scope.filterModel.shippingTerms_Name = null;
                        }
                    }
                    if ($scope.dropdownShippingMethod) {
                        if ($scope.dropdownShippingMethod.model != null) {
                            $scope.filterModel.shippingMethod_Index = $scope.dropdownShippingMethod.model.shippingMethod_Index;
                            $scope.filterModel.shippingMethod_Id = $scope.dropdownShippingMethod.model.shippingMethod_Id;
                            $scope.filterModel.shippingMethod_Name = $scope.dropdownShippingMethod.model.shippingMethod_Name;
                        }
                        else {
                            $scope.filterModel.shippingMethod_Index = null;
                            $scope.filterModel.shippingMethod_Id = null;
                            $scope.filterModel.shippingMethod_Name = null;
                        }
                    }
                    //#endregion
                    //#region by dropdown tab2
                    if ($scope.dropdownPaymentType) {
                        if ($scope.dropdownPaymentType.model != null) {
                            $scope.filterModel.paymentType_Index = $scope.dropdownPaymentType.model.paymentType_Index;
                            $scope.filterModel.paymentType_Id = $scope.dropdownPaymentType.model.paymentType_Id;
                            $scope.filterModel.paymentType_Name = $scope.dropdownPaymentType.model.paymentType_Name;
                        }
                        else {
                            $scope.filterModel.paymentType_Index = null;
                            $scope.filterModel.paymentType_Id = null;
                            $scope.filterModel.paymentType_Name = null;
                        }
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
                    //#endregion

                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'ยืนยันข้อมูล ?',
                        message: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่ !'
                    }).then(function () {
                        model.create_By = localStorageService.get('userTokenStorage');
                        model.operations = "ADD";
                        for (let index = 0; index < model.listplanGoodsIssueItemViewModel.length; index++) {
                            model.listplanGoodsIssueItemViewModel[index].uDF1 = model.planGoodsIssueNo;
                            model.listplanGoodsIssueItemViewModel[index].uDF4 = model.planGoodsIssueIndex;
                            model.listplanGoodsIssueItemViewModel[index].uDF5 = model.listplanGoodsIssueItemViewModel[index].planGoodsIssueItemIndex;
                        }
                        pageLoading.show();
                        viewModel.add(model).then(
                            function success(res) {
                                pageLoading.hide();
                                if (res.data.message == true) {
                                    model.operations = model.operations+" "+res.data.document_No;
                                    $scope.logmodel = model;
                                    viewModel.savelogsRequest($scope.logmodel).then(function () {
                                    });
                                    if (res.data.document_No) {
                                        dpMessageBox.alert(
                                            {
                                                ok: 'Close',
                                                title: 'บันทึกสำเร็จ',
                                                message: 'เลขที่ใบสั่งจองสินค้า : ' + res.data.document_No
                                            }
                                        )
                                    }
                                    else {
                                        dpMessageBox.alert(
                                            {
                                                ok: 'Close',
                                                title: 'บันทึกสำเร็จ',
                                                message: 'บันทึกข้อมูลเสร็จสิ้น'
                                            })
                                    }
                                    $scope.filterModel = {};
                                    $scope.dropdownDocumentType.model = {};
                                    $scope.dropdownItemStatus.model = {};
                                    $scope.dropdownProductconversion.model = {};
                                    $scope.dropdownCostCenter.model = {};
                                    $scope.dropdownRoute.model = {};
                                    $scope.dropdownSubRoute.model = {};
                                    $scope.dropdownRound.model = {};
                                    $scope.dropdownShippingMethod.model = {};
                                    $scope.dropdownShippingTerms.model = {};
                                    $scope.dropdownPaymentType.model = {};
                                    $scope.filterModel.planGoodsIssue_Date = getToday();
                                    $scope.filterModel.planGoodsIssue_Due_Date = getToday();
                                    $scope.defaultStep();
                                    defer.resolve();
                                }
                                else {
                                    pageLoading.hide();
                                    dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'แจ้งเตือน',
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
                                        title: 'Error',
                                        message: 'Save Error'
                                    }
                                )
                            }
                        );
                    },
                        function error(param) {
                            pageLoading.hide();
                        });
                }
            };

            $scope.edit = function () {
                var model = $scope.filterModel;
                model.log_udf_4 =getToday();
                model.log_udf_5 =getTime();
                pageLoading.hide();

                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยันข้อมูล ?',
                    message: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่ ?'
                }).then(function () {
                    viewModel.find(model.planGoodsIssue_Index).then(function (res) {
                        if (res.data.userAssign != $scope.userName) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "User ไม่ตรงกับ UserAssign"
                            })
                            $scope.filterModel = {};
                            $scope.dropdownDocumentType.model = {};
                            $scope.dropdownCostCenter.model = {};
                            // $scope.dropdownStorageLoc.model = {};
                            $scope.dropdownItemStatus.model = {};
                            $scope.dropdownProductconversion.model = {};
                            $scope.filterModel.planGoodsIssue_Date = getToday();
                            $scope.filterModel.planGoodsIssue_Due_Date = getToday();
                            $scope.defaultStep();
                            defer.resolve();
                        }
                        else {
                            model.update_By = localStorageService.get('userTokenStorage');
                            model.operations = "EDIT "+ $scope.filterModel.planGoodsIssue_No;
                            viewModel.add(model).then(
                                function success(res) {
                                    $scope.logmodel = model;
                                    viewModel.savelogsRequest($scope.logmodel).then(function () {
                                    });

                                    $vm.filterModel = res.config.data;
                                    $vm.searchResultModel = res.config.data;
                                    $scope.filterModel = {};
                                    $scope.dropdownDocumentType.model = {};
                                    $scope.dropdownItemStatus.model = {};
                                    $scope.dropdownCostCenter.model = {};
                                    // $scope.dropdownStorageLoc.model = {};
                                    $scope.dropdownProductconversion.model = {};
                                    $scope.filterModel.planGoodsIssue_Date = getToday();
                                    $scope.filterModel.planGoodsIssue_Due_Date = getToday();
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

                        }
                    });
                },
                    function error(param) {
                    });
            }


            this.$onInit = function () {
                $scope.filterModel = {};
                $scope.filterModel.documents = [];
                $scope.userName = localStorageService.get('userTokenStorage');
            };

            $scope.back = function () {
                $scope.deleteuser = {};
                if ($scope.filterModel.planGoodsIssue_Index != undefined) {
                    $scope.deleteuser.planGoodsIssue_Index = $scope.filterModel.planGoodsIssue_Index;
                    viewModel.deleteUserAssign($scope.deleteuser).then(
                        function success(results) {
                            $scope.filterModel = {};
                            $scope.dropdownDocumentType.model = {};
                            $scope.dropdownItemStatus.model = {};
                            $scope.dropdownCostCenter.model = {};
                            // $scope.dropdownStorageLoc.model = {};
                            $scope.defaultStep();
                            defer.resolve();
                        }
                    );
                }
                else {
                    $scope.filterModel = {};
                    $scope.dropdownDocumentType.model = {};
                    $scope.dropdownItemStatus.model = {};
                    $scope.dropdownProductconversion.model = {};
                    $scope.dropdownCostCenter.model = {};
                    // $scope.dropdownStorageLoc.model = {};
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

                if ($scope.filterItemModel.product_Name == undefined || $scope.filterItemModel.product_Index == "") {
                    pageLoading.hide();
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
                    pageLoading.hide();
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
                    pageLoading.hide();
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
                    var num = parseFloat($scope.filterItemModel.qty);
                    var n = num.toFixed(3);
                    $scope.filterItemModel.qty = n;
                }

                if ($scope.dropdownItemStatus.model == null) {
                    pageLoading.hide();
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณาเลือกสถานะ !'
                        }
                    )
                    return "";
                }

                //if (!angular.isNumber(parseFloat($scope.filterItemModel.qty))) {
                if (!(!isNaN(parseFloat($scope.filterItemModel.qty)) && angular.isNumber(parseFloat($scope.filterItemModel.qty)))) {
                    pageLoading.hide();
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'Please insert number qty !'
                        }
                    )
                    return "";
                } else {
                    if (parseFloat($scope.filterItemModel.qty) <= 0) {
                        pageLoading.hide();
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'Please insert number more than 0 !'
                            }
                        )
                        return "";
                    }
                }

                if ($scope.filterModel.listplanGoodsIssueItemViewModel == undefined) {
                    $scope.filterModel.listplanGoodsIssueItemViewModel = $scope.filterModel.listplanGoodsIssueItemViewModel || []
                    $scope.filterModel.listplanGoodsIssueItemViewModel.push(angular.copy(param));
                    $scope.filterItemModel.product_Id = null;
                    $scope.filterItemModel.product_Index = null;
                    $scope.filterItemModel.product_Name = null;
                    $scope.filterItemModel.qty = null;
                    $scope.dropdownProductconversion.model = null;
                    $scope.dropdownItemStatus.model = null;
                    $scope.filterItemModel.documentItem_Remark = null;
                    // $scope.filterItemModel.weight = null;
                    $scope.filterItemModel.product_Lot = null;
                }
                else if ($scope.filterItemModel.rowItemIndex != undefined) {

                    $scope.filterModel.listplanGoodsIssueItemViewModel[param.rowItemIndex].product_Id = $scope.filterItemModel.product_Id;
                    $scope.filterModel.listplanGoodsIssueItemViewModel[param.rowItemIndex].product_Index = $scope.filterItemModel.product_Index;
                    $scope.filterModel.listplanGoodsIssueItemViewModel[param.rowItemIndex].product_Name = $scope.filterItemModel.product_Name;
                    $scope.filterModel.listplanGoodsIssueItemViewModel[param.rowItemIndex].qty = $scope.filterItemModel.qty;
                    $scope.filterModel.listplanGoodsIssueItemViewModel[param.rowItemIndex].productconversion_Index = param.productconversion_Index;
                    $scope.filterModel.listplanGoodsIssueItemViewModel[param.rowItemIndex].productconversion_Id = param.productconversion_Id;
                    $scope.filterModel.listplanGoodsIssueItemViewModel[param.rowItemIndex].productconversion_Name = param.productconversion_Name;
                    // $scope.filterModel.listplanGoodsIssueItemViewModel[param.rowItemIndex].weight = $scope.filterItemModel.weight;
                    $scope.filterModel.listplanGoodsIssueItemViewModel[param.rowItemIndex].ratio = param.ratio;
                    $scope.filterModel.listplanGoodsIssueItemViewModel[param.rowItemIndex].documentItem_Remark = param.documentItem_Remark
                    $scope.filterModel.listplanGoodsIssueItemViewModel[param.rowItemIndex].product_Lot = param.product_Lot

                    $scope.filterItemModel.product_Id = null;
                    $scope.filterItemModel.product_Index = null;
                    $scope.filterItemModel.product_Name = null;
                    $scope.filterItemModel.qty = null;
                    $scope.filterItemModel.documentItem_Remark = null;
                    $scope.dropdownProductconversion.model = null;
                    $scope.dropdownItemStatus.model = null;
                    // $scope.filterItemModel.weight = null;
                    $scope.filterItemModel.rowItemIndex = undefined;
                    $scope.filterItemModel.product_Lot = null;

                }
                else {
                    $scope.filterModel.listplanGoodsIssueItemViewModel.push(angular.copy(param));
                    $scope.filterItemModel.product_Id = null;
                    $scope.filterItemModel.product_Index = null;
                    $scope.filterItemModel.product_Name = null;
                    $scope.filterItemModel.qty = null;
                    $scope.filterItemModel.documentItem_Remark = null;
                    $scope.dropdownProductconversion.model = null;
                    $scope.dropdownItemStatus.model = null;
                    $scope.filterItemModel.documentItem_Remark = null;
                    // $scope.filterItemModel.weight = null;
                    $scope.filterItemModel.product_Lot = null;

                }
            }

            $scope.editItem = function (index) {

                $scope.index = index;

                var ItemStatus = $scope.dropdownItemStatus
                const resultsItemStatus = ItemStatus.filter((ItemStatus) => {
                    return ItemStatus.itemStatus_Index == $scope.filterModel.listplanGoodsIssueItemViewModel[index].itemStatus_Index;
                })
                $scope.dropdownItemStatus.model = resultsItemStatus[0];

                $scope.filterItemModel.product_Index = $scope.filterModel.listplanGoodsIssueItemViewModel[index].product_Index;
                $scope.filterItemModel.product_Id = $scope.filterModel.listplanGoodsIssueItemViewModel[index].product_Id;
                $scope.filterItemModel.product_Name = $scope.filterModel.listplanGoodsIssueItemViewModel[index].product_Name;
                $scope.filterItemModel.qty = $scope.filterModel.listplanGoodsIssueItemViewModel[index].qty;
                // $scope.filterItemModel.weight = $scope.filterModel.listplanGoodsIssueItemViewModel[index].weight;
                $scope.filterItemModel.ratio = $scope.filterModel.listplanGoodsIssueItemViewModel[index].ratio;
                $scope.filterItemModel.product_Lot = $scope.filterModel.listplanGoodsIssueItemViewModel[index].product_Lot;
                $scope.filterItemModel.documentItem_Remark = $scope.filterModel.listplanGoodsIssueItemViewModel[index].documentItem_Remark;
                $scope.filterItemModel.rowItemIndex = index;
            }


            $scope.deleteItem = function (param, index) {
                param.splice(index, 1);
            }


            $scope.autoComplete = {
                owner: "AutoPlanGoodIssue/AutoOwnerfilter",
                warehouse_Name: "AutoPlanGoodIssue/autoWarehousefilter",
                documentType: "AutoPlanGoodIssue/autoDocumentTypefilter",
                processStatus: "AutoPlanGoodIssue/autoStatusfilter",
                sku: "AutoPlanGoodIssue/autoSkufilter",
                product: "AutoPlanGoodIssue/autoProductfilter",
                soldToPlanGI: "AutoPlanGoodIssue/autoSoldTofilter",
                shipToPlanGI: "AutoPlanGoodIssue/autoShipTofilter",
                movementType: "AutoPlanGoodIssue/autoMovementTypefilter",

            };

            $scope.url = {
                PlanGI: webServiceAPI.PlanGI,
            };


            $scope.dropdownDocumentType = function () {
                viewModel.dropdownDocumentType($scope.filterModel).then(function (res) {
                    $scope.dropdownDocumentType = res.data;
                });
            };

            $scope.dropdownItemStatus = function () {
                viewModel.dropdownItemStatus($scope.filterModel).then(function (res) {
                    $scope.dropdownItemStatus = res.data;
                });
            };

            $scope.dropdownProductconversion = function () {
                viewModel.dropdownProductconversion($scope.filterModel).then(function (res) {

                    $scope.dropdownProductconversion = res.data;
                });
            };

            $scope.dropdownCostCenter = function () {
                viewModel.dropdownCostCenter($scope.filterModel).then(function (res) {

                    $scope.dropdownCostCenter = res.data;
                });
            };

            $scope.dropdownRoute = function () {
                viewModel.dropdownRoute($scope.filterModel).then(function (res) {

                    $scope.dropdownRoute = res.data;
                });
            };

            $scope.dropdownSubRoute = function () {
                viewModel.dropdownSubRoute($scope.filterModel).then(function (res) {

                    $scope.dropdownSubRoute = res.data;
                });
            };

            $scope.dropdownRound = function () {
                viewModel.dropdownRound($scope.filterModel).then(function (res) {

                    $scope.dropdownRound = res.data;
                });
            };

            $scope.dropdownShippingMethod = function () {
                viewModel.dropdownShippingMethod($scope.filterModel).then(function (res) {

                    $scope.dropdownShippingMethod = res.data;
                });
            };

            $scope.dropdownShippingTerms = function () {
                viewModel.dropdownShippingTerms($scope.filterModel).then(function (res) {
                    $scope.dropdownShippingTerms = res.data;
                });
            };

            $scope.dropdownPaymentType = function () {
                viewModel.dropdownPaymentType($scope.filterModel).then(function (res) {
                    $scope.dropdownPaymentType = res.data;
                });
            };

            $scope.dropdownWarehouse = function () {
                viewModel.dropdownwarehouse($scope.filterModel).then(function (res) {
                    $scope.dropdownWarehouse = res.data;
                    // if ($scope.filterModel) {
                    //     $scope.dropdownWarehouse.model = $scope.dropdownWarehouse.find(c => c.warehouse_Index == $scope.filterModel.warehouse_Index)
                    // }

                });
            };

            $scope.dropdownshipcon = function () {
                viewModel.dropdownwarehouse($scope.filterModel).then(function (res) {

                    $scope.dropdownWarehouse = res.data;
                });
            };

            // $scope.dropdownStorageLoc = function () {
            //     viewModel.dropdownStorageLoc($scope.filterModel).then(function (res) {

            //         $scope.dropdownStorageLoc = res.data;
            //     });
            // };

            $scope.$watch("filterItemModel.product_Name", function () {
                if ($scope.filterItemModel.product_Id == "" || $scope.filterItemModel.product_Name == ""
                    || $scope.filterItemModel.product_Id == undefined || $scope.filterItemModel.product_Name == undefined) {
                    $scope.dropdownProductconversion.model = {};
                }
                else {
                    viewModel.dropdownProductconversion($scope.filterItemModel).then(function (res) {
                        $scope.dropdownProductconversion = res.data;
                        $scope.dropdownProductconversion.model = $scope.dropdownProductconversion[0];
                    });
                }
            });

            $scope.$watch("filterItemModel.qty", function () {
                if ($scope.filterItemModel.qty != undefined) {
                    //$scope.filterItemModel.weight = $scope.filterItemModel.qty * $scope.dropdownProductconversion.model.productconversion_Weight;
                }

            });

            // $scope.$watch("filterModel.soldTo_Name", function () {
            //     if ($scope.filterModel.soldTo_Index == ""
            //         || $scope.filterModel.soldTo_Index == undefined
            //         || $scope.filterModel.soldTo_Name == ""
            //         || $scope.filterModel.soldTo_Name == undefined
            //     ) {
            // $scope.dropdownStorageLoc.model = {};

            //     }
            //     else if ($scope.load == true) {
            //         $scope.GetDateModel = {};
            //         $scope.GetDateModel.warehouse_Index_To = $scope.filterModel.soldTo_Index;
            //         viewModel.dropdownStorageLoc($scope.GetDateModel).then(function (res) {
            //             $scope.dropdownStorageLoc = res.data;
            //         });

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

                    if (i == 0) {

                        if ($scope.dropdownDocumentType.model != null) {
                            $scope.filterModel.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
                            $scope.filterModel.documentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
                            $scope.filterModel.documentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
                        }

                        if ($scope.dropdownCostCenter.model != null) {
                            $scope.filterModel.costCenter_Index = $scope.dropdownCostCenter.model.costCenter_Index;
                            $scope.filterModel.costCenter_Id = $scope.dropdownCostCenter.model.costCenter_Id;
                            $scope.filterModel.costCenter_Name = $scope.dropdownCostCenter.model.costCenter_Name;
                        }

                        // if ($scope.dropdownStorageLoc.model != null) {
                        //     $scope.filterModel.storageLoc_Index = $scope.dropdownStorageLoc.model.storageLoc_Index;
                        //     $scope.filterModel.storageLoc_Id = $scope.dropdownStorageLoc.model.storageLoc_Id;
                        //     $scope.filterModel.storageLoc_Name = $scope.dropdownStorageLoc.model.storageLoc_Name;
                        // }


                        if ($scope.filterModel.planGoodsIssue_Date == undefined || $scope.filterModel.planGoodsIssue_Date == "") {
                            pageLoading.hide();
                            dpMessageBox.alert(
                                {
                                    title: 'แจ้งเตือน',
                                    message: 'กรุณาเลือกวันที่ใบสั่งซื้อสินค้า!'
                                }
                            )
                            return "";
                            pageLoading.hide();
                        }
                        if ($scope.filterModel.documentType_Name == undefined || $scope.filterModel.documentType_Index == "") {
                            pageLoading.hide();
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'กรุณาเลือกทะเบียนประเภทเอกสาร'
                                }
                            )
                            return "";
                            pageLoading.hide();
                        }

                        if ($scope.filterModel.owner_Name == undefined || $scope.filterModel.owner_Name == "") {
                            pageLoading.hide();
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'กรุณาเลือกเจ้าของสินค้า!'
                                }
                            )
                            return "";
                            pageLoading.hide();
                        }
                        if ($scope.filterModel.owner_Id == undefined || $scope.filterModel.owner_Id == "") {
                            pageLoading.hide();
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'ไม่พบเจ้าของสินค้า!'
                                }
                            )
                            return "";
                            pageLoading.hide();
                        }
                    }

                    if (i == 1) {
                        if ($scope.filterModel.listplanGoodsIssueItemViewModel == undefined || $scope.filterModel.listplanGoodsIssueItemViewModel.length == 0) {
                            pageLoading.hide();
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'ต้องเพิ่มสินค้าอย่างน้อย 1 รายการ'
                                }
                            )
                            return "";
                            pageLoading.hide();
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

            $scope.$watch('filterItemModel.qty', function () {
                if ($scope.filterItemModel.qty != null && $scope.filterItemModel.qty != "" && $scope.filterItemModel.qty != undefined) {
                    var myInput = document.querySelector('#fixed1');
                    myInput.value = myInput.value.replace(/(\.\d{3})\d+/g, '$1');
                }
            });

            $scope.uploadFile = {
                url: webServiceAPI.PlanGI + "PlanGoodsIssue/importFileOutbound",
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
                        param.documents.push({ path: resp.data.value, urlAttachFile: resp.data.url, type: "PlanGoodsIssue", filename: resp.data.url.replace(/^.*[\\\/]/, ''), isDelete: false });
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
                $scope.click = 1;

                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.dropdownDocumentType();
                $scope.dropdownItemStatus();
                $scope.dropdownProductconversion();
                // $scope.dropdownCostCenter();
                $scope.dropdownRoute();
                $scope.dropdownSubRoute();
                $scope.dropdownRound();
                $scope.dropdownShippingMethod();
                $scope.dropdownShippingTerms();
                $scope.dropdownPaymentType();
                // $scope.dropdownStorageLoc();
                $scope.dropdownWarehouse();
                $scope.dropdownshipcon();

            };
            init();
        }
    })
})();