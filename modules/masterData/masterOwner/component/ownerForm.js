(function () {
    'use strict'

    app.component('ownerForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterOwner/component/ownerForm.html";
        },
        bindings: {
            onShow: '=?',
            filterModel: '=?',
            triggerSearch: "=?",
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, ownerFactory, soldToFactory, vendorFactory,productFactory, webServiceAPI) {
            var $vm = this;

            $scope.onShow = false;
            var defer = {};
            var viewModel = ownerFactory;
            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $scope.getCheck = false;

            $vm.onShow = function (param) {
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};
                }
                $scope.onShow = true;
                if (param != undefined) {
                    pageLoading.show();
                    $scope.create = false;
                    viewModel.find(param.owner_Index).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;

                        debugger;
                        if($scope.filterModel.udf_2 != ''){

                            viewModel.ownercolor().then(function success(res) {
                                if (res.data.status == "SUCCESS") {
                                    $scope.ownercolor = res.data.items;
                                    var colorOld = { color: $scope.filterModel.udf_2, owner_Name: null}
                                    $scope.ownercolor.push(colorOld);
                                    $('#showColor').css('background-color', $scope.filterModel.udf_2);
                                    $scope.udf_2_Selected.color = $scope.filterModel.udf_2
                                }
                            
                            }, function error(res) { });


                           
                        }

                        $scope.update = true;
                        if ($scope.filterModel.isActive == 0) {
                            $scope.getCheck = false;
                        } else {
                            $scope.getCheck = true;
                        }
                        if ($scope.dataVendor != undefined) {
                            $scope.click = 2;
                            $scope.clickTab(2);
                            // document.getElementById('testbtn').click()
                        }
                    });
                } else {
                    $scope.update = false
                    $scope.create = true;
                    $scope.getCheck = true;
                    $scope.filterModel.isActive = 1;
                    $scope.filterModel.owner_Id = "";
                }
                return defer.promise;
            };
            $scope.clickTab = function (tab) {
                $scope.click = tab;
                if ($scope.click == 2) {
                    $scope.searchFilterOwnerVendor();
                }
                if ($scope.click == 3) {
                    $scope.searchFilterOwnerSoldTo();
                }
            }

            $scope.searchFilterOwnerVendor = function () {
                pageLoading.show();
                viewModel.filterVendor($scope.filterModel.owner_Index).then(function (res) {
                    pageLoading.hide();
                    if (res.data.length != 0) {
                        $scope.filterModel.listVendorViewModel = res.data.listOwnerVendorItemViewModel;
                    } else {
                        $scope.filterModel.listVendorViewModel = res.data.listOwnerVendorItemViewModel;
                    }
                });
            };

            $scope.searchFilterOwnerSoldTo = function () {
                pageLoading.show();
                viewModel.filterSoldTo($scope.filterModel.owner_Index).then(function (res) {
                    pageLoading.hide();
                    if (res.data.length != 0) {
                        $scope.filterModel.listSoldToViewModel = res.data.listOwnerSoldToItemViewModel;
                    } else {
                        $scope.filterModel.listSoldToViewModel = res.data.listOwnerSoldToItemViewModel;
                    }
                });
            };
            // Add New SoldTo
            $scope.addSoldTo = function () {
                $scope.filterModel.status = "create";
                viewModel.set($scope.filterModel)
                $state.go('wms.sold_to_form');
            }

            //Add New Vendor
            $scope.addVendor = function () {
                $scope.filterModel.status = "create";
                viewModel.set($scope.filterModel)
                $state.go('wms.vendor_form');
            }

            $scope.editItemSoldTo = function (param) {
                param.status = "update";
                viewModel.set(param)
                $state.go('wms.sold_to_form')
            }

            $scope.editItemVendor = function (param) {
                param.status = "update";
                viewModel.set(param)
                $state.go('wms.vendor_form')
            }

            $scope.popupOwnerVendor = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupOwnerVendor.onShow = !$scope.popupOwnerVendor.onShow;
                    $scope.popupOwnerVendor.delegates.vendorOwnerPopup(param, index, $scope.filterModel.listVendorViewModel);
                },
                config: {
                    title: "vendorOwnerPopup"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.listVendorViewModel = $scope.filterModel.listVendorViewModel || []
                        $scope.filterModel.listVendorViewModel = param;
                        $scope.searchFilterOwnerVendor();
                    }
                }
            };
            $scope.popupOwnerSoldTo = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupOwnerSoldTo.onShow = !$scope.popupOwnerSoldTo.onShow;
                    $scope.popupOwnerSoldTo.delegates.soldToOwnerPopup(param, index, $scope.filterModel.listSoldToViewModel);
                },
                config: {
                    title: "soldToOwnerPopup"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.listSoldToViewModel = $scope.filterModel.listSoldToViewModel || []
                        $scope.filterModel.listSoldToViewModel = param;
                        $scope.searchFilterOwnerSoldTo();
                    }

                }
            };
            $vm.triggerSearch = function () {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsOwner;
                });
            };


            //Validate & confirm Add
            $scope.add = function () {
                var model = $scope.filterModel;
                //ใช้ userName จาก localStorage
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                if (model.owner_Id != "") {
                    if (!model.owner_Id.match(/^([a-z0-9])+$/i)) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Owner ID is required !!'
                        })
                        return "";
                    } else {
                        model.owner_Id = model.owner_Id;
                    }
                }
                if (model.owner_Name == undefined || model.owner_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกชื่อเจ้าของสินค้า'
                    })
                    return "";
                }
                if (model.owner_SecondName == undefined || model.owner_SecondName == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกชื่อเจ้าของสินค้า 2'
                    })
                    return "";
                }
                if (model.ownerType_Index == undefined || model.ownerType_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกประเภทเจ้าของสินค้า'
                    })
                    return "";
                }
                // if (model.owner_TaxID == undefined || model.owner_TaxID == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกเลขที่ผู้เสียภาษี'
                //     })
                //     return "";
                // }
                // if (model.owner_Email == undefined || model.owner_Email == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกอีเมล'
                //     })
                //     return "";
                // }
                // if (model.owner_Fax == undefined || model.owner_Fax == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกโทรสาร'
                //     })
                //     return "";
                // }
                // if (model.owner_Tel == undefined || model.owner_Tel == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกหมายเลขโทรศัพท์'
                //     })
                //     return "";
                // }
                // if (model.owner_Mobile == undefined || model.owner_Mobile == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกหมายเลขโทรศัพท์เคลื่อนที่'
                //     })
                //     return "";
                // }
                // if (model.owner_Barcode == undefined || model.owner_Barcode == "") {
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
                // if (model.owner_Address == undefined || model.owner_Address == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกที่อยู่เจ้าของสินค้า'
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
                //         message: 'กรุณากรอกไปรษณี'
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
                                defer.resolve('1');
                                $scope.filterModel = {};
                            }
                            if (res.data == "Fail") {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Validate',
                                    message: 'Owner ID is Dupplicate !!'
                                })
                                return "";
                            }
                        }, function error(param) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'error',
                                message: 'Save error'
                            })
                        });
                    });
                }
            }
            $scope.deleteOwnerVendor = function (param) {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'แจ้งเตือน',
                    message: 'คุณต้องการลบข้อมูลใช่หรือไม่'
                }).then(function success() {
                    viewModel.getDeleteOwnerVendor(param).then(function success(res) {
                        if (res.data == true) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'ลบข้อมูลสำเร็จ'
                            })
                        }
                        $scope.searchFilterOwnerVendor();
                    }, function error(res) { });
                });
            };

            $scope.deleteOwnerSoldTo = function (param) {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'แจ้งเตือน',
                    message: 'คุณต้องการลบข้อมูลใช่หรือไม่'
                }).then(function success() {
                    viewModel.getDeleteOwnerSoldTo(param).then(function success(res) {
                        if (res.data == true) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'ลบข้อมูลสำเร็จ'
                            })
                        }
                        $scope.searchFilterOwnerSoldTo();
                    }, function error(res) { });
                });
            };
            //ย้อนกลับ
            $scope.back = function () {
                if ($scope.dataSoldTo != undefined) {
                    $state.go('wms.owner');
                }
                else if ($scope.dataVendor != undefined) {
                    $state.go('wms.owner');
                }
                else if($scope.dataProduct != undefined){
                    viewModel.set($scope.dataProduct)
                    $state.go('wms.product_form');
                }
                 else {
                    defer.resolve('1');
                }

                $('#showColor').css('background-color', 'white');
                $scope.filterModel.udf_2 = '';
                $scope.udf_2_Selected.color = {};
            }

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

            //function Add
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

            //sourceurl autocomplete
            $scope.autoComplete = {
                ownerType: "Autocomplete/autoOwnerTypeAndOwnerTypeId",
                country: "Autocomplete/autoAddressCountry",
                province: "Autocomplete/autoAddressProvince",
                district: "Autocomplete/autoAddressDistrict",
                subDistrict: "Autocomplete/autoAddressSubDistrict",
                postCode: "Autocomplete/autoAddressPostcode"
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };
            var init = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.click = 1;
                $scope.filterModel = {};
                $scope.udf_2_Selected = {};
                $scope.dataSoldTo = soldToFactory.get();
                $scope.dataVendor = vendorFactory.get();
                if ($scope.dataSoldTo != undefined) {
                    $scope.filterModel = $scope.dataSoldTo;
                    $scope.onShow = true;
                    $vm.onShow($scope.filterModel);
                }
                if ($scope.dataVendor != undefined) {
                    $scope.click = 2;
                    $scope.filterModel = $scope.dataVendor;
                    $scope.onShow = true;
                    $vm.onShow($scope.filterModel);
                }

                $scope.dataProduct = productFactory.get();
                $scope.filterModel = {};
                if($scope.dataProduct != undefined){
                    if($scope.dataProduct.status == "create"){
                        $scope.onShow = true;
                        $vm.onShow();
                    }
                    if($scope.dataProduct.status == "update"){
                        $scope.onShow = true;
                        $vm.onShow($scope.dataProduct);
                    }
                }



                viewModel.ownercolor().then(function success(res) {
                    if (res.data.status == "SUCCESS") {
                        $scope.ownercolor = res.data.items;
                    }
                
                }, function error(res) { });
            };

            $scope.changeColor = function(){
                debugger;
                $('#showColor').css('background-color', $scope.udf_2_Selected.color);
                $scope.filterModel.udf_2 = $scope.udf_2_Selected.color;
            }
            init();
        }
    })
})();