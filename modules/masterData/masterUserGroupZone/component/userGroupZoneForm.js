(function() {
    'use strict'

    app.component('userGroupZoneForm', {
        controllerAs: '$vm',
        templateUrl: function($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterUserGroupZone/component/userGroupZoneForm.html";
        },
        bindings: {
            onShow: '=?',
            filterModel: '=?',
        },
        controller: function($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, userGroupZoneFactory, webServiceAPI) {
            var $vm = this;
            $scope.onShow = false;
            var defer = {};
            var viewModel = userGroupZoneFactory;
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
                    viewModel.find(param.userGroupZone_Index).then(function(res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data;
                        $scope.update = true;
                        if ($scope.filterModel.isActive == 0) {
                            $scope.getCheck = false;
                        } else {
                            $scope.getCheck = true;
                        }
                        // $scope.filterModel.key = angular.copy(param.rule_Id) + " - " + angular.copy(param.rule_Name);
                        // $scope.filterModel.key2 = angular.copy(param.ruleConditionField_Name);
                        // $scope.filterModel.key3 = angular.copy(param.ruleConditionOperation) + " - " + angular.copy(param.ruleConditionOperationType);
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
                    $vm.searchResultModel = res.data.itemsUserGroupZone;
                });
            };
            //Validate & confirm Add
            $scope.add = function() {
                var model = $scope.filterModel;
                //ใช้ userName จาก localStorage
                model.create_By = $scope.userName;
                $scope.validateMsg = "";
                if (model.userGroup_Index == undefined || model.userGroup_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'UserGroup is required !!'
                    })
                    return "";
                }
                if (model.zone_Index == undefined || model.zone_Index == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'Zone is required !!'
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

            $scope.popupUserGroup = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupUserGroup.onShow = !$scope.popupUserGroup.onShow;
                    $scope.popupUserGroup.delegates.userGroupPopup(param, index);
                },
                config: {
                    title: "UserGroup"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.userGroup_Index = angular.copy(param.userGroup_Index);
                        $scope.filterModel.userGroup_Id = angular.copy(param.userGroup_Id);
                        $scope.filterModel.userGroup_Name = angular.copy(param.userGroup_Id) +  " - " + angular.copy(param.userGroup_Name);

                    }
                }
            };

            $scope.popupZone = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupZone.onShow = !$scope.popupZone.onShow;
                    $scope.popupZone.delegates.zonePopup(param, index);
                },
                config: {
                    title: "Zone"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.zone_Index = angular.copy(param.zone_Index);
                        $scope.filterModel.zone_Id = angular.copy(param.zone_Id);
                        $scope.filterModel.zone_Name = angular.copy(param.zone_Id) +  " - " + angular.copy(param.zone_Name);

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