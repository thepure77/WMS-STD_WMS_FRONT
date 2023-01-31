
(function () {
    'use strict';
    app.component('tranferDynamicSlottingFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Tranfer/tranferDynamicSlotting/tranferDynamicSlotting/tranferDynamicSlottingFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService, tranferDynamicSlottingFactory, webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var viewModel = tranferDynamicSlottingFactory;


            $scope.filterModel = {};
            $vm.filterModel = {
                currentPage: 1,
                PerPage: 50,
                totalRow: 0,
            };

            $scope.search = function (param) {
                debugger
                var models = $scope.filterModel;
                models.PerPage = $vm.filterModel.PerPage;
                models.currentPage = $vm.filterModel.currentPage;
                pageLoading.show();

                viewModel.filterDynamicSlotting(models).then(function (res) {
                    pageLoading.hide();
                    
                    $vm.searchResultModel = res.data.itemsDynamicSlotting;
                    debugger
                });
            };


            $vm.triggerSearch = function () {

                $vm.filterModel = $vm.filterModel || {};
                pageLoading.show();
                viewModel.filterDynamicSlotting($vm.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsDynamicSlotting;
                    
                });
            };

            $scope.url = {
                Master: webServiceAPI.Master,
            };
            $scope.autoComplete = {
                sku: "Autocomplete/autoSku"
            };

            function initialize() {

                $scope.filterModel = {};
            };

            this.$onInit = function () {
                initialize();
            };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });
        }
    });

})();