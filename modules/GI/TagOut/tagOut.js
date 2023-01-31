(function () {
    'use strict'

    app.component('tagOut', {
        controllerAs: '$vm',
        bindings: {
            isLoading: '=?',
            onShow: '=?',
        }, templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/TagOut/tagOut.html";
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, tagOutFactory, webServiceAPI, logsFactory) {
            var $vm = this;
            var viewModel = tagOutFactory;
            $vm.isFilterTable = true;
            $scope.onShow = false;

            $scope.isFilter = true;
            $scope.filterModel = {};

            $scope.clickTab = function (tab) {
                $scope.click = tab;
            }

            $scope.filterSearch = function (param) {
                $scope.isCartonFlowRack = false;
                pageLoading.show();
                viewModel.tagOutfilter(param).then(function (res) {
                    pageLoading.hide();
                    console.log(res.data)
                    debugger
                    $scope.filterModel.tagOutList = {};
                    $scope.filterModel.tagOutList = res.data;
                    if ($scope.filterModel.tagOutList[0].locationType == 'CartonFlowRack') {
                        $scope.isCartonFlowRack = true;
                    }
                });
            };

            $scope.printtote = function (param) {
                debugger
                var validateChk = "";
                for (let index = 0; index < $scope.filterModel.tagOutList.length; index++) {
                    if ($scope.filterModel.tagOutList[index].selected) {
                        validateChk = validateChk + ' ' + $scope.filterModel.tagOutList[index].tag_No;
                    }
                }

                if (validateChk == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณาเลือกเลขที่พาเลท'
                    });
                    return;
                } else {
                    pageLoading.show();
                    $scope.userNametote = localStorageService.get('userTokenStorage');
                    var modelTagP = $scope.filterModel.tagOutList.filter(c => c.selected == true)
                    $scope.tagModel = $scope.tagModel || {};
                    $scope.tagModel.listtagoutViewModel = modelTagP;
                    param.operations = "PRINT";
                    $scope.tagModel.create_By = $scope.userNametote;
                    viewModel.printtote($scope.tagModel).then(
                        function success(results) {
                            pageLoading.hide();
                            if (results.data.resultIsUse) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'ส่งคำสั่งสำเร็จ'
                                });
                            }
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
            };

            $scope.createtagout = function () {
                debugger
                if ($scope.filterModel.GoodsIssue_No == "" || $scope.filterModel.GoodsIssue_No == undefined || $scope.filterModel.tagOutList == undefined) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณากรอก GI No'
                    });
                    return;
                }
                var sentItem = {};
                $scope.itemModels.onShow = !$scope.itemModels.onShow;
                if ($scope.itemModels.delegates.set) {
                    sentItem.status = "NEW"
                    $scope.itemModels.delegates.set(sentItem);
                }
            }

            $scope.models = {}
            $scope.itemModels = {
                onShow: false,
                config: {
                    title: "Route"
                },
                invokes: {
                    set: function (param, indexHeader) {
                    },
                    add: function (param) {
                        $scope.itemModels.onShow = !$scope.itemModels.onShow;
                        param.status = "NEW"
                        $scope.SaveData(param);
                    },
                }
            }

            $scope.deleteItem = function (param, index) {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'ยืนยัน',
                    message: 'คุณต้องการยืนยันการลบใช่หรือไม่ ?'
                }).then(function () {
                    pageLoading.show();
                    viewModel.Deletetag(param).then(function (res) {
                        if (res.data.resultIsUse) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'Success',
                                    message: 'Success'
                                }
                            )
                            $scope.fill = {};
                            $scope.fill.GoodsIssue_Index = $scope.filterModel.GoodsIssue_Index;
                            $scope.fill.GoodsIssue_No = $scope.filterModel.GoodsIssue_No;
                            $scope.fill.tagOut_No = $scope.filterModel.tagOut_No;
                            $scope.filterSearch($scope.fill);
                        } else {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'Success',
                                    message: res.data
                                }
                            )
                        }

                    }, function error(res) {
                        $scope.response = "M_ERROR";
                        if (res.Message.data != null) {
                            $scope.message = res.Message.data.Message;
                        }
                        else {
                            $scope.message = messagebox.error;
                        }
                    })
                });
            }

            $scope.SaveData = function (param) {
                var sentData = param;
                param.GoodsIssue_No = $scope.filterModel.GoodsIssue_No;
                debugger
                param.Create_By = localStorageService.get('userTokenStorage');
                viewModel.Savetag(param).then(function (res) {
                    if (res.data != undefined) {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Success',
                                message: res.data
                            }
                        )
                    }
                    $vm.triggerSearch();

                }, function error(res) {
                    $scope.response = "M_ERROR";
                    if (res.Message.data != null) {
                        $scope.message = res.Message.data.Message;
                    }
                    else {
                        $scope.message = messagebox.error;
                    }
                })
            }

            $scope.ReportTagout = function (param) {
                var validateChk = "";
                debugger
                for (let index = 0; index < $scope.filterModel.tagOutList.length; index++) {
                    if ($scope.filterModel.tagOutList[index].selected) {
                        validateChk = validateChk + ' ' + $scope.filterModel.tagOutList[index].tag_No;
                    }
                }

                if (validateChk == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณาเลือกเลขที่พาเลท'
                    });
                    return;
                } else {
                    pageLoading.show();
                    debugger
                    var modelTagP = $scope.filterModel.tagOutList.filter(c => c.selected == true)
                    $scope.tagModel = $scope.tagModel || {};
                    $scope.tagModel.listtagoutViewModel = modelTagP;
                    param.operations = "PRINT";
                    viewModel.ReportTagout($scope.tagModel).then(
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
            }

            $scope.detectCheckAll = function (c) {
                if (c === true) {
                    angular.forEach($scope.filterModel.tagOutList, function (v, k) {
                        $scope.filterModel.tagOutList[k].selected = true;
                    });
                } else {
                    angular.forEach($scope.filterModel.tagOutList, function (v, k) {
                        $scope.filterModel.tagOutList[k].selected = false;
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

            $scope.confirm = function () {
                let defer = $q.defer();
                let dataList = $scope.taskfilterModel;
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

            $scope.autoComplete = {
                GoodsIssue_No: "TagOut/autoGoodIssueNo",
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

            function insertLogsUser() {
                var userLogin = JSON.parse(localStorage.userlogin);
                var logs = {};
                logs.userGroup_Name = localStorage['userGroupName'];
                logs.user_Index = userLogin.user_Index;
                logs.user_Id = userLogin.user_Id;
                logs.user_Name = userLogin.user_Name;
                logs.first_Name = userLogin.first_Name;
                logs.last_Name = userLogin.last_Name;
                logs.menu_Index = "17573B0A-4042-45A5-9C01-69189E1966C4";
                logs.menu_Name = "จัดการสินค้า ขาออก";
                logs.sub_Menu_Index = "C93733C5-7363-4F55-BDD7-B77846F2BA8C"
                logs.sub_Menu_Name = "การมอบหมายงาน ขาออก";
                logsFactory.SaveLogs(logs).then(function (res) {

                })
            };

            var init = function () {
                $scope.click = 1;
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.dropdownUser();
                insertLogsUser();
            };

            init();
        }
    })
})();