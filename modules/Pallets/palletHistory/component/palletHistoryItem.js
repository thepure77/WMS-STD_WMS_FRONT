
(function () {
    'use strict'
    app.directive('palletHistoryItem', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/Pallets/palletHistory/component/palletHistoryItem.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'webServiceAPI', 'purchaseOrderFactory', 'dpMessageBox',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, webServiceAPI, purchaseOrderFactory, dpMessageBox) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = purchaseOrderFactory;
                        $scope.onShow = false;
                        $scope.filterItemModel = {};
                        $scope.IsNew = 1;
                        // $scope.filterModel = {};

                        // $scope.onHide = function (param) {
                        // };
                        $scope.onClose = function () {
                            $scope.onShow = false;
                            $scope.filterItemModel = {};
                        };

                        $scope.delegates = function (param) {

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
                            sku: "Autocomplete/autoSkufilter",
                            product: "Autocomplete/autoProductfilter",
                        };

                        $scope.url = {
                            PO: webServiceAPI.PO,
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
