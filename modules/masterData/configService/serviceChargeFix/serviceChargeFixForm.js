(function () {
    'use strict'
    app.component('serviceChargeFixForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, $window, commonService) {
            return "modules/masterData/configService/serviceChargeFix/serviceChargeFixForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            onStorage: '=?'
        },
        controller: function ($scope, $q, $filter, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, configServiceFactory, webServiceAPI) {
            var $vm = this;
            $scope.onShow = false;
            var defer = {};
            var viewModel = configServiceFactory;

            $vm.onShow = function (param) {
                $scope.filterModel = param;
                $scope.onShow = true;
                // $vm.onStorage = false; 
                $scope.filterFix($scope.filterModel);

                defer = $q.defer();
                return defer.promise;
            };
            $vm.triggerSearch = function () {
                pageLoading.show();
                viewModel.filter($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.searchResultModel = res.data.itemsUser;
                });
            };

            $scope.filterFix = function (param) {
                var model = {};
                model = param;
                pageLoading.show();
                viewModel.filterServiceChargeFix(model).then(function (res) {
                    pageLoading.hide();
                    $scope.listServiceChargeFix = {};
                    $scope.listServiceChargeFix = res.data;
                })
            }


            $scope.deleteFix = function (param) {
                var model = {};
                model.create_By = localStorageService.get('userTokenStorage');
                // model.listServiceChargeFix = param.filter(c => c.selected == true)
                model.listServiceChargeFix = param;
                pageLoading.show();
                viewModel.deleteServiceChargeFix(model).then(function (res) {
                    pageLoading.hide();
                    $scope.filterFix($scope.filterModel);
                })
            }

            $scope.back = function () {
                $scope.onShow = false;
                defer.resolve('1');
            }

            $scope.addServiceChargeFix = {
                onShow: false,
                delegates: {},
                onClick: function () {
                    $scope.addServiceChargeFix.onShow = !$scope.addServiceChargeFix.onShow;
                    $scope.addServiceChargeFix.delegates($scope.filterModel);
                },
                invokes: {
                    selected: function (param) {
                        $scope.filterFix(param);
                    }
                }
            };
            var init = function () {

            };
            init();


        }
    })
})();