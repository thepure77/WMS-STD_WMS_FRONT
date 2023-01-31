(function () {
    'use strict'

    app.component('productconversionbarcodeForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterproductConversionBarcode/component/productconversionbarcodeForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, productConversionBarcodeFactory,productConversionFactory, webServiceAPI) {
            var $vm = this;
            
            $scope.onShow = false;
            var defer = {};
            var viewModel = productConversionBarcodeFactory;

            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $scope.getCheck = false;

            $vm.onShow = function(param) {
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};
                }
                $scope.onShow = true;
                if (param != undefined) {
                    pageLoading.show();
                    $scope.create = false;
                    if(param.productConversionBarcode_Index != undefined){
                    viewModel.find(param.productConversionBarcode_Index).then(function(res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;
                        $scope.update = true;
                        if ($scope.filterModel.isActive == 0) {
                            $scope.getCheck = false;
                        } else {
                            $scope.getCheck = true;
                        }
                        
                    });
                }else{
                            pageLoading.hide();
                            $scope.filterModel.productConversion_Index = param.productConversion_Index;
                            $scope.filterModel.productConversion_Id = param.productConversion_Id;
                            $scope.filterModel.productConversion_Name = param.productConversion_Name;
                            $scope.filterModel.product_Index = param.product_Index;
                            $scope.filterModel.product_Id = param.product_Id;
                            $scope.filterModel.product_Name = param.product_Name;
                            $scope.getCheck = true;
                            $scope.filterModel.isActive = 1;
                            $scope.disable = true;
                            $scope.create = true;
                            $scope.create2 = true;
                        
                    }
                
                } else {
                    $scope.update = false
                    $scope.create = true;
                    $scope.getCheck = true;
                    $scope.filterModel.isActive = 1;
                    $scope.filterModel.productConversionBarcode_Id= "";
                }
                return defer.promise;
            };

            $vm.triggerSearch = function() {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function(res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsProductConversionBarcode;
                });
            };

            //Validate & confirm Add
            $scope.add = function() {
                var model = $scope.filterModel;
                //ใช้ userName จาก localStorage
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                console.log(model)
                if (!model.productConversionBarcode_Id == undefined || !model.productConversionBarcode_Id == "") {
                    if (!model.productConversionBarcode_Id.match(/^([a-z0-9])+$/i)) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Validate',
                            message: 'MaterialConversion Barcode ID is required !!'
                        })
                        return "";
                    } else {
                        model.productConversionBarcode_Id = model.productConversionBarcode_Id;
                    }
                }
                if (model.productConversionBarcode == undefined || model.productConversionBarcode == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'MaterialConversion Barcode is required !!'
                    })
                    return "";
                }
                if (model.owner_Index == undefined || model.owner_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Owner is required !!'
                    })
                    return "";
                }
                if (model.product_Index == undefined || model.product_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Material is required !!'
                    })
                    return "";
                }
                if (model.productConversion_Index == undefined || model.productConversion_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'MaterialConversion is required !!'
                    })
                    return "";
                }
                else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'Confirm ?',
                        message: 'Do you want to save !'
                    }).then(function() {
                        pageLoading.show();
                        Add(model).then(function success(res) {

                            pageLoading.hide();
                            if (res.data == "Done") {
                                if ($scope.dataProductConversionBarcode != undefined)
                                {
                                    viewModel.set($scope.dataProductConversionBarcode)
                                    $state.go('wms.product_conversion_form');
                                }
                               
                                else{
                                    defer.resolve('1');
                                }
                                $scope.filterModel = {};
                            }
                            if (res.data == "Fail") {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Validate',
                                    message: 'Material Conversion Barcode ID is Dupplicate !!'
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
            $scope.back = function() {

                if ($scope.dataProductConversionBarcode != undefined) {
                    viewModel.set($scope.dataProductConversionBarcode)
                    $state.go('wms.product_conversion_form');
                }
                else {
                    defer.resolve('1');
                }
            }

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
                productConversion: "Autocomplete/autoProductConversionAndProductConversionId",
                owner: "Autocomplete/autoOwnerAndOwnerId",
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };

            var init = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
                $scope.dataProductConversionBarcode = productConversionFactory.get();
                if ($scope.dataProductConversionBarcode != undefined)
                {

                    if($scope.dataProductConversionBarcode.status == "update"){
                        $scope.onShow = true;
                        $vm.onShow($scope.dataProductConversionBarcode);
                    }
                }

            };
            init();

            // $scope.Cancel = true;
            // $scope.update = false;
            // $scope.create = true;
            // $vm.onShow = function (param) {
            //     defer = $q.defer();
            //     if ($scope.filterModel != null) {
            //         $scope.filterModel = {};
            //     }
            //     $scope.onShow = true;
            //     if (param != undefined) {
            //         pageLoading.show();
            //         $scope.create = false;
            //         viewModel.getId(param).then(function (res) {
            //             pageLoading.hide();
            //             $scope.filterModel = res.data[0];
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

            // $scope.back = function () {
            //     defer.resolve('1');
            // }            
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
            // function validate(param) {
            //     let defer = $q.defer();
            //     let msg = "";
            //     if (param.productConversionBarcode == undefined) {
            //         msg = ' ProductConversionBarcode Name is required !'
            //         defer.resolve(msg);
            //     } 
            //     else if (param.ownerName == null){ 
            //         msg = ' Owner is required !'
            //         defer.resolve(msg);
            //     }
            //     else if (param.productName == null){ 
            //         msg = ' Product is required !'
            //         defer.resolve(msg);
            //     }
            //     else if (param.productConversionName == null){ 
            //         msg = ' ProductConversion is required !'
            //         defer.resolve(msg);
            //     }
            //     defer.resolve(msg);

            //     return defer.promise;
            // }
            // $scope.popupProduct = {
            //     onShow: false,
            //     delegates: {},
            //     onClick: function (index) {  
            //         if ($scope.filterModel.ownerIndex != null) {
            //             index = $scope.filterModel.ownerIndex;
            //         };
            //         $scope.popupProduct.onShow = !$scope.popupProduct.onShow;
            //         $scope.popupProduct.delegates.productPopup(index);
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

            // $scope.popupProductConversion = {
            //     onShow: false,
            //     delegates: {},
            //     onClick: function (index) {
            //         if ($scope.filterModel.productIndex != null) {
            //             index = $scope.filterModel.productIndex;
            //         };
            //         $scope.popupProductConversion.onShow = !$scope.popupProductConversion.onShow;
            //         $scope.popupProductConversion.delegates.productConversionPopup(index);
            //     },
            //     config: {
            //         title: "ProductConversion"
            //     },
            //     invokes: {
            //         add: function (param) { },
            //         edit: function (param) { },
            //         selected: function (param) {
            //             $scope.filterModel.productConversionIndex = angular.copy(param.productConversionIndex);
            //             $scope.filterModel.productConversionId = angular.copy(param.productConversionId);
            //             $scope.filterModel.productConversionName = angular.copy(param.productConversionId) + " - " + angular.copy(param.productConversionName);
            //         }
            //     }
            // };

            // $scope.popupOwner = {
            //     onShow: false,
            //     delegates: {},
            //     onClick: function (param, index) {
            //         $scope.popupOwner.onShow = !$scope.popupOwner.onShow;
            //         $scope.popupOwner.delegates.ownerPopup(param, index);
            //     },
            //     config: {
            //         title: "owner"
            //     },
            //     invokes: {
            //         add: function (param) { },
            //         edit: function (param) { },
            //         selected: function (param) {
            //             $scope.filterModel.ownerIndex = angular.copy(param.ownerIndex);
            //             $scope.filterModel.ownerId = angular.copy(param.ownerId);
            //             $scope.filterModel.ownerName = angular.copy(param.ownerId) + " - " + angular.copy(param.ownerName);

            //         }
            //     }
            // };
            // var init = function () {

            //     $scope.filterModel = {};
            // };
            // init();
        }
    })
})();