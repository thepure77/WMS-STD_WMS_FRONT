(function () {
    'use strict'

    app.component('zoneLocationForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterZoneLocation/component/zoneLocationForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, zoneLocationFactory,webServiceAPI) {
            var $vm = this;

            $scope.onShow = false;
            var defer = {};
            var viewModel = zoneLocationFactory;

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
                    viewModel.find(param.zoneLocation_Index).then(function(res) {
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
                    $scope.filterModel.zoneLocation_Id = "";
                    $scope.update = false
                    $scope.create = true;
                    $scope.getCheck = true;
                    $scope.filterModel.isActive = 1;
                }
                return defer.promise;
            };

            $vm.triggerSearch = function() {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function(res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsZoneLocation;
                });
            };

            //Validate & confirm Add
            $scope.add = function() {
                var model = $scope.filterModel;
                //ใช้ userName จาก localStorage
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                if (model.zoneLocation_Id != "") {
                    if (!model.zoneLocation_Id.match(/^([a-z0-9])+$/i)) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Validate',
                            message: 'ZoneLocation ID is required !!'
                        })
                        return "";
                    } else {
                        model.zoneLocation_Id = model.zoneLocation_Id;
                    }
                }
                if (model.zone_Index == undefined || model.zone_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกโซน'
                    })
                    return "";
                }
                if (model.location_Index == undefined || model.location_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกตำแหน่งจัดเก็บ'
                    })
                    return "";
                }
                else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'ยืนยันข้อมูล',
                        message: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่'
                    }).then(function() {
                        pageLoading.show();
                        Add(model).then(function success(res) {

                            pageLoading.hide();
                            if (res.data == "Done") {
                                defer.resolve('1');
                                $scope.filterModel = {};
                            }else
                            if(res.data = "Fail"){
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'รหัสตำแหน่งโซนช้ำ'
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
                zone: "Autocomplete/autoZoneAndZoneId",
                location: "Autocomplete/autoLocationAndLocationId"
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

            // $scope.Cancel = true;
            // $scope.update = false;
            // $scope.create = true;
            // $vm.onShow = function (param) {
            //     defer = $q.defer();
            //     if ($scope.filterModel != null) {
            //         $scope.filterModel = {};
            //     }
            //     $scope.onShow = true;
            //     if (param != undefined) {
            //         pageLoading.show();
            //         $scope.create = false;
            //         viewModel.getId(param.zoneLocationIndex).then(function (res) {
            //             pageLoading.hide();
            //             $scope.filterModel = res.data[0];
            //             $scope.update = true;
            //         });
            //     }
            //     else {
            //         $scope.update = false
            //         $scope.create = true;
            //     }
            //     return defer.promise;
            // };

            // $vm.triggerSearch = function () {
            //     $vm.filterModel = $vm.filterModel || {};
            //     pageLoading.show();
            //     viewModel.filter().then(function (res) {
            //         pageLoading.hide();
            //         $vm.filterModel = res.data;
            //         $vm.searchResultModel = res.data;
            //     });
            // };

            // $scope.add = function () {
            //     var model = $scope.filterModel;
            //     $scope.validateMsg = "";
            //     validate(model).then(function (result) {
            //         if (result) {
            //             $scope.validateMsg = result;
            //             dpMessageBox.alert(
            //                 {
            //                     ok: 'Close',
            //                     title: 'Validate',
            //                     message: result
            //                 }
            //             )
            //         }
            //         else {
            //             dpMessageBox.confirm({
            //                 ok: 'Yes',
            //                 cancel: 'No',
            //                 title: 'Confirm ?',
            //                 message: 'Do you want to save !'
            //             }).then(function () {
            //                 pageLoading.show();
            //                 Add(model).then(function success(res) {
            //                     pageLoading.hide();
            //                     $state.reload($state.current.name);
            //                 }, function error(param) {
            //                     dpMessageBox.alert(param).then(function (param) { }, function (param) { });
            //                 });
            //             });

            //             defer.resolve();
            //         }
            //     });
            //     $scope.filterModel = {};
            // }

            // $scope.edit = function () {
            //     var model = $scope.filterModel;
            //     $scope.validateMsg = "";
            //     validate(model).then(function (result) {
            //         if (result) {
            //             $scope.validateMsg = result;
            //             dpMessageBox.alert(
            //                 {
            //                     ok: 'Close',
            //                     title: 'Validate',
            //                     message: result
            //                 }
            //             )
            //         }
            //         else {
            //             dpMessageBox.confirm({
            //                 ok: 'Yes',
            //                 cancel: 'No',
            //                 title: 'Confirm ?',
            //                 message: 'Do you want to save !'
            //             }).then(function () {
            //                 pageLoading.show();
            //                 Edit(model).then(function success(res) {
            //                     pageLoading.hide();
            //                     $state.reload($state.current.name);
            //                 }, function error(param) {
            //                     dpMessageBox.alert(param).then(function (param) { }, function (param) { });
            //                 });
            //             });

            //             defer.resolve();
            //         }
            //     });
            //     defer.resolve();
            // }

            // $scope.back = function () {
            //     defer.resolve('1');
            // }

            // function validate(param) {
            //     let defer = $q.defer();
            //     let msg = "";
            //     var dataList = $scope.$parent.$vm.searchResultModel;
            //     for (var i = 0; i <= dataList.length - 1; i++) {
            //         if (param.locationIndex == dataList[i].locationIndex && param.zoneIndex == dataList[i].zoneIndex) {
            //             if (param.locationIndex == dataList[i].locationIndex) {
            //                 msg = 'Location' + " " + param.locationName + ' Dupicated ! Choose New Location'
            //                 defer.resolve(msg);
            //             }
            //             if (param.zoneIndex == dataList[i].zoneIndex) {
            //                 msg = 'ZoneIndex' + " " + param.zoneIndex + ' Dupicated ! Choose New ZoneIndex'
            //                 defer.resolve(msg);
            //             }
            //         }
            //     }
            //     if (param.zoneName == undefined) {
            //         msg = ' Zone is required !'
            //         defer.resolve(msg);
            //     } 
            //     else if (param.locationName == null){
            //         msg = ' Location is required !'
            //         defer.resolve(msg);
            //     }
            //     defer.resolve(msg);

            //     return defer.promise;
            // }
            // $scope.show = {
            //     main: true,
            //     transport: false,
            //     warehouse: false
            // };
            // function Add(param) {
            //     let deferred = $q.defer();
            //     viewModel.add(param).then(
            //         function success(results) {
            //             deferred.resolve(results);
            //         },
            //         function error(response) {
            //             deferred.reject(response);
            //         }
            //     );
            //     return deferred.promise;
            // }
            // function Edit(param) {
            //     var deferred = $q.defer();
            //     viewModel.edit(param).then(
            //         function success(results) {
            //             deferred.resolve(results);
            //         },
            //         function error(response) {
            //             deferred.reject(response);
            //         }
            //     );
            //     return deferred.promise;
            // }
            // $scope.popupZone = {
            //     onShow: false,
            //     delegates: {},
            //     onClick: function (param, index) {
            //         $scope.popupZone.onShow = !$scope.popupZone.onShow;
            //         $scope.popupZone.delegates.zonePopup(param, index);
            //     },
            //     config: {
            //         title: "Zone"
            //     },
            //     invokes: {
            //         add: function (param) { },
            //         edit: function (param) { },
            //         selected: function (param) {
            //             $scope.filterModel.zoneIndex = angular.copy(param.zoneIndex);
            //             $scope.filterModel.zoneId = angular.copy(param.zoneId);
            //             $scope.filterModel.zoneName = angular.copy(param.zoneId) + " - " + angular.copy(param.zoneName);

            //         }
            //     }
            // };

            // $scope.popupLocation = {
            //     onShow: false,
            //     delegates: {},
            //     onClick: function (param, index) {
            //         $scope.popupLocation.onShow = !$scope.popupLocation.onShow;
            //         $scope.popupLocation.delegates.locationPopup(param, index);
            //     },
            //     config: {
            //         title: "location"
            //     },
            //     invokes: {
            //         add: function (param) { },
            //         edit: function (param) { },
            //         selected: function (param) {
            //             $scope.filterModel.locationIndex = angular.copy(param.locationIndex);
            //             $scope.filterModel.locationId = angular.copy(param.locationId);
            //             $scope.filterModel.locationName = angular.copy(param.locationId) + " - " + angular.copy(param.locationName);

            //         }
            //     }
            // };
            // var init = function () {
            //     $scope.filterModel = {};
            // };
            // init();
        }
    })
})();