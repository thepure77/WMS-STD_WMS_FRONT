(function () {
    'use strict'

    app.component('taskcyclecountSummary', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Tranfer/TaskCyclecount/TaskCyclecountSummary.html";
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, taskcyclecountFactory, logsFactory) {
            var $vm = this;

            $vm.isFormTaskCycleCountSummary = true;
            $scope.filterModel = {};
            $scope.model = {};
            var viewModel = taskcyclecountFactory;
            $scope.listTask = {};
            $scope.listAssign = {};
            $scope.smodel = {};

            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });

            
            $scope.clickTab = function (tab) {
                $scope.click = tab;
            }
            $scope.sku = {
                chk: false
            };
            
            $scope.hide = function () {
                $scope.sku.chk = $scope.sku.chk === false ? true : false;
            };

            this.$onInit = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.model.user = $scope.userName;
                $scope.click = 1;
                $scope.SearchUser();
                insertLogsUser();
            }

            $scope.selectData = function (model) {
                model.userAssign = $scope.userName;
                viewModel.find(model).then(
                    function success(res) {
                        if (res.data.message == true) {
                            $vm.isFormTaskCycleCountSummary = false;
                            if ($scope.isCount) {
                                $scope.isCount(model).then(function (result) {
                                    $scope.SearchUser();
                                    $scope.click = 1;
                                    $vm.isFormTaskCycleCountSummary = true;
                                }).catch(function (error) {
                                    defer.reject({ 'Message': error });
                                });
                            }
                        }
                        else
                        {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'Error',
                                    message: 'User นี้มีการ Assign อยู่'
                                }
                            )
                        }
                    },
                    function error(response) {
                    });
            }

            
            $scope.selectDataAssign = function (model) {
                $vm.isFormTaskCycleCountSummary = false;
                if ($scope.isCount) {
                    $scope.isCount(model).then(function (result) {
                        $scope.SearchUser();
                        $scope.click = 1;
                        $vm.isFormTaskCycleCountSummary = true;
                    }).catch(function (error) {
                        defer.reject({ 'Message': error });
                    });
                }
            }


            $scope.SearchUser = function () {
                $scope.UserModel = {};
                $scope.UserModel.user_Name = $scope.userName;
                var deferred = $q.defer();
                viewModel.userfilter($scope.UserModel).then(
                    function success(res) {
                        $scope.filterModel = res.data.result;
                        $scope.listTask = res.data.items || {};
                        $scope.listAssign = res.data.resultAssign || {};
                    },
                    function error(response) {
                        $scope.listTask = {};
                        $scope.listAssign = {};
                    });
                return deferred.promise;
            }

            $scope.Scan = function (re1) {
                $scope.smodel = re1;
                var deferred = $q.defer();
                viewModel.userfilter($scope.UserModel).then(
                    function success(res) {
                        $scope.listTask = res.data.items || {};
                        $scope.listAssign = res.data.resultAssign || {};
                    },
                    function error(response) {
                        $scope.listTask = res.data.items || {};
                        $scope.listAssign = res.data.resultAssign || {};
                    });
                return deferred.promise;

            }
            var index = "";

            function insertLogsUser()
            {
                var userLogin = JSON.parse(localStorage.userlogin);
                var logs = {};
                //logs.log_Index
                //logs.userGroup_Index
                //logs.userGroup_Id
                logs.userGroup_Name = localStorage['userGroupName'];
                logs.user_Index = userLogin.user_Index;
                logs.user_Id = userLogin.user_Id;
                logs.user_Name = userLogin.user_Name;
                logs.first_Name = userLogin.first_Name;
                logs.last_Name = userLogin.last_Name;
                logs.menu_Index = "2244C514-9000-4362-A8EA-D1F80214DD0F";
                //logs.menuType_Index
                //logs.menu_Id
                logs.menu_Name = "ระบบจัดการภายในคลังพัสดุ";
                logs.sub_Menu_Index = "0BACFDBF-4E58-4BFF-91E9-00354F0AA115"
                //logs.sub_MenuType_Index
                //logs.sub_Menu_Id
                logs.sub_Menu_Name = "สแกน ตรวจนับสินค้า";
                logs.operations = "";
                //logs.ref_Document_Index
                //logs.ref_Document_No
                //logs.request_URL
                //logs.request_Body
                //logs.isActive
                //logs.isDelete
                //logs.isSystem
                logsFactory.SaveLogs(logs).then(function (res) {

                })
            };



        }
    })
})();