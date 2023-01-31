'use strict'
app.component('checkWaveGiList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/GI/CheckWaveGI/component/checkWaveGIList.html";
    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',
        searchDataLocation: '=?',
        filterModelLo: '=?',

    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox,tracePickingFactory,checkWaveGIFactory) {
        var $vm = this;
        $scope.maxSize = 5;
        $scope.filterModel = {};
        $vm.isShow = false
        var MessageBox = dpMessageBox;
        var viewModel = tracePickingFactory;
        var viewWCSModel = checkWaveGIFactory;

        $scope.show = {
            action: true,
            pagination: true,
            checkBox: false
        }
        
        $scope.model = {
            totalRow: 0
        }

        $scope.clickTab = function (tab) {
            debugger
            $scope.click = tab;
            $vm.filterModel.tap = tab;
        }

        $scope.changePage = function () {
            debugger
            var page = $vm.filterModel;
            var all = {
                currentPage: 0,
                numPerPage: 0
            };
            if ($vm.filterModel.currentPage != 0) {
                page.currentPage = page.currentPage;
            }
            $scope.serchPage(page);
        }

        $scope.serchPage = function (page) {
            debugger
            $scope.filterModel = page;
            $scope.filterModel.PerPage = page.perPage;
            $scope.filterModel.date = $('input[name="datefilter"]').val();
            if ($scope.filterModel.date != null && $scope.filterModel.isDate != 1) {
                $scope.convertDate();
            }
            pageLoading.show();
            viewModel.searchFilter($scope.filterModel).then(function success(res) {
                pageLoading.hide();
                debugger
                if (res.data.itemsTrace.length != 0) {  
                    $vm.filterModel.perPage = $vm.filterModel.perPage;
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;

                    $vm.filterModel.currentPage = res.data.pagination.currentPage;

                    if (res.data.pagination != null || res.data.pagination != undefined) {
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    }
                    $vm.searchResultModel = res.data.itemsTrace;
                }
                else {
                    $vm.searchResultModel = res.data.itemsTrace;
                }

                $vm.filterModel.totalRow = res.data.pagination.totalRow;


            }, function error(res) { });
        };

        $scope.getWaveWIP = function () {
            pageLoading.show();
            viewWCSModel.Get_Wave_WIP($scope.filterModel).then(function success(res) {
                pageLoading.hide();
                if (res.data.waveNo != null) {  
                    $scope.filterModel.waveNo = res.data.waveNo;
                    if(res.data.wmsErrorCode != 99)
                    {
                        $scope.WCS_waveno = true;
                    }
                    else
                    {
                        $scope.WCS_waveno = false;
                    }
                }
                else
                {
                    $scope.filterModel.waveNo = null;
                    $scope.WCS_waveno = false;
                }
            }, function error(res) { });
        };

        $scope.completeWave = function () {
            var model = $scope.filterModel;
            model.docNo = $scope.filterModel.waveNo;
            model.updateBy = $scope.userName;
            model.remark = $scope.filterModel.remark;
            pageLoading.hide();

            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'ยืนยันข้อมูล ?',
                message: 'คุณต้องการปิด wave : [ ' + model.docNo + ' ] ใช่หรือไม่ ?'
            }).then(function () {
                pageLoading.show();
                viewWCSModel.Complete_Wave(model).then(function (res) {
                    
                    if (res.data.status == 10) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: res.data.message.description
                        })  

                        $scope.filterModel.waveNo = null;
                        $scope.filterModel = {};
                        $scope.WCS_waveno = false;
                    } else 
                    {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "ปิด wave ไม่สำเร็จ : " + res.data.message.description
                        }) 
                    }

                    pageLoading.hide();
                });
            },
            function error(param) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Information.',
                    message: "API Error"
                }) 

                pageLoading.hide();
            });
        }

        $scope.changeTableSize = function (perPage, tab) {
            if (tab == 0) {
                $scope.colortab1 = "#0088cc";
                $scope.colortab2 = "#FFFFFF";

                $scope.fronttab1 = "#FFFFFF";
                $scope.fronttab2 = "#0088cc";

            }
            else if (tab == 1) {
                $scope.colortab1 = "#FFFFFF";
                $scope.colortab2 = "#0088cc";

                $scope.fronttab1 = "#0088cc";
                $scope.fronttab2 = "#FFFFFF";
            }

            $scope.selected = tab;
            debugger
            let ChangeTable = 1;
            $scope.model = $vm.filterModel;
            if (perPage != null || perPage != undefined) {
                $scope.model.perPage = perPage;
            }

            var p = $scope.model;
            $scope.serchPage(p);
        }

        $scope.convertDate = function () {

            if ($scope.filterModel.date != null) {
                var str = $scope.filterModel.date;

                var DStart = str.substring(0, 2);
                var MStart = str.substring(5, 3);
                var YStart = str.substring(10, 6);

                $scope.filterModel.load_Date = YStart.toString() + MStart.toString() + DStart.toString();

                var DEnd = str.substring(15, 13);
                var MEnd = str.substring(18, 16);
                var YEnd = str.substring(25, 19);

                $scope.filterModel.load_Date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
            }
        };

        var init = function () {
            $scope.clickTab(0);
            $scope.WCS_waveno = false;
            $scope.selected = 0;
            $scope.userName = localStorageService.get('userTokenStorage');
            $scope.getWaveWIP();
        };
        init();

    }
});