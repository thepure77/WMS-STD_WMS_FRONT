(function () {
    'use strict'
    app.component('itemReserveCheckBalance', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Tranfer/TransferItemReserve/component/itemReserveCheckBalance.html";
        },
        bindings: {            
            checkBalance: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: "=?",
            triggerCreate: '=?',
            isFilter: '=?',
            isLoading: '=?',

        },
        controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox) {
            var $vm = this;
            var defer = {};
            var XFindItem = $filter('findItemList');
            var Progressbar = pageLoading;
            $scope.items = $scope.items || [];
            var item = $vm.searchResultModel;
            // setting column       
            $scope.checkBalance = false;

            var model = $scope.filterModel;

            $vm.checkBalance = function () {
                                      
                defer = $q.defer();
                $scope.checkBalance = true;                
                
                return defer.promise;
            };

            $scope.back = function () {
                $scope.checkBalance = false;
                $scope.filterModel = {};
                defer.resolve('-99');
            }








            var initForm = function () {
            };
            var init = function () {
            };
            init();

        }
    })
})();