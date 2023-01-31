
(function () {
    'use strict'
    app.directive('manualInvoice', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/Inquiry/Invoice/component/manualInvoice/manualInvoice.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'webServiceAPI', 'invoiceFactory', 'dpMessageBox',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, webServiceAPI, invoiceFactory, dpMessageBox) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = invoiceFactory;
                        $scope.onShow = false;
                        $scope.filterModel = {};

                        $scope.onClose = function () {
                            $scope.onShow = false;
                            $scope.filterModel = {};
                        };

                        $scope.delegates = function (param) {
                            $scope.onShow = true;
                            $scope.filterModel.owner_Index = param.owner_Index;
                            $scope.filterModel.volumeCal = 0;
                            $scope.filterModel.binBalance_QtyBal = 0;
                            $scope.filterModel.binBalance_WeightBal = 0;
                            $scope.filterModel.binBalance_VolumeBal = 0;
                            // $scope.dropDownServiceChargeFix();

                        }

                        $scope.addsItem = function () {

                            if ($scope.dropDownServiceChargeFix.model != null) {
                                $scope.filterModel.serviceCharge_Index = $scope.dropDownServiceChargeFix.model.serviceCharge_Index;
                                $scope.filterModel.serviceCharge_Id = $scope.dropDownServiceChargeFix.model.serviceCharge_Id;
                                $scope.filterModel.serviceCharge_Name = $scope.dropDownServiceChargeFix.model.serviceCharge_Name;
                            }
                            else {
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'ALERT',
                                        message: 'MSG_Alert_serviceCharge'
                                    }
                                )
                                $scope.filterModel.success = 0;
                                $scope.onShow = false;

                                return "";
                            }
                            if ($scope.filterModel.rate < 0) {
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: 'MSG_Alert_rate'
                                    }
                                )
                                $scope.filterModel.success = 0;
                                return "";
                            }

                            if ($scope.filterModel.binBalance_QtyBal < 0) {
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: 'MSG_Alert_QtyBal'
                                    }
                                )
                                $scope.filterModel.success = 0;
                                return "";
                            }
                            if ($scope.filterModel.binBalance_WeightBal < 0) {
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: 'MSG_Alert_Weight'
                                    }
                                )
                                $scope.filterModel.success = 0;
                                return "";
                            }
                            if ($scope.filterModel.binBalance_VolumeBal < 0) {
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: 'MSG_Alert_Volume'
                                    }
                                )
                                $scope.filterModel.success = 0;
                                return "";
                            }
                            if ($scope.filterModel.volumeCal < 0) {
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: 'MSG_Alert_volumeCal'
                                    }
                                )
                                $scope.filterModel.success = 0;
                                return "";
                            }

                            if ($scope.filterModel.success != undefined
                                || $scope.filterModel.success != 0) {
                                $scope.invokes.selected($scope.filterModel);
                                $scope.onShow = false;
                                $scope.filterModel = {};
                            }
                        }

                        $scope.$watch("filterModel.volumeCal", function () {
                            if ($scope.filterModel.volumeCal != undefined
                                || $scope.filterModel.volumeCal != ""
                                || $scope.filterModel.volumeCal != undefined
                                || $scope.filterModel.volumeCal != null) {
                                $scope.filterModel.amount = $scope.filterModel.volumeCal * $scope.filterModel.rate;
                            }
                        });

                        $scope.$watch("filterModel.rate", function () {
                            if ($scope.filterModel.rate != undefined
                                || $scope.filterModel.rate != ""
                                || $scope.filterModel.rate != undefined
                                || $scope.filterModel.rate != null) {
                                $scope.filterModel.amount = $scope.filterModel.volumeCal * $scope.filterModel.rate;
                            }
                        });


                        $scope.$watch("dropDownServiceChargeFix.model", function () {
                            if ($scope.dropDownServiceChargeFix.model != undefined) {
                                $scope.filterModel.rate = $scope.dropDownServiceChargeFix.model.rate
                            }
                        });

                        $scope.$watch("filterModel.owner_Index", function () {
                            if ($scope.filterModel.owner_Index != undefined
                                || $scope.filterModel.owner_Index != ""
                                || $scope.filterModel.owner_Index != undefined
                                || $scope.filterModel.owner_Index != null) {
                                viewModel.dropDownServiceChargeFix($scope.filterModel).then(function (res) {
                                    $scope.dropDownServiceChargeFix = res.data;
                                });
                            }
                        });


                        $scope.dropDownServiceChargeFix = function () {
                            viewModel.dropDownServiceChargeFix($scope.filterModel).then(function (res) {
                                $scope.dropDownServiceChargeFix = res.data;
                            });
                        };

                        var init = function () {
                            // $scope.dropDownServiceChargeFix()
                        };

                        init();

                    }
                ],
                link: function ($scope, $element, $attributes) { }
            };
        }
    ]);
}());
