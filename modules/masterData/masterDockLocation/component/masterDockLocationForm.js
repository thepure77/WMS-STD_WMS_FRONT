(function () {
    'use strict'
    app.component('masterDockLocationForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterDockLocation/component/masterDockLocationForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?'
        },
        controller: function ($scope, $q, $filter, $state, pageLoading, $window, dpMessageBox, localStorageService, masterDockLocationFactory, webServiceAPI, masterDockFactory, locationFactory) {
            var $vm = this;
            $scope.getCheck = false;
            $scope.onShow = false;
            var defer = {};
            var viewModel = masterDockLocationFactory;
            var viewModelDock = masterDockFactory; 
            var viewModelLocation = locationFactory;
            
            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $vm.onShow = function (param) {
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};
                    // $scope.dropdownDock.model = {};
                    $scope.dropdownLocation.model = {};
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

            function getDock(){
                pageLoading.show();
                viewModelDock.filter($scope.filterModel).then(function(res) {
                    pageLoading.hide();

                    $scope.dropdownDock = res.data.itemsDock;
                });
            }

            function getLocation(){
                pageLoading.show();
                viewModelLocation.filter($scope.filterModel).then(function(res) {
                    pageLoading.hide();

                    $scope.dropdownLocation = res.data.itemsLocation;
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

                if (model.dockLocation_Index == undefined) {
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

            $scope.dockSelected = function (param){
                $scope.filterModel.dock_Index = param.dock_Index;
                $scope.filterModel.dock_Id = param.dock_Id;
                $scope.filterModel.dock_Name = param.dock_Name;
            }
            $scope.locationSelected = function (param){
                $scope.filterModel.location_Index = param.location_Index;
                $scope.filterModel.location_Id = param.location_Id;
                $scope.filterModel.location_Name = param.location_Name;
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
                getDock();
                getLocation();
            };


            init();
        }
    })
})();