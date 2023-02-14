'use strict'
app.component('packTaskTranferSummary', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/Tranfer_Unpack_Pack/PackTranfer/component/packTaskTranferSummary.html";

    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',
        searchDataRow: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, packTranferFactory, webServiceAPI, logsFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = $scope.items || [];
        var viewModel = packTranferFactory;
        var item = $vm.searchResultModel;
        $scope.showColumnSetting = false;
        $scope.maxSize = 5;
        $scope.filterModel = {};
        $vm.isFilter = true;

        $scope.filterTask = function (param) {
            $scope.filterModel.username = $scope.userName;
            if (param != undefined) {
                $scope.filterModel.key = param.key;

            }

            viewModel.filterTaskUnpack($scope.filterModel).then(function (res) {
                $scope.searchResultModel = res.data;
            });
        }


        $scope.select = function (param) {
            let data = $scope.searchResultModel.find(c => c.isUser);
            if (data) {
                data.isUser = false;
            }
            param.isUser = true;
        }

        $scope.chkIsuse = function (param) {
            if (param.isUser) {
                return "#99FF66"
            }
        }

        $scope.accepted = function () {
            $scope.filterModel.userAssign = $scope.userName;
            $scope.filterModel.update = 0;
            let data = $scope.searchResultModel.find(c => c.isUser);
            if (!data) {
                return dpMessageBox.alert(
                    {
                        ok: 'Close',
                        title: 'ALERT',
                        message: "กรุณา เลือก Task"
                    }
                )
            }
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow(data)
            }
        }
        var MessageBox = dpMessageBox;

        $scope.show = {
            action: true,
            pagination: true,
            checkBox: false
        }
        $scope.model = {
            currentPage: 1,
            numPerPage: 50,
            totalRow: 0
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
                $scope.colortab1 = "#990000";
                $scope.colortab2 = "#FFFFFF";

                $scope.fronttab1 = "#FFFFFF";
                $scope.fronttab2 = "#990000";

            }
            else if (tab == 2) {
                $scope.colortab1 = "#FFFFFF";
                $scope.colortab2 = "#990000";

                $scope.fronttab1 = "#990000";
                $scope.fronttab2 = "#FFFFFF";
            }

            $scope.selected = tab;

            let ChangeTable = 1;
            $scope.model = {};
            $scope.model = $vm.filterModel;
            if (perPage != null || perPage != undefined) {
                $scope.model.perPage = perPage;
                console.log($scope.model.perPage)
                console.log(perPage)
            }

            var p = $scope.model;
            serchPage(p);
        }

        function serchPage(data) {

            if (data != null) {

                pageLoading.show();
                viewModel.filterTaskUnpack(data).then(function (res) {
                    pageLoading.hide();
                    if (res.data.length != 0 && res.data.length != undefined) {
                        $vm.filterModel.totalRow = res.data[0].count;
                        $scope.searchResultModel = res.data;

                    }
                    else {
                        if (res.data.pagination != null) {
                            $scope.searchResultModel = res.data.itemsTaskPutaway;
                        }
                    }
                })
            }
        }

        $scope.autoComplete = {
            basicSearch: "Putaway/autobasicSuggestion",
            autoGT: "AutoGoodsTransfer/autoGoodsTransferNo2",
        };

        $scope.url = {
            Putaway: webServiceAPI.Putaway,
            GT: webServiceAPI.GT,
        };

        function getToday() {
            var today = new Date();

            var mm = today.getMonth() + 1;
            var yyyy = today.getUTCFullYear();
            var dd = today.getDate();


            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;

            return yyyy.toString() + mm.toString() + dd.toString();
        }

        function validate(param) {
            var msg = "";
            return msg;
        }


        $scope.clearData = function () {
            $scope.searchResultModel = {};
            $scope.filterModel = {};
        }

        var init = function () {
            $scope.userName = localStorageService.get('userTokenStorage');
            $scope.selected = 1;
            $scope.filterTask();
        };
        init();

    }
});