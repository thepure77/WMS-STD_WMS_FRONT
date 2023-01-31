(function () {
    'use strict'
    app.component('soldToForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterSoldTo/component/soldToForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?'
        },
        controller: function ($scope, $q, $filter, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, dpMessageBox,localStorageService, soldToFactory, soldToShipToFactory, shipToFactory,ownerFactory, webServiceAPI) {
            var $vm = this;
            $scope.getCheck = false;
            $scope.onShow = false;
            var defer = {};
            var viewModel = soldToFactory;
            var viewModelSoldToShipTo = soldToShipToFactory;
            var viewModelShipTo = shipToFactory;
            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $vm.onShow = function (param) {
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};

                }
                $scope.onShow = true;
                //Update
                if (param != undefined) {
                    pageLoading.show();
                    $scope.create = false;
                    viewModel.find(param.soldTo_Index).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;
                        $scope.update = true;
                        if ($scope.filterModel.isActive == 0) {
                            $scope.getCheck = false;
                        } else {
                            $scope.getCheck = true;
                        }
                        // if($scope.getModel != undefined){
                        //     $scope.click = 2;
                        //     $scope.clickTab(2);
                            
                        //  }
                    });
                }
                else {
                    $scope.filterModel.soldTo_Id = "";
                    $scope.update = false
                    $scope.create = true;
                    $scope.getCheck = true;
                    $scope.filterModel.isActive = 1;


                }
                return defer.promise;
            };
            $vm.triggerSearch = function () {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function(res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsSoldTo;
                });
            };

            $scope.popupShipTo = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {                  
                    $scope.popupShipTo.onShow = !$scope.popupShipTo.onShow;
                    $scope.popupShipTo.delegates.shipToPopupV2(param, index);
                },
                config: {
                    title: "ShipToType"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.shipTo_Index = angular.copy(param.shipTo_Index);
                        $scope.filterModel.shipTo_Id = angular.copy(param.shipTo_Id);
                        $scope.filterModel.shipTo_Name = angular.copy(param.shipTo_Name);
                        $scope.filterSoldToShipTo();
                    }
                }
            };

            $scope.clickTab = function (tab) {
                $scope.click = tab;
                if($scope.click == 2){
                    // document.getElementById("tab2").click();
                    $scope.filterSoldToShipTo();
                }
            }

            $scope.filterSoldToShipTo = function () {
                $scope.filterModelShipTo = {};
                pageLoading.show();
                viewModelSoldToShipTo.filterShipTo($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    if (res.data.length != 0) {
                        // $vm.filterModel.perPage = $vm.filterModel.PerPage;
                        // $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        // $vm.filterModel.currentPage = res.data.pagination.currentPage;

                        // if (res.data.paginations != null || res.data.paginations != undefined) {
                        //     $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        // }

                        // $vm.searchResultModel = res.data.itemsSoldTo;
                        $scope.filterModelShipTo = res.data.itemsSoldToShipTo;
                    }
                    else {
                        $scope.filterModelShipTo = res.data.itemsSoldToShipTo;
                    }
                });
            }

            $scope.addShipTo = function (){
                $scope.filterModel.status = "create";
                viewModel.set($scope.filterModel)
                $state.go('wms.ship_to_form');
            }


            //Add ข้อมูล SoldTo
            $scope.add = function () {
                var model = $scope.filterModel;
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                //Validate
                if (model.soldTo_Id != "") {
                    if (!model.soldTo_Id.match(/^([a-z0-9])+$/i)) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'รหัสผู้เบิกไม่ถูกต้อง'
                        })
                        return "";
                    } else {
                        model.soldTo_Id = model.soldTo_Id;
                    }
                }
                if (model.soldTo_Name == undefined || model.soldTo_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกชื่อผู้เบิก'
                    })
                    return "";
                }
                if (model.soldToType_Index == undefined || model.soldToType_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกประเภทผู้เบิก'
                    })
                    return "";
                }
                // if (model.soldTo_TaxID == undefined || model.soldTo_TaxID == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกเลขที่ผู้เสียภาษี'
                //     })
                //     return "";
                // }
                // if (model.soldTo_Email == undefined || model.soldTo_Email == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกอีเมล'
                //     })
                //     return "";
                // }
                // if (model.soldTo_Fax == undefined || model.soldTo_Fax == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกโทรสาร'
                //     })
                //     return "";
                // }
                // if (model.soldTo_Tel == undefined || model.soldTo_Tel == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกหมายเลขโทรศัพท์'
                //     })
                //     return "";
                // }
                // if (model.soldTo_Mobile == undefined || model.soldTo_Mobile == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกหมายเลขโทรศัพท์เคลื่อนที่'
                //     })
                //     return "";
                // }
                // if (model.soldTo_Barcode == undefined || model.soldTo_Barcode == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกบาร์โค้ด'
                //     })
                //     return "";
                // }
                // if (model.contact_Person == undefined || model.contact_Person == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกชื่อผู้ติดต่อ'
                //     })
                //     return "";
                // }
                // if (model.contact_Tel == undefined || model.contact_Tel == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกหมายเลขโทรศัพท์ผู้ติดต่อ'
                //     })
                //     return "";
                // }
                // if (model.contact_Email == undefined || model.contact_Email == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกอีเมลผู้ติดต่อ'
                //     })
                //     return "";
                // }
                // if (model.soldTo_Address == undefined || model.soldTo_Address == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกที่อยู่ผู้เบิก'
                //     })
                //     return "";
                // }
                // if (model.country_Index == undefined || model.country_Index == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกประเทศ'
                //     })
                //     return "";
                // }
                // if (model.province_Index == undefined || model.province_Index == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกจังหวัด'
                //     })
                //     return "";
                // }
                // if (model.district_Index == undefined || model.district_Index == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกเขต/อำเภอ'
                //     })
                //     return "";
                // }
                // if (model.subDistrict_Index == undefined || model.subDistrict_Index == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกแขวง/ตำบล'
                //     })
                //     return "";
                // }
                // if (model.postcode_Name == undefined || model.postcode_Name == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกรหัสไปรษณีย์'
                //     })
                //     return "";
                // }
                else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'ยืนยันข้อมูล',
                        message: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่'
                    }).then(function () {
                        pageLoading.show();
                        Add(model).then(function success(res) {
                            pageLoading.hide();
                            if (res.data == "Done") {
                                if ($scope.dataSoldTo != undefined)
                                {
                                    viewModel.set($scope.dataSoldTo)
                                    $state.go('wms.owner_form');
                                }
                               
                                else{
                                    defer.resolve('1');
                                }
                                $scope.filterModel = {};
                            }else
                            if(res.data = "Fail"){
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'รหัสผู้เบิกซ้ำ'
                                })
                                return "";
                            }
                        }, function error(param) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'error',
                                    message: 'Save error'
                                }
                            )
                        });
                    });
                }
            }

     
            $scope.back = function () {
                if($scope.getModel != undefined){
                    $state.go('wms.sold_to');
                }
                else if ($scope.dataSoldTo != undefined) {
                    viewModel.set($scope.dataSoldTo)
                    $state.go('wms.owner_form');
                }
                else {
                    defer.resolve('1');
                }
      
               
            }

            function Add(param) {
                var deferred = $q.defer();
                viewModel.SaveChanges(param).then(
                    function success(results) {
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.resolve(response);
                    }
                );
                return deferred.promise;
            }

            $scope.editShipToItem = function (param) {
                param.status = "update";
                viewModel.set(param)
                $state.go('wms.ship_to_form');
            }

            $scope.deleteShipToItem = function (param) {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'แจ้งเตือน',
                    message: 'คุณต้องการลบข้อมูลใช่หรือไม่'
                }).then(function success() {                
                    viewModelSoldToShipTo.getDelete(param).then(function success(res) {
                        if (res.data == true) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'ลบข้อมูลสำเร็จ'
                                }
                            )
                        }
                        $scope.filterSoldToShipTo();
                    }, function error(res) { });
                });
            };
            $scope.show = {
                main: true,
                transport: false,
                warehouse: false
            };

            $scope.buttons = {
                add: true,
                update: false,
                back: true
            };
        
            //API AutoComplete
            $scope.autoComplete = {
                soldToType: "Autocomplete/autoSoldToType",
                autoCountry: "Autocomplete/autoAddressCountry",
                autoDistrict: "Autocomplete/autoAddressDistrict",
                autoPostcode: "Autocomplete/autoAddressPostcode",
                autoProvince: "Autocomplete/autoAddressProvince",
                autoSubDistrict: "Autocomplete/autoAddressSubDistrict"
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };
            var init = function () {
                $scope.click = 1;
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
                $scope.getModel = viewModelShipTo.get();
                if($scope.getModel != undefined){
                    $scope.filterModel = $scope.getModel;
                    $scope.onShow = true;
                    $vm.onShow($scope.filterModel);
               
                }
                    
                $scope.dataSoldTo = ownerFactory.get();
                if ($scope.dataSoldTo != undefined)
                {
                    if($scope.dataSoldTo.status == "create"){
                        $scope.onShow = true;
                        $vm.onShow();
                    }
                    if($scope.dataSoldTo.status == "update"){
                        $scope.onShow = true;
                        $vm.onShow($scope.dataSoldTo);
                    }
                }

            };

            
            init();
        }
    })
})();