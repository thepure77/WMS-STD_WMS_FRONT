(function () {
    'use strict'
    app.component('masterDockForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterDock/component/masterDockForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?'
        },
        controller: function ($scope, $q, $filter, $state, pageLoading, $window, dpMessageBox, localStorageService, masterDockFactory, webServiceAPI, masterDockTypeFactory, masterDockZoneFactory) {
            var $vm = this;
            $scope.getCheck = false;
            $scope.onShow = false;
            var defer = {};
            var viewModel = masterDockFactory;
            var viewModelDockType = masterDockTypeFactory;
            var viewModelDockZone = masterDockZoneFactory;
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
                    viewModel.find(param).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;

                        var facility = $scope.dropdownFacility
                        const resultsfacility = facility.filter((facility) => {
                            return facility.facility_Name == res.data.facility_Name;
                        })
                        $scope.dropdownFacility.model = resultsfacility[0];

                        var Location = $scope.dropdownLocation;
                        const resultsLocation = Location.filter((facility) => {
                            return Location.location_Name == res.data.location_Name;
                        })
                        $scope.dropdownLocation.model = resultsLocation[0];

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

            $scope.dockTypeSelected = function (param) {
                
                if (param != null) {
                    $scope.filterModel.dockType_Index = param.dockType_Index;
                    $scope.filterModel.dockType_Id = param.dockType_Id;
                    $scope.filterModel.dockType_Name = param.dockType_Name;
                }
                else {
                    $scope.filterModel.dockType_Index = ""
                    $scope.filterModel.dockType_Id = ""
                    $scope.filterModel.dockType_Name = ""
                }
            }
            $scope.dockZoneSelected = function (param) {
                if (param != null) {
                    $scope.filterModel.dockZone_Index = param.dockZone_Index;
                    $scope.filterModel.dockZone_Id = param.dockZone_Id;
                    $scope.filterModel.dockZone_Name = param.dockZone_Name;
                } else {
                    $scope.filterModel.dockZone_Index = ""
                    $scope.filterModel.dockZone_Id = ""
                    $scope.filterModel.dockZone_Name = ""
                }
            }
            function getDockType() {
                pageLoading.show();
                viewModelDockType.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();

                    $scope.dropdowndockType = res.data.dockTypeModels;
                });
            }

            function getDockZone() {
                pageLoading.show();
                viewModelDockZone.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();

                    $scope.dropdowndockZone = res.data.dockZoneModels;
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

                if (model.dock_Index == undefined) {
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
                getDockType();
                getDockZone();
            };


            init();
        }
    })
})();