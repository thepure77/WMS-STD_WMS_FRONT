(function () {
    'use strict'

    app.component('assignJobGr', {
        controllerAs: '$vm',
        bindings: {
            isLoading: '=?',
            onShow: '=?',
        }, templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GR/AssignJob/assignJob.html";
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, assignJobGrFactory, webServiceAPI, logsFactory) {
            var $vm = this;
            var viewModel = assignJobGrFactory;
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
                    title: 'ยืนยันเอกสาร ?',
                    message: 'คุณต้องการมอบหมายงานใช่หรือไม่ !'
                }).then(function () {
                    model.create_By = localStorageService.get('userTokenStorage');
                    model.operations = "ASSIGN";
                    pageLoading.show();
                    viewModel.assign(model).then(
                        function success(res) {
                            if (res.data == "true") {
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: 'มอบหมายงานสำเร็จ'
                                    }
                                )
                                pageLoading.hide();
                                $scope.findTask = {};
                                $scope.findTask.listTaskViewModel = model.listGoodsReceiveViewModel
                                $scope.taskfilter($scope.findTask);
                                $scope.filterModel = {};
                            }
                            else {
                                pageLoading.hide();
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: res.data
                                    }
                                )
                                $scope.findTask = {};
                                $scope.filterModel = {};
                            }
                        },
                        function error(response) {
                            pageLoading.hide();
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'ไม่สามารถมอบหมายงานได้'
                                }
                            )
                            $scope.findTask = {};
                            $scope.filterModel = {};
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

                for (var i = 0; i <= dataList.length - 1; i++) {
                    if ($scope.taskfilterModel[i].selected && $scope.taskfilterModel[i].dropdownUser.model == undefined) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Close Document',
                            message: 'กรุณาเลือกUser ที่การ Assign!!'
                        });
                        return;
                    }
                    else if ($scope.taskfilterModel[i].selected && $scope.taskfilterModel[i].dropdownUser.model != null) {
                        $scope.taskfilterModel[i].userAssign = $scope.taskfilterModel[i].dropdownUser.model.user_Name;
                    }

                    $scope.taskfilterModel[i].update_By = $scope.userName;
                }

                $scope.ItemModel = {};
                $scope.ItemModel.listTaskViewModel = $scope.taskfilterModel;
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
                        title: 'แจ้งเตือน',
                        message: 'กรุณาเลือกข้อมูล !!'
                    });
                    return;
                }
                else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'แจ้งเตือน',
                        message: 'คุณต้องการยืนยันใช่หรือไม่'
                    }).then(function () {
                        pageLoading.show();
                        confirmTask($scope.ItemModel).then(function success(res) {
                            pageLoading.hide();
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'แจ้งเตือน.',
                                message: "ยืนยันสำเร็จ"
                            })
                            $scope.taskfilterModel = {};
                            // angular.forEach($scope.taskfilterModel, function (v, k) {
                            //     $scope.taskfilterModel[k].selected = false;
                            // });
                        }, function error(ex) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: ex
                            })
                        });
                    });
                }
                defer.resolve();
            }

            function confirmTask(item) {
                let deferred = $q.defer();
                item.operations = "CONFIRM";
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
                GoodsReceive_No: "AssignJob/autoGoodTaskGRNo",
            };

            $scope.url = {
                GR: webServiceAPI.GR,
            };

            $scope.dropdownUser = function () {
                viewModel.dropdownUser($scope.filterModel).then(function (res) {
                    $scope.dropdownUser = res.data;
                });
            };

            $scope.popupGoodsReceive = {
                onShow: false,
                delegates: {},
                onClick: function (param) {
                    $scope.popupGoodsReceive.onShow = !$scope.popupGoodsReceive.onShow;
                    $scope.popupGoodsReceive.delegates.goodReceivePopup(param);
                },
                config: {
                    title: "goodReceivePopup"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.listGoodsReceiveViewModel = $scope.filterModel.listGoodsReceiveViewModel || []
                        $scope.filterModel.listGoodsReceiveViewModel = param;

                        let dataList = $scope.filterModel.listGoodsReceiveViewModel;
                    
                    for (var i = 0; i <= dataList.length - 1; i++) {
                        $scope.filterModel.listGoodsReceiveViewModel[i].qty = parseFloat($scope.filterModel.listGoodsReceiveViewModel[i].qty);
                    }
                    }
                }
            };

            $scope.popupTaskGr = {
                onShow: false,
                delegates: {},
                onClick: function (param) {
                    $scope.popupTaskGr.onShow = !$scope.popupTaskGr.onShow;
                    $scope.popupTaskGr.delegates.taskGrPopup(param);
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
                logs.menu_Index = "AB361CA7-1431-4478-9BF1-11BF2A55693B";
                //logs.menuType_Index
                //logs.menu_Id
                logs.menu_Name = "จัดการสินค้า ขาเข้า";
                logs.sub_Menu_Index = "FB5BDD9B-DFB1-418E-9329-08387FF73F27"
                //logs.sub_MenuType_Index
                //logs.sub_Menu_Id
                logs.sub_Menu_Name = "การมอบหมายงาน";
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

            $scope.deleteTask = function (param) {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยัน',
                    message: 'คุณต้องการลบงานของใบเบิกสินค้าใช่หรือไม่ ?'
                }).then(function () {
                pageLoading.show();
                param.update_By = $scope.userName;
                viewModel.deleteTask(param).then(
                    function success(results) {
                        pageLoading.hide();
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'ALERT',
                            message: results.data.msg
                        })
                        $scope.taskfilter(param);
                    },
                    function error(response) {
                        pageLoading.hide();
                        dpMessageBox.alert({
                            title: 'Information.',
                            message: "Connect Service Fail."
                        })
                    });
                });
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