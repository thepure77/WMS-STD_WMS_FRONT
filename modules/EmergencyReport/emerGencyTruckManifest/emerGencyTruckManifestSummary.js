(function () {
    'use strict'

    app.component('emerGencyTruckManifestSummary', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/EmergencyReport/emerGencyTruckManifest/emerGencyTruckManifestSummary.html";
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox,logsFactory) {
            var $vm = this;

            $scope.isFilter = true;

            $vm.filterModel = {
                currentPage: 1,
                PerPage: 50,
                totalRow: 0,
                key: '',
                advanceSearch: false,
                showError: false,
                type: 1
            };


            this.$onInit = function () {
                $scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');
            };

        }
    })
})();