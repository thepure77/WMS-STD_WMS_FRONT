(function () {
    'use strict'
    app.component('locationList', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Tranfer/TransferItemActive/component/locationList.html";
        },
        bindings: {
            isLoading: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: "=?",
            triggerCreate: '=?',
            isFilter: '=?',

        },
        controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox) {
            var $vm = this;
            var defer = {};
            $scope.items = $scope.items || [];
            var item = $vm.searchResultModel;
            // setting column       
            $scope.isLoading = false;

            var model = $scope.filterModel;

            $vm.isLoading = function (model, Barcode, sum) {
                defer = $q.defer();
                $scope.isLoading = true;

                if (model != null) {
                    $scope.filterModel = model;
                    $scope.filterModel.LocationName = model[0].locationName;
                    $scope.filterModel.locationIndex = model[0].locationIndex;
                    $scope.filterModel.locationId = model[0].locationId;
                    $scope.filterModel.itemStatusIndex = model[0].itemStatus_Index;
                    $scope.filterModel.itemStatusName = model[0].itemStatus_Name;
                    $scope.filterModel.itemStatusId = model[0].itemStatus_Id;
                    $scope.filterModel.productName = model[0].product_Name;
                    if (Barcode != null) {
                        $scope.filterModel.product_Id = model[0].product_Id;
                        $scope.filterModel.product_Name = model[0].product_Name;
                    }

                    $scope.SumModel = sum;
                }
                return defer.promise;
            };

            $scope.detectCheck = function (item) {
                let isCheck = $scope.filterModel;
                for (var i = 0; i <= isCheck.length - 1; i++) {
                    if (item.binBalance_Index  == isCheck[i].binBalance_Index  && item.selected == isCheck[i].selected) {
    
                        isCheck[i].selected = true;
                    }
                    else {
                        isCheck[i].selected = false;
                    }
                }              
            }

            $scope.checkLine = function (param) {
                for (let index = 0; index < $scope.items.length; index++) {
                    if(index != param)
                    {
                        $scope.items[index].check = false;
                    }
                    
                }
            }

            $scope.select = function (param) {
                var item = angular.copy($scope.filterModel);
                var models = {};
                var idx = [];
                angular.forEach(item, function (v, k) {
                    if (v.selected) {
                        idx.push(v)
                    }
                });
                models = { 'data': idx };
                defer.resolve(models);
            }

            $scope.back = function () {
                $scope.isLoading = false;
                $scope.SumModel = {};
                $scope.filterModel = {};
                defer.resolve('0');
            }
            
            var init = function () {
            };
            init();

        }
    })
})();