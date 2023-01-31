'use strict'
app.component('giTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/GI/GI/component/giTableList.html";
    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, goodIssueFactory, goodsIssueItemFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = [];
        $scope.items = $scope.items || [];
        var viewModel = goodIssueFactory;
        // setting column
        $scope.showColumnSetting = false;

        $vm.$onInit = function () {
            $scope.userName = localStorageService.get('userTokenStorage');
        }

        $vm.triggerCreate = function () {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow().then(function (result) {
                    $vm.isFilter = true;

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
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        }


        var MessageBox = dpMessageBox;
        $scope.dragHead = '';
        $scope.dragImageId = "dragtable";
        $scope.revisionList = {};


        $scope.show = {
            action: true,
            pagination: true,
            checkBox: false
        }
        $scope.pageMode = 'Master';

        var init = function () {
            if ($scope.config.pageMode == "Search") {
                $scope.pageMode = "Search";
            }
        }


        $scope.toggleSetting = function () {
            $scope.showColumnSetting = $scope.showColumnSetting === false ? true : false;
        };




        function isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }


        $scope.ConfirmMarshall = function (param) {
            MessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'Confirm.',
                message: 'Do You Want to ConfirmMarshall ?'
            }).then(function success() {
                var item = angular.copy($vm.searchResultModel);
                var models = [];

                angular.forEach(item, function (v, k) {
                    if (v.selected) {
                        models.push(v);

                    }
                });
                confirm(models);
            });
        }



        $scope.undo = function (param) {
            // if (param.documentStatus == 0)
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'Undo',
                message: 'Do you want to Undo ?'
            }).then(function success() {
                viewModel.Undo(param.goodsIssueIndex).then(function success(res) {
                    if (res.data.length == 0) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "มีการ Pick แล้ว ไม่สามารถ Undo ได้"
                        })
                        $vm.triggerSearch();
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "Undo success "
                        })
                        $vm.triggerSearch();

                    }
                }, function error(res) { });
            });
            // else
            //     dpMessageBox.alert({
            //         ok: 'Yes',
            //         title: 'Undo',
            //         message: 'Error !!!'
            //     })
        };


        $scope.cancel = function (param) {
            // if (param.documentStatus == 0)
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'Cancel',
                message: 'Do you want to Cancel ?'
            }).then(function success() {
                viewModel.Cancel(param.goodsIssueIndex, $scope.userName).then(function success(res) {
                    if (res.data == "true") {
                        dpMessageBox.alert({
                            ok: 'Yes',
                            title: 'Cancel',
                            message: ' Cancel Success'
                        })
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'Yes',
                            title: 'Cancel',
                            message: res.data
                        })
                    }
                    $vm.triggerSearch();
                }, function error(res) { });
            });
            // else
            //     dpMessageBox.alert({
            //         ok: 'Yes',
            //         title: 'Cancel',
            //         message: 'Error !!!'
            //     })
        };

        $scope.comfirm = function (param) {
            // param.CreateBy = $scope.filterModel.CreateBy;
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'Comfirm',
                message: 'Do you want to comfirm ?'
            }).then(function success() {
                viewModel.confirm(param).then(function success(res) {
                    $vm.triggerSearch();

                }, function error(res) { });
            });

        };

        function validate(param) {
            var msg = "";
            return msg;
        }

        $scope.popupReport = {
            onShow: false,
            delegates: {},
            onClick: function (param) {
                $scope.popupReport.onShow = !$scope.popupReport.onShow;
                $scope.popupReport.delegates.reportPopup(param.pickTicketNo, "pickingslip");
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
            currentPage: $vm.filterModel.currentPage + 1,
            numPerPage: $vm.filterModel.numPerPage,
            totalRow: 0
        };
        $scope.pageOption = [{
            'value': 30
        }, {
            'value': 50
        },
        {
            'value': 100
        },
        {
            'value': 500
        },
        ];
        $scope.changePage = function () {
            $vm.filterModel.planGoodsIssueIndex = ($vm.filterModel.planGoodsIssueNo === undefined || $vm.filterModel.planGoodsIssueNo == "") ? $vm.filterModel.planGoodsIssueIndex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.planGoodsIssueIndex;
            $vm.filterModel.documentTypeIndex = ($vm.filterModel.documentTypeName === undefined || $vm.filterModel.documentTypeName == "") ? $vm.filterModel.documentTypeIndex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.documentTypeIndex;
            $vm.filterModel.ownerIndex = ($vm.filterModel.ownerName === undefined || $vm.filterModel.ownerName == "") ? $vm.filterModel.ownerIndex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.ownerIndex;
            $vm.filterModel.processStatusIndex = ($vm.filterModel.processStatusName === undefined || $vm.filterModel.processStatusName == "") ? $vm.filterModel.processStatusIndex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.processStatusIndex;
            $vm.filterModel.warehouseIndex = ($vm.filterModel.warehouseName === undefined || $vm.filterModel.warehouseName == "") ? $vm.filterModel.warehouseIndex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.warehouseIndex;
            $vm.filterModel.warehouseIndexTo = ($vm.filterModel.warehouseNameTo === undefined || $vm.filterModel.warehouseNameTo == "") ? $vm.filterModel.warehouseIndexTo = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.warehouseIndexTo;
            $vm.filterModel.documentStatus = ($vm.filterModel.processStatusName === undefined || $vm.filterModel.processStatusName == "") ? $vm.filterModel.delegates = null : $vm.filterModel.documentStatus;
            $vm.filterModel.shipToIndex = ($vm.filterModel.shipToName === undefined || $vm.filterModel.shipToName == "") ? $vm.filterModel.shipToIndex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.shipToIndex;
            $vm.filterModel.warehouseIndexTo = ($vm.filterModel.warehouseNameTo === undefined || $vm.filterModel.warehouseNameTo == "") ? $vm.filterModel.warehouseIndexTo = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.warehouseIndexTo;
            $vm.filterModel.roundIndex = ($vm.filterModel.roundName === undefined || $vm.filterModel.roundName == "") ? $vm.filterModel.roundIndex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.roundIndex;
            $vm.filterModel.routeIndex = ($vm.filterModel.routeName === undefined || $vm.filterModel.routeName == "") ? $vm.filterModel.routeIndex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.routeIndex;
            $vm.filterModel.productIndex = ($vm.filterModel.productName === undefined || $vm.filterModel.productName == "") ? $vm.filterModel.productIndex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.productIndex;
            $vm.filterModel.zoneIndex = ($vm.filterModel.zoneName === undefined || $vm.filterModel.zoneName == "") ? $vm.filterModel.zoneIndex = '00000000-0000-0000-0000-000000000000' : $vm.filterModel.zoneIndex;
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

        $scope.changeTableSize = function () {

            let ChangeTable = 1;
            if ($scope.model.numPerPage == undefined) {
                $scope.model.numPerPage = $vm.filterModel.perPage;
            }
            // var p = {
            //     currentPage: ChangeTable,
            //     numPerPage: $vm.filterModel.perPage
            // };

            var p = $vm.filterModel;

            serchPage(p);
        }

        $vm.filterModel = {
            num: 1,
            totalRow: 0,
            currentPage: 1,
            maxSize: 10,
            perPage: $vm.filterModel.perPage,
        };
        function serchPage(data) {
            if (data != null) {
                pageLoading.show();
                viewModel.giSearch(data).then(function (res) {

                    pageLoading.hide();
                    if (res.data.length != 0 && res.data.length != undefined) {
                        $vm.filterModel.totalRow = res.data[0].count;
                        $vm.searchResultModel = res.data;

                    }
                    else {
                        if (res.data.pagination != null) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                            $vm.filterModel.currentPage = res.data.pagination.currentPage;
                            $vm.searchResultModel = res.data.items;

                        }
                    }
                })
            }
        }
        var initForm = function () {
        };
        var init = function () {
            // $scope.filterModel.CreateBy = localStorageService.get('userTokenStorage');

            //initForm();
            //loadConfig();
            //$scope.listviewFunc.filter();
            // example data
        };
        init();

    }
});