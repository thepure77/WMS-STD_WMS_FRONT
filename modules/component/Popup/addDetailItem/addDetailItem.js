
(function () {
    'use strict'
    app.directive('addDetailItem', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/component/Popup/addDetailItem/addDetailItem.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'webServiceAPI', 'planGoodsIssueFactory', 'dpMessageBox',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, webServiceAPI, planGoodsIssueFactory, dpMessageBox) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = planGoodsIssueFactory;
                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function () {
                            // $scope.invokes.selected(param);
                            $scope.onShow = false;
                        };

                        $scope.delegates = function (param) {
                            $scope.filterItemModel = angular.copy(param) || {};
                            
                            $scope.filterItemModel.owner_Index = param.owner_Index;
                            dropdownWeight(param);
                            dropdownVolume(param);
                            dropdownCurrency(param);
                            dropdownItemStatus(param);
                        }

                        $scope.addsItem = function (param) {
                            if ($scope.dropdownProductconversion) {
                                if ($scope.dropdownProductconversion.model != null) {
                                    $scope.filterItemModel.productConversion_Index = $scope.dropdownProductconversion.model.productConversion_Index;
                                    $scope.filterItemModel.productConversion_Id = $scope.dropdownProductconversion.model.productConversion_Id;
                                    $scope.filterItemModel.productConversion_Name = $scope.dropdownProductconversion.model.productConversion_Name;
                                    $scope.filterItemModel.ratio = $scope.dropdownProductconversion.model.productconversion_Ratio;
                                }
                                else {
                                    $scope.filterItemModel.productConversion_Index = null;
                                    $scope.filterItemModel.productConversion_Id = null;
                                    $scope.filterItemModel.productConversion_Name = null;
                                    $scope.filterItemModel.ratio = null;
                                }
                            }

                            if ($scope.dropdownItemStatus) {
                                if ($scope.dropdownItemStatus.model != null) {
                                    $scope.filterItemModel.itemStatus_Index = $scope.dropdownItemStatus.model.itemStatus_Index;
                                    $scope.filterItemModel.itemStatus_Id = $scope.dropdownItemStatus.model.itemStatus_Id;
                                    $scope.filterItemModel.itemStatus_Name = $scope.dropdownItemStatus.model.itemStatus_Name;
                                }
                                else {
                                    $scope.filterItemModel.itemStatus_Index = null;
                                    $scope.filterItemModel.itemStatus_Id = null;
                                    $scope.filterItemModel.itemStatus_Name = null;
                                    dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'แจ้งเตือน',
                                            message: 'กรุณาเลือกสถานะสินค้า !'
                                        }
                                    )
                                    return "";
                                }
                            }

                            //#region by dropdown currency
                            if ($scope.unitPrice) {
                                if ($scope.unitPrice.model != null) {
                                    $scope.filterItemModel.unitPrice_Index = $scope.unitPrice.model.currency_Index;
                                    $scope.filterItemModel.unitPrice_Id = $scope.unitPrice.model.currency_Id;
                                    $scope.filterItemModel.unitPrice_Name = $scope.unitPrice.model.currency_Name;
                                }
                                else {
                                    $scope.filterItemModel.unitPrice_Index = null;
                                    $scope.filterItemModel.unitPrice_Id = null;
                                    $scope.filterItemModel.unitPrice_Name = null;
                                }
                            }
                            if ($scope.price) {
                                if ($scope.price.model != null) {
                                    $scope.filterItemModel.price_Index = $scope.price.model.currency_Index;
                                    $scope.filterItemModel.price_Id = $scope.price.model.currency_Id;
                                    $scope.filterItemModel.price_Name = $scope.price.model.currency_Name;
                                }
                                else {
                                    $scope.filterItemModel.price_Index = null;
                                    $scope.filterItemModel.price_Id = null;
                                    $scope.filterItemModel.price_Name = null;
                                }
                            }
                            //#endregion
                            //#region by dropdown Weight
                            if ($scope.dropdownWeight) {
                                if ($scope.dropdownWeight.model != null) {
                                    $scope.filterItemModel.unitWeight_Index = $scope.dropdownWeight.model.weight_Index;
                                    $scope.filterItemModel.unitWeight_Id = $scope.dropdownWeight.model.weight_Id;
                                    $scope.filterItemModel.unitWeight_Name = $scope.dropdownWeight.model.weight_Name;
                                    $scope.filterItemModel.unitWeightRatio = $scope.dropdownWeight.model.weight_Ratio;
                                }
                                else {
                                    $scope.filterItemModel.unitWeight_Index = null;
                                    $scope.filterItemModel.unitWeight_Id = null;
                                    $scope.filterItemModel.unitWeight_Name = null;
                                    $scope.filterItemModel.unitWeightRatio = null;
                                }
                            }

                            if ($scope.dropdownNetWeight) {
                                if ($scope.dropdownNetWeight.model != null) {
                                    $scope.filterItemModel.unitNetWeight_Index = $scope.dropdownNetWeight.model.weight_Index;
                                    $scope.filterItemModel.unitNetWeight_Id = $scope.dropdownNetWeight.model.weight_Id;
                                    $scope.filterItemModel.unitNetWeight_Name = $scope.dropdownNetWeight.model.weight_Name;
                                    $scope.filterItemModel.unitNetWeightRatio = $scope.dropdownNetWeight.model.weight_Ratio;
                                }
                                else {
                                    $scope.filterItemModel.unitNetWeight_Index = null;
                                    $scope.filterItemModel.unitNetWeight_Id = null;
                                    $scope.filterItemModel.unitNetWeight_Name = null;
                                    $scope.filterItemModel.unitNetWeightRatio = null;
                                }
                            }
                            if ($scope.dropdownGrsWeight) {
                                if ($scope.dropdownGrsWeight.model != null) {
                                    $scope.filterItemModel.unitGrsWeight_Index = $scope.dropdownGrsWeight.model.weight_Index;
                                    $scope.filterItemModel.unitGrsWeight_Id = $scope.dropdownGrsWeight.model.weight_Id;
                                    $scope.filterItemModel.unitGrsWeight_Name = $scope.dropdownGrsWeight.model.weight_Name;
                                    $scope.filterItemModel.unitGrsWeightRatio = $scope.dropdownGrsWeight.model.weight_Ratio;
                                }
                                else {
                                    $scope.filterItemModel.unitGrsWeight_Index = null;
                                    $scope.filterItemModel.unitGrsWeight_Id = null;
                                    $scope.filterItemModel.unitGrsWeight_Name = null;
                                    $scope.filterItemModel.unitGrsWeightRatio = null;
                                }
                            }
                            //#endregion
                            //#region by dropdown Width
                            if ($scope.unitWidth) {
                                if ($scope.unitWidth.model != null) {
                                    $scope.filterItemModel.unitWidth_Index = $scope.unitWidth.model.volume_Index;
                                    $scope.filterItemModel.unitWidth_Id = $scope.unitWidth.model.volume_Id;
                                    $scope.filterItemModel.unitWidth_Name = $scope.unitWidth.model.volume_Name;
                                    $scope.filterItemModel.unitWidthRatio = $scope.unitWidth.model.volume_Ratio;
                                }
                                else {
                                    $scope.filterItemModel.unitWidth_Index = null;
                                    $scope.filterItemModel.unitWidth_Id = null;
                                    $scope.filterItemModel.unitWidth_Name = null;
                                    $scope.filterItemModel.unitWidthRatio = null;
                                }
                            }

                            if ($scope.unitLength) {
                                if ($scope.unitLength.model != null) {
                                    $scope.filterItemModel.unitLength_Index = $scope.unitLength.model.volume_Index;
                                    $scope.filterItemModel.unitLength_Id = $scope.unitLength.model.volume_Id;
                                    $scope.filterItemModel.unitLength_Name = $scope.unitLength.model.volume_Name;
                                    $scope.filterItemModel.unitLengthRatio = $scope.unitLength.model.volume_Ratio;
                                }
                                else {
                                    $scope.filterItemModel.unitLength_Index = null;
                                    $scope.filterItemModel.unitLength_Id = null;
                                    $scope.filterItemModel.unitLength_Name = null;
                                    $scope.filterItemModel.unitLengthRatio = null;
                                }
                            }

                            if ($scope.unitHeight) {
                                if ($scope.unitHeight.model != null) {
                                    $scope.filterItemModel.unitHeight_Index = $scope.unitHeight.model.volume_Index;
                                    $scope.filterItemModel.unitHeight_Id = $scope.unitHeight.model.volume_Id;
                                    $scope.filterItemModel.unitHeight_Name = $scope.unitHeight.model.volume_Name;
                                    $scope.filterItemModel.unitHeightRatio = $scope.unitHeight.model.volume_Ratio;
                                }
                                else {
                                    $scope.filterItemModel.unitHeight_Index = null;
                                    $scope.filterItemModel.unitHeight_Id = null;
                                    $scope.filterItemModel.unitHeight_Name = null;
                                    $scope.filterItemModel.unitHeightRatio = null;
                                }
                            }

                            //#endregion

                            if ($scope.filterItemModel.product_Name == undefined || $scope.filterItemModel.product_Index == "") {
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: 'กรุณาเลือกสินค้า !'
                                    }
                                )
                                return "";
                            }

                            if ($scope.dropdownProductconversion.model == null) {
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: 'กรุณาเลือกหน่วย !'
                                    }
                                )
                                return "";
                            }

                            if ($scope.filterItemModel.qty == undefined || $scope.filterItemModel.qty == "") {
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: 'กรุณาเลือกจำนวนสินค้า !'
                                    }
                                )
                                return "";
                            }
                            else {

                                var num = parseFloat($scope.filterItemModel.qty);
                                var n = num.toFixed(3);
                                $scope.filterItemModel.qty = n;
                            }

                            if (!(!isNaN(parseFloat($scope.filterItemModel.qty)) && angular.isNumber(parseFloat($scope.filterItemModel.qty)))) {
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'Validate',
                                        message: 'Please insert number qty !'
                                    }
                                )
                                return "";
                            } else {
                                if (parseFloat($scope.filterItemModel.qty) <= 0) {
                                    dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'Validate',
                                            message: 'Please insert number more than 0 !'
                                        }
                                    )
                                    return "";
                                }
                            }
                            if ($scope.filterItemModel.unitVolume > 0) {
                                $scope.filterItemModel.unitVolume = $scope.unitVolume;
                            }

                            $scope.filterItemModel.qty = parseInt($scope.filterItemModel.qty);

                            $scope.invokes.selected($scope.filterItemModel);
                            $scope.onShow = false;
                            $scope.filterItemModel = {};
                        }

                        $scope.autoComplete = {
                            sku: "AutoPlanGoodIssue/autoSkufilter",
                            product: "AutoPlanGoodIssue/autoProductfilter",
                        };

                        $scope.url = {
                            PlanGI: webServiceAPI.PlanGI,
                        };

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

                        function dropdownCurrency(param) {
                            viewModel.dropdownCurrency({}).then(function (res) {
                                $scope.unitPrice = angular.copy(res.data);
                                $scope.price = angular.copy(res.data);
                                if (param) {
                                    $scope.unitPrice.model = $scope.unitPrice.find(f => f.currency_Index == param.unitPrice_Index);
                                    $scope.price.model = $scope.price.find(f => f.currency_Index == param.price_Index);
                                }
                            });
                        };
                        function dropdownItemStatus(param) {
                            viewModel.dropdownItemStatus({}).then(function (res) {
                                $scope.dropdownItemStatus = angular.copy(res.data);
                                if (param) {
                                    $scope.dropdownItemStatus.model = $scope.dropdownItemStatus.find(f => f.itemStatus_Index == param.itemStatus_Index);
                                    $scope.filterItemModel.itemStatus_Index = $scope.dropdownItemStatus.model.itemStatus_Index;
                                    $scope.filterItemModel.itemStatus_Id = $scope.dropdownItemStatus.model.itemStatus_Id;
                                    $scope.filterItemModel.itemStatus_Name = $scope.dropdownItemStatus.model.itemStatus_Name;
                                }
                            });
                        };

                        $scope.$watch("filterItemModel.product_Name", function () {
                            if ($scope.filterItemModel.product_Id == "" || $scope.filterItemModel.product_Name == ""
                                || $scope.filterItemModel.product_Id == undefined || $scope.filterItemModel.product_Name == undefined) {
                                $scope.dropdownProductconversion.model = {};
                            }
                            else {
                                viewModel.dropdownProductconversion($scope.filterItemModel).then(function (res) {
                                    $scope.dropdownProductconversion = res.data;
                                    $scope.dropdownProductconversion.model = $scope.dropdownProductconversion[0];
                                    for(let pc = 0 ; pc < $scope.dropdownProductconversion.length ; pc++){
                                        if($scope.filterItemModel.productConversion_Name === $scope.dropdownProductconversion[pc].productConversion_Name)
                                        {
                                            debugger;
                                            $scope.dropdownProductconversion.model = $scope.dropdownProductconversion[pc];
                                        }
                                        else
                                        {
                                        }
                                    }
                                    $scope.filterItemModel.productConversion_Index = $scope.dropdownProductconversion.model.productConversion_Index;
                                    $scope.filterItemModel.productConversion_Id = $scope.dropdownProductconversion.model.productConversion_Id;
                                    $scope.filterItemModel.productConversion_Name = $scope.dropdownProductconversion.model.productConversion_Name;
                                    $scope.filterItemModel.ratio = $scope.dropdownProductconversion.model.productConversion_Ratio;

                                    // if (!$scope.filterItemModel.planGoodsIssueItem_Index) {

                                        //#region by values Weight
                                        $scope.dropdownWeight.model = $scope.dropdownWeight.find(f => f.weight_Index == $scope.dropdownProductconversion.model.productConversion_Weight_Index);
                                        $scope.filterItemModel.unitWeight = $scope.dropdownProductconversion.model.productConversion_Weight;
                                        $scope.filterItemModel.unitWeight_Index = $scope.dropdownWeight.model.weight_Index;
                                        $scope.filterItemModel.unitWeight_Id = $scope.dropdownWeight.model.weight_Id;
                                        $scope.filterItemModel.unitWeight_Name = $scope.dropdownWeight.model.weight_Name;
                                        $scope.filterItemModel.unitWeightRatio = $scope.dropdownWeight.model.weight_Ratio;

                                        $scope.dropdownNetWeight.model = $scope.dropdownNetWeight.find(f => f.weight_Index == $scope.dropdownProductconversion.model.productConversion_Weight_Index);
                                        $scope.filterItemModel.unitNetWeight = $scope.dropdownProductconversion.model.productConversion_Weight;
                                        $scope.filterItemModel.unitNetWeight_Index = $scope.dropdownNetWeight.model.weight_Index;
                                        $scope.filterItemModel.unitNetWeight_Id = $scope.dropdownNetWeight.model.weight_Id;
                                        $scope.filterItemModel.unitNetWeight_Name = $scope.dropdownNetWeight.model.weight_Name;
                                        $scope.filterItemModel.unitNetWeightRatio = $scope.dropdownNetWeight.model.weight_Ratio;

                                        $scope.dropdownGrsWeight.model = $scope.dropdownGrsWeight.find(f => f.weight_Index == $scope.dropdownProductconversion.model.productConversion_GrsWeight_Index);
                                        $scope.filterItemModel.unitGrsWeight = $scope.dropdownProductconversion.model.productConversion_GrsWeight;
                                        $scope.filterItemModel.unitGrsWeight_Index = $scope.dropdownGrsWeight.model.weight_Index;
                                        $scope.filterItemModel.unitGrsWeight_Id = $scope.dropdownGrsWeight.model.weight_Id;
                                        $scope.filterItemModel.unitGrsWeight_Name = $scope.dropdownGrsWeight.model.weight_Name;
                                        $scope.filterItemModel.unitGrsWeightRatio = $scope.dropdownGrsWeight.model.weight_Ratio;
                                        //#endregion

                                        //#region by dropdown Width
                                        $scope.unitWidth.model = $scope.unitWidth.find(f => f.volume_Index == $scope.dropdownProductconversion.model.productConversion_Width_Index);
                                        $scope.filterItemModel.unitWidth = $scope.dropdownProductconversion.model.productConversion_Width;
                                        $scope.filterItemModel.unitWidth_Index = $scope.unitWidth.model.volume_Index;
                                        $scope.filterItemModel.unitWidth_Id = $scope.unitWidth.model.volume_Id;
                                        $scope.filterItemModel.unitWidth_Name = $scope.unitWidth.model.volume_Name;
                                        $scope.filterItemModel.unitWidthRatio = $scope.unitWidth.model.volume_Ratio;

                                        $scope.unitLength.model = $scope.unitLength.find(f => f.volume_Index == $scope.dropdownProductconversion.model.productConversion_Length_Index);
                                        $scope.filterItemModel.unitLength = $scope.dropdownProductconversion.model.productConversion_Length;
                                        $scope.filterItemModel.unitLength_Index = $scope.unitLength.model.volume_Index;
                                        $scope.filterItemModel.unitLength_Id = $scope.unitLength.model.volume_Id;
                                        $scope.filterItemModel.unitLength_Name = $scope.unitLength.model.volume_Name;
                                        $scope.filterItemModel.unitLengthRatio = $scope.unitLength.model.volume_Ratio;

                                        $scope.unitHeight.model = $scope.unitHeight.find(f => f.volume_Index == $scope.dropdownProductconversion.model.productConversion_Height_Index);
                                        $scope.filterItemModel.unitHeight = $scope.dropdownProductconversion.model.productConversion_Height;
                                        $scope.filterItemModel.unitHeight_Index = $scope.unitHeight.model.volume_Index;
                                        $scope.filterItemModel.unitHeight_Id = $scope.unitHeight.model.volume_Id;
                                        $scope.filterItemModel.unitHeight_Name = $scope.unitHeight.model.volume_Name;
                                        $scope.filterItemModel.unitHeightRatio = $scope.unitHeight.model.volume_Ratio;

                                        //#endregion
                                    // }
                                });
                            }
                        });

                        $scope.multiplyUnit = function (qty, unit, unitWeight, unitVolume) {
                            if (qty > 0) {
                                // $scope.filterItemModel.totalQty = (qty * unit.productconversion_Ratio).toFixed(3);
                                $scope.filterItemModel.unitNetWeight = (qty * unitWeight);
                                $scope.calculateVolume(unitVolume);
                                $scope.calculateValuesCurrency();
                                $scope.changeUnit(unit,qty);
                            }
                            else {
                                $scope.filterItemModel.totalQty = 0
                            }
                        }

                        $scope.changeUnit = function (unit,param) {
                            if (unit) {
                                $scope.filterItemModel.productConversion_Name = unit.productConversion_Name;
                                $scope.filterItemModel.totalQty = (parseInt(param) * unit.productconversion_Ratio).toFixed(3);
                            }
                            else {
                                $scope.filterItemModel.productConversion_Name = '';
                                $scope.filterItemModel.totalQty = 0;
                            }
                        }

                        $scope.calculateVolume = function (unit) {
                            $scope.unitWidth.model = $scope.unitWidth.find(f => f.volume_Index == unit.volume_Index);
                            $scope.unitLength.model = $scope.unitLength.find(f => f.volume_Index == unit.volume_Index);
                            $scope.unitHeight.model = $scope.unitHeight.find(f => f.volume_Index == unit.volume_Index);
                            if (unit) {
                                $scope.filterItemModel.unitVolume = (($scope.filterItemModel.qty * (($scope.filterItemModel.unitWidth * $scope.filterItemModel.unitLength * $scope.filterItemModel.unitHeight) / unit.volume_Ratio)) / 1000000).toFixed(10);
                                $scope.unitVolume = ($scope.filterItemModel.qty * (($scope.filterItemModel.unitWidth * $scope.filterItemModel.unitLength * $scope.filterItemModel.unitHeight) / unit.volume_Ratio))
                            }
                        }

                        $scope.calculateCurrency = function (param) {
                            $scope.unitPrice.model = $scope.unitPrice.find(f => f.currency_Index == param.currency_Index);
                            $scope.price.model = $scope.price.find(f => f.currency_Index == param.currency_Index);
                        }
                        $scope.calculateValuesCurrency = function (param) {
                            $scope.filterItemModel.price = ($scope.filterItemModel.qty * $scope.filterItemModel.unitPrice);
                        }

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
