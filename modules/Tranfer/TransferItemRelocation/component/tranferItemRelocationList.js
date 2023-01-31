(function () {
    'use strict'
    app.component('tranferItemRelocationList', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, $window, commonService) {
            return "modules/Tranfer/TransferItemRelocation/component/tranferItemRelocationList.html";
        },
        bindings: {
            isLoading: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: "=?",
            triggerCreate: '=?',
            isFilter: '=?',

        },
        controller: function ($scope, $filter, $q, $compile, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox) {
            var $vm = this;
            var defer = {};
            $scope.items = $scope.items || [];
            // setting column       
            $scope.isLoading = false;
            $vm.isLoading = function (model, sumLoc, dataList) {
                defer = $q.defer();
                $vm.filterModel = dataList;
                $scope.SumModel = sumLoc;
                $scope.isLoading = true;

                if (model != null) {
                    $scope.filterModel = model;
                    $scope.filterModel.LocationName = model[0].locationName;
                    $scope.filterModel.locationIndex = model[0].locationIndex;
                    $scope.filterModel.locationId = model[0].locationId;
                }else {
                    $scope.filterModel = "";
                    $vm.filterModel = "";
                    $scope.SumModel = "";
                }
                return defer.promise;
            };

            $scope.detectCheck = function (item) {
                let isCheck = $scope.filterModel;
                for (var i = 0; i <= isCheck.length - 1; i++) {
                    if (item.binBalance_Index == isCheck[i].binBalance_Index && item.selected == isCheck[i].selected) {

                        isCheck[i].selected = true;
                    }
                    else {
                        isCheck[i].selected = false;
                    }
                    // if (item.qty == isCheck[i].qty && item.tag_Index == isCheck[i].tag_Index && item.productName == isCheck[i].productName && item.productConversionName == isCheck[i].productConversionName
                    //     && item.selected == isCheck[i].selected) {

                    //     isCheck[i].selected = true;
                    // }
                    // else {
                    //     isCheck[i].selected = false;
                    // }
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
                // if(models.data[0].binBalanceQtyReserve != 0){
                //     dpMessageBox.alert({
                //         ok: 'Yes',
                //         title: 'Information.',
                //         message: " สินค้าที่เลือกนี้มีการจองแล้ว ไม่สามารถย้ายสินค้าได้ "
                //     })
                //     angular.forEach(models.data, function (v, k) {
                //         $scope.filterModel[k].selected = false;
                //     });
                // }
                // else{
                //     defer.resolve(models);
                // }               
            }

            $scope.back = function () {
                if ($scope.checkAll === true) {
                    angular.forEach($scope.filterModel, function (v, k) {
                        $scope.filterModel[k].selected = false;
                    });
                } else {
                    angular.forEach($scope.filterModel, function (v, k) {
                        $scope.filterModel[k].selected = false;
                    });
                }
                defer.resolve('false');
            }

            var init = function () {
            };
            init();

        }
    })
})();