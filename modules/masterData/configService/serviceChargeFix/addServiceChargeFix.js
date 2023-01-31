
(function () {
    'use strict'
    app.directive('addServiceChargeFix', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/masterData/configService/serviceChargeFix/addServiceChargeFix.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?',
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'webServiceAPI', 'configServiceFactory', 'dpMessageBox',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, webServiceAPI, configServiceFactory, dpMessageBox) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = configServiceFactory;
                        $scope.onShow = false;
                        $scope.filterItemModel = {};
                        $scope.IsNew = 1;
                        $scope.filterModel = {};
                        $scope.onClose = function () {
                            $scope.onShow = false;
                            $scope.filterModel = {};
                        };

                        $scope.delegates = function (param) {
                            $scope.filterModel = {};
                            $scope.filterModel = param;
                        }

                        $scope.confirm = function (param) {
                            var model = {};
                            model = param;
                            model.create_By = localStorageService.get('userTokenStorage');
                            viewModel.SaveServiceChargeFix(model).then(function (res) {
                                pageLoading.hide();
                                if (res.data == "Done") {
                                    dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'ALERT',
                                            message: 'MSG_Alert_ServiceChargeFix_Success'
                                        }
                                    )
                                    $scope.invokes.selected($scope.filterModel);
                                    $scope.filterModel = {};
                                    $scope.onShow = false;
                                }
                                else {
                                    dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'ALERT',
                                            message: 'MSG_Alert_ServiceChargeFix_error'
                                        }
                                    )
                                    return "";
                                }
                            })
                        }


                        var init = function () {

                        };

                        init();

                    }
                ],
                link: function ($scope, $element, $attributes) { }
            };
        }
    ]);
}());
