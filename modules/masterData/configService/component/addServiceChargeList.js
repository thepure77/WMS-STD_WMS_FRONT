
(function () {
    'use strict'
    app.directive('addServiceChargeList', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/masterData/configService/component/addServiceChargeList.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
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
                            $scope.filterItemModel = {};
                        };

                        $scope.delegates = function (param) {
                            $scope.filterModel.owner_Index = param.owner_Index;
                            $scope.filterModel.owner_Id = param.owner_Id;
                            $scope.filterModel.owner_Name = param.owner_Name;
                            viewModel.filterServiceChargePopup($scope.filterModel).then(function (res) {
                                pageLoading.hide();
                                $scope.filterItemModel = res.data;
                            })
                        }

                        $scope.Search = function () {
                            viewModel.filterServiceChargePopup($scope.filterModel).then(function (res) {
                                pageLoading.hide();
                                $scope.filterItemModel = res.data;
                            })
                        }



                        $scope.confirm = function (param) {
                            var model = {};

                            if ($scope.filterModel.owner_Name == null) {
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'ALERT',
                                        message: 'MSG_Alert_Owner'
                                    }
                                )
                                return "";

                            }
                            else {
                                model.owner_Index = $scope.filterModel.owner_Index;
                                model.owner_Id = $scope.filterModel.owner_Id;
                                model.owner_Name = $scope.filterModel.owner_Name;
                                model.create_By = localStorageService.get('userTokenStorage');
                                model.listServiceCharge = param.filter(c => c.selected == true)
                                viewModel.SaveChanges(model).then(function (res) {
                                    pageLoading.hide();
                                    $scope.invokes.selected(model);
                                    $scope.onShow = false;
                                })
                            }

                        }

                        $scope.$watch("filterModel.owner_Name", function () {
                            if ($scope.filterModel.owner_Name == undefined
                                || $scope.filterModel.owner_Name == null
                                || $scope.filterModel.owner_Name == "") {
                                $scope.index = undefined;
                                $scope.filterModel.owner_Index = null;
                                $scope.filterModel.owner_Id = null;
                                $scope.filterModel.owner_Name = null;
                            }
                        });



                        $scope.autoComplete = {
                            owner: "Autocomplete/autoOwnerId",
                        };

                        $scope.url = {
                            Master: webServiceAPI.Master,
                        };


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
