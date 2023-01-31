(function () {
    'use strict'

    app.component('masterProductOwner', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterProductOwner/productOwnerSummary.html";
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox) {
            var $vm = this;

            $scope.isFilter = true;

            $scope.filterModel = {
                currentPage: 1,
                numPerPage: 30,
                totalRow: 0,
                key: '',
                advanceSearch: false,
                showError: false,
                type: 1,
                perPage: 30,
                maxSize: 5
            };

            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });
        }
    })
})();