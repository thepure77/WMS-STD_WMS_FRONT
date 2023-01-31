(function() {
    'use strict'

    app.component('ruleConditionForm', {
        controllerAs: '$vm',
        templateUrl: function($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterRuleCondition/component/ruleConditionForm.html";
        },
        bindings: {
            onShow: '=?',
            filterModel: '=?',
        },
        controller: function($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, ruleConditionFactory, webServiceAPI) {
            var $vm = this;
            $scope.onShow = false;
            var defer = {};
            var viewModel = ruleConditionFactory;
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
                    viewModel.find(param.ruleCondition_Index).then(function(res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;
                        $scope.update = true;
                        if ($scope.filterModel.isActive == 0) {
                            $scope.getCheck = false;
                        } else {
                            $scope.getCheck = true;
                        }
                        $scope.filterModel.key = angular.copy(param.rule_Id) + " - " + angular.copy(param.rule_Name);
                        $scope.filterModel.key2 = angular.copy(param.ruleConditionField_Name);
                        $scope.filterModel.key3 = angular.copy(param.ruleConditionOperation) + " - " + angular.copy(param.ruleConditionOperationType);
                    });
                } else {
                    $scope.update = false
                    $scope.create = true;
                    $scope.getCheck = true;
                    $scope.getCheck2 = false;
                    $scope.filterModel.isActive = 1;
                }
                return defer.promise;
            };

            $vm.triggerSearch = function() {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function(res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsRuleCondition;
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
                if (model.rule_Index == undefined || model.rule_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Rule is required !!'
                    })
                    return "";
                }
                if (model.ruleConditionField_Index == undefined || model.ruleConditionField_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'RuleConditionField is required !!'
                    })
                    return "";
                }
                if (model.ruleConditionOperation_Index == undefined || model.ruleConditionOperation_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'RuleConditionOperation is required !!'
                    })
                    return "";
                }   
                if (model.ruleCondition_Param == undefined || model.ruleCondition_Param == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'RuleCondition is required !!'
                    })
                    return "";
                } else {
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

            $scope.popupRuleCondition = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupRuleCondition.onShow = !$scope.popupRuleCondition.onShow;
                    $scope.popupRuleCondition.delegates.ruleConditionFieldPopup2(param, index);
                },
                config: {
                    title: "RuleConditionField2"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.ruleConditionField_Index = angular.copy(param.ruleConditionField_Index);
                        $scope.filterModel.ruleConditionField_Name = angular.copy(param.ruleConditionField_Name);
                        $scope.filterModel.key2 = angular.copy(param.ruleConditionField_Name);

                    }
                }
            };

            $scope.popupRuleConditionOperation = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupRuleConditionOperation.onShow = !$scope.popupRuleConditionOperation.onShow;
                    $scope.popupRuleConditionOperation.delegates.ruleConditionOperationPopup(param, index);
                },
                config: {
                    title: "RuleConditionOperation"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.ruleConditionOperation_Index = angular.copy(param.ruleConditionOperation_Index);
                        $scope.filterModel.ruleConditionOperation = angular.copy(param.ruleConditionOperation);
                        $scope.filterModel.ruleConditionOperationType = angular.copy(param.ruleConditionOperationType);
                        $scope.filterModel.key3 = angular.copy(param.ruleConditionOperation) + " - " + angular.copy(param.ruleConditionOperationType);

                    }
                }
            };

            $scope.popupRule = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {                      
                    $scope.popupRule.onShow = !$scope.popupRule.onShow;
                    $scope.popupRule.delegates.rulePopup(param, index);
                },
                config: {
                    title: "Rule"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.rule_Index = angular.copy(param.rule_Index);
                        $scope.filterModel.rule_Id = angular.copy(param.rule_Id);
                        $scope.filterModel.rule_Name = angular.copy(param.rule_Name);
                        $scope.filterModel.key = angular.copy(param.rule_Id) + " - " + angular.copy(param.rule_Name);

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
                        debugger
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.resolve(response);
                    }
                );
                return deferred.promise;
            }

            // $scope.autoComplete = {
            //     process: "Autocomplete/autoProcessAndProcessId",
            // };

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