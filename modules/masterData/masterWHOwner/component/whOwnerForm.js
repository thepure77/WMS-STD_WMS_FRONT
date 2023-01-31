(function() {
    'use strict'

    app.component('warehouseOwnerForm', {
        controllerAs: '$vm',
        templateUrl: function($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterWHOwner/component/whOwnerForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
        },
        controller: function($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, warehouseOwnerFactory, webServiceAPI) {
            var $vm = this;

            $scope.onShow = false;
            var defer = {};
            var viewModel = warehouseOwnerFactory;
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
                    viewModel.find(param.whOwner_Index).then(function(res) {
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
                    $scope.filterModel.whOwner_Id ="";
                }
                return defer.promise;
            };

            $vm.triggerSearch = function() {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function(res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsWHOwner;
                });
            };

            //Validate & confirm Add
            $scope.add = function() {
                var model = $scope.filterModel;
                //ใช้ userName จาก localStorage
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                if (model.whOwner_Id != "") {
                    if (!model.whOwner_Id.match(/^([a-z0-9])+$/i)) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Warehouse Owner ID is required !!'
                        })
                        return "";
                    } else {
                        model.whOwner_Id = model.whOwner_Id;
                    }
                }
                if (model.whOwner_Name == undefined || model.whOwner_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Warehouse Owner Name is required !!'
                    })
                    return "";
                }
                if (model.whOwnerType_Index == undefined || model.whOwnerType_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Warehouse Owner Type is required !!'
                    })
                    return "";
                }
                if (model.owner_TaxID == undefined || model.owner_TaxID == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Owner Tax ID is required !!'
                    })
                    return "";
                }
                if (model.owner_Email == undefined || model.owner_Email == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Owner E-mail is required !!'
                    })
                    return "";
                }
                if (model.owner_Fax == undefined || model.owner_Fax == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Owner Fax is required !!'
                    })
                    return "";
                }
                if (model.owner_Tel == undefined || model.owner_Tel == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Owner Tel is required !!'
                    })
                    return "";
                }
                if (model.owner_Mobile == undefined || model.owner_Mobile == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Owner Mobile is required !!'
                    })
                    return "";
                }
                if (model.owner_Barcode == undefined || model.owner_Barcode == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Owner Barcode is required !!'
                    })
                    return "";
                }
                if (model.contact_Person == undefined || model.contact_Person == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Contact Person is required !!'
                    })
                    return "";
                }
                if (model.contact_Tel == undefined || model.contact_Tel == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Contact Tel is required !!'
                    })
                    return "";
                }
                if (model.contact_Email == undefined || model.contact_Email == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Contact E-mail Mobile is required !!'
                    })
                    return "";
                }
                if (model.whOwner_Address == undefined || model.whOwner_Address == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Supplier Address is required !!'
                    })
                    return "";
                }
                if (model.country_Index == undefined || model.country_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Country is required !!'
                    })
                    return "";
                }
                if (model.province_Index == undefined || model.province_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Province is required !!'
                    })
                    return "";
                }
                if (model.district_Index == undefined || model.district_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'District Address is required !!'
                    })
                    return "";
                }
                if (model.subDistrict_Index == undefined || model.subDistrict_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'SubDistrict is required !!'
                    })
                    return "";
                }
                if (model.postcode_Name == undefined || model.postcode_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Postcode is required !!'
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
                                defer.resolve('1');
                                $scope.filterModel = {};
                            }
                            if (res.data == "Fail") {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Validate',
                                    message: 'Warehouse Owner ID is Dupplicate !!'
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
                country: "Autocomplete/autoAddressCountry",
                province: "Autocomplete/autoAddressProvince",
                district: "Autocomplete/autoAddressDistrict",
                subDistrict: "Autocomplete/autoAddressSubDistrict",
                postCode: "Autocomplete/autoAddressPostcode",
                whOwnerType: "Autocomplete/autoWHOwnerTypeAndWHOwnerTypeId"

            };

            //url webServiceAPI.Master
            $scope.url = {
                Master: webServiceAPI.Master,
            };

            var init = function() {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
            };
            init();
        }
    })
})();