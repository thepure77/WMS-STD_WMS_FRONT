
(function () {
    'use strict'
    app.directive('invoiceNoGIPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/component/Popup/InvoiceNoGIPopup/invoiceNoGIPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'webServiceAPI', 'planGoodsIssueFactory', 'dpMessageBox',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, webServiceAPI, goodIssueFactory, dpMessageBox) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = goodIssueFactory;
                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function () {
                            // $scope.invokes.selected(param);
                            $scope.onShow = false;
                        };

                        $scope.delegates = function (param) {
                            $scope.filterItemModel = angular.copy(param) || {};
                            dropdownCurrency(param);
                        }

                        $scope.addsItem = function (param) {
                            //#region by dropdown currency
                            if ($scope.tax1Model) {
                                if ($scope.tax1Model.model != null) {
                                    $scope.filterItemModel.tax1_Currency_Index = $scope.tax1Model.model.currency_Index;
                                    $scope.filterItemModel.tax1_Currency_Id = $scope.tax1Model.model.currency_Id;
                                    $scope.filterItemModel.tax1_Currency_Name = $scope.tax1Model.model.currency_Name;
                                }
                                else {
                                    $scope.filterItemModel.tax1_Currency_Index = null;
                                    $scope.filterItemModel.tax1_Currency_Id = null;
                                    $scope.filterItemModel.tax1_Currency_Name = null;
                                }
                            }
                            if ($scope.tax2Model) {
                                if ($scope.tax2Model.model != null) {
                                    $scope.filterItemModel.tax2_Currency_Index = $scope.tax2Model.model.currency_Index;
                                    $scope.filterItemModel.tax2_Currency_Id = $scope.tax2Model.model.currency_Id;
                                    $scope.filterItemModel.tax2_Currency_Name = $scope.tax2Model.model.currency_Name;
                                }
                                else {
                                    $scope.filterItemModel.tax1_Currency_Index = null;
                                    $scope.filterItemModel.tax1_Currency_Id = null;
                                    $scope.filterItemModel.tax1_Currency_Name = null;
                                }
                            }
                            if ($scope.tax3Model) {
                                if ($scope.tax3Model.model != null) {
                                    $scope.filterItemModel.tax3_Currency_Index = $scope.tax3Model.model.currency_Index;
                                    $scope.filterItemModel.tax3_Currency_Id = $scope.tax3Model.model.currency_Id;
                                    $scope.filterItemModel.tax3_Currency_Name = $scope.tax3Model.model.currency_Name;
                                }
                                else {
                                    $scope.filterItemModel.tax3_Currency_Index = null;
                                    $scope.filterItemModel.tax3_Currency_Id = null;
                                    $scope.filterItemModel.tax3_Currency_Name = null;
                                }
                            }
                            if ($scope.tax4Model) {
                                if ($scope.tax4Model.model != null) {
                                    $scope.filterItemModel.tax4_Currency_Index = $scope.tax4Model.model.currency_Index;
                                    $scope.filterItemModel.tax4_Currency_Id = $scope.tax4Model.model.currency_Id;
                                    $scope.filterItemModel.tax4_Currency_Name = $scope.tax4Model.model.currency_Name;
                                }
                                else {
                                    $scope.filterItemModel.tax4_Currency_Index = null;
                                    $scope.filterItemModel.tax4_Currency_Id = null;
                                    $scope.filterItemModel.tax4_Currency_Name = null;
                                }
                            }
                            //#endregion
                        
                            $scope.invokes.selected($scope.filterItemModel);
                            $scope.onShow = false;
                            $scope.filterItemModel = {};
                        }

                        function dropdownCurrency(param) {
                            viewModel.dropdownCurrency({}).then(function (res) {
                                $scope.tax1Model = angular.copy(res.data);
                                $scope.tax2Model = angular.copy(res.data);
                                $scope.tax3Model = angular.copy(res.data);
                                $scope.tax4Model = angular.copy(res.data);
                                if (param) {
                                    $scope.tax1Model.model = $scope.tax1Model.find(f => f.currency_Index == param.tax1_Currency_Index);
                                    $scope.tax2Model.model = $scope.tax2Model.find(f => f.currency_Index == param.tax2_Currency_Index);
                                    $scope.tax3Model.model = $scope.tax3Model.find(f => f.currency_Index == param.tax3_Currency_Index);
                                    $scope.tax4Model.model = $scope.tax4Model.find(f => f.currency_Index == param.tax4_Currency_Index);
                                }
                            });
                        };
                      
                        var init = function () {

                        };

                        init();
                        // Local Function
                        // end
                    }
                ],
                link: function ($scope, $element, $attributes) { }
            };
        }
    ]);
}());
