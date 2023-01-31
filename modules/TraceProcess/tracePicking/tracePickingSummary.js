(function () {
    'use strict'

    app.component('tracePickingSummary', {
        controllerAs: '$vm',
        bindings: {},
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/TraceProcess/tracePicking/tracePickingSummary.html";
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, logsFactory) {
            var $vm = this;

            $scope.isFilter = true;

            $scope.filterModel = {
                currentPage: 0,
                perPage: 30,
                totalRow: 0,
                key: '',
                advanceSearch: false,
                showError: false,
                type: 1
            };
            
            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });

            this.$onInit = function () {
                //insertLogsUser();
            };
        }
    })
})();