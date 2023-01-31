(function () {
    'use strict';
    app.component('universalScarchSummary', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Inquiry/UniversalScarch/component/universalScarchSummary.html";
        },
        bindings: {
            scanReceive: '=?',
            onShow: '=?'
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, universalScarchFactory, webServiceAPI) {
            var $vm = this;
            var defer = {};
            var viewModel = universalScarchFactory;
            $scope.url = {
                GR: webServiceAPI.GR,
            };
            $scope.filterModel = {};
            $scope.model = {};

            $scope.dropdownType = ["Tag No", "Product Id", "Product Name", "Location Id", "Product Lot"];

            //ScanBarcode
            $scope.ScanBarcode = function () {
                debugger
                pageLoading.show()
                $scope.filterModel = {};
                $scope.filterModel.type = $scope.dropdownType.model;
                $scope.filterModel.input = $scope.input;
                viewModel.universalscarch($scope.filterModel).then(function (res) {
                    pageLoading.hide()
                    debugger
                    if (res.data.itemsUniversalscarch.length > 0) {
                        $scope.filterModel = res.data.itemsUniversalscarch;
                        $scope.Total = res.data.itemsUniversalscarch.length;
                    }
                    else {$scope.Total = '';
                        return dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'ไม่มีข้อมูล'
                            }
                        )
                    }
                },
                    function error(response) {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'แจ้งเตือน',
                                message: 'Please clear data'
                            }
                        )
                    })
            }

            

        }
    })
})();