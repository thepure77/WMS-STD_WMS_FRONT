(function () {
    'use strict';
    app.component('traceLoadingFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/TraceProcess/traceLoading/component/traceLoadingFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            filterSearch: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, dpMessageBox, commonService, localStorageService, traceLoadingFactory, webServiceAPI) {
            var $vm = this;
            var viewModel = traceLoadingFactory;
            $scope.filterModel = {};

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
                $scope.filterModel.PerPage = $vm.filterModel.perPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                $scope.filterModel.date = $('input[name="datefilter"]').val();
                if ($scope.filterModel.date != null && $scope.filterModel.isDate != 1) {
                    $scope.convertDate();
                }
                // if ($scope.dropdowndock.model != undefined) {
                //     $scope.filterModel.dock_Index = $scope.dropdowndock.model.dock_Index;
                //     $scope.filterModel.dock_Id = $scope.dropdowndock.model.dock_Id;
                //     $scope.filterModel.dock_Name = $scope.dropdowndock.model.dock_Name;
                // } else {
                //     $scope.filterModel.dock_Index = undefined;
                //     $scope.filterModel.dock_Id = undefined;
                //     $scope.filterModel.dock_Name = undefined;
                // }
                // if ($scope.dropdownAppointtime.model != undefined) {
                //     $scope.filterModel.appointment_Time = $scope.dropdownAppointtime.model.appointment_Time;
                // } else {
                //     $scope.filterModel.appointment_Time = undefined;
                // }
                // if ($scope.Rollcagedock.model != undefined) {
                //     $scope.filterModel.rollCage_Index = $scope.Rollcagedock.model.rollCage_Index;
                //     $scope.filterModel.rollCage_Id = $scope.Rollcagedock.model.rollCage_Id;
                //     $scope.filterModel.rollCage_Name = $scope.Rollcagedock.model.rollCage_Name;

                // } else {
                //     $scope.filterModel.dock_Index = undefined;
                //     $scope.filterModel.dock_Id = undefined;
                //     $scope.filterModel.dock_Name = undefined;
                // }
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

            $scope.autoComplete = {
                GoodsIssue_No: "AutoGoodsIssue/autoGoodIssueNo",
                planGoodsIssue_No: "AutoPlanGoodIssue/autoPlanGoodIssueNo",
                truckload_No: "AutoLoad/autoTruckloadNo",
            };

            $scope.url = {
                GI: webServiceAPI.GI,
                PlanGI: webServiceAPI.PlanGI,
                Load: webServiceAPI.Load,
            };

            $scope.convertDate = function () {

                if ($scope.filterModel.date != null) {
                    var str = $scope.filterModel.date;

                    var DStart = str.substring(0, 2);
                    var MStart = str.substring(5, 3);
                    var YStart = str.substring(10, 6);

                    $scope.filterModel.load_Date = YStart.toString() + MStart.toString() + DStart.toString();

                    var DEnd = str.substring(15, 13);
                    var MEnd = str.substring(18, 16);
                    var YEnd = str.substring(25, 19);

                    $scope.filterModel.load_Date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
                }
            };

            $scope.$watch("$vm.filterModel.Truckload_Index", function () {

                $scope.dropRollcagedock($vm.filterModel);
            });

            this.$onInit = function () {
                $scope.filterModel = {};
                $scope.dropdowndock();
                $scope.dropRollcagedock();
                $scope.Appointtimefilter();
            };

            $scope.dropdowndock = function () {
                viewModel.dropdowndock($scope.filterModel).then(function (res) {
                    $scope.dropdowndock = res.data;
                });
            };

            $scope.dropRollcagedock = function () {
                viewModel.Rollcagedock($scope.filterModel).then(function (res) {
                    $scope.Rollcagedock = res.data;
                });
            };

            $scope.Appointtimefilter = function () {
                viewModel.Appointtimefilter($scope.filterModel).then(function (res) {
                    $scope.dropdownAppointtime = res.data;
                });
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
                viewModel.Export($scope.filterModel).then(function (res) {
                    //pageLoading.hide();
                    debugger
                    if (res.data.length != 0) {
                        $vm.ResultModelExcel = res.data.itemsTrace;

                        var createXLSLFormatObj = [];

                        /* XLS Head Columns */
                        var xlsHeader = ["ลำดับ",
                        "Shipment No",
                        "Dock",
                        "Load Date",
                        "Order",
                        "Chute",
                        "Roll Cage",
                        "tote box",
                        "Tagout No",
                        "Product ID",
                        "Product Name",
                        "Qty",
                        "Unit",
                        "Batch",
                        "Status",
                        "Location Type",
                        "Branch Code",
                        "ShipTo Address",
                        ];

                        /* XLS Rows Data */
                        var xlsRows = [];
                        var number = 1;
                        debugger
                        $vm.ResultModelExcel.forEach(e => {
                            xlsRows.push({
                                "ลำดับ":e.rowIndex,
                                "Shipment No": e.truckLoad_No,
                                "Dock": e.dock_Name,
                                "Load Date":e.truckLoad_Date,
                                "Order":e.planGoodsIssue_No,
                                "Chute":e.chute_Id,
                                "Roll Cage":e.rollCage_Name,
                                "tote box":e.isTote,
                                "Tagout No":e.tagOut_No,
                                "Product ID":e.product_Id,
                                "Product Name":e.product_Name,
                                "Qty":e.qty,
                                "Unit":e.productConversion_Name,
                                "Batch":e.product_Lot,
                                "Status":e.status,
                                "Location Type":e.locationType,
                                "Branch Code":e.tagOutRef_No1,
                                "ShipTo Address":e.address,
                                
                               
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
                        JSONToCSVConvertor(createXLSLFormatObj, "Trace Loading");
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

        }
    });

})();