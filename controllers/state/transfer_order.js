'use strict'
app.controller("transferorderController", function ($scope, ngAuthSettings, $state, authService, pageLoading, $window, commonService, $timeout, paginationService) {

    this.createPage = function () {
        return $state.go('customer.transfer-order-create');
    }

    $scope.tabs = [{
        title: 'Warehouse',
        url: 'warehouse-table.html'
    }, {
        title: 'Transporter',
        url: 'transporter-table.html'
    }];

    $scope.currentTab = 'warehouse-table.html';

    $scope.onClickTab = function (tab) {
        $scope.currentTab = tab.url;
    }

    $scope.isActiveTab = function (tabUrl) {
        return tabUrl == $scope.currentTab;
    }

});