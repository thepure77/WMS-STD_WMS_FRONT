(function () {
    'use strict';

    app.component('scanReceiveSummary', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GR/scanReceive/scanReceiveSummary/scanReceiveSummary.html";
        },
        bindings: {
            scanReceive: '=?',
            onShow: '=?',
            isSave: '=?'
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, scanReceiveFactory, goodsReceiveFactory, webServiceAPI) {
            var $vm = this;
            var defer = {};
            var viewModel = scanReceiveFactory;
            $scope.url = {
                GR: webServiceAPI.GR,
            };
            $scope.filterModel = {};
            var productCon_Index = "";

            $scope.menu = [
                {
                    "step": "1",
                    "active": "active",
                    "completed": "",
                    "name": "Product Header"
                },
                {
                    "step": "2",
                    "active": "",
                    "completed": "",
                    "name": "Product Detail",
                },
                {
                    "step": "3",
                    "active": "",
                    "completed": "",
                    "name": "Receive Product"
                }
            ];

            $scope.clickTab = function (tab) {
                $scope.click = tab;
                if ($scope.click == 1) {
                    $scope.isSave = true
                } else {
                    $scope.isSave = false
                }
            }


            $scope.back = function () {
                // $scope.filterModel2 = {};
                let i = $scope.menu.indexOf($scope.menu.find(c => c.active == "active"));
                // $scope.menu.map(c => c.active == "active" ? c.active = "" : c.active = "");
                $scope.menu[i].active = "";
                $scope.menu[i].completed = "";
                $scope.menu[i - 1].active = "active";
                $scope.menu_width = (i - 1) * 50; //กำหนดความกว้างของเส้นเชื่อม
            }

            $scope.next = function () {

                if (!$scope.dropdownDocumentType.model) {
                    return dpMessageBox.alert({
                        ok: 'Close',
                        title: 'ALERT',
                        message: "MSG_Alert_DocumentType"
                    })
                }
                let i = $scope.menu.indexOf($scope.menu.find(c => c.active == "active"));
                $scope.menu[i].active = "";
                $scope.menu[i].completed = "completed";
                $scope.menu[i + 1].active = "active";
                $scope.menu_width = (i + 1) * 100; //กำหนดความกว้างของเส้นเชื่อม
                $scope.click = 1;
                $scope.isSave = true;
                $scope.filterModel.log_udf_2 =getToday();
                $scope.filterModel.log_udf_3 =getTime();
                if ($scope.menu[1].active == "active") {
                    $scope.filterModel2 = angular.copy($scope.filterModel);
                }
                else if ($scope.menu[2].active == "active") {
                }
                setTimeout(() => {
                    var focusElem = jQuery('input[ng-model="filterModel.productConversionBarcode"]');
                    focusElem[0].focus();

                }, 200);
            }

            $scope.scanDN = function () {
                $scope.listfilterModel = {};
                var deferred = $q.defer();
                var model = {};
                model.planGoodsReceive_No = $scope.filterModel.planGoodsReceive_No;

                pageLoading.show();
                viewModel.scanDN(model).then(
                    function success(res) {
                        pageLoading.hide();

                        if (res.data.msg != null) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'ALERT',
                                message: res.data.msg
                            })
                        }
                        var d = res.data.item[0].goodsReceive_Date;
                        var dateData = '';
                        if (d.length >= 8) {
                            var year = d.substr(0, 4);
                            var month = d.substr(4, 2);
                            var day = d.substr(6, 2);
                            //month = parseInt(month) - 1;
                            dateData = day + '/' + month + '/' + year
                            //$scope.dt = new Date(year, month, day);
                        }

                        if (res.data.item != null) {
                            $scope.filterModel.goodsReceive_Index = res.data.item[0].goodsReceive_Index;
                            $scope.filterModel.goodsReceive_No = res.data.item[0].goodsReceive_No;
                            $scope.filterModel.owner_Index = res.data.item[0].owner_Index;
                            $scope.filterModel.owner_Id = res.data.item[0].owner_Id;
                            $scope.filterModel.owner_Name = res.data.item[0].owner_Name;
                            $scope.filterModel.vendor_Index = res.data.item[0].vendor_Index;
                            $scope.filterModel.vendor_Id = res.data.item[0].vendor_Id;
                            $scope.filterModel.vendor_Name = res.data.item[0].vendor_Name;
                            $scope.filterModel.documentType_Index = res.data.item[0].documentType_Index;
                            $scope.filterModel.documentType_Id = res.data.item[0].documentType_Id;
                            $scope.filterModel.documentType_Name = res.data.item[0].documentType_Name;
                            $scope.filterModel.goodsReceive_Date = res.data.item[0].goodsReceive_Date;
                            $scope.filterModel.mFG_DateShow = undefined;
                            $scope.filterModel.eXP_DateShow = undefined;
                            $scope.filterModel.product_Lot = undefined;
                            // var documentType = $scope.dropdownDocumentType
                            // const resultsDocumentType = documentType.filter((documentType) => {
                            //     return documentType.documentType_Index == res.data.item[0].documentType_Index;
                            // })
                            //$scope.dropdownDocumentType.model = resultsDocumentType[0];
                            if(res.data.item[0].documentType_Index == '774cf194-b35b-45e7-b873-3e8453e257fd')
                            {
                                $scope.dropdownDocumentType.model = $scope.dropdownDocumentType[2];
                            }else{
                            $scope.dropdownDocumentType.model = $scope.dropdownDocumentType[6];
                            }

                            if (res.data.item[0].erP_location != undefined && res.data.item[0].erP_location != '') {

                                var erp_locaion = $scope.dropdownStorageLoc
                                const resultserp_locaion = erp_locaion.filter((erp_locaion) => {
                                    return erp_locaion.storageLoc_Name == res.data.item[0].erP_location;
                                })
                                $scope.dropdownStorageLoc.model = resultserp_locaion[0];
                            }
                        }
                        $scope.filterGRItem();
                    },
                    function error(response) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'ALERT',
                            message: "error"
                        })
                        deferred.reject(response);
                    });
                return deferred.promise;
            }



            $scope.scanGR = function () {
                var deferred = $q.defer();
                var model = {};
                model.goodsReceive_No = $scope.filterModel.goodsReceive_No;
                pageLoading.show();
                viewModel.scanGR(model).then(
                    function success(res) {
                        pageLoading.hide();

                        if (res.data.msg != null) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'ALERT',
                                message: res.data.msg
                            })
                        }
                        if (res.data.item.length > 0) {
                            $scope.filterModel.goodsReceive_Index = res.data.item[0].goodsReceive_Index;
                            $scope.filterModel.goodsReceive_No = res.data.item[0].goodsReceive_No;
                            $scope.filterModel.owner_Index = res.data.item[0].owner_Index;
                            $scope.filterModel.owner_Id = res.data.item[0].owner_Id;
                            $scope.filterModel.owner_Name = res.data.item[0].owner_Name;
                            $scope.filterModel.vendor_Index = res.data.item[0].vendor_Index;
                            $scope.filterModel.vendor_Id = res.data.item[0].vendor_Id;
                            $scope.filterModel.vendor_Name = res.data.item[0].vendor_Name;
                            $scope.filterModel.documentType_Index = res.data.item[0].documentType_Index;
                            $scope.filterModel.documentType_Id = res.data.item[0].documentType_Id;
                            $scope.filterModel.documentType_Name = res.data.item[0].documentType_Name;
                            $scope.filterModel.goodsReceive_Date = res.data.item[0].goodsReceive_Date;
                            $scope.filterModel.mFG_DateShow = undefined;
                            $scope.filterModel.eXP_DateShow = undefined;
                            $scope.filterModel.product_Lot = undefined;

                            var documentType = $scope.dropdownDocumentType
                            const resultsDocumentType = documentType.filter((documentType) => {
                                return documentType.documentType_Index == res.data.item[0].documentType_Index;
                            })
                            $scope.dropdownDocumentType.model = resultsDocumentType[0];
                        }

                    },
                    function error(response) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'ALERT',
                            message: "MSG_Alert_GoodsReceive_Not_Found"
                        })
                        deferred.reject(response);
                    });
                return deferred.promise;
            }



            $scope.scanUPC = function () {
                var deferred = $q.defer();
                var model = {};
                model.productConversionBarcode = $scope.filterModel.productConversionBarcode;
                model.planGoodsReceive_No = $scope.filterModel.planGoodsReceive_No;
                productCon_Index = ""
                pageLoading.show();
                viewModel.scanUPC(model).then(
                    function success(res) {
                        pageLoading.hide();
                        
                        if (res.data.msg != null) {

                            if (res.data.item != null) {
                                if (res.data.item.length > 1) {
                                    var GoodReceive = res.data.item;
                                    $scope.scanselect.onClick(GoodReceive);
                                }
                            }
                            else {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: res.data.msg
                                })
                                $scope.dropdownProductconversion.model = undefined;
                                $scope.filterModel.product_Index = "";
                                $scope.filterModel.product_Id = "";
                                $scope.filterModel.product_Name = "";
                                $scope.filterModel.product_SecondName = "";
                                $scope.filterModel.product_ThirdName = "";
                                $scope.filterModel.ref_No2 = "";
                                $scope.filterModel.productConversion_Height = "";
                                $scope.filterModel.productConversion_Length = "";
                                $scope.filterModel.productConversion_Width = "";
                                $scope.filterModel.isExpDate = "";
                                $scope.filterModel.isMfgDate = "";
                                $scope.filterModel.isLot = "";
                                $scope.filterModel.tihi = "";
                                $scope.filterModel.qty_Per_Tag = "";
                                $scope.filterModel.conversion = "";
                                $scope.dropdownItemStatus.model = "";
                                $scope.filterModel.mFG_DateShow = "";
                                $scope.filterModel.eXP_DateShow = "";
                                $scope.filterModel.product_Lot = "";
                                $scope.filterModel.mFG_DateShow = undefined;
                                $scope.filterModel.eXP_DateShow = undefined;
                                $scope.filterModel.product_Lot = undefined;
                            }


                        }
                        else if (res.data != null && res.data.msg == null) {
                            $scope.filterModel.product_Index = res.data.item[0].product_Index;
                            $scope.filterModel.product_Id = res.data.item[0].product_Id;
                            $scope.filterModel.product_Name = res.data.item[0].product_Name;
                            $scope.filterModel.product_SecondName = res.data.item[0].product_SecondName;
                            $scope.filterModel.product_ThirdName = res.data.item[0].product_ThirdName;
                            $scope.filterModel.ref_No2 = res.data.item[0].ref_No2;
                            $scope.filterModel.productConversion_Height = res.data.item[0].productConversion_Height;
                            $scope.filterModel.productConversion_Length = res.data.item[0].productConversion_Length;
                            $scope.filterModel.productConversion_Width = res.data.item[0].productConversion_Width;
                            $scope.filterModel.isExpDate = res.data.item[0].isExpDate;
                            $scope.filterModel.isMfgDate = res.data.item[0].isMfgDate;
                            $scope.filterModel.isLot = res.data.item[0].isLot;
                            $scope.filterModel.tihi = res.data.item[0].tihi;
                            $scope.filterModel.qty_Per_Tag = res.data.item[0].qty_Per_Tag;
                            $scope.filterModel.conversion = res.data.item[0].conversion;
                            $scope.filterModel.productItemLife_D = res.data.item[0].productItemLife_D;
                            $scope.filterModel.productItemLife_Y = res.data.item[0].productItemLife_Y;
                            $scope.filterModel.productItemLife_M = res.data.item[0].productItemLife_M;
                            $scope.productCon_Index = res.data.item[0].productConversion_Index;
                            $scope.filterModel.mFG_DateShow = undefined;
                            $scope.filterModel.eXP_DateShow = undefined;
                            if($scope.filterModel.documentType_Index == '774cf194-b35b-45e7-b873-3e8453e257fd')
                            {
                                $scope.filterModel.product_Lot = res.data.item[0].product_Lot;
                                $scope.filterModel.defaultdate = res.data.item[0].mFG_Date;
                            }
                            else{ 
                                $scope.filterModel.product_Lot = undefined;
                                $scope.filterModel.defaultdate = undefined;
                            }
                            
                            if (res.data.item[0].isExpDate != 0 || res.data.item[0].isMfgDate != 0 || res.data.item[0].isLot != 0) {
                                $scope.masterRequirePopup.onClick($scope.filterModel);
                            }

                            var ItemStatus = $scope.dropdownItemStatus
                            const resultsItemStatus = ItemStatus.filter((ItemStatus) => {
                                return ItemStatus.itemStatus_Index == "525bcff1-2ad9-4acb-819d-0dea4e84ea12";
                            })
                            $scope.dropdownItemStatus.model = resultsItemStatus[0];

                            if($scope.filterModel.documentType_Index == '774cf194-b35b-45e7-b873-3e8453e257fd')
                            {
                                $scope.dropdownStorageLoc.model = $scope.dropdownStorageLoc[0];
                            }
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

            $scope.scanselect = {
                onShow: false,
                delegates: {},
                onClick: function (param) {
                    $scope.scanselect.onShow = !$scope.scanselect.onShow;
                    $scope.scanselect.delegates(param);
                },
                config: {
                    title: ""
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        var model = {};
                        model = param;
                        model.productConversionBarcode = $scope.filterModel.productConversionBarcode;
                        model.planGoodsReceive_No = $scope.filterModel.planGoodsReceive_No;
                        
                        viewModel.scanUPC(model).then(
                            function success(res) {
                                pageLoading.hide();
                                
                                if (res.data.msg != null) {

                                    if (res.data.item != null) {
                                        if (res.data.item.length > 1) {
                                            var GoodReceive = res.data.item;
                                            $scope.scanselect.onClick(GoodReceive);
                                        }
                                    }
                                    else {
                                        dpMessageBox.alert({
                                            ok: 'Close',
                                            title: 'ALERT',
                                            message: res.data.msg
                                        })
                                        $scope.dropdownProductconversion.model = undefined;
                                        $scope.filterModel.product_Index = "";
                                        $scope.filterModel.product_Id = "";
                                        $scope.filterModel.product_Name = "";
                                        $scope.filterModel.product_SecondName = "";
                                        $scope.filterModel.product_ThirdName = "";
                                        $scope.filterModel.ref_No2 = "";
                                        $scope.filterModel.productConversion_Height = "";
                                        $scope.filterModel.productConversion_Length = "";
                                        $scope.filterModel.productConversion_Width = "";
                                        $scope.filterModel.isExpDate = "";
                                        $scope.filterModel.isMfgDate = "";
                                        $scope.filterModel.isLot = "";
                                        $scope.filterModel.tihi = "";
                                        $scope.filterModel.qty_Per_Tag = "";
                                        $scope.filterModel.conversion = "";
                                        $scope.dropdownItemStatus.model = "";
                                        $scope.filterModel.mFG_DateShow = undefined;
                                        $scope.filterModel.eXP_DateShow = undefined;
                                        $scope.filterModel.product_Lot = undefined;
                                    }


                                }
                                else if (res.data != null && res.data.msg == null) {
                                    $scope.filterModel.product_Index = res.data.item[0].product_Index;
                                    $scope.filterModel.product_Id = res.data.item[0].product_Id;
                                    $scope.filterModel.product_Name = res.data.item[0].product_Name;
                                    $scope.filterModel.product_SecondName = res.data.item[0].product_SecondName;
                                    $scope.filterModel.product_ThirdName = res.data.item[0].product_ThirdName;
                                    $scope.filterModel.ref_No2 = res.data.item[0].ref_No2;
                                    $scope.filterModel.productConversion_Height = res.data.item[0].productConversion_Height;
                                    $scope.filterModel.productConversion_Length = res.data.item[0].productConversion_Length;
                                    $scope.filterModel.productConversion_Width = res.data.item[0].productConversion_Width;
                                    $scope.filterModel.isExpDate = res.data.item[0].isExpDate;
                                    $scope.filterModel.isMfgDate = res.data.item[0].isMfgDate;
                                    $scope.filterModel.isLot = res.data.item[0].isLot;
                                    $scope.filterModel.tihi = res.data.item[0].tihi;
                                    $scope.filterModel.qty_Per_Tag = res.data.item[0].qty_Per_Tag;
                                    $scope.filterModel.conversion = res.data.item[0].conversion;
                                    $scope.filterModel.productItemLife_D = res.data.item[0].productItemLife_D;
                                    $scope.filterModel.productItemLife_Y = res.data.item[0].productItemLife_Y;
                                    $scope.filterModel.productItemLife_M = res.data.item[0].productItemLife_M;
                                    $scope.filterModel.planGoodsReceiveitem_Index = res.data.item[0].planGoodsReceiveitem_Index;
                                    $scope.filterModel.mFG_DateShow = undefined;
                                    $scope.filterModel.eXP_DateShow = undefined;
                                    $scope.filterModel.product_Lot = undefined;
                                    $scope.productCon_Index = res.data.item[0].productConversion_Index;
                                    // $scope.dropdownProductconversion.model = res.data.item[0].productConversion_Name;
                                    // $scope.filterModel.productConversionWLH = $scope.filterModel.productConversion_Width
                                    // + "*" + $scope.filterModel.productConversion_Length
                                    // + "*" + $scope.filterModel.productConversion_Height;
                                    
                                    if (res.data.item[0].isExpDate != 0 || res.data.item[0].isMfgDate != 0 || res.data.item[0].isLot != 0) {
                                        $scope.masterRequirePopup.onClick($scope.filterModel);
                                    }

                                    if (res.data.item[0].erP_location != undefined && res.data.item[0].erP_location != '') {

                                        var erp_locaion = $scope.dropdownStorageLoc
                                        const resultserp_locaion = erp_locaion.filter((erp_locaion) => {
                                            return erp_locaion.storageLoc_Name == res.data.item[0].erP_location;
                                        })
                                        $scope.dropdownStorageLoc.model = resultserp_locaion[0];
                                    }

                                    var ItemStatus = $scope.dropdownItemStatus
                                    const resultsItemStatus = ItemStatus.filter((ItemStatus) => {
                                        return ItemStatus.itemStatus_Index == "525bcff1-2ad9-4acb-819d-0dea4e84ea12";
                                    })
                                    $scope.dropdownItemStatus.model = resultsItemStatus[0];
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
                }
            };


            $scope.saveReceive = function () {
                $scope.filterModel.operations = "Save Receive";
                $scope.filterModel.log_udf_4 =getToday();
                $scope.filterModel.log_udf_5 =getTime();

                if ($scope.filterModel.qty <= 0 || $scope.filterModel.qty == undefined) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'MSG_Alert_qty'
                        }
                    )
                    return "";
                }

                if ($scope.dropdownDocumentType.model != null) {
                    $scope.filterModel.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
                    $scope.filterModel.documentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
                    $scope.filterModel.documentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
                }
                if ($scope.dropdownItemStatus.model != null) {
                    $scope.filterModel.itemStatus_Index = $scope.dropdownItemStatus.model.itemStatus_Index;
                    $scope.filterModel.itemStatus_Id = $scope.dropdownItemStatus.model.itemStatus_Id;
                    $scope.filterModel.itemStatus_Name = $scope.dropdownItemStatus.model.itemStatus_Name;
                }
                if ($scope.dropdownProductconversion.model != null) {
                    $scope.filterModel.productConversion_Index = $scope.dropdownProductconversion.model.productConversion_Index;
                    $scope.filterModel.productConversion_Id = $scope.dropdownProductconversion.model.productConversion_Id;
                    $scope.filterModel.productConversion_Name = $scope.dropdownProductconversion.model.productConversion_Name;
                    $scope.filterModel.productconversion_Ratio = $scope.dropdownProductconversion.model.productconversion_Ratio
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

                if ($scope.dropdownStorageLoc.model != null) {
                    $scope.filterModel.erp_location = $scope.dropdownStorageLoc.model.storageLoc_Id;
                } else {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'กรุณาเลือก ERP Location'
                        }
                    )
                    return "";
                }
                if ($scope.filterModel.isExpDate == 1 && $scope.filterModel.eXP_Date == null) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'MSG_Alert_EXPDATE'
                        }
                    )
                    return "";
                }
                if ($scope.filterModel.isMfgDate == 1 && $scope.filterModel.mFG_Date == null) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'MSG_Alert_MFGDATE'
                        }
                    )
                    return "";
                }
                if ($scope.filterModel.isLot == 1 && $scope.filterModel.product_Lot == null) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'ALERT',
                            message: 'MSG_Alert_ProductLot'
                        }
                    )
                    return "";
                }
                $scope.filterModel.create_by = $scope.userName;
                dpMessageBox.confirm({
                    ok: 'OK',
                    cancel: 'Close',
                    title: 'MSG_SURE_data',
                    message: 'MSG_Confirm_Save'
                }).then(function () {
                    viewModel.saveReceive($scope.filterModel).then(
                        function success(res) {debugger
                            if (res.data.goodsReceive_No == "false") {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: "Batch ไม่ตรงกับที่ DN ระบุมา"
                                })
                            }
                            else {
                                if (res.data.message == true) {debugger
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'MSG_Save_success',
                                        message: res.data.goodsReceive_No
                                    })

                                    $scope.filterModel.operations = $scope.filterModel.operations+" "+res.data.goodsReceive_No;
                                    viewModel.savelogsRequest($scope.filterModel).then(function () {
                                    });

                                    $scope.back();
                                    $scope.filterGRItem();
                                    $scope.filterModel.productConversionBarcode = "";
                                    $scope.filterModel.product_Id = "";
                                    $scope.filterModel.ref_No2 = "";
                                    $scope.filterModel.product_Name = "";
                                    $scope.filterModel.qty = "";
                                    $scope.filterModel.productConversionWLH = "";
                                    $scope.filterModel.volume_Name = "";
                                    $scope.filterModel.tihi = "";
                                    $scope.filterModel.qty_Per_Tag = "";

                                    $scope.dropdownItemStatus.model = {};
                                    $scope.dropdownProductconversion.model = undefined;
                                    $scope.listfilterModel = {};
                                    $scope.filterModel.mFG_Date = "";
                                    $scope.filterModel.eXP_Date = "";
                                    $scope.filterModel.product_Lot = "";
                                    
                                } else {
                                    if (res.data.checkqtyPO) {
                                        dpMessageBox.alert({
                                            title: 'ALERT',
                                            message: 'ไม่สามารถรับสินค้าเกินกว่าที่ระบุใน PO ได้'
                                        })
                                    }else{
                                        dpMessageBox.alert({
                                            title: 'ALERT',
                                            message: 'ไม่สามารถรับสินค้าเกินกว่าที่ระบุใน Delivery Note ได้'
                                        })
                                    }
                                }
                            }

                        },
                        function error(response) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: 'MSG_Save_error'
                                }
                            )
                        }
                    );
                },
                    function error(param) {
                    });
            };

            $scope.$watch('filterModel.qty', function () {
                if ($scope.filterModel.qty != null && $scope.filterModel.qty != "" && $scope.filterModel.qty != undefined) {
                    var myInput = document.querySelector('#q2');
                    myInput.value = myInput.value.replace(/(\.\d{2})\d+/g, '$1');
                }
            });

            $scope.delete = function (param, index, list) {
                $scope.filterModel.goodsReceiveItem_Index = param.goodsReceiveItem_Index;
                $scope.filterModel.goodsReceive_Index = param.goodsReceive_Index;
                var deferred = $q.defer();
                pageLoading.show();
                $scope.filterModel.cancel_By = $scope.userName;
                viewModel.deleteItem($scope.filterModel).then(
                    function success(res) {
                        debugger
                        if(res.data.Message){
                            list.splice(index, 1);
                            pageLoading.hide();
                        }
                        
                    },
                    function error(response) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'แจ้งเตือน',
                            message: "ERROR"
                        })
                        deferred.reject(response);
                    });
                return deferred.promise;
            }


            $scope.dropdownDocumentType = function () {
                viewModel.dropdownDocumentType($scope.filterModel).then(function (res) {
                    $scope.dropdownDocumentType = res.data;
                });
            };

            $scope.dropdownItemStatus = function () {
                viewModel.dropdownItemStatus($scope.filterModel).then(function (res) {
                    $scope.dropdownItemStatus = res.data;
                });
            };

            $scope.dropdownVolume = function () {
                viewModel.dropdownVolume($scope.filterModel).then(function (res) {
                    $scope.dropdownVolume = res.data;
                });
            };

            $scope.dropdownStorageLoc = function () {
                viewModel.dropdownStorageLoc($scope.filterModel).then(function (res) {
                    $scope.dropdownStorageLoc = res.data;
                });
            };

            $scope.$watch("filterModel.product_Name", function () {
                
                if ($scope.filterModel.product_Id == "" || $scope.filterModel.product_Name == ""
                    || $scope.filterModel.product_Id == undefined || $scope.filterModel.product_Name == undefined) {
                    $scope.filterModel.volume_Index = "";
                    $scope.filterModel.volume_Id = "";
                    $scope.filterModel.volume_Name = "";
                    $scope.filterModel.volume_Ratio = "";
                    $scope.filterModel.productConversionWLH = "";
                }
                else {
                    viewModel.dropdownProductconversion($scope.filterModel).then(function (res) {
                        
                        $scope.dropdownProductconversion = res.data;

                        var conversionDrop = $scope.dropdownProductconversion
                        
                        var filterConversion = conversionDrop.filter((conversionDrop) => {
                        return conversionDrop.productConversion_Index == $scope.productCon_Index;
                        })
                        
                        $scope.dropdownProductconversion.model = filterConversion[0];
                        $scope.filterModel.productConversionWLH = filterConversion[0].productConversion_Width
                            + "*" + filterConversion[0].productConversion_Length
                            + "*" + filterConversion[0].productConversion_Height;
                    });
                }
            });
            

            $scope.$watch("dropdownProductconversion.model", function () {
                debugger
                if ($scope.dropdownProductconversion.model != {} || !$scope.dropdownProductconversion.model != undefined) {
                    var volume = $scope.dropdownVolume
                    const resultvolume = volume.filter((volume) => {
                        return volume.volume_Index == $scope.dropdownProductconversion[0].productConversion_Volume_Index;
                    })
                    $scope.filterModel.volume_Index = resultvolume[0].volume_Index;
                    $scope.filterModel.volume_Id = resultvolume[0].volume_Id;
                    $scope.filterModel.volume_Name = resultvolume[0].volume_Name;
                    $scope.filterModel.volume_Ratio = resultvolume[0].volume_Ratio;

                    $scope.filterModel.productConversionWLH = $scope.dropdownProductconversion.model.productConversion_Width
                        + "*" + $scope.dropdownProductconversion.model.productConversion_Length
                        + "*" + $scope.dropdownProductconversion.model.productConversion_Height;
                    // $scope.filterModel.conversion = "1 "  + $scope.dropdownProductconversion.model.productConversion_Name + " = " + $scope.dropdownProductconversion.model.productconversion_Ratio + " EA";
                }
                else {
                    $scope.filterModel.volume_Index = "";
                    $scope.filterModel.volume_Id = "";
                    $scope.filterModel.volume_Name = "";
                    $scope.filterModel.volume_Ratio = "";
                    $scope.filterModel.productConversionWLH = "";
                }

            });

            $scope.$watch("productCon_Index", function () {
                
                if ($scope.filterModel.product_Id == "" || $scope.filterModel.product_Name == ""
                    || $scope.filterModel.product_Id == undefined || $scope.filterModel.product_Name == undefined) {
                    $scope.filterModel.volume_Index = "";
                    $scope.filterModel.volume_Id = "";
                    $scope.filterModel.volume_Name = "";
                    $scope.filterModel.volume_Ratio = "";
                    $scope.filterModel.productConversionWLH = "";
                }
                else {
                    viewModel.dropdownProductconversion($scope.filterModel).then(function (res) {
                        
                        $scope.dropdownProductconversion = res.data;

                        var conversionDrop = $scope.dropdownProductconversion
                        
                        var filterConversion = conversionDrop.filter((conversionDrop) => {
                        return conversionDrop.productConversion_Index == $scope.productCon_Index;
                        })
                        
                        $scope.dropdownProductconversion.model = filterConversion[0];
                        $scope.filterModel.productConversionWLH = filterConversion[0].productConversion_Width
                            + "*" + filterConversion[0].productConversion_Length
                            + "*" + filterConversion[0].productConversion_Height;
                    });
                }
            });

            $scope.filterGRItem = function () {
                viewModel.filterGRItem($scope.filterModel).then(function (res) {
                    $scope.listfilterModel = res.data;

                    let dataList = $scope.listfilterModel;

                    for (var i = 0; i <= dataList.length - 1; i++) {
                        $scope.listfilterModel[i].qty = parseFloat($scope.listfilterModel[i].qty);
                    }

                });
            };

            $scope.masterRequirePopup = {
                onShow: false,
                delegates: {},
                onClick: function (param) {
                    $scope.masterRequirePopup.onShow = !$scope.masterRequirePopup.onShow;
                    $scope.masterRequirePopup.delegates(param);
                },
                config: {
                    title: ""
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.mFG_DateShow = angular.copy(param.mFG_Date);
                        $scope.filterModel.eXP_DateShow = angular.copy(param.eXP_Date);

                        if ($scope.filterModel.mFG_DateShow != undefined && $scope.filterModel.mFG_DateShow != null && $scope.filterModel.mFG_DateShow != "" ) {
                            var date = $scope.filterModel.mFG_DateShow;
                            $scope.filterModel.mFG_DateShow = formatDate(date);
                        }

                        if ($scope.filterModel.eXP_DateShow != undefined && $scope.filterModel.eXP_DateShow != null && $scope.filterModel.eXP_DateShow != "" ) {
                            var date = $scope.filterModel.eXP_DateShow;
                            $scope.filterModel.eXP_DateShow = formatDate(date);
                        }

                        $scope.filterModel.mFG_Date = angular.copy(param.mFG_Date)
                        $scope.filterModel.eXP_Date = angular.copy(param.eXP_Date)
                        $scope.filterModel.product_Lot = angular.copy(param.lot)
                    }
                }
            };

            function formatDate(date) {
                var year = date.substr(0, 4);
                var month = date.substr(4, 2);
                var day = date.substr(6, 2);

                return date = day + '/' + month + '/' + year;
            }

            $vm.$onInit = function () {
                let date = new Date;
                $vm = this;
                $scope.dropdownDocumentType();
                $scope.dropdownItemStatus();
                $scope.dropdownVolume();
                $scope.dropdownStorageLoc();
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.click = 1;
                setTimeout(() => {
                    var focusElem = jQuery('input[ng-model="filterModel.planGoodsReceive_No"]');
                    focusElem[0].focus();

                }, 200);
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

            function getTime() {
                var Minute = new Date().getMinutes();
                var Hour = new Date().getHours();
                if (Minute < 10) Minute = '0' + Minute;

                return Hour.toString() + ':' + Minute.toString()
            }


        }
    })
})();