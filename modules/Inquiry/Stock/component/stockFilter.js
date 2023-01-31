(function () {
    'use strict';
    app.component('stockFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, $window, commonService) {
            return "modules/Inquiry/Stock/component/stockFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            searchDataLocation: '=?',
            filterModelLo: '=?',

        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, pageLoading, dpMessageBox, localStorageService, commonService, stockFactory, webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = stockFactory;
            var model = $scope.filterModel;

            $vm.filterModel = {
                currentPage: 1,
                perPage: 50,
                totalRow: 0,
                advanceSearch: false,
            };
            $vm.filterModelLo = {
                currentPage: 1,
                perPage: 50,
                totalRow: 0,
                advanceSearch: false,
            };




            $scope.header = {
                advanceSearch: false
            };
            $scope.hide = function () {
                $scope.header.advanceSearch = $scope.header.advanceSearch === false ? true : false;
                $scope.header.advanceSearch = $scope.header.advanceSearch;
            };


            // $vm.triggerSearch = function () {
            //     $vm.filterModel = $vm.filterModel || {};
            //     $scope.filterModel.advanceSearch = $vm.filterModel.advanceSearch;
            //     pageLoading.show();
            //     viewModel.filterByProduct($vm.filterModel).then(function (res) {
            //         pageLoading.hide();
            //         if (res.data.itemsStock.length != 0) {
            //             $scope.filterModel.perPage = $vm.filterModel.perPage;
            //             $vm.filterModel.totalRow = res.data.pagination.totalRow;

            //             if (res.data.pagination != null || res.data.pagination != undefined) {
            //                 $vm.filterModel.totalRow = res.data.pagination.totalRow;
            //             }
            //             $vm.searchResultModel = res.data.itemsStock;
            //         }
            //         else {
            //             $vm.searchResultModel = res.data.itemsStock;
            //         }
            //         $vm.filterModel.totalRow = res.data.pagination.totalRow;
            //     });

            //     viewModel.filterByLocatuion($vm.filterModelLo).then(function (res) {
            //         pageLoading.hide();
            //         if (res.data.itemsStockLo.length != 0) {
            //             $vm.filterModelLo.perPage = $vm.filterModelLo.perPage;
            //             $vm.filterModelLo.totalRow = res.data.pagination.totalRow;

            //             // $vm.filterModelLo.currentPage = res.data.pagination.currentPage;


            //             if (res.data.pagination != null || res.data.pagination != undefined) {
            //                 $vm.filterModelLo.totalRow = res.data.pagination.totalRow;
            //             }
            //             $vm.searchDataLocation = res.data.itemsStockLo;
            //         }
            //         else {
            //             $vm.searchDataLocation = res.data.itemsStockLo;
            //         }
            //         $vm.filterModelLo.totalRow = res.data.pagination.totalRow;
            //     });
            // };


            $scope.searchFilter = function () {
                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel.PerPage = $vm.filterModel.perPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                $scope.filterModel.advanceSearch = $scope.header.advanceSearch;
                $scope.filterModel.isExportByProduct = false;
                $scope.filterModel.isExportByLocation = false;
                if ($scope.filterModel.date != null) {
                    $scope.convertDate();
                }
                if ($scope.filterModel.Mfgdate != null) {
                    $scope.convertDate();
                }
                if ($scope.filterModel.Expdate != null) {
                    $scope.convertDate();
                }

                if ($scope.filterModel.owner_Name == "") {
                    $scope.filterModel.owner_Index = "00000000-0000-0000-0000-000000000000";
                }
                if ($scope.filterModel.product_Name == "") {
                    $scope.filterModel.product_Index = "00000000-0000-0000-0000-000000000000";
                }
                if ($scope.filterModel.location_Name == "") {
                    $scope.filterModel.location_Index = "00000000-0000-0000-0000-000000000000";
                }
                if ($scope.filterModel.itemStatus_Name == "") {
                    $scope.filterModel.itemStatus_Index = "00000000-0000-0000-0000-000000000000";
                }
                if ($scope.filterModel.productType_Name == "") {
                    $scope.filterModel.productType_Index = "00000000-0000-0000-0000-000000000000";
                }
                if ($scope.filterModel.zone_Name == "") {
                    $scope.filterModel.zone_Index = "00000000-0000-0000-0000-000000000000";
                }

                // if ($scope.dropdownProductType.model != null) {
                //     $scope.filterModel.productType_Index = $scope.dropdownProductType.model.productType_Index;
                //     $scope.filterModel.productType_Id = $scope.dropdownProductType.model.productType_Id;
                //     $scope.filterModel.productType_Name = $scope.dropdownProductType.model.productType_Name;
                // } else {
                //     $scope.filterModel.productType_Index = "00000000-0000-0000-0000-000000000000";
                //     $scope.filterModel.productType_Id = -99;
                //     $scope.filterModel.productType_Name = "";
                // }

                // if ($scope.dropdownItemStatus.model != null) {
                //     $scope.filterModel.itemStatus_Index = $scope.dropdownItemStatus.model.itemStatus_Index;
                //     $scope.filterModel.itemStatus_Id = $scope.dropdownItemStatus.model.itemStatus_Id;
                //     $scope.filterModel.itemStatus_Name = $scope.dropdownItemStatus.model.itemStatus_Name;
                // } else {
                //     $scope.filterModel.itemStatus_Index = "00000000-0000-0000-0000-000000000000";
                //     $scope.filterModel.itemStatus_Id = -99;
                //     $scope.filterModel.itemStatus_Name = "";
                // }

                // if ($scope.dropdownZone.model != null) {
                //     $scope.filterModel.zone_Index = $scope.dropdownZone.model.zone_Index;
                //     $scope.filterModel.zone_Id = $scope.dropdownZone.model.zone_Id;
                //     $scope.filterModel.zone_Name = $scope.dropdownZone.model.zone_Name;
                // } else {
                //     $scope.filterModel.zone_Index = "00000000-0000-0000-0000-000000000000";
                //     $scope.filterModel.zone_Id = -99;
                //     $scope.filterModel.zxone_Name = "";
                // }

                viewModel.setParam($scope.filterModel);

                pageLoading.show();
                viewModel.filterByProduct($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    if (res.data.itemsStock.length != 0) {
                        $vm.filterModel.perPage = $vm.filterModel.perPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;

                        $vm.filterModel.currentPage = res.data.pagination.currentPage;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }
                        $vm.searchResultModel = res.data.itemsStock;
                    }
                    else {
                        $vm.searchResultModel = res.data.itemsStock;
                    }

                    $vm.filterModel.totalRow = res.data.pagination.totalRow;

                });

                viewModel.filterByLocatuion($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    // $vm.filterModelLo ={};
                    if (res.data.itemsStockLo.length != 0) {
                        $vm.filterModelLo.perPage = $vm.filterModel.perPage;
                        $vm.filterModelLo.totalRow = res.data.pagination.totalRow;

                        $vm.filterModelLo.currentPage = res.data.pagination.currentPage;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModelLo.totalRow = res.data.pagination.totalRow;
                        }
                        $vm.searchDataLocation = res.data.itemsStockLo;
                    }
                    else {
                        $vm.searchDataLocation = res.data.itemsStockLo;
                    }
                    $vm.filterModelLo.totalRow = res.data.pagination.totalRow;

                });
            };

            $scope.exportDataByProduct = function () {
                pageLoading.show();
                let filter = {};
                filter.productId = $scope.filterModel.productId;
                filter.productName = $scope.filterModel.productName;
                $scope.filterModel.isExportByProduct = true;
                viewModel.filterByProduct($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    if (res.data.itemsStock.length == 0) {
                        return MessageBox.alert({
                            ok: 'Close',
                            title: 'Information',
                            message: 'ไม่พบข้อมูล'
                        })
                    }

                    // if (res.data.itemsStock.length != 0) {
                    //     $vm.filterModel.perPage = $vm.filterModel.perPage;
                    //     $vm.filterModel.totalRow = res.data.pagination.totalRow;

                    //     $vm.filterModel.currentPage = res.data.pagination.currentPage;

                    //     if (res.data.pagination != null || res.data.pagination != undefined) {
                    //         $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    //     }
                    //     $vm.searchResultModel = res.data.itemsStock;
                    // }
                    // else {
                    //     $vm.searchResultModel = res.data.itemsStock;
                    // }

                    // $vm.filterModel.totalRow = res.data.pagination.totalRow;
                
                    //$scope.searchFilter($scope.filterModel).then(function success(res) {

                    var createXLSLFormatObj = [];

                    /* XLS Head Columns */
                    var xlsHeader = ["No.", "Product Number", "Product", "Status", "Lot", "Vendor ID", "Vendor Name", "Qty Bal", "Qty Reserve","Unit","Qty Amount","Base Unit","Sale Qty","Sale Unit","Weight","Location Type Name","ERP Location","CBM"];

                    /* XLS Rows Data */
                    var xlsRows = [];
                    var number = 1;
                    res.data.itemsStock.forEach(e => {
                        xlsRows.push({
                            "No.": number
                            , "Product Number": e.product_Id
                            , "Product": e.product_Name.replace('"', "''")
                            , "Status": e.itemStatus_Name
                            , "Lot": (e.product_Lot == null) ? "" : e.product_Lot
                            , "Vendor ID": e.owner_Id
                            , "Vendor Name": e.owner_Name
                            , "Qty Bal": e.binBalance_QtyBal
                            , "Qty Reserve": e.binBalance_QtyReserve
                            , "Unit": e.goodsReceive_ProductConversion_Name
                            , "Qty Amount": e.amount
                            , "Base Unit": e.productConversion_Name
                            , "Sale Qty": e.sale_qty
                            , "Sale Unit": e.sale_unit
                            , "Weight": e.binBalance_WeightBal
                            , "Location Type Name": e.locationType_Name
                            , "ERP Location": (e.erp_location == null) ? "" :  e.erp_location
                            , "CBM": e.cbm
                            
                        });
                        number++
                    });

                    var today = new Date();
                    var mm = today.getMonth() + 1;
                    var yyyy = today.getUTCFullYear();
                    var dd = today.getDate();
                    var Minute = today.getMinutes();
                    var Hour = today.getHours();

                    if (Minute < 10) Minute = '0' + Minute;

                    if (dd < 10) dd = '0' + dd;
                    if (mm < 10) mm = '0' + mm;

                    var datetime = yyyy.toString() + mm.toString() + dd.toString() + Hour.toString() + Minute.toString();

                    createXLSLFormatObj.push(xlsHeader);
                    $.each(xlsRows, function (index, value) {
                        var innerRowData = [];
                        $.each(value, function (ind, val) {
                            innerRowData.push(val);
                        });
                        createXLSLFormatObj.push(innerRowData);
                    });
                    pageLoading.hide();
                    JSONToCSVConvertor(createXLSLFormatObj,"StockByProduct");
                }, function error(res) { pageLoading.hide();});
            }

            $scope.exportDataByLocation = function () {
                pageLoading.show();
                let filter = {};
                filter.productId = $scope.filterModel.productId;
                filter.productName = $scope.filterModel.productName;
                $scope.filterModel.isExportByLocation = true;
                viewModel.filterByLocatuion($scope.filterModel).then(function (res) {
                    pageLoading.hide();
                    if (res.data.itemsStockLo.length == 0) {
                        return MessageBox.alert({
                            ok: 'Close',
                            title: 'Information',
                            message: 'ไม่พบข้อมูล'
                        })
                    }

                    var createXLSLFormatObj = [];

                    /* XLS Head Columns */
                    var xlsHeader = ["No.","Tag No","Zone","Location Name","Product Number","Product","Product Type","Item Status","Product lot","Qty Bal","Qty Reserve","Qty Amount","Unit","Sale Qty","Sale Unit","GR No","GR Date","MFG Date","EXP Date","ShelfLife","ShelfLife_D","Remaining","Location Type Name","ERP Location","CBM"];

                    /* XLS Rows Data */
                    var xlsRows = [];
                    var number = 1;
                    res.data.itemsStockLo.forEach(e => {
                        xlsRows.push({
                            "No.": number
                            , "Tag No": e.tag_No
                            , "Zone": (e.zone_Name == null) ? "" : e.zone_Name
                            , "Location Name": e.location_Name
                            , "Product Number": e.product_Id
                            , "Product": e.product_Name.replaceAll("\"","''")
                            , "Product Type": (e.productType_Name == null) ? "" : e.productType_Name
                            , "Item Status": e.itemStatus_Name
                            , "Product lot": (e.product_Lot == null) ? "" : e.product_Lot
                            , "Qty Bal": e.binBalance_QtyBal
                            , "Qty Reserve": e.binBalance_QtyReserve
                            , "Qty Amount": e.amount
                            , "Unit": e.productConversion_Name
                            , "Sale Qty": e.sale_qty
                            , "Sale Unit": e.sale_unit
                            , "GR No": e.goodsReceive_No
                            , "GR Date": (e.goodsReceive_Date == "") ? "" : e.goodsReceive_Date.substring(6,8) + "/" + e.goodsReceive_Date.substring(4,6) + "/" + e.goodsReceive_Date.substring(0,4)
                            , "MFG Date": (e.goodsReceive_MFG_Date == "") ? "" : e.goodsReceive_MFG_Date.substring(6,8) + "/" + e.goodsReceive_MFG_Date.substring(4,6) + "/" + e.goodsReceive_MFG_Date.substring(0,4)
                            , "EXP Date": (e.goodsReceive_EXP_Date == "") ? "" : e.goodsReceive_EXP_Date.substring(6,8) + "/" + e.goodsReceive_EXP_Date.substring(4,6) + "/" + e.goodsReceive_EXP_Date.substring(0,4)
                            , "ShelfLife": (e.dateDiffGetdate == null) ? 0 : e.dateDiffGetdate
                            , "ShelfLife_D": (e.productShelfLife_D == null) ? 0 : e.productShelfLife_D
                            , "Remaining": (e.remainingShelfLife == null) ? 0 : e.remainingShelfLife
                            , "Location Type Name": e.locationType_Name
                            , "ERP Location": (e.erp_location == null) ? "" : e.erp_location
                            , "CBM": e.cbm
                        });
                        number++
                    });

                    var today = new Date();
                    var mm = today.getMonth() + 1;
                    var yyyy = today.getUTCFullYear();
                    var dd = today.getDate();
                    var Minute = today.getMinutes();
                    var Hour = today.getHours();

                    if (Minute < 10) Minute = '0' + Minute;

                    if (dd < 10) dd = '0' + dd;
                    if (mm < 10) mm = '0' + mm;

                    var datetime = yyyy.toString() + mm.toString() + dd.toString() + Hour.toString() + Minute.toString();

                    createXLSLFormatObj.push(xlsHeader);
                    $.each(xlsRows, function (index, value) {
                        var innerRowData = [];
                        $.each(value, function (ind, val) {
                            innerRowData.push(val);
                        });
                        createXLSLFormatObj.push(innerRowData);
                    });
                    pageLoading.hide();
                    JSONToCSVConvertor(createXLSLFormatObj,"StockByLocation");
                }, function error(res) { pageLoading.hide();});
            }

            function JSONToCSVConvertor(JSONData, ShowLabel) {
                //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
                var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

                var CSV = '';

                //1st loop is to extract each row
                for (var i = 0; i < arrData.length; i++) {
                    var row = "";

                    //2nd loop will extract each column and convert it in string comma-seprated
                    for (var index in arrData[i]) {
                        row += '"' + arrData[i][index] + '",';
                    }

                    row.slice(0, row.length - 1);

                    //add a line break after each row
                    CSV += row + '\r\n';
                }

                if (CSV == '') {
                    alert("Invalid data");
                    return;
                }

                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();
                var Minute = today.getMinutes();
                var Hour = today.getHours();

                if (Minute < 10) Minute = '0' + Minute;

                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                var datetime = yyyy.toString() + mm.toString() + dd.toString() + Hour.toString() + Minute.toString();
                //Generate a file name
                var fileName = ShowLabel + "_" + datetime;
                //this will remove the blank-spaces from the title and replace it with an underscore

                //Initialize file format you want csv or xls
                var uri = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(CSV);

                // Now the little tricky part.
                // you can use either>> window.open(uri);
                // but this will not work in some browsers
                // or you will not get the correct file extension    

                //this trick will generate a temp <a /> tag
                var link = document.createElement("a");
                link.href = uri;

                //set the visibility hidden so it will not effect on your web-layout
                link.style = "visibility:hidden";
                link.download = fileName + ".csv";

                //this part will append the anchor tag and remove it after automatic click
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            $scope.clearSearch = function () {
                $scope.filterModel = {};
                // $scope.filterModel.date = formatDate();
                // $scope.filterModel.dateDue = formatDate();
                // $scope.dropdownDocumentType.model = {};
                // $scope.dropdownStatus.model = {};
                $window.scrollTo(0, 0);
            }

            $scope.convertDate = function () {

                if ($scope.filterModel.date != null) {
                    var str = $scope.filterModel.date;

                    var DStart = str.substring(0, 2);
                    var MStart = str.substring(5, 3);
                    var YStart = str.substring(10, 6);

                    $scope.filterModel.goodsReceive_Date = YStart.toString() + MStart.toString() + DStart.toString();

                    var DEnd = str.substring(15, 13);
                    var MEnd = str.substring(18, 16);
                    var YEnd = str.substring(25, 19);

                    $scope.filterModel.goodsReceive_Date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
                }
                if ($scope.filterModel.Mfgdate != null) {
                    var str = $scope.filterModel.Mfgdate;

                    var DStart = str.substring(0, 2);
                    var MStart = str.substring(5, 3);
                    var YStart = str.substring(10, 6);

                    $scope.filterModel.goodsReceive_MFG_Date = YStart.toString() + MStart.toString() + DStart.toString();

                    var DEnd = str.substring(15, 13);
                    var MEnd = str.substring(18, 16);
                    var YEnd = str.substring(25, 19);

                    $scope.filterModel.goodsReceive_MFG_Date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
                }
                if ($scope.filterModel.Expdate != null) {
                    var str = $scope.filterModel.Expdate;

                    var DStart = str.substring(0, 2);
                    var MStart = str.substring(5, 3);
                    var YStart = str.substring(10, 6);

                    $scope.filterModel.goodsReceive_EXP_Date = YStart.toString() + MStart.toString() + DStart.toString();

                    var DEnd = str.substring(15, 13);
                    var MEnd = str.substring(18, 16);
                    var YEnd = str.substring(25, 19);

                    $scope.filterModel.goodsReceive_EXP_Date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
                }

            };


            // ----------------------------------------------------
            // This local function

            function formatDate() {
                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();
                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return dd.toString() + "/" + mm.toString() + "/" + yyyy.toString() + " - " + dd.toString() + "/" + mm.toString() + "/" + yyyy.toString();;
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


            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });



            // $scope.dropdownProductType = function () {
            //     viewModel.dropdownProductType($scope.filterModel).then(function (res) {
            //         $scope.dropdownProductType = res.data;
            //     });
            // };
            // $scope.dropdownItemStatus = function () {
            //     viewModel.dropdownItemStatus($scope.filterModel).then(function (res) {
            //         $scope.dropdownItemStatus = res.data;
            //     });
            // };
            // $scope.dropdownZone = function () {
            //     viewModel.dropdownZone($scope.filterModel).then(function (res) {
            //         $scope.dropdownZone = res.data;
            //     });
            // };
            // $scope.dropdownLocation = function () {
            //     viewModel.dropdownLocation($scope.filterModel).then(function (res) {
            //         $scope.dropdownLocation = res.data;
            //     });
            // };


            $scope.autoComplete = {
                ownerId: "PickBinbalance/AutoCompleterOwnerId",
                ownerName: "PickBinbalance/AutoCompleterOwnerName",
                sku: "PickBinbalance/AutoCompleteProductId",
                product: "PickBinbalance/AutoCompleteProductName",
                GR: "PickBinbalance/AutoCompleterGR",
                Tag: "PickBinbalance/AutoCompleterTag",
                productType: "PickBinbalance/AutoCompleteProductType",
                zone: "PickBinbalance/autoZonefilter",
                location: "PickBinbalance/autoLocationFilter",
                itemStatu: "PickBinbalance/autoItemStatus",

            };

            $scope.url = {
                BinBalance: webServiceAPI.BinBalance,
            };

            this.$onInit = function () {
                $scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');
                // $scope.dropdownProductType();
                // $scope.dropdownItemStatus();
                // $scope.dropdownZone();
                // $scope.dropdownLocation();

            };

        }
    });

})();