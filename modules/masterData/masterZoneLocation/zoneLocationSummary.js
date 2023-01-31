(function () {
    'use strict'

    app.component('masterZoneLocation', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterZoneLocation/zoneLocationSummary.html";
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox) {
            var $vm = this;

            $scope.isFilter = true;

            
            $scope.filterModel = {
                currentPage: 1,
                perPage: 30,
                totalRow: 0,
                key: '',
                advanceSearch: false,
                showError: false,
                maxSize:10,
                num:1,
            };

            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });
        }
    })
})();