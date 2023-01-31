(function () {
    'use strict'
    app.directive('popUpCancelQty', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/GI/ShortShip/component/popUpCancelQty/popUpCancelQty.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'webServiceAPI', 'ShortShipFactory', 'dpMessageBox',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, shortShipFactory, $timeout, $translate, localStorageService, $interval, webServiceAPI, ShortShipFactory, dpMessageBox) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = ShortShipFactory;
                        $scope.onShow = false;
                        $scope.ResultData = {};
                        $scope.model = {};
                        // $scope.onHide = function (param) {
                        // };
                        $scope.onClose = function () {
                            $scope.onShow = false;

                        };

                        $scope.delegates = function (param) {
                            // param.putaway_Status = null;
                            // $scope.model.product_Id = param.product_Id;
                            // $scope.model.product_Name = param.product_name;
                            // $scope.model.shortQty = param.shortQty;
                            // $scope.model.issueQty = param.issueQty;
                            // $scope.model.rowItemIndex = param.rowItemIndex
                            $scope.model = param;

                            // $scope.SearchTagPutaway(param);
                        }

                        $scope.update = function () {
                            if ($scope.model.shortQty > $scope.model.issueQty) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'ALERT',
                                    message: 'ไม่สามารถยกเลิกได้มากกว่าจำนวนที่หยิบ'
                                })
                                return "";
                            }


                            dpMessageBox.confirm({
                                ok: 'ใช่',
                                cancel: 'ไม่',
                                title: 'ยืนยันข้อมูล ?',
                                message: 'คุณต้องการบันทึกข้อมูลหรือไม่ !'
                            }).then(function () {
                                    viewModel.add($scope.model).then(
                                        function success(res) {
                                            if (res.data.message == true) {
                                                dpMessageBox.alert({
                                                    ok: 'ปิด',
                                                    title: 'บันทึกสำเร็จ',
                                                    message: 'บันทึกรายการสินค้าขาดส่ง สำเร็จ'
                                                })
                                                if ($scope.invokes.update != undefined)
                                                    $scope.invokes.update($scope.model);
                                                $scope.model = {};
                                                $scope.onShow = false;
                                            } else {
                                                dpMessageBox.alert({
                                                    ok: 'Close',
                                                    title: 'ALERT',
                                                    message: 'ไม่สามารถบันทึกข้อมูลได้'
                                                })
                                            }

                                        }
                                    )
                                },
                                function error(param) {

                                });


                        }




                        // $scope.SearchTagPutaway = function (param, Template) {

                        //     var model = param;

                        //     if (Template != undefined) {
                        //         var TemplateInt = parseFloat(Template)
                        //         model.putaway_Status = TemplateInt;
                        //     }
                        //     var deferred = $q.defer();

                        //     goodsReceiveFactory.SearchTagPutaway(model).then(
                        //         function success(res) {
                        //             $scope.ResultData = res.data;

                        //             deferred.resolve(res);
                        //         },
                        //         function error(response) {
                        //             deferred.reject(response);
                        //         });
                        //     return deferred.promise;
                        // }




                        // $scope.export = function () {
                        //     pageLoading.show();
                        //     var createXLSLFormatObj = [];

                        //     /* XLS Head Columns */
                        //     var xlsHeader = ["No.", "Tag No", "Sugesstion Location", "Product Number", "Product", "Status", "Putaway Status", "Wait To store location", "Wait To store Date", "Dock to staging location", "Dock tostaging Date", "Pallet Inspection location", "Pallet Inspection Date", "Location Zone Putaway", "Putaway By", "Status Create"];

                        //     /* XLS Rows Data */
                        //     var xlsRows = [];
                        //     var number = 1;
                        //     $scope.ResultData.forEach(e => {
                        //         xlsRows.push({
                        //             "No.": number
                        //             , "Tag No": e.tag_No
                        //             , "Sugesstion Location": e.location_Name
                        //             , "Product Number": e.product_Id
                        //             , "Product": e.product_Name
                        //             , "Status": e.itemStatus_Name
                        //             , "Putaway Status": e.statusPutaway
                        //             , "Wait To store location": e.waitTostore_location
                        //             , "Wait To store Date": e.waitTostore_date
                        //             , "Dock to staging location": e.docktostaging_location
                        //             , "Dock tostaging Date": e.docktostaging_date
                        //             , "Pallet Inspection location": e.pallet_Inspection_location
                        //             , "Pallet Inspection Date": e.pallet_Inspection_date
                        //             , "Location Zone Putaway": e.putaway_location
                        //             , "Putaway By": e.putaway_By
                        //             , "Status Create": e.putaway_Date

                        //         });
                        //         number++
                        //     });

                        //     var today = new Date();
                        //     var mm = today.getMonth() + 1;
                        //     var yyyy = today.getUTCFullYear();
                        //     var dd = today.getDate();
                        //     var Minute = today.getMinutes();
                        //     var Hour = today.getHours();

                        //     if (Minute < 10) Minute = '0' + Minute;

                        //     if (dd < 10) dd = '0' + dd;
                        //     if (mm < 10) mm = '0' + mm;

                        //     var datetime = yyyy.toString() + mm.toString() + dd.toString() + Hour.toString() + Minute.toString();

                        //     createXLSLFormatObj.push(xlsHeader);
                        //     $.each(xlsRows, function (index, value) {
                        //         var innerRowData = [];
                        //         $.each(value, function (ind, val) {
                        //             innerRowData.push(val);
                        //         });
                        //         createXLSLFormatObj.push(innerRowData);
                        //     });
                        //     pageLoading.hide();
                        //     JSONToCSVConvertor(createXLSLFormatObj, "Putaway");

                        // }

                        // function JSONToCSVConvertor(JSONData, ShowLabel) {
                        //     //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
                        //     var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

                        //     var CSV = '';

                        //     //1st loop is to extract each row
                        //     for (var i = 0; i < arrData.length; i++) {
                        //         var row = "";

                        //         //2nd loop will extract each column and convert it in string comma-seprated
                        //         for (var index in arrData[i]) {
                        //             row += '"' + arrData[i][index] + '",';
                        //         }

                        //         row.slice(0, row.length - 1);

                        //         //add a line break after each row
                        //         CSV += row + '\r\n';
                        //     }

                        //     if (CSV == '') {
                        //         alert("Invalid data");
                        //         return;
                        //     }

                        //     var today = new Date();
                        //     var mm = today.getMonth() + 1;
                        //     var yyyy = today.getUTCFullYear();
                        //     var dd = today.getDate();
                        //     var Minute = today.getMinutes();
                        //     var Hour = today.getHours();

                        //     if (Minute < 10) Minute = '0' + Minute;

                        //     if (dd < 10) dd = '0' + dd;
                        //     if (mm < 10) mm = '0' + mm;

                        //     var datetime = yyyy.toString() + mm.toString() + dd.toString() + Hour.toString() + Minute.toString();
                        //     //Generate a file name
                        //     var fileName = ShowLabel + "_" + datetime;
                        //     //this will remove the blank-spaces from the title and replace it with an underscore

                        //     //Initialize file format you want csv or xls
                        //     var uri = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(CSV);

                        //     // Now the little tricky part.
                        //     // you can use either>> window.open(uri);
                        //     // but this will not work in some browsers
                        //     // or you will not get the correct file extension    

                        //     //this trick will generate a temp <a /> tag
                        //     var link = document.createElement("a");
                        //     link.href = uri;

                        //     //set the visibility hidden so it will not effect on your web-layout
                        //     link.style = "visibility:hidden";
                        //     link.download = fileName + ".csv";

                        //     //this part will append the anchor tag and remove it after automatic click
                        //     document.body.appendChild(link);
                        //     link.click();
                        //     document.body.removeChild(link);
                        // }

                        var init = function () {

                        };

                        init();

                    }
                ],
                link: function ($scope, $element, $attributes) {}
            };
        }
    ]);
}());