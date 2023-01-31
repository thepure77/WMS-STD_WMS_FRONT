'use strict';
app.controller("warehousefController", function ($scope, ngAuthSettings, $state, authService, pageLoading, $window, commonService) {
    // init data
    $scope.warehouseForm = {};
    $scope.dataList = [];

    $scope.dataListview = false;

    // show Material modal
    // $scope.showProductList = function () {
    //     $scope.title = "Select Material";
    //     $scope.dataListview = true;
    //     paginationService.getPaginationData(1, 10, 100).then(function (res, error) {
    //         $scope.dataList = res;
    //     });
    // }

    // show grade modal
    // $scope.showGradeList = function () {
    //     $scope.title = "Select Batch";
    //     $scope.dataListview = true;
    //     paginationService.getPaginationData(1, 10, 100).then(function (res, error) {
    //         $scope.dataList = res;
    //     });
    // }

    // show lot number modal
    // $scope.showLotList = function () {
    //     $scope.title = "Select Batch";
    //     $scope.dataListview = true;
    //     paginationService.getPaginationData(1, 10, 100).then(function (res, error) {
    //         $scope.dataList = res;
    //     });
    // }

    // set Product
    $scope.setProductnoVal = function (val) {
        $scope.warehouseForm.product = val;
        $scope.dataListview = false;
    }

    //set Grade
    $scope.setGradeVal = function (val) {
        $scope.warehouseForm.grade = val;
        $scope.dataListView = false;
    }

    // set lot number
    $scope.setLotnoVal = function (val) {
        $scope.warehouseForm.lotNo = val;
        $scope.dataListview = false;
    }

    // hide Modal
    $scope.hideModal = function() {
        $scope.dataListview = false;
    }

    $scope.modalOneShown = function () {
        $scope.dataListview = true;
    }

    $scope.modalOneHide = function () {
        $scope.dataListview = false;
    }

});