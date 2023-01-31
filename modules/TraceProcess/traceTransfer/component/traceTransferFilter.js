(function () {
    'use strict';
    app.component('traceTransferFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/TraceProcess/traceTransfer/component/traceTransferFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            filterSearch: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, dpMessageBox, commonService, localStorageService, traceTransferFactory, webServiceAPI) {
            var $vm = this;
            var viewModel = traceTransferFactory;


            $vm.filterModel = {
                currentPage: 1,
                perPage: 50,
                totalRow: 0,
                advanceSearch: false,
            };


            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };

            $scope.filterSearch = function () {
                debugger
                $scope.filterModel = $vm.filterModel || {};

                if ($scope.dropdownStatus.model != null) {
                    $scope.filterModel.processStatus_Index = $scope.dropdownStatus.model.processStatus_Index;
                    $scope.filterModel.processStatus_Id = $scope.dropdownStatus.model.processStatus_Id;
                    $scope.filterModel.processStatus_Name = $scope.dropdownStatus.model.processStatus_Name;
                }
                else {
                    $scope.filterModel.processStatus_Index = null;
                    $scope.filterModel.processStatus_Id = null;
                    $scope.filterModel.processStatus_Name = null;
                }

                $scope.filterModel.PerPage = $vm.filterModel.perPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                $scope.filterModel.date = $('input[name="datefilter"]').val();
                if ($scope.filterModel.date != null && $scope.filterModel.isDate != 1) {
                    $scope.convertDate();
                }
                pageLoading.show();
                viewModel.searchFilter($scope.filterModel).then(function success(res) {
                    pageLoading.hide();
                    if (res.data.itemsTrace.length != 0) {
                        $vm.filterModel.perPage = $vm.filterModel.perPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;

                        $vm.filterModel.currentPage = res.data.pagination.currentPage;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }
                        $vm.searchResultModel = res.data.itemsTrace;
                    }
                    else {
                        $vm.searchResultModel = res.data.itemsTrace;
                    }

                    $vm.filterModel.totalRow = res.data.pagination.totalRow;


                }, function error(res) { });
            };

            $scope.dropdownStatus = function () {
                viewModel.dropdownStatus($scope.filterModel).then(function (res) {
                    $scope.dropdownStatus = res.data;
                });
            };

            $scope.autoComplete = {
                GoodsIssue_No: "AutoGoodsIssue/autoGoodIssueNo",
                planGoodsIssue_No: "AutoPlanGoodIssue/autoPlanGoodIssueNo",
                truckload_No: "AutoLoad/autoTruckloadNo",
                product: "Autocomplete/autoSearchProduct",
                autoGT: "AutoGoodsTransfer/autoGoodsTransferNo",
            };

            $scope.url = {
                GI: webServiceAPI.GI,
                PlanGI: webServiceAPI.PlanGI,
                Load: webServiceAPI.Load,
                Master: webServiceAPI.Master,
                GT: webServiceAPI.GT,
            };

            $scope.convertDate = function () {
            debugger
                if ($scope.filterModel.date != null) {
                    var str = $scope.filterModel.date;

                    var DStart = str.substring(0, 2);
                    var MStart = str.substring(5, 3);
                    var YStart = str.substring(10, 6);

                    $scope.filterModel.transfer_Date = YStart.toString() + '-' + MStart.toString() + '-' + DStart.toString();

                    var DEnd = str.substring(15, 13);
                    var MEnd = str.substring(18, 16);
                    var YEnd = str.substring(25, 19);

                    $scope.filterModel.transfer_Date_To = YEnd.toString() + '-' + MEnd.toString() + '-' + DEnd.toString();
                }
            };

            

            // $scope.exportData = function () {
            //     pageLoading.show();
            //     $scope.filterModel = $vm.filterModel || {};
            //     $scope.filterModel.export = true;
            //     viewModel.searchFilter($scope.filterModel).then(function (res) {
            //         pageLoading.hide();
            //         if (res.data.itemsTrace.length == 0) {
            //             return MessageBox.alert({
            //                 ok: 'Close',
            //                 title: 'Information',
            //                 message: 'ไม่พบข้อมูล'
            //             })
            //         }

            //         var createXLSLFormatObj = [];

            //         /* XLS Head Columns */
            //         var xlsHeader = ["No.", "GI No", "Truck No","Loading Date","Order","Pallet No","Tag","Product Id","Product Name","Qty","Unit","Batch/Lot","Location Type","Location Pick","Location Old","Location Current","Status","Chute","Roll Cage","Branch Code","Drop/Order"];

            //         /* XLS Rows Data */
            //         var xlsRows = [];
            //         var number = 1;
            //         res.data.itemsStock.forEach(e => {
            //             xlsRows.push({
            //                 "No.": number
            //                 , "Product Number": e.product_Id
            //                 , "Product": e.product_Name.replace('"', "''")
            //                 , "Status": e.itemStatus_Name
            //                 , "Lot": (e.product_Lot == null) ? "" : e.product_Lot
            //                 , "Vendor ID": e.owner_Id
            //                 , "Vendor Name": e.owner_Name
            //                 , "Qty Bal": e.binBalance_QtyBal
            //                 , "Qty Reserve": e.binBalance_QtyReserve
            //                 , "Unit": e.goodsReceive_ProductConversion_Name
            //                 , "Qty Amount": e.amount
            //                 , "Base Unit": e.productConversion_Name
            //                 , "Sale Qty": e.sale_qty
            //                 , "Sale Unit": e.sale_unit
            //                 , "Weight": e.binBalance_WeightBal
            //                 , "Location Type Name": e.locationType_Name
            //                 , "ERP Location": (e.erp_location == null) ? "" :  e.erp_location
            //                 , "CBM": e.cbm
                            
            //             });
            //             number++
            //         });

            //         var today = new Date();
            //         var mm = today.getMonth() + 1;
            //         var yyyy = today.getUTCFullYear();
            //         var dd = today.getDate();
            //         var Minute = today.getMinutes();
            //         var Hour = today.getHours();

            //         if (Minute < 10) Minute = '0' + Minute;

            //         if (dd < 10) dd = '0' + dd;
            //         if (mm < 10) mm = '0' + mm;

            //         var datetime = yyyy.toString() + mm.toString() + dd.toString() + Hour.toString() + Minute.toString();

            //         createXLSLFormatObj.push(xlsHeader);
            //         $.each(xlsRows, function (index, value) {
            //             var innerRowData = [];
            //             $.each(value, function (ind, val) {
            //                 innerRowData.push(val);
            //             });
            //             createXLSLFormatObj.push(innerRowData);
            //         });
            //         pageLoading.hide();
            //         JSONToCSVConvertor(createXLSLFormatObj,"Trackpicking");
            //     }, function error(res) { pageLoading.hide();});
            // }

            //export data
            $scope.export = function () {
                pageLoading.show();
                $scope.convertDate();
                $scope.filterModel = $scope.filterModel || {};
                viewModel.searchFilter($scope.filterModel).then(function (res) {
                    //pageLoading.hide();
                    debugger
                    if (res.data.length != 0) {
                        $vm.ResultModelExcel = res.data.itemsTrace;

                        var createXLSLFormatObj = [];

                        /* XLS Head Columns */
                        var xlsHeader = ["ลำดับ",
                        "Product ID",
                        "Product Name",
                        "Product Lot",
                        "Pallet ID",
                        "Location",
                        "New Location",
                        "Transfer No",
                        "Transfer Date",
                        "Qty",
                        "Unit",
                        "Remaining",
                        "Unit",
                        "Total Qty",
                        "Unit",
                        "Status",
                        "Create By",
                        "Create Date",
                        "Update By",
                        "Update Date",
                        ];

                        /* XLS Rows Data */
                        var xlsRows = [];
                        var number = 1;
                        debugger
                        $vm.ResultModelExcel.forEach(e => {
                            xlsRows.push({
                                "ลำดับ":e.rowIndex,
                                "Product ID": e.product_Id,
                                "Product Name": e.product_Name,
                                "Product Lot":e.product_Lot,
                                "Pallet ID":e.tag_No,
                                "Location":e.location_Id,
                                "New Location":e.location_Id_To,
                                "Transfer No":e.goodsTransfer_No,
                                "Transfer Date":e.goodsTransfer_Date,
                                "Qty":e.qty,
                                "Unit":e.productConversion_Name,
                                "Remaining":e.remaining,
                                "Unit":e.unit_Remaining,
                                "Total Qty":e.total,
                                "Unit":e.unit_Total,
                                "Status":e.processStatus_Name,
                                "Create By":e.create_By,
                                "Create Date":e.create_Date,
                                "Update By":e.update_By,
                                "Update Date":e.update_Date,
                                
                                
                               
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
                        JSONToCSVConvertor(createXLSLFormatObj, "Trace Transfer");
                    } else {
                        $vm.ResultModelExcel = res.data.itemsTrace;
                    }
                });


            }

            function JSONToCSVConvertor(JSONData, ShowLabel) {
                var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

                var CSV = '';

                for (var i = 0; i < arrData.length; i++) {
                    var row = "";

                    for (var index in arrData[i]) {
                        row += '"' + arrData[i][index] + '",';
                    }

                    row.slice(0, row.length - 1);

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
                var fileName = ShowLabel + "_" + datetime;

                var uri = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(CSV);

                var link = document.createElement("a");
                link.href = uri;

                link.style = "visibility:hidden";
                link.download = fileName + ".csv";

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }


            function formatDate() {
                var today = new Date();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();
                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return dd.toString() + "/" + mm.toString() + "/" + yyyy.toString() + " - " + dd.toString() + "/" + mm.toString() + "/" + yyyy.toString();;
            };
           

            $scope.clearSearch = function () {
                $vm.filterModel = {};
                $scope.filterModel.date = formatDate();            
                $scope.filterModel.isDate = {};
                $scope.dropdownStatus.model = {};
                $window.scrollTo(0, 0);
            };
            
            $scope.autoReplen = function () {
                $scope.filterModel;
                dpMessageBox.confirm({
                    ok: 'OK',
                    cancel: 'Close',
                    title: 'MSG_SURE_data',
                    message: 'Do you want to crate task replenish ?'
                }).then(function () {
                    pageLoading.show();
                    $scope.Run = true;
                    viewModel.resultFind($scope.filterModel).then(function (res) {
                        $scope.mess = 'Done';
                        $scope.filterSearch();
                        debugger
                        if (res.data.resultIsUse) {

                            $scope.Run = false;
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: res.data.resultMsg
                                }
                            )
                        } else {
                            $scope.Run = false;
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: res.data.resultMsg
                                }
                            )
                        }
                    },
                        function error(param) {
                            $scope.Run = false;
                            return dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'แจ้งเตือน',
                                    message: 'กรุณาติดต่อ Admin'
                                }
                            )
                        });
                },);
            };
            this.$onInit = function () {
                $scope.Run = false;
                $scope.filterModel = {};
                $scope.filterModel.date = formatDate();
                $scope.dropdownStatus();
            };

        }
    });

})();