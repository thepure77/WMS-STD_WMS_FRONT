(function () {
    'use strict'

    app.component('productTypeForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterProductType/component/productTypeForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, productTypeFactory, webServiceAPI) {
            var $vm = this;

            $scope.onShow = false;
            var defer = {};
            var viewModel = productTypeFactory;
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
                    viewModel.find(param.productType_Index).then(function(res) {
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
                    $scope.filterModel.productType_Id = "";
                    $scope.update = false
                    $scope.create = true;
                    $scope.getCheck = true;
                    $scope.filterModel.isActive = 1;

                }
                return defer.promise;
            };

            $vm.triggerSearch = function() {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function(res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsProductType;
                });
            };

            //Validate & confirm Add
            $scope.add = function() {
                var model = $scope.filterModel;
                //ใช้ userName จาก localStorage
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                if (model.productType_Id != "") {
                    if (!model.productType_Id.match(/^([a-z0-9])+$/i)) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'รหัสประเภทสินค้าไม่ถูกต้อง'
                        })
                        return "";
                    } else {
                        model.productType_Id = model.productType_Id;
                    }
                }
                if (model.productType_Name == undefined || model.productType_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกชื่อประเภทสินค้า'
                    })
                    return "";
                }
                if (model.productCategory_Index == undefined || model.productCategory_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกชื่อหมวดสินค้า'
                    })
                    return "";
                } else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'ยืนยันข้อมูล',
                        message: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่'
                    }).then(function() {
                        pageLoading.show();
                        Add(model).then(function success(res) {

                            pageLoading.hide();
                            if (res.data == "Done") {
                                defer.resolve('1');
                                $scope.filterModel = {};
                            }
                            else
                            if(res.data = "Fail"){
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'รหัสประเภทสินค้าซ้ำ'
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
                defer.resolve('1');
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
                productCategory: "Autocomplete/autoProductCategoryAndProductCategoryId",
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };
            
            var init = function() {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
            };
            init();
            // $vm.onShow = function (param) {
            //     defer = $q.defer();
            //     if($scope.filterModel != null){
            //         $scope.filterModel = {};
            //     }
            //     $scope.onShow = true;
            //     if (param != undefined) {
            //         pageLoading.show();
            //         $scope.create = false;
            //         viewModel.getId(param.productTypeIndex).then(function (res) {
            //             pageLoading.hide();
            //             $scope.filterModel = res.data[0];
            //             $scope.update = true;
            //         });
            //     }
            //     else {
            //         $scope.update = false;
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
            // function validate(param) {                
            //     let defer = $q.defer();
            //     let msg = "";
            //     if ($scope.filterModel == undefined || param.productTypeName == null) {
            //         msg = ' ProductType Name is required !'
            //         defer.resolve(msg);
            //     }
            //     else if (param.productCategoryName == null){
            //         msg = ' ProductCategory is required !'
            //         defer.resolve(msg);
            //     }
            //     defer.resolve(msg);

            //     return defer.promise;
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
            // ///POPUP
            // $scope.popupProductTypeCategory= {
            //     onShow: false,
            //     delegates: {},
            //     onClick: function (param, index) {                    
            //         $scope.popupProductTypeCategory.onShow = !$scope.popupProductTypeCategory.onShow;
            //         $scope.popupProductTypeCategory.delegates.productCategoryPopup(param, index);
            //     },
            //     config: {
            //         title: "Product Category"
            //     },
            //     invokes: {
            //         add: function (param) { },
            //         edit: function (param) { },
            //         selected: function (param) {                        
            //             $scope.filterModel.productCategoryIndex = angular.copy(param.productCategoryIndex);
            //             $scope.filterModel.productCategoryId = angular.copy(param.productCategoryId);
            //             $scope.filterModel.productCategoryName = angular.copy(param.productCategoryId) +  " - " + angular.copy(param.productCategoryName);
            //         }
            //     }
            // };

        }
    })
})();