'use strict'
app.component('bkYardDockTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window) {
        return "modules/yardDock/bookingYardDock/component/bkYardDockTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, localStorageService, dpMessageBox, bkYardDockFactory, purchaseOrderItemFactory) {
        var $vm = this;
        var Progressbar = pageLoading;
        $scope.items = [];
        $scope.items = $scope.items || [];
        var viewModel = bkYardDockFactory;
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

        $scope.clickTab = function (tab) {
            $scope.click = tab;
        }

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
                    
                    $scope.SaveReAssign(param)
                }
            }
        };

        $scope.SaveReAssign = function (param) {
            pageLoading.show();

            param.create_By = localStorageService.get("userTokenStorage");

            viewModel.SaveAppointment_ReAssign(param).then(function (res) {
                if(res.data.resultIsUse){
                    dpMessageBox.alert({
                        ok: "Close",
                        title: "Alert",
                        message: "Success",
                      }); 
                }else{
                    dpMessageBox.alert({
                        ok: "Close",
                        title: "Alert",
                        message: res.data.resultMsg,
                      }); 
                }
                
            });
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

        $scope.printOutAppointment = function (param) {
            pageLoading.show();
            param.operations = "PRINT";

            var checkLanguage = checkedlang()
            var messagebox = {}

            if (checkLanguage.name == 'TH') {
                messagebox.text = 'ยังไม่ได้ยืนยันเอกสาร'
                messagebox.success = 'ไม่สามารถเชื่อมต่อกับระบบได้'
                messagebox.alert = 'แจ้งเตือน'
            }
            else {
                messagebox.text = 'Please accept Document !'
                messagebox.success = 'Connect Service Fail'
                messagebox.alert = 'Information'
            }

            viewModel.PrintOutAppointment(param).then(
                function success(results) {
                    pageLoading.hide();
                    $scope.popupReport.onClick(results);
                    deferred.resolve(results);
                },
                function error(response) {
                    pageLoading.hide();
                    dpMessageBox.alert({
                        title: messagebox.alert,
                        message: messagebox.success
                    })
                    deferred.reject(response);
                });
        }

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
            criteria.appointment_Index = param.appointment_Index
            criteria.Create_By = localStorageService.get('userTokenStorage');
            var checkLanguage = checkedlang()
            var messagebox = {}

            if (checkLanguage.name == 'TH') {
                messagebox.text = 'คุณต้องการยืนยันข้อมูลใช่หรือไม่'
                messagebox.success = 'ยืนยันเสร็จสิ้น'
                messagebox.fail = 'ไม่สามารถ ยืนยันได้ ข้อมูลการจองยังไม่ครบถ้วน'
                messagebox.alert = 'แจ้งเตือน'
            }
            else {
                messagebox.text = 'Do you want to Approve ?'
                messagebox.success = 'Approve Success'
                messagebox.fail = 'Please Fill information in BookingOrder '
                messagebox.alert = 'Information'
            }
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: messagebox.alert,
                message: messagebox.text
            }).then(function success() {
                // viewModel.getId(param.ref_Document_No).then(function (res) {
                //     
                //     $scope.filterModel = res.data;
                //     $scope.filterModel.from = 'Yard';
                //     $scope.filterModel.appointment_Index = param.appointment_Index;
                //     $scope.filterModel.appointment_Date = getdate(param.appointment_Date)
                //     viewModel.GetByPurchaseOrderItemId($scope.filterModel.purchaseOrder_Index).then(function (res) {
                //         $scope.filterModel.listPlanGoodsReceiveItemViewModel = res.data;
                //     });
                //     viewModel.setParam($scope.filterModel);
                //     $state.go('wms.plan_form');
                // });               
                viewModel.getApprove(criteria).then(function success(res) {
                    if (res.data == true) {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: messagebox.alert,
                                message: messagebox.success
                            }
                        )
                    } else {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: messagebox.alert,
                                message: messagebox.fail
                            }
                        )
                    }
                    $vm.triggerSearch();
                }, function error(res) {

                });
            });
        }

        function getdate(param) {

            var all = param.split('T');
            var makenew = all[0].split('-');

            return makenew[0] + makenew[1] + makenew[2];
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
            $scope.click = 1;
        };
        init();

    }
});