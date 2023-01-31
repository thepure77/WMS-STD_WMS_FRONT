(function() {
    'use strict'

    app.component('ruleConditionOperationForm', {
        controllerAs: '$vm',
        templateUrl: function($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterRuleConditionOperation/component/ruleConditionOperationForm.html";
        },
        bindings: {
            onShow: '=?',
            filterModel: '=?',
        },
        controller: function($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, ruleConditionOperationFactory, webServiceAPI) {
            var $vm = this;
            $scope.onShow = false;
            var defer = {};
            var viewModel = ruleConditionOperationFactory;
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
                    viewModel.find(param.ruleConditionOperation_Index).then(function(res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;
                        $scope.update = true;
                        if ($scope.filterModel.isActive == 0) {
                            $scope.getCheck = false;
                        } else {
                            $scope.getCheck = true;
                        }
                        if ($scope.filterModel.ruleConditionOperationType == 0) {
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
                    $scope.filterModel.isSystem = 1;
                    $scope.filterModel.status_Id = 1;
                    $scope.filterModel.ruleConditionOperationType = 1;
                }
                return defer.promise;
            };

            $scope.popupRuleConditionField = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {                    
                    $scope.popupRuleConditionField.onShow = !$scope.popupRuleConditionField.onShow;
                    $scope.popupRuleConditionField.delegates.ruleConditionFieldPopup(param, index);
                },
                config: {
                    title: "RuleConditionField"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.ruleConditionField_Index = angular.copy(param.ruleConditionField_Index);
                        $scope.filterModel.ruleConditionField_Name = angular.copy(param.ruleConditionField_Name);
                       

                    }
                }
            };

            $vm.triggerSearch = function() {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function(res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsRuleConditionOperation;
                });
            };
// 
            // $scope.radio1 = function(value) {
                // console.log(value);
                // if(value == 1){
                    // $scope.filterModel.ruleConditionOperationType = 'TEXT';
                  
                // }
            // }
            // $scope.radio2 = function(value) {
                // console.log(value);
                // if(value == 1){
                //     $scope.filterModel.ruleConditionOperationType = 'SORT';
                 
                // }
            // }
            //Validate & confirm Add
            $scope.add = function() {
                var model = $scope.filterModel;

                //ใช้ userName จาก localStorage
                model.create_By = $scope.userName;
      
                $scope.validateMsg = "";
                if (model.ruleConditionField_Index == undefined || model.ruleConditionField_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'RuleConditionField Name is required !!'
                    })
                    return "";
                }
                if (model.ruleConditionOperationType == undefined || model.ruleConditionOperationType == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'RuleConditionOperationType is required !!'
                    })
                    return "";

                } 
                if (model.ruleConditionOperation == undefined || model.ruleConditionOperation == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'RuleConditionOperation is required !!'
                    })
                    return "";
                } else {
                    if (model.ruleConditionOperationType == 1) {
                        model.ruleConditionOperationType = "TEXT"
                    } else {
                        model.ruleConditionOperationType = "SORT"
                    }
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
                ruleConditionField: "Autocomplete/autoRuleConditionOperationField",
                ruleConditionOperation: "Autocomplete/autoRuleConditionOperation"

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