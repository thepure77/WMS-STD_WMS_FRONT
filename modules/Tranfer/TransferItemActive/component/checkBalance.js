'use strict'
app.component('checkBalance', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/Tranfer/TransferItemActive/component/checkBalance.html";
    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',
        pickingToolsList:'=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = $scope.items || [];
        var item = $vm.searchResultModel;
        // setting column
        $scope.showColumnSetting = false;
        $scope.pickingToolsList = false;

        var model = $scope.filterModel;

        


      





        var initForm = function () {
        };
        var init = function () {
        };
        init();

    }
});