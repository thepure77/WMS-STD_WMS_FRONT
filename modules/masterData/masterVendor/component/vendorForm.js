(function () {
    'use strict'

    app.component('vendorForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterVendor/component/vendorForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, vendorFactory, ownerFactory, webServiceAPI) {
            var $vm = this;

            $scope.onShow = false;
            var defer = {};
            var viewModel = vendorFactory;
            var viewModelOwner = ownerFactory
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
                    viewModel.find(param.vendor_Index).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;
                        $scope.update = true;
                        if ($scope.filterModel.isActive == 0) {
                            $scope.getCheck = false;
                        } else {
                            $scope.getCheck = true;
                        }
                    });
                } else {
                    $scope.filterModel.vendor_Id = "";
                    $scope.update = false
                    $scope.create = true;
                    $scope.getCheck = true;
                    $scope.filterModel.isActive = 1;
                }
                return defer.promise;
            };

            $vm.triggerSearch = function () {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsVendor;
                });
            };

            //Validate & confirm Add
            $scope.add = function () {
                var model = $scope.filterModel;
                //ใช้ userName จาก localStorage
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                if (model.vendor_Id != "") {
                    if (!model.vendor_Id.match(/^([a-z0-9])+$/i)) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'รหัสผู้ขายไม่ถูกต้อง'
                        })
                        return "";
                    } else {
                        model.vendor_Id = model.vendor_Id;
                    }
                }
                if (model.vendor_Name == undefined || model.vendor_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกชื่อผู้ขาย'
                    })
                    return "";
                }
                if (model.vendor_SecondName == undefined || model.vendor_SecondName == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกชื่อผู้ขาย 2'
                    })
                    return "";
                }
                if (model.vendor_ThirdName == undefined || model.vendor_ThirdName == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกชื่อผู้ขาย 3'
                    })
                    return "";
                }
                if (model.vendor_FourthName == undefined || model.vendor_FourthName == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกชื่อผู้ขาย 4'
                    })
                    return "";
                }
                if (model.vendorType_Index == undefined || model.vendorType_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกประเภทผู้ขาย'
                    })
                    return "";
                }
                // if (model.vendor_TaxID == undefined || model.vendor_TaxID == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกเลขที่ผู้เสียภาษี'
                //     })
                //     return "";
                // }
                // if (model.vendor_Email == undefined || model.vendor_Email == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกอีเมล'
                //     })
                //     return "";
                // }
                // if (model.vendor_Fax == undefined || model.vendor_Fax == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกโทรสาร'
                //     })
                //     return "";
                // }
                // if (model.vendor_Tel == undefined || model.vendor_Tel == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกหมายเลขโทรศัพท์'
                //     })
                //     return "";
                // }
                // if (model.vendor_Mobile == undefined || model.vendor_Mobile == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกหมายเลขโทรศัพท์เคลื่อนที่'
                //     })
                //     return "";
                // }
                // if (model.vendor_Barcode == undefined || model.vendor_Barcode == "") {
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
                // if (model.vendor_Address == undefined || model.vendor_Address == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกที่อยู่ผู้ขาย'
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
                                if ($scope.dataVendor != undefined) {
                                    viewModel.set($scope.dataVendor.owner_Index)
                                    $state.go('wms.owner_form');
                                }
                                else {
                                    defer.resolve('1');
                                }
                                $scope.filterModel = {};
                            }
                            else
                                if (res.data = "Fail") {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: 'รหัสผู้ขายซ้ำ'
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

            //ย้อนกลับ
            $scope.back = function () {
                if ($scope.dataVendor != undefined) {
                    viewModel.set($scope.dataVendor)
                    $state.go('wms.owner_form');
                }
                else {
                    defer.resolve('1');
                }
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
                vendorType: "Autocomplete/autoVendorTypeAndVendorTypeId",
                country: "Autocomplete/autoAddressCountry",
                province: "Autocomplete/autoAddressProvince",
                district: "Autocomplete/autoAddressDistrict",
                subDistrict: "Autocomplete/autoAddressSubDistrict",
                postCode: "Autocomplete/autoAddressPostcode"
            };

            //url webServiceAPI.Master
            $scope.url = {
                Master: webServiceAPI.Master,
            };

            var init = function () {
                $scope.dataVendor = ownerFactory.get();
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
                if ($scope.dataVendor != undefined) {
                    if($scope.dataVendor.status == "create"){
                        $scope.onShow = true;
                        $vm.onShow();
                    }
                    if($scope.dataVendor.status == "update"){
                        $scope.onShow = true;
                        $vm.onShow($scope.dataVendor);
                    }
                }
            };
            init();
        }
    })
})();