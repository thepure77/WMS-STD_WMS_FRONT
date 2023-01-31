(function () {
    'use strict';
    app.component('tranferDynamicSlottingSummary', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Tranfer/tranferDynamicSlotting/tranferDynamicSlotting/tranferDynamicSlottingSummary.html";
        },
        bindings: {
            scanReceive: '=?',
            onShow: '=?'
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, tranferOneZeroFourFactory, webServiceAPI) {
            var $vm = this;
            var defer = {};
            var viewModel = tranferOneZeroFourFactory;

            $scope.url = {
                GR: webServiceAPI.GR,
            };

            $scope.filterModel = {
                callroll: false,
                buttoncall: false,
            };

            $scope.header = {
                callroll: false,
                buttoncall: false,
            };

            $scope.autoComplete = {
                sku: "Autocomplete/autoProduct",
            };

            $scope.url = {
                binBalance: webServiceAPI.BinBalance,
                Master: webServiceAPI.Master,
            };

            $vm.triggerCreate = function () {
                debugger
                if($scope.onShow)
                {
                    $vm.isFilter = false;
                    $scope.onShow().then(function (result) {                   
                        $vm.isFilter = true;
                        $vm.triggerSearch();
                    }).catch(function(error) {
                        defer.reject({ 'Message': error });
                    });
                }
            };

            $vm.$onInit = function () {
                $vm = this;
                // $scope.selectlist = false;
                // $scope.call = false;
                // $scope.sendback = false;
                $scope.userName = localStorageService.get('userTokenStorage');
                // $scope.click = 1;
                // setTimeout(() => {
                //     var focusElem = jQuery('input[ng-model="filterModel.location"]');
                //     focusElem[0].focus();

                // }, 200);
            }







        }
    })
})();