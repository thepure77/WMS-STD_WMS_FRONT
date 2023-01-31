(function () {
    'use strict'

    app.component('productFormV2', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterProductV2/component/productFormV2.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            isFilter: '=?'
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, $stateParams, /*authService*/ pageLoading,
            $window, commonService, localStorageService, $translate, dpMessageBox, productFactoryV2, productConversionFactoryV2, productOwnerFactory, ownerFactory, webServiceAPI) {
            var $vm = this;
            $scope.onShow = false;
            var defer = {};
            var viewModel = productFactoryV2;
            var viewModelConversion = productConversionFactoryV2;
            var viewModelProductOwner = productOwnerFactory;
            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $scope.getCheck = false;
            $scope.getCheckIsLot = false;
            $scope.getCheckIsExpDate = false;
            $scope.getCheckIsMfgDate = false;
            $scope.getPending = false;
            $scope.getCheckisSerial = false;
            $scope.getCheckIsShelfLife = false;
            $scope.getCheckIsNotControl = false;

            $vm.onShow = function (param) {
                $scope.click = 1;
                $scope.dropdownbusinessUnit.model = {};
                $scope.dropdownMasterType.model = {};
                $scope.dropdownTempCondition.model = {};
                $scope.dropdownFireClass.model = {};
                $scope.dropdownMaterialClass.model = {};
                $scope.dropdownMovingCondition.model = {};
                $scope.dropdownProductHierarchy5.model = {};
                $scope.dropdownProductCategory.model = {};
                $scope.dropdowntypeProduct.model = {};
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

                        if ($scope.filterModel.isPending == 0 || $scope.filterModel.isPending == undefined) {
                            $scope.getPending = false;
                        } else {
                            $scope.getPending = true;
                        }

                        if ($scope.filterModel.isSerial == 0) {
                            $scope.getCheckisSerial = false;
                        } else {
                            $scope.getCheckisSerial = true;
                        }
                        if ($scope.filterModel.isMfgDate == 1 || $scope.filterModel.isExpDate == 1) {
                            $scope.getCheckIsShelfLife = true;
                            $scope.filterModel.isShelfLife = 1;
                        } else {
                            $scope.getCheckIsShelfLife = false;
                            $scope.filterModel.isShelfLife = 0;
                        }

                        if ($scope.filterModel.isLot == 0 && $scope.filterModel.isMfgDate == 0 &&
                            $scope.filterModel.isExpDate == 0 && $scope.filterModel.isSerial == 0 &&
                            $scope.filterModel.isShelfLife == 0) {
                            $scope.getCheckIsNotControl = true;
                            $scope.filterModel.isNotControl = 1;
                        } else {
                            $scope.getCheckIsNotControl = false;
                            $scope.filterModel.isNotControl = 0;
                        }

                        if ($scope.filterModel.isSAP == 1) {
                            $scope.filterModel.isSAP = 1
                            $scope.filterModel.isNonSAP = 0
                        } else {
                            $scope.filterModel.isSAP = 0
                            $scope.filterModel.isNonSAP = 1
                        }

                        var businessUnit = $scope.dropdownbusinessUnit
                        const resultsBusinessUnit = businessUnit.filter((businessUnit) => {
                            return businessUnit.businessUnit_Index == res.data.businessUnit_Index;
                        })
                        $scope.dropdownbusinessUnit.model = resultsBusinessUnit[0];

                        var masterType = $scope.dropdownMasterType
                        const resultsMasterType = masterType.filter((masterType) => {
                            return masterType.masterType_Index == res.data.masterType_Index;
                        })
                        $scope.dropdownMasterType.model = resultsMasterType[0];

                        var tempCondition = $scope.dropdownTempCondition
                        const resultsTempCondition = tempCondition.filter((tempCondition) => {
                            return tempCondition.tempCondition_Index == res.data.tempCondition_Index;
                        })
                        $scope.dropdownTempCondition.model = resultsTempCondition[0];

                        var fireClass = $scope.dropdownFireClass
                        const resultsFireClass = fireClass.filter((fireClass) => {
                            return fireClass.fireClass_Index == res.data.fireClass_Index;
                        })
                        $scope.dropdownFireClass.model = resultsFireClass[0];

                        var materialClass = $scope.dropdownMaterialClass
                        const resultsMaterialClass = materialClass.filter((materialClass) => {
                            return materialClass.materialClass_Index == res.data.materialClass_Index;
                        })
                        $scope.dropdownMaterialClass.model = resultsMaterialClass[0];

                        var movingCondition = $scope.dropdownMovingCondition
                        const resultsMovingCondition = movingCondition.filter((movingCondition) => {
                            return movingCondition.movingCondition_Index == res.data.movingCondition_Index;
                        })
                        $scope.dropdownMovingCondition.model = resultsMovingCondition[0];

                        var productHierarchy5 = $scope.dropdownProductHierarchy5
                        const resultsProductHierarchy5 = productHierarchy5.filter((productHierarchy5) => {
                            return productHierarchy5.productHierarchy5_Index == res.data.productHierarchy5_Index;
                        })
                        $scope.dropdownProductHierarchy5.model = resultsProductHierarchy5[0];

                        debugger
                        var productCategory = $scope.dropdownProductCategory
                        const resultsProductCategory = productCategory.filter((productCategory) => {
                            return productCategory.productCategory_Index == res.data.productCategory_Index;
                        })
                        $scope.dropdownProductCategory.model = resultsProductCategory[0];
                        
                       
                        var typeProduct = $scope.dropdowntypeProduct
                        const resultstypeProduct = typeProduct.filter((typeProduct) => {
                            return typeProduct.type_Production_Index == res.data.type_Production_Index;
                        })
                        $scope.dropdowntypeProduct.model = resultstypeProduct[0];
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
                    $scope.filterModel.isSAP = 0;
                    $scope.filterModel.isNonSAP = 0;
                    $scope.filterModel.isPending = 0;
                    $scope.filterModel.isSerialNumber = 0;
                    $scope.filterModel.isNotControl = 1;

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
                    add: function (param) {},
                    edit: function (param) {},
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
                    } else {
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
                    } else {
                        $scope.filterModelOwner = res.data.itemsProductOwner;
                    }
                });
            }

            $scope.addProductConversion = function () {
                $scope.filterModel.status = "create";
                viewModel.set($scope.filterModel)
                $state.go('wms.product_conversion_form_v2');
            }

            $scope.addOwner = function () {
                $scope.filterModel.status = "create";
                viewModel.set($scope.filterModel)
                $state.go('wms.owner_form');
            }

            $scope.editConversionItem = function (param) {
                param.status = "update";
                viewModel.set(param)
                $state.go('wms.product_conversion_form_v2');
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
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'ลบข้อมูลสำเร็จ'
                            })
                        }
                        $scope.filterProductConversion();
                    }, function error(res) {});
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
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'ลบข้อมูลสำเร็จ'
                            })
                        }
                        $scope.filterProductOwner();
                    }, function error(res) {});
                });
            };

            //Validate & confirm Add
            $scope.add = function () {
                //var model = $scope.filterModel;
                if ($scope.dropdownMovingCondition.model != null) {
                    $scope.filterModel.movingCondition_Index = $scope.dropdownMovingCondition.model.movingCondition_Index;
                    $scope.filterModel.movingCondition_Id = $scope.dropdownMovingCondition.model.movingCondition_Id;
                    $scope.filterModel.movingCondition_Name = $scope.dropdownMovingCondition.model.movingCondition_Name;
                } else {
                    $scope.filterModel.movingCondition_Index = undefined;
                    $scope.filterModel.movingCondition_Id = undefined;
                    $scope.filterModel.movingCondition_Name = undefined;
                }
                //ใช้ userName จาก localStorage
                $scope.filterModel.create_By = $scope.userName;
                $scope.validateMsg = "";
                if ($scope.filterModel.product_Id != "") {
                    if (!$scope.filterModel.product_Id.match(/^([a-z0-9])+$/i)) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'รหัสสินค้าไม่ถูกต้อง'
                        })
                        return "";
                    } else {
                        $scope.filterModel.product_Id = $scope.filterModel.product_Id;
                    }
                }
                if ($scope.filterModel.product_Name == undefined || $scope.filterModel.product_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกชื่อสินค้า'
                    })
                    return "";
                }
                // if (model.product_SecondName == undefined || model.product_SecondName == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกชื่อสินค้า 2'
                //     })
                //     return "";
                // }
                // if (model.product_ThirdName == undefined || model.product_ThirdName == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกชื่อสินค้า 3'
                //     })
                //     return "";
                // }
                // if (model.productCategory_Index == undefined || model.productCategory_Index == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกหมวดสินค้า'
                //     })
                //     return "";
                // }
                if ($scope.filterModel.productType_Index == undefined || $scope.filterModel.productType_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกประเภทสินค้า'
                    })
                    return "";
                }
                if ($scope.filterModel.productSubType_Index == undefined || $scope.filterModel.productSubType_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกประเภทสินค้าย่อย'
                    })
                    return "";
                }
                if ($scope.filterModel.productConversion_Name == undefined || $scope.filterModel.productConversion_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกหน่วย'
                    })
                    return "";
                }
                // if (model.qty_Per_Tag == undefined || model.qty_Per_Tag == "" || model.qty_Per_Tag < 0) {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกจำนวนต่อพาเลท'
                //     })
                //     return "";
                // }
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

                if ($scope.dropdownbusinessUnit.model != null) {
                    $scope.filterModel.businessUnit_Index = $scope.dropdownbusinessUnit.model.businessUnit_Index;
                    $scope.filterModel.businessUnit_Id = $scope.dropdownbusinessUnit.model.businessUnit_Id;
                    $scope.filterModel.businessUnit_Name = $scope.dropdownbusinessUnit.model.businessUnit_Name;
                } else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'ALERT',
                        message: 'กรุณาเลือก Business Unit !'
                    })
                    return "";
                }

                if ($scope.filterModel.isSAP == undefined || $scope.filterModel.isNonSAP == undefined) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณาเลือกกลุ่มสินค้า'
                    })
                    return "";
                }

                if ($scope.dropdownMasterType.model != null) {
                    $scope.filterModel.masterType_Index = $scope.dropdownMasterType.model.masterType_Index;
                    $scope.filterModel.masterType_Id = $scope.dropdownMasterType.model.masterType_Id;
                    $scope.filterModel.masterType_Name = $scope.dropdownMasterType.model.masterType_Name;
                } else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'ALERT',
                        message: 'กรุณาเลือก Master Type !'
                    })
                    return "";
                }

                if ($scope.dropdownTempCondition.model != null) {
                    $scope.filterModel.tempCondition_Index = $scope.dropdownTempCondition.model.tempCondition_Index;
                    $scope.filterModel.tempCondition_Id = $scope.dropdownTempCondition.model.tempCondition_Id;
                    $scope.filterModel.tempCondition_Name = $scope.dropdownTempCondition.model.tempCondition_Name;
                } else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'ALERT',
                        message: 'กรุณาเลือก Temp Condition !'
                    })
                    return "";
                }

                // new dropdown
                if ($scope.dropdowntypeProduct.model != null) {
                    $scope.filterModel.type_Production_Index = $scope.dropdowntypeProduct.model.type_Production_Index;
                    $scope.filterModel.type_Production_Id = $scope.dropdowntypeProduct.model.type_Production_Id;
                    $scope.filterModel.type_Production_Name = $scope.dropdowntypeProduct.model.type_Production_Name;
                } else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'ALERT',
                        message: 'กรุณาเลือก Type Product'
                    })
                    return "";
                }

                if ($scope.dropdownFireClass.model != null) {
                    $scope.filterModel.fireClass_Index = $scope.dropdownFireClass.model.fireClass_Index;
                    $scope.filterModel.fireClass_Id = $scope.dropdownFireClass.model.fireClass_Id;
                    $scope.filterModel.fireClass_Name = $scope.dropdownFireClass.model.fireClass_Name;
                } else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'ALERT',
                        message: 'กรุณาเลือก Fire Class !'
                    })
                    return "";
                }

                if ($scope.dropdownMaterialClass.model != null) {
                    $scope.filterModel.materialClass_Index = $scope.dropdownMaterialClass.model.materialClass_Index;
                    $scope.filterModel.materialClass_Id = $scope.dropdownMaterialClass.model.materialClass_Id;
                    $scope.filterModel.materialClass_Name = $scope.dropdownMaterialClass.model.materialClass_Name;
                } else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'ALERT',
                        message: 'กรุณาเลือก Material Class !'
                    })
                    return "";
                }

                if ($scope.filterModel.isSAP == 1) {
                    if ($scope.dropdownProductHierarchy5.model) {
                        $scope.filterModel.productHierarchy5_Index = $scope.dropdownProductHierarchy5.model.productHierarchy5_Index;
                        $scope.filterModel.productHierarchy5_Id = $scope.dropdownProductHierarchy5.model.productHierarchy5_Id;
                        $scope.filterModel.productHierarchy5_Name = $scope.dropdownProductHierarchy5.model.productHierarchy5_Name;
                    } else {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'กรุณาเลือก ProductHierarchy5 !'
                        })
                        return "";
                    }
                } else {
                    $scope.filterModel.productHierarchy5_Index = undefined;
                    $scope.filterModel.productHierarchy5_Id = undefined;
                    $scope.filterModel.productHierarchy5_Name = undefined;
                }

                //new dropdown
                // if ($scope.filterModel.isSAP == 1) {
                //     if ($scope.dropdowntypeProduct.model) {
                //         $scope.filterModel.type_Product_Index = $scope.dropdowntypeProduct.model.type_Product_Index;
                //         $scope.filterModel.type_Product_Id = $scope.dropdowntypeProduct.model.type_Product_Id;
                //         $scope.filterModel.type_Product_Name = $scope.dropdowntypeProduct.model.type_Product_Name;
                //     } else {
                //         dpMessageBox.alert({
                //             ok: 'Close',
                //             title: 'ALERT',
                //             message: 'กรุณาเลือก Type Product'
                //         })
                //         return "";
                //     }
                // } else {
                //     $scope.filterModel.type_Product_Index = undefined;
                //     $scope.filterModel.type_Product_Id = undefined;
                //     $scope.filterModel.type_Product_Name = undefined;
                // }
                // if ($scope.filterModel.type_product == undefined || $scope.filterModel.type_product == "" || $scope.filterModel.type_product == null) {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณาเลือก Type Production'
                //     })
                //     return "";
                // }

                if ($scope.filterModel.isNonSAP == 1) {
                    if ($scope.dropdownProductCategory.model) {
                        $scope.filterModel.productCategory_Index = $scope.dropdownProductCategory.model.productCategory_Index;
                        $scope.filterModel.productCategory_Id = $scope.dropdownProductCategory.model.productCategory_Id;
                        $scope.filterModel.productCategory_Name = $scope.dropdownProductCategory.model.productCategory_Name;
                    } else {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'กรุณาเลือก ProductCategory !'
                        })
                        return "";
                    }
                } else {
                    $scope.filterModel.productCategory_Index = undefined;
                    $scope.filterModel.productCategory_Id = undefined;
                    $scope.filterModel.productCategory_Name = undefined;
                }

                debugger
                if ($scope.filterModel.isShelfLife == 1) {
                    if ($scope.filterModel.productItemLife_D == undefined || $scope.filterModel.productItemLife_D == "") {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณาระบุอายุสินค้า'
                        })
                        return "";
                    }
                
                    

                    if ($scope.filterModel.ref_No3 == undefined || $scope.filterModel.ref_No3 == "") {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณาระบุอายุคงเหลือรับเข้าคลัง'
                        })
                        return "";
                    }

                    if ($scope.filterModel.shelfLeft_alert == undefined || $scope.filterModel.shelfLeft_alert == "") {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณาระบุอายุแจ้งเตือน'
                        })
                        return "";
                    }

                    if ($scope.filterModel.productShelfLife_D == undefined || $scope.filterModel.productShelfLife_D == "") {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณาระบุอายุคงเหลือก่อนถึงร้านสาขา'
                        })
                        return "";
                    } 
                    
                    
                }  
                // else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'ยืนยันข้อมูล',
                        message: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่'
                    }).then(function () {
                        pageLoading.show();
                        Add($scope.filterModel).then(function success(res) {
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
                                $scope.dropdownbusinessUnit.model = {};
                                $scope.dropdownMasterType.model = {};
                                $scope.dropdownTempCondition.model = {};
                                $scope.dropdownFireClass.model = {};
                                $scope.dropdownMaterialClass.model = {};
                                $scope.dropdownMovingCondition.model = {};
                                $scope.dropdownProductHierarchy5.model = {};
                                $scope.dropdownProductCategory.model = {};
                                $scope.dropdowntypeProduct.model = {};
                            } else
                            if (res.data == "Fail") {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'รหัสสินค้าซ้ำ'
                                })
                                return "";
                            }
                            if (res.data == "Fail_User") {
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
                // }
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
                    $state.go('wms.productv2');
                    $scope.dropdownbusinessUnit.model = {};
                    $scope.dropdownMasterType.model = {};
                    $scope.dropdownTempCondition.model = {};
                    $scope.dropdownFireClass.model = {};
                    $scope.dropdownMaterialClass.model = {};
                    $scope.dropdownMovingCondition.model = {};
                    $scope.dropdownProductHierarchy5.model = {};
                    $scope.dropdownProductCategory.model = {};
                    $scope.dropdowntypeProduct.model = {};
                    $scope.dataProductConversion = undefined;
                } else if ($scope.dataOwner != undefined) {
                    $state.go('wms.productv2');
                    $scope.dropdownbusinessUnit.model = {};
                    $scope.dropdownMasterType.model = {};
                    $scope.dropdownTempCondition.model = {};
                    $scope.dropdownFireClass.model = {};
                    $scope.dropdownMaterialClass.model = {};
                    $scope.dropdownMovingCondition.model = {};
                    $scope.dropdownProductHierarchy5.model = {};
                    $scope.dropdownProductCategory.model = {};
                    $scope.dropdowntypeProduct.model = {};
                } else {
                    defer.resolve('1');
                    $scope.dropdownbusinessUnit.model = {};
                    $scope.dropdownMasterType.model = {};
                    $scope.dropdownTempCondition.model = {};
                    $scope.dropdownFireClass.model = {};
                    $scope.dropdownMaterialClass.model = {};
                    $scope.dropdownMovingCondition.model = {};
                    $scope.dropdownProductHierarchy5.model = {};
                    $scope.dropdownProductCategory.model = {};
                    $scope.dropdowntypeProduct.model = {};
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
                productConversionAll: "Autocomplete/autoSearchProductConversionV3",
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

            $scope.radio1 = function (value) {
                if (value == 1) {
                    $scope.filterModel.isNonSAP = 0;
                    $scope.filterModel.isSAP = 1;
                }
            }
            $scope.radio2 = function (value) {
                if (value == 1) {
                    $scope.filterModel.isNonSAP = 1;
                    $scope.filterModel.isSAP = 0;
                }
            }

            $scope.$watch('filterModel.isSerial', function () {
                if ($scope.filterModel.isSerial == 1) {
                    $scope.filterModel.isNotControl = 0;
                }
            });

            $scope.$watch('filterModel.isLot', function () {
                if ($scope.filterModel.isLot == 1) {
                    $scope.filterModel.isNotControl = 0;
                }
            });

            $scope.$watch('filterModel.isShelfLife', function () {
                if ($scope.filterModel.isShelfLife == 0) {
                    $scope.filterModel.isMfgDate = 0;
                    $scope.filterModel.isExpDate = 0;
                } else {
                    $scope.filterModel.isNotControl = 0;
                }
            });

            $scope.$watch('filterModel.isNotControl', function () {
                if ($scope.filterModel.isNotControl == 1) {
                    $scope.filterModel.isSerial = 0;
                    $scope.filterModel.isLot = 0;
                    $scope.filterModel.isShelfLife = 0;
                    $scope.filterModel.isMfgDate = 0;
                    $scope.filterModel.isExpDate = 0;
                }
            });

            $scope.$watch('filterModel.productConversion', function () {
                $scope.filterModel.productConversion_Name = $scope.filterModel.productConversion;
            });


            //DropDown
            $scope.dropdownbusinessUnit = function () {
                viewModel.dropdownbusinessUnit($scope.filterModel).then(function (res) {
                    $scope.dropdownbusinessUnit = res.data.itemsBusinessUnit;
                });
            };
            $scope.dropdownMasterType = function () {
                viewModel.dropdownMasterType($scope.filterModel).then(function (res) {
                    $scope.dropdownMasterType = res.data.itemsMasterType;
                });
            };
            $scope.dropdownTempCondition = function () {
                viewModel.dropdownTempCondition($scope.filterModel).then(function (res) {
                    $scope.dropdownTempCondition = res.data.itemsTempCondition;
                });
            };
            $scope.dropdownFireClass = function () {
                viewModel.dropdownFireClass($scope.filterModel).then(function (res) {
                    $scope.dropdownFireClass = res.data.itemsFireClass;
                });
            };
            $scope.dropdownMaterialClass = function () {
                viewModel.dropdownMaterialClass($scope.filterModel).then(function (res) {
                    $scope.dropdownMaterialClass = res.data.itemsMaterialClass;
                });
            };
            $scope.dropdownMovingCondition = function () {
                viewModel.dropdownMovingCondition($scope.filterModel).then(function (res) {
                    $scope.dropdownMovingCondition = res.data.itemsMovingCondition;
                });
            };
            $scope.dropdownProductHierarchy5 = function () {
                viewModel.dropdownProductHierarchy5($scope.filterModel).then(function (res) {
                    $scope.dropdownProductHierarchy5 = res.data.itemsProductHierarchy5;
                });
            };
            $scope.dropdownProductCategory = function () {
                viewModel.dropdownProductCategory($scope.filterModel).then(function (res) {
                    $scope.dropdownProductCategory = res.data.itemsProductCategory;
                });
            };
            $scope.dropdowntypeProduct = function () {
                viewModel.dropdowntypeProduct($scope.filterModel).then(function (res) {
                    $scope.dropdowntypeProduct = res.data.itemsTypeProduct;
                })
            }

            var init = function () {
                $scope.clickTab(1);
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
                $scope.dropdowntypeProduct();
                $scope.dropdownbusinessUnit();
                $scope.dropdownMasterType();
                $scope.dropdownTempCondition();
                $scope.dropdownFireClass();
                $scope.dropdownMaterialClass();
                $scope.dropdownMovingCondition();
                $scope.dropdownProductHierarchy5();
                $scope.dropdownProductCategory();
                $scope.click = 1;
                $scope.filterModel.load = 1;
                $scope.dataProductConversion = viewModelConversion.get();
                $scope.dataOwner = ownerFactory.get();
                if ($scope.dataProductConversion != undefined) {
                    // $scope.click = 2;
                    $scope.filterModel = $scope.dataProductConversion;
                    $scope.onShow = true;
                    setTimeout(function () {
                        $vm.onShow($scope.filterModel);
                    }, 800);
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