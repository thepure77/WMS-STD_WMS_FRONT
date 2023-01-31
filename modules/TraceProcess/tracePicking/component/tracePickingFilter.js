(function () {
    'use strict';
    app.component('tracePickingFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/TraceProcess/tracePicking/component/tracePickingFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            filterSearch: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, dpMessageBox, commonService, localStorageService, tracePickingFactory, webServiceAPI) {
            var $vm = this;
            var viewModel = tracePickingFactory;


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

            this.$onInit = function () {
                $scope.filterModel = {};
            };

            

            //export data
            $scope.exportData = function () {
                pageLoading.show();
                $scope.convertDate();
                $scope.filterModel = $scope.filterModel || {};
                viewModel.ExcelOutTracePick($scope.filterModel).then(function (res) {
                    //pageLoading.hide();
                    debugger
                    if (res.data.length != 0) {
                        $vm.ResultModelExcel = res.data.itemsTrace;

                        var createXLSLFormatObj = [];

                        /* XLS Head Columns */
                        var xlsHeader = ["No.", "GI No", "Shipment No","Load Date","Order","Pallet ID","Tagout No","Product ID","Product Name","Qty","Unit","Batch","Location Type","Location Pick","Location Old","Location Current","Status","Chute","Roll Cage","Branch Code","Drop/Order","Pick by","Pick date"];


                        /* XLS Rows Data */
                        var xlsRows = [];
                        var number = 1;
                        debugger
                        $vm.ResultModelExcel.forEach(e => {
                            xlsRows.push({
                                "No.": number
                            , "GI No": e.goodsissue_No
                            , "Shipment No": e.truckLoad_No
                            , "Load Date": e.truckLoad_Date
                            , "Order": e.planGoodsIssue_No
                            , "Pallet ID": e.pallet_No
                            , "Tagout No": e.tagOut_No
                            , "Product ID": e.product_Id
                            , "Product Name": e.product_Name
                            , "Qty": e.qty
                            , "Unit": e.productConversion_Name
                            , "Batch": e.product_Lot
                            , "Location Type": e.locationType
                            , "Location Pick": e.pick_location
                            , "Location Old": e.old_location
                            , "Location Current": e.current_location
                            , "Status": e.status
                            , "Chute": e.chute_Id
                            , "Roll Cage": e.rollCage_Id
                            , "Branch Code": e.tagOutRef_No1
                            , "Drop/Order": e.documentRef_No5
                            , "Pick by":e.pickingPickQty_By
                            , "Pick date": e.pickingPickQty_Date
                               
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
                        JSONToCSVConvertor(createXLSLFormatObj, "Trace Pick");
                    } else {
                        $vm.ResultModelExcel = res.data.itemsTrace;
                    }
                });


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

        }
    });

})();