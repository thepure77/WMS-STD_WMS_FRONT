(function () {
    'use strict'

    app.component('skuAllocated', {
        controllerAs: '$vm',
        templateUrl: "modules/Inquiry/SKU/component/skuAllocated.html",
        bindings: {
            isLoading: '=?',
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',       
            isAllocated: '=?'     

        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, inquirySkuFactory) {
            var $vm = this;

            var defer = {};
            var viewModel = inquirySkuFactory;
            $scope.isAllocated = false;

            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });


            $scope.m = {};
            $vm.isAllocated = function (param) {
                            
                defer = $q.defer();
                $scope.isAllocated = true;
                $scope.m.productId = param[0].productId;
                viewModel.GetSKUAllocatedBy($scope.m).then(function success(res) {  
                                      
                    $vm.filterModel = res.data.items;
                }, function error(res) { });
                return defer.promise;
            };

            $scope.show = {
                action: true,
                pagination: true,
                checkBox: false
            }



            this.$onInit = function () {
                $scope.filterModel = {};
                $scope.selected = 1;
                $scope.click = 1;
                $scope.userName = localStorageService.get('userTokenStorage');

            };
            
            $scope.back = function () {
                $scope.isAllocated = false;
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