(function () {
    'use strict'
    app.component('masterCarrierForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterCarrier/component/masterCarrierForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?'
        },
        controller: function ($scope, $q, $filter, $state, pageLoading, $window, dpMessageBox, localStorageService, masterCarrierFactory, webServiceAPI, facilityFactory, masterCarrierTypeFactory) {
            var $vm = this;
            $scope.getCheck = false;
            $scope.onShow = false;
            var defer = {};
            var viewModel = masterCarrierFactory;
            var viewModelFacility = facilityFactory;
            var viewModelCarrierType = masterCarrierTypeFactory;
            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $vm.onShow = function (param) {
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};
                    $scope.dropdownCarrierType.model = {};
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

                        var CarrierType = $scope.dropdownCarrierType
                        const resultsCarrierType = CarrierType.filter((CarrierType) => {
                            return CarrierType.CarrierType_Name == res.data.CarrierType_Name;
                        })
                        $scope.dropdownCarrierType.model = resultsCarrierType[0];

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
            $scope.dropdownCarrierType = {};
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
                if (model.Carrier_Index == undefined) {
                    model.create_By = $scope.userName;
                }
                else {
                    model.update_By = $scope.userName;
                }


                $scope.validateMsg = "";
                //Validate
                if (model.Carrier_Id != "") {
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

            $scope.CarrierTypeSelected = function (param) {
                $scope.filterModel.CarrierType_Index = param.CarrierType_Index;
                $scope.filterModel.CarrierType_Id = param.CarrierType_Id;
                $scope.filterModel.CarrierType_Name = param.CarrierType_Name;
            }
            $scope.facilitySelected = function (param) {
                $scope.filterModel.facility_Index = param.facility_Index;
                $scope.filterModel.facility_Id = param.facility_Id;
                $scope.filterModel.facility_Name = param.facility_Name;
            }
            function getCarrierType() {
                viewModelCarrierType.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();

                    $scope.dropdownCarrierType = res.data.CarrierTypeModels;
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
                transport: false,
                warehouse: false
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
                getCarrierType();
                getFacility();
            };


            init();
        }
    })
})();