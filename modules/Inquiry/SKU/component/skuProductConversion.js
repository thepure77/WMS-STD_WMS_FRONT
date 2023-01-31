(function () {
    'use strict'

    app.component('skuProductConversion', {
        controllerAs: '$vm',
        templateUrl: "modules/Inquiry/SKU/component/skuProductConversion.html",
        bindings: {
            isLoading: '=?',
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',

        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, inquirySkuFactory) {
            var $vm = this;

            var defer = {};
            var viewModel = inquirySkuFactory;
            $scope.isLoading = false;

            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });


            $scope.m = {};
            $vm.isLoading = function (param) {
                
                defer = $q.defer();
                $scope.isLoading = true;
                $scope.m.productId = param[0].productId;
                $scope.m.productIndex = param[0].productIndex;
                // $scope.m.currentPage = 1;
                // $scope.m.perPage = 30;
                viewModel.GetSKUConversion($scope.m).then(function success(res) {
                    
                    $vm.filterModel = res.data.items;
                    // $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    // $vm.filterModel.currentPage = res.data.pagination.currentPage;
                    // $vm.filterModel.perPage = res.data.pagination.perPage;
                    // $vm.filterModel.numPerPage = res.data.pagination.perPage;
                    // $vm.filterModel.maxSize = 5;
                }, function error(res) { });
                return defer.promise;
            };

            $scope.show = {
                action: true,
                pagination: true,
                checkBox: false
            }



            this.$onInit = function () {


            };

            $scope.pageOption = [
                { value: 30 },
                { value: 50 },
                { value: 100 },
                { value: 500 }
            ];

            $scope.back = function () {
                $scope.isLoading = false;
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