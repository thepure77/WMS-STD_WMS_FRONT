(function () {
    'use strict'

    app.component('facilityForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterFacility/component/facilityForm.html";
        },
        bindings: {
            onShow: '=?',
            filterModel: '=?',
            searchResultModel: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, facilityFactory,webServiceAPI) {
            var $vm = this;
            $scope.onShow = false;
            var defer = {};
            var viewModel = facilityFactory;
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
                    viewModel.find(param.facility_Index).then(function (res) {
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
                    $scope.filterModel.facility_Id = "";
                }
                return defer.promise;
            };

            $vm.triggerSearch = function () {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsFacility;
                });
            };

            //Validate & confirm Add
            $scope.add = function () {
                var model = $scope.filterModel;
                //ใช้ userName จาก localStorage
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                if (model.facility_Id != "") {
                    if (!model.facility_Id.match(/^([a-z0-9])+$/i)) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Facility ID is required !!'
                        })
                        return "";
                    } else {
                        model.facility_Id = model.facility_Id;
                    }
                }
                if (model.facility_Name == undefined || model.facility_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Facility Name is required !!'
                    })
                    return "";
                } 
                if (model.facilityType_Index == undefined || model.facilityType_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Facility Type is required !!'
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
                                defer.resolve('1');
                                $scope.filterModel = {};
                            }
                            if (res.data == "Fail") {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Validate',
                                    message: 'Facility ID is Dupplicate !!'
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
            //sourceurl autocomplete
            $scope.autoComplete = {
                facilityType: "Autocomplete/autoFacilityTypeAndFacilityTypeId",
            };

            //url webServiceAPI.Master
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