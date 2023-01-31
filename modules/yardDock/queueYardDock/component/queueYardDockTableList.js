'use strict'
app.component('queueYardDockTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window) {
        return "modules/yardDock/queueYardDock/component/queueYardDockTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, localStorageService, dpMessageBox, queueYardDockFactory) {
        var $vm = this;
        var Progressbar = pageLoading;
        $scope.items = [];
        $scope.items = $scope.items || [];
        var viewModel = queueYardDockFactory;
        // setting column
        $scope.showColumnSetting = false;
        $scope.maxSize = 5;
        $vm.triggerCreate = function () {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow().then(function (result) {
                    $vm.isFilter = true;
                    $vm.triggerSearch();
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        };
        $scope.editItem = function (param) {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow(param).then(function (result) {
                    $vm.isFilter = true;
                    $vm.triggerSearch();
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        }

        $scope.clickTab = function (tab) {
            $scope.click = tab;
        }

        $scope.print = function (param) {
            // var sentItem = {};
            // sentItem = param
            // $scope.popupReport.onClick(param);
            var sentItem = {};
            $scope.itemModels.onShow = !$scope.itemModels.onShow;
            $scope.receivefromEdit = param;

            if ($scope.itemModels.delegates.set) {
                $scope.itemModels.delegates.set(param);

            }
        }
        $scope.show = {
            pagination: true,
        }
        $scope.itemModels = {
            onShow: false,
            config: {
                title: "Print"
            },
            invokes: {
                set: function (param, indexHeader) {
                },
                add: function (param) {
                    $scope.itemModels.onShow = !$scope.itemModels.onShow;
                    $scope.criteria = {};
                    $scope.criteria = param;
                    $scope.SaveItem($scope.criteria)
                    // $scope.next();
                },
            }
        }

        $scope.printOutQ = function (param) {
            $scope.reportmodel ={};
            $scope.reportmodel = angular.copy(param);
            $scope.reportmodel.status =null;
            $scope.reportmodel.appointment_Time = null;
            var deferred = $q.defer();
            pageLoading.show();
            param.operations = "PRINT";
            viewModel.printOutQ($scope.reportmodel).then(
                function success(results) {
                    pageLoading.hide();

                    
                    $scope.popupReport.onClick(results);

                    // deferred.resolve(results);
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


        // $scope.printOutQ = function (param) {
        //     
        //     $scope.reportmodel ={};
        //     $scope.reportmodel = param
        //     $scope.reportmodel.appointment_Time = null
        //     pageLoading.show();
        //     param.operations = "PRINT";

        //     var checkLanguage = checkedlang()
        //     var messagebox = {}

        //     if (checkLanguage.name == 'TH') {
        //         messagebox.text = 'ยังไม่ได้ยืนยันเอกสาร'
        //         messagebox.success = 'ไม่สามารถเชื่อมต่อกับระบบได้'
        //         messagebox.alert = 'แจ้งเตือน'
        //     }
        //     else {
        //         messagebox.text = 'Please accept Document !'
        //         messagebox.success = 'Connect Service Fail'
        //         messagebox.alert = 'Information'
        //     }

        //     viewModel.printOutQ($scope.reportmodel).then(
        //         function success(results) {
        //             pageLoading.hide();
        //             
        //             $scope.popupReport.onClick(results);
        //             
        //             deferred.resolve(results);
        //         },
        //         function error(response) {
        //             pageLoading.hide();
        //             dpMessageBox.alert({
        //                 title: 'Information.',
        //                 message: "Connect Service Fail."
        //             })
        //             deferred.reject(response);
        //         });
        // }
        
        $scope.masterRequirePopup = {
            onShow: false,
            delegates: {},
            onClick: function (param) {
                $scope.masterRequirePopup.onShow = !$scope.masterRequirePopup.onShow;
                $scope.masterRequirePopup.delegates(param);
            },
            config: {
                title: ""
            },
            invokes: {
                add: function (param) { },
                edit: function (param) { },
                selected: function (param) {
                    $scope.approve(param);
                    // 
                    // $scope.filterModel.mFG_Date = angular.copy(param.mFG_Date)
                    // $scope.filterModel.eXP_Date = angular.copy(param.eXP_Date)
                    // $scope.filterModel.product_Lot = angular.copy(param.lot)
                }
            }
        };

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


        $scope.model = {
            currentPage: 1,
            numPerPage: 30,
            totalRow: 0,
        };

        $scope.changePage = function () {
            var page = $vm.filterModel;
            var all = {
                currentPage: 0,
                numPerPage: 0
            };
            if ($vm.filterModel.currentPage != 0) {
                page.currentPage = page.currentPage;
            }
            serchPage(page);
        }
        $scope.changeTableSize = function (perPage, tab) {

            if (tab == 1) {
                $scope.colortab1 = "#ec7229";
                $scope.colortab2 = "#FFFFFF";

                $scope.fronttab1 = "#FFFFFF";
                $scope.fronttab2 = "#ec7229";

            }
            else if (tab == 2) {
                $scope.colortab1 = "#FFFFFF";
                $scope.colortab2 = "#ec7229";

                $scope.fronttab1 = "#ec7229";
                $scope.fronttab2 = "#FFFFFF";
            }

            $scope.selected = tab;

            let ChangeTable = 1;
            $scope.model = $vm.filterModel;
            if (perPage != null || perPage != undefined) {
                $scope.model.perPage = perPage;
            }

            var p = $scope.model;

            serchPage(p);
        }

        function checkedlang() {
            $scope.switLang = {}
            if ($window.localStorage['LANGUAGE'] == "th") {
                $scope.switLang.name = 'TH'
            } else {
                $scope.switLang.name = 'EN'
            }
            return $scope.switLang;
        }

        // $scope.printOutAppointment = function (param) {
        //     pageLoading.show();
        //     $scope.reportmodel ={};
        //     $scope.reportmodel = param
        //     $scope.reportmodel.appointment_Time = null
        //     param.operations = "PRINT";

        //     var checkLanguage = checkedlang()
        //     var messagebox = {}

        //     if (checkLanguage.name == 'TH') {
        //         messagebox.text = 'ยังไม่ได้ยืนยันเอกสาร'
        //         messagebox.success = 'ไม่สามารถเชื่อมต่อกับระบบได้'
        //         messagebox.alert = 'แจ้งเตือน'
        //     }
        //     else {
        //         messagebox.text = 'Please accept Document !'
        //         messagebox.success = 'Connect Service Fail'
        //         messagebox.alert = 'Information'
        //     }

        //     viewModel.printOutQ($scope.reportmodel).then(
        //         function success(results) {
        //             pageLoading.hide();
        //             $scope.popupReport.onClick(results);
        //             deferred.resolve(results);
        //         },
        //         function error(response) {
        //             pageLoading.hide();
        //             dpMessageBox.alert({
        //                 title: messagebox.alert,
        //                 message: messagebox.success
        //             })
        //             deferred.reject(response);
        //         });
        // }

        function serchPage(data) {

            if (data != null) {

                pageLoading.show();
                viewModel.filter(data).then(function (res) {
                    pageLoading.hide();
                    if (res.data.length != 0 && res.data.length != undefined) {
                        $vm.filterModel.totalRow = res.data[0].count;
                        $vm.searchResultModel = res.data;

                    }
                    else {
                        if (res.data.pagination != null) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                            $vm.filterModel.perPage = res.data.pagination.perPage;
                            $vm.filterModel.currentPage = res.data.pagination.currentPage;
                            $vm.searchResultModel = res.data.itemsItemStatus;

                        }
                    }
                })
            }
        }
        $vm.searchResultModel = []
        $scope.approve = function (param) {
            var criteria = {};
            debugger
            // criteria.appointment_Index = param.appointment_Index
            // criteria.dock_Name = param.dock_Name_to;
            criteria.Create_By = localStorageService.get('userTokenStorage');
            var checkLanguage = checkedlang()
            var messagebox = {}

            if (checkLanguage.name == 'TH') {
                messagebox.text = 'คุณต้องการจะเรียกคิวใช่หรือไม่'
                messagebox.success = 'ทำการเรียกรถแล้ว'
                messagebox.fail = 'ไม่สามารถ ยืนยันได้'
                messagebox.alert = 'แจ้งเตือน'
            }
            else {
                messagebox.text = 'คุณต้องการจะเรียกคิวใช่หรือไม่'
                messagebox.success = 'ทำการเรียกรถแล้ว'
                messagebox.fail = 'ไม่สามารถ ยืนยันได้'
                messagebox.alert = 'Information'
            }
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: messagebox.alert,
                message: messagebox.text
            }).then(function success() {
                viewModel.getApprove(param).then(function success(res) {
                    if (res.data == "S") {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: messagebox.alert,
                                message: messagebox.success
                            }
                        )
                    }else{
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: messagebox.alert,
                                message: res.data
                            }
                        )
                    }
                    $vm.triggerSearch();
                }, function error(res) { 

                });
            });
        }

        function checkedlang() {
            $scope.switLang = {}
            if ($window.localStorage['LANGUAGE'] == "th") {
                $scope.switLang.name = 'TH'
            } else {
                $scope.switLang.name = 'EN'
            }
            return $scope.switLang;
        }

        $scope.delete = function (param) {
            var criteria = {};
            criteria.appointment_Index = param.appointment_Index
            criteria.isRemove = true;
            var checkLanguage = checkedlang()
            var messagebox = {}

            if (checkLanguage.name == 'TH') {
                messagebox.text = 'คุณต้องการลบข้อมูลใช่หรือไม่'
                messagebox.success = 'ลบข้อมูลสำเร็จ'
                messagebox.alert = 'แจ้งเตือน'
            }
            else {
                messagebox.text = 'Do you want to Delete ?'
                messagebox.success = 'Delete Success'
                messagebox.alert = 'Information'
            }
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: messagebox.alert,
                message: messagebox.text
            }).then(function success() {
                viewModel.getDelete(criteria).then(function success(res) {
                    if (res.data == "") {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: messagebox.alert,
                                message: messagebox.success
                            }
                        )
                    }
                    $vm.triggerSearch();
                }, function error(res) {

                });
            });
        };
        var init = function () {
            // $vm.triggerSearch();
            $scope.filterModel = {};
            $scope.click=1;
        };
        init();

    }
});