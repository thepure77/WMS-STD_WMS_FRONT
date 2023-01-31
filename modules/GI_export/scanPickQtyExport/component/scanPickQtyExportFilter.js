(function () {
    'use strict';
    app.component('scanPickQtyExportFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI_export/scanPickQtyExport/component/scanPickQtyExportFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            searchDataRow: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, dpMessageBox, localStorageService, commonService, scanPickQtyExportFactory, webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var viewModel = scanPickQtyExportFactory;

            // $vm.filterModel = {};

            $vm.triggerSearch = function (isuse = false) {
                if (isuse) {
                    $vm.filterModel = {};
                } else
                    $vm.filterModel = $vm.filterModel || {};
                pageLoading.show();
                $vm.filterModel.userName = localStorageService.get('userTokenStorage');
                viewModel.filter($vm.filterModel).then(function (res) {
                    pageLoading.hide();

                    if (res.data.resultIsUse) {
                        $vm.searchResultModel = res.data.items;
                    }
                    else {
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Error',
                                message: res.data.resultMsg
                            }
                        )
                    }
                });
            };


            $scope.clearSearch = function () {
                $scope.filterModel = {};
            }

            // ----------------------------------------------------
            // This local function
            $vm.setDateFormate = function (v) {
                try {
                    return $filter("dateFormate")(v);
                } catch (e) {
                    return "-";
                }
            }

            function getToday() {
                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();


                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }

            this.$onInit = function () {
                $scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');
            };

        }
    });

})();