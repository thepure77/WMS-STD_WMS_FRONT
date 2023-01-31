
(function () {
    'use strict'
    app.directive('grItem', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/GR/GR/component/grItem.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'webServiceAPI', 'goodsReceiveFactory', 'dpMessageBox',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, webServiceAPI, goodsReceiveFactory, dpMessageBox) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = goodsReceiveFactory;
                        $scope.onShow = false;
                        $scope.filterItemModel = {};
                        $scope.chk = {};
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function () {
                            $scope.onShow = false;
                            //$scope.filterItemModel = {};

                        };

                        $scope.delegates = function (param) {
                        
                            $scope.filterItemModel = {};

                            if (param.rowItemIndex != undefined || param.rowItemIndex != null) {

                                $scope.filterItemModel = param;

                                $scope.filterItemModel.netWeight = param.weight;

                                // param.netWeight = parseFloat(param.weight);
                                // $scope.filterItemModel.netWeight  = param.netWeight.toFixed(2);


                                var currency = $scope.dropdownCurrency
                                const resultcurrency = currency.filter((currency) => {
                                    return currency.currency_Index == param.currency_Index;
                                })
                                $scope.dropdownCurrency.priceModel = resultcurrency[0]

                                var volume = $scope.dropdownVolume
                                const resultvolume = volume.filter((volume) => {
                                    return volume.volume_Index == param.width_Index;
                                })
                                $scope.dropdownVolume.model = resultvolume[0];


                                var ItemStatus = $scope.dropdownItemStatus;
                                const resultItemStatus = ItemStatus.filter((ItemStatus) => {
                                    return ItemStatus.itemStatus_Index == param.itemStatus_Index;
                                })
                                $scope.dropdownItemStatus.model = resultItemStatus[0];
                                $scope.IsNew = 0;

                                viewModel.dropdownProductconversion($scope.filterItemModel).then(function (res) {
                                    $scope.dropdownProductconversion = res.data;

                                    var Productconversion = $scope.dropdownProductconversion
                                    const resultProductconversion = Productconversion.filter((Productconversion) => {
                                        return Productconversion.productConversion_Index == param.productConversion_Index;
                                    })
                                    $scope.dropdownProductconversion.model = resultProductconversion[0];
debugger
                                    $scope.filterItemModel.netWeight = $scope.filterItemModel.qty * $scope.dropdownProductconversion.model.productConversion_Weight;
                                    $scope.filterItemModel.grsWeight = $scope.filterItemModel.qty * $scope.dropdownProductconversion.model.productConversion_GrsWeight;
                                    $scope.filterItemModel.totalQty = $scope.filterItemModel.qty * $scope.dropdownProductconversion.model.productconversion_Ratio;
                                    $scope.filterItemModel.totalPrice = $scope.filterItemModel.qty * $scope.filterItemModel.unitPrice;
                                    var numQty = parseFloat($scope.filterItemModel.qty);
                                    $scope.filterItemModel.netWeight = parseFloat($scope.filterItemModel.netWeight);
                                    $scope.filterItemModel.netWeight = $scope.filterItemModel.netWeight.toFixed(2);
                                    $scope.Cal();
                                    $scope.chk.isExpDate = param.isExpDate;
                                    $scope.chk.isMfgDate = param.isMfgDate;
                                    $scope.chk.isLot = param.isLot;
    
                                });
                            }
                            else {
                                $scope.filterItemModel.owner_Index = param.owner_Index;
                                $scope.IsNew = 1;

                            }
                            if (param.documentType_Index != undefined) {
                                if (param.documentType_Index == "4efc0190-61cf-4bdf-8af7-01edd8d575c3" || param.documentType_Index == "1017c6b2-61df-4236-a32e-412791b9dbeb" || param.documentType_Index == 'b95c5445-37ca-4433-a717-79be150af2f7' || param.documentType_Index == '39c4d246-4a94-404c-90c3-af5ab9e96e14') {
                                    $scope.filterItemModel.erp_location = 'RECM'
                                }
                                if (param.documentType_Index == "713a4e87-30fb-4750-bf9d-6995e28e71eb")
                                {
                                    $scope.filterItemModel.erp_location = 'AB01'
                                }
                            }
                        }

                        $scope.addsItem = function (param) {

                            param.netWeight = parseFloat(param.netWeight);
                            // $scope.filterItemModel.weight = param.netWeight;
                            $scope.filterItemModel.weight = param.netWeight.toFixed(2);

                            if ($scope.dropdownProductconversion.model != null) {
                                param.productConversion_Index = $scope.dropdownProductconversion.model.productConversion_Index;
                                param.productConversion_Id = $scope.dropdownProductconversion.model.productConversion_Id;
                                param.productConversion_Name = $scope.dropdownProductconversion.model.productConversion_Name;
                                param.ratio = $scope.dropdownProductconversion.model.productconversion_Ratio;
                            }

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

                                $scope.filterItemModel.qty = parseFloat($scope.filterItemModel.qty);
                                // var n = num.toFixed(3);
                                // $scope.filterItemModel.qty = n;
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

                            if ($scope.dropdownWeight.weightModel != null) {
                                $scope.filterItemModel.weight_Index = $scope.dropdownWeight.weightModel.weight_Index;
                                $scope.filterItemModel.weight_Id = $scope.dropdownWeight.weightModel.weight_Id;
                                $scope.filterItemModel.weight_Name = $scope.dropdownWeight.weightModel.weight_Name;
                                $scope.filterItemModel.weightRatio = $scope.dropdownWeight.weightModel.weight_Ratio;
                            }

                            if ($scope.dropdownItemStatus.model != null) {
                                $scope.filterItemModel.itemStatus_Index = $scope.dropdownItemStatus.model.itemStatus_Index;
                                $scope.filterItemModel.itemStatus_Id = $scope.dropdownItemStatus.model.itemStatus_Id;
                                $scope.filterItemModel.itemStatus_Name = $scope.dropdownItemStatus.model.itemStatus_Name;
                            }
                            else {
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'ALERT',
                                        message: 'MSG_Alert_ItemStatus'
                                    }
                                )
                                return "";
                            }

                            if ($scope.chk.isLot == 1) {
                                if ($scope.filterItemModel.product_Lot == null
                                    || $scope.filterItemModel.product_Lot == undefined
                                    || $scope.filterItemModel.product_Lot == "") {
                                    dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'ALERT',
                                            message: 'MSG_Alert_ProductLot'
                                        }
                                    )
                                    return "";
                                }
                                // $scope.onShow = true;
                            }

                            if ($scope.chk.isMfgDate == 1) {
                                if ($scope.filterItemModel.mfg_Date == null
                                    || $scope.filterItemModel.mfg_Date == undefined
                                    || $scope.filterItemModel.mfg_Date == "") {
                                    dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'ALERT',
                                            message: 'MSG_Alert_MFGDATE'
                                        }
                                    )
                                    return "";
                                }
                                // $scope.onShow = true;
                            }
                            if ($scope.chk.isExpDate == 1) {
                                if ($scope.filterItemModel.exp_Date == null
                                    || $scope.filterItemModel.exp_Date == undefined
                                    || $scope.filterItemModel.exp_Date == "") {
                                    dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'ALERT',
                                            message: 'MSG_Alert_EXPDATE'
                                        }
                                    )
                                    return "";
                                }
                                // $scope.onShow = true;
                            }
                            

                            if ($scope.dropdownWeight.grsWeightModel != null) {
                                $scope.filterItemModel.grsWeight_Index = $scope.dropdownWeight.grsWeightModel.weight_Index;
                                $scope.filterItemModel.grsWeight_Id = $scope.dropdownWeight.grsWeightModel.weight_Id;
                                $scope.filterItemModel.grsWeight_Name = $scope.dropdownWeight.grsWeightModel.weight_Name;
                                $scope.filterItemModel.grsWeightRatio = $scope.dropdownWeight.grsWeightModel.weight_Ratio;
                            }

                            if ($scope.dropdownVolume.model != null) {
                                $scope.filterItemModel.width_Index = $scope.dropdownVolume.model.volume_Index;
                                $scope.filterItemModel.width_Id = $scope.dropdownVolume.model.volume_Id;
                                $scope.filterItemModel.width_Name = $scope.dropdownVolume.model.volume_Name;
                                $scope.filterItemModel.widthRatio = $scope.dropdownVolume.model.volume_Ratio;

                                $scope.filterItemModel.length_Index = $scope.dropdownVolume.model.volume_Index;
                                $scope.filterItemModel.length_Id = $scope.dropdownVolume.model.volume_Id;
                                $scope.filterItemModel.length_Name = $scope.dropdownVolume.model.volume_Name;
                                $scope.filterItemModel.lengthRatio = $scope.dropdownVolume.model.volume_Ratio;

                                $scope.filterItemModel.height_Index = $scope.dropdownVolume.model.volume_Index;
                                $scope.filterItemModel.height_Id = $scope.dropdownVolume.model.volume_Id;
                                $scope.filterItemModel.height_Name = $scope.dropdownVolume.model.volume_Name;
                                $scope.filterItemModel.heightRatio = $scope.dropdownVolume.model.volume_Ratio;

                            }

                            if ($scope.dropdownCurrency.priceModel != null) {
                                $scope.filterItemModel.currency_Index = $scope.dropdownCurrency.priceModel.currency_Index;
                                $scope.filterItemModel.currency_Id = $scope.dropdownCurrency.priceModel.currency_Id;
                                $scope.filterItemModel.currency_Name = $scope.dropdownCurrency.priceModel.currency_Name;
                            }

                            if ($scope.dropdownCurrency.tax1Model != null) {
                                $scope.filterItemModel.tax1_Currency_Index = $scope.dropdownCurrency.tax1Model.currency_Index;
                                $scope.filterItemModel.tax1_Currency_Id = $scope.dropdownCurrency.tax1Model.currency_Id;
                                $scope.filterItemModel.tax1_Currency_Name = $scope.dropdownCurrency.tax1Model.currency_Name;
                            }

                            if ($scope.dropdownCurrency.tax2Model != null) {
                                $scope.filterItemModel.tax2_Currency_Index = $scope.dropdownCurrency.tax2Model.currency_Index;
                                $scope.filterItemModel.tax2_Currency_Id = $scope.dropdownCurrency.tax2Model.currency_Id;
                                $scope.filterItemModel.tax2_Currency_Name = $scope.dropdownCurrency.tax2Model.currency_Name;
                            }

                            if ($scope.dropdownCurrency.tax3Model != null) {
                                $scope.filterItemModel.tax3_Currency_Index = $scope.dropdownCurrency.tax3Model.currency_Index;
                                $scope.filterItemModel.tax3_Currency_Id = $scope.dropdownCurrency.tax3Model.currency_Id;
                                $scope.filterItemModel.tax3_Currency_Name = $scope.dropdownCurrency.tax3Model.currency_Name;
                            }

                            if ($scope.dropdownCurrency.tax4Model != null) {
                                $scope.filterItemModel.tax4_Currency_Index = $scope.dropdownCurrency.tax4Model.currency_Index;
                                $scope.filterItemModel.tax4_Currency_Id = $scope.dropdownCurrency.tax4Model.currency_Id;
                                $scope.filterItemModel.tax4_Currency_Name = $scope.dropdownCurrency.tax4Model.currency_Name;
                            }

                            $scope.invokes.selected($scope.filterItemModel);
                            $scope.onShow = false;
                            $scope.filterItemModel = {};
                        }

                        $scope.$watch("filterItemModel.product_Name", function () {

                            $scope.chk.isExpDate = $scope.filterItemModel.isExpDate;
                            $scope.chk.isMfgDate = $scope.filterItemModel.isMfgDate;
                            $scope.chk.isLot = $scope.filterItemModel.isLot;
                            if ($scope.filterItemModel.product_Id == "" || $scope.filterItemModel.product_Name == ""
                                || $scope.filterItemModel.product_Id == undefined || $scope.filterItemModel.product_Name == undefined) {
                                $scope.dropdownProductconversion.model = {};
                            }
                            else {

                                if($scope.IsNew == 1)
                                {
                                    viewModel.dropdownProductconversion($scope.filterItemModel).then(function (res) {
                                        $scope.dropdownProductconversion = res.data;
                                        $scope.dropdownProductconversion.model = $scope.dropdownProductconversion[0];
                                        
                                        $scope.filterItemModel.weightUnit = $scope.dropdownProductconversion.model.productConversion_Weight;
    
                                        $scope.filterItemModel.productConversion_Name = $scope.dropdownProductconversion.model.productConversion_Name;
    
                                        if ($scope.IsNew == 1) {
                                            $scope.filterItemModel.unitWidth = $scope.dropdownProductconversion.model.productConversion_Width;
                                            $scope.filterItemModel.unitLength = $scope.dropdownProductconversion.model.productConversion_Length;
                                            $scope.filterItemModel.unitHeight = $scope.dropdownProductconversion.model.productConversion_Height;
                                            $scope.filterItemModel.volumeUnit = $scope.filterItemModel.unitWidth * $scope.filterItemModel.unitLength * $scope.filterItemModel.unitHeight;
    
                                            var volume = $scope.dropdownVolume
                                            const resultvolume = volume.filter((volume) => {
                                                return volume.volume_Index == $scope.dropdownProductconversion[0].productConversion_Volume_Index;
                                            })
                                            $scope.dropdownVolume.model = resultvolume[0];
                                            $scope.filterItemModel.volume_Ratio = $scope.dropdownVolume.model.volume_Ratio;
    
                                        }
    
                                        var weight = $scope.dropdownWeight
                                        const resultweight = weight.filter((weight) => {
                                            return weight.weight_Index == $scope.dropdownProductconversion[0].productConversion_Weight_Index;
                                        })
                                        $scope.dropdownWeight.weightModel = resultweight[0];
                                        $scope.dropdownWeight.netWeightModel = resultweight[0];
                                        $scope.dropdownWeight.grsWeightModel = resultweight[0];
    
                                    });
                                }

                            }
                        });

                        $scope.$watch("filterItemModel.qty", function () {
                            if ($scope.filterItemModel.qty != undefined) {
                                var myInput = document.querySelector('#fixed3');
                                myInput.value = myInput.value.replace(/(\.\d{2})\d+/g, '$1');

                                $scope.filterItemModel.netWeight = $scope.filterItemModel.qty * $scope.dropdownProductconversion.model.productConversion_Weight;
                                $scope.filterItemModel.grsWeight = $scope.filterItemModel.qty * $scope.dropdownProductconversion.model.productConversion_GrsWeight;
                                $scope.filterItemModel.totalQty = $scope.filterItemModel.qty * $scope.dropdownProductconversion.model.productconversion_Ratio;
                                $scope.filterItemModel.totalPrice = $scope.filterItemModel.qty * $scope.filterItemModel.unitPrice;
                                var numQty = parseFloat($scope.filterItemModel.qty);
                                $scope.filterItemModel.netWeight = parseFloat($scope.filterItemModel.netWeight);
                                $scope.filterItemModel.netWeight = $scope.filterItemModel.netWeight.toFixed(2);
                                $scope.Cal();

                                // $scope.filterItemModel.volumeUnit = (numQty * (($scope.filterItemModel.unitWidth * $scope.filterItemModel.unitLength * $scope.filterItemModel.unitHeight) / $scope.dropdownVolume.model.volume_Ratio) /1000000)
                                // $scope.filterItemModel.volume =  (numQty * (($scope.filterItemModel.unitWidth * $scope.filterItemModel.unitLength * $scope.filterItemModel.unitHeight) / $scope.dropdownVolume.model.volume_Ratio) /1000000);
                                // var Vn = $scope.filterItemModel.volume.toFixed(2);
                                // var volumeNum = parseFloat(Vn);
                                // $scope.filterItemModel.volume = volumeNum;
                            }

                        });

                        // $scope.$watch('filterItemModel.qty', function () {
                        //     if ($scope.filterItemModel.qty != null && $scope.filterItemModel.qty != "" && $scope.filterItemModel.qty != undefined) {

                        //     }
                        // });


                        $scope.$watch("filterItemModel.unitWidth", function () {
                            if ($scope.filterItemModel.unitWidth != undefined) {
                                // $scope.filterItemModel.unitWidth * $scope.filterItemModel.unitLength * $scope.filterItemModel.unitHeight;
                                // $scope.filterItemModel.volume = $scope.filterItemModel.unitWidth * $scope.filterItemModel.unitLength * $scope.filterItemModel.unitHeight;
                                // var numQty = parseFloat($scope.filterItemModel.qty);
                                // $scope.filterItemModel.volumeUnit = (numQty * (($scope.filterItemModel.unitWidth * $scope.filterItemModel.unitLength * $scope.filterItemModel.unitHeight) / $scope.dropdownVolume.model.volume_Ratio) /1000000)
                                
                                // var Vn = $scope.filterItemModel.volumeUnit.toFixed(2);
                                // var volumeNum = parseFloat(Vn);
                                // $scope.filterItemModel.volume = volumeNum;
                            }
                        });

                        $scope.$watch("filterItemModel.unitLength", function () {
                            if ($scope.filterItemModel.unitLength != undefined) {
                                $scope.Cal();
                                // $scope.filterItemModel.volume = $scope.filterItemModel.unitWidth * $scope.filterItemModel.unitLength * $scope.filterItemModel.unitHeight;
                                // var numQty = parseFloat($scope.filterItemModel.qty);
                                // $scope.filterItemModel.volumeUnit = (numQty * (($scope.filterItemModel.unitWidth * $scope.filterItemModel.unitLength * $scope.filterItemModel.unitHeight) / $scope.dropdownVolume.model.volume_Ratio) /1000000)
                                
                                // var Vn = $scope.filterItemModel.volumeUnit.toFixed(2);
                                // var volumeNum = parseFloat(Vn);
                                // $scope.filterItemModel.volume = volumeNum;
                            }
                        });

                        $scope.$watch("filterItemModel.unitHeight", function () {
                            if ($scope.filterItemModel.unitHeight != undefined) {
                                $scope.Cal();
                                // var numQty = parseFloat($scope.filterItemModel.qty);
                                // $scope.filterItemModel.volume = $scope.filterItemModel.unitWidth * $scope.filterItemModel.unitLength * $scope.filterItemModel.unitHeight;
                                // $scope.filterItemModel.volumeUnit = (numQty * (($scope.filterItemModel.unitWidth * $scope.filterItemModel.unitLength * $scope.filterItemModel.unitHeight) / $scope.dropdownVolume.model.volume_Ratio) /1000000)

                                // var Vn = $scope.filterItemModel.volumeUnit.toFixed(2);
                                // var volumeNum = parseFloat(Vn);
                                // $scope.filterItemModel.volume = volumeNum;
                            }
                        });

                        $scope.$watch("filterItemModel.unitPrice", function () {
                            if ($scope.filterItemModel.unitPrice != undefined) {
                                $scope.filterItemModel.totalPrice = $scope.filterItemModel.unitPrice * $scope.filterItemModel.qty;
                            }
                        });

                        $scope.$watch("dropdownVolume.model", function () {
                            if ($scope.dropdownVolume.model != undefined) {
                                $scope.filterItemModel.volume_Ratio = $scope.dropdownVolume.model.volume_Ratio;
                                $scope.Cal();
                                // $scope.filterItemModel.volumeUnit = (numQty * (($scope.filterItemModel.unitWidth * $scope.filterItemModel.unitLength * $scope.filterItemModel.unitHeight) / $scope.dropdownVolume.model.volume_Ratio) /1000000)

                                // var Vn = $scope.filterItemModel.volumeUnit.toFixed(2);
                                // var volumeNum = parseFloat(Vn);
                                // $scope.filterItemModel.volume = volumeNum;
                            }
                        });

                        $scope.dropdownWeight = function () {
                            viewModel.dropdownWeight($scope.filterItemModel).then(function (res) {
                                $scope.dropdownWeight = res.data;
                            });
                        };

                        $scope.dropdownCurrency = function () {
                            viewModel.dropdownCurrency($scope.filterItemModel).then(function (res) {
                                $scope.dropdownCurrency = res.data;
                            });
                        };

                        $scope.dropdownVolume = function () {
                            viewModel.dropdownVolume($scope.filterItemModel).then(function (res) {
                                $scope.dropdownVolume = res.data;
                            });
                        };

                        $scope.dropdownProductconversion = function () {
                            viewModel.dropdownProductconversion($scope.filterItemModel).then(function (res) {
                                $scope.dropdownProductconversion = res.data;

                            });
                        };
                        $scope.dropdownItemStatus = function () {
                            viewModel.dropdownItemStatus($scope.filterItemModel).then(function (res) {
                                $scope.dropdownItemStatus = res.data;
                            });
                        };

                        $scope.Cal = function () {
                            var numQty = parseFloat($scope.filterItemModel.qty);
                            $scope.filterItemModel.volume = $scope.filterItemModel.unitWidth * $scope.filterItemModel.unitLength * $scope.filterItemModel.unitHeight;
                            $scope.filterItemModel.volumeUnit = (numQty * (($scope.filterItemModel.unitWidth * $scope.filterItemModel.unitLength * $scope.filterItemModel.unitHeight) / $scope.dropdownVolume.model.volume_Ratio) /1000000)
                            var Vn = $scope.filterItemModel.volumeUnit.toFixed(2);
                            var volumeNum = parseFloat(Vn);
                            $scope.filterItemModel.volume = volumeNum;
                        };

                        $scope.autoComplete = {
                            productName: "GoodsReceive/autoProduct",
                            productId: "GoodsReceive/autoSKU",
                        };


                        $scope.url = {
                            GR: webServiceAPI.GR,
                        };


                        var init = function () {
                            $scope.dropdownWeight();
                            $scope.dropdownCurrency();
                            $scope.dropdownVolume();
                            $scope.dropdownProductconversion();
                            $scope.dropdownItemStatus();

                        };

                        init();

                    }
                ],
                link: function ($scope, $element, $attributes) { }
            };
        }
    ]);
}());
