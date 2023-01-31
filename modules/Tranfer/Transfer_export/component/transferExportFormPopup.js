
(function () {
    'use strict'
    app.directive('transferExportFormPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/Tranfer/Transfer_export/component/transferExportFormPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'webServiceAPI', 'transferExportFactory', 'dpMessageBox',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, webServiceAPI, transferExportFactory, dpMessageBox) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = transferExportFactory;
                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function () {
                            // $scope.invokes.selected(param);
                            $scope.onShow = false;
                        };

                        $scope.delegates = function (param) {
                            $scope.filterItemModel = angular.copy(param) || {};
                            dropdownWeight(param);
                            dropdownVolume(param);
                            dropdownItemStatus(param);
                            debugger;
                        }

                        $scope.addsItem = function (param) {debugger;
                            if ($scope.dropdownItemStatus) {
                                if ($scope.dropdownItemStatus.model != null) {
                                    $scope.filterItemModel.itemStatus_Index_To = $scope.dropdownItemStatus.model.itemStatus_Index;
                                    $scope.filterItemModel.itemStatus_Id_To = $scope.dropdownItemStatus.model.itemStatus_Id;
                                    $scope.filterItemModel.itemStatus_Name_To = $scope.dropdownItemStatus.model.itemStatus_Name;
                                }
                                else {
                                    $scope.filterItemModel.itemStatus_Index_To = null;
                                    $scope.filterItemModel.itemStatus_Id_To = null;
                                    $scope.filterItemModel.itemStatus_Name_To = null;
                                    return dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'แจ้งเตือน',
                                            message: 'กรุณาเลือกสถานนะ'
                                        }
                                    )
                                }
                            }

                            $scope.invokes.selected($scope.filterItemModel);
                            $scope.onShow = false;
                            $scope.filterItemModel = {};
                        }

                        function dropdownWeight(param) {
                            viewModel.dropdownWeight({}).then(function (res) {
                                $scope.dropdownWeight = angular.copy(res.data);
                                $scope.dropdownNetWeight = angular.copy(res.data);
                                $scope.dropdownGrsWeight = angular.copy(res.data);
                                if (param) {
                                    $scope.dropdownWeight.model = $scope.dropdownWeight.find(f => f.weight_Index == param.unitWeight_Index);
                                    $scope.dropdownNetWeight.model = $scope.dropdownNetWeight.find(f => f.weight_Index == param.unitNetWeight_Index);
                                    $scope.dropdownGrsWeight.model = $scope.dropdownGrsWeight.find(f => f.weight_Index == param.unitGrsWeight_Index);
                                }
                            });
                        };

                        function dropdownVolume(param) {
                            viewModel.dropdownVolume({}).then(function (res) {
                                $scope.unitWidth = angular.copy(res.data);
                                $scope.unitLength = angular.copy(res.data);
                                $scope.unitHeight = angular.copy(res.data);
                                if (param) {
                                    $scope.unitWidth.model = $scope.unitWidth.find(f => f.volume_Index == param.unitWidth_Index);
                                    $scope.unitLength.model = $scope.unitLength.find(f => f.volume_Index == param.unitLength_Index);
                                    $scope.unitHeight.model = $scope.unitHeight.find(f => f.volume_Index == param.unitHeight_Index);
                                    $scope.calculateVolume($scope.unitWidth.model);
                                }
                            });
                        };
                        function dropdownItemStatus(param) {
                            viewModel.dropdownItemStatus({}).then(function (res) {
                                $scope.dropdownItemStatus = angular.copy(res.data);
                                if (param) {
                                    if(param.documentTypeModel.documentType_Id == '322') //add new
                                    {
                                        $scope.dropdownItemStatus.model = $scope.dropdownItemStatus.find(f => f.itemStatus_Index == 'cdfb5e82-7984-4169-891f-b309ec3ba7c6'); //param.itemStatus_Index_To
                                        $scope.filterItemModel.itemStatus_Index_To = $scope.dropdownItemStatus.model.itemStatus_Index_To;
                                        $scope.filterItemModel.itemStatus_Id_To = $scope.dropdownItemStatus.model.itemStatus_Id_To;
                                        $scope.filterItemModel.itemStatus_Name_To = $scope.dropdownItemStatus.model.itemStatus_Name_To;
                                    } else {
                                        $scope.dropdownItemStatus.model = $scope.dropdownItemStatus.find(f => f.itemStatus_Index == param.itemStatus_Index_To);
                                        $scope.filterItemModel.itemStatus_Index_To = $scope.dropdownItemStatus.model.itemStatus_Index_To;
                                        $scope.filterItemModel.itemStatus_Id_To = $scope.dropdownItemStatus.model.itemStatus_Id_To;
                                        $scope.filterItemModel.itemStatus_Name_To = $scope.dropdownItemStatus.model.itemStatus_Name_To;
                                    }
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
