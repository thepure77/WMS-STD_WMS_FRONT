app.component('lpnManagement', {
    controllerAs: '$vm',
    templateUrl: 'modules/GR/LPN/lpnManagement.html',
    controller: function ($scope, $q, lpnFactory, $state, lpnItemFactory, dpMessageBox, localStorageService, pageLoading, webServiceAPI, goodsReceiveFactory, logsFactory, kMessageBox) {
        var $vm = this;
        var defer = {};
        var viewModel = lpnFactory;
        var viewItemModel = lpnItemFactory;
        $vm.isFilterTable = true;
        $scope.chkAll = {};
        var _viewModel = goodsReceiveFactory;
        $vm.showBack = false;

        $vm.$onInit = function () {
            let item = _viewModel.getParam();
            _viewModel.setParam(undefined);
            $scope.item = item;
            $scope.formData = {};
            $scope.model = {};
            $scope.filterModel = undefined // SET empty filterModel
            $scope.filterItemsModel = {}; // SET empty filterItemsModel
            $scope.model.goodsReceive_No = $scope.item;
            if ($scope.model.goodsReceive_No != undefined) {
                $scope.filterGR($scope.model);
            }
            $scope.userName = localStorageService.get('userTokenStorage');
            // insertLogsUser();
            if ($scope.item != undefined) {
                $vm.showBack =true
            }
        }

        // function insertLogsUser() {
        //     var userLogin = JSON.parse(localStorage.userlogin);
        //     var logs = {};
        //     //logs.log_Index
        //     //logs.userGroup_Index
        //     //logs.userGroup_Id
        //     logs.userGroup_Name = localStorage['userGroupName'];
        //     logs.user_Index = userLogin.user_Index;
        //     logs.user_Id = userLogin.user_Id;
        //     logs.user_Name = userLogin.user_Name;
        //     logs.first_Name = userLogin.first_Name;
        //     logs.last_Name = userLogin.last_Name;
        //     logs.menu_Index = "AB361CA7-1431-4478-9BF1-11BF2A55693B";
        //     //logs.menuType_Index
        //     //logs.menu_Id
        //     logs.menu_Name = "จัดการสินค้า ขาเข้า";
        //     logs.sub_Menu_Index = "066919AC-50DE-411C-8339-DD3065648A4E"
        //     //logs.sub_MenuType_Index
        //     //logs.sub_Menu_Id
        //     logs.sub_Menu_Name = "การสร้างป้ายกำกับสินค้า";
        //     logs.operations = "";
        //     //logs.ref_Document_Index
        //     //logs.ref_Document_No
        //     //logs.request_URL
        //     //logs.request_Body
        //     //logs.isActive
        //     //logs.isDelete
        //     //logs.isSystem
        //     logsFactory.SaveLogs(logs).then(function (res) {

        //     })
        // };

        $scope.show = {
            pagination: true
        }

        $scope.menu = [{
            "step": "1",
            "active": "active",
            "completed": "",
            "name": "Select item"
        },
        {
            "step": "2",
            "active": "",
            "completed": "",
            "name": "Gen Tag"
        }
        ];

        $scope.changeTableSize = function (perPage, tab) {

            if (tab == 1) {
                $scope.colortab1 = "#97bee7";
                $scope.colortab2 = "#FFFFFF";

                $scope.fronttab1 = "#FFFFFF";
                $scope.fronttab2 = "#97bee7";

            } else if (tab == 2) {
                $scope.colortab1 = "#FFFFFF";
                $scope.colortab2 = "#97bee7";

                $scope.fronttab1 = "#97bee7";
                $scope.fronttab2 = "#FFFFFF";
            }

            $scope.selected = tab;

            let ChangeTable = 1;
            $scope.model = $vm.filterModel;
            if (perPage != null || perPage != undefined) {
                $scope.model.perPage = perPage;
            }

            //var p = $scope.model;
            var p = $scope.filterModel;

            serchPage(p);
        }

        function serchPage(data) {

            if (data != null) {

                pageLoading.show();

                viewModel.filterGR(data).then(function (res) {
                    pageLoading.hide();
                    $scope.filterModel = res.data;
                    viewModel.getByGoodReceiveId($scope.filterModel.goodsReceive_Index).then(function (res) {
                        $scope.filterModel.listGoodsReceiveItemViewModels = res.data;
                    });
                });


                // viewModel.FilterSearch(data).then(function (res) {
                //     pageLoading.hide();
                //     if (res.data.length != 0 && res.data.length != undefined) {
                //         $vm.filterModel.totalRow = res.data[0].count;
                //         $vm.searchResultModel = res.data;

                //     }
                //     else {
                //         if (res.data.pagination != null) {
                //             $vm.filterModel.totalRow = res.data.pagination.totalRow;
                //             $vm.filterModel.currentPage = res.data.pagination.currentPage;
                //             $vm.searchResultModel = res.data.itemsPlanGR;

                //         }
                //     }
                // })
            }
        }

        // $('#activate-step-1').on('click', function (e) {
        //     $('ul.wizard-steps li a[href="#step-2"]').trigger('click');
        // })

        $scope.checkRePrint = function () {
            $scope.formData = $scope.formData || {};

            $scope.formData.lpnRunning = null;
            $scope.formData.lpnRunningEnd = null;
        }
        $scope.filterModels = function () {
            $scope.filterModel.Tag_Status = 1;
            $scope.filterModel.isDelete = 0;
            $scope.filterModel.isSystem = 0;
            $scope.filterModel.StatusId = 0;
        };
        // $scope.goToPrint = function () {
        //     var model = $scope.filterModel;
        //     $scope.filterModel.create_By = localStorageService.get('userTokenStorage');
        //     if (model.PrintNumber !== undefined && model.PrintNumber != "") {
        //         dpMessageBox.confirm({
        //             ok: 'Yes',
        //             cancel: 'No',
        //             title: 'Confirm ?',
        //             message: 'Do you want to Running Number !'
        //         }).then(function () {
        //             Add(model).then(function success(res) {
        //                 $scope.filter();
        //                 $scope.popupReport.onClick(res);
        //                 $vm.filterModel = res.config.data;
        //                 $vm.searchResultModel = res.config.data;
        //             }, function error(param) {
        //                 dpMessageBox.alert(param).then(function (param) { }, function (param) { });
        //             });
        //         });
        //     }
        //     else
        //         (
        //             dpMessageBox.alert({
        //                 ok: 'Close',
        //                 title: 'Alert',
        //                 message: 'กรุณากรอก LPN No.'
        //             })
        //         )
        // }

        // function Add(param) {

        //     let deferred = $q.defer();
        //     let item = $scope.filterModels();
        //     item = param;
        //     item.create_By = localStorageService.get('userTokenStorage');
        //     viewModel.add(item).then(
        //         function success(results) {
        //             dpMessageBox.alert({
        //                 ok: 'Close',
        //                 title: 'Information.',
        //                 message: results.data
        //             })
        //             deferred.resolve(results);

        //         },
        //         function error(response) {
        //             deferred.reject(response);
        //         }
        //     );
        //     return deferred.promise;
        // }

        $scope.search = function (model) {
            var deferred = $q.defer();
            pageLoading.show();
            viewModel.filter(model).then(
                function success(res) {
                    deferred.resolve(res);
                    pageLoading.hide(1000);
                },
                function error(response) {
                    deferred.reject(response);
                    pageLoading.hide(1000);
                });
            return deferred.promise;
        }

        $scope.filterGR = function (param) {

            $scope.filterModel = $scope.filterModel || {};
            $scope.model = param;
            defer = $q.defer();
            if ($scope.filterModel != null) {
                // $scope.filterModel = {};
            }
            $scope.onShow = true;
            if ($scope.model != undefined) {
                pageLoading.show();
                viewModel.filterGR($scope.model).then(function (res) {
                    pageLoading.hide();
                    $scope.filterModel = res.data;
                    pageLoading.show();
                    viewModel.getByGoodReceiveId($scope.filterModel.goodsReceive_Index).then(function (res) {
                        pageLoading.hide();

                        $scope.filterModel.listGoodsReceiveItemViewModels = res.data;
                        rebindGRI();
                        rebindTag();
                    }, function error(response) {
                        pageLoading.hide();
                    });
                },
                    function error(response) {
                        pageLoading.hide();
                    });
            } else {
                $scope.buttons.add = true;
                if ($scope.buttons.add) {
                    // ownerModel.popupSearch({}).then(function (res) {
                    //     let owner = res.data.find(function (value) {
                    //         return value.owner_Index.toUpperCase() == "8B8B6203-A634-4769-A247-C0346350A963";
                    //     })
                    //     $scope.filterModel.owner_Name = owner.owner_Name;
                    //     $scope.filterModel.owner_Id = owner.owner_Id;
                    //     $scope.filterModel.owner_Index = owner.owner_Index;
                    //     $scope.filterModel.ownerAddress = owner.ownerAddress;
                    // })
                }
                $scope.buttons.update = false;
            }
            return defer.promise;
        };

        $scope.check = function (param) {

            if ($scope.filterModel.listGoodsReceiveItemViewModels[param].isCheck == true) {
                $scope.filterModel.listGoodsReceiveItemViewModels[param].isCheck = false;
            } else {
                $scope.filterModel.listGoodsReceiveItemViewModels[param].isCheck = true;
            }

        }

        $scope.checkItems = function (param) {
            if ($scope.filterItemsModel.genTagType == 2) {
                for (let index = 0; index < $scope.filterItemsModel.items.length; index++) {
                    if (index == param) {
                        if ($scope.filterItemsModel.items[index].selected == true) {
                            $scope.filterItemsModel.items[index].isCheck = true;
                        }
                        else {
                            $scope.filterItemsModel.items[index].isCheck = false;
                        }
                    }
                    else {
                        $scope.filterItemsModel.items[index].isCheck = false;
                        $scope.filterItemsModel.items[index].selected = false;
                    }
                }
            }
            else {
                if ($scope.filterItemsModel.items[param].isCheck == true && $scope.chkAll.checkAllItems == false) {
                    $scope.filterItemsModel.items[param].isCheck = false;
                } else {
                    $scope.filterItemsModel.items[param].isCheck = true;
                    $scope.filterItemsModel.items[param].isGenTag = false;
                }
            }
        }

        $scope.checkTagItems = function (param, isuse) {
            if ($scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel[param].isCheck == true && $scope.chkAll.checkAllTagItems == false) {
                $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel[param].isCheck = false;
            } else {
                $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel[param].isCheck = true;
                $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel[param].isGenTag = false;
            }
            $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel[param].isCheck = isuse;
        }

        function rebindGRI() {
            $scope.filterItemsTagModel = {};
            $scope.filterItemsModel.goodsReceive_No = $scope.filterModel.goodsReceive_No;
            $scope.filterItemsModel.goodsReceive_Date = $scope.filterModel.goodsReceive_Date;
            $scope.filterItemsModel.processStatus_Name = $scope.filterModel.processStatus_Name;
            viewModel.getByGoodReceiveId($scope.filterModel.goodsReceive_Index).then(function (res) {
                debugger
                var modelItems = res.data;
                $scope.filterItemsModel.items = modelItems.filter(c => parseFloat(c.remainingQty) > 0);

                let dataList = $scope.filterItemsModel.items;

                for (var i = 0; i <= dataList.length - 1; i++) {
                    var remainingQty = parseFloat($scope.filterItemsModel.items[i].remainingQty);

                    $scope.filterItemsModel.items[i].remainingQty = remainingQty.toFixed(2);
                    $scope.filterItemsModel.items[i].remainingQty = parseFloat($scope.filterItemsModel.items[i].remainingQty);
                }
            });
        }

        function rebindTag() {
            $scope.chkAll.checkAllItems = false;
            $scope.chkAll.checkAllTagItems = false;
            viewItemModel.filterTagItem($scope.filterItemsModel).then(function (res) {
                $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel = res.data;

                let dataList = $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel;

                for (var i = 0; i <= dataList.length - 1; i++) {
                    var qty = parseFloat($scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel[i].qty);

                    $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel[i].qty = qty.toFixed(2);
                    $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel[i].qty = parseFloat($scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel[i].qty);
                }
            });
        }

        // $scope.next = function (data) {
        //     $scope.filterItemsModel = {};
        //     if ($scope.filterModel == undefined) {
        //         dpMessageBox.alert({
        //             ok: 'Close',
        //             title: 'Message',
        //             message: 'กรุณากรอกเลขที่ใบรับ'
        //         });
        //     } else {
        //         rebindGRI();
        //         rebindTag();
        //         var validateChk = "";

        //         if ($scope.filterItemsModel != undefined && $scope.filterItemsTagModel != undefined) {
        //             for (var i = 0; i < $scope.menu.length; i++) {
        //                 if ($scope.menu[i].active == "active") {
        //                     $scope.menu[i].active = "";
        //                     $scope.menu[i].completed = "completed";
        //                     i++;
        //                     $scope.menu[i].active = "active";
        //                     $scope.menu_width = i * 100; //กำหนดความกว้างของเส้นเชื่อม
        //                     $scope.menu_name = $scope.menu[i].name;
        //                 }
        //             }
        //         }
        //     }

        //     pageLoading.hide();
        // }

        $scope.addLocation = function (param) {

            var modelTagI = $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel.filter(c => c.isCheck == true)

            let dataList = modelTagI;
            for (var i = 0; i <= dataList.length - 1; i++) {
                dataList[i].suggest_Location_Name = param.name;
            }

            $scope.tagModel = $scope.tagModel || {};
            $scope.tagModel.listLPNItemViewModel = dataList;
            $scope.tagModel.update_By = $scope.userName;
            pageLoading.show();
            $scope.tagModel.operations = "CONFIRM_TAG_LOCATION";
            viewItemModel.confirmTagItemLocation($scope.tagModel).then(function (res) {
                pageLoading.hide();
                if (res.data == 'S') {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'เพิ่มตำแหน่งจัดเก็บ',
                        message: 'เพิ่มตำแหน่งสำเร็จ'
                    });

                    $scope.filterModel.log_udf_4 =getToday();
                    $scope.filterModel.log_udf_5 =getTime();
                    $scope.filterModel.operations = "Confirm Location "+ param.name +" | GR "+$scope.filterModel.goodsReceive_No;

                } else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: res.data
                    });
                }
                rebindTag();
            });
        }

        $scope.sugesstion = function (param) {

            var modelTagI = $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel.filter(c => c.isCheck == true)

            $scope.tagModel = $scope.tagModel || {};
            $scope.tagModel.listLPNItemViewModel = modelTagI;
            $scope.tagModel.update_By = $scope.userName;
            pageLoading.show();
            $scope.tagModel.operations = "SUGGESTION_LOCATION";
            viewItemModel.sugesstionLocation($scope.tagModel).then(function (res) {
                pageLoading.hide();
                if (res.data == "สินค้ายังไม่ได้ตั้งค่าแนะนำตำแหน่งจัดเก็บ") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: res.data
                    });
                }
                else {
                    // var count = res.config.data.listLPNItemViewModel.length;
                    // $scope.nums = [];
                    // $scope.loadRepeat = function () {
                    //     pageLoading.show();
                    //     $timeout(function () {
                    //         for (i = 0; i < count; i++) {
                    //             $scope.nums[i] = i;
                    //         }
                    //         pageLoading.hide();
                    //     }, 500);  // artificial wait of 1/2 second
                    // }
                    debugger
                    let message = res.data.split(",");
                    kMessageBox.alert({
                        ok: 'Close',
                        title: 'ตำแหน่งจัดเก็บ',
                        messageNewLine: message
                    });
                }

                // if(res.data == 'S')
                // {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'Add Location',
                //         message: 'เพิ่มตำแหน่งสำเร็จ'
                //     });
                // } else {

                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'Information',
                //         message: 'ไม่พบตำแหน่งที่กำหนด'
                //     });
                // }
                rebindTag();
            });
        }

        $scope.printTag = function (data) {
            var validateChk = "";

            for (let index = 0; index < $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel.length; index++) {
                if ($scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel[index].isCheck) {
                    validateChk = validateChk + ' ' + $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel[index].tag_No;
                }
            }

            if (validateChk == "") {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Close Document',
                    message: 'Please choose Tag No'
                });
                return;
            } else {
                var item = angular.copy($scope.filterModel);
                var idx = [];
                var modelPack = {};
                angular.forEach(item.items, function (v, k) {
                    if (v.check) {
                        idx.push(v)
                    }
                });

                var modelTagI = $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel.filter(c => c.isCheck == true)
                $scope.tagModel = $scope.tagModel || {};
                $scope.tagModel.listLPNItemViewModel = modelTagI;
                pageLoading.show();
                $scope.tagModel.operations = "PRINT";
                viewItemModel.printTag($scope.tagModel).then(
                    function success(results) {
                        pageLoading.hide();
                        $scope.popupReport.onClick(results);
                        deferred.resolve(results);
                    },
                    function error(response) {
                        pageLoading.hide();
                        dpMessageBox.alert({
                            title: 'Information.',
                            message: "Connect Service Fail."
                        })
                        deferred.reject(response);
                    }
                );
            }
        }

        $scope.deleteTag = function (data) {
            var validateChk = "";

            for (let index = 0; index < $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel.length; index++) {
                if ($scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel[index].isCheck) {
                    validateChk = validateChk + ' ' + $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel[index].tag_No;
                }
                if ($scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel[index].tag_Status != 0
                    && $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel[index].selected == true) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'ไม่สามารถลบพาเลท ที่จัดเก็บแล้วได้'
                    });
                    return;
                }
            }

            if (validateChk == "") {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'แจ้งเตือน',
                    message: 'กรุณาเลือกเลขที่พาเลท'
                });
                return;
            } else {

                var modelTagI = $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel.filter(c => c.isCheck == true)
                $scope.tagModel = $scope.tagModel || {};
                $scope.tagModel.listLPNItemViewModel = modelTagI;

                if ($scope.tagModel.listLPNItemViewModel !== undefined && $scope.tagModel.listLPNItemViewModel.length > 0) {
                    dpMessageBox.confirm({
                        title: 'ยืนยันข้อมูล ?',
                        message: 'คุณต้องการลบพาเลทใช่หรือไม่'
                    }).then(function () {
                        pageLoading.show();
                        $scope.tagModel.operations = "DELETE_TAG";
                        $scope.tagModel.cancel_By = $scope.userName;
                        viewItemModel.deleteTagItem($scope.tagModel).then(
                            function success(results) {

                                if (results.config.data.operations == "CAN_NOT_DELETE") {
                                    pageLoading.hide();
                                    dpMessageBox.alert({
                                        title: 'แจ้งเตือน.',
                                        message: "ไม่สามารถลบพาเลท"
                                    })
                                }
                                else {
                                    pageLoading.hide();
                                    dpMessageBox.alert({
                                        title: 'แจ้งเตือน.',
                                        message: "ลบพาเลทสำเร็จ"
                                    })
                                }


                                rebindGRI();
                                rebindTag();

                                deferred.reject(response);
                            },
                            function error(response) {
                                pageLoading.hide();
                                dpMessageBox.alert({
                                    title: 'Information.',
                                    message: "Connect Service Fail."
                                })
                                deferred.reject(response);
                            }
                        );
                    });
                } else
                    (
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Alert',
                            message: 'กรุณากรอกเลขที่พาเลท'
                        })
                    )
            }
        }

        $scope.assignTag = function (data) {
            debugger
            viewModel.CheckType_Po_SubContrack($scope.filterItemsModel).then(function success(res) {
                if (res.data == true) {

                    $scope.filterModel.log_udf_2 =getToday();
                    $scope.filterModel.log_udf_3 =getTime();
                    $scope.filterModel.operations = "ADD ";

                    if ($scope.filterItemsModel.genTagType == undefined || $scope.filterItemsModel.genTagType == '') {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: "กรุณาเลือกประเภทการสร้างพาเลท"
                        })
                    } else {
        
                        if ($scope.filterItemsModel.items.filter(c => c.isCheck).length <= 0) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: "กรุณาเลือกพาเลท"
                            })
                        } else {
                            if ($scope.filterItemsModel.genTagType == 1) {
                                var modelTagItems = $scope.filterItemsModel.items.filter(c => c.isCheck);
        
                                angular.forEach(modelTagItems, function (v, k) {
                                    modelTagItems[k].ref_Process_Index = "58400298-4347-488C-AF71-76B78A44232D";
                                });
        
                                $scope.filterItemsTagModel = $scope.filterItemsTagModel || {};
                                $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel = {};
                                $scope.filterItemsTagModel.goodsReceive_Index = $scope.filterModel.goodsReceive_Index;
                                $scope.filterItemsTagModel.create_by = localStorageService.get('userTokenStorage');
                                $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel = modelTagItems;
                                if (modelTagItems.length > 0) {
                                    pageLoading.show();
                                    $scope.filterItemsTagModel.operations = "ADD";
                                    viewModel.createTagItems($scope.filterItemsTagModel).then(function success(res) {
                                        pageLoading.hide();
                                        rebindGRI();
                                        rebindTag();
                                    });
                                }
                            } else if ($scope.filterItemsModel.genTagType == 2) {
                                $scope.popuponeToManyPopup.onClick($scope.filterItemsModel, $scope.filterItemsTagModel.tag_Index);
                            } else if ($scope.filterItemsModel.genTagType == 3) {
                                $scope.popupmanyToOne.onClick($scope.filterItemsModel, $scope.filterItemsTagModel.tag_Index);
                            }
                            else if ($scope.filterItemsModel.genTagType == 4) {
                                var modelTagItems = $scope.filterItemsModel.items.filter(c => c.isCheck);
        
                                angular.forEach(modelTagItems, function (v, k) {
                                    modelTagItems[k].ref_Process_Index = "58400298-4347-488C-AF71-76B78A44232D";
                                });
        
                                $scope.filterItemsTagModel = $scope.filterItemsTagModel || {};
                                $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel = {};
                                $scope.filterItemsTagModel.goodsReceive_Index = $scope.filterModel.goodsReceive_Index;
                                $scope.filterItemsTagModel.create_by = localStorageService.get('userTokenStorage');
                                $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel = modelTagItems;
                                if (modelTagItems.length > 0) {
                                    pageLoading.show();
                                    $scope.filterItemsTagModel.operations = "ADD";
                                    viewModel.createPerTagItems($scope.filterItemsTagModel).then(function success(res) {
                                        pageLoading.hide();
                                        if (res.data == "qty_Per_Tag") {
                                            dpMessageBox.alert({
                                                ok: 'Close',
                                                title: 'แจ้งเตือน',
                                                message: "Qty/PerPallet 0"
                                            })
                                        }
        
        
                                        rebindGRI();
                                        rebindTag();
                                    });
                                }
                            }
        
        
                            var validateChk = "";
                        }
                    }
                 }
                else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: "GR ไม่ถูกกรอก Component"
                    })
                }
            });

            

        }

        $scope.previous = function () {
            $scope.filterItemsModel = {}; // SET empty filterItemsModel

            for (var i = 0; i < $scope.menu.length; i++) {
                if ($scope.menu[i].active == "active") {
                    $scope.menu[i].active = "";
                    $scope.menu[i].completed = "";

                    i--;
                    $scope.menu[i].active = "active";
                    $scope.menu[i].completed = "";
                    $scope.menu_width = i * 100; //กำหนดความกว้างของเส้นเชื่อม
                    $scope.menu_name = $scope.menu[i].name;
                }
            }
        }


        $scope.clearData = function () {

            $scope.filterModel.PrintNumber = "";
        }

        $scope.printTagPutaway = function (param) {
            var validateChk = "";

            for (let index = 0; index < $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel.length; index++) {
                if ($scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel[index].isCheck) {
                    validateChk = validateChk + ' ' + $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel[index].tag_No;
                }
            }

            if (validateChk == "") {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'แจ้งเตือน',
                    message: 'กรุณาเลือกเลขที่พาเลท'
                });
                return;
            } else {
                pageLoading.show();
                var modelTagP = $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel.filter(c => c.selected == true)
                $scope.tagModel = $scope.tagModel || {};
                $scope.tagModel.listLPNItemViewModel = modelTagP;
                param.operations = "PRINT";
                viewItemModel.PrintReportTagPutaway($scope.tagModel).then(
                    function success(results) {
                        pageLoading.hide();
                        $scope.popupReport.onClick(results);
                        deferred.resolve(results);
                    },
                    function error(response) {
                        pageLoading.hide();
                        dpMessageBox.alert({
                            title: 'Information.',
                            message: "Connect Service Fail."
                        })
                        deferred.reject(response);
                    });
            }
        }



        $scope.popupPrintTagReport = {
            onShow: false,
            delegates: {},
            onClick: function (param) {
                var validateChk = "";

                for (let index = 0; index < $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel.length; index++) {
                    if ($scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel[index].isCheck) {
                        validateChk = validateChk + ' ' + $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel[index].tag_No;
                    }
                }

                if (validateChk == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณาเลือกเลขที่พาเลท'
                    });
                    return;
                } else {
                    var item = angular.copy($scope.filterModel);
                    var idx = [];
                    var modelPack = {};
                    angular.forEach(item.items, function (v, k) {
                        if (v.check) {
                            idx.push(v)
                        }
                    });
                    var modelTagI = $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel.filter(c => c.selected == true)
                    $scope.tagModel = $scope.tagModel || {};
                    $scope.tagModel.listLPNItemViewModel = modelTagI;
                    $scope.popupPrintTagReport.onShow = !$scope.popupPrintTagReport.onShow;
                    $scope.popupPrintTagReport.delegates.set($scope.tagModel);
                }
            },
            config: {
                title: "ReportView"
            },
            invokes: {
                add: function (param) { },
                edit: function (param) { },
                selected: function (param) {
                    if (param.size == "A5") {
                        pageLoading.show();
                        $scope.tagModel.operations = "PRINT_TAG_A5";
                        viewItemModel.PrintTagA5($scope.tagModel).then(
                            function success(results) {
                                pageLoading.hide();
                                $scope.popupReport.onClick(results);
                                deferred.resolve(results);
                            },
                            function error(response) {
                                pageLoading.hide();
                                dpMessageBox.alert({
                                    title: 'Information.',
                                    message: "Connect Service Fail."
                                })
                                deferred.reject(response);
                            }
                        );
                    }
                    if (param.size == "A3") {
                        pageLoading.show();
                        $scope.tagModel.operations = "PRINT_TAG_A3";
                        viewItemModel.PrintTagA3($scope.tagModel).then(
                            function success(results) {
                                pageLoading.hide();
                                $scope.popupReport.onClick(results);
                                deferred.resolve(results);
                            },
                            function error(response) {
                                pageLoading.hide();
                                dpMessageBox.alert({
                                    title: 'Information.',
                                    message: "Connect Service Fail."
                                })
                                deferred.reject(response);
                            }
                        );
                    } else if (param.size == "A2") {
                        pageLoading.show();
                        $scope.tagModel.operations = "PRINT_TAG_A2";
                        viewItemModel.PrintTagA2($scope.tagModel).then(
                            function success(results) {
                                pageLoading.hide();
                                $scope.popupReport.onClick(results);
                                deferred.resolve(results);
                            },
                            function error(response) {
                                pageLoading.hide();
                                dpMessageBox.alert({
                                    title: 'Information.',
                                    message: "Connect Service Fail."
                                })
                                deferred.reject(response);
                            }
                        );
                    }
                }
            }
        };

        $scope.popupReport = {
            onShow: false,
            delegates: {},
            onClick: function (param) {
                $scope.popupReport.onShow = !$scope.popupReport.onShow;
                $scope.popupReport.delegates.reportPopup(param);
            },
            config: {
                title: "ReportView"
            },
            invokes: {
                add: function (param) { },
                edit: function (param) { },
                selected: function (param) { }
            }
        };

        $scope.popupmanyToOne = {
            onShow: false,
            delegates: {},
            onClick: function (param, index) {

                $scope.popupmanyToOne.onShow = !$scope.popupmanyToOne.onShow;
                $scope.popupmanyToOne.delegates.manyToOnePopup(param, index);
            },
            config: {
                title: "manyToOne"
            },
            invokes: {
                add: function (param) { },
                edit: function (param) { },
                selected: function (param) {
                    $scope.filterModel.operations = "ADD";
                    viewModel.createTagHeader($scope.filterModel).then(
                        function success(res) {
                            $scope.filterItemsTagModel = $scope.filterItemsTagModel || {};
                            $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel = {};
                            $scope.filterItemsTagModel.tag_Index = res.data;
                            $scope.filterItemsTagModel.create_by = localStorageService.get('userTokenStorage');
                            if ($scope.filterItemsModel.genTagType == 3) {
                                //var modelTagItems = $scope.filterItemsModel.items.filter(c => c.isCheck);
                                //modelTagItems.map(c => c.isCheck = false);

                                angular.forEach(param, function (v, k) {
                                    param[k].ref_Process_Index = "58400298-4347-488C-AF71-76B78A44232D";
                                });

                                $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel = param;

                                if (param.length > 0) {
                                    pageLoading.show();
                                    $scope.filterItemsTagModel.operations = "ADD";
                                    viewModel.createTagItems($scope.filterItemsTagModel).then(function success(res) {
                                        pageLoading.hide();
                                        rebindGRI();
                                        rebindTag();
                                    });

                                }
                            }
                        },
                        function error(response) {
                            $scope.model = {};
                        });
                }
            }
        };

        $scope.popuponeToManyPopup = {
            onShow: false,
            delegates: {},
            onClick: function (param, index) {

                $scope.popuponeToManyPopup.onShow = !$scope.popuponeToManyPopup.onShow;
                $scope.popuponeToManyPopup.delegates.oneToManyPopup(param, index);
            },
            config: {
                title: "oneToMany"
            },
            invokes: {
                add: function (param) { },
                edit: function (param) { },
                selected: function (param) {
                    var modelTagItems = $scope.filterItemsModel.items.filter(c => c.isCheck);

                    angular.forEach(modelTagItems, function (v, k) {
                        modelTagItems[k].ref_Process_Index = "58400298-4347-488C-AF71-76B78A44232D";
                    });

                    $scope.filterItemsTagModel = $scope.filterItemsTagModel || {};
                    $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel = {};
                    $scope.filterItemsTagModel.goodsReceive_Index = $scope.filterModel.goodsReceive_Index;
                    //$scope.filterItemsTagModel.tag_Index = res.data;
                    $scope.filterItemsTagModel.create_by = localStorageService.get('userTokenStorage');

                    //var modelTagItems = $scope.filterItemsModel.items.filter(c => c.isCheck);
                    //modelTagItems.map(c => c.isCheck = false);
                    $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel = modelTagItems;
                    $scope.filterItemsTagModel.qtyGenTag = param;
                    if (modelTagItems.length > 0) {
                        pageLoading.show();
                        $scope.filterItemsTagModel.operations = "ADD";
                        viewModel.createTagItemsOneToMany($scope.filterItemsTagModel).then(function success(res) {
                            pageLoading.hide();
                            rebindGRI();
                            rebindTag();
                        });
                    }
                }
            }
        };

        $scope.detectCheckAllItems = function () {

            if ($scope.chkAll.checkAllItems === true) {
                angular.forEach($scope.filterItemsModel.items, function (v, k) {
                    $scope.filterItemsModel.items[k].selected = true;
                    $scope.checkItems(k);
                });
            } else {
                angular.forEach($scope.filterItemsModel.items, function (v, k) {
                    $scope.filterItemsModel.items[k].selected = false;
                    $scope.checkItems(k);
                });
            }
        }

        $scope.detectCheckAllTagItems = function () {

            if ($scope.chkAll.checkAllTagItems === true) {
                angular.forEach($scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel, function (v, k) {
                    $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel[k].selected = true;
                    $scope.checkTagItems(k, true);
                });
            } else {
                angular.forEach($scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel, function (v, k) {
                    $scope.filterItemsTagModel.listPlanGoodsReceiveItemViewModel[k].selected = false;
                    $scope.checkTagItems(k, false);
                });
            }
        }

        $scope.finished = function () {

            $state.go('wms.gr_summary', {});
        }

        function validate() {
            let defer = $q.defer();
            let valid = true;

            defer.resolve(valid);

            return defer.promise;
        }

        $scope.autoComplete = {
            GoodsReceive: "GoodsReceive/AutoFilterGoodsReceive",

        };
        $scope.url = {
            GR: webServiceAPI.GR,
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

        function getTime() {
            var Minute = new Date().getMinutes();
            var Hour = new Date().getHours();
            if (Minute < 10) Minute = '0' + Minute;

            return Hour.toString() + ':' + Minute.toString()
        }


        $scope.CheckTag = function (param) {
            if (param == 2) {
                $scope.chkAll.checkAllItems = false;
                $scope.detectCheckAllItems();
            }
        }

        $scope.back = function () {
            //defer.resolve('0');
            $state.go('wms.gr_summary');
            
        }

    }
})