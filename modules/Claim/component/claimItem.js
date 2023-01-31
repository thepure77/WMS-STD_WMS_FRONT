
(function () {
    'use strict'
    app.directive('claimItem', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/claim/component/claimItem.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'webServiceAPI', 'claimFactory', 'dpMessageBox','Upload',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, webServiceAPI, claimFactory, dpMessageBox, Upload) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = claimFactory;
                        $scope.onShow = false;
                        $scope.filterItemModel = {};
                        $scope.filterItemModel.documents = [];
                        $scope.IsNew = 1;
                        $scope.chk = {};
                        // $scope.filterModel = {};

                        // $scope.onHide = function (param) {
                        // };
                        $scope.onClose = function () {
                            $scope.onShow = false;
                            $scope.filterItemModel = {};
                            $scope.filterItemModel.documents = [];
                            $scope.filterItemModel.inv_Date = getToday();
                        };

                        $scope.delegates = function (param) {
                            $scope.chk.isLot = 0;
                            // $scope.filterItemModel = {};
                            $scope.filterItemModel = {};
                            $scope.filterItemModel.documents = [];
                            $scope.filterItemModel.inv_Date = getToday();
                            if (param.rowItemIndex != undefined || param.rowItemIndex != null) {
                                $scope.filterItemModel = param;

                                var Productconversion = $scope.dropdownProductconversion
                                const resultProductconversion = Productconversion.filter((Productconversion) => {
                                    return param.productConversion_Index == $scope.dropdownProductconversion[0].productConversion_Index;
                                })
                                $scope.dropdownProductconversion.model = resultProductconversion[0]
                                // var currency = $scope.dropdownCurrency
                                // const resultcurrency = currency.filter((currency) => {
                                //     return param.currency_Index == $scope.dropdownCurrency[0].currency_Index;
                                // })
                                // $scope.dropdownCurrency.priceModel = resultcurrency[0]
                                

                                // var volume = $scope.dropdownVolume
                                // const resultvolume = volume.filter((volume) => {
                                //     return volume.volume_Index == $scope.dropdownProductconversion[0].productConversion_Volume_Index;
                                // })
                                // $scope.dropdownVolume.model = resultvolume[0];
                                $scope.IsNew = 0;
                            }
                            else {
                                // $scope.filterItemModel.owner_Index = param.owner_Index;
                                $scope.IsNew = 1;

                            }

                        }


                        $scope.closeItem = function () {
                            $scope.filterItemModel = {};
                            $scope.filterItemModel.documents = [];
                            $scope.filterItemModel.inv_Date = getToday();
                        }

                        // $scope.back = function () {
                        //     $scope.deleteuser = {};
                        //     if ($scope.filterModel.claim_Index != undefined) {
                        //         // $scope.deleteuser.claim_Index = $scope.filterModel.claim_Index;
                        //         // viewModel.deleteUserAssign($scope.deleteuser).then(
                        //             // function success(results) {
                        //                 $scope.filterModel = {};
                        //                 // $scope.dropdownwarehouse.model = {};
                        //                 $scope.dropdownDocumentType.model = {};
                        //                 defer.resolve();
                        //             // }
                        //         // );
                        //     }
                        //     else {
                        //         $scope.filterModel = {};
                        //         // $scope.dropdownwarehouse.model = {};
                        //         $scope.dropdownDocumentType.model = {};
                        //         defer.resolve();
                        //     }
                        // }

                        $scope.addsItem = function (param) {
                            // param.documents = param.docFile;
                            var c = 0;
                            $scope.filterItemModel.unit_Claim = $scope.filterItemModel.productConversion_Name;
                            $scope.filterItemModel.unit_Inv = $scope.filterItemModel.productConversion_Name;
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
                                    c = 1;
                                        $scope.onShow = true;
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
                                        c = 1;
                                        $scope.onShow = true;
                                        return "";
                                    }
        
                                    // if ($scope.dropdownProductconversion.model == null) {
                                    //     dpMessageBox.alert(
                                    //         {
                                    //             ok: 'Close',
                                    //             title: 'แจ้งเตือน',
                                    //             message: 'กรุณาเลือกหน่วย !'
                                    //         }
                                    //     )
                                    //     return "";
                                    // }

                                    if(!$scope.filterItemModel.sup_Name){
                                        dpMessageBox.alert(
                                            {
                                                ok: 'Close',
                                                title: 'แจ้งเตือน',
                                                message: 'Please insert Supplier Name !'
                                            }
                                        )
                                        c = 1;
                                        $scope.onShow = true;;
                                        return "";
                                    }

                                    if (!$scope.filterItemModel.so_No) {
                                        dpMessageBox.alert(
                                            {
                                                ok: 'Close',
                                                title: 'แจ้งเตือน',
                                                message: 'Please insert SO No !'
                                            }
                                        )
                                        c = 1;
                                        $scope.onShow = true;;
                                        return "";
                                    }

                                    if (!$scope.filterItemModel.inv_No) {
                                        dpMessageBox.alert(
                                            {
                                                ok: 'Close',
                                                title: 'แจ้งเตือน',
                                                message: 'Please insert Inv No !'
                                            }
                                        )
                                        c = 1;
                                        $scope.onShow = true;
                                        return "";
                                    }

                                    if (!$scope.filterItemModel.inv_Date) {
                                        dpMessageBox.alert(
                                            {
                                                ok: 'Close',
                                                title: 'แจ้งเตือน',
                                                message: 'Please insert Inv Date !'
                                            }
                                        )
                                        c = 1;
                                        $scope.onShow = true;
                                        return "";
                                    }
        
                                    if ($scope.filterItemModel.qty_Claim == undefined || $scope.filterItemModel.qty_Claim == "") {
                                        dpMessageBox.alert(
                                            {
                                                ok: 'Close',
                                                title: 'แจ้งเตือน',
                                                message: 'กรุณาเลือกจำนวนสินค้า !'
                                            }
                                        )
                                        c = 1;
                                        $scope.onShow = true;
                                        return "";
                                    }
                                    else {
        
                                        $scope.filterItemModel.qty_Claim = parseFloat($scope.filterItemModel.qty_Claim);
                                        // var n = num.toFixed(2);
                                        // $scope.filterItemModel.qty = n;
                                    }
                                    if (!(!isNaN(parseFloat($scope.filterItemModel.qty_Claim)) && angular.isNumber(parseFloat($scope.filterItemModel.qty_Claim)))) {
                                        dpMessageBox.alert(
                                            {
                                                ok: 'Close',
                                                title: 'Validate',
                                                message: 'Please insert Qty Claim !'
                                            }
                                        )
                                        c = 1;
                                        $scope.onShow = true;
                                        return "";
                                    } else {
                                        if (parseFloat($scope.filterItemModel.qty_Claim) <= 0) {
                                            dpMessageBox.alert(
                                                {
                                                    ok: 'Close',
                                                    title: 'Validate',
                                                    message: 'Please insert number more than 0 !'
                                                }
                                            )
                                            c = 1;
                                        $scope.onShow = true;
                                            return "";
                                        }
                                    }

                                    
                                    if ($scope.filterItemModel.qty_Inv == undefined || $scope.filterItemModel.qty_Inv == "") {
                                        dpMessageBox.alert(
                                            {
                                                ok: 'Close',
                                                title: 'แจ้งเตือน',
                                                message: 'กรุณาเลือกจำนวนสินค้า !'
                                            }
                                        )
                                        c = 1;
                                        $scope.onShow = true;
                                        return "";
                                    }
                                    else {
        
                                        $scope.filterItemModel.qty_Inv = parseFloat($scope.filterItemModel.qty_Inv);
                                        // var n = num.toFixed(2);
                                        // $scope.filterItemModel.qty = n;
                                    }
                                    if (!(!isNaN(parseFloat($scope.filterItemModel.qty_Inv)) && angular.isNumber(parseFloat($scope.filterItemModel.qty_Inv)))) {
                                        dpMessageBox.alert(
                                            {
                                                ok: 'Close',
                                                title: 'Validate',
                                                message: 'Please insert Qty Inv !'
                                            }
                                        )
                                        c = 1;
                                        $scope.onShow = true;
                                        return "";
                                    } else {
                                        if (parseFloat($scope.filterItemModel.qty_Inv) <= 0) {
                                            dpMessageBox.alert(
                                                {
                                                    ok: 'Close',
                                                    title: 'Validate',
                                                    message: 'Please insert more than 0 !'
                                                }
                                            )
                                            c = 1;
                                        $scope.onShow = true;
                                            return "";
                                        }
                                    }
        
                                    $scope.invokes.selected($scope.filterItemModel);
                                    if(c ==1){

                                    }
                                    else{
                                        $scope.onShow = false;
                                    $scope.filterItemModel = {};
                                    $scope.filterItemModel.documents = [];
                                    }

                                    
                                    
                                    
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
                                    // $scope.filterItemModel.unitWeight = $scope.dropdownProductconversion.model.productConversion_Weight;
                                    // $scope.filterItemModel.unit_Claim = $scope.dropdownProductconversion.model.productConversion_Name;
                                    // $scope.filterItemModel.unit_Inv = $scope.dropdownProductconversion.model.productConversion_Name;
                                    $scope.filterItemModel.productConversion_Name = $scope.dropdownProductconversion.model.productConversion_Name;

                                    // if ($scope.IsNew == 1) {

                                    //     $scope.chk.isLot = parseFloat($scope.filterItemModel.IsLot);
                                        
                                    //     $scope.filterItemModel.unitWidth = $scope.dropdownProductconversion.model.productConversion_Width;
                                    //     $scope.filterItemModel.unitLength = $scope.dropdownProductconversion.model.productConversion_Length;
                                    //     $scope.filterItemModel.unitHeight = $scope.dropdownProductconversion.model.productConversion_Height;
                                    //     $scope.filterItemModel.unitVolume = $scope.filterItemModel.unitWidth * $scope.filterItemModel.unitLength * $scope.filterItemModel.unitHeight;

                                    //     $scope.filterItemModel.unitWidth = $scope.filterItemModel.unitWidth.toFixed(2);
                                    //     $scope.filterItemModel.unitLength = $scope.filterItemModel.unitLength.toFixed(2);
                                    //     $scope.filterItemModel.unitHeight = $scope.filterItemModel.unitHeight.toFixed(2);

                                    //     var volume = $scope.dropdownVolume  
                                    //     const resultvolume = volume.filter((volume) => {
                                    //         return volume.volume_Index == $scope.dropdownProductconversion[0].productConversion_Volume_Index;
                                    //     })
                                    //     $scope.dropdownVolume.model = resultvolume[0];
                                    //     $scope.filterItemModel.volume_Ratio = $scope.dropdownVolume.model.volume_Ratio;
                                    // }

                                    // var weight = $scope.dropdownWeight
                                    // const resultweight = weight.filter((weight) => {
                                    //     return weight.weight_Index == $scope.dropdownProductconversion[0].productConversion_Weight_Index;
                                    // })
                                    // $scope.dropdownWeight.weightModel = resultweight[0];
                                    // $scope.dropdownWeight.netWeightModel = resultweight[0];
                                    // $scope.dropdownWeight.grsWeightModel = resultweight[0];

                                    
                                    
                                });
                            }
                        });
                        
                        $scope.uploadFile = {
                            url: webServiceAPI.OMS + "Claim/importFileOutboundV2",
                            delegates: {},
                            config: {
                                showModal: false
                            },
                            invokes: {},
                            onClick: function (file, param) {
                                pageLoading.show();
                                Upload.upload({
                                    url: $scope.uploadFile.url,
                                    data: {
                                        File: file,
                                        'username': ""
                                    }
                                }).then(function (resp) {
                                    param.documents.push({ path: resp.data.value, urlAttachFile: resp.data.url, type: "Claim", filename: resp.data.url.replace(/^.*[\\\/]/, ''), isDelete: false, src: resp.data.src });
                                    pageLoading.hide();
                                }, function (resp) {
                                    console.log('Error status: ' + resp.status);
                                    pageLoading.hide();
                                }, function (evt) {
                                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                                    // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                                });
                            }
                        };
            
                        $scope.delDocument = function (attachFileRow) {
                            dpMessageBox.confirm({
                                title: 'Confirm ?',
                                message: 'Do you want to delete!'
                            }).then(function () {
                                attachFileRow.isDelete = true;
                            });
                        }

                        function getToday() {
                            var today = new Date();
            
                            var mm = today.getMonth() + 1;
                            var yyyy = today.getUTCFullYear();
                            var dd = today.getDate();
            
            
                            if (dd < 10) dd = '0' + dd;
                            if (mm < 10) mm = '0' + mm;
            
                            return yyyy.toString() + mm.toString() + dd.toString();
                        }

                        $scope.autoComplete = {
                            plangi: "Claim/autoGIfilter",
                            sku: "Claim/autoSkufilter",
                            product: "Claim/autoProductfilter",
                            owner: "Claim/autoOwnerfilter",
                        };

                        $scope.url = {
                            Claim: webServiceAPI.OMS,
                        };
                                   
                        // $scope.dropdownWeight = function () {
                        //     viewModel.dropdownWeight($scope.filterItemModel).then(function (res) {
                        //         $scope.dropdownWeight = res.data;
                        //     });
                        // };

                        // $scope.dropdownCurrency = function () {
                        //     viewModel.dropdownCurrency($scope.filterItemModel).then(function (res) {
                        //         $scope.dropdownCurrency = res.data;
                        //     });
                        // };

                        // $scope.dropdownVolume = function () {
                        //     viewModel.dropdownVolume($scope.filterItemModel).then(function (res) {
                        //         $scope.dropdownVolume = res.data;
                        //     });
                        // };

                        $scope.dropdownProductconversion = function () {
                            viewModel.dropdownProductconversion($scope.filterItemModel).then(function (res) {
                                $scope.dropdownProductconversion = res.data;
                            });
                        };

                        var init = function () {
                            // $scope.dropdownWeight();
                            // $scope.dropdownCurrency();
                            // $scope.dropdownVolume();
                            $scope.dropdownProductconversion();
                            $scope.filterModel = {};
                            $scope.filterItemModel.documents = [];
                            $scope.filterItemModel.inv_Date = getToday();
                            
                        };

                        init();

                    }
                ],
                link: function ($scope, $element, $attributes) { }
            };
        }
    ]);
}());
