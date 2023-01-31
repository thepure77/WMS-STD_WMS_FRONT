(function () {
    'use strict'

    app.component('productSubTypeForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterProductSubType/component/productSubTypeForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox,productSubTypeFactory, webServiceAPI) {
            var $vm = this;

            $scope.onShow = false;
            var defer = {};
            var viewModel = productSubTypeFactory;
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
                    viewModel.find(param.productSubType_Index).then(function(res) {
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
                    $scope.update = false
                    $scope.create = true;
                    $scope.getCheck = true;
                    $scope.filterModel.isActive = 1;
                    $scope.filterModel.productSubType_Id = "";
                }
                return defer.promise;
            };

            $vm.triggerSearch = function() {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function(res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsProductSubType;
                });
            };

            //Validate & confirm Add
            $scope.add = function() {
                var model = $scope.filterModel;
                //ใช้ userName จาก localStorage
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                if (model.productSubType_Id != "") {
                    if (!model.productSubType_Id.match(/^([a-z0-9])+$/i)) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Material SubType ID is required !!'
                        })
                        return "";
                    } else {
                        model.productSubType_Id = model.productSubType_Id;
                    }
                }
                if (model.productSubType_Name == undefined || model.productSubType_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Material SubType Name is required !!'
                    })
                    return "";
                }
                if (model.productSubType_SecondName == undefined || model.productSubType_SecondName == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Material SubType SecondName is required !!'
                    })
                    return "";
                }
                if (model.productType_Index == undefined || model.productType_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Material Type is required !!'
                    })
                    return "";
                } else {
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
                                defer.resolve('1');
                                $scope.filterModel = {};
                            }
                            if (res.data == "Fail") {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Validate',
                                    message: 'Material SubType ID is Dupplicate !!'
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
                productType: "Autocomplete/autoProductTypeAndProductTypeId",
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };
            
     
            // $scope.Cancel = true;
            // $scope.update = false;
            // $scope.create = true;
            // $vm.onShow = function (param) {
            //     defer = $q.defer();
            //     if($scope.filterModel != null){
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

            // $scope.add = function(){
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

            // $scope.edit = function(){
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

            // $scope.back = function(){
            //     defer.resolve('1');
            // }
            // function validate(param) {
            //     let defer = $q.defer();
            //     let msg = "";
            //     if (param.productSubTypeName == undefined) {
            //         msg = ' ProductSubTypeName is required !'
            //         defer.resolve(msg);
            //     } 
            //     else if (param.productTypeName == null){ 
            //         msg = ' ProductType is required !'
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
            // $scope.popupProductType= {
            //     onShow: false,
            //     delegates: {},
            //     onClick: function (param, index) {
            //         $scope.popupProductType.onShow = !$scope.popupProductType.onShow;
            //         $scope.popupProductType.delegates.productTypePopup(param, index);
            //     },
            //     config: {
            //         title: "Product Type"
            //     },
            //     invokes: {
            //         add: function (param) { },
            //         edit: function (param) { },
            //         selected: function (param) {
            //             $scope.filterModel.productTypeIndex = angular.copy(param.productTypeIndex);
            //             $scope.filterModel.productTypeId = angular.copy(param.productTypeId);
            //             $scope.filterModel.productTypeName = angular.copy(param.productTypeId) +  " - " + angular.copy(param.productTypeName);
            //         }
            //     }
            // };

            var init = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
            };
            init();
        }
    })
})();