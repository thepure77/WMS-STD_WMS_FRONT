(function () {
    'use strict'
    app.component('scanRefTransferNoList', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Tranfer/ScanRefTransferNo/component/scanRefTransferNoList.html";
        },
        bindings: {
            isLoading: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: "=?",
            triggerCreate: '=?',
            isFilter: '=?',

        },
        controller: function ($scope, $filter, $q, $compile, $state, pageLoading, commonService, localStorageService, $timeout, $translate, dpMessageBox, scanRefTransferNoFactory) {
            var $vm = this;
            var defer = {};
            let viewModel = scanRefTransferNoFactory
              
            $scope.isLoading = false;

            $vm.isLoading = function (datalist) {
                defer = $q.defer();
                $scope.items = datalist.data;
             
                $vm.isLoadingItem = true;

                return defer.promise;
            };

            $scope.confirm = function () {

                let item = $scope.items.filter(f => f.selected);

                if (item.length == 0) {
                    return dpMessageBox.alert({
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: "กรุณาเลือกข้อมูล"
                    })

                }

                $vm.isLoadingItem = false;
                defer.resolve(item);
            }

            $scope.back = function () {
                $vm.isLoadingItem = false;
                defer.resolve();
            }

            var init = function () {
            };
            init();

        }
    })
})();