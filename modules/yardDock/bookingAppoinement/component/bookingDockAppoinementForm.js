(function () {
    'use strict'
    app.component('bookingDockAppoinementForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/yardDock/bookingAppoinement/component/bookingDockAppoinementForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?'
        },
        controller: function ($scope, $q, $filter, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, dpMessageBox, localStorageService, workAreaFactory, masterVehicleTypeFactory, webServiceAPI) {
            var $vm = this;
            $scope.getCheck = false;
            $scope.onShow = false;
            var defer = {};
            var viewModel = workAreaFactory;
            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $vm.onShow = function (param) {
                defer = $q.defer();
                $scope.onShow = true;
                //Update

                if (param != undefined) {
                    $scope.create = false;
                    $scope.bkItem = param;

                    var date = dateformate($scope.bkItem.appointment_Date)
                    $scope.bkItem.appointment_Date = date;
                }
                else {
                    $scope.update = false
                    $scope.create = true;
                    $scope.getCheck = true;
                    $scope.filterModel.isActive = 1;


                }
                return defer.promise;
            };
            $vm.triggerSearch = function () {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsWorkArea;
                });
            };
            //Add ข้อมูล WorkArea
            $scope.add = function () {
                var model = $scope.filterModel;
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                //Validate
                if (model.workArea_Name == undefined || model.workArea_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'WorkArea Name is required !!'
                    })
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
                                if ($scope.dataWorkArea != undefined) {
                                    viewModel.set($scope.dataWorkArea)
                                    $state.go('wms.location_form');
                                }

                                else {
                                    defer.resolve('1');
                                }
                                $scope.filterModel = {};
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
                if ($scope.dataWorkArea != undefined) {
                    viewModel.set($scope.dataWorkArea)
                    $state.go('wms.location_form');
                }
                else {
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



            $scope.selectTypeCar = function (param) {
                if ($scope.dropdownTypeCar.model != undefined) {
                    $scope.detailItem.vehicleType_Name = $scope.dropdownTypeCar.model.vehicleType_Name;
                    $scope.detailItem.vehicleType_Index = $scope.dropdownTypeCar.model.vehicleType_Index;
                    $scope.detailItem.vehicleType_Id = $scope.dropdownTypeCar.model.vehicleType_Id;
                }
                else {
                    $scope.bkItem.vehicleType_Name = ''
                    $scope.bkItem.vehicleType_Index = ''
                    $scope.bkItem.vehicleType_Id = ''
                }
            }

            function convertDate(param) {
                var year = param.substring(0, 4);
                var month = param.substring(4, 6);
                var day = param.substring(6, 8);
                month = parseInt(month) - 1;
                var a = new Date(year, month, day);
                return a;
            }

            function dateformate(param) {
                var date = param.slice(0, 10).split('-');
                var newdate = date[2] + "/" + date[1] + "/" + date[0];
                return newdate;
            }
            
            $scope.FilterVehicleType = function () {
                pageLoading.show();
                $scope.criteria = {}
                var viewModelVehicleType = masterVehicleTypeFactory;
                viewModelVehicleType.filter($scope.criteria).then(function (res) {
                    pageLoading.hide();
                    $scope.vehicleType = res.data.itemsVehicleType;
                });
            };
            //API AutoComplete
            $scope.url = {
                Master: webServiceAPI.Master,
            };
            var init = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.FilterVehicleType()
                $scope.filterModel = {};
                // if ($scope.dataWorkArea != undefined) {
                //     if ($scope.dataWorkArea.status == "create") {
                //         $scope.onShow = true;
                //         $vm.onShow();
                //     }
                //     if ($scope.dataWorkArea.status == "update") {
                //         $scope.onShow = true;
                //         $vm.onShow($scope.dataWorkArea);
                //     }
                // }
            };


            init();
        }
    })
})();