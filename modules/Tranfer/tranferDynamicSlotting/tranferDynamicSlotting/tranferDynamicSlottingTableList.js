'use strict'
app.component('tranferDynamicSlottingTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window) {
        return "modules/Tranfer/tranferDynamicSlotting/tranferDynamicSlotting/tranferDynamicSlottingTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, localStorageService, dpMessageBox, tranferDynamicSlottingFactory) {
        var $vm = this;
        var Progressbar = pageLoading;
        $scope.items = [];
        $scope.items = $scope.items || [];
        var viewModel = tranferDynamicSlottingFactory;
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

        $scope.deleteDynamicSlotting = function (param) {

            // var model = $scope.filterModel;

            param.create_By = $scope.userName;
            param.update_By = $scope.userName;
            pageLoading.show();

            viewModel.deleteDynamicSlotting(param).then(function (res) {
                pageLoading.hide();
                if (res.data.resultIsUse) {
                    $vm.searchResultModel = []
                    $vm.searchResultModel.push(res.data);
                    $scope.filterModel = {};
                    $scope.dtChooseLocation = [];
                    $scope.dtChoose = [];
                    $scope.dtChoose1 = [];
                    $scope.search();
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: "ยกเลิกศำเร็จ "
                        }
                    )
                } else {
                    return dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: res.data.resultMsg
                        }
                    )
                }


            })

        }

        $scope.search = function (param) {
            
            var models = $scope.filterModel;
            models.PerPage = $vm.filterModel.PerPage;
            models.currentPage = $vm.filterModel.currentPage;
            pageLoading.show();

            viewModel.filterDynamicSlotting(models).then(function (res) {
                pageLoading.hide();

                $vm.searchResultModel = res.data.itemsDynamicSlotting;
                
            });
        };

        $scope.genDynamicSlotting = function (param) {
            
            var model = $scope.filterModel;

            param.create_By = $scope.userName;
            param.update_By = $scope.userName;
            
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'ยืนยัน',
                message: 'คุณต้องการสร้างเอกสาร Dynamic Slotting ใช่หรือไม่ ?'
            }).then(function success() {
                pageLoading.show();
                viewModel.genDynamicSlotting(param).then(function (res) {
                    
                    pageLoading.hide();
                    if (res.data.resultIsUse) {
                        $scope.filterModel = {};
                        $scope.dtChooseLocation = [];
                        $scope.dtChoose = [];
                        $scope.dtChoose1 = [];
                        // $scope.back();
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Validate',
                                message: res.data.resultMsg
                            }
                        )
                    } else {
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Validate',
                                message: res.data.resultMsg
                            }
                        )
                    }


                })
            });

        }

        $scope.model = {
            currentPage: 1,
            numPerPage: 30,
            totalRow: 0,
        };



        var init = function () {
            $scope.filterModel = {};
        };
        init();

    }
});