(function () {
    'use strict'

    app.component('productForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterProduct/component/productForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            isFilter: '=?'
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, $stateParams, /*authService*/ pageLoading,
            $window, commonService, localStorageService, $translate, dpMessageBox, productFactory, productConversionFactory, productOwnerFactory, ownerFactory, webServiceAPI) {
            var $vm = this;
            $scope.onShow = false;
            var defer = {};
            var viewModel = productFactory;
            var viewModelConversion = productConversionFactory;
            var viewModelProductOwner = productOwnerFactory;
            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $scope.getCheck = false;
            $scope.getCheckIsLot = false;
            $scope.getCheckIsExpDate = false;
            $scope.getCheckIsMfgDate = false;
            $scope.getCheckisSerial = false;

            $vm.onShow = function (param) {
                $scope.click = 1;
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};
                }
                $scope.onShow = true;
                if (param != undefined) {
                    pageLoading.show();
                    $scope.create = false;
                    viewModel.find(param.product_Index).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;
                        $scope.update = true;
                        if ($scope.filterModel.isActive == 0) {
                            $scope.getCheck = false;
                        } else {
                            $scope.getCheck = true;
                        }

                        if ($scope.filterModel.isLot == 0) {
                            $scope.getCheckIsLot = false;
                        } else {
                            $scope.getCheckIsLot = true;
                        }

                        if ($scope.filterModel.isExpDate == 0) {
                            $scope.getCheckIsExpDate = false;
                        } else {
                            $scope.getCheckIsExpDate = true;
                        }

                        if ($scope.filterModel.isMfgDate == 0) {
                            $scope.getCheckIsMfgDate = false;
                        } else {
                            $scope.getCheckIsMfgDate = true;
                        }
                        if ($scope.filterModel.isSerial == 0) {
                            $scope.getCheckisSerial = false;
                        } else {
                            $scope.getCheckisSerial = true;
                        }
                        // $scope.buttons.addConvertion = true;
                        // if ($scope.click != null) {
                        //     $scope.clickTab($scope.click);
                        //     if ($scope.click == 1) {
                        //         var x = document.getElementById("tab1").click();
                        //     }
                        //     if ($scope.click == 2) {
                        //         var x = document.getElementById("tab2").click();
                        //     }
                        //     if ($scope.click == 3) {
                        //         var x =  document.getElementById("tab3").click();
                        //     }
                        // }
                    });
                } else {
                    $scope.filterModel.product_Id = "";
                    $scope.update = false
                    $scope.create = true;
                    $scope.getCheck = true;
                    $scope.filterModel.isActive = 1;
                    $scope.filterModel.isLot = 0;
                    $scope.filterModel.isExpDate = 0;
                    $scope.filterModel.isMfgDate = 0;
                    $scope.filterModel.isSerial = 0;
                    
                    // $scope.buttons.addConvertion = false;
                }
                return defer.promise;
            };

            $vm.triggerSearch = function () {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsProduct;
                });
            };

            $scope.popupOwner = {
                onShow: false,
                delegates: {},
                onClick: function (param, index, model) {
                    $scope.popupOwner.onShow = !$scope.popupOwner.onShow;
                    $scope.popupOwner.delegates.OwnerPopupV2(param, index, model);
                },
                config: {
                    title: "Owner"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterProductOwner();
                    }
                }
            };

            $scope.clickTab = function (tab) {
                $scope.click = tab;
                if ($scope.click == 2) {
                    $scope.filterModel.value1 = null;
                    $scope.filterProductConversion();
                }
                if ($scope.click == 3) {
                    $scope.filterModel.value2 = null;
                    $scope.filterProductOwner();
                }
            }

            $scope.filterProductConversion = function () {
                $scope.filterModelConversion = {};
                pageLoading.show();
                debugger
                viewModelConversion.filterV2($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    if (res.data.length != 0) {
                        $scope.filterModelConversion = res.data.itemsProductConversion;
                    }
                    else {
                        $scope.filterModelConversion = res.data.itemsProductConversion;
                    }
                });
            }

            $scope.filterProductOwner = function () {
                $scope.filterModelOwner = {};
                pageLoading.show();
                viewModelProductOwner.filterV2($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    if (res.data.length != 0) {
                        $scope.filterModelOwner = res.data.itemsProductOwner;
                    }
                    else {
                        $scope.filterModelOwner = res.data.itemsProductOwner;
                    }
                });
            }

            $scope.addProductConversion = function () {
                $scope.filterModel.status = "create";
                viewModel.set($scope.filterModel)
                $state.go('wms.product_conversion_form');
            }

            $scope.addOwner = function () {
                $scope.filterModel.status = "create";
                viewModel.set($scope.filterModel)
                $state.go('wms.owner_form');
            }

            $scope.editConversionItem = function (param) {
                param.status = "update";
                viewModel.set(param)
                $state.go('wms.product_conversion_form');
            }

            $scope.editOwnerItem = function (param) {
                param.status = "update";
                viewModel.set(param)
                $state.go('wms.owner_form');
            }

            $scope.deleteConversionItem = function (param) {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'แจ้งเตือน',
                    message: 'คุณต้องการลบข้อมูลใช่หรือไม่'
                }).then(function success() {
                    viewModelConversion.getDelete(param).then(function success(res) {
                        if (res.data == true) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'ลบข้อมูลสำเร็จ'
                                }
                            )
                        }
                        $scope.filterProductConversion();
                    }, function error(res) { });
                });
            };

            $scope.deleteOwnerItem = function (param) {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'แจ้งเตือน',
                    message: 'คุณต้องการลบข้อมูลใช่หรือไม่'
                }).then(function success() {
                    viewModelProductOwner.getDelete(param).then(function success(res) {
                        if (res.data == true) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'ลบข้อมูลสำเร็จ'
                                }
                            )
                        }
                        $scope.filterProductOwner();
                    }, function error(res) { });
                });
            };

            //Validate & confirm Add
            $scope.add = function () {
                var model = $scope.filterModel;
                //ใช้ userName จาก localStorage
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                if (model.product_Id != "") {
                    if (!model.product_Id.match(/^([a-z0-9])+$/i)) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'รหัสสินค้าไม่ถูกต้อง'
                        })
                        return "";
                    } else {
                        model.product_Id = model.product_Id;
                    }
                }
                if (model.product_Name == undefined || model.product_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกชื่อสินค้า'
                    })
                    return "";
                }
                if (model.product_SecondName == undefined || model.product_SecondName == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกชื่อสินค้า 2'
                    })
                    return "";
                }
                if (model.product_ThirdName == undefined || model.product_ThirdName == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกชื่อสินค้า 3'
                    })
                    return "";
                }
                if (model.productCategory_Index == undefined || model.productCategory_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกหมวดสินค้า'
                    })
                    return "";
                }
                if (model.productType_Index == undefined || model.productType_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกประเภทสินค้า'
                    })
                    return "";
                }
                if (model.productSubType_Index == undefined || model.productSubType_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกประเภทสินค้าย่อย'
                    })
                    return "";
                }
                if (model.productConversion_Name == undefined || model.productConversion_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกหน่วย'
                    })
                    return "";
                }
                if (model.qty_Per_Tag == undefined || model.qty_Per_Tag == "" || model.qty_Per_Tag < 0) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกจำนวนต่อพาเลท'
                    })
                    return "";
                }
                // if (!(!isNaN(parseFloat(model.udf_1)) && angular.isNumber(parseFloat(model.udf_1)))) {
                //     dpMessageBox.alert(
                //         {
                //             ok: 'Close',
                //             title: 'Validate',
                //             message: 'Please insert number udf_1 !'
                //         }
                //     )
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
                            // if (res.data != "") {
                            //     $scope.buttons.addConvertion = true;
                            //     $scope.filterModel.product_Id = res.data;
                            //     defer.resolve('1');
                            //     $scope.filterModel = {};
                            // }
                            if (res.data == "Done") {
                                // $scope.buttons.addConvertion = true;
                                $scope.filterModel.product_Id = res.data;
                                defer.resolve('1');
                                $scope.filterModel = {};
                            }
                            else
                                if (res.data == "Fail") {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: 'รหัสสินค้าซ้ำ'
                                    })
                                    return "";
                                }
                            if (res.data == "Fail_User")  {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'User ท่านไม่มีสิทธิ์ในการบันทึก/แก้ไขข้อมูล'
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

            // $scope.addConvertion = function (index) {
            //     viewModel.set(index)
            //     $state.go('wms.product_conversion');
            //     // let _viewparam = productConversionFactory;
            //     // pageLoading.show();
            //     // _viewparam.setParam(index);
            //     // $state.go('wms.product_conversion', {

            //     // });
            // }

            //ย้อนกลับ
            $scope.back = function () {
                if ($scope.dataProductConversion != undefined) {
                    $state.go('wms.product');
                }
                else if ($scope.dataOwner != undefined) {
                    $state.go('wms.product');
                } else {
                    defer.resolve('1');
                }
            }

            $scope.buttons = {
                // addConvertion: false,
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

            $scope.autoComplete = {
                productCategory: "Autocomplete/autoProductCategoryAndProductCategoryId",
                productType: "Autocomplete/autoProductTypeAndProductTypeId",
                productSubType: "Autocomplete/autoProductSubTypeAndProductSubTypeId",
                productConversion: "Autocomplete/autoSearchProductConversionV2",
                owner: "Autocomplete/autoSearchOwnerV2",
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };

            $scope.$watch('filterModel.udf_1', function () {
                if ($scope.filterModel.udf_1 != null && $scope.filterModel.udf_1 != "" && $scope.filterModel.udf_1 != undefined) {
                    var myInput = document.querySelector('#fixed2');
                    myInput.value = myInput.value.replace(/(\.\d{2})\d+/g, '$1');
                }
            });



            var init = function () {
                $scope.clickTab(1);
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
                $scope.click = 1;
                $scope.dataProductConversion = productConversionFactory.get();
                $scope.dataOwner = ownerFactory.get();
                if ($scope.dataProductConversion != undefined) {
                    // $scope.click = 2;
                    $scope.filterModel = $scope.dataProductConversion;
                    $scope.onShow = true;
                    $vm.onShow($scope.filterModel);
                }
                if ($scope.dataOwner != undefined) {
                    // $scope.click = 3;
                    $scope.filterModel = $scope.dataOwner;
                    $scope.onShow = true;
                    $vm.onShow($scope.filterModel);
                }

            };
            init();
        }
    })
})();