
(function () {
    'use strict'
    app.directive('returnTotePopupReportTable', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/GI/ReturnTote/returnTotePopupReport/returnTotePopupReportTable.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'webServiceAPI', 'returnToteFactory', 'dpMessageBox',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, webServiceAPI, returnToteFactory, dpMessageBox) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = returnToteFactory;
                        $scope.onShow = false;
                        $scope.ResultData = {};
                        $scope.model = {};
                        // $scope.onHide = function (param) {
                        // };
                        $scope.onClose = function () {
                            $scope.onShow = false;

                        };

                        $scope.status = [
                            {
                                value: 1,
                                display: "รอคืน"
                            },
                            {
                                value: 2,
                                display: "คืนแล้ว"
                            }
                        ];

                        // function getToday() {
                        //     var today = new Date();
                        //     var mm = today.getMonth() + 1;
                        //     var yyyy = today.getUTCFullYear();
                        //     var dd = today.getDate();
                        //     if (dd < 10) dd = '0' + dd;
                        //     if (mm < 10) mm = '0' + mm;
                        //     return yyyy.toString() + mm.toString() + dd.toString();
                        // }

                        $scope.delegates = function () {
                            $scope.filterModel = {};
                            // $scope.getCheckIsLot = true;
                            $scope.filterModel.isDateLoad = '0';
                            $scope.filterModel.isDateRerurn = '0';
                            $scope.Search();
                        }

                        $scope.Search = function () {
                            if ($('input[name="datefilter"]').val().length > 0) {
                                $scope.filterModel.date = $('input[name="datefilter"]').val();
                            }
                            debugger
                            if ($('input[name="datefilterReturn"]').val().length > 0) {
                                $scope.filterModel.Returndate = $('input[name="datefilterReturn"]').val();
                            }
                            if ($scope.filterModel.date != null) {
                                $scope.convertDate();
                            }
                            if ($scope.filterModel.Returndate != null) {
                                $scope.convertDateReturn();
                            }
                            viewModel.SearchReturntote($scope.filterModel).then(
                                function success(res) {
                                    $scope.ResultData = res.data;

                                    deferred.resolve(res);
                                },
                                function error(response) {
                                    deferred.reject(response);
                                });
                            return deferred.promise;
                        }

                        // $scope.$watch('filterModel.isDate', function () {
                        //     debugger
                        //     // $scope.filterModel.isDate = '1';
                        // });

                        $scope.convertDate = function () {

                            if ($scope.filterModel.date != null) {
                                var str = $scope.filterModel.date;

                                var DStart = str.substring(0, 2);
                                var MStart = str.substring(5, 3);
                                var YStart = str.substring(10, 6);

                                $scope.filterModel.truckLoad_Date = YStart.toString() + MStart.toString() + DStart.toString();

                                var DEnd = str.substring(15, 13);
                                var MEnd = str.substring(18, 16);
                                var YEnd = str.substring(25, 19);

                                $scope.filterModel.truckLoad_Date_To = YEnd.toString() + MEnd.toString() + DEnd.toString();
                            }
                        };

                        $scope.convertDateReturn = function () {

                            if ($scope.filterModel.Returndate != null) {
                                var str = $scope.filterModel.Returndate;

                                var DStart = str.substring(0, 2);
                                var MStart = str.substring(5, 3);
                                var YStart = str.substring(10, 6);

                                $scope.filterModel.truckLoad_Date_Return = YStart.toString() + MStart.toString() + DStart.toString();

                                var DEnd = str.substring(15, 13);
                                var MEnd = str.substring(18, 16);
                                var YEnd = str.substring(25, 19);

                                $scope.filterModel.truckLoad_Date_To_Return = YEnd.toString() + MEnd.toString() + DEnd.toString();
                            }
                        };

                        $scope.export = function () {
                            pageLoading.show();
                            var createXLSLFormatObj = [];
                            viewModel.SearchReturntote($scope.filterModel).then(
                                function success(res) {
                                    $scope.ResultData = res.data;

                                    var xlsHeader = ["No.", "Shipment No", "Return Date", "VehicleCompany Name", "Load Date", "Max L", "Max M", "Max Doc", "Return Qty L", "Return Qty M'", "Return DMG Qty L", "Return DMG Qty M", "Return Doc"];

                                    /* XLS Rows Data */
                                    var xlsRows = [];
                                    var number = 1;
                                    debugger
                                    $scope.ResultData.forEach(e => {
                                        xlsRows.push({
                                            "No.": number
                                            , "Shipment No": e.truckLoad_No
                                            , "Return Date": e.truckLoad_Return_Date
                                            , "VehicleCompany Name": e.vehicleCompany_Name
                                            , "Load Date": e.appointment_date
                                            , "Max L": e.return_Tote_MAX_XL
                                            , "Max M": e.return_Tote_MAX_M
                                            , "Max Doc": e.docReturn_Max
                                            , "Return Qty L": e.return_Tote_Qty_XL
                                            , "Return Qty M": e.return_Tote_Qty_M
                                            , "Return DMG Qty L": e.return_Tote_Qty_DMG_XL
                                            , "Return DMG Qty M": e.return_Tote_Qty_DMG_M
                                            , "Return Doc": e.return_Doc

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
                                    JSONToCSVConvertor(createXLSLFormatObj, "History_Tote");

                                    deferred.resolve(res);
                                },
                                function error(response) {
                                    deferred.reject(response);
                                });

                            /* XLS Head Columns */
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

                        $scope.url = {
                            Load: webServiceAPI.Load,
                        };

                        $scope.autoComplete = {
                            TruckloadNo: "AutoLoad/autoTruckloadNo",
                        };

                        var init = function () {
                            $scope.filterModel = {};

                        };

                        init();

                    }
                ],
                link: function ($scope, $element, $attributes) { }
            };
        }
    ]);
}());
