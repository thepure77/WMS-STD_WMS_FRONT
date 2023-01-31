(function () {
    'use strict'
    app.component('masterDockZoneForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterDockZone/component/masterDockZoneForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?'
        },
        controller: function ($scope, $q, $filter, $state, pageLoading, $window, dpMessageBox, localStorageService, masterDockZoneFactory, webServiceAPI, facilityFactory) {
            var $vm = this;
            $scope.getCheck = false;
            $scope.onShow = false;
            var defer = {};
            var viewModel = masterDockZoneFactory;
            var viewModelFacility = facilityFactory;

            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $vm.onShow = function (param) {
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};
                    $scope.dropdownyardTypeModels = {};
                    $scope.dropdownyardTypeModels = {};
                }
                $scope.onShow = true;
                //Update
                if (param != undefined) {
                    pageLoading.show();
                    $scope.create = false;
                    viewModel.find(param).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;

                        var GateType = $scope.dropdownGateType
                        const resultsGateType = GateType.filter((GateType) => {
                            return GateType.gateType_Name == res.data.gateType_Name;
                        })
                        $scope.dropdownGateType.model = resultsGateType[0];

                        var facility = $scope.dropdownFacility;
                        const resultsFacility = facility.filter((facility) => {
                            return facility.facility_Name == res.data.facility_Name;
                        })
                        $scope.dropdownFacility.model = resultsFacility[0];
                        
                        $scope.update = true;
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

            function getDockZoneType(){
                pageLoading.show();
                viewModelDockZoneType.filter($scope.filterModel).then(function(res) {
                    pageLoading.hide();

                    $scope.dropdownFacility = res.data.itemsFacility;
                });
            }

            function getDockZoneZone(){
                pageLoading.show();
                viewModelDockZoneZone.filter($scope.filterModel).then(function(res) {
                    pageLoading.hide();

                    $scope.dropdownFacility = res.data.itemsFacility;
                });
            }

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

                if (model.dockZone_Index == undefined) {
                    model.create_By = $scope.userName;
                }
                else {
                    model.update_By = $scope.userName;
                }
                $scope.validateMsg = "";
                //Validate
                // if (model.itemStatus_Id != "") {
                //     if (!model.itemStatus_Id.match(/^([a-z0-9])+$/i)) {
                //         dpMessageBox.alert({
                //             ok: 'Close',
                //             title: 'แจ้งเตือน',
                //             message: 'รหัสสถานะสินค้าไม่ถูกต้อง'
                //         })
                //         return "";
                //     } else {
                //         model.itemStatus_Id = model.itemStatus_Id;
                //     }
                // }
                // if (model.itemStatus_Name == undefined || model.itemStatus_Name == "") {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'แจ้งเตือน',
                //         message: 'กรุณากรอกชื่อสถานะสินค้า'
                //     })
                //     return "";
                // }
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

            $scope.facilitySelected = function (param){
                $scope.filterModel.facility_Index = param.facility_Index;
                $scope.filterModel.facility_Id = param.facility_Id;
                $scope.filterModel.facility_Name = param.facility_Name;
            }

            function getFacility() {
                pageLoading.show();
                viewModelFacility.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();

                    $scope.dropdownFacility = res.data.facilityModels;
                });
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
                getFacility();
                // getDockZoneZone();
            };


            init();
        }
    })
})();