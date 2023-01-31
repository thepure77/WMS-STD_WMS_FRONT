(function () {
    'use strict'
    app.component('masterGateLaneForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterGateLane/component/masterGateLaneForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?'
        },
        controller: function ($scope, $q, $filter, $state, pageLoading, $window, dpMessageBox, localStorageService, masterGateLaneFactory, webServiceAPI, masterGateFactory) {
            var $vm = this;
            $scope.getCheck = false;
            $scope.onShow = false;
            var defer = {};
            var viewModel = masterGateLaneFactory;
            var viewModelGate = masterGateFactory;
            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $vm.onShow = function (param) {
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};                  
                    $scope.dropdownGate.model = {};
                }
                $scope.onShow = true;
                //Update
                if (param != undefined) {
                    pageLoading.show();
                    $scope.create = false;
                    viewModel.find(param).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;

                        var Gate = $scope.dropdownGate
                        const resultsGate = Gate.filter((Gate) => {
                            return Gate.gate_Name == res.data.gate_Name;
                        })
                        $scope.dropdownGate.model = resultsGate[0];

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

            $scope.dropdownGateLane = {};
           
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

                if (model.gateLane_Index == undefined) {
                    model.create_By = $scope.userName;
                }
                else {
                    model.update_By = $scope.userName;
                }
                $scope.validateMsg = "";
                //Validate
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
            };

            $scope.buttons = {
                add: true,
                update: false,
                back: true
            };

            $scope.gateSelected = function (param){
                $scope.filterModel.gate_Index = param.gate_Index;
                $scope.filterModel.gate_Id = param.gate_Id;
                $scope.filterModel.gate_Name = param.gate_Name;
            }

            function getGate() {
                viewModelGate.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();

                    $scope.dropdownGate = res.data.gateModels;
                });

            }
            //API AutoComplete
            $scope.url = {
                Master: webServiceAPI.Master,
            };
            var init = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
                getGate();
            };


            init();
        }
    })
})();