'use strict'
app.component('reportCheckScanRollCageTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/RollCage/reportCheckScanRollCage/component/reportCheckScanRollCageTableList.html";
    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',
        searchDataLocation: '=?',
        filterModelLo: '=?',

    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox) {
        var $vm = this;
        $scope.maxSize = 5;
        $scope.filterModel = {};
        $vm.isShow = false
        var MessageBox = dpMessageBox;

        $scope.show = {
            action: true,
        }
        $scope.model = {
            totalRow: 0
        }




        var init = function () {
            $scope.selected = 1;
            $scope.userName = localStorageService.get('userTokenStorage');
        };
        init();

    }
});