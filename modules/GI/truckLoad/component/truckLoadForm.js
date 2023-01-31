(function () {
    'use strict'

    app.component('truckLoadForm', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/truckLoad/component/truckLoadForm.html",
        bindings: {
            isLoading: '=?',
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, truckLoadFactory, truckLoadItemFactory, webServiceAPI) {
            var $vm = this;
            var defer = {};
            var viewModel = truckLoadFactory;
            var _viewModel = truckLoadItemFactory;
            $scope.filterModel = {};
            $vm.isFilterTable = true;
            $scope.onShow = false;
            $scope.filterItemModel = {};
            $scope.DataModel = {};
            $scope.msg = dpMessageBox;
            $scope.imagesModel = {};

            var d = new Date();
            $scope.date = formatDate(d);

            // $scope.clickTab = function (tab) {

            //     if (tab == 1) {
            //         $scope.colortab1 = "#FDFEFE";
            //         $scope.colortab2 = "#D3D3D3";
            //     }
            //     else if (tab == 2) {
            //         $scope.colortab1 = "#D3D3D3";
            //         $scope.colortab2 = "#FDFEFE";
            //     }
            //     $scope.click = tab;
            // }

            $scope.clickTab = function (tab) {
                $scope.click = tab;
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

            $vm.onShow = async function (param) {
                $scope.defaultStep();
                defer = $q.defer();
                $scope.DataModel.create_By = $scope.userName;
                $scope.images = {};
                $scope.filterModel = {};

                $scope.filterModel.start_load = $scope.date;
                $scope.filterModel.end_load = $scope.date;
                $scope.filterModel.truckLoad_Date = getToday();
                if (param != undefined) {
                    await viewModel.find(param.truckLoad_Index).then(function (res) {
                        pageLoading.hide()
                        $scope.filterModel.truckLoad_Index = param.truckLoad_Index;
                        $scope.DataModel.truckLoad_Index = param.truckLoad_Index;

                        $scope.filterModel = res.data;
                        $scope.filterModel.log_udf_2 = getToday();
                        $scope.filterModel.log_udf_3 = getTime();
                        $scope.buttons.add = false;
                        $scope.buttons.update = true;

                        // var vehicleCompany = $scope.dropdownVehicleCompany
                        // const resultsVehicleCompany = vehicleCompany.filter((vehicleCompany) => {
                        //     return vehicleCompany.vehicleCompany_Index == res.data.vehicleCompany_Index;
                        // })
                        // $scope.dropdownVehicleCompany.model = resultsVehicleCompany[0];

                        // var vehicleCompanyType = $scope.dropdownVehicleCompanyType
                        // const resultsvehicleCompanyType = vehicleCompanyType.filter((vehicleCompanyType) => {
                        //     return vehicleCompanyType.vehicleCompanyType_Index == res.data.vehicleType_Index;
                        // })
                        // $scope.dropdownVehicleCompanyType.model = resultsvehicleCompanyType[0];


                        var vehicleType = $scope.dropdownVehicleType
                        const resultsvehicleType = vehicleType.filter((vehicleType) => {
                            return vehicleType.vehicleType_Index == res.data.vehicleType_Index;
                        })
                        $scope.dropdownVehicleType.model = resultsvehicleType[0];



                        if ($scope.filterModel.documentStatus == 1 || $scope.filterModel.documentStatus == 2 || $scope.filterModel.documentStatus == -1 || $scope.filterModel.documentStatus == 3)
                            $scope.buttons.update = false;

                        truckLoadItemFactory.find(param.truckLoad_Index).then(function (res) {
                            $scope.filterModel.listTruckLoadItemViewModel = res.data;

                        });


                        truckLoadItemFactory.findDetail(param.truckLoad_Index).then(function (res) {
                            $scope.filterModel.listTruckLoadItemDetailViewModel = res.data;
                        });
                    });
                }
                else {
                    $scope.filterModel.log_udf_2 = getToday();
                    $scope.filterModel.log_udf_3 = getTime();
                    $scope.DataModel.truckLoad_Index = GenIndex();
                }
                $scope.onShow = true;
                return defer.promise;
            };

            async function getdata(param) {
                await viewModel.find(param.truckLoad_Index).then(function (res) {
                    pageLoading.hide()
                    $scope.filterModel.truckLoad_Index = param.truckLoad_Index;
                    $scope.DataModel.truckLoad_Index = param.truckLoad_Index;

                    $scope.filterModel = res.data;
                    $scope.buttons.add = false;
                    $scope.buttons.update = true;


                    if ($scope.filterModel.documentStatus == 1 || $scope.filterModel.documentStatus == 2 || $scope.filterModel.documentStatus == -1 || $scope.filterModel.documentStatus == 3)
                        $scope.buttons.update = false;

                    truckLoadItemFactory.find(param.truckLoad_Index).then(function (res) {
                        $scope.filterModel.listTruckLoadItemViewModel = res.data;

                    });


                    truckLoadItemFactory.findDetail(param.truckLoad_Index).then(function (res) {
                        $scope.filterModel.listTruckLoadItemDetailViewModel = res.data;
                    });
                });
            }



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
                model.log_udf_4 =getToday();
                model.log_udf_5 =getTime();
                var listmodel = $scope.filterModel.listTruckLoadItemViewModel;

                $scope.filterModel.start_load = ""
                $scope.filterModel.end_load = ""

                // if ($scope.dropdownVehicleCompany.model) {
                //     $scope.filterModel.vehicleCompany_Index = $scope.dropdownVehicleCompany.model.vehicleCompany_Index;
                //     $scope.filterModel.vehicleCompany_Id = $scope.dropdownVehicleCompany.model.vehicleCompany_Id;
                //     $scope.filterModel.vehicleCompany_Name = $scope.dropdownVehicleCompany.model.vehicleCompany_Name;
                // } else {
                //     $scope.filterModel.vehicleCompany_Index = undefined;
                //     $scope.filterModel.vehicleCompany_Id = undefined;
                //     $scope.filterModel.vehicleCompany_Name = undefined;
                // }

                if ($scope.dropdownVehicleType.model) {
                    $scope.filterModel.vehicleType_Index = $scope.dropdownVehicleType.model.vehicleType_Index;
                    $scope.filterModel.vehicleType_Id = $scope.dropdownVehicleType.model.vehicleType_Id;
                    $scope.filterModel.vehicleType_Name = $scope.dropdownVehicleType.model.vehicleType_Name;
                } else {
                    $scope.filterModel.vehicleType_Index = undefined;
                    $scope.filterModel.vehicleType_Id = undefined;
                    $scope.filterModel.vehicleType_Name = undefined;
                }



                if ($scope.filterModel.truckLoad_Date == undefined || $scope.filterModel.truckLoad_Date == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณาเลือกวันที่ดำเนินการ'
                        }
                    )
                    return "";
                }

                if ($scope.filterModel.time_in != "" && $scope.filterModel.time_in != undefined) {
                    var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test($scope.filterModel.time_in);
                    if (isValid) {
                        $scope.filterModel.IsTime = true;
                    } else {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'รูปแบบเวลารถเข้าไม่ถูกต้อง !'
                            }
                        )
                        return "";
                    }
                }

                if ($scope.filterModel.time_out != "" && $scope.filterModel.time_out != undefined) {
                    var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test($scope.filterModel.time_out);
                    if (isValid) {
                        $scope.filterModel.IsTime = true;
                    } else {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'รูปแบบเวลารถออกไม่ถูกต้อง !'
                            }
                        )
                        return "";
                    }
                }

                // if ($scope.filterModel.start_load != "" && $scope.filterModel.start_load != undefined) {
                //     var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test($scope.filterModel.start_load);
                //     if (isValid) {
                //         $scope.filterModel.IsTime = true;
                //     } else {
                //         dpMessageBox.alert(
                //             {
                //                 ok: 'Close',
                //                 title: 'แจ้งเตือน',
                //                 message: 'รูปแบบเวลาเริ่มโหลดไม่ถูกต้อง !'
                //             }
                //         )
                //         return "";
                //     }
                // }

                // if ($scope.filterModel.end_load != "" && $scope.filterModel.end_load != undefined) {
                //     var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test($scope.filterModel.end_load);
                //     if (isValid) {
                //         $scope.filterModel.IsTime = true;
                //     } else {
                //         dpMessageBox.alert(
                //             {
                //                 ok: 'Close',
                //                 title: 'แจ้งเตือน',
                //                 message: 'รูปแบบเวลาโหลดเสร็จไม่ถูกต้อง !'
                //             }
                //         )
                //         return "";
                //     }
                // }

                if ($scope.filterModel.truckLoad_Date == undefined || $scope.filterModel.truckLoad_Date == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณาเลือกวันที่ดำเนินการ'
                        }
                    )
                    return "";
                }

                // if ($scope.filterModel.listTruckLoadItemViewModel == undefined || $scope.filterModel.listTruckLoadItemViewModel.length == 0) {
                //     dpMessageBox.alert(
                //         {
                //             ok: 'Close',
                //             title: 'แจ้งเตือน',
                //             message: 'ต้องเพิ่มเลขที่ใบเบิกสินค้าอย่างน้อย 1 รายการ'
                //         }
                //     )
                //     return "";
                // }

                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยัน',
                    message: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่ ?'
                }).then(function () {
                    model.truckLoad_Index = $scope.DataModel.truckLoad_Index;
                    model.documentType_Index = "971682A9-2083-4BF8-85C3-85AB966DDB66";
                    model.create_By = localStorageService.get('userTokenStorage');
                    model.operations = "ADD";
                    viewModel.add(model).then(
                        function success(res) {
                            if (res.data.message == true) {
                                model.operations = "ADD "+ res.data.document_No;
                                viewModel.savelogsRequest(model).then(function () {
                                });
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'บันทึกสำเร็จ',
                                        message: 'เลขที่ใบควบคุมรถ : ' + res.data.document_No
                                    }
                                )
                                $scope.filterModel = {};
                                $scope.dropdownVehicleType.model = {};
                                $scope.defaultStep();
                                defer.resolve();
                            }
                            else {
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: 'บันทึกไม่สำเร็จ'
                                    }
                                )
                            }

                        },
                        function error(response) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'บันทึกไม่สำเร็จ'
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
                model.log_udf_4 =getToday();
                model.log_udf_5 =getTime();
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยัน',
                    message: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่ ?'
                }).then(function () {

                    viewModel.find(model.truckLoad_Index).then(function (res) {

                        model.update_By = localStorageService.get('userTokenStorage');
                        model.operations = "EDIT " + model.truckLoad_No;
                        viewModel.add(model).then(
                            function success(res) {
                                viewModel.savelogsRequest(model).then(function () {
                                });

                                $vm.filterModel = res.config.data;
                                $vm.searchResultModel = res.config.data;
                                $scope.dropdownVehicleType.model = {};
                                $scope.filterModel = {};
                                $scope.defaultStep();
                                defer.resolve('-99');
                            },
                            function error(response) {
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: 'บันทึกไม่สำเร็จ'
                                    }
                                )
                            }
                        );

                        //}
                    });
                },
                    function error(param) {
                    });
            }

            $scope.$watch('filterItemModel.planGoodsIssue_Index', function () {
                if ($scope.filterItemModel.planGoodsIssue_Index != null && $scope.filterItemModel.planGoodsIssue_Index != ""
                    && $scope.filterItemModel.planGoodsIssue_Index != undefined) {

                    var model = {};
                    model.key = $scope.filterItemModel.planGoodsIssue_No;
                    viewModel.checkPlanGI(model).then(function success(res) {
                        var modelPlanGI = res.data;
                        $scope.filterItemModel.planGoodsIssue_Index = modelPlanGI.planGoodsIssue_Index;
                        $scope.filterItemModel.planGoodsIssue_Date = modelPlanGI.planGoodsIssue_Date;
                        $scope.filterItemModel.documentType_Name = modelPlanGI.documentType_Name;
                        $scope.filterItemModel.processStatus_Name = modelPlanGI.processStatus_Name;
                        $scope.filterItemModel.create_By = modelPlanGI.create_By;
                        $scope.filterItemModel.qty = modelPlanGI.qty;
                        $scope.filterItemModel.update_By = modelPlanGI.update_By;
                        $scope.filterItemModel.shipTo_Index = modelPlanGI.shipTo_Index;
                        $scope.filterItemModel.shipTo_Id = modelPlanGI.shipTo_Id;
                        $scope.filterItemModel.shipTo_Name = modelPlanGI.shipTo_Name;


                    },
                        function error(res) {

                        });

                }
            })


            $scope.back = function () {
                $scope.deleteuser = {};
                $scope.filterModel = {};
                $scope.DataModel = {};
                $scope.dropdownVehicleType.model = {};
                $scope.defaultStep();
                defer.resolve();
            }

            function formatDate(date) {
                var hours = date.getHours();
                var minutes = date.getMinutes();
                var ampm = hours >= 12 ? 'pm' : 'am';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                minutes = minutes < 10 ? '0' + minutes : minutes;
                var strTime = hours + ':' + minutes + ' ';
                return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + strTime;
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
                var isAddData = true;
                if (param.planGoodsIssue_Index == null) {
                    return "";
                }

                if (param.planGoodsIssue_No != "" || param.planGoodsIssue_No != null) {
                    var giNo = param.planGoodsIssue_No;
                    if ($scope.filterModel.listTruckLoadItemViewModel != undefined) {
                        angular.forEach($scope.filterModel.listTruckLoadItemViewModel, function (v, k) {

                            if (giNo == v.planGoodsIssue_No) {
                                isAddData = false;
                            }
                        });
                    }
                }

                if ($scope.filterModel.listTruckLoadItemViewModel == undefined) {
                    $scope.filterModel.listTruckLoadItemViewModel = $scope.filterModel.listTruckLoadItemViewModel || []
                    $scope.filterModel.listTruckLoadItemViewModel.push(angular.copy(param));
                    $scope.filterItemModel.planGoodsIssue_Index = null;
                    $scope.filterItemModel.planGoodsIssue_No = null;
                    $scope.filterItemModel.planGoodsIssue_Date = null;
                    $scope.filterItemModel.vehicleCompanyType_Name = null;
                    $scope.filterItemModel.processStatus_Name = null;
                    $scope.filterItemModel.create_By = null;
                    $scope.filterItemModel.update_By = null;
                    $scope.filterItemModel.shipTo_Index = null
                    $scope.filterItemModel.shipTo_Id = null;
                    $scope.filterItemModel.shipTo_Name = null;
                }
                else if ($scope.filterItemModel.rowItemIndex != undefined) {

                    $scope.filterModel.listTruckLoadItemViewModel[param.rowItemIndex].planGoodsIssue_Index = $scope.filterItemModel.planGoodsIssue_Index;
                    $scope.filterModel.listTruckLoadItemViewModel[param.rowItemIndex].planGoodsIssue_No = $scope.filterItemModel.planGoodsIssue_No;
                    $scope.filterItemModel.planGoodsIssue_Index = null;
                    $scope.filterItemModel.planGoodsIssue_No = null;
                    $scope.filterItemModel.planGoodsIssue_Date = null;
                    $scope.filterItemModel.vehicleCompanyType_Name = null;
                    $scope.filterItemModel.processStatus_Name = null;
                    $scope.filterItemModel.create_By = null;
                    $scope.filterItemModel.update_By = null;
                    $scope.filterItemModel.shipTo_Index = null
                    $scope.filterItemModel.shipTo_Id = null;
                    $scope.filterItemModel.shipTo_Name = null;

                }
                else {
                    var isAdd = $scope.filterModel.listTruckLoadItemViewModel.find((param) => {
                        return true;
                    })

                    var t = isAdd;

                    if (isAddData == true) {
                        $scope.filterModel.listTruckLoadItemViewModel.push(angular.copy(param));
                    }
                    $scope.filterItemModel.planGoodsIssue_Index = null;
                    $scope.filterItemModel.planGoodsIssue_No = null;
                    $scope.filterItemModel.planGoodsIssue_Date = null;
                    $scope.filterItemModel.vehicleCompanyType_Name = null;
                    $scope.filterItemModel.processStatus_Name = null;
                    $scope.filterItemModel.create_By = null;
                    $scope.filterItemModel.update_By = null;
                    $scope.filterItemModel.shipTo_Index = null
                    $scope.filterItemModel.shipTo_Id = null;
                    $scope.filterItemModel.shipTo_Name = null;
                }
            }

            $scope.editItem = function (index) {

                $scope.index = index;

                var ItemStatus = $scope.dropdownItemStatus
                const resultsItemStatus = ItemStatus.filter((ItemStatus) => {
                    return ItemStatus.itemStatus_Index == $scope.filterModel.listTruckLoadItemViewModel[index].itemStatus_Index;
                })
                $scope.dropdownItemStatus.model = resultsItemStatus[0];

                $scope.filterItemModel.product_Index = $scope.filterModel.listTruckLoadItemViewModel[index].product_Index;
                $scope.filterItemModel.product_Id = $scope.filterModel.listTruckLoadItemViewModel[index].product_Id;
                $scope.filterItemModel.product_Name = $scope.filterModel.listTruckLoadItemViewModel[index].product_Name;
                $scope.filterItemModel.qty = $scope.filterModel.listTruckLoadItemViewModel[index].qty;
                $scope.filterItemModel.weight = $scope.filterModel.listTruckLoadItemViewModel[index].weight;
                $scope.filterItemModel.ratio = $scope.filterModel.listTruckLoadItemViewModel[index].ratio;

                $scope.filterItemModel.documentItem_Remark = $scope.filterModel.listTruckLoadItemViewModel[index].documentItem_Remark;
                $scope.filterItemModel.rowItemIndex = index;
            }


            $scope.deleteItem = function (param, index) {
                param.splice(index, 1);
            }


            $scope.autoComplete = {
                autoKey: "AutoLoad/AutobasicSuggestion",
                owner: "AutoLoad/AutoOwnerfilter",
                GoodsIssue_No: "AutoLoad/autoGoodIssueNo",
                planGoodsIssue_No: "AutoLoad/autoPlanGoodIssueNo",
                vehicleCompanyType: "AutoLoad/AutovehicleCompanyTypefilter",
                processStatus: "AutoLoad/AutoStatusfilter",
                user: "AutoLoad/autoUser",
            };

            $scope.url = {
                TL: webServiceAPI.Load,
                Load: webServiceAPI.Load + "Upload/UploadImg",
            };


            $scope.defaultStep = function () {
                $scope.onShow = false;
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

                $scope.filterModel.start_load = $scope.date;
                $scope.filterModel.end_load = $scope.date;
            }



            function GenIndex() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                });
            }

            // $scope.dropdownVehicleCompanyType = function () {
            //     viewModel.dropdownVehicleCompanyType($scope.filterModel).then(function (res) {
            //         $scope.dropdownVehicleCompanyType = res.data;
            //     });
            // };

            // $scope.dropdownVehicleCompany = function () {
            //     viewModel.dropdownVehicleCompany($scope.filterModel).then(function (res) {
            //         $scope.dropdownVehicleCompany = res.data;
            //     });
            // };

            $scope.dropdownVehicleType = function () {
                viewModel.dropdownVehicleType($scope.filterModel).then(function (res) {
                    $scope.dropdownVehicleType = res.data;
                });
            };

            this.$onInit = function () {
                $scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');
                // $scope.dropdownVehicleCompanyType();
                // $scope.dropdownVehicleCompany();
                $scope.dropdownVehicleType();
                $scope.click = 1;


            };

        }
    })
})();