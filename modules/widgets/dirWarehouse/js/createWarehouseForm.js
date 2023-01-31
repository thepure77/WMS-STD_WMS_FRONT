'use strict';
app.directive('warehouseForm', function() {
    return {
        restrict: 'E',
        scope: {
            config: '=',
            delegates: '=',
            invokes: '=',
        },
        controllerAs: '$ctrl',
        controller: function($scope, ngAuthSettings, $state, authService, pageLoading, $window, commonService) {
            // init data
            $scope.formData = {};

            $scope.delegate = {};
            $scope.invokes = $scope.invokes || {};
            $scope.config = $scope.config || {};

            // self function
            $scope.delegate.add = function() {

                var item = $scope.formData;

                if (item.id === undefined) {
                    $scope.invokes.add(item);
                    $scope.formData = {};
                } else {
                    $scope.invokes.edit(item);
                    $scope.formData = {};
                }
            }

            $scope.delegate.remove = function(index) {
                $scope.invokes.remove(index);
            }

            $scope.delegate.edit = function(index) {
                var item = $scope.formData;
                $scope.invokes.edit(item);
                $scope.formData = {};
            }

            $scope.delegate.cancel = function() {
                $scope.invokes.cancel();
            }

            $scope.delegate.fillData = function(item) {
                $scope.formData = item;
            }

            $scope.delegates = $scope.delegate;
            
            //---------------------------
            //All Popup in form warehouse
            //---------------------------
            $scope.popupProduct = {
                onShow: false,
                delegates: {},
                onClick: function () {
                    $scope.popupProduct.onShow = !$scope.popupProduct.onShow;
                    
                },
                config:{
                    title:"Popup Product"
                },
                invokes: {
                    add: function (param) {},
                    edit: function (param) {},
                    select: function (param) {}
                }
            };
            
            $scope.popupLotNo = {
                onShow: false,
                delegates: {},
                onClick: function () {
                    $scope.popupLotNo.onShow = !$scope.popupLotNo.onShow;
                },
                config:{
                    title:"Popup Lot No"
                },
                invokes: {
                    add: function (param) {},
                    edit: function (param) {},
                    select: function (param) {
                    }
                }
            };
            
            $scope.popupGrade = {
                onShow: false,
                delegates: {},
                onClick: function () {
                    $scope.popupGrade.onShow = !$scope.popupGrade.onShow;
                },
                config:{
                    title:"Popup Grade"
                },
                invokes: {
                    add: function (param) {},
                    edit: function (param) {},
                    select: function (param) {}
                }
            };
        },
        link: function($scope, $element, $attributes) {},
        templateUrl: 'modules/ModuleOms/widgets/dirWarehouse/views/createWarehouseForm.html'
    }
});

'use strict'
app.directive('warehouseList', function() {
    return {
        restrict: 'E',
        controllerAs: '$ctrl',
        scope: {
            listData: '=ngModel',
            invokes: '=',
            delegates: '='
        },
        controller: function($scope) {

            $scope.invokes = $scope.invokes || {};
            $scope.config = $scope.config || {};


            // self function
            $scope.delegate = {};

            $scope.delegate.remove = function(index) {
                $scope.listData.splice(index, 1);
            }

            $scope.delegate.edit = function(index) {
                var item = $scope.listData[index];
                item.id = index;
                $scope.invokes.showEdit(item);
            }

            $scope.delegates = $scope.delegate;

        },
        link: function($scope, $element, $attributes) {

        },
        templateUrl: 'modules/ModuleOms/widgets/dirWarehouse/views/warehouseList.html',
    }
})