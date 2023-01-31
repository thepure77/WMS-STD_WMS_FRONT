(function () {
    'use strict'

    app.component('loadSummary', {
        controllerAs: '$vm',   
        bindings: {
            isLoading: '=?',
            onShow: '=?',
        }, templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Load/load/loadSummary.html";
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, loadFactory) {
            var $vm = this;
            var viewModel = loadFactory;

            var init = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
            };
            init();
        }
    })
})();