(function() {
    'use strict'

    app.component('ruleForm', {
        controllerAs: '$vm',
        templateUrl: function($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterRule/component/ruleForm.html";
        },
        bindings: {
            onShow: '=?',
            filterModel: '=?',
        },
        controller: function($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, ruleFactory, webServiceAPI) {
            var $vm = this;
            $scope.onShow = false;
            var defer = {};
            var viewModel = ruleFactory;
            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $scope.getCheck = false;
            $scope.getCheck2 = false;

            $vm.onShow = function(param) {
                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};
                }
                $scope.onShow = true;
                if (param != undefined) {
                    pageLoading.show();
                    $scope.create = false;
                    viewModel.find(param.rule_Index).then(function(res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;
                        $scope.update = true;
                        if ($scope.filterModel.isActive == 0) {
                            $scope.getCheck = false;
                        } else {
                            $scope.getCheck = true;
                        }
                        if ($scope.filterModel.isSort == 0) {
                            $scope.getCheck2 = false;
                        } else {
                            $scope.getCheck2 = true;
                        }
                        if ($scope.filterModel.isSearch == 0) {
                            $scope.getCheck2 = false;
                        } else {
                            $scope.getCheck2 = true;
                        }
                    });
                } else {
                    $scope.update = false
                    $scope.create = true;
                    $scope.getCheck = true;
                    $scope.getCheck2 = false;
                    $scope.filterModel.isActive = 1;
                    $scope.filterModel.isSort = 0;
                    $scope.filterModel.isSearch = 0;
                    $scope.filterModel.isSource = 1;
                    $scope.filterModel.isDestination = 0;
                    $scope.filterModel.rule_Id = "";
                }
                return defer.promise;
            };

            $vm.triggerSearch = function() {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function(res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsRule;
                });
            };

            $scope.radio1 = function(value) {
                if(value == 1){
                    $scope.filterModel.isDestination = 0;
                    $scope.filterModel.isSource = 1;
                }
            }
            $scope.radio2 = function(value) {
                if(value == 1){
                    $scope.filterModel.isDestination = 1;
                    $scope.filterModel.isSource = 0;
                }
            }
            //Validate & confirm Add
            $scope.add = function() {
                var model = $scope.filterModel;
                //ใช้ userName จาก localStorage
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                if (model.rule_Id != "") {
                    if (!model.rule_Id.match(/^([a-z0-9])+$/i)) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'รหัสข้อบังคับไม่ถูกต้อง'
                        })
                        return "";
                    } else {
                        model.rule_Id = model.rule_Id;
                    }
                }
                if (model.rule_Name == undefined || model.rule_Name == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอกชื่อข้อบังคับ'
                    })
                    return "";
                }
                if (model.process_Index == undefined || model.process_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณาเลือกเมนู'
                    })
                    return "";
                } else {
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
                            }
                            if (res.data == "Fail") {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'รหัสข้อบังคับซ้ำ'
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

            $scope.popupProcess = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {                    
                    $scope.popupProcess.onShow = !$scope.popupProcess.onShow;
                    $scope.popupProcess.delegates.processPopupV2(param, index);
                },
                config: {
                    title: "ProcessType"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.process_Index = angular.copy(param.process_Index);
                        $scope.filterModel.process_Id = angular.copy(param.process_Id);
                        $scope.filterModel.process_Name = angular.copy(param.process_Name);
                        $scope.filterModel.key = angular.copy(param.process_Id) + " - " + angular.copy(param.process_Name);

                    }
                }
            };

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

            $scope.autoComplete = {
                process: "Autocomplete/autoProcessAndProcessId",
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };

            var init = function() {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
            };
            init();
        }
    })
})();