'use strict'
app.component('importFileMasterTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/ImportFile/importFileMaster/component/importFileMasterTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        invalidResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',
        columnHeader: '=?',
        guId: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, importFileMasterFactory) {
        var $vm = this;
        //var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        var viewModel = importFileMasterFactory;
        $scope.items = [];
        $scope.items = $scope.items || [];
        // setting column
        $scope.showColumnSetting = false;
        $scope.maxSize = 5;

        $vm.triggerCreate = function () {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow().then(function (result) {
                    $vm.isFilter = true;
                    $vm.triggerSearch();
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        };

        $scope.selectedTabTable = function (t) {
            if (t == 1) {
                $scope.colortable1 = "#999999";
                $scope.colortable2 = "#e5e5e5";
            }
            else if (t == 2) {
                $scope.colortable1 = "#e5e5e5";
                $scope.colortable2 = "#999999";
            }
            $scope.selectedTable = t;
        }

        $scope.getColor = function (param, column) {
            for (let index = 0; index < param.length; index++) {
                if (param[index].column.toLowerCase() == column) {
                    return "#DB6147";
                }
            }
        }

        $scope.save = function () {
            if (!$vm.guId) {
                return dpMessageBox.alert(
                    {
                        ok: 'Close',
                        title: 'แจ้งเตือน',
                        message: 'กรุณา Import File'
                    }
                )
            }
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'ยืนยัน',
                message: 'คุณต้องการบันทึกข้อมูลใช่หรือไม่'
            }).then(function () {
                pageLoading.show()
                let route = viewModel.get();
                if (route == "Import_Vendor") {
                    viewModel.confirmVendor({ Import_Index: $vm.guId.guId, Confirm_By: localStorageService.get('userTokenStorage') }).then(
                        function success(res) {
                            pageLoading.hide()
                            dpMessageBox.alert({
                                ok: 'Yes',
                                cancel: 'No',
                                title: 'ยืนยัน',
                                message: res.data
                            });
                            $scope.cancel();
                        },
                        function error(response) {
                            pageLoading.hide()
                            dpMessageBox.alert({
                                ok: 'Yes',
                                cancel: 'No',
                                title: 'Error',
                                message: response.Message
                            });
                        });
                }
                else if (route == "Import_Article") {
                    viewModel.confirmArticle({ Import_Index: $vm.guId.guId, Confirm_By: localStorageService.get('userTokenStorage') }).then(
                        function success(res) {
                            pageLoading.hide()
                            dpMessageBox.alert({
                                ok: 'Yes',
                                cancel: 'No',
                                title: 'ยืนยัน',
                                message: res.data
                            });
                            $scope.cancel();
                        },
                        function error(response) {
                            pageLoading.hide()
                            pageLoading.hide()
                            dpMessageBox.alert({
                                ok: 'Yes',
                                cancel: 'No',
                                title: 'Error',
                                message: response.Message
                            });
                        });
                }
                else if (route == "Import_ArticleConversion") {
                    viewModel.confirmArticleConvertion({ Import_Index: $vm.guId.guId, Confirm_By: localStorageService.get('userTokenStorage') }).then(
                        function success(res) {
                            pageLoading.hide()
                            dpMessageBox.alert({
                                ok: 'Yes',
                                cancel: 'No',
                                title: 'ยืนยัน',
                                message: res.data
                            });
                            $scope.cancel();
                        },
                        function error(response) {
                            pageLoading.hide()
                            pageLoading.hide()
                            dpMessageBox.alert({
                                ok: 'Yes',
                                cancel: 'No',
                                title: 'Error',
                                message: response.Message
                            });
                        });
                }
                else if (route == "Import_ArticleConvertionBarcode") {
                    viewModel.confirmArticleConvertionBarcode({ Import_Index: $vm.guId.guId, Confirm_By: localStorageService.get('userTokenStorage') }).then(
                        function success(res) {
                            pageLoading.hide()
                            dpMessageBox.alert({
                                ok: 'Yes',
                                cancel: 'No',
                                title: 'ยืนยัน',
                                message: res.data
                            });
                            $scope.cancel();
                        },
                        function error(response) {
                            pageLoading.hide()
                            pageLoading.hide()
                            dpMessageBox.alert({
                                ok: 'Yes',
                                cancel: 'No',
                                title: 'Error',
                                message: response.Message
                            });
                        });
                }
            });
        }

        $scope.exportLogOld = function () {
            var createXLSLFormatObj = [];

            /* XLS Head Columns */
            var xlsHeader = ["ลำดับ", "รายการ", "ข้อมูล", "ผลลัพธ์"];

            /* XLS Rows Data */
            var xlsRows = [];
            let chkrow = false;
            $vm.invalidResultModel.forEach(element => {
                element.error.forEach(e => {
                    xlsRows.push({ "ลำดับ": !chkrow ? element.c0 : "", "รายการ": e.header, "ข้อมูล": element[e.column.toLowerCase()], "ผลลัพธ์": e.message });
                    chkrow = true;
                });
                chkrow = false;
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

            createXLSLFormatObj.push(["Log Failed " + $vm.guId.FileName]);
            createXLSLFormatObj.push([dd.toString() + "/" + mm.toString() + "/" + yyyy.toString() + " " + Hour.toString() + ":" + Minute.toString() + "น."]);
            createXLSLFormatObj.push(xlsHeader);
            $.each(xlsRows, function (index, value) {
                var innerRowData = [];
                $.each(value, function (ind, val) {
                    innerRowData.push(val);
                });
                createXLSLFormatObj.push(innerRowData);
            });

            /* File Name */
            var filename = "Log_Failed_" + datetime + ".xls";

            /* Sheet Name */
            var ws_name = "Log_Failed";

            if (typeof console !== 'undefined') console.log(new Date());
            var wb = XLSX.utils.book_new(),
                ws = XLSX.utils.aoa_to_sheet(createXLSLFormatObj);

            /* Add worksheet to workbook */
            XLSX.utils.book_append_sheet(wb, ws, ws_name);

            /* Write workbook and Download */
            if (typeof console !== 'undefined') console.log(new Date());
            XLSX.writeFile(wb, filename);
            if (typeof console !== 'undefined') console.log(new Date());
        }

        $scope.cancel = function () {
            $vm.guId = {};
            $vm.searchResultModel = {};
            $vm.invalidResultModel = {};
        }

        $scope.back = function () {
            let route = viewModel.get();
            viewModel.set(undefined);
            if (route == "Import_Vendor") {
                $state.go('wms.owner');
            }
            else if (route == "Import_Article") {
                $state.go('wms.product');
            }
            else if (route == "Import_ArticleConversion") {
                $state.go('wms.product_conversion');
            }
            else if (route == "Import_ArticleConvertionBarcode") {
                $state.go('wms.product_conversion_barcode');
            }
        }

        var init = function () {
            $scope.selectedTable = 1
            $scope.colortable1 = "#999999";
            $scope.colortable2 = "#e5e5e5";

            $scope.colortab1 = "#97bee7";
            $scope.colortab2 = "#FFFFFF";

            $scope.fronttab1 = "#FFFFFF";
            $scope.fronttab2 = "#97bee7";

            $scope.colortab3 = "#97bee7";
            $scope.colortab4 = "#FFFFFF";

            $scope.fronttab3 = "#FFFFFF";
            $scope.fronttab4 = "#97bee7";
        };
        init();


        $scope.exportLog = function () {

            var createXLSLFormatObj = [];

            /* XLS Head Columns */
            var xlsHeader = ["ลำดับ", "รายการ", "ข้อมูล", "ผลลัพธ์"];

            /* XLS Rows Data */
            var xlsRows = [];
            let chkrow = false;
            $vm.invalidResultModel.forEach(element => {
                element.error.forEach(e => {
                    xlsRows.push({ "ลำดับ": !chkrow ? element.c0 : "", "รายการ": e.header, "ข้อมูล": element[e.column.toLowerCase()], "ผลลัพธ์": e.message });
                    chkrow = true;
                });
                chkrow = false;
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

            createXLSLFormatObj.push(["Log Failed "]);
            createXLSLFormatObj.push([dd.toString() + "/" + mm.toString() + "/" + yyyy.toString() + " " + Hour.toString() + ":" + Minute.toString() + "น."]);
            createXLSLFormatObj.push(xlsHeader);
            $.each(xlsRows, function (index, value) {
                var innerRowData = [];
                $.each(value, function (ind, val) {
                    innerRowData.push(val);
                });
                createXLSLFormatObj.push(innerRowData);
            });

            JSONToCSVConvertor(createXLSLFormatObj);
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
            var fileName = "Log_Failed_" + datetime;
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

        $scope.changePage = function () {
            Progressbar.show()
            $vm.searchResultModel = paginate($vm.filterModel.searchResultModel, $vm.filterModel.perPage, $vm.filterModel.currentPage);
            Progressbar.hide()
        }

        $scope.changeTableSize = function (qty, tab) {
            if (tab == 1) {
                $scope.colortab1 = "#97bee7";
                $scope.colortab2 = "#FFFFFF";

                $scope.fronttab1 = "#FFFFFF";
                $scope.fronttab2 = "#97bee7";
                $vm.filterModel.perPage = qty;
                $vm.filterModel.currentPage = 1;
            } else if (tab == 2) {
                $scope.colortab1 = "#FFFFFF";
                $scope.colortab2 = "#97bee7";

                $scope.fronttab1 = "#97bee7";
                $scope.fronttab2 = "#FFFFFF";
                $vm.filterModel.perPage = qty;
                $vm.filterModel.currentPage = 1;
            }
            $vm.searchResultModel = paginate($vm.filterModel.searchResultModel, qty, 1);
        }

        $scope.changePage2 = function () {
            Progressbar.show()
            $vm.invalidResultModel = paginate($vm.filterModel.invalidResultModel, $vm.filterModel.perPage2, $vm.filterModel.currentPage2);
            Progressbar.hide()
        }

        $scope.changeTableSize2 = function (qty, tab) {
            if (tab == 1) {
                $scope.colortab3 = "#97bee7";
                $scope.colortab4 = "#FFFFFF";

                $scope.fronttab3 = "#FFFFFF";
                $scope.fronttab4 = "#97bee7";
                $vm.filterModel.perPage2 = qty;
                $vm.filterModel.currentPage2 = 1;
            } else if (tab == 2) {
                $scope.colortab3 = "#FFFFFF";
                $scope.colortab4 = "#97bee7";

                $scope.fronttab3 = "#97bee7";
                $scope.fronttab4 = "#FFFFFF";
                $vm.filterModel.perPage2 = qty;
                $vm.filterModel.currentPage2 = 1;
            }
            $vm.invalidResultModel = paginate($vm.filterModel.invalidResultModel, qty, 1);
        }

        function paginate(array, page_size, page_number) {
            // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
            return array.slice((page_number - 1) * page_size, page_number * page_size);
        }

    }
});