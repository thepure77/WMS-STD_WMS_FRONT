(function () {
    'use strict'
    app.component('masterEquipmentSubtypeForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData//masterEquipmentSubType/component/equipmentSubTypeForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?'
        },
        controller: function ($scope, $q, $filter, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, dpMessageBox,localStorageService, equipmentSubTypeFactory, webServiceAPI) {
            var $vm = this;
            $scope.getCheck = false;
            $scope.onShow = false;
            var defer = {};
            var viewModel = equipmentSubTypeFactory;
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
                    viewModel.find(param.equipmentSubType_Index).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;
                        $scope.update = true;
                        if ($scope.filterModel.isActive == 0) {
                            $scope.getCheck = false;
                        } else {
                            $scope.getCheck = true;
                        }
                    });
                }
                else {
                    $scope.filterModel.equipmentSubType_Id = "";
                    $scope.update = false
                    $scope.create = true;
                    $scope.getCheck = true;
                    $scope.filterModel.isActive = 1;


                }
                return defer.promise;
            };
            $vm.triggerSearch = function () {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function(res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsEquipmentSubType;
                });
            };
            //Add ?????????????????? EquipmentSubType
            $scope.add = function () {
                var model = $scope.filterModel;
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                //Validate
                if (model.equipmentSubType_Id != "") {
                    if (!model.equipmentSubType_Id.match(/^([a-z0-9])+$/i)) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Validate',
                            message: 'EquipmentSubType ID is required !!'
                        })
                        return "";
                    } else {
                        model.equipmentSubType_Id = model.equipmentSubType_Id;
                    }
                }
                if (model.equipmentSubType_Name == undefined || model.equipmentSubType_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'EquipmentSubType Name is required !!'
                    })
                    return "";
                }
                if (model.equipmentSubType_Name == undefined || model.equipmentSubType_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'EquipmentSubType Name is required !!'
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
                            }else
                            if(res.data = "Fail"){
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Validate',
                                    message: 'EquipmentSubType Id is Duplicate  !!'
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
            $scope.autoComplete = {
                equipmentType: "autoEquipmentType/autoEquipmentType",
               
            };

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
            };

            
            init();
        }
    })
})();