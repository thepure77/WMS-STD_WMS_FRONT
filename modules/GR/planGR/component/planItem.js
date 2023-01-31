
(function () {
    'use strict'
    app.directive('planItem', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/GR/planGR/component/planItem.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'webServiceAPI', 'planGoodsReceiveFactory', 'dpMessageBox',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, webServiceAPI, planGoodsReceiveFactory, dpMessageBox) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = planGoodsReceiveFactory;
                        $scope.onShow = false;
                        $scope.filterItemModel = {};
                        $scope.IsNew = 1;
                        $scope.chk = {};
                        // $scope.filterModel = {};

                        // $scope.onHide = function (param) {
                        // };
                        $scope.onClose = function () {
                            $scope.onShow = false;
                            $scope.filterItemModel = {};
                        };

                        $scope.delegates = function (param) {
                            $scope.chk.isLot = 0;
                            $scope.filterItemModel = {};
                            
                            if (param.rowItemIndex != undefined || param.rowItemIndex != null) {
                                $scope.filterItemModel = param;

                                var Productconversion = $scope.dropdownProductconversion
                                const resultProductconversion = Productconversion.filter((Productconversion) => {
                                    return param.productConversion_Index == $scope.dropdownProductconversion[0].productConversion_Index;
                                })
                                $scope.dropdownProductconversion.model = resultProductconversion[0]

                                var currency = $scope.dropdownCurrency
                                const resultcurrency = currency.filter((currency) => {
                                    return param.currency_Index == $scope.dropdownCurrency[0].currency_Index;
                                })
                                $scope.dropdownCurrency.priceModel = resultcurrency[0]
                                

                                var volume = $scope.dropdownVolume
                                const resultvolume = volume.filter((volume) => {
                                    return volume.volume_Index == $scope.dropdownProductconversion[0].productConversion_Volume_Index;
                                })
                                $scope.dropdownVolume.model = resultvolume[0];

                                

                                $scope.IsNew = 0;
                            }
                            else {
                                $scope.filterItemModel.owner_Index = param.owner_Index;
                                $scope.IsNew = 1;

                            }

                        }

                        $scope.addsItem = function (param) {
                            viewModel.checkProduct($scope.filterItemModel).then(function (res) {
                                
                                if(res.data == false)
                                {
                                    dpMessageBox.alert(
                                        {
                                            ok: 'Close',
                                            title: 'แจ้งเตือน',
                                            message: 'ไม่พบสินค้าในระบบ !'
                                        }
                                    )
                                    return "";
                                }
                                else{
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
                                        // var n = num.toFixed(2);
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

                                        if ((parseFloat($scope.filterItemModel.qty)  * parseFloat($scope.filterItemModel.ratio)).toFixed(6) > parseFloat($scope.filterItemModel.remainingPO_Qty)) {
                                            dpMessageBox.alert(
                                                {
                                                    ok: 'Close',
                                                    title: 'Validate',
                                                    message: 'ไม่สามารถกรอกจำนวนเกิน PO ที่คงเหลือได้'
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
        
                                    $scope.filterItemModel.unitWidth = parseFloat($scope.filterItemModel.unitWidth);
                                    $scope.filterItemModel.unitLength = parseFloat($scope.filterItemModel.unitLength);
                                    $scope.filterItemModel.unitHeight = parseFloat($scope.filterItemModel.unitHeight);
        
                                    $scope.invokes.selected($scope.filterItemModel);
                                    $scope.onShow = false;
                                    $scope.filterItemModel = {};
                                }
                            },
                            function error(res) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'ไม่พบสินค้าในระบบ !'
                                })
                            });


                        }


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
                                            ;
                                            $scope.dropdownProductconversion.model = $scope.dropdownProductconversion[pc];
                                        }
                                        else
                                        {
                                        }
                                    }
                                    $scope.filterItemModel.unitWeight = $scope.dropdownProductconversion.model.productConversion_Weight;

                                    $scope.filterItemModel.productConversion_Name = $scope.dropdownProductconversion.model.productConversion_Name;

                                    if ($scope.IsNew == 1) {

                                        $scope.chk.isLot = parseFloat($scope.filterItemModel.IsLot);
                                        
                                        $scope.filterItemModel.unitWidth = $scope.dropdownProductconversion.model.productConversion_Width;
                                        $scope.filterItemModel.unitLength = $scope.dropdownProductconversion.model.productConversion_Length;
                                        $scope.filterItemModel.unitHeight = $scope.dropdownProductconversion.model.productConversion_Height;
                                        $scope.filterItemModel.unitVolume = $scope.filterItemModel.unitWidth * $scope.filterItemModel.unitLength * $scope.filterItemModel.unitHeight;

                                        $scope.filterItemModel.unitWidth = $scope.filterItemModel.unitWidth.toFixed(2);
                                        $scope.filterItemModel.unitLength = $scope.filterItemModel.unitLength.toFixed(2);
                                        $scope.filterItemModel.unitHeight = $scope.filterItemModel.unitHeight.toFixed(2);

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
                        });

                        $scope.$watch("filterItemModel.qty", function () {
                            
                            if($scope.filterItemModel.defult_qty != undefined){
                                if($scope.filterItemModel.defult_qty < $scope.filterItemModel.qty){
                                    $scope.filterItemModel.qty = 0
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'แจ้งเตือน',
                                        message: 'ไม่สามารถรับเข้าเกินที่เบิกออกได้ !'
                                    })
                                    return ''
                                }
                            } 

                            if ((parseFloat($scope.filterItemModel.qty) * parseFloat($scope.filterItemModel.ratio)).toFixed(6)  > parseFloat($scope.filterItemModel.remainingPO_Qty)) {
                                $scope.filterItemModel.qty = 0
                                dpMessageBox.alert(
                                    {
                                        ok: 'Close',
                                        title: 'Validate',
                                        message: 'ไม่สามารถกรอกจำนวนเกิน PO ที่คงเหลือได้'
                                    }
                                )
                                return "";
                            }
                        });


                        $scope.$watch("filterItemModel.product_Id", function () {

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
                                            ;
                                            $scope.dropdownProductconversion.model = $scope.dropdownProductconversion[pc];
                                        }
                                        else
                                        {
                                        }
                                    }
                                    $scope.filterItemModel.unitWeight = $scope.dropdownProductconversion.model.productConversion_Weight;

                                    $scope.filterItemModel.productConversion_Name = $scope.dropdownProductconversion.model.productConversion_Name;

                                    if ($scope.IsNew == 1) {

                                        $scope.chk.isLot = parseFloat($scope.filterItemModel.IsLot);
                                        
                                        $scope.filterItemModel.unitWidth = $scope.dropdownProductconversion.model.productConversion_Width;
                                        $scope.filterItemModel.unitLength = $scope.dropdownProductconversion.model.productConversion_Length;
                                        $scope.filterItemModel.unitHeight = $scope.dropdownProductconversion.model.productConversion_Height;
                                        $scope.filterItemModel.unitVolume = $scope.filterItemModel.unitWidth * $scope.filterItemModel.unitLength * $scope.filterItemModel.unitHeight;

                                        $scope.filterItemModel.unitWidth = $scope.filterItemModel.unitWidth.toFixed(2);
                                        $scope.filterItemModel.unitLength = $scope.filterItemModel.unitLength.toFixed(2);
                                        $scope.filterItemModel.unitHeight = $scope.filterItemModel.unitHeight.toFixed(2);

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
                        });

                        $scope.$watch("filterItemModel.qty", function () {
                            if ($scope.filterItemModel.qty != undefined) {

                                var numQty = parseFloat($scope.filterItemModel.qty);

                                $scope.filterItemModel.netWeight = numQty * $scope.dropdownProductconversion.model.productConversion_Weight;
                                $scope.filterItemModel.grsWeight = numQty * $scope.dropdownProductconversion.model.productConversion_GrsWeight;
                                $scope.filterItemModel.totalQty = numQty * $scope.dropdownProductconversion.model.productconversion_Ratio;
                                $scope.filterItemModel.totalPrice = numQty * $scope.filterItemModel.unitPrice;
                                var w = parseFloat($scope.filterItemModel.unitWidth);
                                var l = parseFloat($scope.filterItemModel.unitLength);
                                var h = parseFloat($scope.filterItemModel.unitHeight);
                                // $scope.filterItemModel.volume = numQty * ((w * l * h) / $scope.dropdownVolume.model.volume_Ratio)
                                $scope.filterItemModel.volume = (numQty * ((w * l * h) / $scope.dropdownVolume.model.volume_Ratio)/1000000)

                                var Vn = $scope.filterItemModel.volume.toFixed(2);
                                var volumeNum = parseFloat(Vn);
                                $scope.filterItemModel.volume = volumeNum;

                            }

                        });

                        $scope.$watch('filterItemModel.qty', function () {
                            if ($scope.filterItemModel.qty != null && $scope.filterItemModel.qty != "" && $scope.filterItemModel.qty != undefined) {
                                var myInput = document.querySelector('#fixed3');
                                myInput.value = myInput.value.replace(/(\.\d{2})\d+/g, '$1');
                            }
                        });


                        $scope.$watch("filterItemModel.unitWidth", function () {
                            if ($scope.filterItemModel.unitWidth != undefined) {
                                $scope.filterItemModel.unitVolume = $scope.filterItemModel.unitWidth * $scope.filterItemModel.unitLength * $scope.filterItemModel.unitHeight;
                                $scope.filterItemModel.unitWidth * $scope.filterItemModel.unitLength * $scope.filterItemModel.unitHeight;
                                var numQty = parseFloat($scope.filterItemModel.qty);

                                var w = parseFloat($scope.filterItemModel.unitWidth);
                                var l = parseFloat($scope.filterItemModel.unitLength);
                                var h = parseFloat($scope.filterItemModel.unitHeight);
                                // $scope.filterItemModel.volume = numQty * ((w * l * h) / $scope.dropdownVolume.model.volume_Ratio)
                                $scope.filterItemModel.volume = (numQty * ((w * l * h) / $scope.dropdownVolume.model.volume_Ratio)/1000000)

                                var myInput = document.querySelector('#w2');
                                myInput.value = myInput.value.replace(/(\.\d{2})\d+/g, '$1');

                                var Vn = $scope.filterItemModel.volume.toFixed(2);
                                var volumeNum = parseFloat(Vn);
                                $scope.filterItemModel.volume = volumeNum;
                            }
                        });

                        $scope.$watch("filterItemModel.unitLength", function () {
                            if ($scope.filterItemModel.unitLength != undefined) {
                                $scope.filterItemModel.unitVolume = $scope.filterItemModel.unitWidth * $scope.filterItemModel.unitLength * $scope.filterItemModel.unitHeight;
                                var numQty = parseFloat($scope.filterItemModel.qty);
                                var w = parseFloat($scope.filterItemModel.unitWidth);
                                var l = parseFloat($scope.filterItemModel.unitLength);
                                var h = parseFloat($scope.filterItemModel.unitHeight);
                                // $scope.filterItemModel.volume = numQty * ((w * l * h) / $scope.dropdownVolume.model.volume_Ratio)
                                $scope.filterItemModel.volume = (numQty * ((w * l * h) / $scope.dropdownVolume.model.volume_Ratio)/1000000)

                                var myInput = document.querySelector('#l2');
                                myInput.value = myInput.value.replace(/(\.\d{2})\d+/g, '$1');

                                var Vn = $scope.filterItemModel.volume.toFixed(2);
                                var volumeNum = parseFloat(Vn);
                                $scope.filterItemModel.volume = volumeNum;
                            }
                        });

                        $scope.$watch("filterItemModel.unitHeight", function () {
                            if ($scope.filterItemModel.unitHeight != undefined) {
                                $scope.filterItemModel.unitVolume = $scope.filterItemModel.unitWidth * $scope.filterItemModel.unitLength * $scope.filterItemModel.unitHeight;
                                var numQty = parseFloat($scope.filterItemModel.qty);
                                var w = parseFloat($scope.filterItemModel.unitWidth);
                                var l = parseFloat($scope.filterItemModel.unitLength);
                                var h = parseFloat($scope.filterItemModel.unitHeight);
                                // $scope.filterItemModel.volume = numQty * ((w * l * h) / $scope.dropdownVolume.model.volume_Ratio)
                                $scope.filterItemModel.volume = (numQty * ((w * l * h) / $scope.dropdownVolume.model.volume_Ratio)/1000000)
                                var myInput = document.querySelector('#h2');
                                myInput.value = myInput.value.replace(/(\.\d{2})\d+/g, '$1');

                                var Vn = $scope.filterItemModel.volume.toFixed(2);
                                var volumeNum = parseFloat(Vn);
                                $scope.filterItemModel.volume = volumeNum;
                            }
                        });

                        $scope.$watch("filterItemModel.unitPrice", function () {
                            if ($scope.filterItemModel.unitPrice != undefined) {
                                $scope.filterItemModel.totalPrice = $scope.filterItemModel.unitPrice * $scope.filterItemModel.qty;
                            }
                        });

                        $scope.$watch("dropdownVolume.model", function () {
                            if ($scope.dropdownVolume.model != undefined) {
                                // $scope.filterItemModel.unitVolume = $scope.filterItemModel.unitWidth * $scope.filterItemModel.unitLength * $scope.filterItemModel.unitHeight;
                                // var numQty = parseFloat($scope.filterItemModel.qty);
                                // $scope.filterItemModel.volume = numQty * (($scope.filterItemModel.unitWidth * $scope.filterItemModel.unitLength * $scope.filterItemModel.unitHeight) / $scope.dropdownVolume.model.volume_Ratio)

                                // var Vn = $scope.filterItemModel.volume.toFixed(2);
                                // var volumeNum = parseFloat(Vn);
                                // $scope.filterItemModel.volume = volumeNum;
                                $scope.filterItemModel.volume_Ratio = $scope.dropdownVolume.model.volume_Ratio;

                            }
                        });



                        $scope.autoComplete = {
                            sku: "AutoPlanGoodsReceive/autoSkufilter",
                            product: "AutoPlanGoodsReceive/autoProductfilter",
                        };

                        $scope.url = {
                            PlanGR: webServiceAPI.PlanGR,
                        };

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

                        var init = function () {
                            $scope.dropdownWeight();
                            $scope.dropdownCurrency();
                            $scope.dropdownVolume();
                            $scope.dropdownProductconversion();
                        };

                        init();

                    }
                ],
                link: function ($scope, $element, $attributes) { }
            };
        }
    ]);
}());
