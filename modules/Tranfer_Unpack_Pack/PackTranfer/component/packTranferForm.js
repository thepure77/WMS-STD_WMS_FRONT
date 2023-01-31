(function () {
    'use strict';
    app.component('packTranferForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, $window, commonService) {
            return "modules/Tranfer_Unpack_Pack/PackTranfer/component/packTranferForm.html";
        },
        bindings: {
            scanReceive: '=?',
            onShow: '=?'
        },
        controller: function ($scope, $q, $filter, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, webServiceAPI, packTranferFactory) {
            var $vm = this;
            var defer = {};
            var viewModelunPack = packTranferFactory

            $scope.click = 1;
            $scope.clickH = 1;
            $scope.disabled = false;
            $scope.filterModel = {};
            $scope.filterGRModel = {};
            $scope.filterItemModel = {};

            $vm.onShow = function (param) {

                $vm = this;
                $scope.itemsReserve = {};
                $scope.filterItemModel = {};
                $scope.disabled = false;
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterItemModel.owner_Index = '02b31868-9d3d-448e-b023-05c121a424f4';
                $scope.filtertask = {};
                $scope.filtertask = param;
                $scope.filtertask.items = param.items;
                debugger
                viewModelunPack.filterbinbalance_pack($scope.filtertask).then(function (res) {
                    debugger
                    pageLoading.hide()
                    $scope.filterModel.items = res.data.items;
                    // $scope.filterModel.product_conname = $scope.filtertask.productConversion_Name;

                    // let product = { product_Index: res.data.items[0].product_Index };
                    // viewModelunPack.dropdownProductconversion(product).then(function (res) {

                    //     return $scope.filterModel.unit = res.data.filter(c => c.productConversion_Index == ($scope.filtertask.productConversion_Index).toLowerCase())[0];
                    // });
                    // $scope.filterModel.qty = $scope.filtertask.qty;
                    // $scope.filterModel.Pick = $scope.filtertask.qty;
                },
                    function error() {

                    }
                );
            }


            $scope.clickTab = function (tab) {
                $scope.click = tab;
            }
            $scope.clickTabH = function (tab) {
                $scope.clickH = tab;
            }

            $scope.save = function () {

                if ($scope.filterModel.listGoodsReceiveItemViewModels == undefined || $scope.filterModel.listGoodsReceiveItemViewModels.length == 0) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'Error: Add at least 1 Item !'
                        }
                    )
                    return "";
                } else {
                    $scope.filterItemModel.listGoodsReceiveItemViewModels = $scope.filterModel.listGoodsReceiveItemViewModels;
                    $scope.filterlocation = {};
                    $scope.filterlocation.listGoodsReceiveItemViewModels = $scope.filterModel.listGoodsReceiveItemViewModels;

                }
                pageLoading.show();
                $scope.model = {};
                $scope.model.items = {};
                $scope.model.listGoodsReceiveItemViewModels = {};
                $scope.model.filtertask = {};
                $scope.model.create_By = localStorageService.get('userTokenStorage');
                $scope.model.items.items = $scope.filterModel.items;
                $scope.model.filtertask = $scope.filtertask.goodsTransfer_Index;
                $scope.model.listGoodsReceiveItemViewModels = $scope.filterModel.listGoodsReceiveItemViewModels;
                debugger
                viewModelunPack.goodsissueHeader($scope.model).then(
                    function success(res) {
                        pageLoading.hide();
                        if (res.data.resultIsUse) {
                            $scope.filterModel
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'pack success'
                                }
                            )
                            $state.go('wms.task_pack', {});
                        } else {
                             dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: res.data.resultMsg
                                }
                            )
                        }
                    })

            }

            $scope.dropdownWeight = function () {
                viewModelunPack.dropdownWeight($scope.filterItemModel).then(function (res) {
                    $scope.dropdownWeight = res.data;
                });
            };

            $scope.dropdownDocumentType = function () {
                viewModelunPack.dropdownDocumentType($scope.filterModel).then(function (res) {
                    $scope.dropdownDocumentType = res.data;
                });
            };

            $scope.dropdownItemStatus = function () {
                viewModelunPack.dropdownItemStatus($scope.filterModel).then(function (res) {
                    $scope.dropdownItemStatus = res.data;
                });
            };

            $scope.dropdownVolume = function () {
                viewModelunPack.dropdownVolume($scope.filterModel).then(function (res) {
                    $scope.dropdownVolume = res.data;
                });
            };


            $scope.scanProduct = function () {
                var deferred = $q.defer();
                $scope.barcode_UPC = {};
                $scope.barcode_UPC.productConversionBarcode = $scope.filterItemModel.productConversionBarcode;

                pageLoading.show();
                viewModelunPack.scanUPCUnpack($scope.barcode_UPC).then(
                    function success(res) {
                        debugger
                        pageLoading.hide();
                        if (res.data.msg == null) {
                            if (res.data.item != null) {
                                $scope.filterItemModel = res.data.item[0];
                                $scope.filterItemModel.plant = 'L901';
                                $scope.filterItemModel.erp_location = 'AB03';
                            }
                        }
                        else {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'ALERT',
                                message: "MSG_Alert_Barcode_Not_Found"
                            })
                        }
                    },
                    function error(response) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'ALERT',
                            message: "MSG_Alert_Barcode_Not_Found"
                        })
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            $scope.scanLocation = function () {

                let location_check = {};
                location_check.LocationNew = $scope.filterItemModel.location;
                if ($scope.filterItemModel.location != undefined) {
                    viewModelunPack.scanLocation(location_check).then(function success(res) {

                        if (res.data.resultIsUse) {
                            debugger

                            if ($scope.filterModel.listGoodsReceiveItemViewModels != undefined) {
                                if ($scope.filterModel.listGoodsReceiveItemViewModels.length > 0) {
                                    var checklocation = $scope.filterModel.listGoodsReceiveItemViewModels.filter(c => c.location_Index == res.data.location_Index);
                                    if (checklocation.length == 0) {
                                        $scope.filterItemModel.location_Index = res.data.location_Index
                                        $scope.filterItemModel.location_Id = res.data.location_Id
                                        $scope.filterItemModel.location_Name = res.data.location_Name
                                    } else {
                                        $scope.filterItemModel.location = undefined;
                                        return dpMessageBox.alert(
                                            {
                                                ok: 'Close',
                                                title: 'แจ้งเตือน',
                                                message: 'Location ได้มีการ suggest แล้ว'
                                            }
                                        )
                                    }
                                }else {
                                    $scope.filterItemModel.location_Index = res.data.location_Index
                                    $scope.filterItemModel.location_Id = res.data.location_Id
                                    $scope.filterItemModel.location_Name = res.data.location_Name
                                }
                            } else {
                                $scope.filterItemModel.location_Index = res.data.location_Index
                                $scope.filterItemModel.location_Id = res.data.location_Id
                                $scope.filterItemModel.location_Name = res.data.location_Name
                            }

                        } else {
                            $scope.filterItemModel.location = undefined;
                            setTimeout(() => {
                                var focusElem = jQuery('input[ng-model="filterItemModel.location"]');
                                focusElem[0].focus();
                            }, 200);

                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: res.data.resultMsg
                                }
                            )
                        }
                    },
                        function error(res) {
                        });
                }
            }


            $scope.$watch("filterItemModel.product_Name", function () {

                if ($scope.filterItemModel.product_Id == "" || $scope.filterItemModel.product_Name == ""
                    || $scope.filterItemModel.product_Id == undefined || $scope.filterItemModel.product_Name == undefined) {
                    $scope.dropdownProductconversion.model = {};
                }
                else {
                    viewModelunPack.dropdownProductconversion($scope.filterItemModel).then(function (res) {
                        $scope.dropdownProductconversion = res.data;
                        $scope.dropdownProductconversion.model = $scope.dropdownProductconversion[0];
                        $scope.filterItemModel.weightUnit = $scope.dropdownProductconversion.model.productConversion_Weight;
                        $scope.filterItemModel.productConversionBarcode = $scope.barcode_UPC.productConversionBarcode
                        $scope.filterItemModel.productConversion_Name = $scope.dropdownProductconversion.model.productConversion_Name;


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


                        var conversion = $scope.dropdownProductconversion
                        const resultconversion = conversion.filter((conversion) => {
                            return conversion.productConversion_Index == $scope.filterItemModel.productConversion_Index;
                        })
                        $scope.filterItemModel.model = resultconversion[0];


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

            $scope.deleteItemGR = function (param, index) {
                param.splice(index, 1);
            }


            $scope.addsItem = function (param) {

                param.netWeight = 0.00;
                $scope.filterItemModel.weight = param.netWeight.toFixed(2);

                if ($scope.dropdownProductconversion.model != null) {
                    param.productConversion_Index = $scope.dropdownProductconversion.model.productConversion_Index;
                    param.productConversion_Id = $scope.dropdownProductconversion.model.productConversion_Id;
                    param.productConversion_Name = $scope.dropdownProductconversion.model.productConversion_Name;
                    param.ratio = $scope.dropdownProductconversion.model.productconversion_Ratio;

                    $scope.filterItemModel.productConversion_Index = $scope.filterItemModel.model.productConversion_Index
                    $scope.filterItemModel.productConversion_Id = $scope.filterItemModel.model.productConversion_Id
                    $scope.filterItemModel.productConversion_Name = $scope.filterItemModel.model.productConversion_Name
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

                if ($scope.filterItemModel.location_Index == undefined || $scope.filterItemModel.location_Index == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณา Scan location!!'
                        }
                    )
                    return "";
                }

                if ($scope.filterItemModel.plant == undefined || $scope.filterItemModel.plant == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: 'กรุณากรอก Plant!!'
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

                if ($scope.dropdownItemStatus.model == null) {
                    $scope.filterItemModel.itemStatus_Index = '525BCFF1-2AD9-4ACB-819D-0DEA4E84EA12';
                    $scope.filterItemModel.itemStatus_Id = '10';
                    $scope.filterItemModel.itemStatus_Name = 'Goods-UR';
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
                $scope.filterItemModel.documentRef_No1 = 'L901';
                $scope.filterItemModel.documentRef_No2 = 'AB03';


                if ($scope.filterModel.listGoodsReceiveItemViewModels == undefined) {
                    $scope.filterModel.listGoodsReceiveItemViewModels = $scope.filterModel.listGoodsReceiveItemViewModels || []
                    $scope.filterModel.listGoodsReceiveItemViewModels.push(angular.copy($scope.filterItemModel));
                }
                else if ($scope.filterItemModel.rowItemIndex != undefined) {
                    $scope.filterModel.listGoodsReceiveItemViewModels[param.rowItemIndex] = $scope.filterItemModel;
                }
                else {
                    $scope.filterModel.listGoodsReceiveItemViewModels.push(angular.copy($scope.filterItemModel));

                }
                let dataList = $scope.filterModel.listGoodsReceiveItemViewModels;

                for (var i = 0; i <= dataList.length - 1; i++) {
                    $scope.filterModel.listGoodsReceiveItemViewModels[i].qty = $scope.filterModel.listGoodsReceiveItemViewModels[i].qty.toFixed(2);
                    $scope.filterModel.listGoodsReceiveItemViewModels[i].qty = parseFloat($scope.filterModel.listGoodsReceiveItemViewModels[i].qty);
                }
                $scope.onShow = false;
                debugger
                $scope.filterItemModel = {};
            }

            $scope.autoComplete = {
                productName: "GoodsReceive/autoProduct",
                productId: "GoodsReceive/autoSKU",
            };


            $scope.url = {
                GR: webServiceAPI.GR,
            };

            $vm.$onInit = function () {
                $vm = this;
                $scope.dropdownDocumentType();
                $scope.dropdownItemStatus();
                $scope.dropdownVolume();
                $scope.dropdownWeight();
                $scope.itemsReserve = {};
                $scope.filterItemModel = {};
                $scope.disabled = false;
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterItemModel.owner_Index = '02b31868-9d3d-448e-b023-05c121a424f4';

            }
        }
    })
})();