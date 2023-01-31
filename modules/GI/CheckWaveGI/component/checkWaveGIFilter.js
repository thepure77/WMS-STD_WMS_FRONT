(function () {
    'use strict';
    app.component('checkWaveGiFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/CheckWaveGI/component/checkWaveGIFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            filterSearch: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, dpMessageBox, commonService, localStorageService, checkWaveGIFactory, webServiceAPI) {
            var $vm = this;
            var viewModel = checkWaveGIFactory;


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
                $scope.filterModel = $vm.filterModel || {};
                $scope.filterModel.PerPage = $vm.filterModel.perPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                $scope.filterModel.date = $('input[name="datefilter"]').val();
                if ($scope.filterModel.date != null && $scope.filterModel.isDate != 1) {
                    $scope.convertDate();
                }
                pageLoading.show();
                if ($scope.filterModel.tap != 3) {
                    viewModel.checkWaveWCS($scope.filterModel).then(function success(res) {
                        pageLoading.hide();
                        debugger
                        if ($vm.searchResultModel == undefined) {
                            $vm.searchResultModel = {};
                        }
                        if ($vm.filterModel.tap == 1) {
                            $vm.searchResultModel.checkWaveWCS_respomodel = res.data.checkWaveWCS_respomodel;
                        } else if ($vm.filterModel.tap == 2) {
                            $vm.searchResultModel.checkWaveWCSmodel = res.data.checkWaveWCSmodel;
                        } else if ($vm.filterModel.tap == 4) {
                            $vm.searchResultModel.checklocation_PPmodel = res.data.checklocation_PPmodel;
                        }

                    }, function error(res) { });
                } else {
                    viewModel.Check_Rollcage_Staging($scope.filterModel).then(function success(res) {
                        pageLoading.hide();
                        if ($vm.filterModel.tap == 3) {
                            $vm.searchResultModel.rollcage_data = res.data;
                        }

                    }, function error(res) { });
                }

            };


            $scope.export = function () {
                pageLoading.show();
                var createXLSLFormatObj = [];
                $scope.ResultData = {};
                $scope.filterModel.tap = 4
                viewModel.checkWaveWCS($scope.filterModel).then(function success(res) {
                    $scope.ResultData = res.data.checklocation_PPmodel;
                    // $scope.ResultData = res.data.checklocation_PPmodel;
                    /* XLS Head Columns */
                    var xlsHeader = ["Pallet Suggestion", "Location ID", "Pallet ID", "Product ID", "Product Name", "QtySaleUnit", "UOM", "ERP Location", "WMS QTYBal", "WMS QtyReserve"];

                    /* XLS Rows Data */
                    var xlsRows = [];
                    var number = 1;
                    $scope.ResultData.forEach(e => {
                        xlsRows.push({
                            // "No": number
                            "Pallet Suggestion": e.palletSuggestion
                            , "Location ID": e.location_ID
                            , "Pallet ID": e.palletID
                            , "Product ID": e.productID
                            , "Product Name": e.product_Name
                            , "QtySaleUnit": e.qtySaleUnit
                            , "UOM": e.uom
                            , "ERP Location": e.erP_Location
                            , "WMS QTYBal": e.wmS_QTYBal
                            , "WMS QtyReserve": e.wmS_QtyReserve

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
                    JSONToCSVConvertor(createXLSLFormatObj, "Partial");
                }, function error(res) { });



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
                var uri = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(CSV);

                var link = document.createElement("a");
                link.href = uri;

                link.style = "visibility:hidden";
                link.download = fileName + ".csv";

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

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


            this.$onInit = function () {
                $scope.filterModel = {};
            };


        }
    });

})();