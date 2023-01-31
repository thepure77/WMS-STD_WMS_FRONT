(function () {
    'use strict'
    app.component('shipToForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterShipTo/component/shipToForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?'
        },
        controller: function ($scope, $q, $filter, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, dpMessageBox,localStorageService, shipToFactory,soldToFactory, webServiceAPI) {
            var $vm = this;
            $scope.getCheck = false;
            $scope.onShow = false;
            var defer = {};
            var viewModel = shipToFactory;
            var viewModelSoldTo = soldToFactory;
            
            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $vm.onShow = function (param) {
                $scope.dropdownbusinessUnit.model = {};
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};

                }
                $scope.onShow = true;
                //Update
                if (param != undefined) {
                    pageLoading.show();
                    $scope.create = false;
                    viewModel.find(param.shipTo_Index).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;
                        $scope.update = true;
                        if ($scope.filterModel.isActive == 0) {
                            $scope.getCheck = false;
                        } else {
                            $scope.getCheck = true
                        }

                        var businessUnit = $scope.dropdownbusinessUnit
                        const resultsBusinessUnit = businessUnit.filter((businessUnit) => {
                            return businessUnit.businessUnit_Index == res.data.businessUnit_Index;
                        })
                        $scope.dropdownbusinessUnit.model = resultsBusinessUnit[0];
                    });
                }
                else {
                    $scope.update = false
                    $scope.create = true;
                    $scope.getCheck = true;
                    $scope.filterModel.isActive = 1;
                    $scope.filterModel.shipTo_Id = "";

                }
                return defer.promise;
            };
            $vm.triggerSearch = function () {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function(res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsShipTo;
                });
            };
            //Add ข้อมูล ShipTo
            $scope.add = function () {
                var model = $scope.filterModel;
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                //Validate
                if ($scope.dropdownbusinessUnit.model != null) {
                    $scope.filterModel.businessUnit_Index = $scope.dropdownbusinessUnit.model.businessUnit_Index;
                    $scope.filterModel.businessUnit_Id = $scope.dropdownbusinessUnit.model.businessUnit_Id;
                    $scope.filterModel.businessUnit_Name = $scope.dropdownbusinessUnit.model.businessUnit_Name;
                } else {
                    undefined
                    $scope.filterModel.businessUnit_Index = undefined;
                    $scope.filterModel.businessUnit_Id = undefined;
                    $scope.filterModel.businessUnit_Name = undefined;
                    // dpMessageBox.alert({
                    //     ok: 'Close',
                    //     title: 'ALERT',
                    //     message: 'กรุณาเลือก Business Unit !'
                    // })
                    // return "";
                }
                if (model.shipTo_Id != "") {
                    if (!model.shipTo_Id.match(/^([a-z0-9])+$/i)) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Validate',
                            message: 'ShipTo ID is required !!'
                        })
                        return "";
                    } else {
                        model.shipTo_Id = model.shipTo_Id;
                    }
                }
                if (model.shipTo_Name == undefined || model.shipTo_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'ShipTo Name is required !!'
                    })
                    return "";
                }
                if (model.shipToType_Index == undefined || model.shipToType_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'ShipTo Type is required !!'
                    })
                    return "";
                }

                
                // if (model.shipTo_TaxID == undefined || model.shipTo_TaxID == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'Validate',
                //         message: 'ShipTo TaxID is required !!'
                //     })
                //     return "";
                // }
                // if (model.shipTo_Email == undefined || model.shipTo_Email == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'Validate',
                //         message: 'ShipTo Email is required !!'
                //     })
                //     return "";
                // }
                // if (model.shipTo_Fax == undefined || model.shipTo_Fax == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'Validate',
                //         message: 'ShipTo Fax is required !!'
                //     })
                //     return "";
                // }
                // if (model.shipTo_Tel == undefined || model.shipTo_Tel == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'Validate',
                //         message: 'ShipTo Tel is required !!'
                //     })
                //     return "";
                // }
                // if (model.shipTo_Mobile == undefined || model.shipTo_Mobile == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'Validate',
                //         message: 'ShipTo Mobile is required !!'
                //     })
                //     return "";
                // }
                // if (model.shipTo_Barcode == undefined || model.shipTo_Barcode == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'Validate',
                //         message: 'ShipTo Barcode is required !!'
                //     })
                //     return "";
                // }
                // if (model.contact_Person == undefined || model.contact_Person == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'Validate',
                //         message: 'Contact Person is required !!'
                //     })
                //     return "";
                // }
                // if (model.contact_Tel == undefined || model.contact_Tel == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'Validate',
                //         message: 'Contact Tel is required !!'
                //     })
                //     return "";
                // }
                // if (model.contact_Email == undefined || model.contact_Email == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'Validate',
                //         message: 'Contact Email is required !!'
                //     })
                //     return "";
                // }
                // if (model.shipTo_Address == undefined || model.shipTo_Address == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'Validate',
                //         message: 'ShipTo Address is required !!'
                //     })
                //     return "";
                // }
                // if (model.country_Index == undefined || model.country_Index == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'Validate',
                //         message: 'Country is required !!'
                //     })
                //     return "";
                // }
                // if (model.province_Index == undefined || model.province_Index == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'Validate',
                //         message: 'Province is required !!'
                //     })
                //     return "";
                // }
                // if (model.district_Index == undefined || model.district_Index == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'Validate',
                //         message: 'District is required !!'
                //     })
                //     return "";
                // }
                // if (model.subDistrict_Index == undefined || model.subDistrict_Index == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'Validate',
                //         message: 'SubDistrict is required !!'
                //     })
                //     return "";
                // }
                // if (model.postcode_Name == undefined || model.postcode_Name == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'Validate',
                //         message: 'Postcode is required !!'
                //     })
                //     return "";
                // }
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
                                $scope.dropdownbusinessUnit.model = {};
                                if($scope.dataItem != undefined){
                                    viewModel.set($scope.dataItem)
                                    $state.go('wms.sold_to_form');
                                }else{
                                defer.resolve('1');
                                }
                                $scope.filterModel = {};
                                
                                
                            }
                            if (res.data == "Fail") {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Validate',
                                    message: 'ShipTo ID is Dupplicate !!'
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
                if($scope.dataItem != undefined){
                    $scope.dropdownbusinessUnit.model = {};
                    viewModel.set($scope.dataItem)
                    $state.go('wms.sold_to_form');
                } else{
                $scope.dropdownbusinessUnit.model = {};
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
                shipToType: "Autocomplete/autoShipToType",
                country: "Autocomplete/autoAddressCountry",
                province: "Autocomplete/autoAddressProvince",
                district: "Autocomplete/autoAddressDistrict",
                subDistrict: "Autocomplete/autoAddressSubDistrict",
                postcode: "Autocomplete/autoAddressPostcode"
            };

            //DropDown
            $scope.dropdownbusinessUnit = function () {
                viewModel.dropdownbusinessUnit($scope.filterModel).then(function (res) {
                    $scope.dropdownbusinessUnit = res.data.itemsBusinessUnit;
                });
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };
            var init = function () {
                $scope.dataItem = viewModelSoldTo.get();
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
                $scope.dropdownbusinessUnit();
                if($scope.dataItem != undefined){
                    if($scope.dataItem.status == "create"){
                        $scope.onShow = true;
                        $vm.onShow();
                    }
                    if($scope.dataItem.status == "update"){
                        $scope.onShow = true;
                        $vm.onShow($scope.dataItem);
                    }
                }
            };

            
            init();
        }
    })
})();