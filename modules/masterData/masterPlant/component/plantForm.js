(function () {
    'use strict'
    app.component('plantForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterPlant/component/plantForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?'
        },
        controller: function ($scope, $q, $filter, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, dpMessageBox,localStorageService, plantFactory,/*soldToFactory,*/ webServiceAPI) {
            var $vm = this;
            $scope.getCheck = false;
            $scope.onShow = false;
            var defer = {};
            var viewModel = plantFactory;
            //var viewModelSoldTo = soldToFactory;
            
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
                    debugger;
                    pageLoading.show();
                    $scope.create = false;
                    viewModel.find(param.plant_Index).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;
                        $scope.update = true;
                        if ($scope.filterModel.isActive == 0) {
                            $scope.getCheck = false;
                        } else {
                            $scope.getCheck = true
                        }
                    });
                }
                else {
                    $scope.update = false
                    $scope.create = true;
                    $scope.getCheck = true;
                    $scope.filterModel.isActive = 1;
                    $scope.filterModel.plant_Id = "";

                }
                return defer.promise;
            };
            $vm.triggerSearch = function () {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function(res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsPlant;
                });
            };
            //Add ข้อมูล ShipTo
            $scope.add = function () {
                var model = $scope.filterModel;
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                //Validate
                if (model.plant_Id == undefined || model.plant_Id == "") {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Plant ID is required !!'
                        })
                        return "";
                    
                }
                if (model.plant_Name == undefined || model.plant_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Plant Name is required !!'
                    })
                    return "";
                }
                
                if (model.plantType_Index == undefined || model.plantType_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Plant Type is required !!'
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
                                if($scope.dataItem != undefined){
                                    viewModel.set($scope.dataItem)
                                    $state.go('wms.sold_to_form');
                                }else{
                                defer.resolve('1');
                                }
                                $scope.filterModel = {};
                                
                            }
                            if (res.data == "Fail") {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Validate',
                                    message: 'Plant ID is Dupplicate !!'
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
                if($scope.dataItem != undefined){
                    viewModel.set($scope.dataItem)
                    $state.go('wms.sold_to_form');
                } else{
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
        
            //API AutoComplete
            $scope.autoComplete = {
                plantType: "autoPlant/autoPlantType",
                
            };

            $scope.url = {
                Master: webServiceAPI.Master_V2,
            };
            var init = function () {
                //$scope.dataItem = viewModelSoldTo.get();
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
                if($scope.dataItem != undefined){
                    if($scope.dataItem.status == "create"){
                        $scope.onShow = true;
                        $vm.onShow();
                    }
                    if($scope.dataItem.status == "update"){
                        $scope.onShow = true;
                        $vm.onShow($scope.dataItem);
                    }
                }
            };

            
            init();
        }
    })
})();