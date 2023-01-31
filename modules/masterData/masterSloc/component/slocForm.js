(function () {
    'use strict'
    app.component('slocForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterSloc/component/slocForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?'
        },
        controller: function ($scope, $q, $filter, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, dpMessageBox,localStorageService, slocFactory,/*soldToFactory,*/ webServiceAPI) {
            var $vm = this;
            $scope.getCheck = false;
            $scope.onShow = false;
            var defer = {};
            var viewModel = slocFactory;
            /*var viewModelSoldTo = soldToFactory;*/
            
            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $vm.onShow = function (param) {
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};

                }
                $scope.onShow = true;
                //Update
                if (param != undefined) {
                    pageLoading.show();
                    $scope.create = false;
                    viewModel.find(param.storageLoc_Id).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;
                        $scope.update = true;
                        if ($scope.filterModel.isActive == 0) {
                            $scope.getCheck = false;
                        } else {
                            $scope.getCheck = true
                        }
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
                    $vm.searchResultModel = res.data.itemsSloc;
                });
            };
            //Add ข้อมูล ShipTo
            $scope.add = function () {
                debugger;
                var model = $scope.filterModel;
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                //Validate
                if (model.storageLoc_Id == undefined || model.storageLoc_Id == "" ) {

                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Sloc ID is required !!'
                        })
                        return "";
                }
                if (model.storageLoc_Name == undefined || model.storageLoc_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Sloc Name is required !!'
                    })
                    return "";
                }
                else 
                {
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
                                if($scope.dataItem != undefined){
                                    viewModel.set($scope.dataItem)
                                    $state.go('wms.sloc');
                                }else{
                                defer.resolve('1');
                                }
                                $scope.filterModel = {};
                                
                            }
                            if (res.data == "Fail") {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Validate',
                                    message: 'Sloc ID is Dupplicate !!'
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
                    viewModel.set($scope.dataItem)
                    $state.go('wms.sloc');
                } else{
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

            $scope.url = {
                Master: webServiceAPI.Master,
            };
            var init = function () {
                //$scope.dataItem = viewModelSoldTo.get();
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
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