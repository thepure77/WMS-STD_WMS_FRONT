(function () {
    'use strict'

    app.component('masterTaskGroupUser', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterTaskGroupUser/taskGroupUserSummary.html";
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox) {
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

            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });
        }
    })
})();