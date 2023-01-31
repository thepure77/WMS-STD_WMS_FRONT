(function () {
    'use strict'

    app.component('locationZoneputawayForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterLocationZoneputaway/component/locationZoneputawayForm.html";
        },
        bindings: {
            onShow: '=?',
            filterModel: '=?',
            searchResultModel: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, locationZoneputawayFactory,webServiceAPI) {
            var $vm = this;

            $scope.onShow = false;
            var defer = {};
            var viewModel = locationZoneputawayFactory;

            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $scope.getCheck = false;

            $vm.onShow = function (param) {
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};
                }
                $scope.onShow = true;
                if (param != undefined) {
                    pageLoading.show();
                    $scope.create = false;
                    viewModel.find(param.locationZoneputaway_Index).then(function (res) {
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
                    $scope.filterModel.locationZoneputaway_Id = "";
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
                    $vm.searchResultModel = res.data.itemsLocationZoneputaway;
                });
            };

            //Validate & confirm Add
            $scope.add = function () {
                var model = $scope.filterModel;
                //ใช้ userName จาก localStorage
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                if (model.locationZoneputaway_Id != "") {
                    if (!model.locationZoneputaway_Id.match(/^([a-z0-9])+$/i)) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'รหัสโซนตำแหน่งจัดเก็บสินค้าไม่ถูกต้อง'
                        })
                        return "";
                    } else {
                        model.locationZoneputaway_Id = model.locationZoneputaway_Id;
                    }
                }
                if (model.zoneputaway_Index == undefined || model.zoneputaway_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกโซนจัดเก็บ'
                    })
                    return "";
                } if (model.location_Index == undefined || model.location_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกตำแหน่งจัดเก็บ'
                    })
                    return "";
                } else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'ยืนยันข้อมูล',
                        message: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่'
                    }).then(function () {
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
                                    message: 'รหัสโซนตำแหน่งจัดเก็บสินค้าซ้ำ'
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
            $scope.back = function () {
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

            //API AutoComplete
            $scope.autoComplete = {
                zoneputaway : "Autocomplete/autoZoneputaway",
                location : "Autocomplete/autoLocation",
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };

            var init = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
            };
            init();

        }
    })
})();