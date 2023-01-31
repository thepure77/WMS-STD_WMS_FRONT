'use strict'
app.component('bookingGateDockCheckOutTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window) {
        return "modules/yardDock/bookingGateDockCheckOut/component/bookingGateDockCheckOutTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, localStorageService, dpMessageBox, bookingGateDockCheckInFactory) {
        var $vm = this;
        $scope.items = [];
        $scope.items = $scope.items || [];
        var viewModel = bookingGateDockCheckInFactory;
        // setting column
        $scope.showColumnSetting = false;
        $scope.maxSize = 5;

        $scope.expanded = false;

        $vm.triggerCreate = function (param, action) {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow(param, action).then(function (result) {
                    $vm.isFilter = true;
                    $vm.triggerSearch();
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        };
        $scope.checkedScan = function (param, action) {
            debugger
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow(param, action).then(function (result) {
                    $vm.isFilter = true;
                    $vm.triggerSearch();
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        }
        $scope.show = {
            pagination: true,
        }
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
                $scope.colortab1 = "#0088cc";
                $scope.colortab2 = "#FFFFFF";

                $scope.fronttab1 = "#FFFFFF";
                $scope.fronttab2 = "#0088cc";

            }
            else if (tab == 2) {
                $scope.colortab1 = "#FFFFFF";
                $scope.colortab2 = "#0088cc";

                $scope.fronttab1 = "#0088cc";
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
                            $vm.searchResultModel = res.data.itemsWorkArea;

                        }
                    }
                })
            }
        }
        $scope.selectItem = function (statusid, index, checked, datarow, tab) {
            $scope.userSelected[index] = {};
            $scope.userSelected[index].index = index;
            if (statusid == 0 || statusid == 2) {
                checked = 'noCheck';
            }
            else {
                $scope.userSelected[index].checked = checked;
                $scope.collapseLiner(datarow.appointmentItem_Index, datarow);
            }

            $scope.userSelected[index].datarow = datarow;

            // if (checked == "checking") {
            //     $scope.userSelected[index].datarow.inserted = 1
            //     $scope.collapseLiner(datarow.appointmentItem_Index, datarow);
            // }
            // else {
            //     $scope.userSelected[index].datarow.inserted = 0
            // }
        }
        $vm.triggerInit = function () {
            var container = $("collapse-popup");
            $('#temp-container').append(container);
            $scope.container = container;
            $scope.isShowTemp = false;
        };

      
        $scope.sentItems = function (param) {
            if (param != undefined) {
                
            }
            else {
                
            }

        }
        $scope.userSelected = [];
        $scope.collapseLiner = function (targetKey, param) {
            var checkItem = $vm.searchResultModel;
            $('#temp-container').append($('collapse-popup'));
            angular.forEach(checkItem, function (value, key) {
                if (value.appointmentItem_Index != targetKey) {
                    value.isCilcked = 0;
                    $vm.searchResultModel[key].expanded = false;
                    $vm.searchResultModel[key].isCollaspe = false;
                }
                else if (value.appointmentItem_Index == targetKey) {
                    if (value.isCilcked == 1) {
                        $vm.searchResultModel[key].expanded = false;
                        $vm.searchResultModel[key].isCollaspe = false;
                        $scope.isShowTemp = false;
                        value.isCilcked = 0;
                    }
                    else {
                        value.isCilcked = 1;
                        $vm.searchResultModel[key].expanded = true;
                        $vm.searchResultModel[key].isCollaspe = true;
                        $('#' + targetKey).append($('collapse-popup'))
                    }

                }
            })
            if ($scope.isShowTemp == false) {
                $scope.showContainerDesc(param).then(function success(res) {
                    $scope.isShowTemp = false;
                });
            }
            else {
                $scope.showContainerDesc(param).then(function success(res) {
                    $scope.isShowTemp = true;
                });
            }
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
            var checkLanguage = checkedlang()
            var messagebox = {}

            if (checkLanguage.name == 'TH') {
                messagebox.text = 'คุณต้องการลบข้อมูลใช่หรือไม่'
                messagebox.success = 'ลบข้อมูลเสร็จสิ้น'
                messagebox.alert = 'แจ้งเตือน'
                messagebox.success = 'เสร็จสิ้น'
            }
            else {
                messagebox.text = 'Do you want to Delete ?'
                messagebox.success = 'Delete Success'
                messagebox.alert = 'Information'
                messagebox.success = 'Success'
            }
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: messagebox.alert,
                message: messagebox.text
            }).then(function success() {
                viewModel.getDelete(param).then(function success(res) {
                    if (res.data == true) {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: messagebox.success,
                                message: messagebox.success
                            }
                        )
                    }
                    $vm.triggerSearch();
                }, function error(res) { });
            });
        };
        $scope.cancel = function (param) {
            $scope.model = param;
            $scope.model.Cancel_By = localStorageService.get('userTokenStorage');
            viewModel.cancel($scope.model).then(function success(res) {
                $vm.triggerSearch();
            }, function error(res) { });
        };
        var init = function () {
            // $vm.triggerSearch();
            $scope.filterModel = {};
        };
        init();

    }
});