(function () {
    'use strict'

    app.component('ownerTypeForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterOwnerType/component/ownerTypeForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, ownerTypeFactory) {
            var $vm = this;

            $scope.onShow = false;
            var defer = {};
            var viewModel = ownerTypeFactory;
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
                    viewModel.find(param.ownerType_Index).then(function(res) {
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
                    $scope.filterModel.ownerType_Id = "";
                }
                return defer.promise;
            };

            $vm.triggerSearch = function() {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function(res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsOwnerType;
                });
            };

            //Validate & confirm Add
            $scope.add = function() {
                var model = $scope.filterModel;
                //ใช้ userName จาก localStorage
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                if (model.ownerType_Id != "") {
                    if (!model.ownerType_Id.match(/^([a-z0-9])+$/i)) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Owner Type ID is required !!'
                        })
                        return "";
                    } else {
                        model.ownerType_Id = model.ownerType_Id;
                    }
                }
                if (model.ownerType_Name == undefined || model.ownerType_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Owner Name is required !!'
                    })
                    return "";
                } 
                if (model.ownerType_SecondName == undefined || model.ownerType_SecondName == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Owner Second Name is required !!'
                    })
                    return "";
                }
                else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'Confirm ?',
                        message: 'Do you want to save !'
                    }).then(function() {
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
                                    message: 'Owner Type ID is Dupplicate !!'
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

            var init = function() {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
            };
            init();
        }
    })
})();