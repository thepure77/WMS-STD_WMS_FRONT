(function () {
    'use strict'
    app.component('masterYardForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterYard/component/masterYardForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?'
        },
        controller: function ($scope, $q, $filter, $state, pageLoading, $window, dpMessageBox, localStorageService, masterYardFactory, webServiceAPI, facilityFactory,masterYardTypeFactory) {
            var $vm = this;
            $scope.getCheck = false;
            $scope.onShow = false;
            var defer = {};
            var viewModel = masterYardFactory;
            var viewModelYardType = masterYardTypeFactory;
            var viewModelFacility = facilityFactory;
            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $vm.onShow = function (param) {
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};
                    $scope.dropdownyardTypeModels.model = {};
                }
                $scope.onShow = true;
                //Update
                if (param != undefined) {
                    pageLoading.show();
                    $scope.create = false;
                    viewModel.find(param).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;

                        
                        var YardType = $scope.dropdownyardTypeModels
                        const resultsYardType = YardType.filter((YardType) => {
                            return YardType.yardType_Name == res.data.yardType_Name;
                        })
                        $scope.dropdownyardTypeModels.model = resultsYardType[0];

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

            function getYardType(){
                pageLoading.show();
                viewModelYardType.filter($scope.filterModel).then(function(res) {
                    pageLoading.hide();

                    $scope.dropdownyardTypeModels = res.data.yardTypeModels;
                });
            }

            $scope.yardTypeSelected = function (param){
                $scope.filterModel.yardType_Index = param.yardType_Index;
                $scope.filterModel.yardType_Id = param.yardType_Id;
                $scope.filterModel.facilityType_Name = param.yardType_Name;
            }
            $scope.selectedFacility = function (param){
                $scope.filterModel.facility_Index = param.facility_Index;
                $scope.filterModel.facility_Id = param.facility_Id;
                $scope.filterModel.facility_Name = param.facility_Name;
            }
            $scope.dropdownYard = {};
            $scope.dropdownFacility = {};

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

                if (model.yard_Index == undefined) {
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
                getYardType();
            };


            init();
        }
    })
})();