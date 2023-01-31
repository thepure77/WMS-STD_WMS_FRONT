(function () {
    'use strict'

    app.component('cyclecountFormV2', {
        controllerAs: '$vm',
        templateUrl: "modules/Tranfer/CyclecountV2/component/CyclecountFormV2.html",
        bindings: {
            isLoading: '=?',
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',

        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, cyclecountFactory, webServiceAPI) {
            var $vm = this;

            var defer = {};
            $vm.isFilterTable = true;
            $scope.onShow = false;
            var viewModel = cyclecountFactory;
            $scope.binModel = {};
            $scope.listBinBlanceViewModel = {};
            $scope.checkAll = true;
            $scope.listBinBlanceViewModelOld = {};
            $scope.listDropdownBusinessUnitViewModel = {};
            $scope.listDropdownItemStatusViewModel = {};
            $scope.movement = false;
            $scope.set = "";
            $scope.log_udf_2 = getToday();
            $scope.log_udf_3 = getTime();
            $scope.operations = "ADD";

            $scope.movementstock = ["เคลื่อนไหว", "ไม่เคลื่อนไหว"];

            $scope.$watch("movementstock.model", function () {
                if ($scope.movementstock.model == "เคลื่อนไหว") {
                    $scope.movement = true;
                }else {$scope.movement = false;$scope.binModel.diff_Movement = '';$('#binModel.movement_Name').val('');}
            });

            $scope.$watch("Checkproduct_Id", function () {
                if ($scope.Checkproduct_Id == "true") {}
                else {$scope.binModel.product_Index = '';$scope.binModel.product_Id = '';$('#binModel.product_Name').val('');}
            });

            $scope.$watch("Checkowner_Id", function () {
                if ($scope.Checkowner_Id == "true") {}
                else {$scope.binModel.owner_Index = '';$scope.binModel.owner_Id = '';$('#binModel.owner_Name').val('');}
            });

            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });


            this.$onInit = function () {
                $scope.binModel = {};
                $scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.selected = 1;
                $scope.click = 1;
                $scope.binModel.isSku = false;
                $scope.listCycleCount = {};
                $scope.dropdownDocumentType();
                $scope.dropdownBusinessUnit();
                $scope.dropdownItemStatus();
                $scope.dropdownLocationType();
                $scope.dropdownRollCage();
                $scope.Checkproduct_Id = false;
                $scope.Checkowner_Id = false;
            }

            // $scope.sku = {
            //     chk: false
            // };
            // $scope.hide = function () {
            //     $scope.sku.chk = $scope.sku.chk === false ? true : false;
            //     $scope.binModel.isSku = $scope.sku.chk;
            // };

            // $scope.Check = {
            //     product_Id: false
            // };
            // $scope.Checkdisabled = function () {
            //     $scope.Check.product_Id = $scope.Check.product_Id === false ? true : false;
            // };

            $scope.header = {
                show: true
            };


            $scope.ShowHeader = function () {
                $scope.header.show = $scope.header.show === false ? true : false;
            };

            $vm.onShow = function (param) {
                $('#documentType_Id').val($scope.dropdownDocumentType[0].documentType_Name);
                $scope.filterModel = {};
                $scope.listBinBlanceViewModel = {};
                $scope.listBinBlanceViewModelOld = {};
                $scope.set = "";
                $scope.binModel = {};
                $scope.selected = 1;
                $scope.click = 1;
                $scope.binModel.isSku = true;
                $scope.dropdownBusinessUnit.model = null;
                $scope.dropdownItemStatus.model = null;
                $scope.binModel.cycleCount_Date = getToday();
                defer = $q.defer();
                $scope.onShow = true;
                $scope.isNew = false;
                $scope.round1 = [];
                $scope.round2 = [];
                $scope.round3 = [];
                $scope.checkAll = false;
                $scope.detectCheckAll(false);
                if (param != undefined) {
                    $scope.isNew = true;

                    viewModel.find(param.cycleCount_Index).then(function (res) {
                        $scope.binModel = res.data.listHeader;
                        $scope.listBinBlanceViewModel = res.data.listItem;
                        $scope.listDetail = res.data.listDetail;
                        if ($scope.listDetail.length > 0) {
                        //    $scope.round1 = $scope.listDetail.filter(f => f.count == 1);
                        //    $scope.round2 = $scope.listDetail.filter(f => f.count == 2);
                        //    $scope.round3 = $scope.listDetail.filter(f => f.count == 3);
                           $scope.checkAll = true;
                           $scope.detectCheckAll(true);
                        }
                        $('#documentType_Id').val($scope.dropdownDocumentType[0].documentType_Name);
                        $scope.operations = "EDIT";
                    });
                    return defer.promise;
                }
                else {
                    $scope.operations = "ADD";
                    return defer.promise;
                }
            };

            $scope.buttons = {
                add: true,
                update: false,
                back: true
            };

            $scope.SearchBinBalance = function (param) {
                pageLoading.show();
                if ($scope.movementstock.model == "เคลื่อนไหว") {
                    param.Movement_Status = "Stock movement";
                }else if ($scope.movementstock.model == "ไม่เคลื่อนไหว"){param.Movement_Status = "Stock never movement"}
                else{$scope.movementstock.model = "";}
                
                // if ($scope.dropdownDocumentType.model == null || $scope.dropdownDocumentType.model == undefined || $scope.dropdownDocumentType.model == "") {
                //     dpMessageBox.alert(
                //         {
                //             ok: 'Close',
                //             title: 'Validate',
                //             message: 'กรุณาเลือก ประเภทเอกสาร !'
                //         }
                //     )
                //     return "";
                // }
                $scope.checkAll = false;
                if ($scope.binModel.cycleCount_Date == null
                    || $scope.binModel.cycleCount_Date == undefined
                    || $scope.binModel.cycleCount_Date == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'กรุณาเลือก วันที่สร้างเอกสาร !'
                        }
                    )
                    return "";

                }
                if ($scope.movement == true && ($scope.binModel.diff_Movement == null
                    || $scope.binModel.diff_Movement == undefined
                    || $scope.binModel.diff_Movement == "")) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'กรุณาระบุ จำนวนวันย้อนหลัง !'
                        }
                    )
                    return "";
                }

                
                if ($scope.Checkproduct_Id == true && ($scope.binModel.product_Index == null
                    || $scope.binModel.product_Index == undefined
                    || $scope.binModel.product_Index == "")) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'กรุณาระบุ รหัสสินค้า !'
                        }
                    )
                    return "";
                }
                if ($scope.Checkowner_Id == true && ($scope.binModel.owner_Index == null
                    || $scope.binModel.owner_Index == undefined
                    || $scope.binModel.owner_Index == "")) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'กรุณาระบุ เจ้าของสินค้า !'
                        }
                    )
                    return "";
                }
                if ($scope.binModel.cycleCount_Date == null
                    || $scope.binModel.cycleCount_Date == undefined
                    || $scope.binModel.cycleCount_Date == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'กรุณาเลือก วันที่สร้างเอกสาร !'
                        }
                    )
                    return "";
                }

                var deferred = $q.defer();
                if ($scope.listBinBlanceViewModel.length > 0 && $scope.isNew == true) {
                    $scope.listBinBlanceViewModelOld = $scope.listBinBlanceViewModel;
                }
                if ($scope.listBinBlanceViewModel.length > 0 && $scope.isNew == false) {
                    $scope.listBinBlanceViewModelOld = $scope.listBinBlanceViewModel.filter(c => c.selected);
                }

                if($scope.binModel.dropdownBusinessUnit == null || $scope.binModel.dropdownBusinessUnit == undefined || $scope.binModel.dropdownBusinessUnit == ""){}
                else{
                    param.businessUnit_Index = param.dropdownBusinessUnit.businessUnit_Index;
                    param.businessUnit_Id = param.dropdownBusinessUnit.businessUnit_Id;
                    param.businessUnit_Name = param.dropdownBusinessUnit.businessUnit_Name;
                }

                if($scope.binModel.dropdownItemStatus == null || $scope.binModel.dropdownItemStatus == undefined || $scope.binModel.dropdownItemStatus == ""){}
                else{
                    param.itemStatus_Index = param.dropdownItemStatus.itemStatus_Index;
                    param.itemStatus_Id = param.dropdownItemStatus.itemStatus_Id;
                    param.itemStatus_Name = param.dropdownItemStatus.itemStatus_Name;
                }

                if($scope.binModel.cycleCount_No == null || $scope.binModel.cycleCount_No == undefined || $scope.binModel.cycleCount_No == ""){}
                else{
                    param.cycleCount_No = $scope.binModel.cycleCount_No
                }
                if ($scope.dropdownLocationType.model != null) {
                  param.locationType_Index = $scope.dropdownLocationType.model.locationType_Index;
                  param.locationType_Id = $scope.dropdownLocationType.model.locationType_Id;
                  param.locationType_Name = $scope.dropdownLocationType.model.locationType_Name;
                } else {
                  param.locationType_Index = null;
                  param.locationType_Id = null;
                  param.locationType_Name = null;
                }

                if ($scope.dropdownRollCage.model != null) {
                  param.rollCage_Index = $scope.dropdownRollCage.model.rollCage_Index;
                  param.rollCage_Id = $scope.dropdownRollCage.model.rollCage_Id;
                  param.rollCage_Name = $scope.dropdownRollCage.model.rollCage_Name;
                } else {
                  param.rollCage_Index = null;
                  param.rollCage_Id = null; 
                  param.rollCage_Name = null;
                }
                debugger;
                if($scope.binModel.location_Index == null || $scope.binModel.location_Index == undefined || $scope.binModel.location_Index == ""){}
                else{
                if ($scope.binModel.location_Index.length > 10) {
                    param.location_Index = $scope.binModel.location_Index;
                    param.location_Id = $scope.binModel.location_Id;
                    param.location_Name = $scope.binModel.location_Name;
                  } else {
                    param.location_Index = null;
                    param.location_Id = $scope.binModel.location_Name;
                    param.location_Name = null;
                  }
                }
                $scope.listBinBlanceViewModel = {};
                $scope.set = 'add';
                viewModel.BinBalanceSearch(param).then(function success(res) {
                        pageLoading.hide();debugger;
                        if (res.data.length <= 0) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'ไม่พบข้อมูล'
                                }
                            )
                        }
                        $scope.listBinBlanceViewModel = res.data;
                        // if ($scope.listBinBlanceViewModelOld.length > 0) {
                        //     let dataList = $scope.listBinBlanceViewModelOld;
                        //     for (var i = 0; i <= dataList.length - 1; i++) {
                        //         $scope.listBinBlanceViewModel.push(angular.copy(dataList[i]));
                        //     }
                        // }
                        deferred.resolve(res);
                    },
                    function error(response) {
                        pageLoading.hide();
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'ค้นหาผิดพลาด'
                            }
                        )
                    });
                return deferred.promise;
            }

            $scope.detectCheckAll = function (c) {
                if (c === true) {
                    angular.forEach($scope.listBinBlanceViewModel, function (v, k) {
                        $scope.listBinBlanceViewModel[k].selected = true;
                    });
                } else {
                    angular.forEach($scope.listBinBlanceViewModel, function (v, k) {
                        $scope.listBinBlanceViewModel[k].selected = false;
                    });
                }
            }

            $scope.deleteItem = function (param1,param2, index) {
                param1.splice(index, 1);
                param2.splice(index, 1);
            }

            $scope.add = function (data, param) {
                pageLoading.show();
                var model = {};
                model = data;
                var idx = [];
                var idx2 = [];

                var item = angular.copy(param);
                var item2 = angular.copy($scope.listDetail);

                angular.forEach(item2, function (v, k) {
                    idx2.push(v)
                });
                model.listCycleCountItem2 = idx2;
                debugger;

                model.cycleCount_Date = $scope.binModel.cycleCount_Date;

                model.documentType_Index = $scope.dropdownDocumentType[0].documentType_Index;
                model.documentType_Id = $scope.dropdownDocumentType[0].documentType_Id;
                model.documentType_Name = $scope.dropdownDocumentType[0].documentType_Name;

                model.location_Index = $scope.binModel.location_Index;
                model.location_Id = $scope.binModel.location_Id;
                model.location_Name = $scope.binModel.location_Name;


                if ($scope.movement == true && ($scope.binModel.diff_Movement == null
                    || $scope.binModel.diff_Movement == undefined
                    || $scope.binModel.diff_Movement == "")) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'กรุณาระบุ จำนวนวันย้อนหลัง !'
                        }
                    )
                    return "";
                }
                if ($scope.Checkproduct_Id == true && ($scope.binModel.product_Index == null
                    || $scope.binModel.product_Index == undefined
                    || $scope.binModel.product_Index == "")) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'กรุณาระบุ รหัสสินค้า !'
                        }
                    )
                    return "";
                }
                if ($scope.Checkowner_Id == true && ($scope.binModel.owner_Index == null
                    || $scope.binModel.owner_Index == undefined
                    || $scope.binModel.owner_Index == "")) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'กรุณาระบุ เจ้าของสินค้า !'
                        }
                    )
                    return "";
                }
                if ($scope.binModel.cycleCount_Date == null
                    || $scope.binModel.cycleCount_Date == undefined
                    || $scope.binModel.cycleCount_Date == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'กรุณาเลือก วันที่สร้างเอกสาร !'
                        }
                    )
                    return "";
                }

                angular.forEach(item, function (v, k) {
                    if (v.selected) {
                        idx.push(v)
                    }
                });
                model.listCycleCountItem = idx;

                if (model.listCycleCountItem == null
                    || model.listCycleCountItem == undefined
                    || model.listCycleCountItem == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'กรุณาเลือก สินค้าที่ต้องการตรวจนับ !'
                        }
                    )
                    return "";

                }

                model.create_By = $scope.userName;
                model.set = $scope.set;
                model.operations = $scope.operations;
                model.log_udf_2 = $scope.log_udf_2;
                model.log_udf_3 = $scope.log_udf_3;
                model.log_udf_4 = getToday();
                model.log_udf_5 = getTime();

                viewModel.SaveCycleCount(model).then(function (res) {

                    if (res.data.message == true) {
                        model.operations = model.operations+" "+res.data.document_No;
                        viewModel.savelogsRequest(model).then(function () {
                        });

                        $scope.back();
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'บันทึกสำเร็จ',
                                message: 'บันทึกสำเร็จ : ' + res.data.document_No
                            }
                        )
                        model = {};
                        $scope.binModel = {};
                        $scope.listCycleCount = {};

                        defer.resolve();
                    }
                    else {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'ไม่สามารถบันทึกได้'
                            }
                        )
                        $scope.hide();
                    }
                }, function error(model) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'ไม่สามารถบันทึกได้'
                        }
                    )
                });
            }

            $scope.selectedTab = function (tab) {
                $scope.selected = tab;
            }

            $scope.clickTab = function (tab) {
                $scope.click = tab;
            }

            $scope.dropdownDocumentType = function () {
                viewModel.dropdownDocumentType($scope.filterModel).then(function (res) {
                    $scope.dropdownDocumentType = res.data;
                    debugger;
                });
            };

            $scope.dropdownBusinessUnit = function () {
                viewModel.dropdownBusinessUnit($scope.filterModel).then(function (res) {
                    $scope.dropdownBusinessUnit = res.data;
                });
            };

            $scope.dropdownItemStatus = function () {
                viewModel.dropdownItemStatus($scope.filterModel).then(function (res) {
                    $scope.dropdownItemStatus = res.data;
                });
            };

            $scope.dropdownLocationType = function () {
                viewModel.dropdownLocationType($scope.filterModel).then(function (res) {
                  $scope.dropdownLocationTypeList = res.data;
                });
            };

            $scope.dropdownRollCage = function () {
                viewModel.dropdownRollCage($scope.filterModel).then(function (res) {
                  $scope.dropdownRollCageList = res.data;
                });
            };

            $scope.back = function () {
                $scope.binModel = {};
                $scope.listBinBlanceViewModel = {};
                $scope.binModel.dropdownDocumentType = {};
                $scope.dropdownRollCage.model = null;
                $scope.binModel.businessUnitList = null;
                $scope.binModel.dropdownItemStatus = null;
                $scope.dropdownLocationType.model = null;
                $scope.dropdownRollCage.model= null;
                // $scope.hide();
                var model = $scope.filterModel;
                defer.resolve();
                $scope.binModel.product_Name = "";
                $scope.binModel.owner_Name = "";
                $scope.binModel.tag_no = "";
                $scope.binModel.location_Id = "";
                $scope.binModel.location_Id = "";
                $scope.binModel.location_Name = "";
                $scope.movementstock.model = "";
                $scope.Checkproduct_Id = false;
                $scope.Checkowner_Id = false;
                $scope.movement = false;
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

            $scope.autoComplete = {
                //autoSku: "AutoCyclecount/autoSku",
                //autoSku: "Autocomplete/autoSku",
                autoProductId: "Autocomplete/autoProductId",
                locationType: "AutoCyclecount/autoLocationTypFilter",
                location: "AutoCyclecount/autoLocationFilter",
                //product: "AutoCyclecount/autoProductFilter",
                owner: "AutoCyclecount/autoOwnerfilter",
                autoSearchTag: "Report3/autoSearchTag",
                //vendor: "Autocomplete/autoVendorAndVendorId"
                //vendor: "Autocomplete/autoSearchVendor",
                //vendor: "Autocomplete/autoVenderfilter",
                
            };

            $scope.url = {
                Master: webServiceAPI.Master,
                Cyclecount: webServiceAPI.Cyclecount,
                PO: webServiceAPI.PO,
                Report: webServiceAPI.Report,
            };


            
            // Export Excel
            // $scope.exportFile = {

            //     ExportCycleCountDetail: function () {
            //         dpMessageBox.confirm({
            //             title: 'Confirm.',
            //             message: 'Do you want to download?'
            //         }).then(function success() {
            //             ExportCycleCountDetail();
            //         })
            //     },
            // }

            // function ExportCycleCountDetail() {
            //     // var item = angular.copy($vm.searchResultModel);
            //     // var model = {};
            //     // var aa = {};

            //     var deferred = $q.defer();
            //     $scope.filterModel.excelName = $scope.binModel.cycleCount_No;
            //     $scope.filterModel.cycleCount_Index = $scope.binModel.cycleCount_Index;
            //     viewModel.ExportCycleCountDetail($scope.filterModel).then(
            //         function success(results) {
            //             // $vm.triggerSearch
            //             deferred.resolve(results);
            //         },
            //         function error(response) {

            //             dpMessageBox.alert({
            //                 title: 'Information.',
            //                 message: "Connect Service Fail."
            //             })
            //             deferred.reject(response);
            //         }
            //     );
            //     return deferred.promise;
            // }

            $scope.ClearSearch = function () {
 //               $scope.binModel.cycleCount_No = {};
                $scope.binModel.cycleCount_Date = getToday();
                $scope.listBinBlanceViewModel = {};
                $scope.binModel.dropdownDocumentType = {};
                $scope.binModel.dropdownItemStatus = null;
                $scope.dropdownLocationType.model = null;
                $scope.dropdownRollCage.model = null;
                $scope.binModel.businessUnitList = null;
                $scope.dropdownRollCage.model= null;
                var model = $scope.filterModel;
                $scope.binModel.product_Id = "";
                $scope.binModel.product_Name = "";
                $scope.binModel.owner_Id = "";
                $scope.binModel.owner_Name = "";
                $scope.binModel.tag_no = "";
                $scope.binModel.location_Index = "";
                $scope.binModel.location_Id = "";
                $scope.binModel.location_Name = "";
                $scope.movementstock.model = "";
                $scope.Checkproduct_Id = false;
                $scope.Checkowner_Id = false;
                $scope.movement = false;
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

        }
    })
})();