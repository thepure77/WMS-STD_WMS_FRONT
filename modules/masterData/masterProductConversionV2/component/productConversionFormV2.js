
(function () {
    'use strict'

    app.component('productConversionFormV2', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterProductConversionV2/component/productConversionFormV2.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, productConversionFactoryV2, productFactoryV2, productConversionBarcodeFactory, webServiceAPI,Upload) {
            var $vm = this;
            $scope.onShow = false;
            var defer = {};
            var viewModel = productConversionFactoryV2;
            var viewModelProduct = productFactoryV2;

            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $scope.getCheck = false;
            $scope.Volumn = [];
            $scope.dropdownWeight = [];
            $scope.dropdownGrsWeight = [];

            $vm.onShow = function (param) {
                
                $scope.clickTab(1);
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};
                    $scope.actionVolumn = "0";
                }
                $scope.onShow = true;
                $scope.Volumn.model = {};
                $scope.dropdownWeight.model = {};
                $scope.dropdownGrsWeight.model = {};

                if (param != undefined) {
                    pageLoading.show();
                    $scope.create = false;
                    viewModel.find(param.productConversion_Index).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;

                        var Volumn = $scope.Volumn
                        const resultsVolumn = Volumn.filter((v) => {
                            return v.volume_Index == res.data.productConversion_Volume_Index;
                        })
                        $scope.Volumn.model = resultsVolumn[0];

                        var dropdownWeight = $scope.dropdownWeight
                        const resultsWeight = dropdownWeight.filter((w) => {
                            return w.weight_Index == res.data.productConversion_Weight_Index;
                        })
                        $scope.dropdownWeight.model = resultsWeight[0];
                        
                        var dropdownGrsWeight = $scope.dropdownGrsWeight
                        const resultsGrsWeight = dropdownGrsWeight.filter((gw) => {
                            return gw.weight_Index == res.data.productConversion_GrsWeight_Index;
                        })
                        $scope.dropdownGrsWeight.model = resultsGrsWeight[0];


                        $scope.update = true;
                        // ConvertData();
                        if ($scope.filterModel.isActive == 0) {
                            $scope.getCheck = false;
                        } else {
                            $scope.getCheck = true;
                        }
                        if ($scope.disData == true) {
                            $scope.update = false
                            $scope.create = false;
                        }
                        
                        $scope.calculateQtyPerTag();
                        
                    });
                } else {
                    $scope.update = false
                    $scope.create = true;
                    $scope.getCheck = true;
                    $scope.filterModel.isActive = 1;
                    $scope.actionVolumn = "1";
                    // $scope.filterModel.productConversion_VolumeRatio = 1;
                    $scope.filterModel.productConversion_Id = "";
                    if ($scope.disData == true) {
                        $scope.update = false
                        $scope.create = false;
                        ProductData();
                    }
                }
                return defer.promise;
            };

            $scope.$watch('tapchage', function () {
                
                if ($scope.filterModel != undefined) {
                    $scope.filterModel.key = $scope.dataItem.product_Id + " - " + $scope.dataItem.product_Name;
                }
            });

            $scope.clickTab = function (tab) {
                
                if (tab == 1) {
                    $scope.colortable1 = "#FDFEFE";
                    $scope.colortable2 = "#D3D3D3";
                    $scope.tapchage = 1;
                  }
                else if (tab == 2) {
                    $scope.colortable1 = "#D3D3D3";
                    $scope.colortable2 = "#FDFEFE";
                    $scope.filterModel.key = null;
                    $scope.tapchage = 2;
                    $scope.searchFilterProductConversionBarcode();
                }
                $scope.click = tab;
            }

            $scope.uploadFile = {
                url: webServiceAPI.Master + "Product/importFilePic",
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
                        
                        if(param.documents == undefined){
                            param.documents = [];
                        }
                        debugger
                        param.documents.push({ path: resp.data.value, urlAttachFile: resp.data.url, type: "Master", filename: resp.data.url.replace(/^.*[\\\/]/, ''), isDelete: false });
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

            $scope.addProductConversionBarcode = function () {
                $scope.filterModel.status = "update";
                viewModel.set($scope.filterModel)
                $state.go('wms.product_conversion_barcode_form');
            }

            $scope.editItemProductConversionBarcode = function (param) {
                param.status = "update";
                viewModel.set(param)
                $state.go('wms.product_conversion_barcode_form')
            }

            $scope.searchFilterProductConversionBarcode = function () {
                pageLoading.show();
                viewModel.filterProductConversionBarcode($scope.filterModel.productConversion_Index, $scope.filterModel.product_Index, $scope.filterModel.key).then(function (res) {
                    pageLoading.hide();
                    if (res.data.length != 0) {
                        $scope.filterModel.listProductConversionBarcodeItemViewModel = res.data.listProductConversionBarcodeItemViewModel;
                    } else {
                        $scope.filterModel.listProductConversionBarcodeItemViewModel = res.data.listProductConversionBarcodeItemViewModel;
                    }
                });
            };

            $vm.triggerSearch = function () {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsProductConversion;
                });
            };

            $scope.limitMaxRatio = function (number) {
                if (number >= 999999.999) {
                    $scope.filterModel.productConversion_Ratio = 999999.999;
                }
                if(number < 0){
                    $scope.filterModel.productConversion_Ratio = 0;
                }
                $scope.calculateQtyPerTag();
              };

              $scope.limitMaxWeight = function (number) {
                if (number >= 999999.999) {
                    $scope.filterModel.productConversion_Weight = 999999.999;
                }
                if(number < 0){
                    $scope.filterModel.productConversion_Weight = 0;
                }
              };

              $scope.limitMaxGrsWeight = function (number) {
                if (number >= 999999.999) {
                    $scope.filterModel.productConversion_GrsWeight = 999999.999;
                }
                if(number < 0){
                    $scope.filterModel.productConversion_GrsWeight = 0;
                }
              };

              $scope.limitMaxWidth = function (number) {
                if (number >= 999999.999) {
                    $scope.filterModel.productConversion_Width = 999999.999;
                }
                if(number < 0){
                    $scope.filterModel.productConversion_Width = 0;
                }
              };

              $scope.limitMaxLength = function (number) {
                if (number >= 999999.999) {
                    $scope.filterModel.productConversion_Length = 999999.999;
                }
                if(number < 0){
                    $scope.filterModel.productConversion_Length = 0;
                }
              };

              $scope.limitMaxHeight = function (number) {
                if (number >= 999999.999) {
                    $scope.filterModel.productConversion_Height = 999999.999;
                }
                if(number < 0){
                    $scope.filterModel.productConversion_Height = 0;
                }
              };

            // $scope.popupProductConversionBarcode = {
            //     onShow: false,
            //     delegates: {},
            //     onClick: function (param, index) {
            //         $scope.popupProductConversionBarcode.onShow = !$scope.popupProductConversionBarcode.onShow;
            //         $scope.popupProductConversionBarcode.delegates.productConversionBarcodePopup(param, index, $scope.filterModel.listProductConversionBarcodeViewModel);
            //     },
            //     config: {
            //         title: "productConversionBarcodePopup"
            //     },
            //     invokes: {
            //         add: function (param) { },
            //         edit: function (param) { },
            //         selected: function (param) {
            //             $scope.filterModel.listProductConversionBarcodeViewModel = $scope.filterModel.listProductConversionBarcodeViewModel || []
            //             $scope.filterModel.listProductConversionBarcodeViewModel = param;
            //             $scope.searchFilterProductConversionBarcode();
            //         }
            //     }
            // };

            //Validate & confirm Add
            $scope.add = function () {
                var model = $scope.filterModel;
                //ใช้ userName จาก localStorage
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                if (model.productConversion_Id != "") {
                    if (!model.productConversion_Id.match(/^([a-z0-9])+$/i)) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Material Conversion ID is required !!'
                        })
                        return "";
                    } else {
                        model.productConversion_Id = model.productConversion_Id;
                    }
                }
                if (model.product_Index == undefined || model.product_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Material is required !!'
                    })
                    return "";
                }
                if (model.productConversion_Name == undefined || model.productConversion_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Material Conversion Name is required !!'
                    })
                    return "";
                }
                // if (model.productConversion_SecondName == undefined || model.productConversion_SecondName == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'Validate',
                //         message: 'Material Conversion Second Name is required !!'
                //     })
                //     return "";
                // }
                if (model.productConversion_Ratio == undefined || model.productConversion_Ratio == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Material Conversionb Ratio is required !!'
                    })
                    return "";
                }
                if (model.productConversion_Weight === undefined || model.productConversion_Weight === "" || model.productConversion_Weight === null || model.productConversion_Weight < 0) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Material Conversion Weight is required !!'
                    })
                    return "";
                }
                if (model.productConversion_GrsWeight === undefined || model.productConversion_GrsWeight === "" ||  model.productConversion_GrsWeight === null || model.productConversion_GrsWeight < 0) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Material Conversion Grs Weight is required !!'
                    })
                    return "";
                }
                if (model.productConversion_Width == undefined || model.productConversion_Width == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Material Conversion Width is required !!'
                    })
                    return "";
                }
                if (model.productConversion_Length == undefined || model.productConversion_Length == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Material Conversion Length is required !!'
                    })
                    return "";
                }
                if (model.productConversion_Height == undefined || model.productConversion_Height == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Material Conversion Height is required !!'
                    })
                    return "";
                }
                // if (model.productConversion_VolumeRatio == undefined || model.productConversion_VolumeRatio == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'Validate',
                //         message: 'Material Conversion VolumeRatio is required !!'
                //     })
                //     return "";
                // }

                //#region by dropdown Weight
                if ($scope.dropdownWeight) {
                    if ($scope.dropdownWeight.model != null) {
                        $scope.filterModel.productConversion_Weight_Index = $scope.dropdownWeight.model.weight_Index;
                        $scope.filterModel.productConversion_Weight_Id = $scope.dropdownWeight.model.weight_Id;
                        $scope.filterModel.productConversion_Weight_Name = $scope.dropdownWeight.model.weight_Name;
                        $scope.filterModel.productConversion_WeightRatio = $scope.dropdownWeight.model.weight_Ratio;
                    }
                    else {
                        $scope.filterModel.productConversion_Weight_Index = null;
                        $scope.filterModel.productConversion_Weight_Id = null;
                        $scope.filterModel.productConversion_Weight_Name = null;
                        $scope.filterModel.productConversion_WeightRatio = null;
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Unit Weight is required !!'
                        })
                        return "";
                    }
                }
              
                if ($scope.dropdownGrsWeight) {
                    if ($scope.dropdownGrsWeight.model != null) {
                        $scope.filterModel.productConversion_GrsWeight_Index = $scope.dropdownGrsWeight.model.weight_Index;
                        $scope.filterModel.productConversion_GrsWeight_Id = $scope.dropdownGrsWeight.model.weight_Id;
                        $scope.filterModel.productConversion_GrsWeight_Name = $scope.dropdownGrsWeight.model.weight_Name;
                        $scope.filterModel.productConversion_GrsWeightRatio = $scope.dropdownGrsWeight.model.weight_Ratio;
                    }
                    else {
                        $scope.filterModel.productConversion_GrsWeight_Index = null;
                        $scope.filterModel.productConversion_GrsWeight_Id = null;
                        $scope.filterModel.productConversion_GrsWeight_Name = null;
                        $scope.filterModel.productConversion_GrsWeightRatio = null;
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Unit Grs Weight is required !!'
                        })
                        return "";
                    }
                }
                //#endregion
                
                if ($scope.Volumn) {
                    if ($scope.Volumn.model != null) {
                        $scope.filterModel.productConversion_Volume_Index = $scope.Volumn.model.volume_Index;
                        $scope.filterModel.productConversion_Volume_Id = $scope.Volumn.model.volume_Id;
                        $scope.filterModel.productConversion_Volume_Name = $scope.Volumn.model.volume_Name;
                        $scope.filterModel.productConversion_VolumeRatio = $scope.Volumn.model.volume_Ratio;
                    }
                    else {
                        $scope.filterModel.productConversion_Volume_Index = null;
                        $scope.filterModel.productConversion_Volume_Id = null;
                        $scope.filterModel.productConversion_Volume_Name = null;
                        $scope.filterModel.productConversion_VolumeRatio = null;
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Unit Weight is required !!'
                        })
                        return "";
                    }
                }
                if (model.in_UNIT == 1) {
                    if (model.ref_No1 == undefined || model.ref_No1 == "")
                    {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Check INUNIT "TI" is required !!'
                        })
                        return "";                        
                    }

                    if (model.ref_No2 == undefined || model.ref_No2 == "")
                    {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Check INUNIT "HI" is required !!'
                        })
                        return "";                        
                    }

                }

                if (model.productConversion_Volume == undefined || model.productConversion_Volume == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Material Conversion Volume is required !!'
                    })
                    return "";
                }                
                else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'Confirm ?',
                        message: 'Do you want to save !'
                    }).then(function () {
                        pageLoading.show();
                        Add(model).then(function success(res) {

                            pageLoading.hide();
                            if (res.data == "Done") {
                                if ($scope.dataItem != undefined) {
                                    viewModel.set($scope.dataItem)
                                    $state.go('wms.product_form_v2');
                                } else {
                                    defer.resolve('1');
                                }
                                $scope.filterModel = {};
                            }
                            else if (res.data == "Fail") {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Validate',
                                    message: 'Material Conversion ID is Dupplicate !!'
                                })
                                return "";
                            }else {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Validate',
                                    message: res.data
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


            $scope.deleteProductConversionBarcode = function (param) {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'แจ้งเตือน',
                    message: 'คุณต้องการลบข้อมูลใช่หรือไม่'
                }).then(function success() {
                    viewModel.getDeleteProductConversionBarcode(param).then(function success(res) {
                        if (res.data == true) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'ลบข้อมูลสำเร็จ'
                            })
                        }
                        $scope.searchFilterProductConversionBarcode();
                    }, function error(res) { });
                });
            };
            //ย้อนกลับ

            $scope.back = function () {
                if ($scope.dataItem != undefined) {
                    viewModel.set($scope.dataItem)
                    $state.go('wms.product_form_v2');
                }
                else if ($scope.dataProductConversion != undefined) {
                    $state.go('wms.product_conversion_v2');
                } else {
                    defer.resolve('1');
                }
            }


            function ConvertData() {
                let param = $scope.filterModel;
                if (param.productConversion_VolumeRatio != null) {
                    $scope.actionVolumn = param.productConversion_VolumeRatio.toString();
                }

            };

            //select dropdown
            $scope.selectVolumn = function () {
                var item = $scope.actionVolumn;
                if (item != 0) {
                    $scope.filterModel.productConversion_VolumeRatio = item;
                }
                else {
                    $scope.filterModel.productConversion_VolumeRatio = item;
                }
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
                product: "Autocomplete/autoProductAndProductId",
                productConversionBarcode: "Autocomplete/autoSearchProductConvertionBarcodeOwner",

            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };

            function ProductData() {
                $scope.filterModel.product_Index = $scope.productModel.product_Index;
                $scope.filterModel.product_Id = $scope.productModel.product_Id;
                $scope.filterModel.product_Name = $scope.productModel.product_Name;
                $scope.filterModel.key = $scope.productModel.product_Id + " - " + $scope.productModel.product_Name;
                // console.log( $scope.productModel);
            }

            function dropdownWeight(param) {
                viewModel.dropdownWeight({}).then(function (res) {
                    
                    $scope.dropdownWeight = angular.copy(res.data);
                    $scope.dropdownGrsWeight = angular.copy(res.data);
                    if (param.productConversion_Weight_Index) {
                        $scope.dropdownWeight.model = $scope.dropdownWeight.find(f => f.weight_Index == param.productConversion_Weight_Index);
                        $scope.dropdownGrsWeight.model = $scope.dropdownGrsWeight.find(f => f.weight_Index == param.productConversion_GrsWeight_Index);
                    }
                });
            };


            function dropdownVolume(param) {
                viewModel.dropdownVolume({}).then(function (res) {
                    $scope.Volumn = angular.copy(res.data);
                    if (param.productConversion_Volume_Index) {
                        $scope.Volumn.model = $scope.Volumn.find(f => f.volume_Index == param.productConversion_Volume_Index);
                    }
                });
            };

            $scope.calculateVolume = function (unit) {
                if (unit) {
                    $scope.filterModel.productConversion_Volume = ((($scope.filterModel.productConversion_Width * $scope.filterModel.productConversion_Length * $scope.filterModel.productConversion_Height) / unit.volume_Ratio) / 1000000).toFixed(10);
                }
            }

            $scope.calculateQtyPerTag = function () {
               //
               if ($scope.filterModel.in_UNIT == 1) {
                $scope.filterModel.qty_Per_Tag = ($scope.filterModel.ref_No1 * $scope.filterModel.ref_No2) * $scope.filterModel.productConversion_Ratio ;
               }
                   //}
            }
            
            $scope.inUnitChange = function () {
                if ($scope.filterModel.in_UNIT == 1) {
                    $scope.calculateQtyPerTag();
                }else {
                    $scope.filterModel.qty_Per_Tag = 0;
                }
            }

            var init = function () {
                
                $scope.tapchage = 0;
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.clickTab(1);
                $scope.filterModel = {};
                $scope.actionVolumn = "0";
                $scope.productModel = {};
                $scope.dataProductConversion = productConversionBarcodeFactory.get();
                if ($scope.dataProductConversion != undefined) {
                    $scope.filterModel = $scope.dataProductConversion;
                    $scope.onShow = true;
                    $vm.onShow($scope.filterModel);
                }
                
                $scope.dataItem = {};
                $scope.dataItem = viewModelProduct.get();
                
                if ($scope.dataItem != undefined) {
                    if ($scope.dataItem.status == "create") {
                        $scope.onShow = true;
                        $scope.productModel.product_Index = $scope.dataItem.product_Index;
                        $scope.productModel.product_Id = $scope.dataItem.product_Id;
                        $scope.productModel.product_Name = $scope.dataItem.product_Name;
                        $scope.productModel.key = $scope.dataItem.product_Id + " - " + $scope.dataItem.product_Name;
                        $scope.disData = true;

                        $vm.onShow();
                    }
                    if ($scope.dataItem.status == "update") {
                        $scope.onShow = true;
                        $scope.productModel.product_Index = $scope.dataItem.product_Index;
                        $scope.productModel.product_Id = $scope.dataItem.product_Id;
                        $scope.productModel.product_Name = $scope.dataItem.product_Name;
                        $scope.productModel.key = $scope.dataItem.product_Id + " - " + $scope.dataItem.product_Name;
                        // $scope.disData = true;

                        $vm.onShow($scope.dataItem);
                    }
                }

                dropdownWeight($scope.dataItem);
                dropdownVolume($scope.dataItem);
                $scope.calculateQtyPerTag();
            };
            init();

            // $vm.onShow = function (param) {
            //     defer = $q.defer();                
            //     if ($scope.filterModel != null) {
            //         $scope.filterModel = {};
            //         $scope.actionVolumn = "0";
            //     }
            //     $scope.onShow = true;
            //     if (param != undefined) {
            //         pageLoading.show();
            //         $scope.create = false;
            //         viewModel.getId(param).then(function (res) {
            //             pageLoading.hide();
            //             $scope.filterModel = res.data[0];
            //             ConvertData();
            //             $scope.update = true;
            //         });
            //     }
            //     else {
            //         $scope.update = false
            //         $scope.create = true;
            //     }
            //     return defer.promise;
            // };

            // $vm.triggerSearch = function () {
            //     $vm.filterModel = $vm.filterModel || {};
            //     pageLoading.show();
            //     viewModel.filter().then(function (res) {
            //         pageLoading.hide();
            //         $vm.filterModel = res.data;
            //         $vm.searchResultModel = res.data;
            //     });
            // };

            // $scope.add = function () {
            //     var model = $scope.filterModel;
            //     $scope.validateMsg = "";
            //     validate(model).then(function (result) {
            //         if (result) {
            //             $scope.validateMsg = result;
            //             dpMessageBox.alert(
            //                 {
            //                     ok: 'Close',
            //                     title: 'Validate',
            //                     message: result
            //                 }
            //             )
            //         }
            //         else {
            //             dpMessageBox.confirm({
            //                 ok: 'Yes',
            //                 cancel: 'No',
            //                 title: 'Confirm ?',
            //                 message: 'Do you want to save !'
            //             }).then(function () {
            //                 pageLoading.show();
            //                 Add(model).then(function success(res) {
            //                     pageLoading.hide();
            //                     $state.reload($state.current.name);
            //                 }, function error(param) {
            //                     dpMessageBox.alert(param).then(function (param) { }, function (param) { });
            //                 });
            //             });

            //             defer.resolve();
            //         }
            //     });
            //     $scope.filterModel = {};
            // }

            // $scope.edit = function () {
            //     var model = $scope.filterModel;
            //     $scope.validateMsg = "";
            //     validate(model).then(function (result) {
            //         if (result) {
            //             $scope.validateMsg = result;
            //             dpMessageBox.alert(
            //                 {
            //                     ok: 'Close',
            //                     title: 'Validate',
            //                     message: result
            //                 }
            //             )
            //         }
            //         else {
            //             dpMessageBox.confirm({
            //                 ok: 'Yes',
            //                 cancel: 'No',
            //                 title: 'Confirm ?',
            //                 message: 'Do you want to save !'
            //             }).then(function () {
            //                 pageLoading.show();
            //                 Edit(model).then(function success(res) {
            //                     pageLoading.hide();
            //                     $state.reload($state.current.name);
            //                 }, function error(param) {
            //                     dpMessageBox.alert(param).then(function (param) { }, function (param) { });
            //                 });
            //             });

            //             defer.resolve();
            //         }
            //     });
            // }
            // function validate(param) {
            //     let defer = $q.defer();
            //     let msg = "";
            //     if (param.productName == undefined) {
            //         msg = ' Product is required !'
            //         defer.resolve(msg);
            //     } 
            //     else if (param.productConversionName == null){ 
            //         msg = ' ProductConversion Name is required !'
            //         defer.resolve(msg);
            //     }
            //     else if (param.productConversionRatio == null){ 
            //         msg = ' ProductConversionRatio is required !'
            //         defer.resolve(msg);
            //     }
            //     else if (param.productConversionWeight == null){ 
            //         msg = ' ProductConversionWeight is required !'
            //         defer.resolve(msg);
            //     }
            //     else if (param.productConversionWidth == null){ 
            //         msg = ' ProductConversionWidth is required !'
            //         defer.resolve(msg);
            //     }
            //     else if (param.productConversionLength == null){ 
            //         msg = ' ProductConversionLength is required !'
            //         defer.resolve(msg);
            //     }
            //     else if (param.productConversionHeight == null){ 
            //         msg = ' ProductConversionHeight is required !'
            //         defer.resolve(msg);
            //     }
            //     else if (param.productConversionVolume == null){ 
            //         msg = ' ProductConversionVolume is required !'
            //         defer.resolve(msg);
            //     }
            //     else if ($scope.actionVolumn == "0"){ 
            //         msg = ' ConvertionVolume Ratio is required !'
            //         defer.resolve(msg);
            //     }
            //     defer.resolve(msg);

            //     return defer.promise;
            // }
            // function ConvertData() {
            //     let param = $scope.filterModel;
            //     if (param.productConversionVolumeRatio != null) {
            //         $scope.actionVolumn = param.productConversionVolumeRatio.toString();
            //     }

            // };
            // $scope.back = function () {
            //     defer.resolve('1');
            // }
            // $scope.selectVolumn = function () {
            //     var item = $scope.actionVolumn;
            //     if (item != 0) {
            //         $scope.filterModel.ProductConversionVolumeRatio = item;
            //     }
            //     else {
            //         $scope.filterModel.ProductConversionVolumeRatio = item;
            //     }
            // };

            // $scope.show = {
            //     main: true,
            //     transport: false,
            //     warehouse: false
            // };

            // function Add(param) {
            //     let deferred = $q.defer();
            //     viewModel.add(param).then(
            //         function success(results) {
            //             deferred.resolve(results);
            //         },
            //         function error(response) {
            //             deferred.reject(response);
            //         }
            //     );
            //     return deferred.promise;
            // }
            // function Edit(param) {
            //     var deferred = $q.defer();
            //     viewModel.edit(param).then(
            //         function success(results) {
            //             deferred.resolve(results);
            //         },
            //         function error(response) {
            //             deferred.reject(response);
            //         }
            //     );
            //     return deferred.promise;
            // }
            // $scope.popupProduct = {
            //     onShow: false,
            //     delegates: {},
            //     onClick: function (param, index) {
            //         $scope.popupProduct.onShow = !$scope.popupProduct.onShow;
            //         $scope.popupProduct.delegates.productPopup(param, index);
            //     },
            //     config: {
            //         title: "product"
            //     },
            //     invokes: {
            //         add: function (param) { },
            //         edit: function (param) { },
            //         selected: function (param) {
            //             $scope.filterModel.productIndex = angular.copy(param.productIndex);
            //             $scope.filterModel.productId = angular.copy(param.productId);
            //             $scope.filterModel.productName = angular.copy(param.productId) + " - " + angular.copy(param.productName);

            //         }
            //     }
            // };
            // var init = function () {
            //     $scope.filterModel = {};
            //     $scope.actionVolumn = "0";
            // };
            // init();
        }
    })
})();