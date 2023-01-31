(function () {
    'use strict'

    app.component('skuStockDetail', {
        controllerAs: '$vm',
        templateUrl: "modules/Inquiry/SKU/component/skuStockDetail.html",
        bindings: {
            isLoading: '=?',
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',
            isStock: '=?',
            productTemp: '=?',
            isProductConversion: '=?'

        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, inquirySkuFactory) {
            var $vm = this;

            var defer = {};
            var viewModel = inquirySkuFactory;
            $scope.isStock = false;
            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });

            $scope.m = {};
            $vm.isStock = function (param) {    
                            
                defer = $q.defer();
                $scope.isStock = true;
                $scope.isLoading = false;
                $scope.m.productId = param[0].productId;
                viewModel.GetStockDetails($scope.m).then(function success(res) {                    
                    $vm.filterModel = res.data.items;
                    $vm.productTemp = $vm.filterModel[0].productId;
                }, function error(res) { });
                return defer.promise;
            };
            $scope.show = {
                action: true,
                pagination: true,
                checkBox: false
            }
            
            $scope.filterSearch = function () {
                
                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel.productId = ($vm.filterModel === undefined || $vm.filterModel == "") ? $vm.productTemp : $vm.filterModel[0].productId ;

                // $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                // $scope.filterModel.perPage = $vm.filterModel.perPage;
                viewModel.GetStockDetails($scope.filterModel).then(function success(res) {
                    $vm.filterModel = res.data.items;
                    // $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    // $vm.filterModel.currentPage = res.data.pagination.currentPage;
                    // $vm.filterModel.perPage = res.data.pagination.perPage;
                    // $vm.filterModel.numPerPage = res.data.pagination.perPage;
                    // $vm.filterModel.maxSize = 10;



                }, function error(res) { });
            }



            this.$onInit = function () {
                $scope.filterModel = {};
                $scope.selected = 1;
                $scope.click = 1;
                $scope.userName = localStorageService.get('userTokenStorage');

            };

            $scope.back = function () {
                $scope.isStock = false;
                defer.resolve('-99');
            
            }

            function getToday() {
                var today = new Date();

                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();


                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }


            $scope.buttons = {
                add: true,
                update: false,
                back: true
            };

            var init = function () {
                $scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');


            };
            init();
        }
    })
})();