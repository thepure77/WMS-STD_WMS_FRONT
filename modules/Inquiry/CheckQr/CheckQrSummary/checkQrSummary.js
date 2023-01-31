(function () {
    'use strict';
    app.component('checkQrSummary', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Inquiry/CheckQr/CheckQrSummary/checkQrSummary.html";
        },
        bindings: {
            scanReceive: '=?',
            onShow: '=?'
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, checkQrFactory, webServiceAPI) {
            var $vm = this;
            var defer = {};
            var viewModel = checkQrFactory;
            $scope.url = {
                GR: webServiceAPI.GR,
            };
            $scope.filterModel = {};


            $scope.scanQr = function () {
                var deferred = $q.defer();
                var model = {};
                model = $scope.filterModel;
                pageLoading.show();
                viewModel.findCheckQRScanSummary(model).then(
                    function success(res) {
                        pageLoading.hide();
                        if (res.data.mess == null) {
                            $scope.filterModel = res.data;
                            
                        }else{
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'ALERT',
                                message: res.data.mess
                            })

                            $scope.filterModel.qrcode = undefined;
                        }
                    },
                    function error(response) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'ALERT',
                            message: "error"
                        })
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

           

            $vm.$onInit = function () {
                $vm = this;
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.click = 1;
                setTimeout(() => {
                    var focusElem = jQuery('input[ng-model="filterModel.tag_no"]');
                    focusElem[0].focus();
    
                }, 200);
            }







        }
    })
})();