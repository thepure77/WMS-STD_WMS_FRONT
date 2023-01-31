'use strict'
app.component('scanPickLocationExportTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, $window, commonService) {
        return "modules/GI_export/scanPickLocationExport/component/scanPickLocationExportTableList.html";
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
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, scanPickLocationExportFactory) {
        var $vm = this;
        var viewModel = scanPickLocationExportFactory;

        $vm.triggerCreate = function () {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow().then(function (result) {
                    $vm.triggerSearch();
                    $vm.isFilter = true;
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        };

        $scope.accepted = function () {
            let data = $vm.searchResultModel.find(c => c.isUse);
            if (!data) {
                return dpMessageBox.alert(
                    {
                        ok: 'Close',
                        title: 'Error',
                        message: "กรุณา เลือก Task"
                    }
                )
            }
            // else if (data.userAssign != localStorageService.get('userTokenStorage')) {
            //     return dpMessageBox.alert(
            //         {
            //             ok: 'Close',
            //             title: 'Error',
            //             message: "User Assign Not Match"
            //         }
            //     )
            // }
            if ($scope.onShow) {
                $vm.isFilter = false;
                

                $scope.onShow(data).then(function (result) {
                    $vm.isFilter = true;
                    if (result) {
                        $vm.triggerSearch(true);
                    }
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        }

        $scope.chkIsuse = function (param) {
            if (param.isUse) {
                return "#99FF66"
            }
        }

        $scope.select = function (param) {
            let data = $vm.searchResultModel.find(c => c.isUse);
            if (data) {
                data.isUse = false;
            }
            param.isUse = true;
        }

        $scope.clearData = function () {
            $vm.searchResultModel = {};
            $vm.filterModel = {};
        }

        $scope.model = {
            currentPage: 1,
            numPerPage: 50,
            totalRow: 0
        };

        var init = function () {
            $scope.userName = localStorageService.get('userTokenStorage');

        };
        init();

    }
});