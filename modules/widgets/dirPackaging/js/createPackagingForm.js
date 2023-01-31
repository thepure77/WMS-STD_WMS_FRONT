'use strict';
app.directive('packagingForm', function () {
    // debugger
    return {
        restrict: 'E',
        scope: {
            config: '=?',
            delegates: '=?',
            invokes: '=',
        },
        controllerAs: '$ctrl',
        controller: function ($scope, ngAuthSettings, $state, authService, pageLoading, $window, commonService) {

            // init data
            $scope.packagingForm = {};
            $scope.delegate = {};
            $scope.invokes = $scope.invokes || {};
            $scope.config = $scope.config || {};

            // debugger;

            // self function
            $scope.delegate.add = function () {                ;
                //สงสัย
                var item = $scope.packagingForm;

                if (item.id === undefined) {
                    $scope.invokes.add(item);
                    $scope.packagingForm = {};
                } else {
                    $scope.invokes.edit(item);
                    $scope.packagingForm = {};
                }
            }

            $scope.delegate.remove = function (index) {
                $scope.invokes.remove(index);
            }

            $scope.delegate.edit = function (index) {
                var item = $scope.packagingForm;
                $scope.invokes.edit(item);
                $scope.packagingForm = {};
            }

            $scope.delegate.cancel = function () {                
            }

            $scope.delegate.fillData = function (item) {
                $scope.packagingForm = item;
            }

            $scope.delegates = $scope.delegate;


            $scope.back = function () {
                if ($scope.invokes.cancel != undefined)
                    $scope.invokes.cancel();
            }
            $scope.add = function () {

                var item = $scope.packagingForm;

                if ($scope.invokes.add != undefined)
                    $scope.invokes.add(item);
            }

            // Popup
            $scope.popupPackging = {
                onShow: false,
                delegates: {},
                onClick: function () {
                    $scope.popupPackging.onShow = !$scope.popupPackging.onShow;
                },
                config:{},
                invokes: {
                    add: function (param) {},
                    edit: function (param) {},
                    select: function (param) {                        
                    }
                }
            };

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

        },
        link: function ($scope, $element, $attributes) {},
        templateUrl: 'modules/ModuleOms/widgets/dirPackaging/views/createPackagingForm.html'
    }
});

'use strict'
app.directive('packagingList', function () {
    return {
        restrict: 'E',
        controllerAs: '$ctrl',
        scope: {
            listData: '=ngModel',
            invokes: '=',
            delegates: '='
        },
        controller: function ($scope) {
            $scope.invokes = $scope.invokes || {};
            $scope.config = $scope.config || {};

            // self function
            $scope.delegate = {};

            $scope.delegate.remove = function (index) {
                $scope.listData.splice(index, 1);
            }

            $scope.delegate.edit = function (index) {
                var item = $scope.listData[index];
                item.id = index;
                $scope.invokes.showEdit(item);
            }

            $scope.delegates = $scope.delegate;

        },
        link: function ($scope, $element, $attributes) {

        },
        templateUrl: 'modules/ModuleOms/widgets/dirPackaging/views/packagingList.html',
    }
})