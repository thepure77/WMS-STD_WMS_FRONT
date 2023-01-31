(function () {
    'use strict'

    app.component('serviceChargeTypeForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterServiceChargeType/component/serviceChargeTypeForm.html";
        },
        bindings: {
            onShow: '=?',
            filterModel: '=?',
            searchResultModel: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, serviceChargeTypeFactory) {
            var $vm = this;
            $scope.onShow = false;
            var defer = {};
            var viewModel = serviceChargeTypeFactory;
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
                    viewModel.find(param.serviceCharge_Index).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;
                        debugger
                        var dropdownProcess = $scope.dropdownProcess
                        const resultsdropdownProcess = dropdownProcess.filter((dropdownProcess) => {
                            return dropdownProcess.processIndex == res.data.default_Process_Index;
                        })
                        $scope.dropdownProcess.model = resultsdropdownProcess[0];
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
                    $scope.filterModel.serviceCharge_Id = "";
                    $scope.dropdownProcess.model = undefined;
                }
                return defer.promise;
            };

            $vm.triggerSearch = function () {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.items;
                });
            };

            //Validate & confirm Add
            $scope.add = function () {
                var model = $scope.filterModel;
                //ใช้ userName จาก localStorage
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                if (model.serviceCharge_Id != "") {
                    if (!model.serviceCharge_Id.match(/^([a-z0-9])+$/i)) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Validate',
                            message: 'serviceCharge ID is required !!'
                        })
                        return "";
                    }
                }

                if (!$scope.dropdownProcess.model) {
                    model.default_Process_Index = null
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'กรุณาเลือกรายละเอียด'
                    })
                    return "";
                }
                else {
                    model.default_Process_Index = $scope.dropdownProcess.model.processIndex;
                }


                if (model.serviceCharge_Name == undefined || model.serviceCharge_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'serviceCharge Name is required !!'
                    })
                    return "";
                } else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'Confirm ?',
                        message: 'MSG_Confirm_Save'
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
                                    message: 'serviceCharge ID is Dupplicate !!'
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

            //DropDown
            function GetdropdownProcess() {
                viewModel.dropdownProcess({}).then(function (res) {
                    $scope.dropdownProcess = res.data;
                });
            };


            var init = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
                GetdropdownProcess();
            };
            init();

        }
    })
})();