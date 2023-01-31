'use strict';
app.controller("packagingfController", function($scope, ngAuthSettings, $state, authService, pageLoading, $window, commonService, $timeout) {
    // init data
    $scope.packagingForm = {}
    $scope.dataList = [];

    // modal event and configurtation
    $scope.title = "Packaging List";
    $scope.dataListview = false;

    $scope.delegate = {
        add: function(item) {            
        },
        edit: function(item) {
        },
        cancel: function() {
        }
    };

    $scope.delegates = $scope.delegate;


    // show product modal
    // $scope.showProductList = function () {
    //     $scope.title = "Select Sold to";
    //     $scope.dataListview = true;
    //     paginationService.getPaginationData(1, 10, 100).then(function (res, error) {
    //         $scope.dataList = res;
    //     });    
    // }

    // show product modal
    // $scope.showDeliveryPlace = function () {
    //     $scope.title = "Select Delivery place";
    //     $scope.dataListview = true;
    //     paginationService.getPaginationData(1, 10, 100).then(function (res, error) {
    //         $scope.dataList = res;
    //     });
    // }

    // show product modal
    // $scope.showDeliveryTeam = function () {
    //     $scope.title = "Select Delivery team";
    //     $scope.dataListview = true;
    //     paginationService.getPaginationData(1, 10, 100).then(function (res, error) {
    //         $scope.dataList = res;
    //     });

    // set sold to form value
    $scope.setFormVal = function(val) {
        $scope.packingForm.item = val;
        $scope.dataListview = false;
    }

    // hide Modal
    $scope.hideModal = function() {
        $scope.dataListview = false;
    }

    $scope.modalOneShown = function() {
        $scope.dataListview = true;
    }

    $scope.modalOneHide = function() {
        $scope.dataListview = false;
    }
});
