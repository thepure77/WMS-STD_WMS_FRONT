(function () {
    'use strict'
    app.component('masterGateCheckoutForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterGateCheckout/component/masterGatecheckoutForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?'
        },
        controller: function ($scope, $q, $filter, $state, pageLoading, $window, dpMessageBox, localStorageService, masterGateCheckoutFactory, webServiceAPI) {
            var $vm = this;
            $scope.getCheck = false;
            $scope.onShow = false;
            var defer = {};
            var viewModel = masterGateCheckoutFactory;
            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $vm.onShow = function (param) {
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};
                    $scope.dropdownFacility.model = {};
                }
                $scope.onShow = true;
                //Update
                if (param != undefined) {
                    pageLoading.show();
                    $scope.create = false;
                    viewModel.find(param).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;
                        $scope.update = true;

                      
                        $scope.dropdownGateCheckout.model = resultsGateCheckoutType[0];

                        var facility = $scope.dropdownFacility;
                        const resultsFacility = facility.filter((facility) => {
                            return facility.facility_Name == res.data.facility_Name;
                        })
                        $scope.dropdownFacility.model = resultsFacility[0];

                        if ($scope.filterModel.isActive == 0) {
                            $scope.getCheck = false;
                        } else {
                            $scope.getCheck = true;
                        }
                    });
                }
                else {
                    $scope.update = false
                    $scope.create = true;
                    $scope.getCheck = true;
                    $scope.filterModel.isActive = 1;
                    $scope.filterModel.itemStatus_Id = "";

                }
                return defer.promise;
            };
            $scope.dropdownGatecheckout = {};
            $scope.dropdownFacility = {};



            $vm.triggerSearch = function () {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsItemStatus;
                });
            };
            //Add ข้อมูล ItemStatus
            $scope.add = function () {
                var model = $scope.filterModel;
                if (model.GateCheckout_Index == undefined) {
                    model.create_By = $scope.userName;
                }
                else {
                    model.update_By = $scope.userName;
                }


                $scope.validateMsg = "";
                //Validate
                if (model.GateCheckout_Id != "") {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'ยืนยันข้อมูล',
                        message: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่'
                    }).then(function () {
                        pageLoading.show();
                        Add(model).then(function success(res) {
                            pageLoading.hide();
                            if (res.data != undefined) {
                                defer.resolve('1');
                                $scope.filterModel = {};
                            }
                            if (res.data == undefined) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'ไม่สามารถบันทึกได้'
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
                defer.resolve('1');
            }

            $scope.GateCheckoutTypeSelected = function (param) {
                $scope.filterModel.GateCheckoutType_Index = param.GateCheckoutType_Index;
                $scope.filterModel.GateCheckoutType_Id = param.GateCheckoutType_Id;
                $scope.filterModel.GateCheckoutType_Name = param.GateCheckoutType_Name;
            }
            $scope.facilitySelected = function (param) {
                $scope.filterModel.facility_Index = param.facility_Index;
                $scope.filterModel.facility_Id = param.facility_Id;
                $scope.filterModel.facility_Name = param.facility_Name;
            }
            function getGateCheckoutType() {
                viewModelGateCheckoutType.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();

                    $scope.dropdownGatecheckout = res.data.GateCheckoutTypeModels;
                });

            }
            function getFacility() {
                pageLoading.show();
                viewModelFacility.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();

                    $scope.dropdownFacility = res.data.facilityModels;
                });
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
            };

            $scope.buttons = {
                add: true,
                update: false,
                back: true
            };

            //API AutoComplete
            $scope.url = {
                Master: webServiceAPI.Master,
            };
            var init = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
                // getGateCheckoutType();
                // getFacility();
            };


            init();
        }
    })
})();