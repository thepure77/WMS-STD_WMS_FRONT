(function () {
    'use strict'
    app.component('productAssemblyForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterProductAssembly/component/productAssemblyForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?'
        },
        controller: function ($scope, $q, $filter, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, dpMessageBox, localStorageService, productAssemblyFactory, webServiceAPI) {
            var $vm = this;
            $scope.getCheck = false;
            $scope.onShow = false;
            var defer = {};
            var viewModel = productAssemblyFactory;
            $scope.Cancel = true;
            $scope.update = false;
            $scope.filterItemModel = {};
            $scope.create = true;
            $scope.disable = 1;
            $vm.onShow = function (param) {
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};
                    $scope.filterItemModel = {};
                }
                $scope.onShow = true;
                if (param != undefined) {
                    pageLoading.show();
                    $scope.create = false;
                    viewModel.find(param.productBOM_Index).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;
                        $scope.update = true;
                        if ($scope.filterModel.isActive == 0) {
                            $scope.getCheck = false;
                        } else {
                            $scope.getCheck = true;
                        }
                        $scope.buttons.add = false;
                        $scope.buttons.update = true;
                        if ($scope.filterModel.promotion_Date == null) {
                            $scope.filterModel.promotion_Date = getToday();
                            $scope.filterModel.promotion_Date_To = getToday(true);
                        }

                    });
                } else {
                    $scope.update = false
                    $scope.create = true;
                    $scope.getCheck = true;
                    $scope.filterModel.isActive = 1;
                    $scope.buttons.add = true;
                    $scope.buttons.update = false;
                    $scope.filterModel.promotion_Date = getToday();
                    $scope.filterModel.promotion_Date_To = getToday(true);
                }
                return defer.promise;
            };
            $vm.triggerSearch = function () {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsProductAssembly;
                });
            };

            $scope.addsItem = function (param) {
                if (param.product_Id == undefined || param.product_Id == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose Product ID !'
                        }
                    )
                    return "";
                }

                if (param.product_Name == undefined || param.product_Name == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose ProductItem Name !'
                        }
                    )
                    return "";
                }
                if (param.qty == undefined || param.qty == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose Qty !'
                        }
                    )
                    return "";
                }
                // if (param.productConversion_Name == undefined || param.productConversion_Name == "") {
                //     dpMessageBox.alert(
                //         {
                //             ok: 'Close',
                //             title: 'Validate',
                //             message: 'Please Choose Unit !'
                //         }
                //     )
                //     return "";
                // }
                if ($scope.dropdownProductconversionItem) {
                    if ($scope.dropdownProductconversionItem.model != null) {
                        $scope.filterItemModel.productConversion_Index = $scope.dropdownProductconversionItem.model.productConversion_Index;
                        $scope.filterItemModel.productConversion_Id = $scope.dropdownProductconversionItem.model.productConversion_Id;
                        $scope.filterItemModel.productConversion_Name = $scope.dropdownProductconversionItem.model.productConversion_Name;
                        $scope.filterItemModel.ratio = $scope.dropdownProductconversionItem.model.productconversion_Ratio;
                        $scope.filterItemModel.productConversion_Weight_Index = $scope.dropdownProductconversionItem.model.productConversion_Weight_Index;
                        $scope.filterItemModel.productConversion_Volume_Index = $scope.dropdownProductconversionItem.model.productConversion_Volume_Index;
                    }
                    else {
                        $scope.filterItemModel.productConversion_Index = null;
                        $scope.filterItemModel.productConversion_Id = null;
                        $scope.filterItemModel.productConversion_Name = null;
                        $scope.filterItemModel.ratio = null;
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Error',
                                message: 'Unit is required !!'
                            }
                        )
                        return "";
                    }
                }

                if ($scope.filterModel.listProductAssemblyItemViewModel == undefined) {
                    $scope.filterModel.listProductAssemblyItemViewModel = $scope.filterModel.listProductAssemblyItemViewModel || []
                    $scope.filterModel.listProductAssemblyItemViewModel.push(angular.copy(param));
                    $scope.filterItemModel.product_Index = null;
                    $scope.filterItemModel.product_Id = null;
                    $scope.filterItemModel.product_Name = null;
                    $scope.filterItemModel.qty = null;
                    $scope.filterItemModel.productConversion_Index = null;
                    $scope.filterItemModel.productConversion_Id = null;
                    $scope.filterItemModel.productConversion_Name = null;
                    $scope.filterItemModel.remark = null;
                    $scope.filterItemModel.key = null;
                    $scope.filterItemModel.ref_No1 = null;
                    $scope.filterItemModel.ref_No2 = null;
                    $scope.filterItemModel.ref_No3 = null;
                    $scope.filterItemModel.ref_No4 = null;
                    $scope.filterItemModel.ref_No5 = null;
                }
                else if (param.rowItemIndex != undefined) {

                    $scope.filterModel.listProductAssemblyItemViewModel[param.rowItemIndex].product_Index = $scope.filterItemModel.product_Index;
                    $scope.filterModel.listProductAssemblyItemViewModel[param.rowItemIndex].product_Id = $scope.filterItemModel.product_Id;
                    $scope.filterModel.listProductAssemblyItemViewModel[param.rowItemIndex].product_Name = $scope.filterItemModel.product_Name;
                    $scope.filterModel.listProductAssemblyItemViewModel[param.rowItemIndex].qty = $scope.filterItemModel.qty;
                    $scope.filterModel.listProductAssemblyItemViewModel[param.rowItemIndex].productConversion_Index = $scope.filterItemModel.productConversion_Index;
                    $scope.filterModel.listProductAssemblyItemViewModel[param.rowItemIndex].productConversion_Id = $scope.filterItemModel.productConversion_Id;
                    $scope.filterModel.listProductAssemblyItemViewModel[param.rowItemIndex].productConversion_Name = $scope.filterItemModel.productConversion_Name;
                    $scope.filterModel.listProductAssemblyItemViewModel[param.rowItemIndex].ratio = $scope.filterItemModel.ratio;
                    $scope.filterModel.listProductAssemblyItemViewModel[param.rowItemIndex].productConversion_Weight_Index = $scope.filterItemModel.productConversion_Weight_Index;
                    $scope.filterModel.listProductAssemblyItemViewModel[param.rowItemIndex].productConversion_Volume_Index = $scope.filterItemModel.productConversion_Volume_Index;
                    $scope.filterModel.listProductAssemblyItemViewModel[param.rowItemIndex].remark = $scope.filterItemModel.remark;
                    $scope.filterModel.listProductAssemblyItemViewModel[param.rowItemIndex].ref_No1 = $scope.filterItemModel.ref_No1;
                    $scope.filterModel.listProductAssemblyItemViewModel[param.rowItemIndex].ref_No2 = $scope.filterItemModel.ref_No2;
                    $scope.filterModel.listProductAssemblyItemViewModel[param.rowItemIndex].ref_No3 = $scope.filterItemModel.ref_No3;
                    $scope.filterModel.listProductAssemblyItemViewModel[param.rowItemIndex].ref_No4 = $scope.filterItemModel.ref_No4;
                    $scope.filterModel.listProductAssemblyItemViewModel[param.rowItemIndex].ref_No5 = $scope.filterItemModel.ref_No5;


                    $scope.filterItemModel.product_Index = null;
                    $scope.filterItemModel.product_Id = null;
                    $scope.filterItemModel.product_Name = null;
                    $scope.filterItemModel.qty = null;
                    $scope.filterItemModel.productConversion_Index = null;
                    $scope.filterItemModel.productConversion_Id = null;
                    $scope.filterItemModel.productConversion_Name = null;
                    $scope.filterItemModel.remark = null;
                    $scope.filterItemModel.key = null;
                    $scope.filterItemModel.ref_No1 = null;
                    $scope.filterItemModel.ref_No2 = null;
                    $scope.filterItemModel.ref_No3 = null;
                    $scope.filterItemModel.ref_No4 = null;
                    $scope.filterItemModel.ref_No5 = null;
                    $scope.filterItemModel.rowItemIndex = undefined;

                }
                else {
                    $scope.filterModel.listProductAssemblyItemViewModel.push(angular.copy(param));
                    $scope.filterItemModel.product_Index = null;
                    $scope.filterItemModel.product_Id = null;
                    $scope.filterItemModel.product_Name = null;
                    $scope.filterItemModel.qty = null;
                    $scope.filterItemModel.productConversion_Index = null;
                    $scope.filterItemModel.productConversion_Id = null;
                    $scope.filterItemModel.productConversion_Name = null;
                    $scope.filterItemModel.key = null;
                    $scope.filterItemModel.remark = null;
                    $scope.filterItemModel.ref_No1 = null;
                    $scope.filterItemModel.ref_No2 = null;
                    $scope.filterItemModel.ref_No3 = null;
                    $scope.filterItemModel.ref_No4 = null;
                    $scope.filterItemModel.ref_No5 = null;

                }
            }
            $scope.editItem = function (index) {
                console.log(index)
                console.log($scope.filterItemModel)
                console.log($scope.filterModel.listProductAssemblyItemViewModel)
                $scope.index = index;
                $scope.filterItemModel.product_Index = $scope.filterModel.listProductAssemblyItemViewModel[index].product_Index;
                $scope.filterItemModel.product_Id = $scope.filterModel.listProductAssemblyItemViewModel[index].product_Id;
                $scope.filterItemModel.product_Name = $scope.filterModel.listProductAssemblyItemViewModel[index].product_Name;
                $scope.filterItemModel.qty = $scope.filterModel.listProductAssemblyItemViewModel[index].qty;
                $scope.filterItemModel.productConversion_Index = $scope.filterModel.listProductAssemblyItemViewModel[index].productConversion_Index;
                $scope.filterItemModel.productConversion_Id = $scope.filterModel.listProductAssemblyItemViewModel[index].productConversion_Id;
                $scope.filterItemModel.productConversion_Name = $scope.filterModel.listProductAssemblyItemViewModel[index].productConversion_Name;
                $scope.filterItemModel.remark = $scope.filterModel.listProductAssemblyItemViewModel[index].remark;
                $scope.filterItemModel.ref_No1 = $scope.filterModel.listProductAssemblyItemViewModel[index].ref_No1;
                $scope.filterItemModel.ref_No2 = $scope.filterModel.listProductAssemblyItemViewModel[index].ref_No2;
                $scope.filterItemModel.ref_No3 = $scope.filterModel.listProductAssemblyItemViewModel[index].ref_No3;
                $scope.filterItemModel.ref_No4 = $scope.filterModel.listProductAssemblyItemViewModel[index].ref_No4;
                $scope.filterItemModel.ref_No5 = $scope.filterModel.listProductAssemblyItemViewModel[index].ref_No5;
                $scope.filterItemModel.key = $scope.filterModel.listProductAssemblyItemViewModel[index].key;
                $scope.filterItemModel.rowItemIndex = index;

            }

            $scope.deleteItem = function (param, index) {
                param.splice(index, 1);
            }
            //Add ข้อมูล ProductAssembly
            $scope.add = function () {
                var model = $scope.filterModel;
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                //Validate
                if (model.product_Id == undefined || model.product_Id == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Product ID is required !!'
                    })
                    return "";
                }
                if (model.productBOM_Type == undefined || model.productBOM_Type == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Product BOM Type is required !!'
                    })
                    return "";
                }
                if (model.product_Name == undefined || model.product_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Product_Name is required !!'
                    })
                    return "";
                }
                // if (model.productConversion_Name == undefined || model.productConversion_Name == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'Validate',
                //         message: 'Unit is required !!'
                //     })
                //     return "";
                // }
                if ($scope.dropdownProductconversion) {
                    if ($scope.dropdownProductconversion.model != null) {
                        if ($scope.dropdownProductconversion.model.productConversion_Index) {
                            $scope.filterModel.productConversion_Index = $scope.dropdownProductconversion.model.productConversion_Index;
                            $scope.filterModel.productConversion_Id = $scope.dropdownProductconversion.model.productConversion_Id;
                            $scope.filterModel.productConversion_Name = $scope.dropdownProductconversion.model.productConversion_Name;
                            $scope.filterModel.ratio = $scope.dropdownProductconversion.model.productconversion_Ratio;
                        } else {
                            $scope.filterModel.productConversion_Index = null;
                            $scope.filterModel.productConversion_Id = null;
                            $scope.filterModel.productConversion_Name = null;
                            $scope.filterModel.ratio = null;
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'Error',
                                    message: 'Unit is required !!'
                                }
                            )
                            return "";
                        }
                    } else {
                        $scope.filterModel.productConversion_Index = null;
                        $scope.filterModel.productConversion_Id = null;
                        $scope.filterModel.productConversion_Name = null;
                        $scope.filterModel.ratio = null;
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Error',
                                message: 'Unit is required !!'
                            }
                        )
                        return "";
                    }
                }
                if ($scope.filterModel.listProductAssemblyItemViewModel == undefined) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Error',
                            message: 'Error: Add at least 1 Item'
                        }
                    )
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
                                defer.resolve('1');
                                $scope.filterModel = {};
                            }
                            if (res.data == "Fail") {
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'error',
                                        message: 'Art นี้มีการสร้างแล้ว'
                                    }
                                )
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
                defer.resolve('1');
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
                autoProduct: "Autocomplete/autoProductAssembly",
                autoProductConversion: "Autocomplete/autoProductConversionAssembly"
            };
            $scope.url = {
                Master: webServiceAPI.Master,
            };
            var init = function () {

                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};

            };

            function getToday(chkdate = false) {
                var today = new Date();
                if (chkdate) {
                    today.setDate(today.getDate() + 30);
                }
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();


                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }

            $scope.$watch("filterModel.product_Index", function () {
                let getproductC = {};
                if ($scope.filterModel.product_Id == "" || $scope.filterModel.product_Name == ""
                    || $scope.filterModel.product_Id == undefined || $scope.filterModel.product_Name == undefined) {
                    $scope.dropdownProductconversion.model = {};
                }
                else {
                    getproductC.product_Index = $scope.filterModel.product_Index;

                    viewModel.dropdownProductconversion(getproductC).then(function (res) {
                        $scope.dropdownProductconversion = res.data;
                        $scope.dropdownProductconversion.model = $scope.dropdownProductconversion[0];
                        $scope.filterModel.productConversion_Index = $scope.dropdownProductconversion.model.productConversion_Index;
                        $scope.filterModel.productConversion_Id = $scope.dropdownProductconversion.model.productConversion_Id;
                        $scope.filterModel.productConversion_Name = $scope.dropdownProductconversion.model.productConversion_Name;
                        $scope.filterModel.ratio = $scope.dropdownProductconversion.model.productConversion_Ratio;
                    });
                }
            });

            $scope.$watch("filterModel.productBOM_Type", function () {
                if ($scope.filterModel.productBOM_Type == 'Promotion') {
                    $scope.disable = 0;
                } else {
                    $scope.disable = 1;
                }
            });


            $scope.$watch("filterItemModel.product_Index", function () {
                let getproductC = {};
                if ($scope.filterItemModel.product_Id == "" || $scope.filterItemModel.product_Name == ""
                    || $scope.filterItemModel.product_Id == undefined || $scope.filterItemModel.product_Name == undefined) {
                    $scope.dropdownProductconversionItem.model = {};
                }
                else {
                    getproductC.product_Index = $scope.filterItemModel.product_Index;

                    viewModel.dropdownProductconversion(getproductC).then(function (res) {
                        $scope.dropdownProductconversionItem = res.data;
                        $scope.dropdownProductconversionItem.model = $scope.dropdownProductconversionItem[0];
                        $scope.filterItemModel.productConversion_Index = $scope.dropdownProductconversionItem.model.productConversion_Index;
                        $scope.filterItemModel.productConversion_Id = $scope.dropdownProductconversionItem.model.productConversion_Id;
                        $scope.filterItemModel.productConversion_Name = $scope.dropdownProductconversionItem.model.productConversion_Name;
                        $scope.filterItemModel.ratio = $scope.dropdownProductconversionItem.model.productConversion_Ratio;
                        $scope.filterItemModel.productConversion_Weight_Index = $scope.dropdownProductconversionItem.model.productConversion_Weight_Index;
                        $scope.filterItemModel.productConversion_Volume_Index = $scope.dropdownProductconversionItem.model.productConversion_Volume_Index;
                    });
                }
            });


            init();
        }
    })
})();