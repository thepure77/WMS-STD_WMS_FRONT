(function () {
    'use strict'

    app.component('assignJobCycleCount', {
        controllerAs: '$vm',
        bindings: {
            isLoading: '=?',
            onShow: '=?',
        }, templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Tranfer/AssignJobCycleCount/assignJob.html";
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, assignJobCycleCountFactory, webServiceAPI, logsFactory) {
            var $vm = this;
            var viewModel = assignJobCycleCountFactory;
            $vm.isFilterTable = true;
            $scope.onShow = false;

            $scope.isFilter = true;
            $scope.filterModel = {};


            $scope.clickTab = function (tab) {
                $scope.click = tab;
            }


            $scope.Assign = function (data, Template) {
                var model = $scope.filterModel;
                model.Template = Template;
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยันการมอบหมายงาน',
                    message: 'คุณต้องการมอบหมายงานใช่หรือไม่ !'
                }).then(function () {
                    model.create_By = localStorageService.get('userTokenStorage');
                    model.operations = "ASSIGN";
                    pageLoading.show();
                    viewModel.assign(model).then(
                        function success(res) {
                            pageLoading.hide();
                            if (res.data == "true") {
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: 'มอบหมายงานสำเร็จ'
                                    }
                                )
                                $scope.findTask = {};
                                $scope.findTask.listTaskViewModel = model.listCyclecountViewModel
                                $scope.taskfilter($scope.findTask);
                                $scope.filterModel = {};
                            }
                            else {
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: res.data
                                    }
                                )
                            }
                        },
                        function error(response) {
                            pageLoading.hide();
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'Error',
                                    message: 'Assign Error'
                                }
                            )
                        }
                    );
                },
                    function error(param) {
                    });
            };


            $scope.detectCheckAll = function (c) {
                if (c === true) {
                    angular.forEach($scope.taskfilterModel, function (v, k) {
                        $scope.taskfilterModel[k].selected = true;
                    });
                } else {
                    angular.forEach($scope.taskfilterModel, function (v, k) {
                        $scope.taskfilterModel[k].selected = false;
                    });
                }
            }



            $scope.taskfilter = function (param) {
                viewModel.taskfilter(param).then(function (res) {
                    $scope.taskfilterModel = res.data;
                    let dataListTask = $scope.taskfilterModel;

                    for (var i = 0; i <= dataListTask.length - 1; i++) {

                        var userAssign = $scope.dropdownUser
                        const resultsuserAssign = userAssign.filter((userAssign) => {
                            return userAssign.user_Name == dataListTask[i].userAssign;
                        })
                        $scope.taskfilterModel[i].dropdownUser = {};
                        $scope.taskfilterModel[i].dropdownUser.model = resultsuserAssign[0];
                    }


                });
            };

            $scope.confirm = function () {

                let defer = $q.defer();
                let dataList = $scope.taskfilterModel;

                //let dataList = $scope.taskfilterModel;


                for (var i = 0; i <= dataList.length - 1; i++) {
                    if ($scope.taskfilterModel[i].selected && $scope.taskfilterModel[i].dropdownUser.model == undefined) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณาเลือกผู้รับมอบงาน'
                        });
                        return;
                    }
                    else if ($scope.taskfilterModel[i].selected && $scope.taskfilterModel[i].dropdownUser.model != null) {
                        $scope.taskfilterModel[i].userAssign = $scope.taskfilterModel[i].dropdownUser.model.user_Name;
                    }
                    $scope.taskfilterModel[i].update_By = $scope.userName;
                }

                $scope.ItemModel = {};
                $scope.ItemModel.listTaskViewModel = $scope.taskfilterModel.filter(c => c.selected == true);
                var validateChk = "";

                for (let index = 0; index < $scope.taskfilterModel.length; index++) {
                    if ($scope.taskfilterModel[index].selected) {
                        if ($scope.taskfilterModel[index].document_Status != "-1")
                            validateChk = validateChk + ' ' + $scope.taskfilterModel[index].task_No;
                    }
                }

                if (validateChk == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'มอบหมายงาน',
                        message: 'กรุณาเลือกข้อมูล !!'
                    });
                    return;
                }
                else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'ยืนยันข้อมูล ?',
                        message: 'คุณต้องการยืนยันข้อมูลใช่หรือไม่ !'
                    }).then(function () {
                        pageLoading.show();
                        confirmTask($scope.ItemModel).then(function success(res) {
                            pageLoading.hide();
                            if (res.data == "Done") {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'ยืนยันการบันทึกสำเร็จ'
                                })
                                $scope.taskfilterModel = {};
                            }
                            else{
                                let message = res.data.split(",");
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    messageNewLine: message
                                })
                            }
                            // angular.forEach($scope.taskfilterModel, function (v, k) {
                            //     $scope.taskfilterModel[k].selected = false;
                            // });
                        }, function error(ex) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: ex
                            })
                        });
                    });
                }
                defer.resolve();
            }

            function confirmTask(item) {
                let deferred = $q.defer();
                item.operations = "CONFIRM_TASK";
                viewModel.confirmTask(item).then(
                    function success(results) {
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            $scope.autoComplete = {
                CycleCount_No: "AssignJob/autoTaskCyclecountNo",
            };

            $scope.url = {
                CY: webServiceAPI.Cyclecount,
            };

            $scope.dropdownUser = function () {
                viewModel.dropdownUser($scope.filterModel).then(function (res) {
                    $scope.dropdownUser = res.data;
                });
            };

            $scope.popupCyclecount = {
                onShow: false,
                delegates: {},
                onClick: function (param) {
                    $scope.popupCyclecount.onShow = !$scope.popupCyclecount.onShow;
                    $scope.popupCyclecount.delegates.cyclecountPopup(param);
                },
                config: {
                    title: "GoodsIssue"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.listCyclecountViewModel = $scope.filterModel.GoodsIssueViewModel || []
                        $scope.filterModel.listCyclecountViewModel = param;
                    }
                }
            };

            $scope.popupTaskCyclecount = {
                onShow: false,
                delegates: {},
                onClick: function (param) {
                    $scope.popupTaskCyclecount.onShow = !$scope.popupTaskCyclecount.onShow;
                    $scope.popupTaskCyclecount.delegates.taskCyclecountPopup(param);
                },
                config: {
                    title: "Task"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                    }
                }
            };

            function insertLogsUser() {
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
                logs.sub_Menu_Index = "3BBF4D01-FB73-4042-A746-4E22CF2FFC11"
                //logs.sub_MenuType_Index
                //logs.sub_Menu_Id
                logs.sub_Menu_Name = "การมอบหมายงาน ตรวจนับ";
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

            var init = function () {
                $scope.click = 1;
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.dropdownUser();
                insertLogsUser();
                // $scope.taskfilter();
            };

            init();
        }
    })
})();