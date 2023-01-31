
app.component('masterVendor', {
    controllerAs: '$vm',
    bindings: {
    }, 
    templateUrl: "modules/masterData/masterVendor/vendorSummary.html",
    controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox) {
        var $vm = this;

        $scope.isFilter = true;

        $scope.filterModel = {
            currentPage: 0,
            numPerPage: 30,
            totalRow: 0,
            key: '',
            advanceSearch: false,
            showError: false,
            type: 1
        };

        console.log($scope.filterModel);

        $scope.$watch("callSearch", function () {
            if ($scope.callSearch) {
                $scope.callSearch();
            }
        });
    }
});