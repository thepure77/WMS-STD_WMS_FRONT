(function () {
    'use strict'

    app.component('assignJob', {
        controllerAs: '$vm',
        bindings: {
            isLoading: '=?',
            onShow: '=?',
        }, templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/AssignJob/assignJob.html";
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, assignJobFactory, webServiceAPI, logsFactory) {
            var $vm = this;
            var viewModel = assignJobFactory;
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
                    title: 'ยืนยัน',
                    message: 'คุณต้องการมอบหมายงานใช่หรือไม่'
                }).then(function () {
                    model.create_By = localStorageService.get('userTokenStorage');
                    model.operations = "ADD";
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
                                $scope.findTask.listTaskViewModel = model.listGoodsIssueViewModel
                                $scope.taskfilter($scope.findTask);
                                $scope.filterModel = {};
                            }
                            else {
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'Error',
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


            $scope.popupReport = {
                onShow: false,
                delegates: {},
                onClick: function (param) {
                    $scope.popupReport.onShow = !$scope.popupReport.onShow;
                    $scope.popupReport.delegates.reportPopup(param);
                },
                config: {
                    title: "ReportView"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                    }
                }
            };

            $scope.printPickingTag = function (param) {
                pageLoading.show();
                param.operations = "PRINT";
                viewModel.PrintPickingTag(param).then(
                    function success(results) {
                        pageLoading.hide();
                        $scope.popupReport.onClick(results);
                        deferred.resolve(results);
                    },
                    function error(response) {
                        pageLoading.hide();
                        dpMessageBox.alert({
                            title: 'Information.',
                            message: "Connect Service Fail."
                        })
                        deferred.reject(response);
                    });
            }
            $scope.printPickingTagV2 = function (param) {
                pageLoading.show();
                $scope.item = {};
                $scope.item.ListReport = [];
                $scope.item.ListReport.push(param);
                viewModel.PrintList($scope.item).then(
                    function success(results) {
                        pageLoading.hide();
                        $scope.popupReport.onClick(results);
                        deferred.resolve(results);
                    },
                    function error(response) {
                        pageLoading.hide();
                        dpMessageBox.alert({
                            title: 'Information.',
                            message: "Connect Service Fail."
                        })
                    });
            }

            $scope.printPick = function (param) {
                pageLoading.show();
                param.operations = "PRINT";
                viewModel.PrintPick(param).then(
                    function success(results) {
                        pageLoading.hide();
                        $scope.popupReport.onClick(results);
                        deferred.resolve(results);
                    },
                    function error(response) {
                        pageLoading.hide();
                        dpMessageBox.alert({
                            title: 'Information.',
                            message: "Connect Service Fail."
                        })
                        deferred.reject(response);
                    });
            }

            $scope.taskfilter = function (param) {
                viewModel.taskfilter(param).then(function (res) {
                    console.log(res.data)
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


            $scope.print = function () {
                pageLoading.show();
                var listPrint = $scope.taskfilterModel.filter(c => c.selected == true)
                if (listPrint.length <=0) {
                    return dpMessageBox.alert({
                        title: 'แจ้งเตือน',
                        message: "กรุณาเลือกข้อมูล"
                    })
                }
                $scope.item = {};
                $scope.item.ListReport = listPrint;
                viewModel.PrintList($scope.item).then(
                    function success(results) {
                        pageLoading.hide();
                        $scope.popupReport.onClick(results);
                        deferred.resolve(results);
                    },
                    function error(response) {
                        pageLoading.hide();
                        dpMessageBox.alert({
                            title: 'Information.',
                            message: "Connect Service Fail."
                        })
                    });
            }


            $scope.confirm = function () {
                let defer = $q.defer();
                let dataList = $scope.taskfilterModel;
                // for (var i = 0; i <= dataList.length - 1; i++) {
                //     if ($scope.taskfilterModel[i].selected && $scope.taskfilterModel[i].dropdownUser.model == undefined) {
                //         dpMessageBox.alert({
                //             ok: 'Close',
                //             title: 'Close Document',
                //             message: 'กรุณาเลือกUser ที่การ Assign!!'
                //         });
                //         return;
                //     }
                //     else if ($scope.taskfilterModel[i].selected && $scope.taskfilterModel[i].dropdownUser.model != null) {
                //         $scope.taskfilterModel[i].userAssign = $scope.taskfilterModel[i].dropdownUser.model.user_Name;
                //     }
                //     $scope.taskfilterModel[i].update_By = $scope.userName;
                // }
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
                        title: 'ยืนยัน',
                        message: 'คุณต้องการยืนยันการมอบหมายงานใช่หรือไม่ ?'
                    }).then(function () {
                        pageLoading.show();
                        confirmTask($scope.ItemModel).then(function success(res) {
                            pageLoading.hide();
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'ข้อมูล',
                                message: "ยืนยันสำเร็จ"
                            })
                            angular.forEach($scope.taskfilterModel, function (v, k) {
                                $scope.taskfilterModel[k].selected = false;
                            });
                            $scope.taskfilter($scope.taskfilterModel);
                        }, function error(ex) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'ข้อมูล',
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

            $scope.deleteTask = function (param) {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยัน',
                    message: 'คุณต้องการลบงานของใบเบิกสินค้าใช่หรือไม่ ?'
                }).then(function () {
                pageLoading.show();
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

            $scope.autoComplete = {
                GoodsIssue_No: "AssignJob/autoGoodIssueNo",
            };

            $scope.url = {
                GI: webServiceAPI.GI,
            };

            $scope.dropdownUser = function () {
                viewModel.dropdownUser($scope.filterModel).then(function (res) {
                    $scope.dropdownUser = res.data;
                });
            };


            $scope.popupGoodsIssue = {
                onShow: false,
                delegates: {},
                onClick: function (param) {
                    $scope.popupGoodsIssue.onShow = !$scope.popupGoodsIssue.onShow;
                    $scope.popupGoodsIssue.delegates.goodsIssuePopup(param);
                },
                config: {
                    title: "GoodsIssue"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.listGoodsIssueViewModel = $scope.filterModel.GoodsIssueViewModel || []
                        $scope.filterModel.listGoodsIssueViewModel = param;
                        console.log(param)
                    }
                }
            };

            $scope.popupTask = {
                onShow: false,
                delegates: {},
                onClick: function (param) {
                    $scope.popupTask.onShow = !$scope.popupTask.onShow;
                    $scope.popupTask.delegates.taskPopup(param);
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
                logs.menu_Index = "17573B0A-4042-45A5-9C01-69189E1966C4";
                //logs.menuType_Index
                //logs.menu_Id
                logs.menu_Name = "จัดการสินค้า ขาออก";
                logs.sub_Menu_Index = "C93733C5-7363-4F55-BDD7-B77846F2BA8C"
                //logs.sub_MenuType_Index
                //logs.sub_Menu_Id
                logs.sub_Menu_Name = "การมอบหมายงาน ขาออก";
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